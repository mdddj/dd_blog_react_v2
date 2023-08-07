import { blogApi } from "./request";

// 编辑器图片上传
function onImageUpload(file: File) {
  return new Promise(async (resolve) => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await blogApi().uploadFileWithSingle(formData);
    if (result.state === 200) {
      resolve(result.data);
    } else {
      alert(result.message);
    }
  });
}
export { onImageUpload };
