import { Box, Button, Textarea } from "@chakra-ui/react"
import PageHeader from "../../components/page_header"
import React, {useState} from "react";
import {fileOpen} from "browser-fs-access";


const AddResPage: React.FC = () => {


    const [files, setFiles] = useState<File[]>([])

    /**
     * 选择本地文件上传
     */
    const selectImage = async () => {
        const blobs = await fileOpen({mimeTypes: ['image/*'], multiple: true});
        console.log(blobs)
        setFiles(blobs)
    }

    return <Box>
        <PageHeader title="发布动态"/>
        <Box>
            <Textarea placeholder="说点什么吧" />
        </Box>
        <Box mt={1}  display={'flex'} alignItems={'flex-end'}>
            <Button colorScheme={'blue'}>发布</Button>
            <Button onClick={selectImage}>添加图片</Button>
        </Box>

    </Box>
}
export default AddResPage