import * as React from "react"

import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/home"
import {blogApi, ErrorData} from "./utils/request";
import {useMount} from "react-use";
import {useSetRecoilState} from "recoil";
import {archivesDataState} from "./providers/archives";
import Archive from "./pages/archive";
import BlogPage from "./pages/blog";
import './app.css'
import CategoryPage from "./pages/category";
import NotFoundPage from "./pages/not_found";
import TagsPage from "./pages/tags";
import TagPage from "./pages/tag";
import AboutPage from "./pages/about";
import FriendsPage from "./pages/friends";
import DocsPage from "./pages/doc";
import AppLoadingWidget from "./components/app_loading_widget";
import {appMoneyModalOpen} from "./providers/modal";
import MoneyModal from "./components/modal/money";
import MonthPage from "./pages/month";
import JianliPage from "./pages/JianliPage";
import DynamicPage from "./pages/dynamic/DynamicPage";
import DocDetailPage from "./pages/doc/detail";
import LoginComponent from "./components/login";
import AddPostPage from "./pages/add/post";
import {systemAvatars} from "./providers/avatars"
import PubSub from "pubsub-js";
import {errorResponseProvider} from "./providers/modal/error_response";
import ResponseErrorModal from "./components/modal/ResponseErrorModal";
import AppSuccessModel from "./components/modal/AppSuccessModel";
import UpdatePasswordModal from "./components/modal/UpdatePasswordModal";
import FriendsList from "./components/user/FriendsList"
import DynamicListPage from "./pages/dynamic/DynamicListPage";
import AddResPage from "./pages/add/add_res_page"
import {Container, ThemeProvider} from "@mui/material";
import {defaultTheme} from "./theme/DefaultTheme";
import BlogAppbar from "./components/appbar";
import {SystemPicter} from "dd_server_api_web/dist/model/avater";
import {Result, successResultHandle} from "dd_server_api_web/dist/utils/ResultUtil";
import {ArchiveModel} from "dd_server_api_web/dist/model/ArchiveModel";


export const App = () => {

    const setArchives = useSetRecoilState(archivesDataState)
    const setAvatars = useSetRecoilState(systemAvatars)
    const setErrorResponse = useSetRecoilState(errorResponseProvider)


    //组件被挂载后执行的方法
    useMount(() => {
        getCategoryData()
        fetchAvatars()
        monitorResponseMsg()
    })


    // 加载系统预设头像
    const fetchAvatars = () => {
        blogApi().getPics(1).then((value: Result<SystemPicter[]>) => {
            successResultHandle(value, (data: SystemPicter[] | ((currVal: SystemPicter[]) => SystemPicter[])) => {
                setAvatars(data)

            })
        })
    }

    ///加载分类和归档等数据
    const getCategoryData = () => {
        blogApi().getArchives().then((value: { data: ArchiveModel | ((currVal: ArchiveModel | undefined) => ArchiveModel | undefined) | undefined; }) => {
            setArchives(value.data)
        });
    }

    /// 监听请求失败的处理
    const monitorResponseMsg = ()=>{
        PubSub.subscribe('response-error',(k,data)=>{
            let error = data as ErrorData
            switch (error.code) {
                /// 参数验证不通过的异常
                case 508:
                    setErrorResponse(error)
                    break
                /// 没有权限的异常
                case 401:
                    setErrorResponse(error)
                    break
                default:
                    break
            }
        })
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <BrowserRouter>
                <main>
                    <BlogAppbar />

                    <Container >
                        <AppLoadingWidget/>
                        <MoneyModal/>
                        <ResponseErrorModal/>
                        <AppSuccessModel />
                        <UpdatePasswordModal/>
                        <Routes>
                            <Route path={'/'} element={<Home/>} />

                            <Route path={'/archive'} element={<Archive/>}/>

                            <Route path={'/add-res'} element={<AddResPage />} />


                            <Route path={'/post'} element={<BlogPage/>}>
                                <Route path={':id'} element={<BlogPage/>}/>
                            </Route>
                            <Route path={'/category'} element={<CategoryPage/>}>
                                <Route path={':id'} element={<CategoryPage/>}/>
                            </Route>

                            {/*标签页面*/}
                            <Route path={'tag'} element={<TagsPage/>}>
                                {/*<Route path={'/tag'} element={<TagsPage/>} />*/}
                                <Route path={':id'} element={<TagPage/>}/>
                            </Route>


                            {/*    文档页面 */}
                            <Route path={'/docs'} element={<DocsPage/>}>
                            </Route>
                            <Route path={'/docs/:id'} element={<DocDetailPage/>} />

                            <Route>

                                {/*    关于我页面*/}
                                <Route path={'/about'} element={<AboutPage/>}/>


                                {/*    友链页面*/}
                                <Route path={'/friends'} element={<FriendsPage/>}/>

                                {/* 相册页面 */}
                                <Route path={'/ss'} element={<DynamicPage/>}/>

                                {/* 相册详情页面页面 */}
                                <Route path={'/pics'} element={<DynamicListPage />}/>


                            </Route>

                            {/*月份归档查看页面*/}
                            <Route path={'/month'} element={<MonthPage/>}>
                                <Route path={':month'} element={<MonthPage/>}/>
                            </Route>


                            {/*简历页面*/}
                            <Route path={'/jianli'} element={<JianliPage/>}/>


                            <Route path={'*'} element={<NotFoundPage/>}/>



                           {/*    需要登录的页面*/}

                           {/* 发布博客的页面 */}
                            <Route path={'/add-post'} element={<AddPostPage />} />

                        </Routes>
                        <div style={{height: 12}}/>

                    </Container>
                    <FriendsList />
                    <LoginComponent />
                   
                </main>
            </BrowserRouter>

            <AppFoot/>

        </ThemeProvider>
    )
}


// todo :  手机端的导航条
const PhoneAppbar: React.FC = () => {
    return <>

    </>
}

// todo 手机端抽屉
const PhoneMenuDrawer: React.FC<{ isOpen: boolean, onClose: () => void }> = ({isOpen, onClose}) => {
    const openMoneyModal = useSetRecoilState(appMoneyModalOpen)
    return <>

    </>
}

// 博客导航


// todo 底部区域
const AppFoot: React.FC = () => {
    return <>
        <footer className="blog-footer mt-auto">
            <p> © 2022 <button>@梁典典的博客</button>.</p>
            {/*<Box p={2} fontSize={13}>*/}
            {/*   本站由springboot+typescript强力驱动,博客已开源<a style={{color: 'blue'}} href="https://github.com/mdddj/dd_blog_react_v2">GITHUB</a>*/}
            {/*</Box>*/}

        
        {/*<Box fontSize={12}>*/}
        {/*    赣ICP备17011549号-1 <a href={'https://github.com/mdddj/dd_server_api_web'} style={{*/}
        {/*        color : 'red'*/}
        {/*}}>开放API</a>*/}
        {/*</Box>*/}
        </footer>
    </>
}

