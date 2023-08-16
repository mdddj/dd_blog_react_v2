import React from "react";
import {BlogCardProps} from "./props";
import {useNavigate} from "react-router-dom";
import {Box, Typography, Chip, Avatar, Card} from "@mui/material";
/// 两列展示的博客卡片
const TwoColumnBlogCard: React.FC<BlogCardProps> = ({blog}) => {
    const navigate = useNavigate();
    return (
        <Card sx={{
            mb:2
        }}>
            <Box p={2}>
                <Typography
                    variant={"h5"}
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate("/post/" + blog.id);
                    }}
                >
                    {blog.title}
                </Typography>
                <Box sx={{mt: 2}}>
                    <Chip avatar={<Avatar src={blog.category.logo}/>} label={blog.category.name}/>
                </Box>
            </Box>
        </Card>
    );
};
export default TwoColumnBlogCard;
