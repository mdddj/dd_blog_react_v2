import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../../utils/request";
import MyBox from "../box/my_box";
import {Avatar, Box, Divider, IconButton, Stack, Typography} from "@mui/material";
import { User } from "dd_server_api_web/dist/model/UserModel";

type Props = {
    userId?: number,
    loginNmae?: string
}
///博客详情的用户卡片
const UserCardWithBlogDetail: React.FC<Props> = ({userId, loginNmae}) => {

    const [user, setUser] = useState<User | undefined>(undefined)

    useMount(() => fetchUserDetail())

    //加载用户信息
    const fetchUserDetail = () => {
        blogApi().getUserDetail(userId, loginNmae).then((value: { data: React.SetStateAction<User | undefined>; }) => {
            setUser(value.data)
        })
    }

    return <MyBox>
        {
            user && <Box>
                <Box mb={5} width={'100%'}>
                    <Avatar src={user.picture}/>
                    <Box flex={1} ml={4}>
                        <Typography variant={'h5'}>{user.nickName}</Typography>
                        <Box color={'gray'}>@{user.loginNumber}</Box>
                    </Box>
                </Box>
                <Divider/>

                {/*社交账号*/}
                <Box mt={5}>
                    <Stack>
                        <IconButton onClick={()=>window.open('https://github.com/mdddj','_blank')} />
                    </Stack>
                </Box>
            </Box>
        }
    </MyBox>
}
export default UserCardWithBlogDetail