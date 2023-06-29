import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../../providers/loading";
import NothingWidget from "../../components/nothing";
import PageHeader from "../../components/page_header";
import {Link} from "react-router-dom";
import {Box, Chip, Grid} from "@mui/material";
import {AspectRatio} from "@mui/icons-material";
import { ResCategory } from "dd_server_api_web/dist/model/ResCategory";
import { PagerModel, Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";

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
    } as any).then( (value: Result<{
      page: PagerModel;
      list: ResCategory[];
    }>) => {
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
    <Grid columns={4} spacing={10}>
      {
        docs.map(property =>  <Box key={property.id}>

          <AspectRatio>
            <img src={property.logo} alt={property.name}/>
          </AspectRatio>

          <Box p='6'>
            <Box display='flex' alignItems='baseline'>
              <Chip  label={property.type} />

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

            <Box>
             <Link to={'/docs/'+property.id}> {property.name}</Link>
            </Box>

            <Box>
              {property.description}
            </Box>
          </Box>
        </Box>)
      }
    </Grid>
  </>
}
export default DocsPage