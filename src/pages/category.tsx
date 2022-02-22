import React from "react";
import BlogListLoad from "../components/blog_list_load";
import {blogApi} from "../utils/request";
import {useParams} from "react-router-dom";
import {useUpdateEffect} from "react-use";
///分类页面
const CategoryPage: React.FC = () => {



  const ref = React.createRef<any>()
  const params = useParams<{id: string}>()
  let id = params.id

  useUpdateEffect(()=>{
    ref.current && ref.current.onRefresh()
  },[params])

  if(!id)return <></>
  const categoryId = parseInt(id)

  return <>
    <BlogListLoad refd={ref} api={page => {
      return new Promise(resolve => {
         blogApi().getBlogsByCategoryId(categoryId,{page: page,pageSize: 20}).then(value => {
          resolve(value)
        })
      })
    }} />
  </>
}
export default CategoryPage