import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../utils/request";
import {ResCategory} from "dd_server_api_web/apis/model/ResCategory";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {Heading} from "@chakra-ui/react";
import TwoColumnLayout from "./two_column_layout";
import {ResourceModel} from "dd_server_api_web/apis/model/ResourceModel";

type Props = {
    resourceCategoryName: String //动态分类的名字
}

//动态小页面
const ResourceComponents: React.FC<Props> = ({resourceCategoryName}) => {

    const [resCate, setResCate] = useState<ResCategory | undefined>(undefined)
    const [list, setList] = useState<ResourceModel[]>([])

    useMount(async () => {
        let result = await blogApi().getResourceCategory({name: resourceCategoryName} as any);
        successResultHandle(result, data => {
            setResCate(data)
            fetchList(0, data?.id)
        })
    })

    const fetchList = async (page: number, id?: number) => {
        let categoryId = id ?? resCate?.id
        console.log('查询ID:' + categoryId)
        let result = await blogApi().getResourceList({page: page, pageSize: 20}, categoryId,{},p => {
            console.log('ddd')
        })
        successResultHandle(result, data => {
            let newArray = [...list, ...data.list]
            setList(newArray)
        })
    }

    return <>
        {
            resCate && <Heading size={'sm'}>{resCate.name}</Heading>
        }
        <TwoColumnLayout right={[]}>

        </TwoColumnLayout>
    </>
}
export default ResourceComponents