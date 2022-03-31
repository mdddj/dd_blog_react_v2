import React from "react";
import {useRecoilState} from "recoil";
import {errorResponseProvider} from "../../providers/modal/error_response";
import {
    Alert,
    AlertIcon,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";


/// 错误信息的展示
const ResponseErrorModal: React.FC = () => {


    const [errorData,setErrorData] = useRecoilState(errorResponseProvider)

    const close = () => {
        setErrorData(undefined)
    }


    const msgList = errorData?.code === 508 ? errorData.data as string[] : []

  return (
      <Modal isOpen={errorData!==undefined} onClose={close}>
          <ModalOverlay />
          <ModalContent>
              <ModalHeader>{errorData?.msg}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>

                  {
                      errorData?.code === 508 && msgList.map(value => {
                          return <Alert status='error' key={value}>
                              <AlertIcon />
                              {value}
                          </Alert>

                      })
                  }
              </ModalBody>

              <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={close}>
                      关闭
                  </Button>
                  {
                      errorData?.code === 401 && <Button variant='ghost'>登录</Button>
                  }
              </ModalFooter>
          </ModalContent>
      </Modal>
  )
}
export default ResponseErrorModal