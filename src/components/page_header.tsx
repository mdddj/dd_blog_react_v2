import React from "react";
import {Box, Typography} from "@mui/material";
type Props = {
    title: string
}
//页面的大标题
const PageHeader:React.FC<Props> = (props) => {
  return <Box mb={2} p={2}>
      <Typography variant="h3" style={{textAlign: 'center'}}>{props.title}</Typography>
  </Box>
}

export default  PageHeader