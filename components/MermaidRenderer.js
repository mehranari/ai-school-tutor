"use client";
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidRenderer({ chartCode }) {
    const containerRef = useRef(null);

    useEffect(() => {
        // We add a 500ms delay to let extensions like Grammarly 
        // finish their "spamming" in the console first.
        const timer = setTimeout(async () => {
            const clean = chartCode.replace(/```mermaid/gi, "").replace(/```/g, "").trim();
            if (containerRef.current && clean) {
                try {
                    mermaid.initialize({ startOnLoad: true, theme: 'default' });
                    const { svg } = await mermaid.render(`diag-${Date.now()}`, clean);
                    containerRef.current.innerHTML = svg;
                } catch (err) {
                    console.error("Mermaid Render Error:", err);
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [chartCode]);

    return <div ref={containerRef} className="mermaid-container" />;
}