import React, { useState } from "react";
import { useMount } from "react-use";
import { blogApi } from "../utils/request";
import { formatDateUtil } from "../utils/DateUtil";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CardContent,
  CardHeader,
  Divider,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import { ResCategory } from "dd_server_api_web/dist/model/ResCategory";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import {
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import { ApiResponse, JpaPage } from "../models/app_model";
import { UserWidget } from "./user_widget";
import PageHeader from "./page_header";
import StyledCard from "./blog/styled";

type Props = {
  resourceCategoryName: string; //动态分类的名字
};

//动态小页面
const ResourceComponents: React.FC<Props> = ({ resourceCategoryName }) => {
  const nav = useNavigate();

  const [resCate, setResCate] = useState<ResCategory | undefined>(undefined);
  const [list, setList] = useState<ResourceModel[]>([]);

  const params = useParams();

  //组件挂载
  useMount(async () => {
    await getData();
  });

  //加载列表
  const fetchList = async (page: number) => {
    let pager = { page: page, pageSize: 2000 };
    const result = await blogApi().requestT<
      ApiResponse<JpaPage<ResourceModel>>
    >(
      "/api/app/resource/list",
      { ...pager, name: resourceCategoryName },
      "GET"
    );
    console.log(result);
    if (result.success) {
      setList([...list, ...result.data.content]);
    }
  };

  const getData = async () => {
    let result: Result<ResCategory | undefined> =
      await blogApi().getResourceCategory({
        name: resourceCategoryName,
      } as any);
    successResultHandle(result, (data) => {
      setResCate(data);
      fetchList(0);
    });
  };

  return (
    <>
      <Box>
        {resCate && <PageHeader showBack={true} title={resCate.name ?? ""} />}

        <ButtonGroup variant="contained">
          <UserWidget>
            <Button
              onClick={() => {
                nav("/add-res/" + params.cateName);
              }}
            >
              发布
            </Button>
          </UserWidget>
        </ButtonGroup>

        <Stack
          direction={"column"}
          spacing={2}
          sx={{
            mt: 4,
            mb: 2,
          }}
        >
          {list.map((value) => {
            return <DynamicCard key={value.id} res={value} />;
          })}
        </Stack>
      </Box>
    </>
  );
};

///动态卡片
const DynamicCard: React.FC<{ res: ResourceModel }> = ({ res }) => {
  if (res.type === "doc-post") {
    return <DocDynamicCard res={res} />;
  }
  if (res.type === "simple-text") return <SingleTextCard res={res} />;

  if (res.type === "images") {
    return <ImageTypeLayout res={res} />;
  }
  return <></>;
};

const ImageTypeLayout: React.FC<{ res: ResourceModel }> = ({ res }) => {
  return (
    <>
      <StyledCard>
        <CardHeader
          avatar={<Avatar src={res.user?.picture} />}
          title={res.user?.nickName}
          subheader={"发布于" + formatDateUtil(res.createDate)}
        />
        <CardContent>
          <Typography variant={"body2"} color={"text.secondary"}>
            {res.content}
          </Typography>
          <ImageList sx={{ width: "100%" }} cols={6} rowHeight={164}>
            {res.images!.map((item) => (
              <ImageListItem key={item.id}>
                <img
                  src={`${item.url}`}
                  alt={item.fileName}
                  width={"100%"}
                  style={{ objectFit: "cover", borderRadius: 12 }}
                  height={"100%"}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </CardContent>
      </StyledCard>
    </>
  );
};

/// 简单文本类型
const SingleTextCard: React.FC<{ res: ResourceModel }> = ({ res }) => {
  return (
    <Box>
      <Box>记录 &bull; 梁典典发布于{formatDateUtil(res.createDate)}</Box>
      <Box>{res.content}</Box>
    </Box>
  );
};

///文档卡片
const DocDynamicCard: React.FC<{ res: ResourceModel }> = ({ res }) => {
  return (
    <Box>
      <Box>文档 &bull; 梁典典发布于{formatDateUtil(res.createDate)}</Box>
      <Typography>{res.title}</Typography>
      <Box>
        {res.category && (
          <span>
            <span style={{ fontSize: 10, color: "grey" }}>
              {res.category.name}
            </span>
          </span>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default ResourceComponents;
