import React from "react";
import { BlogCardProps } from "./props";
import { Link } from "react-router-dom";
import {Box, Tag} from "@chakra-ui/react";


/// 两列展示的博客卡片
const TwoColumnBlogCard: React.FC<BlogCardProps> = ({ blog}) => {
    return <>
        <Box borderRadius='lg' overflow='hidden' p={6} mb={2}>
            <Tag  px='2'>
                {blog.category.name}
            </Tag>


            <Box
                mt='1'
                fontWeight='semibold'
                as='h4'
                lineHeight='tight'
            >
                {blog.title}
            </Box>

            <Box display='flex' alignItems='baseline'>
                <Box
                    color='gray.500'
                    fontWeight='semibold'
                    letterSpacing='wide'
                    fontSize='xs'
                    textTransform='uppercase'
                >
                    {blog.tags.map((value,index) => <span key={value.id}>{value.name} {index!==blog.tags.length-1 ? '•' : ''} </span>)}
                </Box>
            </Box>

            <Box mt={4}>
                <Link to={'/post/'+blog.id}>查看全文</Link>
            </Box>

        </Box>
    </>
}
export default TwoColumnBlogCard