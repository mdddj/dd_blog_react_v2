import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogApi } from "../utils/request";
import { useMount } from "react-use";
import TwoColumnLayout from "../components/two_column_layout";
import UserCardWithBlogDetail from "../components/user/user_card";
import MarkdownView from "../components/MarkdownView";
import CommentComponent from "../components/comment_component";
import { BlogData } from "dd_server_api_web/dist/model/result/BlogPushNewResultData";
import { Result } from "dd_server_api_web/dist/utils/ResultUtil";
import { ApiResponse } from "../models/app_model";
import {Button, Modal, ModalContent, ModalHeader} from "@nextui-org/react";
//博客详情页面
const BlogPage: React.FC = () => {
  let { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogData>();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const nav = useNavigate();


  useMount(() => getBlogDetail());

  const getBlogDetail = () => {
    id &&
      blogApi()
        .getBlogDetailById(parseInt(id))
        .then((r: Result<BlogData>) => {
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
        {/*<span*/}
        {/*  style={{*/}
        {/*    marginBottom: "22px",*/}
        {/*    marginTop: "12px",*/}
        {/*    display: "flex",*/}
        {/*    alignItems: "center",*/}
        {/*    cursor: "pointer",*/}
        {/*  }}*/}
        {/*  onClick={() => nav(-1)}*/}
        {/*>*/}
        {/*  返回上一页*/}
        {/*</span>*/}
          <div>
              <div className={'font-bold text-large'}>
                  {blog?.title}
              </div>
              <div className={'text-default-500 text-sm mb-3'}>
                  发布于{blog?.dateString}
              </div>
              <div>
                  {blog && <MarkdownView content={blog.content}/>}
              </div>
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
