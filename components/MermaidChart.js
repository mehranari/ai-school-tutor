"use client";
import React, { useState, useEffect } from "react";

export default function MermaidChart({ chartCode }) {
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (!chartCode) return;
        // Strip markdown fences if present
        const cleanCode = chartCode.replace(/```mermaid/gi, "").replace(/```/g, "").trim();
        // Encode for URL safety
        const base64 = btoa(unescape(encodeURIComponent(cleanCode)));
        setImageUrl(`https://mermaid.ink/img/${base64}`);
    }, [chartCode]);

    return (
        <div className="w-full flex justify-center my-4 overflow-hidden">
            <img src={imageUrl} alt="Diagram" className="max-w-full h-auto rounded-xl border border-slate-100 shadow-sm" />
        </div>
    );
}