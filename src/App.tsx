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
import JianliPage from "./pages/JianliPage";
import {navbarMenu} from "./menus"
import {mode} from '@chakra-ui/theme-tools'
import DynamicPage from "./pages/dynamic/DynamicPage";
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
import FriendsList from "./components/user/FriendsList"
import DynamicListPage from "./pages/dynamic/DynamicListPage";

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


    //?????????????????????????????????
    useMount(() => {
        getCategoryData()
        fetchAvatars()
        monitorResponseMsg()
    })


    // ????????????????????????
    const fetchAvatars = () => {
        blogApi().getPics(1).then(value => {
            successResultHandle(value, data => {
                setAvatars(data)

            })
        })
    }

    ///??????????????????????????????
    const getCategoryData = () => {
        blogApi().getArchives().then(value => {
            setArchives(value.data)
        });
    }

    /// ???????????????????????????
    const monitorResponseMsg = ()=>{
        PubSub.subscribe('response-error',(k,data)=>{
            let error = data as ErrorData
            switch (error.code) {
                /// ??????????????????????????????
                case 508:
                    setErrorResponse(error)
                    break
                /// ?????????????????????
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

                            {/*????????????*/}
                            <Route path={'tag'} element={<TagsPage/>}>
                                {/*<Route path={'/tag'} element={<TagsPage/>} />*/}
                                <Route path={':id'} element={<TagPage/>}/>
                            </Route>


                            {/*    ???????????? */}
                            <Route path={'/docs'} element={<DocsPage/>}>
                            </Route>
                            <Route path={'/docs/:id'} element={<DocDetailPage/>} />

                            <Route>

                                {/*    ???????????????*/}
                                <Route path={'/about'} element={<AboutPage/>}/>


                                {/*    ????????????*/}
                                <Route path={'/friends'} element={<FriendsPage/>}/>

                                {/* ???????????? */}
                                <Route path={'/ss'} element={<DynamicPage/>}/>

                                {/* ???????????????????????? */}
                                <Route path={'/pics'} element={<DynamicListPage />}/>


                            </Route>

                            {/*????????????????????????*/}
                            <Route path={'/month'} element={<MonthPage/>}>
                                <Route path={':month'} element={<MonthPage/>}/>
                            </Route>


                            {/*????????????*/}
                            <Route path={'/jianli'} element={<JianliPage/>}/>


                            <Route path={'*'} element={<NotFoundPage/>}/>



                           {/*    ?????????????????????*/}

                           {/* ????????????????????? */}
                            <Route path={'/add-post'} element={<AddPostPage />} />

                        </Routes>
                        <div style={{height: 12}}/>

                    </Container>
                    <FriendsList />
                    <LoginComponent />
                   
                </main>
            </BrowserRouter>

            <AppFoot/>

        </ChakraProvider>
    )
}


// ?????????????????????
const PhoneAppbar: React.FC = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return <>
        <Flex alignItems={'center'}>
            <Box p='4'>
                <Link to={'/'}>??????????????????</Link>
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
                <DrawerHeader>??????????????????</DrawerHeader>

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
                        ??????
                    </Button>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    </>
}

//????????????
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
                    <Heading size='md'>??????????????????</Heading>
                </Box>
                <Spacer/>
                <HStack spacing={12}>
                    {navbarMenu.map(v => <NavLink key={v.url} to={v.url}>{v.title}</NavLink>)}

                    {/*<ColorModeSwitcher/>*/}
                </HStack>
                <Spacer/>
                <Box>
                    <Button colorScheme='blue' variant='ghost' onClick={() => openMoneyModal(true)}>
                        ??????
                    </Button>
                </Box>
            </Flex>
        </Container>
    </Box>
}

const AppFoot: React.FC = () => {
    return <>
        <footer className="blog-footer mt-auto">
            <p> ?? 2022 <button>@??????????????????</button>.</p>
            <Box p={2} fontSize={13}>
               ?????????springboot+typescript????????????,???????????????<a style={{color: 'blue'}} href="https://github.com/mdddj/dd_blog_react_v2">GITHUB</a>
            </Box>

        
        <Box fontSize={12}>
            ???ICP???17011549???-1 <a href={'https://github.com/mdddj/dd_server_api_web'} style={{
                color : 'red'
        }}>??????API</a>
        </Box>
        </footer>
    </>
}

