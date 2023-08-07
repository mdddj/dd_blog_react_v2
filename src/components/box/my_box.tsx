import React, {PropsWithChildren} from "react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../../providers/loading";
import {Card, Skeleton, Stack} from "@mui/material";

///重构box
const MyBox: React.FunctionComponent<PropsWithChildren<{ skeleton?: boolean }>> = (props) => {
    const loading = useRecoilValue(appLoading)

    return <Card>
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
    </Card>
}
export default MyBox