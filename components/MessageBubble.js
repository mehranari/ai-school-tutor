"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Trash2, BookOpen } from "lucide-react";
import MermaidRenderer from "./MermaidRenderer";

export default function MessageBubble({ message, isAi, onClearChat, historyLessons = [] }) {
    // This refined regex splits the message at the mermaid code block
    const parts = message.split(/(```mermaid[\s\S]*?```)/gi);

    return (
        <div className="w-full mb-6">
            {isAi && (
                <div className="flex items-center justify-between gap-4 mb-3 border-b border-slate-100 pb-2">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {historyLessons.map((h, i) => (
                            <button key={i} className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs text-slate-600 whitespace-nowrap">
                                <BookOpen size={12} /> {h.title}
                            </button>
                        ))}
                    </div>
                    {onClearChat && (
                        <button onClick={onClearChat} className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 shrink-0">
                            <Trash2 size={12} /> Clear
                        </button>
                    )}
                </div>
            )}
            <div className={`p-4 rounded-2xl ${isAi ? "bg-white border" : "bg-indigo-600 text-white"}`}>
                {parts.map((part, i) => {
                    // Check if this part contains the mermaid block
                    if (part.toLowerCase().startsWith("```mermaid")) {
                        return <MermaidRenderer key={i} chartCode={part} />;
                    }
                    // Otherwise render as markdown
                    return <ReactMarkdown key={i} className="prose text-sm">{part}</ReactMarkdown>;
                })}
            </div>
        </div>
    );
}