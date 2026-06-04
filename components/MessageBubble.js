"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { GraduationCap, User, Sparkles, Info, Lightbulb, Image as ImageIcon } from "lucide-react";
import MermaidChart from "./MermaidChart";

export default function MessageBubble({ message, isAi, accent = "indigo" }) {
    return (
        <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-8 slide-up`}>
            <div className={`flex items-start gap-4 max-w-[95%] md:max-w-[85%] ${isAi ? "flex-row" : "flex-row-reverse"}`}>
                {/* Visual Identity */}
                <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-110 ${isAi ? "bg-slate-900 text-white" : `bg-${accent}-600 text-white`
                    }`}>
                    {isAi ? <GraduationCap size={20} /> : <User size={20} />}
                </div>

                {/* Content Container */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div
                        className={`rounded-3xl px-8 py-7 relative overflow-hidden border border-slate-100 ${isAi
                            ? "bg-white text-slate-800 rounded-tl-none shadow-sm"
                            : `bg-gradient-to-br from-${accent}-600 to-${accent}-700 text-white rounded-tr-none shadow-xl`
                            }`}
                    >
                        <div className={`prose prose-sm md:prose-base max-w-none ${isAi ? "text-slate-700" : "text-white prose-invert"} math-content`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className={`text-3xl font-black mb-8 mt-4 text-slate-900 border-l-4 border-${accent}-500 pl-6`} {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-6 mt-10 pb-3 border-b border-slate-100 text-slate-800" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className={`text-xl font-bold mb-4 mt-8 text-${accent}-700 flex items-center gap-2`} {...props} />,
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-8 rounded-2xl border border-slate-200 shadow-sm bg-slate-50/50 p-1">
                                            <table className="min-w-full divide-y divide-slate-200 bg-white rounded-xl overflow-hidden" {...props} />
                                        </div>
                                    ),
                                    code: ({ node, inline, className, children, ...props }) => {
                                        const codeString = String(children).trim();
                                        const isMermaid = /language-mermaid/.test(className || "") ||
                                            codeString.startsWith("graph ") ||
                                            codeString.startsWith("sequenceDiagram");

                                        if (!inline && isMermaid) {
                                            return <MermaidChart chartCode={codeString} />;
                                        }

                                        return inline
                                            ? <code className={`bg-${accent}-50 text-${accent}-600 px-2 py-0.5 rounded-lg text-xs font-bold font-mono`} {...props}>{children}</code>
                                            : <div className="bg-slate-900 text-slate-200 p-8 rounded-2xl my-8 overflow-x-auto shadow-2xl font-mono text-sm leading-relaxed border border-slate-800"><code {...props}>{children}</code></div>
                                    },
                                    ul: ({ node, ...props }) => <ul className="list-none space-y-5 my-8" {...props} />,
                                    li: ({ node, ...props }) => (
                                        <li className="flex items-start gap-4 group">
                                            <div className={`mt-2.5 w-2 h-2 rounded-full bg-${accent}-400 shrink-0 group-hover:scale-125 transition-transform`} />
                                            <div className="flex-1" {...props} />
                                        </li>
                                    ),
                                    blockquote: ({ node, ...props }) => (
                                        <div className="my-10 relative">
                                            <div className={`absolute -top-3 left-6 px-3 py-1 bg-${accent}-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 z-10 shadow-lg`}>
                                                <Lightbulb size={12} /> Expert Insights
                                            </div>
                                            <blockquote className={`border border-${accent}-500/20 bg-${accent}-500/5 p-8 rounded-[2rem] italic text-slate-700 font-medium leading-loose shadow-sm`} {...props} />
                                        </div>
                                    ),
                                    a: ({ node, ...props }) => (
                                        <a
                                            className={`text-${accent}-600 hover:text-${accent}-800 font-black underline underline-offset-4 decoration-2 decoration-${accent}-500/30 transition-all`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    img: ({ node, ...props }) => (
                                        <div className="my-10 space-y-4">
                                            <div className={`relative group overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl transition-all hover:shadow-2xl hover:border-${accent}-500/20`}>
                                                <img
                                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                                    {...props}
                                                    alt={props.alt || "Educational Illustration"}
                                                />
                                                <div className="absolute top-4 left-4 px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ImageIcon size={12} className={`text-${accent}-400`} />
                                                    Visual Reference
                                                </div>
                                            </div>
                                            {props.alt && (
                                                <p className="text-center text-xs font-bold text-slate-400 italic px-10 leading-relaxed uppercase tracking-wider">
                                                    &mdash; {props.alt} &mdash;
                                                </p>
                                            )}
                                        </div>
                                    )
                                }}
                            >
                                {message}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}