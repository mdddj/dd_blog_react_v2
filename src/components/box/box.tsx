import React, {PropsWithChildren} from "react";

type BoxProps = {
    onClick?: () => void
}

const Box : React.FunctionComponent<PropsWithChildren<BoxProps>> = (props) => {
    return <div onClick={()=>{
        props.onClick?.()
    }}>
        {props.children}
    </div>
}
export default Box;