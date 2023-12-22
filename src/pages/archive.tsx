import React from "react";
import {useRecoilState} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import PageHeader from "../components/page_header";
import NothingWidget from "../components/nothing";
import {MonthsCount} from "dd_server_api_web/dist/model/ArchiveModel";
import {Card, CardBody, CardHeader, Divider} from "@nextui-org/react";

const Archive: React.FC = () => {


    const [archive] = useRecoilState(archivesDataState)
    const archives = archive?.archiveModels ?? []

    return <>
        <PageHeader title={'归档'}/>
        <NothingWidget nothing={archives.length === 0}/>
        <div className={'flex flex-col gap-2'}>
            {
                archives.map(value => <MonthGroup monthItem={value} key={value.months}/>)
            }
        </div>

    </>
}


const MonthGroup: React.FC<{ monthItem: MonthsCount }> = ({monthItem}) => {

    const blogs = monthItem.blogs ?? []


    return <>
        <Card>
            <CardHeader className={'font-bold text-large'}>
                {monthItem.months}
            </CardHeader>
            <Divider/>
            <CardBody>
                {
                    blogs.map(value => {
                       let dateString = dayjs(value.createTime).format('YYYY-MM-DD')
                       return (<div key={value.id}>
                           <div><span>{dateString}</span> <Link
                               style={{color: '#007bff', cursor: 'pointer'}}
                               to={'/post/' + value.id}>{value.title}</Link></div>
                       </div>)
                   })
               }
           </CardBody>

        </Card>

    </>
}


export default Archive