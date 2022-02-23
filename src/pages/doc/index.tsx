import React from "react";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";

//文档列表页面
const DocsPage:React.FC = () => {



  const fetchData = () => {
    blogApi().getResourceCategory({
     type: 'doc'
    } as any).then(value => {
      successResultHandle(value,data => {
        console.log(data)
      })
    })
  }


  useMount(()=>{
    fetchData()
  })


  return <>

  </>
}
export default DocsPage