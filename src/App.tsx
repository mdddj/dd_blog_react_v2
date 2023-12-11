import * as React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { blogApi } from "./utils/request";
import { useMount } from "react-use";
import { useSetRecoilState } from "recoil";
import { archivesDataState } from "./providers/archives";
import Archive from "./pages/archive";
import BlogPage from "./pages/blog";
import "./app.css";
import CategoryPage from "./pages/category";
import NotFoundPage from "./pages/not_found";
import TagsPage from "./pages/tags";
import TagPage from "./pages/tag";
import AboutPage from "./pages/about";
import FriendsPage from "./pages/friends";
import DocsPage from "./pages/doc";
import AppLoadingWidget from "./components/app_loading_widget";
import MoneyModal from "./components/modal/money";
import MonthPage from "./pages/month";
import DynamicPage from "./pages/dynamic/DynamicPage";
import DocDetailPage from "./pages/doc/detail";
import LoginComponent from "./components/login";
import AddPostPage from "./pages/add/post";
import ResponseErrorModal from "./components/modal/ResponseErrorModal";
import AppSuccessModel from "./components/modal/AppSuccessModel";
import UpdatePasswordModal from "./components/modal/UpdatePasswordModal";
import FriendsList from "./components/user/FriendsList";
import DynamicListPage from "./pages/dynamic/DynamicListPage";
import AddResPage from "./pages/add/add_res_page";
import { Container, ThemeProvider, Typography } from "@mui/material";
import { defaultTheme } from "./theme/DefaultTheme";
import BlogAppbar from "./components/appbar";
import { ArchiveModel } from "dd_server_api_web/dist/model/ArchiveModel";
import NameResourceWidget from "./components/resource/name_resource";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import { ReactElement } from "react";
import { grey } from "@mui/material/colors";
import TextPage from "./pages/text";
import UpdateResourcePage from "./pages/resource/update";

export const App = () => {
  const setArchives = useSetRecoilState(archivesDataState);

  //组件被挂载后执行的方法
  useMount(() => {
    getCategoryData();
  });

  ///加载分类和归档等数据
  const getCategoryData = () => {
    try {
      blogApi()
        .getArchives()
        .then(
          (value: {
            data:
              | ArchiveModel
              | ((
                  currVal: ArchiveModel | undefined
                ) => ArchiveModel | undefined)
              | undefined;
          }) => {
            setArchives(value.data);
          }
        );
    } catch (error) {
      console.log("加载失败" + error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <main id={"main"}>
          <BlogAppbar />

          <Container
            sx={{
              mt: "80px",
            }}
          >
            <AppLoadingWidget />
            <MoneyModal />
            <ResponseErrorModal />
            <AppSuccessModel />
            <UpdatePasswordModal />
            <Routes>
              <Route path={"/"} element={<Home />} />

              <Route path={"/archive"} element={<Archive />} />

              <Route path={"/add-res/:cateName"} element={<AddResPage />} />

              <Route path={"/post"} element={<BlogPage />}>
                <Route path={":id"} element={<BlogPage />} />
              </Route>
              <Route path={"/category"} element={<CategoryPage />}>
                <Route path={":id"} element={<CategoryPage />} />
              </Route>

              {/*标签页面*/}
              <Route path={"tag"} element={<TagsPage />}>
                <Route path={":id"} element={<TagPage />} />
              </Route>

              {/*    文档页面 */}
              <Route path={"/docs"} element={<DocsPage />}></Route>
              <Route path={"/docs/:id"} element={<DocDetailPage />} />

              {/* 修改资源动态的页面 */}
              <Route path="/r/u" element={<UpdateResourcePage />} />

              <Route>
                {/*    关于我页面*/}
                <Route path={"/about"} element={<AboutPage />} />

                {/*    友链页面*/}
                <Route path={"/friends"} element={<FriendsPage />} />

                {/* 相册页面 */}
                <Route path={"/ss"} element={<DynamicPage />} />

                {/* 相册详情页面页面 */}
                <Route path={"/pics/:cateName"} element={<DynamicListPage />} />
              </Route>

              {/*月份归档查看页面*/}
              <Route path={"/month"} element={<MonthPage />}>
                <Route path={":month"} element={<MonthPage />} />
              </Route>

              <Route path="/t">
                <Route path={":text"} element={<TextPage />} />
              </Route>

              {/*简历页面*/}
              {/* <Route path={"/jianli"} element={<JianliPage />} /> */}

              <Route path={"*"} element={<NotFoundPage />} />

              {/*    需要登录的页面*/}

              {/* 发布博客的页面 */}
              <Route path={"/add-post"} element={<AddPostPage />} />

              <Route path={"/login"} element={<LoginComponent />} />
            </Routes>
          </Container>
          <div style={{ height: 12 }} />

          <FriendsList />
          {/*<LoginComponent />*/}
        </main>
      </BrowserRouter>

      <AppFoot />
    </ThemeProvider>
  );
};

// 博客导航

// todo 底部区域
const AppFoot: React.FC = () => {
  function render(list: ResourceModel[]): ReactElement {
    return (
      <>
        {list &&
          list.map((v) => {
            return (
              <Typography key={v.id} variant={"body2"}>
                <a style={{ color: grey[500] }} href={v.content}>
                  {v.title}
                </a>
              </Typography>
            );
          })}
      </>
    );
  }

  return (
    <>
      <footer className="blog-footer mt-auto">
        <div>
          <Typography variant={"body1"}>
            梁典典的博客 赣ICP备17011549号-1
          </Typography>
        </div>
        <div style={{ marginTop: 12 }}>
          <NameResourceWidget categoryName={"博客底部链接"} render={render} />
        </div>
      </footer>
    </>
  );
};
