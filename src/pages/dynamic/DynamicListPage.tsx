import React from "react";
import { useParams } from "react-router-dom";
import ResourceComponents from "../../components/resource_components";
import Box from "../../components/box/box";

//动态列表的组件
const DynamicListPage: React.FC = () => {
  const params = useParams();

  return (
    <Box>
      <ResourceComponents resourceCategoryName={params.cateName ?? ""} />
    </Box>
  );
};
export default DynamicListPage;
