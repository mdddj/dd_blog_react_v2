import React, { useState } from "react";
import { blogApi } from "../../utils/request";
import { useNavigate, useParams } from "react-router-dom";
import { useMount } from "react-use";
import DocLayout from "../../components/doc_layout";
import { BlogPreviewLight } from "../../components/blog_content_light";
import MyBox from "../../components/box/my_box";
import CreateNewDocArticle from "./components/create_new";
import { useSetRecoilState } from "recoil";
import FolderIcon from "@mui/icons-material/Folder";
import { successMessageProvider } from "../../providers/modal/success_modal";
import {
  Box,
  Button, Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText, Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ResourceTreeModel,
  TreeFolders,
} from "dd_server_api_web/dist/model/ResourceTreeModel";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import {
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ArticleIcon from "@mui/icons-material/Article";
import { UserWidget } from "../../components/user_widget";
import { grey } from "@mui/material/colors";
import {formatDateUtil} from "../../utils/DateUtil";

//文档详情页面
const DocDetailPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreedata] = useState<ResourceTreeModel>();
  const [selectDoc, setSelectDoc] = useState<ResourceModel>();

  //选中的文件夹
  const [currentSelectFolderObject, setCurrentSelectFolderObject] = useState<
    TreeFolders | undefined
  >();
  const { id } = useParams<{ id: string | undefined }>();

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
    <>
      {loading && <CircularProgress />}
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
          <Box height={2} />
          {selectDoc && (
            <Typography variant={"h2"} sx={{mb:2}} fontWeight={'bold'}>{selectDoc.title}</Typography>
          )}

          {
            selectDoc?.label && <Stack direction={'row'} sx={{mt:1,mb: 3}}>
                {
                  selectDoc.label.split(",").map(value => <Chip label={value} key={value}/>)
                }
              </Stack>
          }

          <MyBox>
            {selectDoc && (
              <Box
                sx={{
                  position: "relative",
                }}
              >
                <BlogPreviewLight content={selectDoc.content} />
                {selectDoc.updateDate && <Typography sx={{mt:2}} variant={'body2'} color={'grey'}>[最后更新时间:{formatDateUtil(selectDoc.updateDate)}]</Typography>}
                <UserWidget>
                  <Box
                    sx={{
                      position: "absolute",
                      right: 2,
                      top: 2,
                    }}
                  >
                    <Button
                      onClick={() => {
                        nav("/r/u?updateId=" + selectDoc.id);
                      }}
                    >
                      编辑
                    </Button>
                  </Box>
                </UserWidget>
              </Box>
            )}
            {!selectDoc && (
              <Box
                sx={{
                  p: 5,
                  textAlign: "center",
                  color: grey[400],
                }}
              >
                提示:左侧选择文章即可预览内容
              </Box>
            )}
          </MyBox>
        </DocLayout>
      )}
    </>
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
      <TreeFolderLayout
        folder={[root]}
        onSelect={onSelect}
        onFolderSelect={onFolderSelect}
        currentFolder={currentFolder}
        isSub={false}
        level={1}
      />
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
      <Dialog open={show} onClose={onClose}>
        <DialogTitle>新建文件夹</DialogTitle>
        <DialogContent>
          <Box mt={3} mb={3}>
            {currentFolder && <span>父文件夹:{currentFolder.title}</span>}
          </Box>
          <TextField
            margin={"dense"}
            fullWidth
            id="name"
            type="name"
            placeholder="文件夹名字"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin={"dense"}
            multiline={true}
            value={desc}
            onChange={(e: any) => setDesc(e.target.value)}
            placeholder="介绍/备注"
          />
          <DialogActions>
            <Button onClick={onClose}>关闭</Button>
            <Button onClick={submit}>确认</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
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
    <List
      sx={
        isSub
          ? undefined
          : { width: "100%", maxWidth: 360, bgcolor: "background.paper" }
      }
      component={isSub ? "div" : "nav"}
      aria-labelledby={isSub ? undefined : "nested-list-subheader"}
      disablePadding={isSub}
    >
      {folder.map((value) => {
        return (
          <Box key={value.id}>
            <TreeFoldersLayoutItem
              value={value}
              folder={folder}
              onSelect={onSelect}
              onFolderSelect={onFolderSelect}
              currentFolder={currentFolder}
              isSub={isSub}
              level={level}
            />
          </Box>
        );
      })}
    </List>
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
  folder,
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
      <ListItemButton
        sx={isSub ? { pl: 2 * level } : undefined}
        selected={isSelect}
        onClick={() => {
          onFolderSelect(value);
          setCollapseIn(!collapseIn);
          onSelect(undefined);
        }}
      >
        <ListItemAvatar>
          <FolderIcon sx={{color: 'grey'}} />
        </ListItemAvatar>
        <ListItemText>{value.title}</ListItemText>
        {hasChildren && <>{collapseIn ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItemButton>
      <Collapse in={collapseIn} timeout="auto" unmountOnExit>
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
            <ListItemButton
              key={value.id}
              sx={isSub ? { pl: (2 + 1) * level } : undefined}
              onClick={() => {
                onSelect(value);
                onFolderSelect(undefined);
              }}
            >
              <ListItemAvatar>
                <ArticleIcon sx={{color: 'grey'}} />
              </ListItemAvatar>
              <ListItemText>{value.title}</ListItemText>
            </ListItemButton>
          );
        })}
      </Collapse>
    </>
  );
};

export default DocDetailPage;
