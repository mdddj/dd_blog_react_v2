import React, { PropsWithChildren, ReactNode } from "react";
import MyBox from "./box/my_box";
import { Box, Grid } from "@mui/material";

type Props = {
  right: ReactNode[];
  bottomComponent?: ReactNode;
};

///两列的基本布局
const TwoColumnLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  bottomComponent,
}) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={12} xs={12} lg={12} p={2}>
          <Box>{children}</Box>
          <Box mt={2} mb={2} />
          {bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>}
        </Grid>
      </Grid>
    </Box>
  );
};
export default TwoColumnLayout;
