import React from "react";
import {Box} from "@mui/material";


type Props = {
    nothing: boolean | undefined
}

// 空数据展示
const NothingWidget: React.FC<Props> = ({nothing}) => {
    if (!nothing) {
        return <span/>
    }
    return <Box textAlign={'center'} color={'gray'} mt={5} mb={5}>
        这里什么都没有~
    </Box>
}
export default NothingWidget