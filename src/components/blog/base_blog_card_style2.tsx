import React from "react";
import { BlogCardProps } from "./props";
import TwoColumnBlogCard from "./two_column_card";

const BaseBlogCardStyle2: React.FC<BlogCardProps> = ({ blog }) => {
    return <TwoColumnBlogCard blog={blog} className='' />
}

export default BaseBlogCardStyle2