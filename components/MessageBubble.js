"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MermaidRenderer from "./MermaidRenderer";

export default function MessageBubble({ message, isAi, onClearChat, historyLessons = [] }) {
    // This regex looks for the block and ignores everything else
    const renderContent = (text) => {
        const parts = text.split(/(```mermaid[\s\S]*?
            ```)/);
        return parts.map((part, i) => {
            if (part.startsWith("```mermaid")) {
                const code = part.replace(/
                ```mermaid/g, "").replace(/``` / g, "").trim();
        return <MermaidRenderer key={i} chartCode={code} />;
    }
    return <ReactMarkdown key={i} className="prose">{part}</ReactMarkdown>;
});
    };

return (
    <div className="w-full">
        {/* ... keep your history/button UI here ... */}
        <div className="message-content">
            {renderContent(message)}
        </div>
    </div>
);
}