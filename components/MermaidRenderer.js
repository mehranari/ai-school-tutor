"use client";
import React from "react";

export default function MermaidRenderer({ chartCode }) {
    // Clean the code and encode it for a URL
    const cleanCode = chartCode.replace(/```mermaid/gi, "").replace(/```/g, "").trim();
    const encodedCode = btoa(cleanCode); // Base64 encode for the API
    const imageUrl = `https://mermaid.ink/img/${encodedCode}`;

    return (
        <div className="flex justify-center my-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <img src={imageUrl} alt="Mermaid Diagram" className="max-w-full h-auto" />
        </div>
    );
}