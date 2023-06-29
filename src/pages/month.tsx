import React from "react";
import BlogListLoad from "../components/blog_list_load";
import {blogApi} from "../utils/request";
import {useParams} from "react-router-dom";
import PageHeader from "../components/page_header";
import { BlogData } from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import { Result, Page } from "dd_server_api_web/dist/utils/ResultUtil";

///日期归档
const MonthPage:React.FC = () => {
    const {month} = useParams<{month: string}>()
  return <>
      {month && <PageHeader title={month} />}
      {
          month && <BlogListLoad api={ page => {
              return  new Promise<Result<Page<BlogData>>>(resolve => {
                  blogApi().getBlogsByMonth(month,{page,pageSize: 20}).then((value: Result<Page<BlogData>>) => {
                      resolve(value)
                  })
              })
          }}
          />
      }
  </>
}
export default MonthPage