import React, { useState } from "react";
import MyBox from "../../components/box/my_box";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { BlogPreviewLight } from "../../components/blog_content_light";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { archivesDataState } from "../../providers/archives";
import AddPostTagModal from "./add_post_tag_modal";
import { blogApi } from "../../utils/request";
import { useSearchParams } from "react-router-dom";
import { useMount, useToggle } from "react-use";
import { successMessageProvider } from "../../providers/modal/success_modal";
import { onImageUpload } from "../../utils/EditImageFileUpload";
import {Box, Button, CircularProgress, Select, Stack, TextField, Typography} from "@mui/material";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";
import { BlogData, BlogPushNewResultData } from "dd_server_api_web/dist/model/result/BlogPushNewResultData";

// 发布博客页面
const AddPostPage: React.FC = () => {
  let archives = useRecoilValue(archivesDataState);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [on, toggle] = useToggle(false);
  const setMsg = useSetRecoilState(successMessageProvider)

//   修改博客的对象
  const [updateBlog, setUpdateBlog] = useState<BlogData|undefined>()

  // 修改的ID
  const [searchParams] = useSearchParams();
  console.log(searchParams)

  useMount(() => {
    // 如果存在修改的ID,
    const id = searchParams.get('id')
    if (id !== null) {
        toggle(true)
      blogApi()
        .getBlogDetailById(parseInt(id))
        .then((r: Result<BlogData>) => {
            toggle(false)
            successResultHandle(r,d=>{
                setUpdateBlog(d)
                setContent(d.content)
                setTitle(d.title)
                setTags(d.tags.map(r=>r.name))
                setCategoryId(d.category.id)
        
            },setMsg)
        });
    }
  });

  //提交数据
  const submit = () => {
    blogApi()
      .pushNewBlog({
        title: title,
        content: content,
        tags: tags,
        categoryId: categoryId,
        id: updateBlog?.id
      })
      .then((value : BlogPushNewResultData) => {
        console.log(value);
        successResultHandle(
          value,
          (data) => {
          },
          (message) => {
          }
        );
      });
  };

  return (
    <MyBox>
      {on && <CircularProgress />}
      <Stack direction={"column"} spacing={5}>
        <Typography>
          发布博客
        </Typography>
        <TextField
          placeholder={"输入标题"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <MdEditor
          style={{ height: "500px" }}
          value={content}
          renderHTML={(text) => <BlogPreviewLight content={text} />}
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
              value={updateBlog ?  categoryId : undefined}
              onChange={(e) => setCategoryId(e.target.value as number)}
            >
              {archives.categoryList.map((value) => (
                <option value={value.id} key={value.id}>
                  {value.name}
                </option>
              ))}
            </Select>

            <Typography>
              添加标签{" "}
              <span style={{ color: "grey", fontSize: 12 }}>
                已选择{tags.length}个
              </span>
            </Typography>
            <Button onClick={()=>{}}>选择</Button>
          </Stack>
        )}
        <Box>
          <Button  onClick={submit}>
            {
                updateBlog ? '提交修改' : '发布'
            }
          </Button>
        </Box>
      </Stack>

      {/*选择标签的弹窗*/}
      <AddPostTagModal
        show={true}
        onOk={(values) => {
          setTags(values);
        }}
        initVal={tags}
       onClose={()=>{}}/>
    </MyBox>
  );
};
export default AddPostPage;
