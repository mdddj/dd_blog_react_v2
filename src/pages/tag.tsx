import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { blogApi } from "../utils/request";
import BlogListLoad from "../components/blog_list_load";
import PageHeader from "../components/page_header";

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
      <PageHeader title="博客列表" />
      <BlogListLoad
        refd={ref}
        api={(page) =>
          blogApi().getBlogsByTagId(tagId, { page: page, pageSize: 20 })
        }
      />
    </>
  );
};

export default TagPage;
