import React from "react";
import {BlogData} from "dd_server_api_web/apis/model/result/BlogPushNewResultData";
import {Link} from "react-router-dom";

type Props = {
    blog: BlogData
}

///超大的博客卡片
const LargeBlogCard: React.FC<Props> = ({blog}) => {
    return <>
        <div className="p-4 p-md-5 mb-4 text-white rounded bg-dark">
            <div className="col-md-6 px-0">
                <h1 className="display-4 fst-italic">{blog.title}</h1>
                <p className="lead my-3">{blog.dateString}</p>
                <p className="lead mb-0"><Link to={'/detail?id='+blog.id} className="text-white fw-bold">查看文章...</Link></p>
            </div>
        </div>
    </>
}

export default LargeBlogCard