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
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid, Input,
  Stack, TextField,
  useMediaQuery
} from "@mui/material";
import {AspectRatio} from "@mui/icons-material";
import { ResCategory } from "dd_server_api_web/dist/model/ResCategory";
import { ResourceCategoryType } from "dd_server_api_web/dist/model/ResourceCategoryType";
import { Result, PagerModel, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";

//动态页面
const DynamicPage: React.FC = () => {
  const navigation = useNavigate();
  const [initLoading, setInitLoading] = useState(true); // 初始化中
  const [plotoAlbums, setPlotoAlbums] = useState<ResCategory[]>([]); // 相册列表
  const [showCreateModal, setShowCreateModal] = useState(false); //显示创建弹窗
  const isDesk = useMediaQuery("(min-width: 760px)");

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

  const getImage = (item: ResCategory) :string => {
    if(item.logo === ''){
      return 'https://bit.ly/2Z4KKcF';
    }
    return item.logo!;
  }

  return (
    <>
      <Box textAlign={"end"} position={"absolute"} bottom={"20%"} left={"50%"}>
        <Button
          onClick={() => setShowCreateModal(true)}
        >新增</Button>
      </Box>

      {initLoading && <CircularProgress />}

      {/* 动态组件 */}
      {/* <ResourceComponents resourceCategoryName={'典典面基经历'} /> */}

      {plotoAlbums.length === 0 && !initLoading && (
        <Box>
          暂无相册,快去
          <Button
            onClick={() => {
              setShowCreateModal(true);
            }}
          >
            创建
          </Button>
          一个吧.
        </Box>
      )}

      <Grid>
        {plotoAlbums.map((value) => (
          <Box
            key={value.id}
            onClick={() => {
              navigation("/pics?name=" + value.name);
            }}
          >
            <Box position={"relative"}>
              <AspectRatio >
                <img
                  src={getImage(value)}
                />
              </AspectRatio>
              <Box
              >
                {value.description}
              </Box>
            </Box>
            <Box mt={2}>
              <span>{value.name}</span>
            </Box>
          </Box>
        ))}
      </Grid>

      <AddPhoneAlbumsForm
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
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
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>新建相册</DialogTitle>
      <DialogContent>

          <Stack direction={"column"} spacing={5}>
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
                  console.log(blob);
                  let form = new FormData();
                  form.append("file", blob);
                  let result: Result<string> = await blogApi().uploadFileWithSingle(form);
                  successResultHandle(result, (data) => {
                    setLogo(data);
                  });
                } catch (e) {
                  console.log("取消上传");
                }
              }}
            >
              选择封面图上传
            </Button>

            {logo.length !== 0 && <img src={logo} />}

            <Input
              placeholder={"类型"}
              value={type}
              onChange={(event) => setType(event.target.value)}
            />

            <Box>
              {rcts.map((value) => (
                <Button
                  key={value.type}
                  onClick={() => setType(value.type)}
                >
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
        <DialogActions>
            <Button
              onClick={() => {
                setType("images");
              }}
            >
              相册类型
            </Button>
            <Button onClick={submit}>
              创建
            </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicPage;
