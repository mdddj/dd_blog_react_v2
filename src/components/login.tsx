import React, {useState} from "react";
import {
    Box, Button, Heading, Input,
    Popover,
    PopoverContent,
    PopoverTrigger, Stack, useDisclosure
} from "@chakra-ui/react";
import {blogApi} from "../utils/request";
import {Result} from "dd_server_api_web/src/utils/ResultUtil";


const LoginComponent: React.FC = () => {


    const {onOpen, onClose, isOpen} = useDisclosure()
    const firstFieldRef = React.useRef(null)
    const [username, setUserName] = useState('admin') //用户名
    const [password, setPassword] = useState('123456') //密码
    const [result, setResult] = useState<Result<string>>()

    const login = () => {
        if (username.length === 0 || password.length === 0) {
            return;
        }
        blogApi().login(username, password).then(value => {
            console.log(value)
            setResult(value)
        })
    }

    return <>
        <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement='right'
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <div style={{position: 'fixed', bottom: '10px', right: '10px', fontSize: 10, color: 'grey'}}>
                    登录
                </div>
            </PopoverTrigger>
            <PopoverContent p={5} m={5}>
                <Box>
                    <Stack spacing={4}>
                        <Heading as={'h4'} size={'md'}>登录</Heading>
                        {result?.state !== 200 && <span style={{fontSize: 12, color: 'red'}}>{result?.message}</span>}
                        <Input placeholder={'用户名'} value={username} onChange={e => setUserName(e.target.value)}/>
                        <Input placeholder={'密码'} type={'password'} value={password}
                               onChange={event => setPassword(event.target.value)}/>
                        <Button onClick={login}>登录</Button>
                    </Stack>
                </Box>
            </PopoverContent>
        </Popover>
    </>

}
export default LoginComponent