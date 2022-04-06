import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import { blogApi } from "./request";

// 编辑器图片上传
function onImageUpload(file: File) {
  return new Promise(async (resolve) => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await blogApi().uploadFileWithSingle(formData);
    successResultHandle(result, (d) => {
      resolve(d);
    });
  });
}
export { onImageUpload };
