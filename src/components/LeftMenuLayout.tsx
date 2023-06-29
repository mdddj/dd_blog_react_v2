import React, {PropsWithChildren, ReactNode} from "react";
import MyBox from "./box/my_box";
import {Box, Grid, Stack, useMediaQuery} from "@mui/material";

type Props = {
    left: ReactNode[];
    bottomComponent?: ReactNode
}

///两列的基本布局
export const LeftMenuLayout: React.FC<PropsWithChildren<Props>> = ({children,left,bottomComponent}) => {
    const isDesk = useMediaQuery('(min-width: 760px)')
    return <>
        <Grid >
            <Box >
                <Stack spacing={3} >
                    {
                        left.map((value,index)=> <div key={index}>{value}</div> )
                    }
                </Stack>
            </Box>
            <Box  >
                <div>
                    {children}
                </div>
                <Box mt={2} />
                {
                    bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>
                }

            </Box>
        </Grid>
    </>
}
