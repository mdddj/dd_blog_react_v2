import React from "react";
import { BlogCardProps } from "./props";
import { Link } from "react-router-dom";


/// 两列展示的博客卡片
const TwoColumnBlogCard: React.FC<BlogCardProps> = ({ blog, className }) => {
    return <>
        <div className={className !== undefined ? className : "col-md-6"}>
            <div
                className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm position-relative">
                <div className="col p-4 d-flex flex-column position-static">
                    <strong className="d-inline-block mb-2 text-primary">{blog.category.name}</strong>
                    <h3 className="mb-0">{blog.title}</h3>
                    <div className="mb-1 text-muted">{blog.dateString}</div>
                    <p className="card-text mb-auto"> </p>
                    <Link to={'/post/' + blog.id} className="stretched-link">查看文章</Link>
                </div>
                <div className="col-auto d-none d-lg-block">
                    <svg className="bd-placeholder-img" width="200" height="250" xmlns="http://www.w3.org/2000/svg"
                        role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice"
                        focusable="false"><title>Placeholder</title>
                        <text x="50%" y="50%" fill="#eceeef" dy=".3em"> </text>
                    </svg>

                </div>
            </div>
        </div>
    </>
}
export default TwoColumnBlogCard