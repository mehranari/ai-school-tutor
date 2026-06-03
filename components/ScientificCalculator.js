"use client";

import { useState } from "react";
import { X, Delete, Percent, Divide, Minus, Plus, Equal, Hash } from "lucide-react";

export default function ScientificCalculator({ isOpen, onClose }) {
    const [display, setDisplay] = useState("0");
    const [equation, setEquation] = useState("");

    const handleNumber = (num) => {
        setDisplay(display === "0" ? String(num) : display + num);
    };

    const handleOperator = (op) => {
        setEquation(display + " " + op + " ");
        setDisplay("0");
    };

    const calculate = () => {
        try {
            // Basic implementation for demo, in production use a math library
            const result = eval(equation + display);
            setDisplay(String(result));
            setEquation("");
        } catch (e) {
            setDisplay("Error");
        }
    };

    const clear = () => {
        setDisplay("0");
        setEquation("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-slate-900 text-white rounded-[2.5rem] w-full max-w-xs overflow-hidden shadow-2xl border border-white/10 slide-up">
                {/* Header */}
                <div className="p-6 flex justify-between items-center bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Hash size={18} className="text-indigo-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Scientific Calculator</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Display */}
                <div className="p-8 text-right space-y-2 bg-black/20">
                    <div className="text-xs font-bold text-slate-500 h-4 overflow-hidden uppercase tracking-wider">{equation}</div>
                    <div className="text-5xl font-light tracking-tight truncate">{display}</div>
                </div>

                {/* Buttons Grid */}
                <div className="p-6 grid grid-cols-4 gap-3 bg-white/5">
                    {/* Scientific Row */}
                    <button onClick={() => setDisplay(String(Math.sin(parseFloat(display))))} className="calc-btn-sci">sin</button>
                    <button onClick={() => setDisplay(String(Math.cos(parseFloat(display))))} className="calc-btn-sci">cos</button>
                    <button onClick={() => setDisplay(String(Math.tan(parseFloat(display))))} className="calc-btn-sci">tan</button>
                    <button onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))} className="calc-btn-sci">√</button>

                    {/* Standard Rows */}
                    <button onClick={clear} className="calc-btn-op text-rose-400">AC</button>
                    <button onClick={() => setDisplay(display.slice(0, -1) || "0")} className="calc-btn-op text-amber-400"><Delete size={18} /></button>
                    <button onClick={() => handleOperator("%")} className="calc-btn-op"><Percent size={18} /></button>
                    <button onClick={() => handleOperator("/")} className="calc-btn-op"><Divide size={18} /></button>

                    {[7, 8, 9].map(n => <button key={n} onClick={() => handleNumber(n)} className="calc-btn-num">{n}</button>)}
                    <button onClick={() => handleOperator("*")} className="calc-btn-op text-indigo-400">×</button>

                    {[4, 5, 6].map(n => <button key={n} onClick={() => handleNumber(n)} className="calc-btn-num">{n}</button>)}
                    <button onClick={() => handleOperator("-")} className="calc-btn-op text-indigo-400"><Minus size={18} /></button>

                    {[1, 2, 3].map(n => <button key={n} onClick={() => handleNumber(n)} className="calc-btn-num">{n}</button>)}
                    <button onClick={() => handleOperator("+")} className="calc-btn-op text-indigo-400"><Plus size={18} /></button>

                    <button onClick={() => handleNumber(0)} className="calc-btn-num col-span-2">0</button>
                    <button onClick={() => handleNumber(".")} className="calc-btn-num">.</button>
                    <button onClick={calculate} className="calc-btn-eq"><Equal size={20} /></button>
                </div>
            </div>

            <style jsx>{`
        .calc-btn-num { @apply h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-xl font-medium transition-colors; }
        .calc-btn-op { @apply h-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors; }
        .calc-btn-sci { @apply h-10 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors; }
        .calc-btn-eq { @apply h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-all; }
      `}</style>
        </div>
    );
}
