import React, { useState } from "react";
import { useMount } from "react-use";
import { blogApi } from "../utils/request";
import { BlogData } from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import {AboutMeCard, ArchiveCard, CategoryCard} from "../components/about_me";
import BaseBlogCardStyle2 from "../components/blog/base_blog_card_style2";
import { PagerModel } from "dd_server_api_web/apis/utils/ResultUtil";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";
import {Grid, GridItem} from "@chakra-ui/react";
import PagerNextLoad from "../components/pager_next_load";

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

    return <>

        <Grid gap={4} templateColumns='repeat(6, 1fr)'>
            <GridItem colSpan={4} >
                {
                    blogs.map(value => <BaseBlogCardStyle2 blog={value} key={value.id} />)
                }
                {
                    pager && <PagerNextLoad pager={pager} onload={getNextPage} loading={nextPageLoading} />
                }
            </GridItem>
            <GridItem colSpan={2} rowSpan={2} >
                <AboutMeCard />
                <ArchiveCard />
                <CategoryCard/>
            </GridItem>
        </Grid>

    </>
}

export default Home