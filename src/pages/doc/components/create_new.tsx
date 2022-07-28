import React, {useState} from "react";
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent, DrawerFooter,
    DrawerHeader,
    DrawerOverlay, FormControl, FormHelperText, FormLabel, Input, Textarea,
    useBoolean, VStack
} from "@chakra-ui/react";
import {TreeFolders} from "dd_server_api_web/apis/model/ResourceTreeModel";
import {blogApi} from "../../../utils/request";
import {successResultHandle} from "dd_server_api_web/src/utils/ResultUtil";
import {useSetRecoilState} from "recoil";
import {successMessageProvider} from "../../../providers/modal/success_modal";

//创建一个新文章
const CreateNewDocArticle: React.FC<{currentFolder: TreeFolders|undefined}> = ({currentFolder}) => {


    const [flog,setFlog] = useBoolean()

    const [title,setTitle] = useState("")
    const [label,setLabel] = useState("")
    const [content,setContent] = useState("")
    const msg = useSetRecoilState(successMessageProvider)


    ///提交
    const submit = async () => {


      const  result = await blogApi().publishPost({
            "title": title,
            "content": content,
            "label": label,
            "categoryId": currentFolder?.id
        });

      successResultHandle(result,_ => {
          msg(result.message)
          setFlog.off()
      },message => {
          msg(message)
      })

    }


    return <Box>
        <Button onClick={setFlog.on} colorScheme={'blue'}>
            新建一篇文稿
        </Button>

        <Drawer isOpen={flog} onClose={setFlog.off} placement={'right'} size={'lg'}>
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerHeader>创建文稿</DrawerHeader>
                <DrawerBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel htmlFor='title'>标题</FormLabel>
                            <Input id='title' type='text' value={title} onChange={(e)=>setTitle(e.target.value)} />
                            <FormHelperText>请输入文稿标题.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='label'>标签</FormLabel>
                            <Input id='label' type='text' value={label} onChange={(e)=>setLabel(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='title'>正文内容</FormLabel>
                            <Textarea placeholder='在这里输入核心内容' rows={15} value={content} onChange={(e)=>setContent(e.target.value)} />
                        </FormControl>
                    </VStack>
                </DrawerBody>
                <DrawerFooter>
                    <Button onClick={submit}>提交</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </Box>
}

export default CreateNewDocArticle