import {atom} from "recoil";

// 操作成功的弹窗提示
const successMessageProvider = atom<string|undefined>({
    key: 'success-message-provider',
    default: undefined
})
export {successMessageProvider}