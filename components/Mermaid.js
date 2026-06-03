"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid only once
mermaid.initialize({
    startOnLoad: false, // Changed to false for manual rendering
    theme: "neutral",
    securityLevel: "loose",
    fontFamily: "Inter",
    loglevel: 5, // Silence some logs
});

export default function Mermaid({ chart }) {
    const ref = useRef(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!ref.current || !chart) return;

        const renderChart = async () => {
            try {
                setError(false);

                // Basic cleanup of the chart text
                let cleanChart = chart.trim();

                // If it starts with ```mermaid and ends with ```, strip them
                if (cleanChart.startsWith("```mermaid")) {
                    cleanChart = cleanChart.replace(/^```mermaid\n?/, "").replace(/\n?```$/, "");
                }

                // Mermaid render requires a unique ID
                const id = "mermaid-svg-" + Math.random().toString(36).substring(2, 11);

                const { svg } = await mermaid.render(id, cleanChart);

                if (ref.current) {
                    ref.current.innerHTML = svg;
                }
            } catch (err) {
                console.error("Mermaid Render Error:", err);
                setError(true);
            }
        };

        renderChart();
    }, [chart]);

    if (error) {
        return (
            <div className="my-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 text-center">
                <p className="text-sm font-medium text-amber-800 italic">
                    (Visual diagram could not be displayed)
                </p>
                <details className="mt-2 text-[10px] text-amber-600 cursor-pointer">
                    <summary>Show Raw Code</summary>
                    <pre className="mt-2 p-2 bg-white/50 rounded text-left overflow-x-auto">
                        {chart}
                    </pre>
                </details>
            </div>
        );
    }

    return (
        <div className="flex justify-center my-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div ref={ref} className="mermaid-container w-full" />
        </div>
    );
}
