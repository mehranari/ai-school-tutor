import { Calculator, Atom, Languages, FlaskConical, Shapes, BookOpenText, Landmark, Globe2 } from "lucide-react";

export default function SubjectSelector({ selectedSubject, setSelectedSubject }) {
    const subjects = [
        { id: "Maths", icon: <Calculator size={18} />, color: "text-blue-500", bg: "bg-blue-50" },
        { id: "Physics", icon: <Atom size={18} />, color: "text-purple-500", bg: "bg-purple-50" },
        { id: "English", icon: <Languages size={18} />, color: "text-rose-500", bg: "bg-rose-50" },
        { id: "Science", icon: <FlaskConical size={18} />, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: "Chemistry", icon: <Shapes size={18} />, color: "text-amber-500", bg: "bg-amber-50" },
        { id: "Biology", icon: <BookOpenText size={18} />, color: "text-green-500", bg: "bg-green-50" },
        { id: "History", icon: <Landmark size={18} />, color: "text-orange-500", bg: "bg-orange-50" },
        { id: "Geography", icon: <Globe2 size={18} />, color: "text-cyan-500", bg: "bg-cyan-50" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="section-label mb-0">Select Subject</div>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase">Expert Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject) => (
                    <button
                        key={subject.id}
                        onClick={() => setSelectedSubject(subject.id)}
                        className={`btn-premium p-3 rounded-2xl border flex items-center gap-3 transition-all ${selectedSubject === subject.id
                                ? "bg-white border-primary shadow-lg scale-[1.02] z-10 ring-2 ring-primary/5"
                                : "bg-white/50 border-slate-100 hover:border-primary/20 hover:bg-white"
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${selectedSubject === subject.id ? subject.bg : "bg-slate-50"
                            } ${selectedSubject === subject.id ? subject.color : "text-slate-400"}`}>
                            {subject.icon}
                        </div>
                        <span className={`text-[11px] font-bold tracking-tight ${selectedSubject === subject.id ? "text-slate-900" : "text-slate-500"
                            }`}>
                            {subject.id}
                        </span>

                        {selectedSubject === subject.id && (
                            <div className="absolute right-3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
