export interface PageParam {
    page?: number;
    pageSize: number;
    pageId?: number;
}
export interface AntdTablePageParams {
    current: number | undefined;
    pageSize: number | undefined;
}
export declare const coverAntdPageParamModelToRequestParam: <T>(params: AntdTablePageParams) => PageParam;
export interface AntdTableResultData<T> {
    data: T[];
    success: boolean;
    total: number;
    current: number;
}
