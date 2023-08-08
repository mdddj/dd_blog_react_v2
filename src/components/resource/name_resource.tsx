import { blogApi } from "../../utils/request";
import { useMount } from "react-use";
import React, { useState } from "react";
import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import { ApiResponse, JpaPage } from "../../models/app_model";

async function request(name: string) {
  return blogApi().requestT<ApiResponse<JpaPage<ResourceModel>>>(
    "/api/app/resource/list",
    {
      name: name,
      page: 0,
      pageSize: 100,
    }
  );
}

type NameResourceWidgetProp = {
  categoryName: string;
  render: (list: ResourceModel[]) => React.ReactElement;
};

const NameResourceWidget: React.FC<NameResourceWidgetProp> = (prop) => {
  const [list, setList] = useState<ResourceModel[]>([]);

  useMount(() => {
    request(prop.categoryName).then((r) => {
      setList(r.data.content);
    });
  });
  return prop.render(list);
};

export default NameResourceWidget;
