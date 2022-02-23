import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Box, Heading, HStack, Tag} from "@chakra-ui/react";
import {Link, Outlet} from "react-router-dom";

//标签列表页面
const TagsPage:React.FC = () => {


  const tags = useRecoilValue(archivesDataState)?.tags??[]
  return <>
    <Box p={12} border={1} width={'100%'}>
      <Heading>标签</Heading>
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