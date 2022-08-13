import React, {PropsWithChildren, ReactNode} from "react";
import {Box, Grid, GridItem, Stack, useMediaQuery} from "@chakra-ui/react";
import MyBox from "./box/my_box";

type Props = {
    left: ReactNode[];
    bottomComponent?: ReactNode
}

///两列的基本布局
export const LeftMenuLayout: React.FC<PropsWithChildren<Props>> = ({children,left,bottomComponent}) => {
    const [isDesk] = useMediaQuery('(min-width: 760px)')
    return <>
        <Grid gap={4} templateColumns='repeat(12, 1fr)'>
            <GridItem colSpan={isDesk ? 3 : 12} rowSpan={2}>
                <Stack spacing={3} >
                    {
                        left.map((value,index)=> <div key={index}>{value}</div> )
                    }
                </Stack>
            </GridItem>
            <GridItem colSpan={isDesk ? 9 : 12} >
                <div>
                    {children}
                </div>
                <Box mt={2} />
                {
                    bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>
                }

            </GridItem>
        </Grid>
    </>
}
