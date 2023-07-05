
import PageHeader from "../../components/page_header";
import React, { useEffect, useState } from "react";
import { fileOpen } from "browser-fs-access";
import {Box, Button, Grid, Stack, TextField} from "@mui/material";

const AddResPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  /**
   * 选择本地图片
   */
  const selectImage = async () => {
    const blobs = await fileOpen({ mimeTypes: ["image/*"], multiple: true });
    setFiles(blobs);
  };

  return (
    <Box>
      <PageHeader title="发布动态" />
      <Box>
        <TextField
            multiline={true}
          placeholder="说点什么吧"
        />

        <Grid>
          {files.map((value, index) => (
            <BlobFileView key={index} blob={value} />
          ))}
        </Grid>
      </Box>
      <Stack>
        <Button>发布</Button>
        <Button onClick={selectImage}>添加图片</Button>
      </Stack>
    </Box>
  );
};

/**
 * 图片预览小部件
 * @param blob Blob对象
 * @constructor
 */
const BlobFileView: React.FC<{ blob: Blob }> = ({ blob }) => {
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    parseImageBlog(blob);
  }, [blob]);

  /**
   * 将图片选择转成可以预览的图片数据
   */
  const parseImageBlog = (blob: Blob) => {
    let reader = new FileReader();
    reader.onload = () => {
      let result = reader.result;
      if (result) {
        setUrl(result as string);
      }
    };
    reader.readAsDataURL(blob);
  };

  return (
    <Box>
      {url && (
        <img
          src={url}
          width={'80px'}
          height={'80px'}
         alt={''}/>
      )}
    </Box>
  );
};
export default AddResPage;
