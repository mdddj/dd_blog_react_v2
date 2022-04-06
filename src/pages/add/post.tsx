import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import MyBox from "../../components/box/my_box";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { BlogPreviewLight } from "../../components/blog_content_light";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { archivesDataState } from "../../providers/archives";
import AddPostTagModal from "./add_post_tag_modal";
import { blogApi } from "../../utils/request";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import { useSearchParams } from "react-router-dom";
import { useMount, useToggle } from "react-use";
import { successMessageProvider } from "../../providers/modal/success_modal";
import { BlogData } from "dd_server_api_web/apis/model/result/BlogPushNewResultData";

// 发布博客页面
const AddPostPage: React.FC = () => {
  let archives = useRecoilValue(archivesDataState);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [on, toggle] = useToggle(false);
  const toast = useToast();
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
        .then((r) => {
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
      .then((value) => {
        console.log(value);
        successResultHandle(
          value,
          (data) => {
            toast({
              title: "发布成功",
              status: "success",
              isClosable: true,
            });
          },
          (message) => {
            toast({
              title: `${message}`,
              status: "error",
              isClosable: true,
            });
          }
        );
      });
  };

  return (
    <MyBox>
      {on && <Spinner />}
      <Stack direction={"column"} spacing={5}>
        <Heading as={"h4"} size={"md"}>
          发布博客
        </Heading>
        <Input
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
        />

        {archives && (
          <Stack direction={"column"} spacing={2}>
            <Heading as={"h5"} size={"sm"}>
              文章分类
            </Heading>
            <Select
              placeholder="文章分类"
              onChange={(e) => setCategoryId(parseInt(e.target.value))}
            >
              {archives.categoryList.map((value) => (
                <option value={value.id} key={value.id}>
                  {value.name}
                </option>
              ))}
            </Select>

            <Heading as={"h5"} size={"sm"}>
              添加标签{" "}
              <span style={{ color: "grey", fontSize: 12 }}>
                已选择{tags.length}个
              </span>
            </Heading>
            <Button onClick={() => onOpen()}>选择</Button>
          </Stack>
        )}
        <Box textAlign={"right"}>
          <Button colorScheme={"blue"} onClick={submit}>
            {
                updateBlog ? '提交修改' : '发布'
            }
          </Button>
        </Box>
      </Stack>

      {/*选择标签的弹窗*/}
      <AddPostTagModal
        show={isOpen}
        onClose={onClose}
        onOk={(values) => {
          setTags(values);
        }}
        initVal={tags}
      />
    </MyBox>
  );
};
export default AddPostPage;
