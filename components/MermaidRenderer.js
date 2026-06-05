"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });

export default function MermaidRenderer({ chartCode }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (containerRef.current) {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chartCode);
                    containerRef.current.innerHTML = svg;
                } catch (err) {
                    console.error("Mermaid render failed:", err);
                }
            }
        };
        renderDiagram();
    }, [chartCode]);

    return <div ref={containerRef} className="w-full flex justify-center my-4 overflow-x-auto" />;
}