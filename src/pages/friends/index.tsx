import React, { useState } from "react";
import PageHeader from "../../components/page_header";
import { blogApi } from "../../utils/request";
import { useMount } from "react-use";
import { useSetRecoilState } from "recoil";
import { appLoading } from "../../providers/loading";

import CommentComponent from "../../components/comment_component";
import { successMessageProvider } from "../../providers/modal/success_modal";
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Friend } from "dd_server_api_web/dist/model/friend";
import {
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import { ApiResponse } from "../../models/app_model";

//友链页面
const FriendsPage: React.FC = () => {
  const setLoading = useSetRecoilState(appLoading);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showModal, setShowModal] = useState(false);

  useMount(() => fetchData());

  // 加载数据
  const fetchData = () => {
    setLoading(true);
    blogApi()
      .getFriends({ state: "1" })
      .then((value: Result<Friend[]>) => {
        setLoading(false);
        successResultHandle(value, (data) => {
          setFriends(data);
        });
      });
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <PageHeader title={"友链"} />

      <span
        style={{
          fontSize: 12,
          color: "grey",
          cursor: "pointer",
          position: "absolute",
          top: 22,
          right: 0,
        }}
        onClick={() => setShowModal(true)}
      >
        自助申请友链
      </span>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          {friends.map((value) => {
            return (
              <Grid
                key={value.id}
                {...{ xs: 12, sm: 6, md: 4, lg: 3 }}
                minHeight={160}
              >
                <Card>
                  <Box mb={2}>
                    <Avatar src={value.logo} />
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" mb={2} color={"deeppink"}>
                      {value.name}
                    </Typography>
                    <Typography fontSize="sm" color={'salmon'}>{value.intro}</Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box>
        <CommentComponent type={"friend"} id={0} />
      </Box>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth={"lg"}
      >
        <DialogTitle>自助申请友链</DialogTitle>
        <DialogContent>
          <AddFriendsForm
            onSuccess={() => {
              setShowModal(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

/// 添加友链页面
const AddFriendsForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState("典典的博客");
  const [url, setUrl] = useState("https://itbug.shop");
  const [intro, setIntro] = useState("典典的小卖部开源");
  const [logo, setLogo] = useState("no logo ");
  const [email, setEmail] = useState("413153189@qq.com");

  const setMsg = useSetRecoilState(successMessageProvider);

  //提交表单
  const submit = async () => {
    let result = await blogApi().requestT<ApiResponse<Friend>>(
      "/api/public/friend/apply-for",
      {
        name: name,
        url: url,
        intro: intro,
        logo: logo,
        email: email,
        state: 0,
      },
      "POST"
    );
    if (result.success) {
      onSuccess();
    }
    setMsg(result.message);
  };

  return (
    <>
      <Stack
        direction={"column"}
        component={"form"}
        spacing={3}
        sx={{
          width: "50ch",
        }}
        pt={2}
      >
        <TextField
          id="name"
          name="name"
          label={"网站名称"}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="urlId"
          name="url"
          label="主页"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <TextField
          id="introId"
          name="intro"
          label="简单介绍"
          fullWidth
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />
        <TextField
          name="logo"
          id="logoId"
          label="Logo直链"
          fullWidth
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />
        <TextField
          name="email"
          id="emailId"
          label="邮箱,用来接收审核通知,非必须"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant={"contained"} onClick={() => submit()} fullWidth>
          提交数据
        </Button>
      </Stack>
    </>
  );
};

export default FriendsPage;
