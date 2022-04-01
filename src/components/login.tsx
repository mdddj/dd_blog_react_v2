import React, {useState} from "react";
import {
    Box, Button, Heading, Icon, IconButton, Input,
    Popover, PopoverArrow,
    PopoverContent,
    PopoverTrigger, Stack, useDisclosure
} from "@chakra-ui/react";
import {blogApi, getAccessToken, removeAccessToken, saveAccessToken} from "../utils/request";
import {Result} from "dd_server_api_web/src/utils/ResultUtil";
import {useRecoilState, useSetRecoilState} from "recoil";
import {userProvider} from "../providers/user";
import {useMount} from "react-use";
import {MdEditNote} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {successMessageProvider} from "../providers/modal/success_modal";
import {showPasswordModal} from "../providers/setting";


const LoginComponent: React.FC = () => {


    const {onOpen, onClose, isOpen} = useDisclosure()
    const [user, setUser] = useRecoilState(userProvider)
    const firstFieldRef = React.useRef(null)
    const [username, setUserName] = useState('') //用户名
    const [password, setPassword] = useState('') //密码
    const [result, setResult] = useState<Result<string>>()
    let navigateFunction = useNavigate();

    const setMsg = useSetRecoilState(successMessageProvider)
    const passModal = useSetRecoilState(showPasswordModal)

    useMount(() => fetchUserData())

    //加载用户信息
    const fetchUserData = () => {
        const token = getAccessToken()
        if (token && token !== '') {
            blogApi().getUserInfo(token).then(value => {
                if (value.state === 200) {
                    setUser(value.data)
                }else{
                    removeAccessToken()
                }
            })
        }
    }

    //执行登录
    const login = () => {
        if (username.length === 0 || password.length === 0) {
            setMsg('请输入账号和密码')
            return;
        }
        blogApi().login(username, password).then(value => {
            setResult(value)
            if (value.state === 200) {
                saveAccessToken(value.data!!)
                fetchUserData()
                onClose()
            }
        })
    }

    return <>
        <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement='right'
            closeOnBlur={true}
        >
            <PopoverArrow />
            <PopoverTrigger>
                <div style={{position: 'fixed', bottom: '10px', right: '10px', fontSize: 10, color: 'grey'}}>
                    {!user && <span>登录</span>}
                    {user && <IconButton aria-label={'user-actions'} icon={<Icon as={MdEditNote} />} /> }
                </div>
            </PopoverTrigger>
            <PopoverContent p={5} m={5}>
                {/*未登录*/}
                {!user && <Box>
                    <Stack spacing={4}>
                        <Heading as={'h4'} size={'md'}>登录</Heading>
                        {result?.state !== 200 && <span style={{fontSize: 12, color: 'red'}}>{result?.message}</span>}
                        <Input placeholder={'用户名'} value={username} onChange={e => setUserName(e.target.value)}/>
                        <Input placeholder={'密码'} type={'password'} value={password}
                               onChange={event => setPassword(event.target.value)}/>
                        <Button onClick={login}>登录</Button>
                    </Stack>
                </Box>}

                {/*已登录*/}
                {user && <Box w={'100%'}>
                   <Stack direction={'column'}>
                       <Button w={'100%'} onClick={()=>{
                           navigateFunction('/add-post')
                           onClose()
                       }
                       }>发布博客</Button>
                       <Button w={'100%'} onClick={()=>{
                           passModal(true)
                           onClose()
                       }
                       }>修改密码</Button>
                       <Button w={'100%'} onClick={()=>{
                           blogApi().logout().then(value => {
                               successResultHandle(value,data => {
                                   setMsg(data)
                                   removeAccessToken()
                                   setUser(undefined)
                               })
                           })
                           onClose()
                       }
                       }>退出登录</Button>
                   </Stack>
                </Box> }
            </PopoverContent>
        </Popover>
    </>

}
export default LoginComponent