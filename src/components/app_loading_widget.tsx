import React from "react";
import {useRecoilValue} from "recoil";
import {appLoading} from "../providers/loading";
import {CircularProgress} from "@mui/material";

const AppLoadingWidget: React.FC = () => {
    const loading = useRecoilValue(appLoading)
    if(!loading){
        return <></>
    }
    return <div style={{position: 'absolute', top: '12px',right: '12px',zIndex: 9999999999999}}>
       <CircularProgress />
    </div>
}
export default AppLoadingWidget