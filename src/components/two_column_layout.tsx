import React, {PropsWithChildren, ReactNode} from "react";
import {Box, Grid, GridItem, Stack, useMediaQuery} from "@chakra-ui/react";
import MyBox from "./box/my_box";

type Props = {
    right: ReactNode[];
    bottomComponent?: ReactNode
}

///两列的基本布局
const TwoColumnLayout:React.FC<PropsWithChildren<Props>> = ({children,right,bottomComponent}) => {
    const [isDesk] = useMediaQuery('(min-width: 760px)')
  return <>
      <Grid gap={4} templateColumns='repeat(12, 1fr)'>
          <GridItem colSpan={isDesk ? 9 : 12} >
              <MyBox skeleton>
                  {children}
              </MyBox>
              <Box mt={2} />
              {
                  bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>
              }
              
          </GridItem>
          <GridItem colSpan={isDesk ? 3 : 12} rowSpan={2}>
                  <Stack spacing={3} >
                      {
                          right.map((value,index)=> <div key={index}>{value}</div> )
                      }
                  </Stack>
          </GridItem>
      </Grid>
  </>
}
export default TwoColumnLayout