import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useParams} from "react-router-dom";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {Box, Heading, Icon, Spinner} from "@chakra-ui/react";
import {useMount} from "react-use";
import {ResourceTreeModel, TreeFolders} from "dd_server_api_web/apis/model/ResourceTreeModel";
import DocLayout from "../../components/doc_layout";
import {AiFillFolder, AiOutlineProfile} from "react-icons/ai";
import {ResourceModel} from "dd_server_api_web/apis/model/ResourceModel";
import {BlogPreviewLight} from "../../components/blog_content_light";
import MyBox from "../../components/box/my_box";

//文档详情页面
const DocDetailPage: React.FC = () => {

  const [loading,setLoading] = useState<boolean>(false)
  const [treeData,setTreedata] = useState<ResourceTreeModel>()
  const [selectDoc,setSelectDoc] = useState<ResourceModel>()
  const {id} = useParams<{id: string|undefined}>()

  //加载文档的目录和文章节点
  const getDocTreeData = async () => {
    setLoading(true)
    let result = await blogApi().getResourceSubObject(parseInt(id!!))
    setLoading(false)
    successResultHandle(result,data => {
      console.log(data)
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


  const onSelect = (res: ResourceModel) => {
    setSelectDoc(res)
  }


  return <>
    {loading && <Spinner/>}


    {treeData && <DocLayout sidenav={<DocSidenav treeData={treeData} onSelect={onSelect} />} >
      {selectDoc && <Heading>{selectDoc.title}</Heading>}
      <Box height={2}/>
      <MyBox>
        { selectDoc && <BlogPreviewLight content={selectDoc.content} />}
      </MyBox>
    </DocLayout>}
  </>
}


// 文档导航区域
const DocSidenav: React.FC<{treeData:ResourceTreeModel,onSelect: (res: ResourceModel)=> void }> = ({treeData,onSelect}) => {

  const root = treeData.folders
  return <>

    <TreeFolderLayout folder={[root]} onSelect={onSelect} />
  </>
}


const TreeFolderLayout: React.FC<{folder: TreeFolders[],onSelect: (res: ResourceModel)=> void}> = ({folder,onSelect}) => {
  return <Box>
    {
      folder.map(value => {
        return <Box key={value.id}>

          <Icon as={AiFillFolder} /> {value.title}

          {/*文件夹*/}
          <Box ml={4}>
              { value.children && value.hasChildren && <TreeFolderLayout folder={value.children}  onSelect={onSelect}/> }
          </Box>


          {/*文章*/}
          <Box ml={4}>
            {
              value.resources.map(value => {
                return <div key={value.id} onClick={()=>{
                  onSelect(value)
                }}>
                  <Icon as={AiOutlineProfile} /> {value.title}
                </div>
              })
            }
          </Box>
        </Box>
      })
    }

  </Box>
}

export default DocDetailPage