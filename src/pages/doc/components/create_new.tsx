import React, { useState } from "react";

import { getAxiosHeader, host } from "../../../utils/request";
import MdEditor from "react-markdown-editor-lite";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { TreeFolders } from "dd_server_api_web/dist/model/ResourceTreeModel";
import CloseIcon from "@mui/icons-material/Close";
import { BlogPreviewLight } from "../../../components/blog_content_light";
import { onImageUpload } from "../../../utils/EditImageFileUpload";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import {UserWidget} from "../../../components/user_widget";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//创建一个新文章
const CreateNewDocArticle: React.FC<{
  currentFolder: TreeFolders | undefined;
}> = ({ currentFolder }) => {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [content, setContent] = useState("");
  const [show, setShow] = useState(false);
  ///提交
  const submit = async () => {
    const result = await axios.post(
      host + "/api/resource/add-post",
      {
        title: title,
        content: content,
        label: label,
        categoryId: currentFolder?.id,
      },
      getAxiosHeader()
    );

    console.log(result);
  };

  return (
    <Box>
      <UserWidget>
          <Button
              onClick={() => {
                  setShow(true);
              }}
          >
              新建一篇文稿 ({currentFolder?.title})
          </Button>

      </UserWidget>
      <Dialog
        open={show}
        onClose={() => setShow(false)}
        maxWidth={"lg"}
        fullScreen
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShow(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              添加文稿 - {currentFolder?.title}
            </Typography>
            <Button autoFocus color="inherit" onClick={submit}>
              发布
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            placeholder={"标题"}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin={"dense"}
          />
          <TextField
            placeholder={"标签"}
            onChange={(e) => setLabel(e.target.value)}
            fullWidth
            margin={"dense"}
          />
          <MdEditor
            style={{ height: "500px" }}
            value={content}
            renderHTML={(text) => <BlogPreviewLight content={text} />}
            onChange={(data) => {
              setContent(data.text);
            }}
            onImageUpload={onImageUpload}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CreateNewDocArticle;
