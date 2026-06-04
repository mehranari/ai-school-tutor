import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { sanitizeUrl } from '@braintree/sanitize-url';

// Configure standard clean theme styles
mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'strict',
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
});

export default function MermaidChart({ chartCode }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && chartCode) {
            // Clear previous versions before drawing
            containerRef.current.removeAttribute('data-processed');
            containerRef.current.innerHTML = chartCode;

            try {
                mermaid.contentLoaded();
            } catch (error) {
                console.error("Mermaid drawing error:", error);
                // If a drawing syntax breaks, fallback gracefully to a clean text layout
                containerRef.current.innerHTML = `<pre class="text-xs text-red-500 p-2 bg-red-50 rounded">${chartCode}</pre>`;
            }
        }
    }, [chartCode]);

    return (
        <div className="w-full my-4 p-4 bg-white border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
            <div ref={containerRef} className="mermaid flex justify-center" />
        </div>
    );
}