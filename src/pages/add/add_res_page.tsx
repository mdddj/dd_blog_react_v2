import {
  Box,
  Button,
  Textarea,
  Image,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";
import PageHeader from "../../components/page_header";
import React, { useEffect, useState } from "react";
import { fileOpen } from "browser-fs-access";

const AddResPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  /**
   * 选择本地图片
   */
  const selectImage = async () => {
    const blobs = await fileOpen({ mimeTypes: ["image/*"], multiple: true });
    console.log(blobs);
    setFiles(blobs);
  };

  return (
    <Box>
      <PageHeader title="发布动态" />
      <Box bg={"gray.200"} p={4}>
        <Textarea
          placeholder="说点什么吧"
          border={"none"}
          focusBorderColor={"gray.200"}
        />

        <Grid mt={4} templateColumns="repeat(10, 1fr)" gap={2}>
          {files.map((value, index) => (
            <BlobFileView key={index} blob={value} />
          ))}
        </Grid>
      </Box>
      <HStack mt={4}>
        <Button colorScheme={"blue"}>发布</Button>
        <Button onClick={selectImage}>添加图片</Button>
      </HStack>
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
      console.log(result);
      if (result) {
        setUrl(result as string);
      }
    };
    reader.readAsDataURL(blob);
  };

  return (
    <GridItem>
      {url && (
        <Image
          src={url}
          fit={"cover"}
          width={'80px'}
          height={'80px'}
          borderRadius={8}
        />
      )}
    </GridItem>
  );
};
export default AddResPage;
