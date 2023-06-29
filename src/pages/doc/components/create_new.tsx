import React, {useState} from "react";

import {blogApi} from "../../../utils/request";
import {useSetRecoilState} from "recoil";
import {successMessageProvider} from "../../../providers/modal/success_modal";
import {Box, Button, Drawer, Stack, TextField, Typography} from "@mui/material";
import { TreeFolders } from "dd_server_api_web/dist/model/ResourceTreeModel";
import { successResultHandle } from "dd_server_api_web/dist/utils/ResultUtil";

//创建一个新文章
const CreateNewDocArticle: React.FC<{currentFolder: TreeFolders|undefined}> = ({currentFolder}) => {



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
      },message => {
          msg(message)
      })

    }


    return <Box>
        <Button onClick={()=>{}}>
            新建一篇文稿
        </Button>

        <Drawer open={false} >
            <Typography>创建文稿</Typography>
            <Stack spacing={4}>
                <TextField placeholder={'标题'} onChange={(e)=>setTitle(e.target.value)} />
                <TextField placeholder={'标签'} onChange={(e)=>setLabel(e.target.value)} />
                <TextField multiline={true} placeholder='在这里输入核心内容' rows={15} value={content} onChange={(e)=>setContent(e.target.value)} />
            </Stack>

            <Button onClick={submit}>提交</Button>
        </Drawer>
    </Box>
}

export default CreateNewDocArticle