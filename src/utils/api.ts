import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import { ApiResponse } from "../models/app_model";
import { blogApi } from "./request";

///获取单个资源对象
export async function apiGetResourceModel(params: {
  id: string;
}): Promise<ApiResponse<ResourceModel>> {
  return blogApi().requestT(
    "/api/public/find-resource-by-id",
    { id: params.id },
    "GET"
  );
}

/**
 * 删除一个动态
 * /api/resource/delete
 */
export async function apiDeleteResourceModel(
  id: string
): Promise<ApiResponse<string>> {
  return blogApi().requestT("/api/resource/delete", { id }, "DELETE");
}
