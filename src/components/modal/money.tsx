import React from "react";
import {
    Button,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import {useRecoilState} from "recoil";
import {appMoneyModalOpen} from "../../providers/modal";

const MoneyModal: React.FC = () => {
    const [isOpen, setIsOpen] = useRecoilState(appMoneyModalOpen)
    const onClose = () => setIsOpen(false)

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>打赏</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        打赏
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            关闭
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default MoneyModal