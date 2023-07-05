import React, {useState} from "react";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../../providers/loading";
import NothingWidget from "../../components/nothing";
import PageHeader from "../../components/page_header";
import {useNavigate} from "react-router-dom";
import {ImageList, ImageListItem, ImageListItemBar} from "@mui/material";
import { ResCategory } from "dd_server_api_web/dist/model/ResCategory";
import { PagerModel, Result, successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";
import MyBox from "../../components/box/my_box";

//文档列表页面
const DocsPage:React.FC = () => {


  const [docs, setDocs] = useState<ResCategory[]>([])
  const [pager,setPager] = useState<PagerModel>()
  const setLoading = useSetRecoilState(appLoading)
   const nav = useNavigate()


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
        setDocs(data.list??[])
      })
      setPager(value.data?.page)
    })
  }


  useMount(()=>{
    fetchData()
  })

  const getImage = (item: ResCategory): string => {
    if (item.logo || item.logo === "") {
      return "https://bit.ly/2Z4KKcF";
    }
    return item.logo!;
  };

  return <MyBox>
    <PageHeader title={'文档'} />
    <NothingWidget nothing={ pager && pager.total === 0 } />



    <ImageList  cols={6} rowHeight={200}>

      {docs.map((item)=>{
        return <ImageListItem key={item.id} onClick={()=>{
          nav("/docs/"+item.id)
        }}>
            <img
              src={`${getImage(item)}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${getImage(
                item
              )}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.name}
              loading="lazy"
            />
            <ImageListItemBar title={item.name} subtitle={item.description} />
        </ImageListItem>
      })}

    </ImageList>

  </MyBox>
}
export default DocsPage