import React, {useState} from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, Stack
} from "@chakra-ui/react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {showPasswordModal} from "../../providers/setting";
import {blogApi} from "../../utils/request";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {successMessageProvider} from "../../providers/modal/success_modal";

/// 修改密码的组件
const UpdatePasswordModal: React.FC = () => {


  const [show,setShow] = useRecoilState(showPasswordModal)
  const setMsg = useSetRecoilState(successMessageProvider)

  const [oldPass,setOldPass] = useState('')
  const [newPass,setNewPass] = useState('')


  const doUpdate = () => {
    blogApi().updateUserPasswordWithAdmin(oldPass,newPass).then(value => {
      successResultHandle(value,data => {
        setMsg(data)
        setShow(false)
      },message => {
        setMsg(message)
      })
    })
  }

  return <Modal isOpen={show} onClose={()=>setShow(false)}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>修改密码</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack direction={'column'}>
          <Input placeholder='原始密码' type={'password'} onChange={event=>setOldPass(event.target.value)} />
          <Input placeholder='新密码' type={'password'} onChange={event=>setNewPass(event.target.value)} />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button  onClick={doUpdate} >确认修改</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}
export default UpdatePasswordModal;