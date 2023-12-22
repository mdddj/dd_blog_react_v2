import React, { useState } from "react";
import { useMount } from "react-use";
import { blogApi } from "../utils/request";
import {
  AboutMeCard,
  ArchiveCard,
  CategoryCard,
  TagCard,
} from "../components/about_me";
import BaseBlogCardStyle2 from "../components/blog/base_blog_card_style2";
import PagerNextLoad from "../components/pager_next_load";
import TwoColumnLayout from "../components/two_column_layout";
import {
  BlogData,
  BlogListData,
} from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import { PagerModel, Result } from "dd_server_api_web/dist/utils/ResultUtil";

//首页
const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [nextPageLoading, setNextPageLoading] = useState<boolean>(false);
  const [pager, setPager] = useState<PagerModel>();

  //组件挂载
  useMount(async () => {
    await fetchBlogData(1);
  });

  ///获取下一页博客数据
  const getNextPage = () => {
    let nextPage = page + 1;
    setNextPageLoading(true);
    fetchBlogData(nextPage).then();
    setPage(nextPage);
  };

  /// 加载博客数据并进行UI更新
  const fetchBlogData = async (page: number) => {
    await blogApi()
      .getBlogList(page, 2000)
      .then((value: Result<BlogListData>) => {
        let resultList = value.data?.list ?? [];
        setBlogs([...blogs, ...resultList]);
        setNextPageLoading(false);
        setPager(value.data?.page);
      });
  };

  return (
    <>
      <TwoColumnLayout
        right={[
          <AboutMeCard />,
          <ArchiveCard />,
          <CategoryCard />,
          <TagCard />,
        ]}
      >
        {blogs.length !== 0 && (
          <>
            {blogs.map((value) => (
              <BaseBlogCardStyle2 blog={value} key={value.id} />
            ))}
            {pager && (
              <PagerNextLoad
                pager={pager}
                onload={getNextPage}
                loading={nextPageLoading}
              />
            )}
          </>
        )}
      </TwoColumnLayout>
    </>
  );
};

export default Home;
