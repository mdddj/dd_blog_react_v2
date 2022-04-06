import React from "react";
import {Heading, Link, ListItem, UnorderedList} from "@chakra-ui/react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import MyBox from "./box/my_box";

//关于我的卡片
const AboutMeCard: React.FC = () => {
    return <MyBox>
        <Heading as={'h3'} mb={2}>关于</Heading>
        <p className="mb-0">欢迎来到典典的博客</p>
    </MyBox>
}


const ArchiveCard: React.FC = () => {
    const archives = useRecoilValue(archivesDataState)
    if (!archives) {
        return <></>
    }
    let months = archives.monthsCounts
    return <MyBox>
        <Heading as={'h4'} mb={2}>归档</Heading>
        <UnorderedList>
            {
                months.map(value => <ListItem key={value.months}><Link color={'teal.500'}
                                                                       href={'/month/' + value.months}>{value.months}
                    <ExternalLinkIcon mx='2px'/></Link> <span>({value.count})</span></ListItem>)
            }
        </UnorderedList>
    </MyBox>
}


//分类卡片
const CategoryCard: React.FC = () => {
    const categorys = useRecoilValue(archivesDataState)?.categoryList ?? [];
    return <MyBox>
        <Heading as={'h4'} mb={2}>分类</Heading>
        {categorys.length === 0 && <span>空空如也~</span>}

        <UnorderedList>
            {
                categorys.map(value => {
                    return <ListItem key={value.id}><Link color={'teal.500'} href={'/category/' + value.id}>{value.name}
                        <ExternalLinkIcon mx='2px'/></Link></ListItem>
                })
            }
        </UnorderedList>

    </MyBox>
}


//标签卡片
const TagCard: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];
    return <MyBox>
        <Heading as={'h4'} mb={2}>标签</Heading>
        {tags.length === 0 && <span>空空如也~</span>}

        <UnorderedList>
            {
                tags.map(value => {
                    return <ListItem key={value.id}><Link color={'teal.500'} href={'/tag/' + value.id}>{value.name}
                        <ExternalLinkIcon mx='2px'/></Link></ListItem>
                })
            }
        </UnorderedList>

    </MyBox>
}

export {AboutMeCard, ArchiveCard, CategoryCard,TagCard}