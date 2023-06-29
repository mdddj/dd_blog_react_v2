import React, {useState} from "react";
import {blogApi, getAccessToken, removeAccessToken, saveAccessToken} from "../utils/request";
import {useRecoilState, useSetRecoilState} from "recoil";
import {userProvider} from "../providers/user";
import {useMount} from "react-use";
import {useNavigate} from "react-router-dom";
import {successMessageProvider} from "../providers/modal/success_modal";
import {showPasswordModal} from "../providers/setting";
import {Box, Button, Input, Popover, Stack, Typography} from "@mui/material";
import { User } from "dd_server_api_web/dist/model/UserModel";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";


const LoginComponent: React.FC = () => {


    const [user, setUser] = useRecoilState(userProvider)
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
            blogApi().getUserInfo(token).then((value: {
                state: number;
                data: User | ((currVal: User | undefined) => User | undefined) | undefined;
            }) => {
                if (value.state === 200) {
                    setUser(value.data)
                } else {
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
        blogApi().login(username, password).then((value: Result<string>) => {
            setResult(value)
            if (value.state === 200) {
                saveAccessToken(value.data!!)
                fetchUserData()
            }
        })
    }

    return <>
        <Popover
            open={false}
        >
            {/*未登录*/}
            {!user && <Box>
                <Stack spacing={4}>
                    <Typography>登录</Typography>
                    {result?.state !== 200 && <span style={{fontSize: 12, color: 'red'}}>{result?.message}</span>}
                    <Input placeholder={'用户名'} value={username} onChange={e => setUserName(e.target.value)}/>
                    <Input placeholder={'密码'} type={'password'} value={password}
                           onChange={event => setPassword(event.target.value)}/>
                    <Button onClick={login}>登录</Button>
                </Stack>
            </Box>}

            {/*已登录*/}
            {user && <Box>
                <Stack direction={'column'}>
                    <Button onClick={() => {
                        navigateFunction('/add-post')
                    }
                    }>发布博客</Button>
                    <Button onClick={() => {
                        passModal(true)
                    }
                    }>修改密码</Button>
                    <Button onClick={() => {
                        blogApi().logout().then((value: Result<string>) => {
                               successResultHandle(value,data => {
                                   setMsg(data)
                                   removeAccessToken()
                                   setUser(undefined)
                               })
                           })
                       }
                       }>退出登录</Button>
                   </Stack>
                </Box> }
        </Popover>
    </>

}
export default LoginComponent