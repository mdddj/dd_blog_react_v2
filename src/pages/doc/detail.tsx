import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useParams} from "react-router-dom";
import {useMount} from "react-use";
import DocLayout from "../../components/doc_layout";
import {BlogPreviewLight} from "../../components/blog_content_light";
import MyBox from "../../components/box/my_box";
import CreateNewDocArticle from "./components/create_new";
import {useSetRecoilState} from "recoil";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import { ResourceTreeModel, TreeFolders } from "dd_server_api_web/dist/model/ResourceTreeModel";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";

//文档详情页面
const DocDetailPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [treeData, setTreedata] = useState<ResourceTreeModel>()
    const [selectDoc, setSelectDoc] = useState<ResourceModel>()

    //选中的文件夹
    const [currentSelectFolderObject, setCurrentSelectFolderObject] = useState<TreeFolders | undefined>()
    const {id} = useParams<{ id: string | undefined }>()

    //加载文档的目录和文章节点
    const getDocTreeData = async () => {
        setLoading(true)
        let result:Result<ResourceTreeModel> = await blogApi().getResourceSubObject(parseInt(id!!))
        setLoading(false)
        successResultHandle(result, data => {
            setTreedata(data)
        })
    }

    //页面挂载
    useMount(async () => {
        if (id) {
            await getDocTreeData();
        }
    })

    if (!id) {
        return <>缺少参数</>
    }

    //选中某个文档
    const onSelect = (res: ResourceModel) => {
        console.log(res)
        setSelectDoc(res)
    }

    //文件夹类型选中
    const onFolderSelect = (f: TreeFolders) => {
        if (currentSelectFolderObject) {
            if (f.id === currentSelectFolderObject.id) {
                setCurrentSelectFolderObject(undefined)
            } else {
                setCurrentSelectFolderObject(f)
            }

        } else {
            setCurrentSelectFolderObject(f)
        }
    }

    console.log(selectDoc)
    return <Box>
        {loading && <CircularProgress/>}
        {treeData && <DocLayout
            sidenav={<DocSidenav treeData={treeData} onSelect={onSelect} onFolderSelect={onFolderSelect}
                                 currentFolder={currentSelectFolderObject} id={id}/>}>
            {selectDoc && <Typography>{selectDoc.title}</Typography>}
            <CreateNewDocArticle currentFolder={currentSelectFolderObject}/>
            <Box height={2}/>
            <MyBox>
                {selectDoc && <BlogPreviewLight content={selectDoc.content}/>}
            </MyBox>
        </DocLayout>}
    </Box>
}

type DocSidenavParams = {
    treeData: ResourceTreeModel,
    onSelect: (res: ResourceModel) => void,
    onFolderSelect: (f: TreeFolders) => void,
    currentFolder: TreeFolders | undefined,
    id: string
}
// 文档导航区域
const DocSidenav: React.FC<DocSidenavParams> = ({
                                                    treeData,
                                                    onSelect,
                                                    onFolderSelect,
                                                    currentFolder, id
                                                }) => {
    const root = treeData.folders
    return <Box>
        <Button>新建子文件夹</Button>
        <TreeFolderLayout folder={[root]} onSelect={onSelect} onFolderSelect={onFolderSelect}
                          currentFolder={currentFolder}/>
        <CreateNewFolder show={false} onClose={()=>{}} currentFolder={currentFolder} id={id}/>
    </Box>
}


type  CreateNewFolderParams = {
    show: boolean,
    onClose: () => void,
    currentFolder: TreeFolders | undefined,
    id: string
}
///创建新的文件夹
const CreateNewFolder: React.FC<CreateNewFolderParams> = ({
                                                              show,
                                                              onClose,
                                                              currentFolder,
                                                              id
                                                          }) => {


    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")

    const setMsg = useSetRecoilState(successMessageProvider)

    ///提交数据
    const submit = async () => {

        const result = await blogApi().createOrUpdateDocDirectory({
            name: title,
            parentNodeId: currentFolder?.id ?? 0,
            description: desc
        } as any);
        successResultHandle(result, _ => {
            onClose()
            setMsg(result.message)
        }, message => {
            setMsg(message)
        })

    }


    return <Box>
        <Dialog open={show} onClose={onClose}>
            <DialogTitle>新建归档</DialogTitle>
            <DialogContent>
                    <Box mt={3} mb={3}>
                        {currentFolder && <span>父文件夹:{currentFolder.title}</span>}
                    </Box>
                <TextField id='name' type='name' value={title} onChange={e => setTitle(e.target.value)}/>
                <TextField multiline={true}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder='介绍/备注'
                />
                <DialogActions>
                    <Button onClick={onClose}>关闭</Button>
                    <Button onClick={submit}>确认</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </Box>
}


// 递归子文件夹
const TreeFolderLayout: React.FC<{ folder: TreeFolders[], onSelect: (res: ResourceModel) => void, onFolderSelect: (f: TreeFolders) => void, currentFolder: TreeFolders | undefined }> = ({
                                                                                                                                                                                             folder,
                                                                                                                                                                                             onSelect,
                                                                                                                                                                                             onFolderSelect,
                                                                                                                                                                                             currentFolder
                                                                                                                                                                                         }) => {
    return <Box>
        {folder.map(value => {
            console.log(value)
            return <Box key={value.id}>
                <Box color={currentFolder && currentFolder.id === value.id ? 'blue' : 'black'}>
                    <div onClick={() => onFolderSelect(value)}> {value.title}</div>
                </Box>
                {/*文件夹*/}
                <Box ml={4}>
                    {value.children && value.children.length !== 0 &&
                        <TreeFolderLayout currentFolder={currentFolder} folder={value.children} onSelect={onSelect}
                                          onFolderSelect={onFolderSelect}/>}
                </Box>
                {/*文章*/}
                <Box ml={4}>
                    {value.resources.map(value => {
                        return <div key={value.id} onClick={() => {
                            onSelect(value)
                        }}>
                            {value.title}
                        </div>
                    })}
                </Box>
            </Box>
        })}
    </Box>
}
export default DocDetailPage