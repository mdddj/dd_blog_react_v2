import React from "react";

import {useRecoilState} from "recoil";
import {appMoneyModalOpen, appMoneyTextModel} from "../../providers/modal";
import {useMount} from "react-use";
import {blogApi} from "../../utils/request";
import MarkdownView from "../MarkdownView";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import { TextModel } from "dd_server_api_web/dist/model/TextModel";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";

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
            <Dialog open={isOpen} onClose={onClose}>
                <DialogTitle>打赏</DialogTitle>
                <DialogContent>
                    {
                        moneyTextModel &&  <MarkdownView content={moneyTextModel.context}/>
                    }
                </DialogContent>
                <DialogActions>
                    <Button  onClick={onClose}>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default MoneyModal