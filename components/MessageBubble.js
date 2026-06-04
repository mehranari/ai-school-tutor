"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { GraduationCap, User, Lightbulb, Image as ImageIcon } from "lucide-react";
import MermaidChart from "./MermaidChart";

export default function MessageBubble({ message, isAi, accent = "indigo" }) {
    // ULTIMATE REGEX INTERCEPTION: Captures diagrams even if code ticks are missing or unlabeled
    const parseMessageContent = (text) => {
        if (!text || typeof text !== "string") return { cleanText: text, diagramCode: null };

        // Looks for any pattern containing graph/sequence definitions inside or outside backticks
        const mermaidRegex = /(?:```mermaid\s*|
            ```\s*)?(graph\s+(?:LR|TD|TB|RL|BT)[\s\S]+?)(?:```)?(?=\n\n |\n[A - Z] | $)/i;
        const match = text.match(mermaidRegex);

        if (match) {
            const diagramCode = match[1].trim();
            // Clean up text around the diagram so the code block doesn't render twice as text
            const cleanText = text.replace(match[0], "").replace(/```\s*```/g, "").trim();
            return { cleanText, diagramCode };
        }

        return { cleanText: text, diagramCode: null };
    };

    const { cleanText, diagramCode } = parseMessageContent(message);

    return (
        <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-4 md:mb-8 w-full overflow-hidden`}>
            <div className={`flex items-start gap-2 md:gap-4 w-full max-w-[98%] sm:max-w-[92%] md:max-w-[85%] ${isAi ? "flex-row" : "flex-row-reverse"}`}>

                {/* Profile Identity Icon */}
                <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md ${isAi ? "bg-slate-900 text-white" : `bg-${accent}-600 text-white`
                    }`}>
                    {isAi ? <GraduationCap size={18} className="sm:w-5 sm:h-5" /> : <User size={18} className="sm:w-5 sm:h-5" />}
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0 overflow-hidden">
                    <div
                        className={`rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-8 sm:py-7 relative border border-slate-100 shadow-sm overflow-hidden break-words ${isAi
                                ? "bg-white text-slate-800 rounded-tl-none"
                                : `bg-gradient-to-br from-${accent}-600 to-${accent}-700 text-white rounded-tr-none shadow-md`
                            }`}
                    >
                        <div className={`prose prose-sm sm:prose-base max-w-none math-content overflow-hidden ${isAi ? "text-slate-700" : "text-white prose-invert"
                            }`}>

                            {/* Render text without raw code definitions leaking out */}
                            {cleanText && (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        h1: ({ ...props }) => <h1 className={`text-xl sm:text-3xl font-black mb-4 sm:mb-8 mt-2 sm:mt-4 text-slate-900 border-l-4 border-${accent}-500 pl-4 sm:pl-6 break-words`} {...props} />,
                                        h2: ({ ...props }) => <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 mt-6 sm:mt-10 pb-2 border-b border-slate-100 text-slate-800 break-words" {...props} />,
                                        h3: ({ ...props }) => <h3 className={`text-base sm:text-xl font-bold mb-3 sm:mb-4 mt-4 sm:mt-8 text-${accent}-700 flex items-center gap-2 break-words`} {...props} />,
                                        p: ({ ...props }) => <p className="mb-4 leading-relaxed text-sm sm:text-base break-words whitespace-pre-line" {...props} />,
                                        table: ({ ...props }) => (
                                            <div className="overflow-x-auto my-4 sm:my-8 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm bg-slate-50/50 p-0.5 max-w-full">
                                                <table className="min-w-full divide-y divide-slate-200 bg-white rounded-lg overflow-hidden text-xs sm:text-sm" {...props} />
                                            </div>
                                        ),
                                        code: ({ inline, ...props }) => inline ? (
                                            <code className={`bg-${accent}-50 text-${accent}-600 px-1.5 py-0.5 rounded-md text-[11px] sm:text-xs font-bold font-mono break-all`} {...props} />
                                        ) : (
                                            <div className="bg-slate-900 text-slate-200 p-4 sm:p-8 rounded-xl sm:rounded-2xl my-4 sm:my-8 overflow-x-auto shadow-xl font-mono text-xs sm:text-sm leading-relaxed border border-slate-800 max-w-full">
                                                <code className="block whitespace-pre" {...props} />
                                            </div>
                                        ),
                                        ul: ({ ...props }) => <ul className="list-none space-y-3 sm:space-y-5 my-4 sm:my-8 pl-0 max-w-full" {...props} />,
                                        ol: ({ ...props }) => <ol className="list-decimal space-y-3 sm:space-y-5 my-4 sm:my-8 pl-5 max-w-full" {...props} />,
                                        li: ({ ...props }) => (
                                            <li className="flex items-start gap-2 sm:gap-4 group break-words text-sm sm:text-base">
                                                <div className={`mt-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-${accent}-400 shrink-0 group-hover:scale-125 transition-transform`} />
                                                <div className="flex-1 min-w-0" {...props} />
                                            </li>
                                        ),
                                        blockquote: ({ ...props }) => (
                                            <div className="my-6 sm:my-10 relative max-w-full">
                                                <div className={`absolute -top-2.5 left-4 sm:left-6 px-2 sm:px-3 py-0.5 sm:py-1 bg-${accent}-600 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1 z-10 shadow-md`}>
                                                    <Lightbulb size={10} /> Expert Insights
                                                </div>
                                                <blockquote className={`border border-${accent}-500/20 bg-${accent}-500/5 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] italic text-slate-700 font-medium text-xs sm:text-sm sm:leading-loose shadow-sm break-words`} {...props} />
                                            </div>
                                        ),
                                        a: ({ ...props }) => <a className={`text-${accent}-600 hover:text-${accent}-800 font-black underline underline-offset-4 decoration-2 decoration-${accent}-500/30 transition-all break-all`} target="_blank" rel="noopener noreferrer" {...props} />,
                                        img: ({ ...props }) => (
                                            <div className="my-6 sm:my-10 space-y-3 sm:space-y-4 max-w-full">
                                                <div className="relative group overflow-hidden rounded-xl sm:rounded-[2rem] border border-slate-100 shadow-md transition-all max-w-full">
                                                    <img className="w-full h-auto object-cover" {...props} alt={props.alt || "Educational Illustration"} />
                                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 sm:px-4 py-1 sm:py-2 bg-slate-900/80 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ImageIcon size={10} className={`text-${accent}-400`} /> Visual Reference
                                                    </div>
                                                </div>
                                                {props.alt && <p className="text-center text-[10px] sm:text-xs font-bold text-slate-400 italic px-4 sm:px-10 leading-relaxed uppercase tracking-wider break-words">&mdash; {props.alt} &mdash;</p>}
                                            </div>
                                        )
                                    }}
                                >
                                    {cleanText}
                                </ReactMarkdown>
                            )}

                            {/* Inject rendered visual diagram separately so it cannot fail or be cut off */}
                            {diagramCode && (
                                <div className="w-full select-none mt-4 clear-both">
                                    <MermaidChart chartCode={diagramCode} />
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}