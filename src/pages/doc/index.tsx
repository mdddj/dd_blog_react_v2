import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {ResCategory} from "dd_server_api_web/apis/model/ResCategory";
import {Badge, Box, Image, SimpleGrid} from "@chakra-ui/react";

//文档列表页面
const DocsPage:React.FC = () => {


  const [docs, setDocs] = useState<ResCategory[]>([])


  const fetchData = () => {
    blogApi().getResourceCategoryList({
      page: 0,
      pageSize: 1000
    },{
     type: 'doc'
    } as any).then(value => {
      successResultHandle(value,data => {
        console.log(data)
        setDocs(data.list??[])
      })
    })
  }


  useMount(()=>{
    fetchData()
  })


  return <>
    <SimpleGrid columns={4} spacing={10}>
      {
        docs.map(property =>  <Box key={property.id} borderWidth='1px' borderRadius='lg' overflow='hidden'>
          <Image src={property.logo} alt={property.name} />

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
              {property.name}
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