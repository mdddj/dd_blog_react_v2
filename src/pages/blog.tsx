import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {BlogData} from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import {Avatar, Box, Fade, Tag, TagLabel} from "@chakra-ui/react";
import {BlogPreview} from "../components/blog_content";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";
import PageHeader from "../components/page_header";

//博客详情页面
const BlogPage: React.FC = () => {


  let {id} = useParams<{id: string}>()
  const [blog,setBlog] = useState<BlogData>()
  const setLoading = useSetRecoilState(appLoading)

  useMount(()=>getBlogDetail())

 
  const getBlogDetail = () => {
    setLoading(true)
    id && blogApi().getBlogDetailById(parseInt(id)).then(r => {
      console.log(r)
      setLoading(false)
      setBlog(r.data)
    })
  }

  return <>
    <Fade in={blog!==undefined}>
      <Box mb={4} mt={4}>
        <PageHeader title={blog?.title??''} />
        <div style={{textAlign: 'center'}}>
          <Box alignContent={'center'} pb={5}>
            <Box>{blog?.dateString}</Box>
            <Tag size='lg' colorScheme='gray' borderRadius='full'>
              <Avatar
                  src={blog?.category.logo}
                  size='xs'
                  ml={-1}
                  mr={2}
              />
              <TagLabel>{blog?.category.name}</TagLabel>
            </Tag>
          </Box>
        </div>
      </Box>
      {blog &&  <BlogPreview content={blog!.content}/> }
    </Fade>
  </>
}
export default BlogPage
