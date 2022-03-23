import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../utils/request";
import {ResCategory} from "dd_server_api_web/apis/model/ResCategory";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {Box, Button, Divider, Heading, LinkBox, LinkOverlay} from "@chakra-ui/react";
import TwoColumnLayout from "./two_column_layout";
import {ResourceModel} from "dd_server_api_web/apis/model/ResourceModel";
import {formatDateUtil} from "../utils/DateUtil";

type Props = {
    resourceCategoryName: String //动态分类的名字
}

//动态小页面
const ResourceComponents: React.FC<Props> = ({resourceCategoryName}) => {

    const [resCate, setResCate] = useState<ResCategory | undefined>(undefined)
    const [list, setList] = useState<ResourceModel[]>([])

    // 加载全部的分类
    const getAllRescategory = () => {
      blogApi().getResourceCategoryAll().then(value => {
          successResultHandle(value,data => {
              console.log(data)
          })
      })
    }

    //组件挂载
    useMount(async () => {
        let result = await blogApi().getResourceCategory({name: resourceCategoryName} as any);
        successResultHandle(result, data => {
            setResCate(data)
            fetchList(0, data?.id)
        })
        getAllRescategory()
    })

    //加载列表
    const fetchList = async (page: number, id?: number) => {
        // let categoryId = id ?? resCate?.id
        let pager = {page: page, pageSize: 20}
        let result = await blogApi().getResourceList(pager, undefined, {},)
        successResultHandle(result, data => {
            let newArray = [...list, ...data.list]
            setList(newArray)
        })
    }

    return <>
        {
            resCate && <Heading size={'sm'}>{resCate.name}</Heading>
        }
        <TwoColumnLayout right={[
            <Button colorScheme='teal' variant='outline'>
                发布动态
            </Button>
        ]}>
            {
                list.map(value => {
                    console.log(value.type)
                    return <DynamicCard key={value.id} res={value}/>
                })
            }
        </TwoColumnLayout>
    </>
}


///动态卡片
const DynamicCard: React.FC<{ res: ResourceModel }> = ({res}) => {
    if (res.type === 'doc-post') {
        return <DocDynamicCard res={res}/>
    }
    return <>

    </>
}


///文档卡片
const DocDynamicCard: React.FC<{ res: ResourceModel }> = ({res}) => {

    return <LinkBox as='article' rounded='md' mb={4}>
        <Box as='time' fontSize={12} color={'grey'}>
            文档  &bull; 梁典典发布于{formatDateUtil(res.createDate)}
        </Box>
        <Heading size='md' my='2'>
            <LinkOverlay href='#' color={'teal.400'}>
                {res.title}
            </LinkOverlay>
        </Heading>
        <Box>
            {res.category && <span >
            <span style={{fontSize: 10, color: 'grey'}}>{res.category.name}</span></span>}
        </Box>
        <Divider/>
    </LinkBox>
}

export default ResourceComponents

