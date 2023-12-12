import React, {PropsWithChildren, ReactNode} from "react";
import MyBox from "./box/my_box";
import {Card, CardBody} from "@nextui-org/react";

type Props = {
    right: ReactNode[];
    bottomComponent?: ReactNode;
};

///两列的基本布局
const TwoColumnLayout: React.FC<PropsWithChildren<Props>> = ({
                                                                 children,
                                                                 bottomComponent,
                                                                 right
                                                             }) => {
    return (
        <div className={'flex gap-2'}>
            <div className={'flex flex-col gap-2 py-5 px-5 overflow-x-auto'}>
                {children}
                <div>
                    {bottomComponent ? <div>{bottomComponent}</div> : <></>}
                </div>
            </div>
            <div className={'w-2/6 py-5 flex flex-col gap-2 flex-none shrink-1'}>
                {right.map((value, index) =><Card className={'mb-2'} key={index}><CardBody>{value}</CardBody></Card>) }
            </div>
        </div>
    );
};
export default TwoColumnLayout;
