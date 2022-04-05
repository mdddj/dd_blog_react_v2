import { BellIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, OrderedList, Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import { Friend } from "dd_server_api_web/apis/model/friend"
import { successResultHandle } from "dd_server_api_web/src/utils/ResultUtil"
import { useState } from "react"
import { useMount } from "react-use"
import { useSetRecoilState } from "recoil"
import { successMessageProvider } from "../../providers/modal/success_modal"
import { blogApi } from "../../utils/request"



// 友链审核页面
const FriendsList : React.FC = () => {

    const [friends, setFriends] = useState<Friend[]>([])
    const [showModal, setShowModal] = useState(false) // 显示审批列表的弹窗

    const setMsg = useSetRecoilState(successMessageProvider)

    //组件挂载
    useMount(()=>{
        fetchData()
    })

    // 加载数据
    const fetchData= () => {
        blogApi().getFriends({
            'state': 0
        }).then(v=>{
            successResultHandle(v,data=>{
                setFriends(data)
            })
        })
    }

    return <div style={{
        position: 'fixed',
        bottom: 12,
        left: 12,
        cursor: 'pointer'
    }} onClick={()=>setShowModal(true)}>
       {
           friends.length !== 0 && <Tag>
               <TagLeftIcon as={BellIcon} color={'blue'} />
               <TagLabel>发现{friends.length}条友链申请</TagLabel>
           </Tag>
       } 



{/* 审批列表 */}
       <Modal isOpen={showModal} onClose={()=>setShowModal(false)}>
           <ModalOverlay />
           <ModalContent>
               <ModalHeader>申请列表</ModalHeader>
               <ModalCloseButton/>
               <ModalBody>
                <OrderedList>
                    {
                        friends.map(v=>{
                            return <ListItem key={v.id}>
                                {v.name}
                                <Box p={2} bg={'gray.200'}>
                                    <Flex>
                                        <Button onClick={()=>{
                                            v.state = 1
                                            blogApi().updateFriendsObject(v).then(r=>{
                                                successResultHandle(r,d=>{
                                                    setShowModal(false)
                                                    setMsg(r.message)

                                                },setMsg)
                                            })
                                        }}>通过</Button>
                                    </Flex>
                                </Box>
                            </ListItem>
                        })
                    }
                </OrderedList>
                <ModalFooter/>
               </ModalBody>
           </ModalContent>
       </Modal>

    </div>
}
export default FriendsList