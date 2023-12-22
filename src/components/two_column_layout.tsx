import React, {PropsWithChildren, ReactNode} from "react";
import {Card, CardBody} from "@nextui-org/react";

type Props = {
    right?: ReactNode[];
    bottomComponent?: ReactNode;
    noCard?: boolean
};

///两列的基本布局
const TwoColumnLayout: React.FC<PropsWithChildren<Props>> = ({
                                                                 children,
                                                                 bottomComponent,
                                                                 right,noCard
                                                             }) => {
    return (
        <div className={'flex gap-5 max-w-full '}>
            <div className={'w-9/12'}>
                {
                    noCard && <>
                        {children}
                        <div>
                            {bottomComponent ? <div>{bottomComponent}</div> : <></>}
                        </div>
                    </>
                }
                {
                  !noCard &&  <Card>
                        <CardBody className={'flex flex-col gap-6 py-5 px-5 overflow-x-scroll'}>
                            {children}
                            <div>
                                {bottomComponent ? <div>{bottomComponent}</div> : <></>}
                            </div>
                        </CardBody>
                    </Card>
                }
            </div>
            <div className={'w-3/12 py-5 flex flex-col gap-2 flex-shrink'}>
                {right && right.map((value, index) =><div className={'mb-2'} key={index}>{value}</div>) }
            </div>
        </div>
    );
};
export default TwoColumnLayout;
