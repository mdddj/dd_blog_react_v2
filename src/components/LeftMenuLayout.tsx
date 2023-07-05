import React, {PropsWithChildren, ReactNode} from "react";
import MyBox from "./box/my_box";
import {Box, Grid, Stack} from "@mui/material";

type Props = {
    left: ReactNode[];
    bottomComponent?: ReactNode
}

///两列的基本布局
export const LeftMenuLayout: React.FC<PropsWithChildren<Props>> = ({children,left,bottomComponent}) => {
    return <>
        <Grid spacing={2}>
            <Grid item xs={4} >
                {
                    left.map((value,index)=> <div key={index}>{value}</div> )
                }
            </Grid>
            <Grid item xs={8}  >
                    {children}
                <Box mt={2} />
                {
                    bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>
                }

            </Grid>
        </Grid>
    </>
}
