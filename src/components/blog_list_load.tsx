import React, {RefObject, useImperativeHandle, useState} from "react";
import {Page, PagerModel, Result} from "dd_server_api_web/src/utils/ResultUtil";
import {BlogData} from "dd_server_api_web/src/model/result/BlogPushNewResultData";
import {Spinner, useBoolean, useToast} from "@chakra-ui/react";
import {useMount} from "react-use";
import PagerNextLoad from "./pager_next_load";
import BaseBlogCardStyle2 from "./blog/base_blog_card_style2";

type Props = {
    api: (page: number) => Promise<Result<Page<BlogData>>>
    refd?: RefObject<any>
}


const BlogListLoad: React.FC<Props> = ({api, refd}) => {


    const [page, setPage] = useState(1)
    const [loading, setLoading] = useBoolean()
    const [initLoading,setInitLoading] = useBoolean()
    const [blogs, setBlogs] = useState<BlogData[]>([])
    const [pager, setPager] = useState<PagerModel>()
    const toast = useToast()

    useMount(() => load(page))

    useImperativeHandle(refd, () => {
        return {
            onRefresh: refresh
        }
    })

    const load = (p: number) => {
        setLoading.on()
        api(p).then(value => {
            let bs = blogs;
            if (p === 1) bs = []
            setLoading.off()
            let b = value.data?.list ?? []
            setBlogs([...bs, ...b])
            setPager(value.data?.page)
            setPage(p)
            setInitLoading.off()
            if(value.data?.page){
                showSuccessMsg('找到'+value.data?.page.total+'篇文章.')
            }

        });
    }

    const refresh = () => {
        setPage(1)
        setLoading.on()
        setPager(undefined)
        setBlogs([])
        setInitLoading.on();
        load(1)
    }

    const showSuccessMsg = (msg: string) => {
        toast.closeAll()
        toast({
            title: '查询成功.',
            description: msg,
            status: 'success',
            duration: 2000,
            isClosable: true,
        })
    }



    const nextPage = () => {
        let nt = page + 1;
        load(nt)
    }

    return <>


        {
            initLoading && <Spinner />
        }

        {
            blogs.map(value => {
                return <BaseBlogCardStyle2 blog={value} key={value.id}/>
            })
        }


        {
            pager && <PagerNextLoad pager={pager} onload={nextPage} loading={loading}/>
        }
    </>
}

export default BlogListLoad