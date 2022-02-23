import React, {useState} from "react";
import PageHeader from "../../components/page_header";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {Friend} from "dd_server_api_web/apis/model/friend";
import {Box, SimpleGrid, Text, Flex, Avatar, Link, useBoolean, Spinner} from "@chakra-ui/react";

//友链页面
const FriendsPage:React.FC = () => {


    const [friends,setFriends] = useState<Friend[]>([])
    const [loading,setLoading] = useBoolean()

    useMount(()=>fetchData())

    const fetchData = () =>{
        setLoading.on()
        blogApi().getFriends({'state': '1'}).then(value => {
            console.log(value)
            setLoading.off()
            successResultHandle(value,data => {
                setFriends(data)
            })
        })
    }

  return <>
      <PageHeader title={'友链'} />

      {
          loading && <Spinner />
      }

      <SimpleGrid columns={2} spacingX='40px' spacingY='20px'>
          {
              friends.map(value => {
                  return <Link key={value.id} href={value.url} isExternal={true}>
                      <Box  border={10} borderRadius={5} borderColor={'gray'} bg={'gray.200'} p={3} mb={1}>
                          <Flex>
                              <Avatar src={value.logo} />
                              <Box ml='3'>
                                  <Text fontWeight='bold'>
                                      {value.name}
                                  </Text>
                                  <Text fontSize='sm'>{value.intro}</Text>
                              </Box>
                          </Flex>
                      </Box>
                  </Link>
              })
          }
      </SimpleGrid>


  </>
}
export default FriendsPage