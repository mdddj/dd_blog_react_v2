import React, {RefObject, useImperativeHandle, useState} from "react";
import {useMount} from "react-use";
import PagerNextLoad from "./pager_next_load";
import BaseBlogCardStyle2 from "./blog/base_blog_card_style2";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";
import MyBox from "./box/my_box";
import { BlogData } from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import { Result, Page, PagerModel } from "dd_server_api_web/dist/utils/ResultUtil";

type Props = {
    api: (page: number) => Promise<Result<Page<BlogData>>>
    refd?: RefObject<any>
}


//
const BlogListLoad: React.FC<Props> = ({api, refd}) => {


    const [page, setPage] = useState(1)
    const [blogs, setBlogs] = useState<BlogData[]>([])
    const [pager, setPager] = useState<PagerModel>()
    const appLoadingSet=  useSetRecoilState(appLoading)

    useMount(() => load(page))

    useImperativeHandle(refd, () => {
        return {
            onRefresh: refresh
        }
    })

    const load = (p: number) => {
        if(p===1){
            appLoadingSet(true)
        }
        api(p).then(value => {
            let bs = blogs;
            if (p === 1) bs = []
            let b = value.data?.list ?? []
            setBlogs([...bs, ...b])
            setPager(value.data?.page)
            setPage(p)
            appLoadingSet(false)
            if(value.data?.page){
            }

        });
    }

    const refresh = () => {
        setPage(1)
        setPager(undefined)
        setBlogs([])
        appLoadingSet(true)
        load(1)
    }




    const nextPage = () => {
        let nt = page + 1;
        load(nt)
    }

    return <MyBox>

        {
            blogs.map(value => {
                return <BaseBlogCardStyle2 blog={value} key={value.id}/>
            })
        }


        {
            pager && <PagerNextLoad pager={pager} onload={nextPage} loading/>
        }
    </MyBox>
}

export default BlogListLoad