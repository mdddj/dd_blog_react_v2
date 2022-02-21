import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {BlogData} from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import {Avatar, Fade, Spinner, Tag, TagLabel} from "@chakra-ui/react";
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
      <div className="p-4 p-md-5 mb-4 text-white rounded bg-dark">
        <div className="px-0"><h1 className="display-4">{blog?.title}</h1>
          <p className="lead my-3">{blog?.dateString}</p>
          <p>
            <Tag size='lg' colorScheme='gray' borderRadius='full'>
              <Avatar
                  src={blog?.category.logo}
                  size='xs'
                  ml={-1}
                  mr={2}
              />
              <TagLabel>{blog?.category.name}</TagLabel>
            </Tag>
          </p>
        </div>
      </div>
      {blog &&  <BlogPreview content={blog!.content}/> }
    </Fade>
  </>
}
export default BlogPage