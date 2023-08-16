import React, { PropsWithChildren } from "react";
import { useRecoilValue } from "recoil";
import { userProvider } from "../providers/user";

type Props = {};

const UserWidget: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  const user = useRecoilValue(userProvider);
  if (!user) {
    return <></>;
  }
  return <>{children}</>;
};

const UnUserWidget: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  const user = useRecoilValue(userProvider);
  if (user) {
    return <></>;
  }
  return <>{children}</>;
};
export { UserWidget, UnUserWidget };
