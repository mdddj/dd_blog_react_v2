import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {BlogData} from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import {Box, Fade, Heading} from "@chakra-ui/react";
import {BlogPreview} from "../components/blog_content";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";
import TwoColumnLayout from "../components/two_column_layout";

//博客详情页面
const BlogPage: React.FC = () => {


    let {id} = useParams<{ id: string }>()
    const [blog, setBlog] = useState<BlogData>()
    const setLoading = useSetRecoilState(appLoading)

    useMount(() => getBlogDetail())


    const getBlogDetail = () => {
        setLoading(true)
        id && blogApi().getBlogDetailById(parseInt(id)).then(r => {
            console.log(r)
            setLoading(false)
            setBlog(r.data)
        })
    }

    return <>

        <TwoColumnLayout right={[]}>
            <Fade in={blog !== undefined}>
                <Box mb={4} mt={4} bg={"white"} p={5}>
                    <Heading size={'md'}>{blog?.title}</Heading>
                    <Box color={'gray.600'}>{blog?.dateString}</Box>
                    <Box mt={5}>
                        {blog && <BlogPreview content={blog!.content}/>}
                    </Box>
                </Box>
            </Fade>
        </TwoColumnLayout>

    </>
}
export default BlogPage
