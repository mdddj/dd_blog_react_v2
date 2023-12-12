import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useNavigate, useParams} from "react-router-dom";
import {useMount} from "react-use";
import DocLayout from "../../components/doc_layout";
import {BlogPreviewLight} from "../../components/blog_content_light";
import MyBox from "../../components/box/my_box";
import CreateNewDocArticle from "./components/create_new";
import {useSetRecoilState} from "recoil";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {
    ResourceTreeModel,
    TreeFolders,
} from "dd_server_api_web/dist/model/ResourceTreeModel";
import {ResourceModel} from "dd_server_api_web/dist/model/ResourceModel";
import {
    Result,
    successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import {UserWidget} from "../../components/user_widget";
import {formatDateUtil} from "../../utils/DateUtil";
import {
    Button,
    Card,
    CardBody, CardHeader,
    Chip,
    Input,
    Modal,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner
} from "@nextui-org/react";
import Box from "../../components/box/box";

//文档详情页面
const DocDetailPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [treeData, setTreedata] = useState<ResourceTreeModel>();
    const [selectDoc, setSelectDoc] = useState<ResourceModel>();

    //选中的文件夹
    const [currentSelectFolderObject, setCurrentSelectFolderObject] = useState<
        TreeFolders | undefined
    >();
    const {id} = useParams<{ id: string | undefined }>();

    const nav = useNavigate();

    //加载文档的目录和文章节点
    const getDocTreeData = async () => {
        setLoading(true);
        let result: Result<ResourceTreeModel> =
            await blogApi().getResourceSubObject(parseInt(id!!));
        setLoading(false);
        successResultHandle(result, (data) => {
            setTreedata(data);
        });
    };

    //页面挂载
    useMount(async () => {
        if (id) {
            await getDocTreeData();
        }
    });

    if (!id) {
        return <>缺少参数</>;
    }

    //选中某个文档
    const onSelect = (res?: ResourceModel) => {
        setSelectDoc(res);
    };

    //文件夹类型选中
    const onFolderSelect = (f?: TreeFolders) => {
        if (f) {
            if (currentSelectFolderObject) {
                if (f.id === currentSelectFolderObject.id) {
                    setCurrentSelectFolderObject(undefined);
                } else {
                    setCurrentSelectFolderObject(f);
                }
            } else {
                setCurrentSelectFolderObject(f);
            }
        } else {
            setCurrentSelectFolderObject(undefined);
        }
    };

    const onCreateSuccess = () => {
        getDocTreeData(); //刷新文档数据
    };

    return (
        <div className={'p-5'}>
            {loading && <Spinner/>}
            {treeData && (
                <DocLayout
                    sidenav={
                        <DocSidenav
                            treeData={treeData}
                            onSelect={onSelect}
                            onFolderSelect={onFolderSelect}
                            currentFolder={currentSelectFolderObject}
                            id={id}
                        />
                    }
                >
                    {currentSelectFolderObject && (
                        <CreateNewDocArticle
                            currentFolder={currentSelectFolderObject}
                            onCreateSuccess={onCreateSuccess}
                        />
                    )}
                    <Box/>
                    {selectDoc && (
                        <div >{selectDoc.title}</div>
                    )}

                    {
                        selectDoc?.label && <div className={'columns-1'}>
                            {
                                selectDoc.label.split(",").map(value => <Chip key={value}>{value}</Chip>)
                            }
                        </div>
                    }

                    <div>
                        {selectDoc && (
                            <div className={'overflow-x-scroll'}>
                                <BlogPreviewLight content={selectDoc.content}/>
                                {selectDoc.updateDate && <div>[最后更新时间:{formatDateUtil(selectDoc.updateDate)}]</div>}
                                <UserWidget>
                                    <div
                                    >
                                        <Button
                                            onClick={() => {
                                                nav("/r/u?updateId=" + selectDoc.id);
                                            }}
                                        >
                                            编辑
                                        </Button>
                                    </div>
                                </UserWidget>
                            </div>
                        )}
                        {!selectDoc && (
                            <Box
                            >
                                提示:左侧选择文章即可预览内容
                            </Box>
                        )}
                    </div>
                </DocLayout>
            )}
        </div>
    );
};

type DocSidenavParams = {
    treeData: ResourceTreeModel;
    onSelect: (res?: ResourceModel) => void;
    onFolderSelect: (f?: TreeFolders) => void;
    currentFolder: TreeFolders | undefined;
    id: string;
};
// 文档导航区域
const DocSidenav: React.FC<DocSidenavParams> = ({
                                                    treeData,
                                                    onSelect,
                                                    onFolderSelect,
                                                    currentFolder,
                                                    id,
                                                }) => {
    const root = treeData.folders;

    const [show, setShow] = useState(false);


    return (
        <>
            <UserWidget>
                <Button
                    onClick={() => {
                        setShow(true);
                    }}
                >
                    新建子文件夹
                </Button>
            </UserWidget>
            <Card>
                <CardBody>
                    <CardHeader>
                        <span>文档目录</span>
                    </CardHeader>
                    <TreeFolderLayout
                        folder={[root]}
                        onSelect={onSelect}
                        onFolderSelect={onFolderSelect}
                        currentFolder={currentFolder}
                        isSub={false}
                        level={1}
                    />
                </CardBody>
            </Card>
            <CreateNewFolder
                show={show}
                onClose={() => {
                    setShow(false);
                }}
                currentFolder={currentFolder}
                id={id}
            />
        </>
    );
};

type CreateNewFolderParams = {
    show: boolean;
    onClose: () => void;
    currentFolder: TreeFolders | undefined;
    id: string;
};
///创建新的文件夹
const CreateNewFolder: React.FC<CreateNewFolderParams> = ({
                                                              show,
                                                              onClose,
                                                              currentFolder,
                                                              id,
                                                          }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const setMsg = useSetRecoilState(successMessageProvider);

    ///提交数据
    const submit = async () => {
        const result = await blogApi().createOrUpdateDocDirectory({
            name: title,
            parentNodeId: currentFolder?.id ?? 0,
            description: desc,
        } as any);
        successResultHandle(
            result,
            (_) => {
                onClose();
                setMsg(result.message);
            },
            (message) => {
                setMsg(message);
            }
        );
    };

    return (
        <>
            <Modal isOpen={show} onClose={onClose}>
                <ModalHeader>新建文件夹</ModalHeader>
                <ModalContent>
                    <Box>
                        {currentFolder && <span>父文件夹:{currentFolder.title}</span>}
                    </Box>
                    <Input
                        fullWidth
                        id="name"
                        type="name"
                        placeholder="文件夹名字"
                        value={title}
                        onChange={(e: any) => setTitle(e.target.value)}
                    />
                    <Input
                        fullWidth
                        value={desc}
                        onChange={(e: any) => setDesc(e.target.value)}
                        placeholder="介绍/备注"
                    />
                    <ModalFooter>
                        <Button onClick={onClose}>关闭</Button>
                        <Button onClick={submit}>确认</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

type TreeFolderLayoutProp = {
    folder: TreeFolders[];
    onSelect: (res?: ResourceModel) => void;
    onFolderSelect: (f?: TreeFolders) => void;
    currentFolder: TreeFolders | undefined;
    isSub: boolean;
    level: number;
};

// 递归子文件夹
const TreeFolderLayout: React.FC<TreeFolderLayoutProp> = ({
                                                              folder,
                                                              onSelect,
                                                              onFolderSelect,
                                                              currentFolder,
                                                              isSub,
                                                              level,
                                                          }) => {
    return (
        <div>
                {folder.map((value) => {
                    return (
                        <div key={value.id}>
                            <TreeFoldersLayoutItem
                                value={value}
                                folder={folder}
                                onSelect={onSelect}
                                onFolderSelect={onFolderSelect}
                                currentFolder={currentFolder}
                                isSub={isSub}
                                level={level}
                            />
                        </div>
                    );
                })}
        </div>
    );
};

type TreeFolderLayoutPropItem = {
    folder: TreeFolders[];
    onSelect: (res?: ResourceModel) => void;
    onFolderSelect: (f?: TreeFolders) => void;
    currentFolder: TreeFolders | undefined;
    isSub: boolean;
    level: number;
    value: TreeFolders;
};

const TreeFoldersLayoutItem: React.FC<TreeFolderLayoutPropItem> = ({
                                                                       onSelect,
                                                                       onFolderSelect,
                                                                       currentFolder,
                                                                       isSub,
                                                                       level,
                                                                       value,
                                                                   }) => {
    const [collapseIn, setCollapseIn] = useState(false);

    const isSelect = currentFolder && currentFolder.id === value.id;

    const hasChildren =
        value.children?.length !== 0 || value.resources.length !== 0;

    return (
        <>
            <div
                // sx={isSub ? {pl: 2 * level} : undefined}
                // selected={isSelect}
                onClick={() => {
                    onFolderSelect(value);
                    setCollapseIn(!collapseIn);
                    onSelect(undefined);
                }}
            >
                <span>
                    文件夹
                </span>
                <span>{value.title}</span>
                {hasChildren && <>{collapseIn ? <span>展开</span> : <span>收起</span>}</>}
            </div>
            <div>
                {/*文件夹*/}
                {value.children && value.children.length !== 0 && (
                    <TreeFolderLayout
                        currentFolder={currentFolder}
                        folder={value.children}
                        onSelect={onSelect}
                        onFolderSelect={onFolderSelect}
                        isSub={true}
                        level={level + 1}
                    />
                )}
                {/*文章*/}
                {value.resources.map((value) => {
                    return (
                        <div
                            key={value.id}
                            // sx={isSub ? {pl: (2 + 1) * level} : undefined}
                            onClick={() => {
                                onSelect(value);
                                onFolderSelect(undefined);
                            }}
                        >
                            <span>
                                文章
                            </span>
                            <span>{value.title}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default DocDetailPage;
