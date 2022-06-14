import React, { useState } from "react";
import PageHeader from "../../components/page_header";
import { blogApi } from "../../utils/request";
import { useMount } from "react-use";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import { Friend } from "dd_server_api_web/apis/model/friend";
import * as react from "@chakra-ui/react";
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

//友链页面
const FriendsPage: React.FC = () => {
  const [isDesk] = react.useMediaQuery("(min-width: 760px)");
  const setLoading = useSetRecoilState(appLoading);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showModal, setShowModal] = useState(false);

  useMount(() => fetchData());

  // 加载数据
  const fetchData = () => {
    setLoading(true);
    blogApi()
      .getFriends({ state: "1" })
      .then((value) => {
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

      <react.SimpleGrid columns={isDesk ? 2 : 1} spacingX="40px" spacingY="20px">
        {friends.map((value) => {
          return (
            <react.Link key={value.id} href={value.url} isExternal={true}>
              <MyBox>
                <react.Flex>
                  <react.Avatar src={value.logo} />
                  <react.Box ml="3">
                    <react.Text fontWeight="bold">{value.name}</react.Text>
                    <react.Text fontSize="sm">{value.intro}</react.Text>
                  </react.Box>
                </react.Flex>
              </MyBox>
            </react.Link>
          );
        })}
      </react.SimpleGrid>

      <react.Box bg="white" borderRadius={5} p={3} mt={12}>
        <CommentComponent type={"friend"} id={0} />
      </react.Box>

      <react.Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <react.ModalOverlay />
        <react.ModalContent>
          <react.ModalHeader>自助申请友链</react.ModalHeader>
          <react.ModalCloseButton />
          <react.ModalBody>
            <AddFriendsForm />
          </react.ModalBody>
          <react.ModalFooter />
        </react.ModalContent>
      </react.Modal>
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
      .then((r) => {
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
              <react.Stack direction={"column"} spacing={5}>
                <Field name={"name"}>
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <react.FormControl
                        isInvalid={
                          form.values.name === "" && errors.name !== undefined
                        }
                        isRequired={true}
                      >
                        <react.FormLabel htmlFor="name">网站名</react.FormLabel>
                        <react.Input {...field} id="name" />
                        <react.FormErrorMessage>{errors.name}</react.FormErrorMessage>
                      </react.FormControl>
                    );
                  }}
                </Field>
                <Field name={"url"} type="url">
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <react.FormControl
                        isInvalid={
                          form.values.url === "" && errors.url !== undefined
                        }
                        isRequired={true}
                      >
                        <react.FormLabel htmlFor="urlId">链接</react.FormLabel>
                        <react.Input {...field} id="urlId" />
                        <react.FormErrorMessage>{errors.url}</react.FormErrorMessage>
                      </react.FormControl>
                    );
                  }}
                </Field>
                <Field name={"intro"}>
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <react.FormControl
                        isInvalid={
                          form.values.intro === "" && errors.intro !== undefined
                        }
                        isRequired={true}
                      >
                        <react.FormLabel htmlFor="introId">一句话介绍</react.FormLabel>
                        <react.Input {...field} id="introId" />
                        <react.FormErrorMessage>{errors.intro}</react.FormErrorMessage>
                      </react.FormControl>
                    );
                  }}
                </Field>
                <Field name={"logo"} type="url">
                  {({ field, form }: FieldProps<any, Friend>) => {
                    return (
                      <react.FormControl
                        isInvalid={
                          form.values.logo === "" && errors.logo !== undefined
                        }
                        isRequired={true}
                      >
                        <react.FormLabel htmlFor="logoId">Logo</react.FormLabel>
                        <react.Input {...field} id="logoId" />
                        <react.FormErrorMessage>{errors.logo}</react.FormErrorMessage>
                      </react.FormControl>
                    );
                  }}
                </Field>
                <Field name={"email"} type="email">
                  {({ field }: FieldProps<any, Friend>) => {
                    return (
                      <react.FormControl isRequired={false}>
                        <react.FormLabel htmlFor="emailId">邮箱</react.FormLabel>
                        <react.Input {...field} id="emailId" />
                        <react.FormHelperText>
                          邮箱信息仅用来接收审核结果通知,不会被用作其他用途.
                        </react.FormHelperText>
                      </react.FormControl>
                    );
                  }}
                </Field>
                <react.Button type={"submit"} mt={5}>
                  提交数据
                </react.Button>
              </react.Stack>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default FriendsPage;

