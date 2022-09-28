import React, {useState} from "react";
import {useMount} from "react-use";
import {blogApi} from "../utils/request";
import {ResCategory} from "dd_server_api_web/apis/model/ResCategory";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {Box, Divider, Heading, LinkBox, LinkOverlay} from "@chakra-ui/react";
import {ResourceModel} from "dd_server_api_web/apis/model/ResourceModel";
import {formatDateUtil} from "../utils/DateUtil";
import { Link } from "react-router-dom";

type Props = {
    resourceCategoryName: string //动态分类的名字
}

//动态小页面
const ResourceComponents: React.FC<Props> = ({resourceCategoryName}) => {

    const [resCate, setResCate] = useState<ResCategory | undefined>(undefined)
    const [list, setList] = useState<ResourceModel[]>([])


    //组件挂载
    useMount(async () => {
        let result = await blogApi().getResourceCategory({name: resourceCategoryName} as any);
        successResultHandle(result, data => {
            setResCate(data)
            fetchList(0, data?.id)
        })
    })

    //加载列表
    const fetchList = async (page: number, id?: number) => {
        let pager = {page: page, pageSize: 20}
        let result = await blogApi().getResourceList(pager, id, {},)
        successResultHandle(result, data => {
            let newArray = [...list, ...data.list]
            setList(newArray)
        })
    }

    return <>
        
        <Box>
        {
            resCate && <Heading size={'sm'}>{resCate.name}</Heading>
        }

        <Link to={"/add-res"}>发布</Link>
            {
                list.map(value => {
                    console.log(value.type)
                    return <DynamicCard key={value.id} res={value}/>
                })
            }
        </Box>
    </>
}


///动态卡片
const DynamicCard: React.FC<{ res: ResourceModel }> = ({res}) => {
    if (res.type === 'doc-post') {
        return <DocDynamicCard res={res}/>
    }
    if(res.type==='simple-text')
    return <SingleTextCard res={res} />

    return <></>
}


/// 简单文本类型
const SingleTextCard: React.FC<{res: ResourceModel}> = ({res}) => {
  return <Box  rounded='md' mb={4}>
      <Box as='time' fontSize={12} color={'grey'}>
          记录  &bull; 梁典典发布于{formatDateUtil(res.createDate)}
      </Box>
      <Box>
          {res.content}
      </Box>
  </Box>
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

