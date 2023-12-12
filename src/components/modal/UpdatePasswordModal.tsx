import React, {useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {showPasswordModal} from "../../providers/setting";
import {blogApi} from "../../utils/request";
import {successMessageProvider} from "../../providers/modal/success_modal";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";
import {Button, Input, Modal, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

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

  return <Modal isOpen={show} onClose={()=>setShow(false)}>
    <ModalHeader>修改密码</ModalHeader>
    <ModalContent>

        <div className={'columns-1'} >
          <Input placeholder='原始密码' type={'password'} onChange={event=>setOldPass(event.target.value)} />
          <Input placeholder='新密码' type={'password'} onChange={event=>setNewPass(event.target.value)} />
        </div>

    </ModalContent>
    <ModalFooter>
      <Button  onClick={doUpdate} >确认修改</Button>
    </ModalFooter>
  </Modal>
}
export default UpdatePasswordModal;