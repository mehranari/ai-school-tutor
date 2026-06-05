"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Trash2, BookOpen } from "lucide-react";
import MermaidRenderer from "./MermaidRenderer";

// Import KaTeX CSS — add this to your layout.js/globals.css if not already:
// import 'katex/dist/katex.min.css';

/**
 * Splits message text into alternating [text, mermaid, text, mermaid, ...] parts.
 * Returns array of { type: 'text' | 'mermaid', content: string }
 */
function splitMessageParts(message) {
    const parts = [];
    // Matches ```mermaid ... ``` blocks (including newlines inside)
    const regex = /(```mermaid[\s\S]*?```)/gi;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
        // Text before this mermaid block
        if (match.index > lastIndex) {
            const textBefore = message.slice(lastIndex, match.index);
            if (textBefore.trim()) {
                parts.push({ type: "text", content: textBefore });
            }
        }
        // The mermaid block itself
        parts.push({ type: "mermaid", content: match[0] });
        lastIndex = regex.lastIndex;
    }

    // Any remaining text after the last mermaid block
    if (lastIndex < message.length) {
        const remaining = message.slice(lastIndex);
        if (remaining.trim()) {
            parts.push({ type: "text", content: remaining });
        }
    }

    // If no mermaid blocks were found, return whole message as text
    if (parts.length === 0) {
        parts.push({ type: "text", content: message });
    }

    return parts;
}

export default function MessageBubble({ message, isAi, accent = "indigo", onClearChat, historyLessons = [] }) {
    const parts = splitMessageParts(message);

    return (
        <div className="w-full mb-6">
            {/* AI message header with history pills */}
            {isAi && (
                <div className="flex items-center justify-between gap-4 mb-3 border-b border-slate-100 pb-2">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {historyLessons.map((h, i) => (
                            <button
                                key={i}
                                className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs text-slate-600 whitespace-nowrap"
                            >
                                <BookOpen size={12} /> {h.title}
                            </button>
                        ))}
                    </div>
                    {onClearChat && (
                        <button
                            onClick={onClearChat}
                            className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 shrink-0"
                        >
                            <Trash2 size={12} /> Clear
                        </button>
                    )}
                </div>
            )}

            {/* Message bubble */}
            <div
                className={`p-4 rounded-2xl ${
                    isAi
                        ? "bg-white border border-slate-100 shadow-sm"
                        : `bg-${accent}-600 text-white`
                }`}
            >
                {parts.map((part, i) => {
                    if (part.type === "mermaid") {
                        return <MermaidRenderer key={i} chartCode={part.content} />;
                    }

                    // Render markdown with math support
                    return (
                        <ReactMarkdown
                            key={i}
                            className="prose prose-sm max-w-none text-sm"
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                // Prevent ReactMarkdown from trying to render mermaid
                                // code blocks itself — MermaidRenderer handles those above
                                code({ node, inline, className, children, ...props }) {
                                    const lang = (className || "").replace("language-", "");
                                    if (lang === "mermaid") {
                                        // Should never reach here due to pre-split, but safety net
                                        return (
                                            <MermaidRenderer
                                                chartCode={"```mermaid\n" + String(children) + "\n```"}
                                            />
                                        );
                                    }
                                    if (inline) {
                                        return (
                                            <code
                                                className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    }
                                    return (
                                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs my-3">
                                            <code className={`language-${lang}`} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    );
                                },
                            }}
                        >
                            {part.content}
                        </ReactMarkdown>
                    );
                })}
            </div>
        </div>
    );
}