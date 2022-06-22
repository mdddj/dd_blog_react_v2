import React from "react";
import {Box, FormControl, FormHelperText, FormLabel, Input, Textarea, VStack} from "@chakra-ui/react";

///创建文档的表单
const CreateNewArticleForm: React.FC = () => {

    return <Box>
        <VStack spacing={4}>
            <FormControl>
                <FormLabel htmlFor='title'>标题</FormLabel>
                <Input id='title' type='text' />
                <FormHelperText>请输入文稿标题.</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor='title'>正文内容 (支持markdown语法)</FormLabel>
                <Textarea placeholder='在这里输入核心内容' rows={20} />
            </FormControl>
        </VStack>
    </Box>
}

export  default  CreateNewArticleForm