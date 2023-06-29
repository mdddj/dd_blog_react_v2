



import React from "react";
import {useSearchParams} from "react-router-dom";
import ResourceComponents from "../../components/resource_components";
import {Box} from "@mui/material";


//动态列表的组件
const DynamicListPage: React.FC = () => {

 const [params] =  useSearchParams()

  const name = params.get('name')


  if(name == null){
    return  <>404</>
  }


  return <Box>
    <ResourceComponents resourceCategoryName={name} />
  </Box>
}
export default DynamicListPage