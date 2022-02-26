import React from "react";
import {Box} from "@chakra-ui/react";
import {SunIcon} from "@chakra-ui/icons";


type Props = {
    nothing: boolean | undefined
}

// 空数据展示
const NothingWidget: React.FC<Props> = ({nothing}) => {
    if (!nothing) {
        return <span/>
    }
    return <Box textAlign={'center'} color={'gray'} mt={5} mb={5}>
        <SunIcon mr={2}/>
        这里什么都没有~
    </Box>
}
export default NothingWidget