import { Grid } from "@mui/material";
import React, {PropsWithChildren} from "react";

type Props = {
  sidenav: React.ReactNode
}
//文档类型布局
const DocLayout: React.FC<PropsWithChildren<Props>> = ({children,sidenav}) => {
  return <Grid container spacing={2}>

    <Grid item xs={4} >
      {sidenav}
    </Grid>

    <Grid item xs={8}>
      {children}
    </Grid>
  </Grid>
}

export default DocLayout