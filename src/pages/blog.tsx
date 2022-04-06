import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { blogApi } from "../utils/request";
import { useMount } from "react-use";
import { BlogData } from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import { Box, Fade, Heading } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { appLoading } from "../providers/loading";
import TwoColumnLayout from "../components/two_column_layout";
import UserCardWithBlogDetail from "../components/user/user_card";
import MarkdownView from "../components/MarkdownView";
import CommentComponent from "../components/comment_component";

//博客详情页面
const BlogPage: React.FC = () => {


    let { id } = useParams<{ id: string }>()
    const [blog, setBlog] = useState<BlogData>()
    const setLoading = useSetRecoilState(appLoading)

    useMount(() => getBlogDetail())


    const getBlogDetail = () => {
        setLoading(true)
        id && blogApi().getBlogDetailById(parseInt(id)).then(r => {
            setLoading(false)
            setBlog(r.data)
        })
    }

    return <>

        <TwoColumnLayout right={[
            <UserCardWithBlogDetail loginNmae={'admin'} />
        ]} bottomComponent={
            <>{blog && <CommentComponent type={"blog"} id={blog.id} isBlogComment />} </>
        }>
            <Fade in={blog !== undefined}>
                <Heading>{blog?.title}</Heading>
                <Box color={'gray.600'}>{blog?.dateString}</Box>
                <Box mt={5}>
                    {blog && <MarkdownView content={blog!.content} />}
                </Box>
                <Box mt={2}>
                    <Link style={{
                        fontSize: 12,
                        color: 'grey'
                    }} to={'/add-post?id='+blog?.id}>编辑博客</Link>
                </Box>
            </Fade>

        </TwoColumnLayout>

    </>
}



export default BlogPage
