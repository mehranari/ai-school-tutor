"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Trash2, BookOpen, ChevronDown, ChevronUp, Copy, Check, Lightbulb, ListChecks, ArrowRight } from "lucide-react";
import MermaidRenderer from "./MermaidRenderer";

// ─── Split message into text / mermaid / image parts ───────────────────────
function splitMessageParts(message) {
    const parts = [];
    const regex = /(```mermaid[\s\S]*?```)/gi;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
        if (match.index > lastIndex) {
            const text = message.slice(lastIndex, match.index);
            if (text.trim()) parts.push({ type: "text", content: text });
        }
        parts.push({ type: "mermaid", content: match[0] });
        lastIndex = regex.lastIndex;
    }

    const remaining = message.slice(lastIndex);
    if (remaining.trim()) parts.push({ type: "text", content: remaining });
    if (parts.length === 0) parts.push({ type: "text", content: message });

    return parts;
}

// ─── Extract quick summary bullets from the AI response ────────────────────
function extractSummaryLines(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    // Pick lines that look like key points (bold, bullet, or short sentences)
    const bullets = lines
        .filter(l => l.startsWith("- ") || l.startsWith("* ") || l.startsWith("•") || /^\d+\./.test(l))
        .slice(0, 4)
        .map(l => l.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "").replace(/\*\*/g, ""));
    return bullets;
}

// ─── Copy to clipboard button ───────────────────────────────────────────────
function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
        >
            {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
}

// ─── Collapsible section wrapper ────────────────────────────────────────────
function CollapsibleSection({ title, icon, defaultOpen = true, children, accent = "indigo" }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="mb-3 rounded-xl border border-slate-100 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {icon} {title}
                </span>
                {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </button>
            {open && <div className="p-4 bg-white">{children}</div>}
        </div>
    );
}

// ─── Image renderer with fallback ───────────────────────────────────────────
function AiImage({ src, alt }) {
    const [failed, setFailed] = useState(false);
    if (failed) return null;
    return (
        <div className="my-4 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
            <img
                src={src}
                alt={alt || "Educational diagram"}
                className="w-full h-auto max-h-72 object-contain bg-white"
                onError={() => setFailed(true)}
                loading="lazy"
            />
            {alt && (
                <p className="text-[10px] text-center text-slate-400 py-2 bg-slate-50 font-medium">
                    {alt}
                </p>
            )}
        </div>
    );
}

// ─── Main MessageBubble component ───────────────────────────────────────────
export default function MessageBubble({ message, isAi, accent = "indigo", onClearChat, historyLessons = [] }) {
    const [showFullResponse, setShowFullResponse] = useState(false);
    const parts = splitMessageParts(message);
    const summaryLines = isAi ? extractSummaryLines(message) : [];
    const isLong = message.length > 800;

    // ── User message bubble ──────────────────────────────────────────────────
    if (!isAi) {
        return (
            <div className="w-full mb-4 flex justify-end">
                <div className="max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl rounded-br-sm bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                    <p className="text-sm leading-relaxed font-medium">{message}</p>
                </div>
            </div>
        );
    }

    // ── AI message bubble ────────────────────────────────────────────────────
    return (
        <div className="w-full mb-6">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center">
                        <BookOpen size={12} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Tutor</span>
                </div>
                <div className="flex items-center gap-1">
                    <CopyButton text={message} />
                    {onClearChat && (
                        <button
                            onClick={onClearChat}
                            className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                            <Trash2 size={11} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* History pills */}
            {historyLessons.length > 0 && (
                <div className="flex gap-2 overflow-x-auto mb-3 pb-1 no-scrollbar">
                    {historyLessons.map((h, i) => (
                        <button key={i} className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-[10px] text-slate-600 whitespace-nowrap hover:bg-slate-100 transition-colors">
                            <BookOpen size={10} /> {h.title}
                        </button>
                    ))}
                </div>
            )}

            {/* Quick Summary Card — shown for longer responses */}
            {summaryLines.length > 0 && isLong && (
                <div className={`mb-3 p-4 rounded-xl bg-${accent}-50 border border-${accent}-100`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={13} className={`text-${accent}-500`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-${accent}-600`}>Quick Summary</span>
                    </div>
                    <ul className="space-y-1">
                        {summaryLines.map((line, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <ArrowRight size={11} className={`text-${accent}-400 mt-0.5 shrink-0`} />
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Main response bubble */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className={`px-5 py-5 ${isLong && !showFullResponse ? "max-h-[500px] overflow-hidden relative" : ""}`}>
                    {parts.map((part, i) => {
                        if (part.type === "mermaid") {
                            return <MermaidRenderer key={i} chartCode={part.content} />;
                        }
                        return (
                            <ReactMarkdown
                                key={i}
                                className="prose prose-sm max-w-none text-slate-700"
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    // Headings — styled attractively
                                    h1: ({ children }) => (
                                        <h1 className="text-xl font-black text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-100 font-outfit">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-base font-black text-slate-800 mt-5 mb-2 font-outfit flex items-center gap-2">
                                            <span className={`w-1 h-4 bg-${accent}-500 rounded-full inline-block`}></span>
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-sm font-bold text-slate-700 mt-4 mb-2 font-outfit">
                                            {children}
                                        </h3>
                                    ),
                                    // Paragraphs — better spacing
                                    p: ({ children }) => (
                                        <p className="text-sm leading-7 text-slate-700 mb-3">{children}</p>
                                    ),
                                    // Lists — clean and scannable
                                    ul: ({ children }) => (
                                        <ul className="space-y-1.5 mb-3 ml-1">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="space-y-1.5 mb-3 ml-4 list-decimal">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="flex items-start gap-2 text-sm text-slate-700">
                                            <span className={`w-1.5 h-1.5 rounded-full bg-${accent}-400 mt-2 shrink-0`}></span>
                                            <span>{children}</span>
                                        </li>
                                    ),
                                    // Tables — styled
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto my-4 rounded-xl border border-slate-100">
                                            <table className="w-full text-xs">{children}</table>
                                        </div>
                                    ),
                                    thead: ({ children }) => (
                                        <thead className="bg-slate-50 border-b border-slate-100">{children}</thead>
                                    ),
                                    th: ({ children }) => (
                                        <th className="px-4 py-2 text-left font-black text-slate-600 uppercase tracking-wider text-[10px]">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="px-4 py-2.5 text-slate-700 border-b border-slate-50">{children}</td>
                                    ),
                                    // Blockquote — highlight box
                                    blockquote: ({ children }) => (
                                        <div className={`my-3 pl-4 py-3 pr-3 rounded-r-xl border-l-4 border-${accent}-400 bg-${accent}-50/50`}>
                                            <div className="text-sm text-slate-700 italic">{children}</div>
                                        </div>
                                    ),
                                    // Strong — accent color
                                    strong: ({ children }) => (
                                        <strong className="font-bold text-slate-900">{children}</strong>
                                    ),
                                    // Images — use AiImage with fallback
                                    img: ({ src, alt }) => <AiImage src={src} alt={alt} />,
                                    // Code blocks
                                    code({ node, inline, className, children, ...props }) {
                                        const lang = (className || "").replace("language-", "");
                                        if (lang === "mermaid") {
                                            return <MermaidRenderer chartCode={"```mermaid\n" + String(children) + "\n```"} />;
                                        }
                                        if (inline) {
                                            return (
                                                <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                        return (
                                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs my-3">
                                                <code className={`language-${lang}`} {...props}>{children}</code>
                                            </pre>
                                        );
                                    },
                                }}
                            >
                                {part.content}
                            </ReactMarkdown>
                        );
                    })}

                    {/* Fade mask for long responses */}
                    {isLong && !showFullResponse && (
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                    )}
                </div>

                {/* Show more / less toggle */}
                {isLong && (
                    <div className="border-t border-slate-50 px-5 py-3 flex justify-center">
                        <button
                            onClick={() => setShowFullResponse(!showFullResponse)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            {showFullResponse ? (
                                <><ChevronUp size={13} /> Show Less</>
                            ) : (
                                <><ChevronDown size={13} /> Show Full Response</>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Next Steps action card — shown for detailed responses */}
            {isLong && showFullResponse && (
                <div className="mt-3 p-4 rounded-xl bg-slate-900 text-white">
                    <div className="flex items-center gap-2 mb-3">
                        <ListChecks size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next Steps</span>
                    </div>
                    <div className="space-y-2">
                        {["Review the key concepts above", "Try solving a related practice problem", "Ask a follow-up question if anything is unclear"].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0">
                                    {i + 1}
                                </span>
                                <span className="text-xs text-slate-300">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}