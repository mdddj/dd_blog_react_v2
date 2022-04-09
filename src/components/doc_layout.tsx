import React, {PropsWithChildren} from "react";

type Props = {
  sidenav: React.ReactNode
}
//文档类型布局
const DocLayout: React.FC<PropsWithChildren<Props>> = ({children,sidenav}) => {
  return <>

    <div className="sidenav">
      {sidenav}
    </div>

    <div className="content">
      {children}
    </div>
  </>
}

export default DocLayout