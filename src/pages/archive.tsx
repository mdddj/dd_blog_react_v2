import React from "react";
import {useRecoilState} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import PageHeader from "../components/page_header";
import NothingWidget from "../components/nothing";
import MyBox from "../components/box/my_box";
import {Box, Typography} from "@mui/material";
import { MonthsCount } from "dd_server_api_web/dist/model/ArchiveModel";

const Archive: React.FC = () => {


    const [archive] = useRecoilState(archivesDataState)
    const archives = archive?.archiveModels ?? []

    return <>

        <PageHeader title={'归档'}/>
        <NothingWidget nothing={archives.length === 0} />
        <MyBox>
            {
                archives.map(value => <MonthGroup monthItem={value} key={value.months}/>)
            }
        </MyBox>

    </>
}


const MonthGroup: React.FC<{ monthItem: MonthsCount }> = ({monthItem}) => {

    const blogs = monthItem.blogs ?? []


    return <Box>
        <Box mb={5}>
            <Typography>{monthItem.months}</Typography>
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