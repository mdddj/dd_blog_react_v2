import {atom} from "recoil";

//打赏的窗口开关
const appMoneyModalOpen = atom<boolean>({
    key: 'app-modal-money-key',
    default: false
})
export {appMoneyModalOpen}