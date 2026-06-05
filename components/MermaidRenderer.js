"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

// Initialize Mermaid once
mermaid.initialize({ startOnLoad: true, theme: 'default' });

export default function MermaidRenderer({ chartCode }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Clear previous content
            containerRef.current.innerHTML = "";
            // Render the diagram
            mermaid.render(`mermaid-${Date.now()}`, chartCode).then((result) => {
                containerRef.current.innerHTML = result.svg;
            }).catch(err => console.error("Mermaid failed:", err));
        }
    }, [chartCode]);

    return <div ref={containerRef} className="flex justify-center my-4 overflow-x-auto" />;
}