import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiGetResourceModel } from "../../utils/api";
import { useSearchParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { successMessageProvider } from "../../providers/modal/success_modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { BlogPreviewLight } from "../../components/blog_content_light";
import { onImageUpload } from "../../utils/EditImageFileUpload";
import MdEditor from "react-markdown-editor-lite";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import { LoadingButton } from "@mui/lab";
import { blogApi } from "../../utils/request";
import { ApiResponse } from "../../models/app_model";
///修改动态的页面
const UpdateResourcePage: React.FC = () => {
  const [parmas] = useSearchParams();
  const updateId = parmas.get("updateId");
  const [getLoading, setGetLoading] = useState(false);
  const setMsg = useSetRecoilState(successMessageProvider);
  const [model, setModel] = useState<ResourceModel>();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResourceModel>();
  const onSubmit: SubmitHandler<ResourceModel> = async (
    data: ResourceModel
  ) => {
    data.id = model?.id ?? -1;
    console.log(data);
    const result = await blogApi().requestT<ApiResponse<ResourceModel>>(
      "/api/auth/resource-save",
      data,
      "POST"
    );
    setMsg(result.message);
  };
  const getUpdateModel = async () => {
    if (updateId) {
      setGetLoading(true);
      const result = await apiGetResourceModel({ id: updateId });
      if (result.success) {
        ///更新数据
        let model = result.data;
        setModel(model);
        setValue("title", model.title);
        setValue("content", model.content);
        setValue("label", model.label);
      } else {
        setMsg("获取资源失败.");
      }
      setGetLoading(false);
    }
  };

  useEffect(() => {
    getUpdateModel().then();
  }, [updateId]);

  const content = watch("content");
  const titleError = errors.title;
  return (
    <Box>
      {!getLoading && model && (
        <Box>
          <Typography variant={"h5"} sx={{ mb: 2 }}>
            修改资源
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={"column"} spacing={2}>
              <TextField
                {...register("title", { required: true })}
                fullWidth
                error={titleError !== undefined}
                label={"标题"}
                helperText={titleError !== undefined ? "请输入标题" : ""}
              />
              <TextField label={"标签"} {...register("label")} fullWidth />
              <MdEditor
                {...register("content", { required: true })}
                style={{ height: "500px" }}
                value={content}
                renderHTML={(text: string) => (
                  <BlogPreviewLight content={text} />
                )}
                onChange={(data: { text: string }) =>
                  setValue("content", data.text)
                }
                onImageUpload={onImageUpload}
              />
              <LoadingButton
                loading={isSubmitting}
                type={"submit"}
                variant={"contained"}
                disabled={!isValid}
              >
                提交修改
              </LoadingButton>
            </Stack>
          </form>
        </Box>
      )}

      {getLoading && (
        <CircularProgress
          sx={{
            textAlign: "center",
          }}
        />
      )}
    </Box>
  );
};
export default UpdateResourcePage;
