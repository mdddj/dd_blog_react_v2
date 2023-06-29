import { User } from "dd_server_api_web/dist/model/UserModel";
import {atom} from "recoil";


const userProvider = atom<User|undefined>({
    key: 'user-state',
    default: undefined
})
export {userProvider}