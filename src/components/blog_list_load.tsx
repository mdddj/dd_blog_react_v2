import React, {useState} from "react";
import {Page, PagerModel, Result} from "dd_server_api_web/src/utils/ResultUtil";
import {BlogData} from "dd_server_api_web/src/model/result/BlogPushNewResultData";
import {useBoolean} from "@chakra-ui/react";
import {useMount} from "react-use";
import PagerNextLoad from "./pager_next_load";
import BaseBlogCardStyle2 from "./blog/base_blog_card_style2";

type Props = {
    api: (page: number) => Promise<Result<Page<BlogData>>>
}


const BlogListLoad:React.FC<Props> = ({api}) => {


    const [page,setPage] = useState(1)
    const [loading,setLoading] = useBoolean()
    const [blogs,setBlogs] = useState<BlogData[]>([])
    const [pager,setPager] = useState<PagerModel>()

    useMount(()=>load(page))

    const load = (p: number) => {
        setLoading.on()
         api(p).then(value => {
            setLoading.off()
             setBlogs([...blogs,...value.data?.list??[]])
             setPager(value.data?.page)
             setPage(p)
         });
    }

    const nextPage = () => {
        let nt = page + 1;
        load(nt)
    }

  return <>


      {
          blogs.map(value =>  {
              return <BaseBlogCardStyle2 blog={value} key={value.id} />
          })
      }


      {
          pager && <PagerNextLoad pager={pager} onload={nextPage} loading={loading}/>
      }
  </>
}

export  default  BlogListLoad