import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../utils/request";
import {BlogData} from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import LargeBlogCard from "../components/blog/large_blog_card";
import TwoColumnBlogCard from "../components/blog/two_column_card";
import BaseBlogCard from "../components/blog/base_blog_card";
import {Button} from "@chakra-ui/react";

//首页
const Home: React.FC = () => {


    const [blogs,setBlogs] = useState<BlogData[]>([])
    const [page,setPage] = useState<number>(1)
    const [nextPageLoading,setNextPageLoading] = useState<boolean>(false)

    //组件挂载
    useMount(()=>{
        fetchBlogData(1)
    })



    ///获取下一页博客数据
    const getNextPage = () => {
        let nextPage = page + 1;
        setNextPageLoading(true)
        fetchBlogData(nextPage)
        setPage(nextPage)
    }


    /// 加载博客数据并进行UI更新
    const fetchBlogData = (page: number) => {
        blogApi().getBlogList(page,5).then(value => {
            let resultList = value.data?.list??[]
            setBlogs([...blogs,...resultList])
            setNextPageLoading(false)
        })
    }


    const getBaseBlogs  = blogs.filter((value, index) => {
        return index >= 3;
    });



    return <>
        {blogs.length>1 && <LargeBlogCard blog={blogs[0]} />}
        {blogs.length>3 && <div className={'row mb-2'}>
            <TwoColumnBlogCard blog={blogs[1]} />
            <TwoColumnBlogCard blog={blogs[2]} />
        </div>}
        {
            blogs.length>=3 && getBaseBlogs.map(value => <BaseBlogCard blog={value} key={value.id}/>)
        }
    {/*    加载下一页  */}
        {
          blogs.length !== 0 &&  <Button
                isLoading={nextPageLoading}
                loadingText='加载中'
                colorScheme='teal'
                variant='outline'
                onClick={getNextPage}
            >
                加载下一页
            </Button>
        }
    </>
}

export default Home