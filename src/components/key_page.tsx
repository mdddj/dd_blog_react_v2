import React, { useState } from "react";
import { blogApi } from "../utils/request";
import { useMount, useToggle } from "react-use";
import { TextModel } from "dd_server_api_web/apis/model/TextModel";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import { useSetRecoilState } from "recoil";
import { appLoading } from "../providers/loading";
import MdEditor from "react-markdown-editor-lite";
import { Result } from "dd_server_api_web/src/utils/ResultUtil";
import {
  Box,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import Nothing from "./nothing";
import MarkdownView from "./MarkdownView";
import CommentComponent from "./comment_component";
import { BlogPreviewLight } from "./blog_content_light";
import { onImageUpload } from "../utils/EditImageFileUpload";
import { successMessageProvider } from "../providers/modal/success_modal";
import { useSearchParams } from "react-router-dom";
type Props = {
  keyText: string;
};
///字典组件
const KeyPage: React.FC<Props> = ({ keyText }) => {
  const toast = useToast();
  const [params] = useSearchParams()
  const urlPass = params.get('view-password') ?? ''
  const [verifyLoading, setVerifyLoading] = useBoolean();
  const [inputPassword, setInputPassword] = useState<string>(urlPass);
  const [model, setModel] = useState<TextModel>();
  const [result, setResult] = useState<Result<any> | undefined>(undefined);
  const setLoading = useSetRecoilState(appLoading);
  const [on,setToggle] = useToggle(true)
  const [showUpdateOrCreateModal, setShowUpdateOrCreateModal] = useState(false); // 新建或者修改弹窗显示

  const hasPassword = result && result.state === 303;

  

  // 组件挂载
  useMount(() => {
    fetchData();

  });

  // 执行修改
  const showUpdateModal = () => {
    setShowUpdateOrCreateModal(true);
  };

  //   加载数据
  const fetchData = () => {
    if (hasPassword && inputPassword.length !== 0) {
      setVerifyLoading.on();
    } else {
    }
    if (hasPassword && inputPassword.length === 0) {
      toast.closeAll();
      toast({
        title: `请输入密码`,
        status: "error",
        isClosable: true,
        duration: 2000,
      });
      return;
    }
    setLoading(true);
    blogApi()
      .getTextByName(keyText, inputPassword)
      .then((value) => {
        setLoading(false);
        setToggle(false)
        setResult(value);
        if (inputPassword.length !== 0) {
          setVerifyLoading.off();
        }
        successResultHandle(
          value,
          (data) => {
            setModel(data);
          },
          (message) => {
            toast.closeAll();
            toast({
              title: message,
              status: "error",
              duration: 3000,
            });
          }
        );
      });
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Nothing nothing={result && result.state === 404} />

      {hasPassword && (
        <Box>
          <Box mb={2}>{result?.message}</Box>
          <Input
            placeholder="请输入密码"
            onChange={(event) => setInputPassword(event.target.value)}
          />
          <Box mt={4}>
            <Button
              colorScheme="blue"
              isLoading={verifyLoading}
              onClick={fetchData}
            >
              确认
            </Button>
          </Box>
        </Box>
      )}

      <span
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          fontSize: 12,
          color: "grey",
          cursor: "pointer",
        }}
        onClick={showUpdateModal}
      >
        编辑字典
      </span>

      {model && <MarkdownView content={model.context} />}

      {model && <CommentComponent type={"text"} id={model?.id ?? 0} />}

      {/* 新建或者修改弹窗 */}
      {
          !on  && <CreateT
          showUpdateOrCreateModal={showUpdateOrCreateModal}
          onClose={() => setShowUpdateOrCreateModal(false)}
          model= {model}
        />
      }
    </div>
  );
};

const CreateT: React.FC<{
  showUpdateOrCreateModal: boolean;
  onClose: () => void;
  model?: TextModel | undefined
}> = ({ showUpdateOrCreateModal, onClose,model }) => {
  //正文
  const [content, setContent] = useState("");

  //标题
  const [title, setTitle] = useState("");

  // 备注
  const [intro, setIntro] = useState("");

  // 是否需要密码才能查看
  const [isPass, setIsPass] = useState(false);

  // 查看密码
  const [password, setPassword] = useState("");

  const setMsg = useSetRecoilState(successMessageProvider);


  // 组件被挂载
  useMount(()=>{
    if(model){
        setContent(model.context)
        setTitle(model.name)
        setIsPass(model.isEncryptionText?? false)
        setIntro(model.intro??'')
    }
  })

  // 提交数据
  const onSubmit = () => {
    blogApi()
      .saveText({
        name: title,
        context: content,
        isEncryptionText: isPass,
        viewPassword: password==='' ? undefined : password,
        intro: intro,
        id: model?.id
      })
      .then((r) => {
        successResultHandle(
          r,
          (d) => {
            setMsg(r.message);
          },
          setMsg
        );
      });
  };

  return (
    <>
      <Modal isOpen={showUpdateOrCreateModal} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>编辑字典</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction={"column"}>
              <Input
                placeholder="关键字"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <MdEditor
                style={{ height: "200px" }}
                value={content}
                renderHTML={(text) => <BlogPreviewLight content={text} />}
                onChange={(data) => {
                  setContent(data.text);
                }}
                onImageUpload={onImageUpload}
              />
              <Input
                placeholder="备注"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />
              <Checkbox
                name="isEncryptionText"
                isChecked={isPass}
                onChange={(e) => setIsPass(!isPass)}
              >
                是否加密文本
              </Checkbox>
              <Input
                placeholder="查看密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSubmit}>提交</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default KeyPage;
