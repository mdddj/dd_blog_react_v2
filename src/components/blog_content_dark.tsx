import ReactMarkdown from 'react-markdown';
import React from 'react';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css/github-markdown-dark.css'
import {useColorMode} from "@chakra-ui/react";

/**
 * 博客预览组件 (暗夜模式)
 * @param content 预览的内容 markdown 文本
 * @constructor
 */
export const BlogPreviewDark: React.FC<{ content: string; }> = ({content}) => {
    const model = useColorMode()
    return (
        <>
            <ReactMarkdown
                className={model.colorMode === 'dark' ? 'markdown-body' : ''}
                children={content}
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            // @ts-ignore
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={a11yDark}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        fontSize: 15,
                                        fontFamily: 'Fira Code',
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
                        border: 'none',
                        fontSize: 15,
                        fontFamily: 'Fira Code',
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
