import * as React from "react"
import {
    Box,
    Button,
    ChakraProvider, Container, Flex, Heading, Spacer, Tag, theme, Wrap, WrapItem, HStack
} from "@chakra-ui/react"
import {BrowserRouter, Routes, Route, NavLink} from "react-router-dom"
import Home from "./pages/home"
import {blogApi} from "./utils/request";
import {useMount} from "react-use";
import {useRecoilValue, useSetRecoilState} from "recoil";
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
import JianliPage from "./pages/me";

export const App = () => {

    const setArchives = useSetRecoilState(archivesDataState)


    //组件被挂载后执行的方法
    useMount(() => {
        getCategoryData()
    })

    ///加载分类和归档等数据
    const getCategoryData = () => {
        blogApi().getArchives().then(value => {
            setArchives(value.data)
        });
    }

    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
               <main style={{flexShrink: '0'}}>
                   <BlogNav/>

                   <Container maxW={'container.lg'}>
                       <AppLoadingWidget/>
                       <MoneyModal/>
                       <Routes>
                           <Route path={'/'} element={<Home/>}>

                           </Route>
                           <Route path={'/archive'} element={<Archive/>}/>
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
                           <Route>

                               {/*    关于我页面*/}
                               <Route path={'/about'} element={<AboutPage/>}/>


                               {/*    友链页面*/}
                               <Route path={'/friends'} element={<FriendsPage/>}/>


                               {/*    文档页面 */}
                               <Route path={'/docs'} element={<DocsPage/>}/>



                           </Route>

                           {/*月份归档查看页面*/}
                           <Route path={'/month'} element={<MonthPage />}>
                               <Route path={':month'} element={<MonthPage/>} />
                           </Route>


                           {/*简历页面*/}
                           <Route path={'/jianli'} element={<JianliPage />} />


                           <Route path={'*'} element={<NotFoundPage/>}/>
                       </Routes>
                       <div style={{height: 12}}/>

                   </Container>
               </main>
            </BrowserRouter>

            <AppFoot/>
        </ChakraProvider>
    )
}

//博客导航
const BlogNav: React.FC = () => {
    const archives = useRecoilValue(archivesDataState)
    const openMoneyModal = useSetRecoilState(appMoneyModalOpen)



    return <div>
        <Container maxW={'container.lg'} className={'border-bottom app-bar'}>
            <Flex alignItems={'center'}>
                <Box p={2}>
                    <Heading size='md'>梁典典的博客</Heading>
                </Box>
                <Spacer />
                <HStack spacing={12}>
                    <NavLink  to="/">首页</NavLink>
                    <NavLink  to="/tag">标签</NavLink>
                    <NavLink  to="/archive">归档</NavLink>
                    <NavLink  to="/docs">文档</NavLink>
                    <NavLink  to="/friends">友链</NavLink>
                    <NavLink  to="/about">关于</NavLink>
                    <NavLink  to="/jianli">简历</NavLink>
                </HStack>
                <Spacer />
                <Box>
                    <Button colorScheme='blue' variant='ghost' onClick={() => openMoneyModal(true)}>
                        打赏
                    </Button>
                </Box>
            </Flex>
        </Container>

        {/*<div className="nav-scroller bg-body shadow-sm">*/}
        {/*    <nav className="nav nav-underline" aria-label="Secondary navigation">*/}
        {/*        {*/}
        {/*            archives && archives.categoryList.map(value => {*/}
        {/*                return <NavLink key={value.id} className="nav-link"*/}
        {/*                                to={'/category/' + value.id}>{value.name}</NavLink>*/}
        {/*            })*/}
        {/*        }*/}
        {/*    </nav>*/}
        {/*</div>*/}
        <div style={{height: 12}}/>
    </div>
}

const AppFoot: React.FC = () => {
    return <>
        <footer className="blog-footer mt-auto">
            <p> © 2022 <button>@梁典典的博客</button>.</p>
            <Box p={2}>
                <Wrap spacing='12px' justify='center'>
                    <WrapItem>
                        <Tag>Springboot</Tag>
                    </WrapItem>
                    <WrapItem>
                        <Tag>React</Tag>
                    </WrapItem>
                    <WrapItem>
                        <Tag>Mysql8.0</Tag>
                    </WrapItem>
                    <WrapItem>
                        <Tag>Redius</Tag>
                    </WrapItem>
                    <WrapItem>
                        <Tag>Bootstrap</Tag>
                    </WrapItem>
                </Wrap>
            </Box>

            <p>
                <button>回到顶部</button>
            </p>
        </footer>
    </>
}

