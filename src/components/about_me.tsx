import React from "react";
import {Heading, Link, ListItem, UnorderedList} from "@chakra-ui/react";
import {useRecoilState} from "recoil";
import {archivesDataState} from "../providers/archives";
import { ExternalLinkIcon } from "@chakra-ui/icons";

//关于我的卡片
const AboutMeCard: React.FC = () => {
  return <>
      <div className="p-4 mb-3 bg-light rounded">
          <Heading as={'h3'} className="fst-italic">关于</Heading>
          <p className="mb-0">你好陌生人,我叫梁典典,欢迎来到我的个人博客.你可以在这里找到flutter相关的技术文章,另外我的微信和QQ的小程序也上线了,直接搜索"典典博客"</p>
      </div>
  </>
}


const ArchiveCard: React.FC = () => {
    const [archives] = useRecoilState(archivesDataState)
    if(!archives){
        return <></>
    }
    let months = archives.monthsCounts
    return <>
        <Heading as={'h4'}>归档</Heading>
        <UnorderedList>
            {
                months.map(value => <ListItem key={value.months}><Link isExternal={true} color={'teal.500'} href={'/months/'+value.months}>{value.months} <ExternalLinkIcon mx='2px' /></Link> <span>({value.count})</span>

                </ListItem>)
            }
        </UnorderedList>
    </>
}

export {AboutMeCard,ArchiveCard}