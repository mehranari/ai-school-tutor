"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// ✅ CRITICAL FIX: Initialize ONCE outside the component — never inside useEffect
mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    fontFamily: "Inter, sans-serif",
    flowchart: { useMaxWidth: true, htmlLabels: true },
});

let diagramCounter = 0;

export default function MermaidRenderer({ chartCode }) {
    const containerRef = useRef(null);
    const [error, setError] = useState(null);
    const [isRendering, setIsRendering] = useState(true);

    useEffect(() => {
        setError(null);
        setIsRendering(true);

        const clean = chartCode
            .replace(/```mermaid/gi, "")
            .replace(/```/g, "")
            .trim();

        if (!clean || !containerRef.current) {
            setIsRendering(false);
            return;
        }

        const id = `mermaid-diagram-${++diagramCounter}`;

        const renderDiagram = async () => {
            try {
                const { svg } = await mermaid.render(id, clean);
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                    const svgEl = containerRef.current.querySelector("svg");
                    if (svgEl) {
                        svgEl.style.maxWidth = "100%";
                        svgEl.style.height = "auto";
                        svgEl.removeAttribute("height");
                    }
                }
            } catch (err) {
                console.error("Mermaid Render Error:", err);
                setError("Diagram could not be rendered.");
            } finally {
                setIsRendering(false);
            }
        };

        const timer = setTimeout(renderDiagram, 200);
        return () => clearTimeout(timer);
    }, [chartCode]);

    if (error) {
        return (
            <div className="my-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs">
                <strong>⚠️ Diagram Error:</strong> {error}
                <details className="mt-1">
                    <summary className="cursor-pointer font-semibold text-[10px] uppercase">Show raw code</summary>
                    <pre className="mt-1 whitespace-pre-wrap break-all text-[10px]">{chartCode}</pre>
                </details>
            </div>
        );
    }

    if (isRendering) {
        return (
            <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                Rendering diagram...
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="mermaid-container my-4 p-4 bg-white rounded-xl border border-slate-100 overflow-x-auto flex justify-center"
        />
    );
}