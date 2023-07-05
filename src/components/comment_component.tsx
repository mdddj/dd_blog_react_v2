import React, { FunctionComponent, useState } from "react";
import { useMount } from "react-use";
import { formatDateUtil } from "../utils/DateUtil";
import { blogApi } from "../utils/request";
import PagerNextLoad from "./pager_next_load";
import { Comment } from "dd_server_api_web/dist/model/Comment";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  PagerModel,
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";

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

  //组件被挂载
  useMount(async () => {
    await fetchCommentList(0);
  });

  //加载评论列表
  const fetchCommentList = async (page: number) => {
    setNextPageLoading(true);
    let result: Result<{
      list: Comment[];
      page: PagerModel;
    }> = await blogApi().findComment({
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

  // 成功提示
  const successMsg = (
    msg: string,
    sts?: "success" | "info" | "warning" | "error" | undefined
  ) => {};

  //提交留言
  const submit = (
    name: string,
    email: string,
    url: string,
    content: string,
    avatarUrl: string
  ) => {
    //提交
    blogApi()
      .submitComment({
        email: email,
        website: url,
        content: content,
        name: name,
        type: type,
        findKey: id,
        avatarUrl: avatarUrl,
        parentCommentId: replyComment?.id,
      })
      .then((v: Result<Comment>) => {
        successResultHandle(
          v,
          (_) => {
            successMsg(v.message);
          },
          (msg) => successMsg(msg, "error")
        );
      });
  };

  // 回复
  const onReply = (comment: Comment) => {
    setReplyComment(comment);
  };

  return (
    <Box>
      <Typography>评论</Typography>

      {/* 发布评论表单 */}
      <CommentForm onSubmit={submit} />

      {/* 加载评论列表 */}
      <Divider />
      {commmentList.map((v) => (
        <CommentLayout key={v.id} comment={v} onReply={onReply} />
      ))}
      {/* 回复的弹窗 */}
      <Drawer onClose={() => {}} open={false}>
        <span>回复</span>
        <Stack spacing={5}>
          {replyComment && (
            <span>
              回复{replyComment.name} : {replyComment.content}
            </span>
          )}

          <CommentForm onSubmit={submit} />
        </Stack>
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
  const [name, setName] = useState(""); //昵称
  const [email, setEmail] = useState(""); //邮箱
  const [url, setUrl] = useState(""); // 网站链接
  const [content, setContent] = useState(""); //评论内容
  // const [avatarUrl, setAvatarUrl] = useState('') //用户头像
  // const [open, setOpen] = useState(false) //是否显示选择头像的组件

  // const avatars = useRecoilValue(systemAvatars) // 系统预设头像

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
    props.onSubmit(name, email, url, content, "");
  };

  return (
    <div
      style={{
        marginTop: 22,
      }}
    >
      <Grid
        columns={{ xs: 6, sm: 12, md: 12 }}
        container
        spacing={{ xs: 2, md: 3 }}
      >
        <Grid item xs={2} sm={4} md={4}>
          <TextField
            fullWidth={true}
            label={"昵称"}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <TextField
            fullWidth={true}
            label={"邮箱"}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          <TextField
            fullWidth={true}
            label={"网站"}
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
      <Button onClick={submit} variant={"contained"} sx={{mt: 2}}>
        评论
      </Button>
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
}> = ({ comment, onReply, isChildComment }) => {
  return (
    <div style={{ marginBottom: 12, marginTop: 12, position: "relative" }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={comment.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.name}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {formatDateUtil(comment.createDate)}评论:
              </Typography>
              {comment.content}
            </React.Fragment>
          }
        ></ListItemText>
        {/*<Box flex={1}>*/}
        {/*    <span style={{fontSize: 12, color: 'grey', marginRight: 12}}>{comment.name}</span> {*/}
        {/*    isChildComment && <span><span style={{fontSize: 12, color: 'grey', marginRight: 6}}>回复</span> <span*/}
        {/*        style={{fontSize: 12, color: 'black', marginRight: 6}}>{comment.parentComment?.name}</span></span>*/}
        {/*} <span style={{fontSize: 12, color: 'grey'}}>{formatDateUtil(comment.createDate)}</span>*/}

        {/*    /!* 主评论显示区域 *!/*/}
        {/*    <Box mt={2}>*/}
        {/*        {comment.content}*/}

        {/*        /!* 如果是回复类型的评论,需要展示,回复父评论的那句话 *!/*/}
        {/*        {*/}
        {/*            isChildComment && <Box  style={{*/}
        {/*                textOverflow: 'ellipsis',*/}
        {/*                display: 'block',*/}
        {/*                WebkitLineClamp: 2,*/}
        {/*                overflow: 'hidden',*/}
        {/*                WebkitBoxOrient: 'vertical'*/}
        {/*            }}>*/}
        {/*                {comment.parentComment?.name + ': ' + comment.parentComment?.content}*/}
        {/*            </Box>*/}
        {/*        }*/}
        {/*    </Box>*/}

        {/*    /!* 操作区域: 回复按钮 *!/*/}
        {/*    <Box mt={5} display={'block'}>*/}
        {/*        <span style={{cursor: 'pointer', color: 'grey', fontSize: 12}}*/}
        {/*              onClick={() => {*/}
        {/*                  onReply && onReply(comment)*/}
        {/*              }} >回复</span>*/}
        {/*        <UserWidget>*/}
        {/*            <span style={*/}
        {/*                {*/}
        {/*                    fontSize: 12,*/}
        {/*                    color: 'grey',*/}
        {/*                    marginLeft: 12,*/}
        {/*                    cursor: 'pointer'*/}
        {/*                }*/}
        {/*            } onClick={()=>{}}>删除</span>*/}
        {/*        </UserWidget>*/}
        {/*    </Box>*/}

        {/*    /!* 渲染子评论 *!/*/}
        {/*    {*/}
        {/*        !isChildComment && <ChildCommentNode childs={comment.childComment} onReply={onReply}/>*/}
        {/*    }*/}

        {/*</Box>*/}
      </ListItem>
      {isChildComment && (
        <ChildCommentNode childs={comment.childComment} onReply={onReply} />
      )}

      {/*    删除确认的弹窗   */}
      {/*<AlertDialog*/}
      {/*    isOpen={isOpen}*/}
      {/*    onClose={onClose}*/}
      {/*    leastDestructiveRef={ref}>*/}
      {/*    <AlertDialogOverlay>*/}
      {/*        <AlertDialogContent>*/}
      {/*            <AlertDialogHeader fontSize='lg' fontWeight='bold'>*/}
      {/*                提示*/}
      {/*            </AlertDialogHeader>*/}

      {/*            <AlertDialogBody>*/}
      {/*                确定永久删除整条评论吗?*/}
      {/*            </AlertDialogBody>*/}

      {/*            <AlertDialogFooter>*/}
      {/*                <Button onClick={onClose}>*/}
      {/*                    取消*/}
      {/*                </Button>*/}
      {/*                <Button colorScheme='red' onClick={()=>{*/}
      {/*                    onClose()*/}
      {/*                    blogApi().removeComment(comment.id).then(value => {*/}
      {/*                        successResultHandle(value,data => {*/}
      {/*                            setMsg(data)*/}
      {/*                        })*/}
      {/*                    })*/}
      {/*                }} ml={3}>*/}
      {/*                    删除*/}
      {/*                </Button>*/}
      {/*            </AlertDialogFooter>*/}
      {/*        </AlertDialogContent>*/}
      {/*    </AlertDialogOverlay>*/}
      {/*</AlertDialog>*/}
    </div>
  );
};

// 子评论渲染
const ChildCommentNode: React.FC<{
  childs: Comment[];
  onReply?: (comment: Comment) => void;
}> = ({ childs, onReply }) => {
  return (
    <>
      {childs.map((value) => (
        <CommentLayout
          comment={value}
          key={value.id}
          onReply={onReply}
          isChildComment
        />
      ))}
    </>
  );
};

export default CommentComponent;
