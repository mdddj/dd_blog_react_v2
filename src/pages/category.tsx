import React from "react";
import BlogListLoad from "../components/blog_list_load";
import {blogApi} from "../utils/request";
import {useParams} from "react-router-dom";
///分类页面
const CategoryPage: React.FC = () => {
  const {id} = useParams<{id: string}>()
  if(!id)return <></>
  const categoryId = parseInt(id)
  return <>
    <BlogListLoad api={page => {
      return new Promise(resolve => {
         blogApi().getBlogsByCategoryId(categoryId,{page: page,pageSize: 20}).then(value => {
          resolve(value)
        })
      })
    }} />
  </>
}
export default CategoryPage