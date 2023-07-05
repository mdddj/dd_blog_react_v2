import React, { PropsWithChildren, ReactNode } from "react";
import MyBox from "./box/my_box";
import { Box, Card, Grid } from "@mui/material";

type Props = {
  right: ReactNode[];
  bottomComponent?: ReactNode;
};

///两列的基本布局
const TwoColumnLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  right,
  bottomComponent,
}) => {
  return (
    <Box p={6} >
        <Card elevation={10}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {children}
          <Box mt={2} mb={2} />
          {bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>}
        </Grid>
        {/* <Grid item xs={4}>
          <Stack spacing={3}>
            {right.map((value, index) => (
              <div key={index}>{value}</div>
            ))}
          </Stack>
        </Grid> */}
      </Grid>
    </Card>
    </Box>
  );
};
export default TwoColumnLayout;
