import React from "react";
import {useColorMode} from "@chakra-ui/react";
import {BlogPreviewDark} from "./blog_content_dark";
import {BlogPreviewLight} from "./blog_content_light";

const MarkdownView: React.FC<{content: string}> = ({content}) => {
    const model = useColorMode()
    const isDark = model.colorMode !== 'light'
  return <>
      {
          isDark ? <BlogPreviewDark content={content}/> : <BlogPreviewLight content={content}/>
      }
  </>
}
export default MarkdownView