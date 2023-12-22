import React from "react";
import { useParams } from "react-router-dom";
import ResourceComponents from "../../components/resource_components";

//动态列表的组件
const DynamicListPage: React.FC = () => {
  const params = useParams();

  return (
    <div>
      <ResourceComponents resourceCategoryName={params.cateName ?? ""} />
    </div>
  );
};
export default DynamicListPage;
