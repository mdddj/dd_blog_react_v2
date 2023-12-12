import ReactMarkdown from "react-markdown";
import React from "react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "github-markdown-css/github-markdown-light.css";
import { Code } from "@nextui-org/react";

/**
 * 博客预览组件
 * @param content 预览的内容 markdown 文本
 * @constructor
 */
export const BlogPreviewLight: React.FC<{ content: string }> = ({
  content,
}) => {
  return (
    <>
      <ReactMarkdown
        className={"markdown-body"}
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || "");

              return match ? (
                  // @ts-ignore
              <SyntaxHighlighter children={String(children).replace(/\n$/, "")}
                language={match[1]}
                PreTag="div"
                customStyle={{}}
                {...props}
              />

            ) : (
              <Code>{children}</Code>
            );
          },
          // a: ({ node, className, children, ...props }) => {
          //     const match =
          //         props.href &&
          //         props.href.indexOf('https://pub.dev/packages/') == 0;
          //     if (match) {
          //         return <FlutterLink href={props.href!} />;
          //     }
          //     return <Button >{children}</Button>;
          // },
        }}
      />
    </>
  );
};
