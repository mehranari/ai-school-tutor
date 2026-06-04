"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GradeSelector from "../components/GradeSelector";
import SubjectSelector from "../components/SubjectSelector";
import ChatBox from "../components/ChatBox";
import { GraduationCap, BookOpen, Lightbulb, Target, ArrowRight } from "lucide-react";

export default function Home() {
    const [selectedGrade, setSelectedGrade] = useState(10);
    const [selectedSubject, setSelectedSubject] = useState("Maths");


    const getSubjectFocus = () => {
        switch (selectedSubject) {
            case "Maths": return "Calculus, Algebra & Geometry Logic";
            case "Physics": return "Laws of Motion, Energy & Quantum Principles";
            case "English": return "Literary Analysis & Grammar Mastery";
            case "Chemistry": return "Molecular Bonds & Chemical Reactions";
            case "Biology": return "Human Anatomy & Ecological Systems";
            default: return "Comprehensive Academic Principles";
        }
    };

    const getSubjectAccent = () => {
        switch (selectedSubject) {
            case "Maths": return "blue";
            case "Physics": return "purple";
            case "English": return "rose";
            case "Chemistry": return "amber";
            case "Biology": return "green";
            default: return "indigo";
        }
    };

    const scrollToChat = () => {
        const chatSection = document.getElementById('chat-section');
        if (chatSection) {
            chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const accent = getSubjectAccent();

    return (
        <main className="min-h-screen py-10 px-6 relative bg-slate-50/30 overflow-x-hidden">
            {/* Minimalist Dynamic Background */}
            <div className={`fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]`}></div>
            <div className={`fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-${accent}-500/5 blur-[120px] -z-10 animate-pulse`}></div>
            <div className={`fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-${accent}-500/5 blur-[120px] -z-10 animate-pulse`} style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Clean Navbar */}
                <div className="flex justify-between items-center slide-up">
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                            <GraduationCap size={22} />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">Tutor<span className="text-primary">AI</span></span>
                    </Link>
                    <div className="hidden md:flex gap-6">
                        {['Dashboard', 'Assignments', 'Analytics'].map(item => (
                            <span key={item} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Minimal Header - Direct to Question */}
                <header className="py-6 slide-up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85]">
                            Master <span className={`text-${accent}-600 transition-colors duration-500`}>{selectedSubject}</span> <br />
                            <span className="text-slate-200">with Expert Guidance.</span>
                        </h1>
                        <div className="flex gap-2">
                            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full bg-${accent}-500 animate-pulse`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global AI Node Active</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Access Panel */}
                    <div className="lg:col-span-4 space-y-8 slide-up" style={{ animationDelay: "0.1s" }}>
                        <div className="premium-card p-8 bg-white shadow-xl border-slate-100 group">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                <Target size={14} className={`text-${accent}-500`} /> Configure Study
                            </h2>

                            <GradeSelector
                                selectedGrade={selectedGrade}
                                setSelectedGrade={setSelectedGrade}
                            />

                            <div className="mt-10 pt-10 border-t border-slate-50">
                                <SubjectSelector
                                    selectedSubject={selectedSubject}
                                    setSelectedSubject={setSelectedSubject}
                                />
                            </div>
                        </div>

                        {/* Quick Topics */}
                        <div className="premium-card p-6 bg-white/50 backdrop-blur-sm border-dashed border-2 border-slate-200">
                            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Suggested {selectedSubject} Units</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Core Basics', 'Advanced Theory', 'Exam Prep', 'Case Studies'].map(topic => (
                                    <button key={topic} className="px-3 py-2 rounded-lg bg-white border border-slate-100 text-[9px] font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all uppercase tracking-wider">
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Understanding the Topic Section */}
                        <div className="premium-card p-8 bg-slate-900 text-white shadow-2xl overflow-hidden relative group">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Deep Learning</h3>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <BookOpen size={16} className={`text-${accent}-400`} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <p className={`text-[10px] font-black uppercase tracking-widest text-${accent}-400 mb-1`}>Subject Focus</p>
                                        <p className="font-bold text-sm leading-relaxed">{getSubjectFocus()}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <p className={`text-[10px] font-black uppercase tracking-widest text-${accent}-400 mb-1`}>Key Objective</p>
                                        <p className="font-bold text-sm leading-relaxed">Achieve deep conceptual clarity through visual logic.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={scrollToChat}
                                    className={`w-full h-12 rounded-xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-${accent}-500 group-hover:text-white transition-all shadow-lg active:scale-95`}
                                // removed dynamic classes assignment inside string literals which can break tailwind compiling tracking
                                >
                                    Start Learning <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-700">
                                <Lightbulb size={200} />
                            </div>
                        </div>
                    </div>

                    {/* Question Section */}
                    <div id="chat-section" className="lg:col-span-8 slide-up" style={{ animationDelay: "0.2s" }}>
                        <ChatBox grade={selectedGrade} subject={selectedSubject} />
                    </div>
                </div>

                <footer className="py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <div>© 2026 TutorAI Enterprise • Build v2.4.0</div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-slate-900 transition-colors">Security</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Academy</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors">Compliance</Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}