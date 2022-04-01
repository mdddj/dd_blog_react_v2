import * as React from "react"
import {
    Box,
    Button,
    ChakraProvider,
    Text,
    Container,
    Flex,
    Heading,
    Spacer,
    HStack,
    useMediaQuery,
    IconButton,
    Drawer,
    useDisclosure,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    DrawerFooter,
    extendTheme,
    useColorModeValue, ComponentStyleConfig,
} from "@chakra-ui/react"
import {HamburgerIcon} from '@chakra-ui/icons'

import {BrowserRouter, Routes, Route, NavLink, Link} from "react-router-dom"
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
import JianliPage from "./pages/me";
import {navbarMenu} from "./menus"
import {mode} from '@chakra-ui/theme-tools'
import DynamicPage from "./pages/dynamic/dynamic";
import DocDetailPage from "./pages/doc/detail";
import LoginComponent from "./components/login";
import AddPostPage from "./pages/add/post";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil"
import { systemAvatars } from "./providers/avatars"
import PubSub from "pubsub-js";
import {errorResponseProvider} from "./providers/modal/error_response";
import ResponseErrorModal from "./components/modal/ResponseErrorModal";
import AppSuccessModel from "./components/modal/AppSuccessModel";
import UpdatePasswordModal from "./components/modal/UpdatePasswordModal";

const BoxStyle: ComponentStyleConfig = {
    defaultProps: {}
}

const myTheme = extendTheme({
    styles: {
        global: (props: any) => ({
            body: {
                bg: mode('#f5f6f9', 'gray.800')(props)
            }
        })
    },
    colors: {
        appbar: {
            'white': 'white',
            'dark': 'black'
        },
    },
    components: {
        Box: BoxStyle
    }
})


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
        blogApi().getPics(1).then(value => {
            successResultHandle(value, data => {
                setAvatars(data)

            })
        })
    }

    ///加载分类和归档等数据
    const getCategoryData = () => {
        blogApi().getArchives().then(value => {
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
        <ChakraProvider theme={myTheme}>
            <BrowserRouter>
                <main style={{flexShrink: '0'}}>
                    <BlogNav/>

                    <Container maxW={'container.lg'}>
                        <AppLoadingWidget/>
                        <MoneyModal/>
                        <ResponseErrorModal/>
                        <AppSuccessModel />
                        <UpdatePasswordModal/>
                        <Routes>
                            <Route path={'/'} element={<Home/>} />

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


                            {/*    文档页面 */}
                            <Route path={'/docs'} element={<DocsPage/>}>
                            </Route>
                            <Route path={'/docs/:id'} element={<DocDetailPage/>} />

                            <Route>

                                {/*    关于我页面*/}
                                <Route path={'/about'} element={<AboutPage/>}/>


                                {/*    友链页面*/}
                                <Route path={'/friends'} element={<FriendsPage/>}/>

                                {/* 说说页面 */}
                                <Route path={'/ss'} element={<DynamicPage/>}/>


                            </Route>

                            {/*月份归档查看页面*/}
                            <Route path={'/month'} element={<MonthPage/>}>
                                <Route path={':month'} element={<MonthPage/>}/>
                            </Route>


                            {/*简历页面*/}
                            <Route path={'/jianli'} element={<JianliPage/>}/>


                            <Route path={'*'} element={<NotFoundPage/>}/>



                           {/*    需要登录的页面*/}
                            <Route path={'/add-post'} element={<AddPostPage />} />

                        </Routes>
                        <div style={{height: 12}}/>

                    </Container>
                    <LoginComponent />
                </main>
            </BrowserRouter>

            <AppFoot/>

        </ChakraProvider>
    )
}


// 手机端的导航条
const PhoneAppbar: React.FC = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return <>
        <Flex alignItems={'center'}>
            <Box p='4'>
                <Link to={'/'}>梁典典的博客</Link>
            </Box>
            <Spacer/>
            <Box p='4'>
                <IconButton icon={<HamburgerIcon/>} aria-label={""} onClick={onOpen}/>
            </Box>
        </Flex>
        <PhoneMenuDrawer isOpen={isOpen} onClose={onClose}/>
    </>
}

const PhoneMenuDrawer: React.FC<{ isOpen: boolean, onClose: () => void }> = ({isOpen, onClose}) => {
    const openMoneyModal = useSetRecoilState(appMoneyModalOpen)
    return <>
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            size={'xs'}
        >
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerCloseButton/>
                <DrawerHeader>梁典典的博客</DrawerHeader>

                <DrawerBody>
                    {
                        navbarMenu.map(value => <Link to={value.url} key={value.url} onClick={onClose}>
                            <Text fontSize='xl' fontWeight='bold'>
                                {value.title}
                            </Text>
                        </Link>)
                    }

                </DrawerBody>
                <DrawerFooter>
                    {/*<ColorModeSwitcher/>*/}
                    <Button colorScheme='blue' variant='ghost' onClick={() => {
                        openMoneyModal(true)
                        onClose()
                    }}>
                        打赏
                    </Button>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    </>
}

//博客导航
const BlogNav: React.FC = () => {
    const openMoneyModal = useSetRecoilState(appMoneyModalOpen)
    const [isDesk] = useMediaQuery('(min-width: 760px)')
    const isPhone = !isDesk

    const value = useColorModeValue('appbar.white', 'appbar.dark')

    if (isPhone) {
        return <PhoneAppbar/>
    }

    return <Box className={'my-nav-bar'} bg={value}>
        <Container maxW={'container.lg'} className={'border-bottom app-bar'}>
            <Flex alignItems={'center'}>
                <Box p={2}>
                    <Heading size='md'>梁典典的博客</Heading>
                </Box>
                <Spacer/>
                <HStack spacing={12}>
                    {navbarMenu.map(v => <NavLink key={v.url} to={v.url}>{v.title}</NavLink>)}

                    {/*<ColorModeSwitcher/>*/}
                </HStack>
                <Spacer/>
                <Box>
                    <Button colorScheme='blue' variant='ghost' onClick={() => openMoneyModal(true)}>
                        打赏
                    </Button>
                </Box>
            </Flex>
        </Container>
    </Box>
}

const AppFoot: React.FC = () => {
    return <>
        <footer className="blog-footer mt-auto">
            <p> © 2022 <button>@梁典典的博客</button>.</p>
            <Box p={2} fontSize={13}>
               本站由springboot+typescript强力驱动,博客已开源<a style={{color: 'blue'}} href="https://github.com/mdddj/dd_blog_react_v2">GITHUB</a>
            </Box>

        
        <Box fontSize={12}>
            赣ICP备17011549号-1 <a href={'https://github.com/mdddj/dd_server_api_web'} style={{
                color : 'red'
        }}>开放API</a>
        </Box>
        </footer>
    </>
}

