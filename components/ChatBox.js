"use client";
import { useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ grade, subject }) {
    const [messages, setMessages] = useState([]);

    const handleClearChat = () => {
        setMessages([]);
    };

    // Logic to add AI/User messages goes here...
    // Ensure that when you map through messages, you pass onClearChat

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={index}
                        message={msg.text}
                        isAi={msg.isAi}
                        onClearChat={index === 0 ? handleClearChat : null}
                    />
                ))}
            </div>
            {/* Input area... */}
        </div>
    );
}