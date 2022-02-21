import * as React from "react"
import {
    Button,
    ChakraProvider, theme,
} from "@chakra-ui/react"
import {BrowserRouter, Routes, Route, Link} from "react-router-dom"
import Home from "./pages/home"
import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {blogApi} from "./utils/request";
import {useMount} from "react-use";
import {useRecoilState} from "recoil";
import {archivesDataState} from "./providers/archives";
import Archive from "./pages/archive";

export const App = () => {

    const [archives, setArchives] = useRecoilState(archivesDataState)

    //组件被挂载后执行的方法
    useMount(() => {
        console.log('app 初始化')
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
                <div className="container">
                    <header className="blog-header py-3">
                        <div className="row flex-nowrap justify-content-between align-items-center">
                            <div className="col-4 pt-1">
                                <Link className="link-secondary" to={'/archive'}>归档</Link>
                            </div>
                            <div className="col-4 text-center">
                                <Link className="blog-header-logo text-dark" to={'/'}>梁典典的博客</Link>
                            </div>
                            <div className="col-4 d-flex justify-content-end align-items-center">
                                <Button>打赏</Button>
                            </div>
                        </div>
                    </header>
                    <div className="nav-scroller py-1 mb-2">
                        <nav className="nav d-flex justify-content-between">
                            {
                                archives && archives.categoryList.map(value => {
                                    return <Link to={'/category?id='+value.id} key={value.id}>{value.name}</Link>
                                })
                            }
                        </nav>
                    </div>
                </div>
                <main className={'container'}>
                    <Routes>
                        <Route path={'/'} element={<Home/>}/>
                        <Route path={'/archive'} element={<Archive />}/>
                    </Routes>
                </main>
            </BrowserRouter>
        </ChakraProvider>
    )
}
