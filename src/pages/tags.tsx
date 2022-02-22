import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Box, Heading, HStack, Tag} from "@chakra-ui/react";

//标签列表页面
const TagsPage:React.FC = () => {


  const tags = useRecoilValue(archivesDataState)?.tags??[]
  console.log(tags)
  return <>
    <Box p={12} bg={'black'} width={'100%'}>
      <Heading>标签</Heading>
      <HStack spacing={4}>
        {
          tags.map(value => {
            return <Tag key={value.id}>{value.name}</Tag>
          })
        }
      </HStack>
    </Box>
  </>
}

export default TagsPage