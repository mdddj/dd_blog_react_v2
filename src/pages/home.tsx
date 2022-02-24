import React, { useState } from "react";
import { useMount } from "react-use";
import { blogApi } from "../utils/request";
import { BlogData } from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import LargeBlogCard from "../components/blog/large_blog_card";
import TwoColumnBlogCard from "../components/blog/two_column_card";
import { AboutMeCard, ArchiveCard } from "../components/about_me";
import BaseBlogCardStyle2 from "../components/blog/base_blog_card_style2";
import { PagerModel } from "dd_server_api_web/apis/utils/ResultUtil";
import PagerNextLoad from "../components/pager_next_load";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";

//首页
const Home: React.FC = () => {


    const [blogs, setBlogs] = useState<BlogData[]>([])
    const [page, setPage] = useState<number>(1)
    const [nextPageLoading, setNextPageLoading] = useState<boolean>(false)
    const [pager, setPager] = useState<PagerModel>()
    const setAppLoading = useSetRecoilState(appLoading)

    //组件挂载
    useMount(() => {
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
        if(page===1){
            setAppLoading(true)
        }
        blogApi().getBlogList(page, 20).then(value => {
            if(page===1){
                setAppLoading(false)
            }
            let resultList = value.data?.list ?? []
            setBlogs([...blogs, ...resultList])
            setNextPageLoading(false)
            setPager(value.data?.page)
        })
    }


    const getBaseBlogs = blogs.filter((value, index) => {
        return index >= 3;
    });



    return <>
        {blogs.length > 1 && <LargeBlogCard blog={blogs[0]} />}
        {blogs.length > 3 && <div className={'row mb-2'}>
            <TwoColumnBlogCard blog={blogs[1]} />
            <TwoColumnBlogCard blog={blogs[2]} />
        </div>}
        <div className={'row g-5'}>
            <div className={'col-md-8'}>
                {
                    blogs.length >= 3 && getBaseBlogs.map(value => <BaseBlogCardStyle2 blog={value} key={value.id} />)
                }
                {
                    pager && <PagerNextLoad pager={pager} onload={getNextPage} loading={nextPageLoading} />
                }
            </div>
            <div className={'col-md-4'}>
                <div className={'position-sticky'} style={{ top: '2rem' }}>
                    <AboutMeCard />
                    <ArchiveCard />
                </div>
            </div>
        </div>
    </>
}

export default Home