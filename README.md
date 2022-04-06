# 梁典典的博客

预览：https://itbug.shop

上传文件 api

```ts

/**
 * 上传图片
 * @param file
 */
const onEditImageUpload = async (file: File) => {
  return new Promise<String>(async (resolve) => {
    let formData = new FormData();
    formData.append('file', file);
    let result = await blogApi().uploadFileWithSingle(formData);
    successResultHandle(
      result,
      (data) => {
        resolve(data);
      },
      (msg) => {
        message.error(msg);
      },
    );
  });
};

```
