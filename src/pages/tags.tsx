import React from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../providers/archives";
import {
    Tag,
} from "@chakra-ui/react";
import {Link, Outlet} from "react-router-dom";
import {LeftMenuLayout} from "../components/LeftMenuLayout";

//标签列表页面
const TagsPage: React.FC = () => {
    const tags = useRecoilValue(archivesDataState)?.tags ?? [];

    return <LeftMenuLayout left={[
        (<div>
                {tags.map((value) => {
                    return (
                            <div key={value.id} style={{
                                marginTop: '0.5rem',
                                lineHeight: 1.625
                            }}>
                                <Link to={"/tag/" + value.id}>{value.name}</Link>
                            </div>
                    );
                })}
        </div>)
    ]}>
        <Outlet/>
    </LeftMenuLayout>
};

export default TagsPage;
