import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../utils/request";
import {BlogData} from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import LargeBlogCard from "../components/blog/large_blog_card";

//首页
const Home: React.FC = () => {


    const [blogs,setBlogs] = useState<BlogData[]>([])

    //组件挂载
    useMount(()=>{
        getHomePostList()
    })

    //获取博客列表
    const getHomePostList = () => {
        blogApi().getBlogList(1,5).then(value => {
            let resultList = value.data?.list??[]
            setBlogs([...blogs,...resultList])
        })
    }

    console.log(blogs)




    return <>
        {blogs.length>1 && <LargeBlogCard blog={blogs[0]} />}
    </>
}

export default Home