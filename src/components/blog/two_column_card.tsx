import React from "react";
import { BlogCardProps } from "./props";
import {useNavigate} from "react-router-dom";
import { Box, Typography } from "@mui/material";
/// 两列展示的博客卡片
const TwoColumnBlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <>
      <Box p={2} onClick={()=>{
          navigate("/post/" + blog.id)
      }}>
          <Typography variant={"h5"} >
            {blog.title}
          </Typography>

      </Box>
    </>
  );
};
export default TwoColumnBlogCard;
