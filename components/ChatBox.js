"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import {
    Send, Loader2, Sparkles, GraduationCap,
    LayoutPanelLeft, FileText, Eraser, Calculator,
    ChevronDown, Zap
} from "lucide-react";
import ScientificCalculator from "./ScientificCalculator";

// ─── Skeleton loader shown while AI is thinking ─────────────────────────────
function SkeletonLoader({ accent }) {
    return (
        <div className="w-full mb-6 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-slate-200" />
                <div className="w-16 h-3 rounded bg-slate-200" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
                <div className={`h-3 rounded bg-${accent}-100 w-3/4`} />
                <div className="h-3 rounded bg-slate-100 w-full" />
                <div className="h-3 rounded bg-slate-100 w-5/6" />
                <div className="h-3 rounded bg-slate-100 w-4/5" />
                <div className={`h-3 rounded bg-${accent}-50 w-2/3`} />
            </div>
            <div className={`mt-2 text-[10px] font-black uppercase tracking-widest text-${accent}-400 animate-pulse flex items-center gap-2`}>
                <Zap size={11} /> Generating expert response...
            </div>
        </div>
    );
}

// ─── Suggested quick prompts by subject ─────────────────────────────────────
const quickPrompts = {
    Maths: ["Explain quadratic equations", "How to find area of a circle?", "What is Pythagoras theorem?"],
    Physics: ["Explain Newton's 3 laws", "What is Ohm's law?", "How does gravity work?"],
    Chemistry: ["What is atomic structure?", "Explain chemical bonding", "What are acids and bases?"],
    Biology: ["Explain photosynthesis", "What is cell division?", "How does the heart work?"],
    English: ["What is a metaphor?", "Explain essay structure", "What is active and passive voice?"],
    Science: ["What is the water cycle?", "Explain food chains", "What is energy?"],
    History: ["What caused World War 1?", "What was the Industrial Revolution?"],
    Geography: ["What causes earthquakes?", "Explain climate vs weather"],
};

export default function ChatBox({ grade, subject }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState("chat");
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const [showPrompts, setShowPrompts] = useState(true);
    const messagesEndRef = useRef(null);
    const lastMessageRef = useRef(null);
    const inputRef = useRef(null);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`tutor_chat_${subject}_${grade}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            setMessages(parsed);
            if (parsed.length > 1) setShowPrompts(false);
        } else {
            setMessages([{
                text: `Welcome! I'm your **${subject} Specialist** for Grade ${grade}.\n\nAsk me anything — I'll give you a detailed, textbook-quality explanation with diagrams and step-by-step solutions.`,
                isAi: true,
            }]);
        }
    }, [subject, grade]);

    // Save to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`tutor_chat_${subject}_${grade}`, JSON.stringify(messages));
        }
    }, [messages, subject, grade]);

    // Scroll to last AI message
    useEffect(() => {
        if (!isLoading && messages.length > 1) {
            setTimeout(() => {
                lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleClear = () => {
        localStorage.removeItem(`tutor_chat_${subject}_${grade}`);
        setMessages([{
            text: `Ready for a new topic on **${subject}**. What would you like to learn?`,
            isAi: true,
        }]);
        setShowPrompts(true);
    };

    const handleSubmit = async (e, overrideInput) => {
        e?.preventDefault();
        const userMessage = overrideInput || input;
        if (!userMessage.trim() || isLoading) return;

        setInput("");
        setShowPrompts(false);
        setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
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
            setMessages(prev => [...prev, { text: data.response, isAi: true }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting. Please check your internet and try again!",
                isAi: true,
            }]);
            console.error(error);
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const getSubjectAccent = () => {
        const map = { Maths: "blue", Physics: "purple", English: "rose", Chemistry: "amber", Biology: "green" };
        return map[subject] || "indigo";
    };

    const accent = getSubjectAccent();
    const prompts = quickPrompts[subject] || quickPrompts.Science;

    return (
        <div className="flex flex-col h-[700px] md:h-[780px] bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 relative">
            <ScientificCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />

            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="bg-white/90 backdrop-blur-md px-5 md:px-7 py-4 border-b border-slate-50 flex flex-wrap justify-between items-center gap-3 z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                        <GraduationCap size={18} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 text-xs tracking-tight uppercase leading-tight">
                            {subject} Specialist
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 bg-${accent}-500 rounded-full animate-pulse`} />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                Grade {grade} · Online
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {subject === "Maths" && (
                        <button
                            onClick={() => setIsCalcOpen(true)}
                            className="p-2 rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"
                        >
                            <Calculator size={13} />
                            <span className="hidden sm:inline">Calc</span>
                        </button>
                    )}
                    <button
                        onClick={handleClear}
                        className="p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all"
                        title="Clear Chat"
                    >
                        <Eraser size={16} />
                    </button>
                    <div className="flex bg-slate-100/80 p-1 rounded-xl">
                        {[
                            { id: "chat", label: "Tutor", icon: <LayoutPanelLeft size={12} /> },
                            { id: "exam", label: "Exam", icon: <FileText size={12} /> },
                        ].map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${mode === m.id
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {m.icon} {m.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Messages ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 md:px-7 py-6 space-y-2 scrollbar-hide bg-slate-50/20">

                {/* Quick prompt suggestions */}
                {showPrompts && messages.length <= 1 && (
                    <div className="mb-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">
                            Try asking...
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {prompts.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSubmit(null, p)}
                                    className={`px-3 py-2 rounded-xl border border-${accent}-100 bg-${accent}-50 text-${accent}-700 text-[10px] font-bold hover:bg-${accent}-100 transition-all hover:scale-[1.02] active:scale-95`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                    >
                        <MessageBubble
                            message={msg.text}
                            isAi={msg.isAi}
                            accent={accent}
                        />
                    </div>
                ))}

                {isLoading && <SkeletonLoader accent={accent} />}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input ───────────────────────────────────────────────── */}
            <div className="p-4 md:p-5 bg-white border-t border-slate-50 shrink-0">
                <form onSubmit={handleSubmit} className="relative flex items-center group">
                    <div className="absolute left-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                        <Sparkles size={18} />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Ask a ${subject} question...`}
                        className="w-full pl-11 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-300 transition-all font-medium placeholder:text-slate-300 text-slate-900 text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 active:scale-95 disabled:opacity-20 transition-all shadow-lg"
                    >
                        {isLoading
                            ? <Loader2 className="animate-spin" size={17} />
                            : <Send size={17} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        }
                    </button>
                </form>
                <p className="text-[9px] text-center text-slate-300 font-medium mt-2 uppercase tracking-widest">
                    Grade {grade} · {subject} · {mode === "chat" ? "Tutor Mode" : "Exam Mode"}
                </p>
            </div>
        </div>
    );
}