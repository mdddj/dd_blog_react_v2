import React from "react";
import {Link} from "react-router-dom";
import {BlogCardProps} from "./props";


///超大的博客卡片
const LargeBlogCard: React.FC<BlogCardProps> = ({blog}) => {
    return <>
        <div className="p-4 p-md-5 mb-4 text-white rounded bg-dark">
            <div className="col-md-6 px-0">
                <h1 className="display-4 fst-italic">{blog.title}</h1>
                <p className="lead my-3">{blog.dateString}</p>
                <p className="lead mb-0"><Link to={'/post/'+blog.id} className="text-white fw-bold">查看文章...</Link></p>
            </div>
        </div>
    </>
}

export default LargeBlogCard