import {
    AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay,
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    SimpleGrid,
    Spacer,
    Stack,
    Textarea,
    useDisclosure,
    useToast,
    Wrap,
    WrapItem,
    AlertDialog
} from "@chakra-ui/react";
import {Comment} from "dd_server_api_web/apis/model/Comment";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import React, {FunctionComponent, useState} from "react";
import {useMount} from "react-use";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {systemAvatars} from "../providers/avatars";
import {formatDateUtil} from "../utils/DateUtil";
import {blogApi} from "../utils/request";
import {successMessageProvider} from "../providers/modal/success_modal";
import {PagerModel} from "dd_server_api_web/src/utils/ResultUtil";
import PagerNextLoad from "./pager_next_load";
import UserWidget from "./user_widget";

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
const CommentComponent: FunctionComponent<CommentComponentProps> = ({type, id}) => {


    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()

    const [commmentList, setCommmentList] = useState<Comment[]>([])// 评论列表
    const [replyComment, setReplyComment] = useState<Comment>() // 回复对象
    const [pager,setPager] = useState<PagerModel|undefined>(undefined)
    const [nextPageLoading,setNextPageLoading] = useState(false)


    //组件被挂载
    useMount(async () => {
        await fetchCommentList(0)
    })

    //加载评论列表
    const fetchCommentList = async (page: number) => {
        setNextPageLoading(true)
        let result = await blogApi().findComment({
            page: page,
            findKey: `${id}`,
            type: type
        });
        successResultHandle(result, data => {
            setCommmentList([...commmentList, ...data.list ?? []])
            setPager(data.page)
        })
        setNextPageLoading(false)
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
            successResultHandle(v, _ => {
                successMsg(v.message)
            }, msg => successMsg(msg, 'error'))
        })
    }


    // 回复
    const onReply = (comment: Comment) => {
        onOpen()
        setReplyComment(comment)

    }

    return (<Box p={2} >
        <Heading mb={5}>评论</Heading>

        {/* 发布评论表单 */}
        <CommentForm onSubmit={submit}/>


        {/* 加载评论列表 */}
        <Divider mt={5} mb={5}/>
        {
            commmentList.map(v => <CommentLayout key={v.id} comment={v} onReply={onReply}/>)
        }
        {/* 回复的弹窗 */}
        <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerHeader borderBottomWidth='1px'>回复</DrawerHeader>
                <DrawerBody>
                    <Container maxW={'container.lg'} p={5}>
                        <Stack spacing={5}>
                            {replyComment && <span>回复{replyComment.name} : {replyComment.content}</span>}

                            <CommentForm onSubmit={submit}/>
                        </Stack>
                    </Container>
                </DrawerBody>
            </DrawerContent>
        </Drawer>

        {
            pager && <PagerNextLoad pager={pager} onload={async ()=>{
                await fetchCommentList(pager.currentPage+1)
            }} loading={nextPageLoading} />
        }

    </Box>);
}


// 评论输入表单封装
const CommentForm: React.FC<CommentFormProps> = (props) => {


    const toast = useToast()

    const [name, setName] = useState('') //昵称
    const [email, setEmail] = useState('') //邮箱
    const [url, setUrl] = useState('') // 网站链接
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

    return <div style={{
        marginTop: 22
    }}>
        <SimpleGrid columns={[2, null, 3]} spacing='12px'>
            <Box>
                <InputGroup>
                    <InputLeftAddon children='昵称'/>
                    <Input type='text' style={{fontSize: 12}} placeholder='请输入昵称'
                           onChange={e => setName(e.target.value)} value={name}/>
                </InputGroup>
            </Box>
            <Box>
                <InputGroup>
                    <InputLeftAddon children='邮箱'/>
                    <Input type='tel' style={{fontSize: 12}} placeholder='请输入邮箱'
                           onChange={e => setEmail(e.target.value)} value={email}/>
                </InputGroup>
            </Box>
            <Box>
                <InputGroup>
                    <InputLeftAddon children='网址'/>
                    <Input type='url' style={{fontSize: 12}} placeholder='链接网址' onChange={e => setUrl(e.target.value)}
                           value={url}/>
                </InputGroup>
            </Box>
        </SimpleGrid>
        <Textarea placeholder='说点什么吧' style={{fontSize: 12}} mt={2} onChange={e => setContent(e.target.value)}
                  value={content}/>
        <Flex mt={2} alignItems={'center'}>
            <Popover isOpen={open} onClose={() => setOpen(false)}>
                <PopoverTrigger>
                    {
                        avatarUrl === '' ? <Avatar/> : <Avatar src={avatarUrl}/>
                    }

                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow/>
                    <PopoverCloseButton/>
                    <PopoverHeader>系统预设头像,点击更换</PopoverHeader>
                    <PopoverBody>
                        <Wrap>
                            {avatars.map(v => <WrapItem key={v.id} onClick={() => setAvatarUrl(v.url)}>
                                <Avatar src={v.url}/>
                            </WrapItem>)}
                        </Wrap>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <span style={{marginLeft: 12, color: 'gray', fontSize: 12}} onClick={() => setOpen(true)}>切换头像</span>
            <Spacer/>
            <Stack direction={'row'}>
                <Button colorScheme={'blue'} onClick={submit}>发布</Button>
            </Stack>
        </Flex>

    </div>
}


// 评论列表
//@params comment 评论模型
//@params onReply 回复事件
//@params isChildComment 是否为回复的评论
const CommentLayout: React.FC<{ comment: Comment, onReply?: (comment: Comment) => void, isChildComment?: boolean }> = ({
                                                                                                                           comment,
                                                                                                                           onReply,
                                                                                                                           isChildComment
                                                                                                                       }) => {


    const {isOpen, onClose, onOpen} = useDisclosure() // 删除的开关
    const ref = React.createRef<any>()
    const setMsg = useSetRecoilState(successMessageProvider)

    return <div style={{marginBottom: 12, marginTop: 12, position: 'relative'}}>
        <Flex>
            <Avatar src={comment.avatarUrl}/>
            <Box w={2}/>
            <Box flex={1}>
                <span style={{fontSize: 12, color: 'grey', marginRight: 12}}>{comment.name}</span> {
                isChildComment && <span><span style={{fontSize: 12, color: 'grey', marginRight: 6}}>回复</span> <span
                    style={{fontSize: 12, color: 'black', marginRight: 6}}>{comment.parentComment?.name}</span></span>
            } <span style={{fontSize: 12, color: 'grey'}}>{formatDateUtil(comment.createDate)}</span>


                {/* 主评论显示区域 */}
                <Box mt={2}>
                    {comment.content}


                    {/* 如果是回复类型的评论,需要展示,回复父评论的那句话 */}
                    {
                        isChildComment && <Box mt={2} bg={'gray.200'} fontSize={10} p={2} borderRadius={5} style={{
                            textOverflow: 'ellipsis',
                            display: 'block',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {comment.parentComment?.name + ': ' + comment.parentComment?.content}
                        </Box>
                    }
                </Box>


                {/* 操作区域: 回复按钮 */}
                <Box mt={5} display={'block'}>
                    <span style={{cursor: 'pointer', color: 'grey', fontSize: 12}}
                          onClick={() => {
                              onReply && onReply(comment)
                          }} >回复</span>
                    <UserWidget>
                        <span style={
                            {
                                fontSize: 12,
                                color: 'grey',
                                marginLeft: 12,
                                cursor: 'pointer'
                            }
                        } onClick={()=>onOpen()}>删除</span>
                    </UserWidget>
                </Box>

                {/* 渲染子评论 */}
                {
                    !isChildComment && <ChildCommentNode childs={comment.childComment} onReply={onReply}/>
                }

            </Box>
        </Flex>
        {
            isChildComment && <ChildCommentNode childs={comment.childComment} onReply={onReply}/>
        }


        {/*    删除确认的弹窗   */}
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={ref}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        提示
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        确定永久删除整条评论吗?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>
                            取消
                        </Button>
                        <Button colorScheme='red' onClick={()=>{
                            onClose()
                            blogApi().removeComment(comment.id).then(value => {
                                successResultHandle(value,data => {
                                    setMsg(data)
                                })
                            })
                        }} ml={3}>
                            删除
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

    </div>
}


// 子评论渲染
const ChildCommentNode: React.FC<{ childs: Comment[], onReply?: (comment: Comment) => void }> = ({childs, onReply}) => {

    return <>
        {
            childs.map(value => <CommentLayout comment={value} key={value.id} onReply={onReply} isChildComment/>)
        }
    </>
}

export default CommentComponent;