import React from "react";
import {Box, Heading, Link, ListItem, UnorderedList} from "@chakra-ui/react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import { ExternalLinkIcon } from "@chakra-ui/icons";

//关于我的卡片
const AboutMeCard: React.FC = () => {
  return <Box borderWidth={1} p={5} borderRadius={5} bg={"white"}>
          <Heading as={'h3'} mb={2}>关于</Heading>
          <p className="mb-0">欢迎来到典典的博客</p>
  </Box>
}


const ArchiveCard: React.FC = () => {
    const archives = useRecoilValue(archivesDataState)
    if(!archives){
        return <></>
    }
    let months = archives.monthsCounts
    return <Box borderWidth={1} borderRadius={5} p={5} bg={"white"}>
        <Heading as={'h4'} mb={2}>归档</Heading>
        <UnorderedList>
            {
                months.map(value => <ListItem key={value.months}><Link color={'teal.500'} href={'/month/'+value.months}>{value.months} <ExternalLinkIcon mx='2px' /></Link> <span>({value.count})</span></ListItem>)
            }
        </UnorderedList>
    </Box>
}


//分类卡片
const CategoryCard: React.FC = () => {
    const categorys = useRecoilValue(archivesDataState)?.categoryList ?? [];
    return <Box borderWidth={1} borderRadius={5} p={5} bg={"white"}>
        <Heading as={'h4'} mb={2}>分类</Heading>
        { categorys.length === 0 && <span>空空如也~</span> }

        <UnorderedList>
            {
                categorys.map(value => {
                    return <ListItem key={value.id}><Link color={'teal.500'} href={'/category/'+value.id}>{value.name} <ExternalLinkIcon mx='2px' /></Link></ListItem>
                })
            }
        </UnorderedList>

    </Box>
}

export {AboutMeCard,ArchiveCard,CategoryCard}