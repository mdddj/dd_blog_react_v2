import React from "react";
import {useRecoilState} from "recoil";
import {archivesDataState} from "../providers/archives";
import {MonthsCount} from "dd_server_api_web/apis/model/ArchiveModel";
import {Link} from "react-router-dom";
import {Box, Heading} from "@chakra-ui/react";
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


    return <Box mb={5}>
        <Box mb={5}>
            <Heading as={'h3'}>{monthItem.months}</Heading>
        </Box>
        <ul style={{listStyle: 'none'}}>
            {
                blogs.map(value => {
                    let dateString = dayjs(value.createTime).format('YYYY-MM-DD')
                    return (<li style={{display: 'block',marginBottom: 12}} key={value.id}>
                        <span style={{float: 'right', color: '#767676'}}>{dateString}</span>
                        <Link style={{color: '#007bff', cursor: 'pointer'}}
                              to={'/post/' + value.id}>{value.title}</Link>
                    </li>)
                })
            }

        </ul>

    </Box>
}


export default Archive