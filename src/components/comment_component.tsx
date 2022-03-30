import { Avatar, Box, Button, Container, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Heading, Input, InputGroup, InputLeftAddon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid, Spacer, Stack, Textarea, useDisclosure, useToast, Wrap, WrapItem } from "@chakra-ui/react";
import { Comment } from "dd_server_api_web/apis/model/Comment";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import React, { FunctionComponent, useState } from "react";
import { useMount } from "react-use";
import { useRecoilValue } from "recoil";
import { systemAvatars } from "../providers/avatars";
import { formatDateUtil } from "../utils/DateUtil";
import { blogApi } from "../utils/request";

// 评论组件的参数
interface CommentComponentProps {
    type: string, // 评论类型
    id: number, //主键ID
    isBlogComment?: boolean; // 是否为博客的评论
}

// 提交表单的参数
interface CommentFormProps {
    onSubmit: (
        name: string,
        email: string,
        url: string,
        content: string,
        avatarUrl: string,

    ) => void,
    parentComment?: Comment

}

// 博客评论的组件
const CommentComponent: FunctionComponent<CommentComponentProps> = ({ type, id }) => {


    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [commmentList, setCommmentList] = useState<Comment[]>([])// 评论列表
    const [replyComment, setReplyComment] = useState<Comment>()



    //组件被挂载
    useMount(() => {
        fetchCommentList(0)
    })

    //加载评论列表
    const fetchCommentList = async (page: number) => {
        let result = await blogApi().findComment({
            page: page,
            findKey: `${id}`,
            type: type
        });
        successResultHandle(result, data => {
            setCommmentList([...commmentList, ...data.list ?? []])
        })
    }


    // 成功提示
    const successMsg = (msg: string, sts?: "success" | "info" | "warning" | "error" | undefined) => {
        toast.closeAll()
        toast({
            title: msg,
            status: sts ?? 'success',
            duration: 3000
        })
    }

    //提交留言
    const submit = (name: string, email: string, url: string, content: string, avatarUrl: string) => {


        //提交
        blogApi().submitComment(
            {
                "email": email,
                "website": url,
                "content": content,
                "name": name,
                "type": type,
                "findKey": id,
                "avatarUrl": avatarUrl,
                "parentCommentId": replyComment?.id
            }
        ).then(v => {
            console.log(v)
            successResultHandle(v, data => {
                successMsg(v.message)
            }, msg => successMsg(msg, 'error'))
        })
    }


    // 回复
    const onReply = (comment: Comment) => {
        onOpen()
        setReplyComment(comment)

    }

    return (<div style={{ marginTop: 12 }}>
        <Heading>评论</Heading>
        <Divider mt={2} mb={2} />

        {/* 发布评论表单 */}
        <CommentForm onSubmit={submit} />


        {/* 加载评论列表 */}
        <Divider mt={5} mb={5} />
        {
            commmentList.map(v => <CommentLayout key={v.id} comment={v} onReply={onReply} />)
        }
        {/* 回复的弹窗 */}
        <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth='1px'>回复</DrawerHeader>
                <DrawerBody>
                    <Container maxW={'container.lg'} p={5}>
                        <Stack spacing={5}>
                            {replyComment && <span>回复{replyComment.name} : {replyComment.content}</span>}

                            <CommentForm onSubmit={submit} />
                        </Stack>
                    </Container>
                </DrawerBody>
            </DrawerContent>
        </Drawer>


    </div>);
}


// 评论输入表单封装
const CommentForm: React.FC<CommentFormProps> = (props) => {


    const toast = useToast()

    const [name, setName] = useState('梁典典') //昵称
    const [email, setEmail] = useState('413153189@qq.com') //邮箱
    const [url, setUrl] = useState('https://itbug.shop') // 网站链接
    const [content, setContent] = useState('') //评论内容
    const [avatarUrl, setAvatarUrl] = useState('') //用户头像
    const [open, setOpen] = useState(false) //是否显示选择头像的组件

    const avatars = useRecoilValue(systemAvatars) // 系统预设头像

    //验证错误的消息
    const errorMsg = (msg: string) => {
        toast.closeAll();
        toast({
            status: 'error',
            title: msg,
            duration: 3000
        })
    }

    //提交留言
    const submit = () => {
        //进行验证
        if (name === '') {
            errorMsg('怎么称呼呢?')
            return
        }
        if (email === '') {
            errorMsg('邮箱可以在收到回复的时候收到通知,请填写')
            return
        }
        if (content === '') {
            errorMsg('说点什么吧?')
            return
        }

        //提交
        props.onSubmit(name, email, url, content, avatarUrl);
    }

    return <>
        <SimpleGrid columns={[2, null, 3]} spacing='12px'>
            <Box>
                <InputGroup>
                    <InputLeftAddon children='昵称' />
                    <Input type='text' placeholder='请输入昵称' onChange={e => setName(e.target.value)} value={name} />
                </InputGroup>
            </Box>
            <Box>
                <InputGroup>
                    <InputLeftAddon children='邮箱' />
                    <Input type='tel' placeholder='请输入邮箱' onChange={e => setEmail(e.target.value)} value={email} />
                </InputGroup>
            </Box>
            <Box>
                <InputGroup>
                    <InputLeftAddon children='网址' />
                    <Input type='url' placeholder='链接网址' onChange={e => setUrl(e.target.value)} value={url} />
                </InputGroup>
            </Box>
        </SimpleGrid>
        <Textarea placeholder='说点什么吧' mt={2} onChange={e => setContent(e.target.value)} value={content} />
        <Flex mt={2} alignItems={'center'}>
            <Popover isOpen={open} onClose={() => setOpen(false)}>
                <PopoverTrigger>
                    {
                        avatarUrl === '' ? <Avatar /> : <Avatar src={avatarUrl} />
                    }

                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>系统预设头像,点击更换</PopoverHeader>
                    <PopoverBody>
                        <Wrap>
                            {avatars.map(v => <WrapItem key={v.id} onClick={() => setAvatarUrl(v.url)}>
                                <Avatar src={v.url} />
                            </WrapItem>)}
                        </Wrap>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <span style={{ marginLeft: 12, color: 'gray', fontSize: 12 }} onClick={() => setOpen(true)}>切换头像</span>
            <Spacer />
            <Stack direction={'row'} >
                <Button>预览</Button>
                <Button colorScheme={'blue'} onClick={submit}>发布</Button>
            </Stack>
        </Flex>

    </>
}


// 评论列表
const CommentLayout: React.FC<{ comment: Comment, onReply?: (comment: Comment) => void }> = ({ comment, onReply }) => {



    return <div style={{ marginBottom: 12, marginTop: 12 }}>
        <Flex>
            <Avatar src={comment.avatarUrl} />
            <Box w={2}></Box>
            <div>
                <span style={{ fontSize: 12, color: 'grey', marginRight: 12 }}>{comment.name}</span>  <span style={{ fontSize: 12, color: 'grey' }}>{formatDateUtil(comment.createDate)}</span>
                <Box mt={2}>
                    {comment.content}
                </Box>
                <Box mt={5}>
                    <Flex>
                        {
                            comment.childComment.length !== 0 ?
                                <span style={{
                                    cursor: 'pointer',
                                    color: 'gray',
                                    fontSize: 12
                                }}>查看{comment.childComment.length}条回复</span>
                                :
                                <span></span>
                        }
                        <Spacer />
                        <span style={{ cursor: 'pointer', color: 'blue', fontSize: 12 }}
                            onClick={() => {
                                onReply && onReply(comment)
                            }}>回复</span>
                    </Flex>
                </Box>
            </div>
        </Flex>




    </div>
}

export default CommentComponent;