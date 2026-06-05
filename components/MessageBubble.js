// ... (keep your imports)
export default function MessageBubble({ message, isAi, accent = "indigo" }) {

    // Splitting logic: Find the mermaid block and extract the content
    const parts = message.split(/(```mermaid[\s\S]*?```)/gi);

    return (
        <div className={`w-full flex items-start gap-4 ${isAi ? "" : "flex-row-reverse"}`}>
            {/* ... (Your avatar code) */}
            <div className="flex-1">
                {parts.map((part, index) => {
                    if (part.toLowerCase().startsWith("```mermaid")) {
                        return <MermaidChart key={index} chartCode={part} />;
                    }
                    return (
                        <ReactMarkdown key={index} remarkPlugins={[remarkGfm, remarkMath]}>
                            {part}
                        </ReactMarkdown>
                    );
                })}
            </div>
        </div>
    );
}