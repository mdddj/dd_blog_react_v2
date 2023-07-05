import {atom} from "recoil";
import {User} from "../models/app_model";


const userProvider = atom<User|undefined>({
    key: 'user-state',
    default: undefined
})
export {userProvider}