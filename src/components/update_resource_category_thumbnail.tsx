import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import React from "react";
import { getAxiosHeader, host } from "../utils/request";
import { ApiResponse } from "../models/app_model";
import axios from "axios";

type Props = {
  id: number;
  onSuccess?: () => void;
};

///接口
// async function api(params: any): Promise<ApiResponse<ResourceModel>> {
//   let data = await axios.post(host + "/api/auth/resource-thumbnail", params, {
//     ...getAxiosHeader(),
//   });
//   return data.data;
// }

///修改缩略图
const UpdateResourceCategoryThumbnail: React.FC<Props> = () => {


  return (
    <div className={'absolute top-1 right-1 z-20'}>
      {/*<Dropdown >*/}
      {/*  <DropdownTrigger>*/}
      {/*    <Icon className={'w-4 h-4 accent-primary'} />*/}
      {/*  </DropdownTrigger>*/}
      {/*  <DropdownMenu items={[*/}
      {/*    {*/}
      {/*      key: 'update',*/}
      {/*      label: "修改"*/}
      {/*    }*/}
      {/*  ]}>*/}
      {/*    {*/}
      {/*      (item) => {*/}
      {/*        return <DropdownItem onClick={async ()=>{*/}
      {/*          try {*/}
      {/*            const blob = await fileOpen({*/}
      {/*              mimeTypes: ["image/*"],*/}
      {/*            });*/}
      {/*            let form = new FormData();*/}
      {/*            form.append("file", blob);*/}
      {/*            form.append("id", `${id}`);*/}
      {/*            let result = await api(form);*/}
      {/*            console.log(result);*/}
      {/*            if (result.success) {*/}
      {/*              onSuccess?.();*/}
      {/*            } else {*/}
      {/*              setMsg(result.message);*/}
      {/*            }*/}
      {/*          } catch (error) {*/}
      {/*            console.log(error);*/}
      {/*          }*/}
      {/*        }}>{item.label}</DropdownItem>*/}
      {/*      }*/}
      {/*    }*/}
      {/*  </DropdownMenu>*/}
      {/*</Dropdown>*/}
    </div>
  );
};
export default UpdateResourceCategoryThumbnail;
