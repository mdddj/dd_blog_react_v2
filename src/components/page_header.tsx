import React from "react";
type Props = {
    title: string
}
//页面的大标题
const PageHeader:React.FC<Props> = (props) => {
  return <>
      <div className="d-flex align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
              <div className="lh-1">
                  <h1 className="h6 mb-0 text-white lh-1">{props.title}</h1>
              </div>
      </div>
  </>
}

export default  PageHeader