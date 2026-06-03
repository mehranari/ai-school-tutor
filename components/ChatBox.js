"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { Send, Loader2, Sparkles, GraduationCap, LayoutPanelLeft, FileText, Eraser, Calculator } from "lucide-react";
import ScientificCalculator from "./ScientificCalculator";

export default function ChatBox({ grade, subject }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState("chat");
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const lastMessageRef = useRef(null);

    // Persistence: Load from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem(`tutor_chat_${subject}_${grade}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Initial message if nothing saved
            setMessages([
                {
                    text: `Welcome! I'm your **${subject} Master**. \n\nYou can ask any question, and I'll provide a detailed textbook-style explanation with diagrams and step-by-step solutions.`,
                    isAi: true,
                },
            ]);
        }
    }, [subject, grade]);

    // Persistence: Save to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`tutor_chat_${subject}_${grade}`, JSON.stringify(messages));
        }
    }, [messages, subject, grade]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToLastAiMessage = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    useEffect(() => {
        if (!isLoading && messages.length > 1) {
            setTimeout(scrollToLastAiMessage, 100);
        } else {
            scrollToBottom();
        }
    }, [messages, isLoading]);

    const handleClear = () => {
        setMessages([
            {
                text: `Ready for a new question on **${subject}**. What would you like to understand?`,
                isAi: true,
            },
        ]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { text: userMessage, isAi: false }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    grade,
                    subject,
                    mode: mode === "chat" ? "explain" : "exam",
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setMessages((prev) => [...prev, { text: data.response, isAi: true }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { text: "I'm having a little trouble connecting. Please try again!", isAi: true },
            ]);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSubjectAccent = () => {
        switch (subject) {
            case "Maths": return "blue";
            case "Physics": return "purple";
            case "English": return "rose";
            case "Chemistry": return "amber";
            case "Biology": return "green";
            default: return "indigo";
        }
    };

    const accent = getSubjectAccent();

    return (
        <div className="flex flex-col h-[750px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 relative">
            <ScientificCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />

            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-md px-8 py-5 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <GraduationCap size={22} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 text-sm tracking-tight uppercase">{subject} Specialist</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 bg-${accent}-500 rounded-full animate-pulse`}></span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Online & Ready
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {subject === "Maths" && (
                        <button
                            onClick={() => setIsCalcOpen(true)}
                            className={`p-2.5 rounded-xl border border-${accent}-500/20 text-${accent}-600 bg-${accent}-500/5 hover:bg-${accent}-500 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest`}
                        >
                            <Calculator size={16} />
                            Scientific Calc
                        </button>
                    )}

                    <button
                        onClick={handleClear}
                        className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        title="Reset Chat"
                    >
                        <Eraser size={18} />
                    </button>

                    <div className="flex bg-slate-100/80 p-1 rounded-xl">
                        <button
                            onClick={() => setMode("chat")}
                            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${mode === "chat"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <LayoutPanelLeft size={14} />
                            Tutor
                        </button>
                        <button
                            onClick={() => setMode("exam")}
                            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${mode === "exam"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <FileText size={14} />
                            Exam
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-slate-50/30">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                    >
                        <MessageBubble message={msg.text} isAi={msg.isAi} accent={accent} />
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-6 slide-up">
                        <div className="bg-white rounded-3xl px-8 py-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="relative">
                                <Loader2 className={`animate-spin text-${accent}-500`} size={24} />
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Mastering Solution...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-50">
                <form
                    onSubmit={handleSubmit}
                    className="relative flex items-center group"
                >
                    <div className="absolute left-5 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                        <Sparkles size={20} />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full pl-14 pr-16 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white focus:border-slate-900 transition-all font-medium placeholder:text-slate-400 text-slate-900"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2.5 bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-black active:scale-95 disabled:opacity-20 transition-all shadow-xl shadow-slate-200 group"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
