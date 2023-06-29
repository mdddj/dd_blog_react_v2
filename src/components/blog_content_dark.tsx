import ReactMarkdown from 'react-markdown';
import React from 'react';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

/**
 * 博客预览组件 (暗夜模式)
 * @param content 预览的内容 markdown 文本
 * @constructor
 */
export const BlogPreviewDark: React.FC<{ content: string; }> = ({content}) => {
    return (
        <>
            <ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        // @ts-ignore
                        return !inline && match ? (
                            // @ts-ignore
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        fontSize: 15,
                                        fontFamily: 'Fira Code',
                                        lineHeight: 1.5,
                                        margin: 0,
                                    }}
                                    showLineNumbers={true}
                                    showInlineLineNumbers={true}
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
                }}
            />
        </>
    );
};
