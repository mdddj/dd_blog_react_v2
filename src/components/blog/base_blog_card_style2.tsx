import React from "react";
import {BlogCardProps} from "./props";
import {Box, Heading, LinkBox, LinkOverlay} from "@chakra-ui/react";

const BaseBlogCardStyle2: React.FC<BlogCardProps> = ({blog}) => {
    return <>
        <LinkBox as='article' p='5' borderWidth='1px' rounded='md' className={'mb-2'}>
            <Box as='time' dateTime='2021-01-15 15:30:00 +0000 UTC'>
                {blog.dateString}
            </Box>
            <Heading size='md' my='2'>
                <LinkOverlay href={'/post/'+blog.id}>
                    {blog.title}
                </LinkOverlay>
            </Heading>
            <Box as='a' color='teal.400' href={'/post/'+blog.id} fontWeight='bold'>
                查看全文
            </Box>
        </LinkBox>
    </>
}

export default BaseBlogCardStyle2