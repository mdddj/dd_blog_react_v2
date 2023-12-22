import React, {RefObject, useImperativeHandle, useState} from "react";
import {useMount} from "react-use";
import PagerNextLoad from "./pager_next_load";
import BaseBlogCardStyle2 from "./blog/base_blog_card_style2";
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

    useMount(() => load(page))

    useImperativeHandle(refd, () => {
        return {
            onRefresh: refresh
        }
    })

    const load = (p: number) => {
        api(p).then(value => {
            let bs = blogs;
            if (p === 1) bs = []
            let b = value.data?.list ?? []
            setBlogs([...bs, ...b])
            setPager(value.data?.page)
            setPage(p)
            if(value.data?.page){
            }

        });
    }

    const refresh = () => {
        setPage(1)
        setPager(undefined)
        setBlogs([])
        load(1)
    }




    const nextPage = () => {
        let nt = page + 1;
        load(nt)
    }

    return <div className={'flex flex-col gap-5'}>

        {
            blogs.map(value => {
                return <BaseBlogCardStyle2 blog={value} key={value.id}/>
            })
        }


        {
            pager && <PagerNextLoad pager={pager} onload={nextPage} loading/>
        }
    </div>
}

export default BlogListLoad