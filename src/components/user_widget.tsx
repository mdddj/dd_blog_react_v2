import React from "react";
import {useRecoilValue} from "recoil";
import {userProvider} from "../providers/user";

type Props = {}

const UserWidget: React.FC<Props> = ({children}) => {
 const user = useRecoilValue(userProvider)
 if(!user){
  return <></>
 }
 return <>
  {children}
 </>
}

export default UserWidget