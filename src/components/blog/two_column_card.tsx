import React from "react";
import { BlogCardProps } from "./props";
import { useNavigate } from "react-router-dom";
import TagIcon from '@mui/icons-material/Tag';
import {Box, Typography, Chip, Avatar, Stack} from "@mui/material";
import {grey} from "@mui/material/colors";
/// 两列展示的博客卡片
const TwoColumnBlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => {
        navigate("/post/" + blog.id);
      }}
    >
      <Box p={2}>
        <Typography
          variant={"h5"}
          style={{
            cursor: "pointer",
          }}
        >
          {blog.title}
        </Typography>
        <Stack sx={{ mt: 2 }} direction={'row'} spacing={2} flexWrap={'wrap'} alignItems={'center'}>
          <Chip
            avatar={<Avatar src={blog.category.logo} />}
            label={blog.category.name}
          />
          {
            blog.tags.map(value => <Typography key={value.id} color={grey["400"]} ><TagIcon sx={{fontSize: 12}} />{value.name}</Typography>)
          }
        </Stack>
      </Box>
    </Box>
  );
};
export default TwoColumnBlogCard;
