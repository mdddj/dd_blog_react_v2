import React, {useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {showPasswordModal} from "../../providers/setting";
import {blogApi} from "../../utils/request";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Stack} from "@mui/material";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";

/// 修改密码的组件
const UpdatePasswordModal: React.FC = () => {


  const [show, setShow] = useRecoilState(showPasswordModal)
  const setMsg = useSetRecoilState(successMessageProvider)

  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')


  const doUpdate = () => {
    blogApi().updateUserPasswordWithAdmin(oldPass, newPass).then((value: Result<string>) => {
      successResultHandle(value,data => {
        setMsg(data)
        setShow(false)
      },message => {
        setMsg(message)
      })
    })
  }

  return <Dialog open={show} onClose={()=>setShow(false)}>
    <DialogTitle>修改密码</DialogTitle>
    <DialogContent>

        <Stack direction={'column'}>
          <Input placeholder='原始密码' type={'password'} onChange={event=>setOldPass(event.target.value)} />
          <Input placeholder='新密码' type={'password'} onChange={event=>setNewPass(event.target.value)} />
        </Stack>

    </DialogContent>
    <DialogActions>
      <Button  onClick={doUpdate} >确认修改</Button>
    </DialogActions>
  </Dialog>
}
export default UpdatePasswordModal;