import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {Link, Outlet} from "react-router-dom";
import {Box, Grid} from "@mui/material";

//标签列表页面
const TagsPage: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];


    return <Grid container spacing={2}>

        <Grid item xs={3}>
            {tags.map((value) => {
                return (
                    <Box key={value.id} m={1}>
                            <Link to={"/tag/" + value.id}>{value.name}</Link>
                    </Box>
                );
            })}
        </Grid>

        <Grid item xs={9}>
            <Outlet />
        </Grid>

    </Grid>


};

export default TagsPage;
