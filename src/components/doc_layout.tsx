import React, {PropsWithChildren} from "react";

type Props = {
  sidenav: React.ReactNode
}
//文档类型布局
const DocLayout: React.FC<PropsWithChildren<Props>> = ({children,sidenav}) => {
  return <div className={'flex gap-5'} >

    <div className={'w-64 flex-none'} >
      {sidenav}
    </div>

    <div className={'flex-auto overflow-x-auto'}>
      {children}
    </div>
  </div>
}

export default DocLayout