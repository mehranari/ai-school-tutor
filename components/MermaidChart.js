"use client";

import React, { useState, useEffect } from "react";

export default function MermaidChart({ chartCode }) {
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (!chartCode) return;

        try {
            // 1. Clean the incoming AI text layout
            let cleanCode = chartCode
                .replace(/```mermaid/g, "")
                .replace(/```/g, "")
                .trim();

            // 2. Encode code structure securely to match the official Mermaid server spec
            const jsonState = JSON.stringify({ code: cleanCode, mime: "image/png" });
            const encodedState = btoa(unescape(encodeURIComponent(jsonState)));

            // 3. Generate stable visual engine destination path
            setImageUrl(`https://mermaid.ink/img/${encodedState}`);
        } catch (error) {
            console.error("Error creating diagram engine state:", error);
        }
    }, [chartCode]);

    if (!imageUrl) {
        return (
            <div className="w-full text-center p-4 bg-slate-50 rounded-xl text-xs font-mono animate-pulse text-slate-400">
                Generating visual flow diagram...
            </div>
        );
    }

    return (
        <div className="w-full my-4 flex flex-col items-center justify-center clear-both">
            <div className="w-full max-w-full overflow-hidden bg-white border border-slate-100 rounded-2xl p-2 sm:p-4 shadow-sm hover:shadow-md transition-shadow flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt="AI Rendered Educational Flowchart Diagram"
                    className="max-w-full h-auto object-contain block select-none"
                    loading="lazy"
                    onError={(e) => {
                        // Fallback display mechanism if diagram formatting syntax contains errors
                        e.target.style.display = 'none';
                    }}
                />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1 block sm:hidden">
                ↔️ Swipe horizontally to view full diagram
            </span>
        </div>
    );
}