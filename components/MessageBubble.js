"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { GraduationCap, User, Lightbulb, Trash2, History, BookOpen } from "lucide-react";
import MermaidChart from "./MermaidChart";

export default function MessageBubble({ message, isAi, accent = "indigo", onClearChat, historyLessons = [] }) {
    const [activeHistory, setActiveHistory] = useState(null);

    // Scans message string and splits it into organized blocks (Markdown text vs Visual diagrams)
    const parseContentBlocks = (text) => {
        if (!text || typeof text !== "string") return [];

        // Strict, accurate regex capture of Mermaid diagram syntax blocks
        const mermaidRegex = /(?:```mermaid\s*([\s\S]+?)```)/gi;

        const blocks = [];
        let lastIndex = 0;
        let match;

        mermaidRegex.lastIndex = 0;

        while ((match = mermaidRegex.exec(text)) !== null) {
            const precedingText = text.substring(lastIndex, match.index).trim();
            if (precedingText) {
                blocks.push({ type: "markdown", content: precedingText });
            }

            const diagramCode = match[1].trim();
            if (diagramCode) {
                blocks.push({ type: "diagram", content: diagramCode });
            }

            lastIndex = mermaidRegex.lastIndex;
        }

        const remainingText = text.substring(lastIndex).trim();
        if (remainingText) {
            blocks.push({ type: "markdown", content: remainingText });
        }

        return blocks.length > 0 ? blocks : [{ type: "markdown", content: text }];
    };

    const contentBlocks = parseContentBlocks(message);

    return (
        <div className="w-full block mb-6 sm:mb-8 clear-both font-sans antialiased text-slate-900 selection:bg-slate-200/60">

            {/* Top Interactive Row: Clean History Badges & Clear Button */}
            {isAi && (
                <div className="w-full flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 px-1">
                    {/* Horizontal Single Line Lesson History Container */}
                    <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap hidden-scrollbar">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                            <History size={13} />
                            <span>Lessons:</span>
                        </div>
                        {historyLessons.length === 0 ? (
                            <span className="text-xs italic text-slate-400">No previous sessions saved</span>
                        ) : (
                            historyLessons.map((lesson, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveHistory(lesson)}
                                    className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 active:bg-slate-200 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm transition-all duration-200 shrink-0"
                                >
                                    <BookOpen size={12} className="text-slate-400" />
                                    <span className="max-w-[140px] sm:max-w-[200px] truncate">{lesson.title || lesson.question}</span>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Beautiful Clear Chat / Erase Button */}
                    {onClearChat && (
                        <button
                            onClick={onClearChat}
                            className="shrink-0 inline-flex items-center gap-1.5 bg-rose-50/50 hover:bg-rose-100/80 active:bg-rose-200 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-200 shadow-sm transition-all duration-200 active:scale-95"
                            title="Clear conversation stream"
                        >
                            <Trash2 size={13} className="stroke-[2.5]" />
                            <span className="hidden xs:inline">Clear Chat</span>
                        </button>
                    )}
                </div>
            )}

            {/* Render Opened History Question Modal Inline if Tap Activated */}
            {activeHistory && (
                <div className="w-full block bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 mb-4 transition-all animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Archived Query Data</span>
                        <button onClick={() => setActiveHistory(null)} className="text-xs font-bold text-rose-500 hover:underline">Close View</button>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Q: {activeHistory.question}</p>
                    <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">A: {activeHistory.answer}</p>
                </div>
            )}

            {/* Main Message Bubble Structural Body */}
            <div className={`w-full flex items-start gap-2.5 sm:gap-4 ${isAi ? "flex-row" : "flex-row-reverse"}`}>

                {/* Visual Identity Avatar */}
                <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm transition-transform ${isAi ? "bg-slate-900 text-white" : `bg-${accent}-600 text-white`
                    }`}>
                    {isAi ? <GraduationCap size={18} className="sm:w-5 sm:h-5" /> : <User size={18} className="sm:w-5 sm:h-5" />}
                </div>

                {/* Bubble Display Block: Structured to bypass layout crushing on ultra-narrow mobile monitors */}
                <div className="min-w-0 flex-1 block">
                    <div
                        className={`w-full block rounded-2xl sm:rounded-3xl px-4 py-3.5 sm:px-6 sm:py-5 md:px-8 md:py-7 border border-slate-100 shadow-sm overflow-hidden break-words ${isAi
                                ? "bg-white text-slate-800 rounded-tl-none"
                                : `bg-gradient-to-br from-${accent}-600 to-${accent}-700 text-white rounded-tr-none shadow-md`
                            }`}
                    >
                        <div className={`prose prose-sm sm:prose-base max-w-none math-content block overflow-hidden w-full ${isAi ? "text-slate-700" : "text-white prose-invert"
                            }`}>

                            {contentBlocks.map((block, index) => {
                                if (block.type === "diagram") {
                                    return (
                                        <div key={index} className="w-full block clear-both my-4 overflow-x-auto rounded-xl p-2 bg-slate-50/50 border border-slate-100">
                                            <MermaidChart chartCode={block.content} />
                                        </div>
                                    );
                                }

                                return (
                                    <div key={index} className="w-full block">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                h1: ({ ...props }) => <h1 className="text-xl sm:text-2xl font-black mb-4 mt-2 text-slate-900 break-words block" {...props} />,
                                                h2: ({ ...props }) => <h2 className="text-lg sm:text-xl font-bold mb-3 mt-6 pb-1 border-b border-slate-100 text-slate-800 break-words block" {...props} />,
                                                h3: ({ ...props }) => <h3 className={`text-base sm:text-lg font-bold mb-3 mt-4 text-${accent}-700 break-words block`} {...props} />,
                                                p: ({ ...props }) => <p className="mb-4 leading-relaxed text-sm sm:text-base break-words whitespace-pre-line w-full block" {...props} />,
                                                table: ({ ...props }) => (
                                                    <div className="w-full overflow-x-auto my-4 rounded-xl border border-slate-200 bg-white p-0.5 max-w-full">
                                                        <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm" {...props} />
                                                    </div>
                                                ),
                                                code: ({ inline, ...props }) => inline ? (
                                                    <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-md text-xs font-mono break-all inline-block" {...props} />
                                                ) : (
                                                    <div className="bg-slate-900 text-slate-200 p-4 rounded-xl my-4 overflow-x-auto shadow-inner font-mono text-xs sm:text-sm max-w-full block">
                                                        <code className="block whitespace-pre" {...props} />
                                                    </div>
                                                ),
                                                ul: ({ ...props }) => <ul className="list-disc space-y-2 my-3 pl-6 max-w-full block" {...props} />,
                                                ol: ({ ...props }) => <ol className="list-decimal space-y-2 my-3 pl-6 max-w-full block" {...props} />,
                                                li: ({ ...props }) => <li className="break-words text-sm sm:text-base mb-1" {...props} />,
                                                blockquote: ({ ...props }) => (
                                                    <div className="my-6 relative max-w-full block">
                                                        <div className={`absolute -top-2.5 left-4 px-2 py-0.5 bg-${accent}-600 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-sm flex items-center gap-1`}>
                                                            <Lightbulb size={10} /> Insights
                                                        </div>
                                                        <blockquote className="border-l-4 border-slate-300 bg-slate-50/50 p-4 rounded-r-xl italic text-slate-600 text-xs sm:text-sm break-words" {...props} />
                                                    </div>
                                                ),
                                                a: ({ ...props }) => <a className={`text-${accent}-600 underline font-semibold break-all`} target="_blank" rel="noopener noreferrer" {...props} />,
                                                img: ({ ...props }) => (
                                                    <div className="my-4 max-w-full block">
                                                        <img className="max-w-full h-auto rounded-xl border border-slate-100 shadow-sm" {...props} alt={props.alt || "Illustration"} />
                                                    </div>
                                                )
                                            }}
                                        >
                                            {block.content}
                                        </ReactMarkdown>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}