import PageHeader from "../../components/page_header";
import React, { useEffect, useState } from "react";
import { fileOpen } from "browser-fs-access";

import { getAccessToken, host } from "../../utils/request";
import { ApiResponse } from "../../models/app_model";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserWidget } from "../../components/user_widget";
import LoginTip from "../../components/login_tip";
import {Button, Input} from "@nextui-org/react";
import Box from "../../components/box/box";

const AddResPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams<{ cateName: string | undefined }>();
  console.log(params.cateName);
  /**
   * 选择本地图片
   */
  const selectImage = async () => {
    const blobs = await fileOpen({ mimeTypes: ["image/*"], multiple: true });
    setFiles(blobs);
  };

  ///提交数据到服务器
  const submit = async () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("cateName", params.cateName ?? "未知类型");
    formData.append("type", "web");
    files.forEach((file) => {
      formData.append("files", file);
    });

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
    setLoading(false);
  };

  return (
    <Box>
      <PageHeader title="发布动态" />

      <LoginTip />
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

        <div className={'grid grid-cols-4 gap-2'}>
          {files.map((item, index) => (
            <div key={index}>
              <BlobFileView blob={item} />
            </div>
          ))}
        </div>
        <div className={'columns-1'}>
          <UserWidget>
            <Button
              onClick={submit}
            >
              发布动态
            </Button>
          </UserWidget>
          <Button onClick={selectImage}>添加图片</Button>
        </div>
      </div>
    </Box>
  );
};

/**
 * 图片预览小部件
 * @param blob Blob对象
 * @constructor
 */
const BlobFileView: React.FC<{ blob: Blob }> = ({ blob }) => {
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    parseImageBlog(blob);
  }, [blob]);

  /**
   * 将图片选择转成可以预览的图片数据
   */
  const parseImageBlog = (blob: Blob) => {
    let reader = new FileReader();
    reader.onload = () => {
      let result = reader.result;
      if (result) {
        setUrl(result as string);
      }
    };
    reader.readAsDataURL(blob);
  };

  return (
    <img
      src={url}
      width={"100%"}
      height={"100%"}
      alt={""}
      style={{ objectFit: "cover", borderRadius: 12 }}
    />
  );
};
export default AddResPage;
