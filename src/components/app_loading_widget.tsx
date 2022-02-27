import React from "react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../providers/loading";
import {Collapse, Spinner} from "@chakra-ui/react";

const AppLoadingWidget: React.FC = () => {
    const loading = useRecoilValue(appLoading)
    return <Collapse in={loading} style={{textAlign: 'center'}} animateOpacity>
       <Spinner />
    </Collapse>
}
export default AppLoadingWidget