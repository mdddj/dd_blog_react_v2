import React, {PropsWithChildren} from "react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../../providers/loading";
import {Box, Skeleton, Stack} from "@mui/material";

///重构box
const MyBox: React.FunctionComponent<PropsWithChildren<{ skeleton?: boolean }>> = (props) => {
    const loading = useRecoilValue(appLoading)

    return <Box>
        {
            loading && props.skeleton && <Stack>
                <Skeleton height='20px'/>
                <Skeleton height='20px'/>
                <Skeleton height='20px'/>
                <Skeleton height='20px'/>
                <Skeleton height='20px'/>
                <Skeleton height='20px'/>
            </Stack>
        }
        {props.children}
    </Box>
}
export default MyBox