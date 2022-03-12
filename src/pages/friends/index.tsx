import React, {useState} from "react";
import PageHeader from "../../components/page_header";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {Friend} from "dd_server_api_web/apis/model/friend";
import {Box, SimpleGrid, Text, Flex, Avatar, Link, useMediaQuery} from "@chakra-ui/react";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../../providers/loading";
import MyBox from "../../components/box/my_box";

//友链页面
const FriendsPage:React.FC = () => {

    const [isDesk] = useMediaQuery('(min-width: 760px)')
    const setLoading = useSetRecoilState(appLoading)
    const [friends,setFriends] = useState<Friend[]>([])

    useMount(()=>fetchData())

// 加载数据
    const fetchData = () =>{
        setLoading(true)
        blogApi().getFriends({'state': '1'}).then(value => {
            setLoading(false)
            successResultHandle(value,data => {
                setFriends(data)
            })
        })
    }
    

  return <>
      <PageHeader title={'友链'} />


          <SimpleGrid columns={isDesk ? 2: 1} spacingX='40px' spacingY='20px'>
              {
                  friends.map(value => {
                      return <Link key={value.id} href={value.url} isExternal={true}>
                          <MyBox>
                              <Flex>
                                  <Avatar src={value.logo} />
                                  <Box ml='3'>
                                      <Text fontWeight='bold'>
                                          {value.name}
                                      </Text>
                                      <Text fontSize='sm'>{value.intro}</Text>
                                  </Box>
                              </Flex>
                          </MyBox>
                      </Link>
                  })
              }
          </SimpleGrid>
  </>
}
export default FriendsPage
