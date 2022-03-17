import React from "react";
import {
    AspectRatio,
    Button,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Spinner, useBoolean,
} from "@chakra-ui/react";
import {useRecoilState} from "recoil";
import {appMoneyModalOpen, appMoneyTextModel} from "../../providers/modal";
import {useMount} from "react-use";
import {blogApi} from "../../utils/request";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import MarkdownView from "../MarkdownView";

const MoneyModal: React.FC = () => {
    const [isOpen, setIsOpen] = useRecoilState(appMoneyModalOpen)
    const [moneyTextModel,setMoneyTextModel] = useRecoilState(appMoneyTextModel)
    const onClose = () => setIsOpen(false)
    const [loading,setLoading] = useBoolean()

    useMount(()=>{
        if(!moneyTextModel){
            setLoading.on()
            blogApi().getTextByName('blog-ds').then(value => {
                successResultHandle(value,data => {
                    setMoneyTextModel(data)
                })
                setLoading.off()
            })
        }
    })

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>打赏</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {loading && <Spinner/>}
                        {moneyTextModel && <AspectRatio maxW={500} maxH={600}>
                            <MarkdownView content={moneyTextModel.context}/>
                            </AspectRatio>}
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