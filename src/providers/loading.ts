import {atom} from "recoil";


const appLoading = atom<boolean>({
    key: 'app-loading',
    default: false
})

export {appLoading}