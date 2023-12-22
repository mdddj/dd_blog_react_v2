import React, { FunctionComponent, useState } from "react";
import { useMount } from "react-use";
import { formatDateUtil } from "../utils/DateUtil";
import { blogApi } from "../utils/request";
import PagerNextLoad from "./pager_next_load";
import { Comment } from "dd_server_api_web/dist/model/Comment";
import {
  PagerModel,
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import { ApiResponse } from "../models/app_model";
import { useSetRecoilState } from "recoil";
import { successMessageProvider } from "../providers/modal/success_modal";
import { useNavigate } from "react-router-dom";
import { Role } from "dd_server_api_web/dist/model/UserModel";
import Box from "./box/box";
import {
  Avatar,
  Button,
  Card,
  Input,
  Modal, ModalBody,
  ModalContent, ModalHeader,
  Textarea,
  Tooltip
} from "@nextui-org/react";

// 评论组件的参数
interface CommentComponentProps {
  type: string; // 评论类型
  id: number; //主键ID
  isBlogComment?: boolean; // 是否为博客的评论
}

// 提交表单的参数
interface CommentFormProps {
  onSubmit: (
    name: string,
    email: string,
    url: string,
    content: string,
    avatarUrl: string
  ) => void;
  parentComment?: Comment;
}

// 博客评论的组件
const CommentComponent: FunctionComponent<CommentComponentProps> = ({
  type,
  id,
}) => {
  const [commmentList, setCommmentList] = useState<Comment[]>([]); // 评论列表
  const [replyComment, setReplyComment] = useState<Comment>(); // 回复对象
  const [pager, setPager] = useState<PagerModel | undefined>(undefined);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const setMsg = useSetRecoilState(successMessageProvider);

  //组件被挂载
  useMount(async () => {
    await fetchCommentList(0);
  });

  //加载评论列表
  const fetchCommentList = async (page: number) => {
    setNextPageLoading(true);
    setCommmentList([]);
    let result: Result<{
      list: Comment[];
      page: PagerModel;
    }> = await blogApi().requestT("/api/public/find-comment", {
      page: page,
      findKey: `${id}`,
      type: type,
    });
    successResultHandle(result, (data) => {
      setCommmentList([...commmentList, ...(data.list ?? [])]);
      setPager(data.page);
    });
    setNextPageLoading(false);
  };

  //提交留言
  const submit = async (
    name: string,
    email: string,
    url: string,
    content: string,
    avatarUrl: string
  ) => {
    let json = {
      email: email,
      website: url,
      content: content,
      name: name,
      type: type,
      findKey: id,
      avatarUrl: avatarUrl,
      parentCommentId: replyComment?.id,
    };
    let result = await blogApi().requestT<ApiResponse<Comment>>(
      "/api/public/add-comment",
      json,
      "POST"
    );
    console.log(result);
    setMsg(result.message);
  };

  // 回复
  const onReply = (comment: Comment) => {
    setReplyComment(comment);
  };

  return (
    <div>
      <div>
        <span className={'font-bold text-large'}>评论</span>
      </div>
      <div>
        <div className={'flex flex-col gap-2'}>
          {/* 发布评论表单 */}
          <CommentForm onSubmit={submit}/>

          {/* 加载评论列表 */}
          {commmentList.map((v) => (
              <CommentLayout key={v.id} comment={v} onReply={onReply}/>
          ))}
          {/* 回复的弹窗 */}
          <Modal
              backdrop={'blur'}
              placement={'bottom'}
              size={'5xl'}
              onClose={() => {
                setReplyComment(undefined);
              }}
              isOpen={replyComment !== undefined}
          >
            <ModalContent>
              <ModalHeader>
                {replyComment && (
                    <span>
                回复{replyComment.name} : {replyComment.content}
              </span>
                )}
              </ModalHeader>
              <ModalBody>
                  <CommentForm onSubmit={submit} parentComment={replyComment}/>
              </ModalBody>
            </ModalContent>
          </Modal>

          {pager && (
              <PagerNextLoad
                  pager={pager}
                  onload={async () => {
                    await fetchCommentList(pager.currentPage + 1);
                  }}
                  loading={nextPageLoading}
              />
          )}
        </div>
      </div>
    </div>
  );
};

// 评论输入表单封装
const CommentForm: React.FC<CommentFormProps> = (props) => {
  const [name, setName] = useState(""); //昵称
  const [email, setEmail] = useState(""); //邮箱
  const [url, setUrl] = useState(""); // 网站链接
  const [content, setContent] = useState(""); //评论内容

  //验证错误的消息
  const errorMsg = (msg: string) => {

  };

  //提交留言
  const submit = () => {
    //进行验证
    if (name === "") {
      errorMsg("怎么称呼呢?");
      return;
    }
    if (email === "") {
      errorMsg("邮箱可以在收到回复的时候收到通知,请填写");
      return;
    }
    if (content === "") {
      errorMsg("说点什么吧?");
      return;
    }

    //提交
    props.onSubmit(name, email, url, content,"");
  };

  let rep = props.parentComment
  return (
    <div className={'flex gap-5'}>
      <Avatar/>
      <div className={'flex-auto flex flex-col gap-2'}>
        <div className={'grid grid-cols-3 gap-2'}>
          <div >
            <Input
              fullWidth={true}
              label={"昵称"}
              value={name}
              isRequired={true}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Input
              fullWidth={true}
              label={"邮箱"}
              isRequired={true}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div >
            <Input
              fullWidth={true}
              label={"网站"}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
              }}
            />
          </div>
        </div>
        <Textarea
            fullWidth={true}
            placeholder={rep ? `回复${rep.name}:${rep.content}` : "说点什么吧"}
            onChange={(e) => setContent(e.target.value)}
            value={content}
            isRequired={true}
        />

        <Button onClick={submit} isDisabled={content.trim().length === 0}>
          发表评论
        </Button>
      </div>
    </div>
  );
};

// 评论列表
//@params comment 评论模型
//@params onReply 回复事件
//@params isChildComment 是否为回复的评论
const CommentLayout: React.FC<{
  comment: Comment;
  onReply?: (comment: Comment) => void;
  isChildComment?: boolean;
}> = ({ comment, onReply }) => {
  const getRoleIcons = (): Role[] => {
    let roles = comment.user?.roles ?? [];
    return roles.filter((v) => v.icon !== undefined && v.icon !== "");
  };
  let roleIcons = getRoleIcons();
  return (
    <div className={'flex w-60 gap-2'}>
      <div>
        <Avatar
          src={comment.user?.picture ?? comment.avatarUrl}
        />
      </div>
      <div className={'flex flex-col gap-2'}>
        <div>
          <div
          >
            <span className={'font-bold text-primary'}> {comment.name}</span>
            {roleIcons.map((v) => (
              <span key={v.id}>
                <Tooltip title={v.description}>
                  <img
                    src={v.icon}
                    width={24}
                    height={24}
                    alt="role"
                    style={{ marginLeft: 2 }}
                  />
                </Tooltip>
              </span>
            ))}
          </div>
          <Box>
            <span className={'text-default'} >
              {formatDateUtil(comment.createDate)}
            </span>
          </Box>
        </div>
        <Box>
          <span className={'text-foreground'}>{comment.content}</span>
        </Box>
        <Box
          onClick={() => {
            onReply?.(comment);
          }}
        >
          <span style={{ cursor: "pointer" }}>回复</span>
        </Box>
        {comment.childComment.length !== 0 && (
          <ChildCommentNode childs={comment.childComment} onReply={onReply} />
        )}
      </div>
    </div>
  );
};

// 子评论渲染
const ChildCommentNode: React.FC<{
  childs: Comment[];
  onReply?: (comment: Comment) => void;
}> = ({ childs, onReply }) => {
  return (
    <Card>
      {childs.map((value) => (
        <CommentLayout
          comment={value}
          key={value.id}
          onReply={onReply}
          isChildComment
        />
      ))}
    </Card>
  );
};

export default CommentComponent;
