import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Box, HStack, Tag} from "@chakra-ui/react";
import {Link, Outlet} from "react-router-dom";
import PageHeader from "../components/page_header";

//标签列表页面
const TagsPage:React.FC = () => {
  const tags = useRecoilValue(archivesDataState)?.tags??[]
  return <>
    <PageHeader title={'标签'}/>
    <Box p={12} border={1} width={'100%'}>
      <HStack spacing={4} mt={4}>
        {
          tags.map(value => {
            return <Tag key={value.id}><Link to={'/tag/'+value.id}>{value.name}</Link></Tag>
          })
        }
      </HStack>

      <div style={{marginTop: 20}}>
        <Outlet />
      </div>
    </Box>
  </>
}

export default TagsPage