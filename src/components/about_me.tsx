import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import MyBox from "./box/my_box";
import {ListItem, Typography,Link} from "@mui/material";

//关于我的卡片
const AboutMeCard: React.FC = () => {
    return <MyBox>
        <Typography variant={'h1'} component={'h2'} >关于</Typography>
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
        <Typography variant={'h4'}>归档</Typography>
            {
                months.map(value => <ListItem key={value.months}><Link 
                                                                       href={'/month/' + value.months}>{value.months}
                   </Link> <span>({value.count})</span></ListItem>)
            }
    </MyBox>
}


//分类卡片
const CategoryCard: React.FC = () => {
    const categorys = useRecoilValue(archivesDataState)?.categoryList ?? [];
    return <MyBox>
        <Typography variant={'h4'}>分类</Typography>
        {categorys.length === 0 && <span>空空如也~</span>}

            {
                categorys.map(value => {
                    return <ListItem key={value.id}><Link  href={'/category/' + value.id}>{value.name}
                        </Link></ListItem>
                })
            }

    </MyBox>
}


//标签卡片
const TagCard: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];
    return <MyBox>
        <Typography variant={'h4'}>标签</Typography>
        {tags.length === 0 && <span>空空如也~</span>}

            {
                tags.map(value => {
                    return <ListItem key={value.id}><Link  href={'/tag/' + value.id}>{value.name}
                        </Link></ListItem>
                })
            }

    </MyBox>
}

export {AboutMeCard, ArchiveCard, CategoryCard,TagCard}