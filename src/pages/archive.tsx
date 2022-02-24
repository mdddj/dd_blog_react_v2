import React from "react";
import {useRecoilState} from "recoil";
import {archivesDataState} from "../providers/archives";
import {MonthsCount} from "dd_server_api_web/apis/model/ArchiveModel";
import {Link} from "react-router-dom";
import {Heading} from "@chakra-ui/react";
import dayjs from "dayjs";
import PageHeader from "../components/page_header";
import NothingWidget from "../components/nothing";

const Archive: React.FC = () => {


    const [archive] = useRecoilState(archivesDataState)
    const archives = archive?.archiveModels ?? []

    return <>

        <PageHeader title={'归档'}/>
        <NothingWidget nothing={archives.length === 0} />
        {
            archives.map(value => <MonthGroup monthItem={value} key={value.months}/>)
        }

    </>
}


const MonthGroup: React.FC<{ monthItem: MonthsCount }> = ({monthItem}) => {

    const blogs = monthItem.blogs ?? []


    return <>
        <Heading as={'h3'} className={'mb-2'}>{monthItem.months}</Heading>
        <ul className="list mb-5" style={{listStyle: 'none'}}>
            {
                blogs.map(value => {
                    let dateString = dayjs(value.createTime).format('YYYY-MM-DD')
                    return (<li style={{display: 'block'}} className={'mb-2'} key={value.id}>
                        <span style={{float: 'right', color: '#767676'}}>{dateString}</span>
                        <Link style={{color: '#007bff', cursor: 'pointer'}}
                              to={'/post/' + value.id}>{value.title}</Link>
                    </li>)
                })
            }

        </ul>

    </>
}


export default Archive