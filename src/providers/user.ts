import {atom} from "recoil";
import {User} from "dd_server_api_web/apis/model/UserModel";


const userProvider = atom<User|undefined>({
    key: 'user-state',
    default: undefined
})
export {userProvider}