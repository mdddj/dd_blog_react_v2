import * as React from "react"
import {
    ChakraProvider, theme,
} from "@chakra-ui/react"
import {BrowserRouter, Routes, Route, Link, NavLink} from "react-router-dom"
import Home from "./pages/home"
import { blogApi } from "./utils/request";
import { useMount } from "react-use";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { archivesDataState } from "./providers/archives";
import Archive from "./pages/archive";
import BlogPage from "./pages/blog";
import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import CategoryPage from "./pages/category";
import NotFoundPage from "./pages/not_found";
import TagsPage from "./pages/tags";

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
                <BlogNav />
                <main className={'container mt-3'}>
                    <Routes>
                        <Route path={'/'} element={<Home />} />
                        <Route path={'/archive'} element={<Archive />} />
                        <Route path={'/post'} element={<BlogPage />}>
                            <Route path={':id'} element={<BlogPage />} />
                        </Route>
                        <Route path={'/category'} element={<CategoryPage/>}>
                            <Route path={':id'} element={<CategoryPage/>} />
                        </Route>
                        <Route path={'/tag'} element={<TagsPage/>}>

                        </Route>
                        <Route path={'*'} element={<NotFoundPage/>} />
                    </Routes>
                    <div style={{ height: 12 }} />
                </main>
            </BrowserRouter>
            <AppFoot />
        </ChakraProvider>
    )
}


const BlogNav: React.FC = () => {
    const archives = useRecoilValue(archivesDataState)
    return <>
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">梁典典的博客</Link>
                <button className="navbar-toggler p-0 border-0" type="button" id="navbarSideCollapse"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">首页</Link>
                        </li>
                        <li className={'nav-item'}>
                            <Link className="nav-link" aria-current="page" to="/tag">标签</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div className="nav-scroller bg-body shadow-sm">
            <nav className="nav nav-underline" aria-label="Secondary navigation">
                {
                    archives && archives.categoryList.map(value => {
                        return <NavLink key={value.id} className="nav-link" to={'/category/' + value.id}>{value.name}</NavLink>
                    })
                }
            </nav>
        </div>
        <div style={{ height: 12 }} />
    </>
}

const AppFoot: React.FC = () => {
    return <>
        <footer className="blog-footer mt-auto">
            <p> © 2022 <button>@梁典典</button>.</p>
            <p>
                <button >回到顶部</button>
            </p>
        </footer>
    </>
}

