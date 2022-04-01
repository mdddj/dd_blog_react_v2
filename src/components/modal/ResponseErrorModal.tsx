import React from "react";
import {useRecoilState} from "recoil";
import {errorResponseProvider} from "../../providers/modal/error_response";
import {
    Alert,
    AlertIcon, Box,
    Button, Modal,
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


                    {/* 出现参数验证失败的提示 */}
                    {
                        errorData?.code === 508 && msgList.map(value => {
                            return <Alert status='error' key={value}>
                                <AlertIcon />
                                {value}
                            </Alert>

                        })
                    }

                    {/*  未登录的提示  */}
                    {
                        errorData?.code === 401 && <Box>

                         部分功能需要登录,或者管理员才能操作

                        </Box>
                    }


                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={close}>
                        关闭
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
export default ResponseErrorModal