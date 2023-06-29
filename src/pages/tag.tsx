import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { blogApi } from "../utils/request";
import BlogListLoad from "../components/blog_list_load";
import { BlogData } from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import { Result, Page } from "dd_server_api_web/dist/utils/ResultUtil";

///标签列表
const TagPage: React.FC = () => {
  const ref = React.createRef<any>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    ref.current.onRefresh();
  }, [id, ref]);
  if (!id) {
    return <div />;
  }
  const tagId = parseInt(id);
  return (
    <>
      <div>博客列表</div>
      <BlogListLoad
        refd={ref}
        api={(page) => {
          return new Promise((resolve) => {
            blogApi()
              .getBlogsByTagId(tagId, { page: page, pageSize: 20 })
              .then((value:Result<Page<BlogData>>) => {
                resolve(value);
              });
          });
        }}
      />
    </>
  );
};

export default TagPage;
