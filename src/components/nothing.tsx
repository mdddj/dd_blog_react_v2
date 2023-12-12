import React from "react";
import Box from "./box/box";


type Props = {
    nothing: boolean | undefined
}

// 空数据展示
const NothingWidget: React.FC<Props> = ({nothing}) => {
    if (!nothing) {
        return <span/>
    }
    return <div className={'text-center text-default'}>
        暂无内容~
    </div>
}
export default NothingWidget