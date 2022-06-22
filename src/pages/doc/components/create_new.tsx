import React from "react";
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent, DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    useBoolean
} from "@chakra-ui/react";
import CreateNewArticleForm from "./form";

//创建一个新文章
const CreateNewDocArticle: React.FC = () => {


    const [flog,setFlog] = useBoolean()

    return <Box>
        <Button onClick={setFlog.on} colorScheme={'blue'}>
            新建一篇文稿
        </Button>

        <Drawer isOpen={flog} onClose={setFlog.off} placement={'right'} size={'lg'}>
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerHeader>创建文稿</DrawerHeader>
                <DrawerBody>
                    <CreateNewArticleForm/>
                </DrawerBody>
                <DrawerFooter>
                    <Button>提交</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </Box>
}

export default CreateNewDocArticle