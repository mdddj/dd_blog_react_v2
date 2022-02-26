import React from "react";
import { Box, Heading} from "@chakra-ui/react";
type Props = {
    title: string
}
//页面的大标题
const PageHeader:React.FC<Props> = (props) => {
  return <Box mb={2}>
      <Heading style={{textAlign: 'center'}}>{props.title}</Heading>
  </Box>
}

export default  PageHeader