import React, { useState } from "react";
import { blogApi, removeAccessToken, saveAccessToken } from "../utils/request";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userProvider } from "../providers/user";
import { useNavigate } from "react-router-dom";
import { successMessageProvider } from "../providers/modal/success_modal";
import { showPasswordModal } from "../providers/setting";
import {
  Result,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import { ApiResponse, LoginResultModel } from "../models/app_model";
import {Button, Input, Tab, Tabs} from "@nextui-org/react";
import Box from "./box/box";

enum LoginType {
  email,
  account,
}

const LoginComponent: React.FC = () => {
  const [user, setUser] = useRecoilState(userProvider);
  const [username, setUserName] = useState(""); //用户名
  const [password, setPassword] = useState(""); //密码
  const [loginType, setLoginType] = useState(LoginType.account); //登录方式
  let navigateFunction = useNavigate();

  const setMsg = useSetRecoilState(successMessageProvider);
  const passModal = useSetRecoilState(showPasswordModal);

  const getLoginUrl = (): string => {
    switch (loginType) {
      case LoginType.email:
        return "/api/user-public/login-by-email";
      case LoginType.account:
        return "/api/user-public/login";
    }
  };

  //执行登录
  const login = async () => {
    if (username.length === 0 || password.length === 0) {
      setMsg("请输入账号和密码");
      return;
    }

    const result = await blogApi().requestT<ApiResponse<LoginResultModel>>(
      getLoginUrl(),
      {
        loginNumber: username,
        password: password,
        loginType: loginType === LoginType.account ? "account" : "email",
      },
      "POST"
    );
    if (result.success) {
      saveAccessToken(result.data.token);
      setUser(result.data.user);
    } else {
      setMsg(result.message);
    }
  };
  const handleChange = (event: React.SyntheticEvent, newValue: LoginType) => {
    setLoginType(newValue);
  };
  //
  return (
    <>
      {/*未登录*/}
      {!user && (
        <div className={'container'}>
          <div className={'columns-1'}>
            <span >
              用户登录
            </span>
            <Tabs>
              <Tab key={'account'} title={'账号'}>
                <Input
                    placeholder={
                      loginType === LoginType.email ? "请输入邮箱" : "请输入账号"
                    }
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                    placeholder={"请输入密码"}
                    type={"password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <Button  onClick={login}>
                  登 录
                </Button>
              </Tab>
              <Tab>邮箱</Tab>
            </Tabs>

          </div>
        </div>
      )}

      {/*已登录*/}
      {user && (
        <Box>
          <div className={'columns-1'}>
            <Button
              onClick={() => {
                navigateFunction("/add-post");
              }}
            >
              发布博客
            </Button>
            <Button
              onClick={() => {
                passModal(true);
              }}
            >
              修改密码
            </Button>
            <Button
              onClick={() => {
                blogApi()
                  .logout()
                  .then((value: Result<string>) => {
                    successResultHandle(value, (data) => {
                      setMsg(data);
                      removeAccessToken();
                      setUser(undefined);
                    });
                  });
              }}
            >
              退出登录
            </Button>
          </div>
        </Box>
      )}
    </>
  );
};
export default LoginComponent;
