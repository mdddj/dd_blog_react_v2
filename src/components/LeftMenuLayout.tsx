import React, {PropsWithChildren, ReactNode} from "react";
import MyBox from "./box/my_box";
import Box from "./box/box";

type Props = {
    left: ReactNode[];
    bottomComponent?: ReactNode
}

///两列的基本布局
export const LeftMenuLayout: React.FC<PropsWithChildren<Props>> = ({children,left,bottomComponent}) => {
    return <>
        <div className={'grid grid-cols-2 gap-2'} >
            <div  >
                {
                    left.map((value,index)=> <div key={index}>{value}</div> )
                }
            </div>
            <div   >
                    {children}
                <Box  />
                {
                    bottomComponent ? <MyBox>{bottomComponent}</MyBox> : <></>
                }

            </div>
        </div>
    </>
}
