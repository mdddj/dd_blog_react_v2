import React from "react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../providers/loading";
import {Spinner} from "@nextui-org/react";

const AppLoadingWidget: React.FC = () => {
    const loading = useRecoilValue(appLoading)
    if (!loading) {
        return <></>
    }
    return <div>
        <Spinner/>
    </div>
}
export default AppLoadingWidget