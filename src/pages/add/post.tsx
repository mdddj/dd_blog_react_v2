import React, {useState} from "react";
import {Button, Heading, Input, Select, Stack, useDisclosure} from "@chakra-ui/react";
import MyBox from "../../components/box/my_box";
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import {BlogPreviewLight} from "../../components/blog_content_light";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../../providers/archives";
import AddPostTagModal from "./add_post_tag_modal";

// 发布博客页面
const AddPostPage: React.FC = () => {


  let archives = useRecoilValue(archivesDataState);
  const [content,setContent] = useState<string>('')
  const [tags,setTags] = useState<string[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()


  return <MyBox>

    <Stack direction={'column'} spacing={5}>
      <Heading as={'h4'} size={'md'}>发布博客</Heading>
      <Input placeholder={'输入标题'} />
      <MdEditor style={{ height: '500px' }} value={content} renderHTML={text => <BlogPreviewLight content={text}/>} onChange={data => {
        setContent(data.text)
      }} />
      {
        archives &&  <Stack direction={'column'} spacing={2}>
            <Heading as={'h5'} size={'sm'}>文章分类</Heading>
            <Select placeholder='文章分类'>
              {
                archives.categoryList.map(value =>  <option value={value.id} key={value.id}>{value.name}</option>)
              }
            </Select>

            <Heading as={'h5'} size={'sm'}>添加标签 <span style={{color: 'grey',fontSize: 12}}>已选择{tags.length}个</span></Heading>
            <Button onClick={()=>onOpen()}>选择</Button>

          </Stack>
      }
    </Stack>

    {/*选择标签的弹窗*/}
    <AddPostTagModal show={isOpen} onClose={onClose}  onOk={values => {
      setTags(values)
    }} initVal={tags} />

  </MyBox>
}
export default AddPostPage