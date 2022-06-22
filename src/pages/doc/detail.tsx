import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useParams} from "react-router-dom";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {
  Box,
  Button, FormControl, FormHelperText, FormLabel,
  Heading,
  Icon, Input,
  Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner, Textarea,
  useBoolean
} from "@chakra-ui/react";
import {useMount} from "react-use";
import {ResourceTreeModel, TreeFolders} from "dd_server_api_web/apis/model/ResourceTreeModel";
import DocLayout from "../../components/doc_layout";
import {AiFillFolder, AiOutlineProfile} from "react-icons/ai";
import {ResourceModel} from "dd_server_api_web/apis/model/ResourceModel";
import {BlogPreviewLight} from "../../components/blog_content_light";
import MyBox from "../../components/box/my_box";
import CreateNewDocArticle from "./components/create_new";
import {useSetRecoilState} from "recoil";
import {successMessageProvider} from "../../providers/modal/success_modal";

//文档详情页面
const DocDetailPage: React.FC = () => {

  const [loading,setLoading] = useState<boolean>(false)
  const [treeData,setTreedata] = useState<ResourceTreeModel>()
  const [selectDoc,setSelectDoc] = useState<ResourceModel>()

  //选中的文件夹
  const [currentSelectFolderObject,setCurrentSelectFolderObject] = useState<TreeFolders|undefined>()
  const {id} = useParams<{id: string|undefined}>()

  //加载文档的目录和文章节点
  const getDocTreeData = async () => {
    setLoading(true)
    let result = await blogApi().getResourceSubObject(parseInt(id!!))
    setLoading(false)
    successResultHandle(result,data => {
      setTreedata(data)
    })
  }

  //页面挂载
  useMount(async()=>{
    if(id){
      await getDocTreeData();
    }
  })

  if(!id){
    return <>缺少参数</>
  }

  //选中某个文档
  const onSelect = (res: ResourceModel) => {
    console.log(res)
    setSelectDoc(res)
  }

  //文件夹类型选中
  const onFolderSelect = (f: TreeFolders) => {
    if(currentSelectFolderObject){
      if(f.id === currentSelectFolderObject.id){
        setCurrentSelectFolderObject(undefined)
      }else{
        setCurrentSelectFolderObject(f)
      }

    }else {
      setCurrentSelectFolderObject(f)
    }
  }

  return <Box>
    {loading && <Spinner/>}
    {treeData && <DocLayout sidenav={<DocSidenav treeData={treeData} onSelect={onSelect}  onFolderSelect={onFolderSelect} currentFolder={currentSelectFolderObject}/>} >
      {selectDoc && <Heading>{selectDoc.title}</Heading>}
      <CreateNewDocArticle/>
      <Box height={2}/>
      <MyBox>
        { selectDoc && <BlogPreviewLight content={selectDoc.content} />}
      </MyBox>
    </DocLayout>}
  </Box>
}
// 文档导航区域
const DocSidenav: React.FC<{treeData:ResourceTreeModel,onSelect: (res: ResourceModel)=> void,onFolderSelect: (f: TreeFolders) => void, currentFolder: TreeFolders|undefined }> = ({treeData,onSelect,onFolderSelect,currentFolder}) => {
  const root = treeData.folders
  const [flog,setFlog] = useBoolean()
  return <Box>
    <Button onClick={setFlog.on}>新建子文件夹</Button>
    <TreeFolderLayout folder={[root]} onSelect={onSelect}  onFolderSelect={onFolderSelect}/>
    <CreateNewFolder show={flog} onClose={setFlog.off} currentFolder={currentFolder} />
  </Box>
}


///创建新的文件夹
const CreateNewFolder: React.FC<{show: boolean, onClose: ()=>void, currentFolder: TreeFolders|undefined}> = ({show,onClose,currentFolder}) => {


  const [title,setTitle] = useState("")
  const [desc,setDesc] = useState("")

  const setMsg = useSetRecoilState(successMessageProvider)

  ///提交数据
  const submit =async () => {

    const result = await blogApi().saveOrUpdateResourceCategory({
      name: title,
      parentNode: {id: currentFolder?.id},
      description: desc
    });
    successResultHandle(result,data => {
      setMsg(result.message)
    },message => {
      setMsg(message)
    })

  }


  return <Box>
    <Modal isOpen={show} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>新建归档</ModalHeader>
        <ModalCloseButton />
        <ModalBody>

          <Box mt={3} mb={3}>
            {currentFolder && <span>父文件夹:{currentFolder.title}</span>}
          </Box>

          <FormControl mb={3}>
            <FormLabel htmlFor='name'>输入名称</FormLabel>
            <Input id='name' type='name' value={title} onChange={e=>setTitle(e.target.value)} />
            <FormHelperText>分类名称</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>简要描述</FormLabel>
            <Textarea
                value={desc}
                onChange={e=>setDesc(e.target.value)}
                placeholder='介绍/备注'
                size='sm'
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>关闭</Button>
          <Button colorScheme={'blue'} onClick={submit}>确认</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
}



// 递归子文件夹
const TreeFolderLayout: React.FC<{folder: TreeFolders[],onSelect: (res: ResourceModel)=> void,onFolderSelect: (f: TreeFolders)=>void}> = ({folder,onSelect,onFolderSelect}) => {
  return <Box>
    {folder.map(value => {
        console.log(value)
        return <Box key={value.id}>
          <Box>
            <div onClick={()=>onFolderSelect(value)}><Icon as={AiFillFolder} /> {value.title}</div>
          </Box>
          {/*文件夹*/}
          <Box ml={4}>
              {value.children && value.children.length!==0 && <TreeFolderLayout folder={value.children}  onSelect={onSelect} onFolderSelect={onFolderSelect}/> }
          </Box>
          {/*文章*/}
          <Box ml={4}>
            {value.resources.map(value => {
                return <div key={value.id} onClick={()=>{
                  onSelect(value)
                }}>
                  <Icon as={AiOutlineProfile} /> {value.title}
                </div>
              })}
          </Box>
        </Box>
      })}
  </Box>
}
export default DocDetailPage