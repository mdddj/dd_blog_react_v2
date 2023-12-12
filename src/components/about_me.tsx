import React, {PropsWithChildren} from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import MyBox from "./box/my_box";
import {Link} from "@nextui-org/react";

//关于我的卡片
const AboutMeCard: React.FC = () => {
    return <MyBox>
        <span>关于</span>
        <p className="mb-0">欢迎来到典典的博客</p>
    </MyBox>
}


const ArchiveCard: React.FC = () => {
    const archives = useRecoilValue(archivesDataState)
    if (!archives) {
        return <></>
    }
    let months = archives.monthsCounts
    return <SingleColumns title={'归档'}>
        {
            months.map(value => <div key={value.months}><Link
                href={'/month/' + value.months}>{value.months} ({value.count})
            </Link></div>)
        }
    </SingleColumns>
}


//分类卡片
const CategoryCard: React.FC = () => {
    const categorys = useRecoilValue(archivesDataState)?.categoryList ?? [];
    return <SingleColumns title={'分类'}>
        {
            categorys.map(value => {
                return <div key={value.id}>
                    <Link href={'/category/' + value.id}>{value.name}
                    </Link>
                </div>
            })
        }
    </SingleColumns>

}


//标签卡片
const TagCard: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];
    return <SingleColumns title={'标签'}>
        {
            tags.map(value => {
                return <div key={value.id}>
                    <Link ><Link href={'/tag/' + value.id}>{value.name}
                    </Link></Link>
                </div>
            })
        }
    </SingleColumns>
}


const SingleColumns: React.FC<PropsWithChildren<{
    title: string,
}>> = ({title, children}) => {
    return <div>
        <span>{title}</span>
        {children}
    </div>
}

export {AboutMeCard, ArchiveCard, CategoryCard, TagCard}