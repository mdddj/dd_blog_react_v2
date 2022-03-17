import React, {ReactNode} from "react";
import {Grid, GridItem, Stack, useMediaQuery} from "@chakra-ui/react";
import MyBox from "./box/my_box";

type Props = {
    right: ReactNode[]
}

///两列的基本布局
const TwoColumnLayout:React.FC<Props> = ({children,right}) => {
    const [isDesk] = useMediaQuery('(min-width: 760px)')
  return <>
      <Grid gap={4} templateColumns='repeat(12, 1fr)'>
          <GridItem colSpan={isDesk ? 9 : 12} >
              <MyBox>
                  {children}
              </MyBox>
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