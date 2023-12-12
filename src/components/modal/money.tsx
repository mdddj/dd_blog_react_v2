import React from "react";

import {useRecoilState} from "recoil";
import {appMoneyModalOpen, appMoneyTextModel} from "../../providers/modal";
import {useMount} from "react-use";
import {blogApi} from "../../utils/request";
import MarkdownView from "../MarkdownView";
import { TextModel } from "dd_server_api_web/dist/model/TextModel";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";
import {Button, Modal, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

const MoneyModal: React.FC = () => {
    const [isOpen, setIsOpen] = useRecoilState(appMoneyModalOpen)
    const [moneyTextModel,setMoneyTextModel] = useRecoilState(appMoneyTextModel)
    const onClose = () => setIsOpen(false)

    useMount(()=>{
        if(!moneyTextModel){
            blogApi().getTextByName('blog-ds').then((value: Result<TextModel>) => {
                successResultHandle(value,data => {
                    setMoneyTextModel(data)
                })
            })
        }
    })

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalHeader>打赏</ModalHeader>
                <ModalContent>
                    {
                        moneyTextModel &&  <MarkdownView content={moneyTextModel.context}/>
                    }
                </ModalContent>
                <ModalFooter>
                    <Button  onClick={onClose}>
                        关闭
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
export default MoneyModal