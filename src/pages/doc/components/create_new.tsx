import React, { useState } from "react";

import { getAxiosHeader, host } from "../../../utils/request";
import MdEditor from "react-markdown-editor-lite";
import { TreeFolders } from "dd_server_api_web/dist/model/ResourceTreeModel";
import { BlogPreviewLight } from "../../../components/blog_content_light";
import { onImageUpload } from "../../../utils/EditImageFileUpload";
import axios from "axios";
import { UserWidget } from "../../../components/user_widget";
import { Result } from "dd_server_api_web/dist/utils/ResultUtil";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import { useSetRecoilState } from "recoil";
import { successMessageProvider } from "../../../providers/modal/success_modal";
import {Button, Input, Modal, ModalContent, ModalHeader} from "@nextui-org/react";
import Box from "../../../components/box/box";

//创建一个新文章
const CreateNewDocArticle: React.FC<{
  currentFolder: TreeFolders | undefined;
  onCreateSuccess?: () => void; //新建成功
}> = ({ currentFolder, onCreateSuccess }) => {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const setMsg = useSetRecoilState(successMessageProvider);

  ///提交
  const submit = async () => {
    setLoading(true);
    const result = await axios.post<Result<ResourceModel>>(
      host + "/api/resource/add-post",
      {
        title: title,
        content: content,
        label: label,
        categoryId: currentFolder?.id,
      },
      getAxiosHeader()
    );

    setLoading(false);

    console.log(result);
    if (result.status === 200) {
      let data = result.data;
      if (data.state === 200) {
        //发布成功
        setMsg(data.message);
        setShow(false); //关闭窗口
        onCreateSuccess?.();
      } else {
        setMsg(data.message);
      }
    } else {
      setMsg("发布失败:" + result.statusText);
    }
  };

  return (
    <>
      {
        <Box>
          <UserWidget>
            <Button
              onClick={() => {
                setShow(true);
              }}
            >
              新建一篇文稿 ({currentFolder?.title})
            </Button>
          </UserWidget>
          <Modal
            isOpen={show}
            onClose={() => setShow(false)}
          >
            <ModalHeader >
              添加文稿 - {currentFolder?.title}
              <Button
                  autoFocus
                  onClick={submit}
              >
                发布
              </Button>
            </ModalHeader>
            <ModalContent>
              <Input
                placeholder={"标题"}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
              <Input
                placeholder={"标签"}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
              />
              <MdEditor
                style={{ height: "500px" }}
                value={content}
                renderHTML={(text) => <BlogPreviewLight content={text} />}
                onChange={(data) => {
                  setContent(data.text);
                }}
                onImageUpload={onImageUpload}
              />
            </ModalContent>
          </Modal>
        </Box>
      }
    </>
  );
};

export default CreateNewDocArticle;
