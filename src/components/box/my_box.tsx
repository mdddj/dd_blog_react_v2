import React, {PropsWithChildren} from "react";
import {Box, Skeleton, Stack, useColorModeValue} from "@chakra-ui/react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../../providers/loading";

///重构box
const MyBox: React.FunctionComponent<PropsWithChildren<{ skeleton?: boolean }>> = (props) => {
    const color = useColorModeValue('white', 'black')
    const loading = useRecoilValue(appLoading)

    return <Box bg={color} borderWidth={1} p={5} borderRadius={5} >
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