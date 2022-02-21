import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {BlogData} from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import {Fade, Spinner} from "@chakra-ui/react";
import {BlogPreview} from "../components/blog_content";

//博客详情页面
const BlogPage: React.FC = () => {


  let {id} = useParams<{id: string}>()
  const [loading,setLoading] = useState(false)
  const [blog,setBlog] = useState<BlogData>()

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
    {loading && <Spinner />}
    <Fade in={blog!==undefined}>
      {blog &&  <BlogPreview content={blog!.content}/> }
    </Fade>
  </>
}
export default BlogPage