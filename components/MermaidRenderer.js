"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid ONCE globally, outside the component.
// This is the most important fix — never call initialize() inside useEffect.
mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    fontFamily: "inherit",
});

let diagramCounter = 0; // Safe incrementing ID — avoids Date.now() collisions

export default function MermaidRenderer({ chartCode }) {
    const containerRef = useRef(null);
    const [error, setError] = useState(null);
    const [isRendering, setIsRendering] = useState(true);

    useEffect(() => {
        // Reset state on new chartCode
        setError(null);
        setIsRendering(true);

        // Strip markdown fences cleanly
        const clean = chartCode
            .replace(/```mermaid/gi, "")
            .replace(/```/g, "")
            .trim();

        if (!clean || !containerRef.current) {
            setIsRendering(false);
            return;
        }

        // Unique, safe element ID — no special characters
        const id = `mermaid-diagram-${++diagramCounter}`;

        const renderDiagram = async () => {
            try {
                const { svg } = await mermaid.render(id, clean);
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;

                    // Make SVG responsive
                    const svgEl = containerRef.current.querySelector("svg");
                    if (svgEl) {
                        svgEl.style.maxWidth = "100%";
                        svgEl.style.height = "auto";
                        svgEl.removeAttribute("height"); // lets it scale naturally
                    }
                }
            } catch (err) {
                console.error("Mermaid Render Error:", err);
                setError("Could not render this diagram. The AI may have produced invalid diagram code.");
            } finally {
                setIsRendering(false);
            }
        };

        // Small delay to let the DOM settle (especially after streaming)
        const timer = setTimeout(renderDiagram, 200);
        return () => clearTimeout(timer);
    }, [chartCode]);

    if (error) {
        return (
            <div className="my-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                <strong>⚠️ Diagram Error:</strong> {error}
                <details className="mt-2 text-xs text-amber-600">
                    <summary className="cursor-pointer font-semibold">Show raw diagram code</summary>
                    <pre className="mt-1 whitespace-pre-wrap break-all">{chartCode}</pre>
                </details>
            </div>
        );
    }

    if (isRendering) {
        return (
            <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                Rendering diagram...
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="mermaid-container my-4 p-4 bg-white rounded-xl border border-slate-100 overflow-x-auto"
        />
    );
}