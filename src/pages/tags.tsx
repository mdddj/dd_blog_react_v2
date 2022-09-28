import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Link, Outlet, useParams} from "react-router-dom";
import {LeftMenuLayout} from "../components/LeftMenuLayout";
import { Box, Button } from "@chakra-ui/react";

//标签列表页面
const TagsPage: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];

    const params = useParams<{id:string}>()
    console.log(params)
    let id = params.id ?? ''

    return <LeftMenuLayout left={[
        (<div>
                {tags.map((value) => {
                    return (
                            <Box key={value.id} m={1}>
                                <Button  colorScheme={'gray'} width={'100%'} variant={id === `${value.id}` ? 'outline' : 'ghost'}>
                                <Link to={"/tag/" + value.id}>{value.name}</Link>
                            </Button>
                            </Box>
                    );
                })}
        </div>)
    ]}>
        <Outlet/>
    </LeftMenuLayout>
};

export default TagsPage;
