import ReactMarkdown from "react-markdown";
import React from "react";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import "github-markdown-css/github-markdown-light.css";

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
                    code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                            // @ts-ignore
                            <SyntaxHighlighter
                                children={String(children).replace(/\n$/, "")}
                                // style={vs}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    fontSize: 15,
                                    fontFamily: "Fira Code",
                                    lineHeight: 1.5,
                                    margin: 0,
                                }}
                                {...props}
                            />
                        ) : (
                            <code>
                <span
                    className={className}
                    style={{
                        border: "none",
                        fontSize: 15,
                        fontFamily: "Fira Code",
                        lineHeight: 1.5,
                        margin: 0,
                        padding: 6,
                    }}
                >
                  {children}
                </span>
                            </code>
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
