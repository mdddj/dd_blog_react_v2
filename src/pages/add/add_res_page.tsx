import PageHeader from "../../components/page_header";
import React, { useState } from "react";

import { getAccessToken, host } from "../../utils/request";
import { ApiResponse } from "../../models/app_model";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Input} from "@nextui-org/react";
import Box from "../../components/box/box";

const AddResPage: React.FC = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const params = useParams<{ cateName: string | undefined }>();
  console.log(params.cateName);
  /**
   * 选择本地图片
   */
  // const selectImage = async () => {
  //   const blobs = await fileOpen({ mimeTypes: ["image/*"], multiple: true });
  //   setFiles(blobs);
  // };

  ///提交数据到服务器
  const submit = async () => {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("cateName", params.cateName ?? "未知类型");
    formData.append("type", "web");

    try {
      const result = await axios.post<ApiResponse<any>>(
        host + "/api/app/resource/new",
        formData,
        {
          headers: {
            Authorization: getAccessToken(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
    } catch (error) {
      console.log("发布失败" + error);
    }
  };

  return (
    <Box>
      <PageHeader title="发布动态" />

      <div className={'columns-1'} >
        <Input
          label={"标题(可选)"}
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          fullWidth
          label="说点什么吧"
          onChange={(e) => setContent(e.target.value)}
        />

        <div className={'columns-1'}>
          {/*<Button onClick={selectImage}>添加图片</Button>*/}
        </div>
      </div>
    </Box>
  );
};
export default AddResPage;
