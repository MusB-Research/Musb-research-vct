"use client";

import { useState } from "react";
import { 
    FlaskConical, 
    Upload, 
    FileText, 
    CheckCircle2, 
    AlertCircle, 
    Lock, 
    Unlock, 
    Eye,
    ArrowUpRight,
    Search,
    History,
    FileDown,
    ShieldCheck,
    Plus
} from "lucide-react";

export default function LabsTab({ participantId }: { participantId: string }) {
    const [results, setResults] = useState([
        { id: "L-9001", test: "Complete Blood Count", date: "2026-03-09", category: "BLOOD", status: "Verified", flag: "Normal", released: true, site: "Quest Diagnostics" },
        { id: "L-8812", test: "NAD+ Level (Serum)", date: "2026-03-05", category: "BLOOD", status: "Verified", flag: "High", released: false, site: "MusB Internal Lab" },
        { id: "L-7712", test: "Urinalysis Micro", date: "2026-02-15", category: "URINE", status: "Verified", flag: "Normal", released: true, site: "Quest Diagnostics" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header (Spec 12.1) */}
            <div className="flex justify-between items-center">
                <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] flex items-center gap-2">
                    <FlaskConical className="text-emerald-500" size={18} /> Clinical Test Battery
                </h3>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                        <History size={14} /> History
                    </button>
                    <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10">
                        <Upload size={14} /> Upload Result
                    </button>
                </div>
            </div>

            {/* Subject Results Grid (Spec 12.2 Integration) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((lab) => (
                    <div key={lab.id} className="glass p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 relative group hover:border-emerald-500/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl border ${lab.released ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-950 border-white/5 text-slate-600'}`}>
                                {lab.released ? <Unlock size={16} /> : <Lock size={16} />}
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                lab.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                                {lab.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight mb-1">{lab.test}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lab.site} · {lab.date}</p>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clinical Observation</span>
                                <div className="flex items-center gap-2">
                                    {lab.flag === 'Normal' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-red-500" />}
                                    <span className={`text-[11px] font-black uppercase italic ${lab.flag === 'Normal' ? 'text-slate-400' : 'text-red-400'}`}>{lab.flag}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button className="flex-1 py-2.5 bg-slate-950 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                    <FileDown size={14} /> PDF
                                </button>
                                <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all border border-white/5">
                                    Review
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Visual Placeholder for adding new (Spec 12.1 visual cue) */}
                <div className="p-6 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center group hover:border-emerald-500/20 transition-all cursor-pointer bg-slate-900/20">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                        <Plus size={24} />
                    </div>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest italic group-hover:text-slate-400">Log New Clinical Result</p>
                </div>
            </div>

            {/* Sponsor Visibility Disclosure (Spec 12.2) */}
            <div className="p-6 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-[2rem] flex items-center gap-4">
                <ShieldCheck className="text-indigo-400" size={24} />
                <div className="flex-1">
                    <p className="text-[12px] text-slate-400 font-medium italic">
                        <strong className="text-indigo-300 uppercase italic font-black">PII PROTECTION ACTIVE:</strong> Lab reports released to participants are NOT visible to sponsors with PII attached. Sponsors only receive anonymized numeric data for SID: {participantId}.
                    </p>
                </div>
            </div>
        </div>
    );
}
