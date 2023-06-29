import React, { useState } from "react";
import PageHeader from "../../components/page_header";
import { blogApi } from "../../utils/request";
import { useMount } from "react-use";
import { useSetRecoilState } from "recoil";
import { appLoading } from "../../providers/loading";
import MyBox from "../../components/box/my_box";
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from "formik";
import CommentComponent from "../../components/comment_component";
import { successMessageProvider } from "../../providers/modal/success_modal";
import {
    Avatar,
    Box, Button,
    Dialog,
    DialogContent,
    DialogTitle, FormControl,
    Grid,
    Input,
    Link,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import { Friend } from "dd_server_api_web/dist/model/friend";
import { Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";

//友链页面
const FriendsPage: React.FC = () => {
  const isDesk = useMediaQuery("(min-width: 760px)");
  const setLoading = useSetRecoilState(appLoading);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showModal, setShowModal] = useState(false);

  useMount(() => fetchData());

  // 加载数据
  const fetchData = () => {
    setLoading(true);
    blogApi()
      .getFriends({ state: "1" })
      .then((value:Result<Friend[]>) => {
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

      <Grid>
        {friends.map((value) => {
          return (
            <Link key={value.id} href={value.url}>
              <MyBox>
                  <Avatar src={value.logo} />
                  <Box>
                    <Typography fontWeight="bold">{value.name}</Typography>
                    <Typography fontSize="sm">{value.intro}</Typography>
                  </Box>
              </MyBox>
            </Link>
          );
        })}
      </Grid>

      <Box>
        <CommentComponent type={"friend"} id={0} />
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogTitle>自助申请友链</DialogTitle>
        <DialogContent>
            <AddFriendsForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

/// 添加友链页面
const AddFriendsForm: React.FC = () => {

  const setMsg = useSetRecoilState(successMessageProvider)

  //提交表单
  const submit = (values: Friend, _: FormikHelpers<Friend>) => {
    blogApi()
      .saveFriendsLink(values)
      .then((r: Result<any>) => {
        successResultHandle(r,msg=>{
          setMsg(msg)
        },err=>{
          setMsg(err)
        })
      });
  };

  const validate = (values: any) => {
    let errors = {} as any;
    if (values.name === "") {
      errors.name = "请输入名字";
    }
    if (values.url === "") {
      errors.url = "请输入链接";
    }
    if (values.intro === "") {
      errors.intro = "请输入介绍";
    }
    if (values.logo === "") {
      errors.logo = "请输入你的logo";
    }

    return errors;
  };

  return (
    <>
      <Formik<Friend>
        initialValues={{
          name: "",
          url: "",
          state: 0,
          logo: "",
          email: "",
          intro: "",
        }}
        onSubmit={submit}
        validate={validate}
      >
        {({ errors }: FormikProps<Friend>) => {
          console.log(errors);
          return (
            <Form>
              <Stack direction={"column"} spacing={5}>
                <Field name={"name"}>
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <FormControl>
                        <Input {...field} id="name" />
                      </FormControl>
                    );
                  }}
                </Field>
                <Field name={"url"} type="url">
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <FormControl
                      >
                        <Input {...field} id="urlId" />
                      </FormControl>
                    );
                  }}
                </Field>
                <Field name={"intro"}>
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <FormControl
                      >
                        <Input {...field} id="introId" />
                      </FormControl>
                    );
                  }}
                </Field>
                <Field name={"logo"} type="url">
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <FormControl
                      >
                        <Input {...field} id="logoId" />
                      </FormControl>
                    );
                  }}
                </Field>
                <Field name={"email"} type="email">
                  {({ field }: FieldProps<any, Friend>) => {
                    return (
                      <FormControl >
                        <Input {...field} id="emailId" />
                      </FormControl>
                    );
                  }}
                </Field>
                <Button type={"submit"}>
                  提交数据
                </Button>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default FriendsPage;

