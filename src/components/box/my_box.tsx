import React, { PropsWithChildren } from "react";


///重构box
const MyBox: React.FunctionComponent<
  PropsWithChildren<{ skeleton?: boolean }>
> = (props) => {

  return (
    <div className={'columns-1'}>
      {props.children}
    </div>
  );
};
export default MyBox;
