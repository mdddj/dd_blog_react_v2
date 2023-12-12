import React, { PropsWithChildren } from "react";
import { useRecoilValue } from "recoil";
import { appLoading } from "../../providers/loading";
import Box from "./box";
import {Skeleton} from "@nextui-org/react";



///重构box
const MyBox: React.FunctionComponent<
  PropsWithChildren<{ skeleton?: boolean }>
> = (props) => {

  return (
    <div className={'columns-1'}>
      {props.children}
    </div>
  );
};
export default MyBox;
