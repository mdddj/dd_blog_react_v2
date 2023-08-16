import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";
import TwoColumnLayout from "../components/two_column_layout";
import UserCardWithBlogDetail from "../components/user/user_card";
import MarkdownView from "../components/MarkdownView";
import CommentComponent from "../components/comment_component";
import {Box, Button, Typography} from "@mui/material";
import {BlogData} from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import {Result} from "dd_server_api_web/dist/utils/ResultUtil";
import {grey} from "@mui/material/colors";
import {UserWidget} from "../components/user_widget";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//博客详情页面
const BlogPage: React.FC = () => {
    let {id} = useParams<{ id: string }>();
    const [blog, setBlog] = useState<BlogData>();
    const nav = useNavigate();
    const setLoading = useSetRecoilState(appLoading);

    useMount(() => getBlogDetail());

    const getBlogDetail = () => {
        setLoading(true);
        id &&
        blogApi()
            .getBlogDetailById(parseInt(id))
            .then((r: Result<BlogData>) => {
                setLoading(false);
                setBlog(r.data);
            });
    };

    return (
        <>
            <TwoColumnLayout
                right={[<UserCardWithBlogDetail loginNmae={"admin"}/>]}
                bottomComponent={
                    <>
                        {blog && (
                            <CommentComponent type={"blog"} id={blog.id} isBlogComment/>
                        )}{" "}
                    </>
                }
            >
        <span
            style={{
                marginBottom: '22px',
                marginTop: '12px',
                color: grey[500],
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            }}
            onClick={() => nav(-1)}
        >
            <ArrowBackIcon sx={{mr: 1}}/>
          返回上一页
        </span>
                <Typography variant="h3" gutterBottom>
                    {blog?.title}
                </Typography>
                <Typography variant={"body1"} color={'secondary'} gutterBottom>
                    发布时间:{blog?.dateString}
                </Typography>
                <Box mt={5} mb={5}>
                    {blog && <MarkdownView content={blog.content}/>}
                </Box>
                <Box mt={2}>
                    <UserWidget>
                        <Button
                            onClick={() => {
                                nav("/add-post?id=" + blog?.id);
                            }}
                        >
                            编辑博客
                        </Button>
                    </UserWidget>
                </Box>
            </TwoColumnLayout>
        </>
    );
};

export default BlogPage;
