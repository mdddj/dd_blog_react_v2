import { Alert } from "@mui/material";
import { UnUserWidget } from "./user_widget";
import React from "react";

const LoginTip: React.FC = () => {
  return (
    <UnUserWidget>
      <Alert
        sx={{
          mt: 2,
          mb: 2,
        }}
        severity={"warning"}
      >
        部分操作需要登录才能处理
      </Alert>
    </UnUserWidget>
  );
};

export default LoginTip;
