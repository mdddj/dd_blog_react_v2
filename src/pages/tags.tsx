import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Link, Outlet} from "react-router-dom";
import Box from "../components/box/box";

//标签列表页面
const TagsPage: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];


    return <div className={'flex'}>

        <div className={'w-48'}>
            {tags.map((value) => {
                return (
                    <Box key={value.id}>
                        <Link to={"/tag/" + value.id}>#{value.name}</Link>
                    </Box>
                );
            })}
        </div>

        <div className={'flex-auto'}>
            <Outlet />
        </div>

    </div>


};

export default TagsPage;
