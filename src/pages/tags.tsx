import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Outlet, useNavigate} from "react-router-dom";
import {Listbox, ListboxItem} from "@nextui-org/react";
import TwoColumnLayout from "../components/two_column_layout";

//标签列表页面
const TagsPage: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];

    const nav = useNavigate()
    return <div className={'flex flex-col gap-2'}>


        {/*<Tabs onSelectionChange={key => {*/}
        {/*    nav(`/tag/${key}`)*/}
        {/*}}>*/}
        {/*    {*/}
        {/*        tags.map(value => <Tab key={value.name} title={value.name} > <Outlet /></Tab>)*/}
        {/*    }*/}
        {/*</Tabs>*/}
        <TwoColumnLayout right={[
            <Listbox aria-label={'tags'}>
                {tags.map((value) => {
                    return (
                           <ListboxItem key={value.id} onClick={()=>{
                               nav(`/tag/${value.id}`)
                           }}>
                               {value.name}
                           </ListboxItem>
                    );
                })}
            </Listbox>
        ]}>

            <Outlet/>
        </TwoColumnLayout>

    </div>


};

export default TagsPage;
