import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../../utils/request";
import MyBox from "../box/my_box";
import { User } from "dd_server_api_web/dist/model/UserModel";
import Box from "../box/box";
import {Avatar, Button, Divider} from "@nextui-org/react";

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
                <Box >
                    <Avatar src={user.picture}/>
                    <Box >
                        <span >{user.nickName}</span>
                        <Box >@{user.loginNumber}</Box>
                    </Box>
                </Box>
                <Divider/>

                {/*社交账号*/}
                <Box >
                    <div className={'columns-1'}>
                        <Button onClick={()=>window.open('https://github.com/mdddj','_blank')} />
                    </div>
                </Box>
            </Box>
        }
    </MyBox>
}
export default UserCardWithBlogDetail