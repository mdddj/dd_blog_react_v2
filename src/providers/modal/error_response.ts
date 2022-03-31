import {atom} from "recoil";
import {ErrorData} from "../../utils/request";

//展示的错误消息提示,统一全局处理
const errorResponseProvider = atom<ErrorData|undefined>({
    key: 'error_response_modal',
    default: undefined
})
export {errorResponseProvider}