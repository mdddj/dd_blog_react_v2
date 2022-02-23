import React from "react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../providers/loading";
import { ScaleFade, Spinner} from "@chakra-ui/react";

const AppLoadingWidget: React.FC = () => {
    const loading = useRecoilValue(appLoading)
    return <ScaleFade in={loading}>
       <Spinner />
    </ScaleFade>
}
export default AppLoadingWidget