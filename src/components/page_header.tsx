import React from "react";
import {Heading} from "@chakra-ui/react";
type Props = {
    title: string
}
//页面的大标题
const PageHeader:React.FC<Props> = (props) => {
  return <>
      <Heading>{props.title}</Heading>
  </>
}

export default  PageHeader