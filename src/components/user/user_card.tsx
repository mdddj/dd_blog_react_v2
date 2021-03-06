import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../../utils/request";
import {User} from "dd_server_api_web/apis/model/UserModel";
import {Avatar, Box, Divider, Flex, Heading, Icon, IconButton, Stack,} from "@chakra-ui/react";
import MyBox from "../box/my_box";
import {BsGithub} from "react-icons/bs";

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
        blogApi().getUserDetail(userId, loginNmae).then(value => setUser(value.data))
    }

    return <MyBox>
        {
            user && <Box>
                <Box mb={5} width={'100%'}>
                    <Flex>
                        <Avatar src={user.picture}/>
                        <Box flex={1} ml={4}>
                            <Heading as={'h5'} size={'md'}>{user.nickName}</Heading>
                            <Box color={'gray'}>@{user.loginNumber}</Box>
                        </Box>
                    </Flex>
                </Box>
                <Divider/>

                {/*社交账号*/}
                <Box mt={5}>
                    <Stack>
                        <IconButton aria-label='github' icon={<Icon as={BsGithub} />} onClick={()=>window.open('https://github.com/mdddj','_blank')} />
                    </Stack>
                </Box>
            </Box>
        }
    </MyBox>
}
export default UserCardWithBlogDetail