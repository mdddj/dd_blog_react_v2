
import React, { useEffect, useState } from "react";
import { apiGetResourceModel } from "../../utils/api";
import { useSearchParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { successMessageProvider } from "../../providers/modal/success_modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import { blogApi } from "../../utils/request";
import { ApiResponse } from "../../models/app_model";
import Box from "../../components/box/box";
import {Button, Input, Spinner} from "@nextui-org/react";
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
    setValue,
    formState: {  isValid },
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


  return (
    <Box>
      {!getLoading && model && (
        <Box>
          <div >
            修改资源
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={'columns-1'}>
              <Input
                {...register("title", { required: true })}
                fullWidth
                label={"标题"}
              />
              <Input label={"标签"} {...register("label")} fullWidth />
              {/*<MdEditor*/}
              {/*  {...register("content", { required: true })}*/}
              {/*  style={{ height: "500px" }}*/}
              {/*  value={content}*/}
              {/*  renderHTML={(text: string) => (*/}
              {/*    <BlogPreviewLight content={text} />*/}
              {/*  )}*/}
              {/*  onChange={(data: { text: string }) =>*/}
              {/*    setValue("content", data.text)*/}
              {/*  }*/}
              {/*  onImageUpload={onImageUpload}*/}
              {/*/>*/}
              <Button
                type={"submit"}
                disabled={!isValid}
              >
                提交修改
              </Button>
            </div>
          </form>
        </Box>
      )}

      {getLoading && (
        <Spinner
        />
      )}
    </Box>
  );
};
export default UpdateResourcePage;
