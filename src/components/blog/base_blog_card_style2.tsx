import React from "react";
import { BlogCardProps } from "./props";
import TwoColumnBlogCard from "./two_column_card";
import StyledCard from "./styled";

const BaseBlogCardStyle2: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <StyledCard>
      <TwoColumnBlogCard blog={blog} className="" />
    </StyledCard>
  );
};

export default BaseBlogCardStyle2;
