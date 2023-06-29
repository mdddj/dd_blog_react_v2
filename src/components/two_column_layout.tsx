import React, {PropsWithChildren, ReactNode} from "react";
import MyBox from "./box/my_box";
import {Box, Grid, Stack, useMediaQuery} from "@mui/material";

type Props = {
    right: ReactNode[];
    bottomComponent?: ReactNode
}

///两列的基本布局
const TwoColumnLayout:React.FC<PropsWithChildren<Props>> = ({children,right,bottomComponent}) => {
    const isDesk = useMediaQuery('(min-width: 760px)')
  return <>
      <Grid>
          <Box >
              <MyBox skeleton>
                  {children}
              </MyBox>
              <Box mt={2} />
              {
                  bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>
              }
              
          </Box>
          <Box>
                  <Stack spacing={3} >
                      {
                          right.map((value,index)=> <div key={index}>{value}</div> )
                      }
                  </Stack>
          </Box>
      </Grid>
  </>
}
export default TwoColumnLayout