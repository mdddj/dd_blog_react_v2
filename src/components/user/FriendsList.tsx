import {useState} from "react"
import {useMount} from "react-use"
import {useSetRecoilState} from "recoil"
import {successMessageProvider} from "../../providers/modal/success_modal"
import {blogApi} from "../../utils/request"
import {Friend} from "dd_server_api_web/dist/model/friend"
import {Result, successResultHandle} from "dd_server_api_web/dist/utils/ResultUtil"
import React from "react"
import {Button, Chip, Modal, ModalContent, ModalHeader} from "@nextui-org/react";
import Box from "../box/box";


// 友链审核页面
const FriendsList: React.FC = () => {

    const [friends, setFriends] = useState<Friend[]>([])
    const [showModal, setShowModal] = useState(false) // 显示审批列表的弹窗

    const setMsg = useSetRecoilState(successMessageProvider)

    //组件挂载
    useMount(() => {
        fetchData()
    })

    // 加载数据
    const fetchData = () => {
        blogApi().getFriends({
            'state': 0
        }).then((v: Result<Friend[]>) => {
            successResultHandle(v, data => {
                setFriends(data)
            })
        })
    }

    return <div style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        cursor: 'pointer'
    }} onClick={() => setShowModal(true)}>
        {
            friends.length !== 0 &&
            <Chip  color={'primary'}>{`发现${friends.length}条友链申请`}</Chip>
        }


        {/* 审批列表 */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <ModalHeader>申请列表</ModalHeader>
            <ModalContent>
                {
                    friends.map(v => {
                        return <div key={v.id}>
                            {v.name}
                            <Box>
                                <Button onClick={() => {
                                    v.state = 1
                                    blogApi().updateFriendsObject(v).then((r: Result<Friend>) => {
                                        successResultHandle(r, d => {
                                            setShowModal(false)
                                            setMsg(r.message)

                                        }, setMsg)
                                    })
                                }}>通过</Button>
                            </Box>
                        </div>
                    })
                }
            </ModalContent>
        </Modal>

    </div>
}
export default FriendsList