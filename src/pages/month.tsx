import React from "react";
import BlogListLoad from "../components/blog_list_load";
import {blogApi} from "../utils/request";
import {useParams} from "react-router-dom";
import {Page, Result} from "dd_server_api_web/src/utils/ResultUtil";
import {BlogData} from "dd_server_api_web/src/model/result/BlogPushNewResultData";
import PageHeader from "../components/page_header";

///日期归档
const MonthPage:React.FC = () => {
    const {month} = useParams<{month: string}>()
  return <>
      {month && <PageHeader title={month} />}
      {
          month && <BlogListLoad api={ page => {
              return  new Promise<Result<Page<BlogData>>>(resolve => {
                  blogApi().getBlogsByMonth(month,{page,pageSize: 20}).then(value => {
                      resolve(value)
                  })
              })
          }}
          />
      }
  </>
}
export default MonthPage