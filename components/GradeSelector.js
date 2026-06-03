export default function GradeSelector({ selectedGrade, setSelectedGrade }) {
    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="section-label mb-0">Select Grade</div>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md uppercase">Target Stage</span>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {grades.map((grade) => (
                    <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`btn-premium group h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${selectedGrade === grade
                                ? "bg-slate-900 text-white shadow-xl scale-105"
                                : "bg-white text-slate-500 border border-slate-100 hover:border-primary/40 hover:text-slate-900"
                            }`}
                    >
                        <span className="text-lg leading-none">{grade}</span>
                        {selectedGrade === grade && (
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
