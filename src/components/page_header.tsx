import React from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@nextui-org/react";
import Box from "./box/box";
type Props = {
  title: string;
  showBack?: boolean
};
//页面的大标题
const PageHeader: React.FC<Props> = (props) => {
    const showBackIcon = props.showBack ?? false
    const nav = useNavigate()
  return (
    <Box>
        {
            showBackIcon && <Button color="secondary" onClick={()=>nav(-1)}></Button>
        }
      <span className={'font-bold text-large'}>
        {props.title}
      </span>
    </Box>
  );
};

export default PageHeader;
