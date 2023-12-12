import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../../utils/request";
import MyBox from "../box/my_box";
import { User } from "dd_server_api_web/dist/model/UserModel";
import Box from "../box/box";
import {Avatar, Button, Card, CardBody, CardFooter, Divider} from "@nextui-org/react";

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

    return <>
        {
            user && <Card>
                <CardBody>
                    <Avatar src={user.picture}/>
                    <div>
                        <span >{user.nickName}</span>
                        <div >@{user.loginNumber}</div>
                    </div>
                </CardBody>
                <Divider/>
                <CardFooter >
                    <div className={'flex gap-2'}>
                        <Button onClick={()=>window.open('https://github.com/mdddj','_blank')} >Github</Button>
                    </div>
                </CardFooter>
            </Card>
        }
    </>
}
export default UserCardWithBlogDetail