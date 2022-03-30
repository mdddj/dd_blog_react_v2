import { SystemPicter } from "dd_server_api_web/apis/model/avater";
import { atom } from "recoil";

// 系统预设头像
const systemAvatars = atom<SystemPicter[]>({
    key: 'system_avatars',
    default: []
})
export {systemAvatars}