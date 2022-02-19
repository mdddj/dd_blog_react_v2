import React from "react";
import {BlogCardProps} from "./props";
import {BlogPreview} from "../blog_content";

///基本卡片布局
const BaseBlogCard : React.FC<BlogCardProps> = ({blog}) => {
    return <>
        <article className="blog-post">
            <h2 className="blog-post-title">{blog.title}</h2>
            <p className="blog-post-meta">{blog.dateString} <span >{blog.author}</span></p>
            <BlogPreview content={blog.content} />
        </article>
    </>
}

export default BaseBlogCard