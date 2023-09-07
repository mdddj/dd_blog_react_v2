import React, { useState } from "react";
import { blogApi } from "../../utils/request";
import { useMount } from "react-use";
import { useSetRecoilState } from "recoil";
import { appLoading } from "../../providers/loading";
import NothingWidget from "../../components/nothing";
import PageHeader from "../../components/page_header";
import { useNavigate } from "react-router-dom";
import { ResCategory } from "dd_server_api_web/dist/model/ResCategory";
import {
  PagerModel,
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import MyBox from "../../components/box/my_box";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ImageCard } from "../../components/image";
import { Box } from "@mui/material";
import UpdateResourceCategoryThumbnail from "../../components/update_resource_category_thumbnail";

//文档列表页面
const DocsPage: React.FC = () => {
  const [docs, setDocs] = useState<ResCategory[]>([]);
  const [pager, setPager] = useState<PagerModel>();
  const setLoading = useSetRecoilState(appLoading);
  const nav = useNavigate();

  // 加载数据
  const fetchData = () => {
    setLoading(true);
    blogApi()
      .getResourceCategoryList(
        {
          page: 0,
          pageSize: 1000,
        },
        {
          type: "doc",
        } as any
      )
      .then(
        (
          value: Result<{
            page: PagerModel;
            list: ResCategory[];
          }>
        ) => {
          setLoading(false);
          successResultHandle(value, (data) => {
            setDocs(data.list ?? []);
          });
          setPager(value.data?.page);
        }
      );
  };

  useMount(() => {
    fetchData();
  });

  const getImage = (item: ResCategory): string => {
    if (!item.logo || item.logo === "") {
      return "https://bit.ly/2Z4KKcF";
    }
    return item.logo!;
  };

  return (
    <MyBox>
      <PageHeader title={"文档"} />
      <NothingWidget nothing={pager && pager.total === 0} />

      <Grid2 container spacing={2}>
        {docs.map((value) => {
          return (
            <Grid2
              key={value.id}
              {...{ xs: 12, sm: 6, md: 4, lg: 3 }}
              minHeight={160}
              sx={{
                position: "relative",
              }}
            >
              <Box
                onClick={() => {
                  nav("/docs/" + value.id);
                }}
              >
                <ImageCard
                  src={getImage(value)}
                  title={value.name ?? ""}
                  imageWith={"100%"}
                />
              </Box>
              {value.id && (
                <UpdateResourceCategoryThumbnail
                  id={value.id}
                  onSuccess={() => {
                    fetchData();
                  }}
                />
              )}
            </Grid2>
          );
        })}
      </Grid2>
    </MyBox>
  );
};
export default DocsPage;
