import React, {useState} from "react";
import MyBox from "../../components/box/my_box";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import {BlogPreviewLight} from "../../components/blog_content_light";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {archivesDataState} from "../../providers/archives";
import AddPostTagModal from "./add_post_tag_modal";
import {blogApi} from "../../utils/request";
import {useSearchParams} from "react-router-dom";
import {useMount, useToggle} from "react-use";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {onImageUpload} from "../../utils/EditImageFileUpload";
import {Box, Button, Chip, CircularProgress, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {Result, successResultHandle} from "dd_server_api_web/dist/utils/ResultUtil";
import {BlogData} from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import {LoadingButton} from "@mui/lab";
import {ApiResponse} from "../../models/app_model";

// 发布博客页面
const AddPostPage: React.FC = () => {
    let archives = useRecoilValue(archivesDataState);
    const [content, setContent] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [showTagDialog, setShowTagDialog] = useState(false)
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [on, toggle] = useToggle(false);
    const setMsg = useSetRecoilState(successMessageProvider)

//   修改博客的对象
    const [updateBlog, setUpdateBlog] = useState<BlogData | undefined>()

    // 修改的ID
    const [searchParams] = useSearchParams();

    useMount(() => {
        // 如果存在修改的ID,
        const id = searchParams.get('id')
        if (id !== null) {
            toggle(true)
            blogApi()
                .getBlogDetailById(parseInt(id))
                .then((r: Result<BlogData>) => {
                    toggle(false)
                    successResultHandle(r, d => {
                        setUpdateBlog(d)
                        setContent(d.content)
                        setTitle(d.title)
                        setTags(d.tags.map(r => r.name))
                        setCategoryId(`${d.category.id}`)

                    }, setMsg)
                });
        }
    });

    //提交数据
    const submit = async () => {

        let json = {
            title: title,
            content: content,
            tags: tags,
            categoryId: categoryId,
            id: updateBlog?.id
        };
        let result = await blogApi().requestT<ApiResponse<BlogData>>("/api/auth/blog-push-new", json, 'POST')
        setMsg(result.message)
    };

    return (
        <MyBox>
            {on && <CircularProgress/>}

            {
                !on && <Stack direction={"column"} spacing={3}>
                    <Typography variant={'h3'}>
                        发布博客
                    </Typography>
                    <TextField
                        placeholder={"输入标题"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <MdEditor
                        style={{height: "500px"}}
                        value={content}
                        renderHTML={(text) => <BlogPreviewLight content={text}/>}
                        onChange={(data) => {
                            setContent(data.text);
                        }}
                        onImageUpload={onImageUpload}


                    />

                    {archives && (
                        <Stack direction={"column"} spacing={2}>
                            <Typography>
                                文章分类
                            </Typography>
                            <Select
                                placeholder="文章分类"
                                value={updateBlog && categoryId && categoryId !== 'undefined' ? `${categoryId}` : undefined}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                {archives.categoryList.map((value) => (
                                    <MenuItem value={`${value.id}`} key={value.id}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Typography>
                                添加标签{" "}
                                <span style={{color: "grey", fontSize: 12}}>
                已选择{tags.length}个
              </span>
                            </Typography>
                            <Stack direction={'row'} spacing={2}>
                                {
                                    tags.map((v) => <Chip label={v} key={v}/>)
                                }
                            </Stack>
                            <Button onClick={() => {
                                setShowTagDialog(true)
                            }}>编辑博客标签</Button>
                        </Stack>
                    )}
                    <Box>
                        <LoadingButton fullWidth loading={on} onClick={submit} variant={"contained"}>
                            {
                                updateBlog ? '提交修改' : '发布'
                            }
                        </LoadingButton>
                    </Box>
                </Stack>
            }

            {/*选择标签的弹窗*/}
            <AddPostTagModal
                show={showTagDialog}
                onOk={(values) => {
                    setTags(values);
                }}
                initVal={tags}
                onClose={() => {
                    setShowTagDialog(false)
                }}/>
        </MyBox>
    );
};
export default AddPostPage;
