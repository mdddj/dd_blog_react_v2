import {atom} from "recoil";
import {TextModel} from "dd_server_api_web/apis/model/TextModel";

//打赏的窗口开关
const appMoneyModalOpen = atom<boolean>({
    key: 'app-modal-money-key',
    default: false
})

const appMoneyTextModel = atom<TextModel|undefined>({
    key: 'app-money-text-model',
    default: undefined
})
export {appMoneyModalOpen,appMoneyTextModel}