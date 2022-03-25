import React, {useState} from "react";
import {
    Box, Button, Heading, Icon, IconButton, Input,
    Popover, PopoverArrow,
    PopoverContent,
    PopoverTrigger, Stack, useDisclosure
} from "@chakra-ui/react";
import {blogApi, getAccessToken, saveAccessToken} from "../utils/request";
import {Result} from "dd_server_api_web/src/utils/ResultUtil";
import {useRecoilState} from "recoil";
import {userProvider} from "../providers/user";
import {useMount} from "react-use";
import {MdEditNote} from "react-icons/md";
import {useNavigate} from "react-router-dom";


const LoginComponent: React.FC = () => {


    const {onOpen, onClose, isOpen} = useDisclosure()
    const [user, setUser] = useRecoilState(userProvider)
    const firstFieldRef = React.useRef(null)
    const [username, setUserName] = useState('admin') //用户名
    const [password, setPassword] = useState('123456') //密码
    const [result, setResult] = useState<Result<string>>()
    let navigateFunction = useNavigate();


    useMount(() => fetchUserData())

    //加载用户信息
    const fetchUserData = () => {
        const token = getAccessToken()
        if (token && token !== '') {
            blogApi().getUserInfo(token).then(value => {
                if (value.state === 200) {
                    setUser(value.data)
                }
            })
        }
    }

    //执行登录
    const login = () => {
        if (username.length === 0 || password.length === 0) {
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
                {user && <Box>
                    <Button onClick={()=>{
                        navigateFunction('/add-post')
                        onClose()
                    }
                    }>发布博客</Button>
                </Box> }
            </PopoverContent>
        </Popover>
    </>

}
export default LoginComponent