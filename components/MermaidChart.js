"use client";

import React, { useState, useEffect } from "react";

export default function MermaidChart({ chartCode }) {
    const [imageUrl, setImageUrl] = useState("");
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!chartCode) return;

        try {
            setHasError(false);
            // Clean up markdown block syntax
            let cleanCode = chartCode
                .replace(/```mermaid/g, "")
                .replace(/```/g, "")
                .trim();

            // Reliable UTF-8 safe Base64 encoder for browser environments
            const utf8Bytes = encodeURIComponent(cleanCode).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode(parseInt(p1, 16));
            });
            const base64 = btoa(utf8Bytes);

            // Request standard direct render from the official, high-performance mermaid.ink service
            setImageUrl(`https://mermaid.ink/img/${base64}`);
        } catch (error) {
            console.error("Failed to build diagram url:", error);
            setHasError(true);
        }
    }, [chartCode]);

    if (hasError) {
        return (
            <div className="w-full my-4 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-xs font-mono font-bold text-red-500 mb-2">Could not render diagram visually.</p>
                <pre className="text-[11px] font-mono text-slate-600 bg-white p-3 rounded-lg border border-slate-100 overflow-x-auto whitespace-pre">
                    {chartCode}
                </pre>
            </div>
        );
    }

    if (!imageUrl) {
        return (
            <div className="w-full my-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center animate-pulse">
                <span className="text-xs font-semibold text-slate-400">Loading visual diagram...</span>
            </div>
        );
    }

    return (
        <div className="w-full my-6 flex flex-col items-center justify-center clear-both block">
            <div className="w-full max-w-full overflow-x-auto bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-sm flex justify-center custom-scrollbar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt="Educational Flowchart Diagram"
                    className="max-w-full h-auto object-contain block select-none rounded"
                    loading="lazy"
                    onError={() => {
                        setHasError(true);
                    }}
                />
            </div>
            <span className="text-[10px] sm:hidden uppercase tracking-wider font-bold text-slate-400/80 mt-2 block">
                ↔️ Swipe horizontally to view full diagram
            </span>
        </div>
    );
}