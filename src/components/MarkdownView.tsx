import React from "react";
import {BlogPreviewLight} from "./blog_content_light";

const MarkdownView: React.FC<{content: string}> = ({content}) => {
  return <>
      {
           <BlogPreviewLight content={content}/>
      }
  </>
}
export default MarkdownView