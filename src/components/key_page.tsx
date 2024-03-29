import React, { useState } from "react";
import { blogApi } from "../utils/request";
import { useMount, useToggle } from "react-use";
import { useSetRecoilState } from "recoil";
import { appLoading } from "../providers/loading";
import MdEditor from "react-markdown-editor-lite";
import Nothing from "./nothing";
import MarkdownView from "./MarkdownView";
import CommentComponent from "./comment_component";
import { BlogPreviewLight } from "./blog_content_light";
import { onImageUpload } from "../utils/EditImageFileUpload";
import { successMessageProvider } from "../providers/modal/success_modal";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material";
import { TextModel } from "dd_server_api_web/dist/model/TextModel";
import {
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import { UserWidget } from "./user_widget";
type Props = {
  keyText: string;
};
///字典组件
const KeyPage: React.FC<Props> = ({ keyText }) => {
  const [params] = useSearchParams();
  const urlPass = params.get("view-password") ?? "";
  const [inputPassword, setInputPassword] = useState<string>(urlPass);
  const [model, setModel] = useState<TextModel>();
  const [result, setResult] = useState<Result<any> | undefined>(undefined);
  const setLoading = useSetRecoilState(appLoading);
  const [on, setToggle] = useToggle(true);
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
    } else {
    }
    if (hasPassword && inputPassword.length === 0) {
      return;
    }
    setLoading(true);
    blogApi()
      .getTextByName(keyText, inputPassword)
      .then((value: Result<TextModel>) => {
        setLoading(false);
        setToggle(false);
        setResult(value);
        if (inputPassword.length !== 0) {
        }
        successResultHandle(
          value,
          (data) => {
            setModel(data);
          },
          (message) => {}
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
          <TextField
            placeholder="请输入密码"
            onChange={(event) => setInputPassword(event.target.value)}
          />
          <Box mt={4}>
            <Button onClick={fetchData}>确认</Button>
          </Box>
        </Box>
      )}

      <UserWidget>
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
      </UserWidget>

      {model && <MarkdownView content={model.context} />}

      {model && <CommentComponent type={"text"} id={model?.id ?? 0} />}

      {/* 新建或者修改弹窗 */}
      {!on && (
        <CreateT
          showUpdateOrCreateModal={showUpdateOrCreateModal}
          onClose={() => setShowUpdateOrCreateModal(false)}
          model={model}
        />
      )}
    </div>
  );
};

const CreateT: React.FC<{
  showUpdateOrCreateModal: boolean;
  onClose: () => void;
  model?: TextModel | undefined;
}> = ({ showUpdateOrCreateModal, onClose, model }) => {
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
  useMount(() => {
    if (model) {
      setContent(model.context);
      setTitle(model.name);
      setIsPass(model.isEncryptionText ?? false);
      setIntro(model.intro ?? "");
    }
  });

  // 提交数据
  const onSubmit = () => {
    blogApi()
      .saveText({
        name: title,
        context: content,
        isEncryptionText: isPass,
        viewPassword: password === "" ? undefined : password,
        intro: intro,
        id: model?.id,
      })
      .then((r: Result<TextModel>) => {
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
      <Dialog open={showUpdateOrCreateModal} onClose={onClose} maxWidth={"lg"}>
        <DialogTitle>编辑字典</DialogTitle>
        <DialogContent>
          <Stack direction={"column"} spacing={2} component={"form"}>
            <TextField
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
            <TextField
              placeholder="备注"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isEncryptionText"
                    checked={isPass}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsPass(e.target.checked);
                    }}
                  />
                }
                label={"是否加密内容"}
              />
            </FormGroup>

            <TextField
              placeholder="查看密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSubmit}>提交</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KeyPage;
