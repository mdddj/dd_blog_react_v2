import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  ModalOverlay
} from "@chakra-ui/react";
import {useRecoilState} from "recoil";
import {successMessageProvider} from "../../providers/modal/success_modal";

const AppSuccessModel: React.FC = () => {


  const [msg,setMsg] = useRecoilState(successMessageProvider)

  const OverlayOne = () => (
      <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
      />
  )


  return (
      <Modal isCentered isOpen={msg!==undefined} onClose={()=>setMsg(undefined)}>
        {OverlayOne()}
        <ModalContent>
          <ModalHeader>提示</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{msg}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>setMsg(undefined)}>关闭</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

export  default AppSuccessModel