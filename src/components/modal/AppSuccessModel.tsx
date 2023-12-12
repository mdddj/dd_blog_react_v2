import React from "react";
import { useRecoilState } from "recoil";
import { successMessageProvider } from "../../providers/modal/success_modal";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

const AppSuccessModel: React.FC = () => {
  const [msg, setMsg] = useRecoilState(successMessageProvider);

  return (
    <Modal isOpen={msg !== undefined} onClose={() => setMsg(undefined)}>

      <ModalContent>
          <ModalHeader>提示</ModalHeader>
          <ModalBody>
              {msg}
          </ModalBody>
          <ModalFooter>
              <Button onClick={() => setMsg(undefined)}>好的</Button>
          </ModalFooter>
         </ModalContent>

    </Modal>
  );
};

export default AppSuccessModel;
