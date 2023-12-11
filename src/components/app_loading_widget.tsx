import React from "react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../providers/loading";
import {CircularProgress} from "@mui/material";

const AppLoadingWidget: React.FC = () => {
    const loading = useRecoilValue(appLoading)
    if (!loading) {
        return <></>
    }
    return <div>
        <CircularProgress/>
    </div>
}
export default AppLoadingWidget