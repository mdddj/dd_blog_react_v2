import React from "react";
import {Box, useColorModeValue} from "@chakra-ui/react";

///重构box
const MyBox:React.FC = (props) => {
    const color = useColorModeValue('white','black')
  return <Box bg={color}  borderWidth={1} p={5} borderRadius={5} {...props} >
      {props.children}
  </Box>
}
export default MyBox