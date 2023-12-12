import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogApi } from "../utils/request";
import { useMount } from "react-use";
import {useSetRecoilState} from "recoil";
import { appLoading } from "../providers/loading";
import TwoColumnLayout from "../components/two_column_layout";
import UserCardWithBlogDetail from "../components/user/user_card";
import MarkdownView from "../components/MarkdownView";
import CommentComponent from "../components/comment_component";
import { BlogData } from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import { Result } from "dd_server_api_web/dist/utils/ResultUtil";
import { UserWidget } from "../components/user_widget";
import { ApiResponse } from "../models/app_model";
import Box from "../components/box/box";
import {Button, Modal, ModalContent, ModalHeader} from "@nextui-org/react";
//博客详情页面
const BlogPage: React.FC = () => {
  let { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogData>();
  const [modalShow, setModalShow] = useState<boolean>(false);
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

  //显示删除博客确认弹窗
  const showDeleteBlogConfireModal = () => {
    setModalShow(true);
  };

  //请求删除接口
  const onDeleteConfire = async () => {
    try {
       await blogApi().requestT<ApiResponse<boolean>>(
        "/api/auth/blog-delete",
        { id: blog?.id },
        "DELETE"
      );
    } catch (err) {}
  };

  return (
    <>
      <TwoColumnLayout
        right={[<UserCardWithBlogDetail loginNmae={"admin"} />]}
        bottomComponent={
          <>
            {blog && (
              <CommentComponent type={"blog"} id={blog.id} isBlogComment />
            )}{" "}
          </>
        }
      >
        <span
          style={{
            marginBottom: "22px",
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => nav(-1)}
        >
          返回上一页
        </span>
        <div >
          {blog?.title}
        </div>
        <div >
          发布时间:{blog?.dateString}
        </div>
        <Box>
          {blog && <MarkdownView content={blog.content} />}
        </Box>
        <div className={'flex gap-2'}>
            <UserWidget>
              <Button
                onClick={() => {
                  nav("/add-post?id=" + blog?.id);
                }}
              >
                编辑博客
              </Button>
            </UserWidget>
            <UserWidget>
              <Button onClick={() => showDeleteBlogConfireModal()}>
                删除博客
              </Button>
            </UserWidget>
        </div>

        <Modal isOpen={modalShow} onClose={() => setModalShow(false)}>
          <ModalHeader>删除博客</ModalHeader>
          <ModalContent>
            <Button onClick={onDeleteConfire}>确认删除</Button>
          </ModalContent>
        </Modal>
      </TwoColumnLayout>
    </>
  );
};

export default BlogPage;
