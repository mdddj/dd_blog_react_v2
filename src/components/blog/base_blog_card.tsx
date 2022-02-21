import React from "react";
import {BlogCardProps} from "./props";

///基本卡片布局
const BaseBlogCard : React.FC<BlogCardProps> = ({blog}) => {
    return <>
        <article className="blog-post">
            <h2 className="blog-post-title">{blog.title}</h2>
            <p className="blog-post-meta">{blog.dateString} <span >{blog.author}</span></p>
        </article>
    </>
}

export default BaseBlogCard