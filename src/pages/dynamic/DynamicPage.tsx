import React, { useState } from "react";
import { useMount } from "react-use";
import { blogApi } from "../../utils/request";
import { fileOpen } from "browser-fs-access";
import { useSetRecoilState } from "recoil";
import { successMessageProvider } from "../../providers/modal/success_modal";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Stack,
  TextField,
} from "@mui/material";
import { ResCategory } from "dd_server_api_web/dist/model/ResCategory";
import { ResourceCategoryType } from "dd_server_api_web/dist/model/ResourceCategoryType";
import {
  Result,
  PagerModel,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import MyBox from "../../components/box/my_box";
import PageHeader from "../../components/page_header";
import { UserWidget } from "../../components/user_widget";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ImageCard } from "../../components/image";
import UpdateResourceCategoryThumbnail from "../../components/update_resource_category_thumbnail";

//动态页面
const DynamicPage: React.FC = () => {
  const navigation = useNavigate();
  const [initLoading, setInitLoading] = useState(true); // 初始化中
  const [plotoAlbums, setPlotoAlbums] = useState<ResCategory[]>([]); // 相册列表
  const [showCreateModal, setShowCreateModal] = useState(false); //显示创建弹窗

  useMount(async () => {
    await fetchPhotoAlbum();
    setInitLoading(false);
  });

  // 加载相册类型的分类
  const fetchPhotoAlbum = async () => {
    let result: Result<{
      page: PagerModel;
      list: ResCategory[];
    }> = await blogApi().getResourceCategoryList(
      {
        page: 0,
        pageSize: 1000,
      },
      { type: "images" }
    );
    successResultHandle(result, (data) => {
      setPlotoAlbums(data.list);
    });
  };

  const getImage = (item: ResCategory): string => {
    if (!item.logo || item.logo === "") {
      return "https://bit.ly/2Z4KKcF";
    }
    return item.logo!;
  };

  return (
    <MyBox>
      <PageHeader title="动态" />
      {initLoading && <CircularProgress />}

      <UserWidget>
        <Button
          onClick={() => {
            setShowCreateModal(true);
          }}
        >
          新建相册
        </Button>
      </UserWidget>

      <Grid2 container spacing={2}>
        {plotoAlbums.map((value) => {
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
                  navigation("/pics/" + value.name);
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
                    fetchPhotoAlbum();
                  }}
                />
              )}
            </Grid2>
          );
        })}
      </Grid2>

      {/*<ImageList  gap={12} >*/}
      {/*  {plotoAlbums.map((item) => (*/}
      {/*    <ImageListItem*/}
      {/*      className="m--img"*/}
      {/*      key={item.id}*/}
      {/*      onClick={() => {*/}
      {/*        navigation("/pics/" + item.name);*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <img*/}
      {/*        src={`${getImage(item)}?w=164&h=164&fit=crop&auto=format`}*/}
      {/*        srcSet={`${getImage(*/}
      {/*          item*/}
      {/*        )}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
      {/*        alt={item.name}*/}
      {/*        loading="lazy"*/}
      {/*      />*/}
      {/*      <ImageListItemBar*/}
      {/*        style={{*/}
      {/*          borderBottomRightRadius: 12,*/}
      {/*          borderBottomLeftRadius: 12,*/}
      {/*        }}*/}
      {/*        title={item.name}*/}
      {/*      ></ImageListItemBar>*/}
      {/*    </ImageListItem>*/}
      {/*  ))}*/}
      {/*</ImageList>*/}

      <AddPhoneAlbumsForm
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </MyBox>
  );
};

/// 新建的弹窗
const AddPhoneAlbumsForm: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  ///http://duodob.oss-cn-shenzhen.aliyuncs.com/other%2Fedit%2Favatar.jpeg
  const [logo, setLogo] = useState(""); // logo

  const [name, setName] = useState(""); //名称
  const [intro, setIntro] = useState(""); //
  const [type, setType] = useState(""); //类型

  const setMsg = useSetRecoilState(successMessageProvider);
  const [rcts, setRcts] = useState<ResourceCategoryType[]>([]);

  useMount(() => {
    blogApi()
      .getResourceCategoryTypes()
      .then((value: Result<ResourceCategoryType[]>) => {
        successResultHandle(value, (data) => {
          setRcts(data);
        });
      });
  });

  const submit = async () => {
    let result = await blogApi().saveOrUpdateResourceCategory({
      type: type,
      name: name,
      description: intro,
      logo: logo,
    });
    successResultHandle(result, (_) => {
      onClose();
      setMsg(result.message);
    });
  };

  return (
    <Dialog open={show} onClose={onClose} maxWidth={"md"}>
      <DialogTitle>新建相册</DialogTitle>
      <DialogContent>
        <Stack direction={"column"} spacing={2}>
          <Input
            placeholder="名称"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            placeholder="封面图"
            value={logo}
            onChange={(event) => setLogo(event.target.value)}
          />
          <Button
            onClick={async () => {
              try {
                const blob = await fileOpen({
                  mimeTypes: ["image/*"],
                });
                let form = new FormData();
                form.append("file", blob);
                let result: Result<string> =
                  await blogApi().uploadFileWithSingle(form);
                successResultHandle(result, (data) => {
                  setLogo(data);
                });
              } catch (e) {}
            }}
          >
            选择封面图上传
          </Button>

          {logo.length !== 0 && <img src={logo} alt="logo" />}

          <Input
            placeholder={"类型"}
            value={type}
            onChange={(event) => setType(event.target.value)}
          />

          <Box>
            {rcts.map((value) => (
              <Button key={value.type} onClick={() => setType(value.type)}>
                {value.type}{" "}
              </Button>
            ))}
          </Box>

          <TextField
            multiline={true}
            placeholder="介绍"
            value={intro}
            onChange={(event) => setIntro(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setType("images");
          }}
        >
          相册类型
        </Button>
        <Button onClick={submit}>创建</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicPage;
