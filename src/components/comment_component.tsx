import React, { FunctionComponent, useEffect, useState } from "react";
import { useMount } from "react-use";
import { formatDateUtil } from "../utils/DateUtil";
import { blogApi } from "../utils/request";
import PagerNextLoad from "./pager_next_load";
import { Comment } from "dd_server_api_web/dist/model/Comment";
import {
  Avatar,
  Box,
  Button,
  Card,
  Drawer,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  PagerModel,
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import { ApiResponse } from "../models/app_model";
import { useRecoilState, useSetRecoilState } from "recoil";
import { successMessageProvider } from "../providers/modal/success_modal";
import { userProvider } from "../providers/user";
import { useNavigate } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import { Role } from "dd_server_api_web/dist/model/UserModel";

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
    <Box>
      <Typography variant={"h6"}>评论</Typography>

      {/* 发布评论表单 */}
      <CommentForm onSubmit={submit} />
      <Box height={12} />

      {/* 加载评论列表 */}
      {commmentList.map((v) => (
        <CommentLayout key={v.id} comment={v} onReply={onReply} />
      ))}
      {/* 回复的弹窗 */}
      <Drawer
        onClose={() => {
          setReplyComment(undefined);
        }}
        open={replyComment !== undefined}
        anchor={"right"}
      >
        <Box sx={{ p: 6 }}>
          <Stack spacing={5}>
            {replyComment && (
              <span>
                回复{replyComment.name} : {replyComment.content}
              </span>
            )}
            <CommentForm onSubmit={submit} />
          </Stack>
        </Box>
      </Drawer>

      {pager && (
        <PagerNextLoad
          pager={pager}
          onload={async () => {
            await fetchCommentList(pager.currentPage + 1);
          }}
          loading={nextPageLoading}
        />
      )}
    </Box>
  );
};

// 评论输入表单封装
const CommentForm: React.FC<CommentFormProps> = (props) => {
  const nav = useNavigate();
  const [name, setName] = useState(""); //昵称
  const [email, setEmail] = useState(""); //邮箱
  const [url, setUrl] = useState(""); // 网站链接
  const [content, setContent] = useState(""); //评论内容
  const [user] = useRecoilState(userProvider);
  const [avatarUrl, setAvatarUrl] = useState(""); //用户头像
  // const [open, setOpen] = useState(false) //是否显示选择头像的组件

  // const avatars = useRecoilValue(systemAvatars) // 系统预设头像

  useEffect(() => {
    if (user) {
      setName(user.nickName);
      setEmail(user.email);
      setAvatarUrl(user.picture);
    }
  }, [user]);

  //验证错误的消息
  const errorMsg = (msg: string) => {};

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
    props.onSubmit(name, email, url, content, avatarUrl);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyItems: "start",
        flexFlow: "row",
        marginTop: 2,
      }}
    >
      <Avatar
        src={avatarUrl}
        sx={{ mr: 2 }}
        onClick={() => {
          if (!user) {
            nav("/login");
          }
        }}
      ></Avatar>
      <Box sx={{ flex: 1 }}>
        <Grid
          columns={{ xs: 6, sm: 12, md: 12 }}
          container
          spacing={{ xs: 2, md: 3 }}
        >
          <Grid item xs={2} sm={4} md={4}>
            <TextField
              fullWidth={true}
              label={"昵称"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <TextField
              fullWidth={true}
              label={"邮箱"}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <TextField
              fullWidth={true}
              label={"网站"}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <TextField
          fullWidth={true}
          multiline={true}
          placeholder="说点什么吧"
          style={{ fontSize: 12, marginTop: 22 }}
          onChange={(e) => setContent(e.target.value)}
          value={content}
          rows={4}
          margin={"dense"}
        />
        <Button onClick={submit} variant={"contained"} sx={{ mt: 2 }}>
          发表评论
        </Button>
      </Box>
    </Box>
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
}> = ({ comment, onReply, isChildComment }) => {
  const getRoleIcons = (): Role[] => {
    let roles = comment.user?.roles ?? [];
    return roles.filter((v) => v.icon !== undefined && v.icon !== "");
  };
  let roleIcons = getRoleIcons();
  return (
    <Box
      sx={{
        display: "flex",
        marginBottom: 2,
        justifyItems: "start",
        // marginLeft: isChildComment ? 4 : undefined,
      }}
    >
      <Box>
        <Avatar
          src={comment.user?.picture ?? comment.avatarUrl}
          sx={{ mr: 2 }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexFlow: "wrap",
              alignItems: "end",
            }}
          >
            <Typography variant={"h6"}> {comment.name}</Typography>
            {roleIcons.map((v) => (
              <Typography variant={"body2"} key={v.id}>
                <Tooltip title={v.description}>
                  <img
                    src={v.icon}
                    width={24}
                    height={24}
                    alt="role"
                    style={{ marginLeft: 2 }}
                  />
                </Tooltip>
              </Typography>
            ))}
          </Box>
          <Box>
            <Typography variant={"subtitle2"} color={"gray"}>
              {formatDateUtil(comment.createDate)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant={"body1"}>{comment.content}</Typography>
        </Box>
        <Box
          color={"gray"}
          sx={{
            display: "flex",
            justifyItems: "center",
          }}
          onClick={() => {
            onReply?.(comment);
          }}
        >
          <CommentIcon sx={{ mr: 1, cursor: "pointer" }} />
          <Typography style={{ cursor: "pointer" }}>回复</Typography>
        </Box>
        {comment.childComment.length !== 0 && (
          <ChildCommentNode childs={comment.childComment} onReply={onReply} />
        )}
      </Box>
    </Box>
  );
};

// 子评论渲染
const ChildCommentNode: React.FC<{
  childs: Comment[];
  onReply?: (comment: Comment) => void;
}> = ({ childs, onReply }) => {
  return (
    <Card sx={{ mt: 2 }}>
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
