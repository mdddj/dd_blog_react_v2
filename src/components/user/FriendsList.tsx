import { useState } from "react"
import { useMount } from "react-use"
import { useSetRecoilState } from "recoil"
import { successMessageProvider } from "../../providers/modal/success_modal"
import { blogApi } from "../../utils/request"
import {Box, Button, Chip, Dialog, DialogContent, DialogTitle, ListItem} from "@mui/material";
import { Friend } from "dd_server_api_web/dist/model/friend"
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil"



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
        }).then((v: Result<Friend[]>)=>{
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
           friends.length !== 0 &&
               <Chip label={'发现{friends.length}条友链申请'}></Chip>

       } 



{/* 审批列表 */}
       <Dialog open={showModal} onClose={()=>setShowModal(false)}>
           <DialogTitle>申请列表</DialogTitle>
           <DialogContent>
               {
                   friends.map(v=>{
                       return <ListItem key={v.id}>
                           {v.name}
                           <Box >
                               <Button onClick={()=>{
                                   v.state = 1
                                   blogApi().updateFriendsObject(v).then((r: Result<Friend>)=>{
                                       successResultHandle(r,d=>{
                                           setShowModal(false)
                                           setMsg(r.message)

                                       },setMsg)
                                   })
                               }}>通过</Button>
                           </Box>
                       </ListItem>
                   })
               }
           </DialogContent>
       </Dialog>

    </div>
}
export default FriendsList