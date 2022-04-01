import {atom} from "recoil";


const  showPasswordModal = atom<boolean>({
    key: 'show-password',
    default : false
})
export {showPasswordModal}