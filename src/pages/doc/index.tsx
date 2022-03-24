import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {ResCategory} from "dd_server_api_web/apis/model/ResCategory";
import {AspectRatio, Badge, Box, Image, SimpleGrid} from "@chakra-ui/react";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../../providers/loading";
import NothingWidget from "../../components/nothing";
import {PagerModel} from "dd_server_api_web/src/utils/ResultUtil";
import PageHeader from "../../components/page_header";
import {Link} from "react-router-dom";

//文档列表页面
const DocsPage:React.FC = () => {


  const [docs, setDocs] = useState<ResCategory[]>([])
  const [pager,setPager] = useState<PagerModel>()
  const setLoading = useSetRecoilState(appLoading)


  // 加载数据
  const fetchData = () => {
    setLoading(true)
    blogApi().getResourceCategoryList({
      page: 0,
      pageSize: 1000
    },{
     type: 'doc'
    } as any).then(value => {
      setLoading(false)
      successResultHandle(value,data => {
        console.log(data)
        setDocs(data.list??[])
      })
      setPager(value.data?.page)
    })
  }


  useMount(()=>{
    fetchData()
  })


  return <>
    <PageHeader title={'文档'} />
    <NothingWidget nothing={ pager && pager.total === 0 } />
    <SimpleGrid columns={4} spacing={10}>
      {
        docs.map(property =>  <Box key={property.id} borderWidth='1px' borderRadius='lg' overflow='hidden'>

          <AspectRatio ratio={4 / 3}>
            <Image src={property.logo} alt={property.name} />
          </AspectRatio>

          <Box p='6'>
            <Box display='flex' alignItems='baseline'>
              <Badge borderRadius='full' px='2' colorScheme='teal'>
                {property.type}
              </Badge>
              <Box
                  color='gray.500'
                  fontWeight='semibold'
                  letterSpacing='wide'
                  fontSize='xs'
                  textTransform='uppercase'
                  ml='2'
              >
              </Box>
            </Box>

            <Box
                mt='1'
                fontWeight='semibold'
                as='h4'
                lineHeight='tight'
                isTruncated
            >
             <Link to={'/docs/'+property.id}> {property.name}</Link>
            </Box>

            <Box>
              {property.description}
            </Box>
          </Box>
        </Box>)
      }
    </SimpleGrid>
  </>
}
export default DocsPage