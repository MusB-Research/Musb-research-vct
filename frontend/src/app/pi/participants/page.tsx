"use client";

import { useState } from "react";
import { 
    Users, Search, Filter, ShieldCheck, ArrowUpRight, 
    MoreHorizontal, FlaskConical, Calendar,
    Lock, CheckCircle2, Clock, Activity, FileText,
    History, AlertCircle, ChevronRight, UserPlus
} from "lucide-react";

export default function PIParticipantOversight() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterArm, setFilterArm] = useState("All");

    const participants = [
        { id: "P-4502", name: "Sarah Miller", age: 43, gender: "F", study: "NAD+ Longevity", arm: "Arm A", status: "Active", progress: 65, lastVisit: "Feb 14, 2026", medicalReview: "Verified" },
        { id: "P-7721", name: "James Wilson", age: 52, gender: "M", study: "NAD+ Longevity", arm: "Arm B", status: "Active", progress: 90, lastVisit: "Feb 16, 2026", medicalReview: "Pending" },
        { id: "P-1120", name: "David Brown", age: 31, gender: "F", study: "Microbiome Study", arm: "Arm A", status: "Screening", progress: 20, lastVisit: "Feb 20, 2026", medicalReview: "Critical" },
        { id: "P-5421", name: "Emma Davis", age: 67, gender: "F", study: "NAD+ Longevity", arm: "Placebo", status: "Completed", progress: 100, lastVisit: "Feb 01, 2026", medicalReview: "Verified" },
    ];

    const filtered = participants.filter(p => 
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterArm === "All" || p.arm === filterArm)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Subject Oversight</h1>
                    <p className="text-slate-500 mt-2 font-medium italic">High-resolution participant registry with full investigator access (Spec 16.4).</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                            placeholder="Search by ID or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs lg:text-sm text-slate-300 focus:border-indigo-500/50 outline-none w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
                {["All", "Arm A", "Arm B", "Placebo", "Screening"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilterArm(f)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterArm === f ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-900/40 text-slate-500 border-white/5 hover:text-white'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Registry Table */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#0a1120]/60 border-b border-white/5">
                        <tr className="text-[11px] uppercase tracking-[0.2rem] text-slate-500 font-black italic">
                            <th className="py-6 px-8 italic">Participant ID</th>
                            <th className="py-6 px-8 italic">Scientific Context</th>
                            <th className="py-6 px-8 italic text-indigo-400">Medical Review</th>
                            <th className="py-6 px-8 italic">Trial State</th>
                            <th className="py-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {filtered.map((p) => (
                            <tr key={p.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                                <td className="py-6 px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 border border-white/5 flex items-center justify-center group-hover:border-indigo-500/30 transition-all">
                                            <Users size={20} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-black text-white italic tracking-tight">{p.name}</p>
                                            <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">{p.id} · Age {p.age}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-8">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <FlaskConical size={12} className="text-amber-500/70" />
                                            <span className="text-[12px] font-bold text-slate-300">{p.arm}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Activity size={12} className="text-cyan-500/70" />
                                            <span className="text-[11px] font-black uppercase text-slate-600 tracking-widest italic">{p.study}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-2 py-0.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest border ${
                                            p.medicalReview === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            p.medicalReview === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] animate-pulse' :
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {p.medicalReview}
                                        </div>
                                        {p.medicalReview === 'Critical' && <AlertCircle size={14} className="text-red-500" />}
                                    </div>
                                </td>
                                <td className="py-6 px-8">
                                     <div className="flex items-center gap-3">
                                        <div className="w-32 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${p.progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-indigo-500'} transition-all duration-1000`} 
                                                style={{ width: `${p.progress}%` }} 
                                            />
                                        </div>
                                        <span className="text-[12px] font-black text-white italic tracking-tighter">{p.progress}%</span>
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 italic flex items-center gap-1.5">
                                        <History size={10} /> Last Visit: {p.lastVisit}
                                    </p>
                                </td>
                                <td className="py-6 pr-8 text-right">
                                    <button className="px-6 py-2.5 bg-slate-950 border border-white/10 hover:border-indigo-500/50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl font-sans italic flex items-center gap-2 ml-auto group/btn">
                                        Review Files <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Compliance Note */}
            <div className="p-8 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/10 flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <ShieldCheck className="text-indigo-400" size={32} />
                 </div>
                 <p className="text-sm font-medium text-slate-500 italic max-w-4xl leading-relaxed">
                    <strong className="text-indigo-400 uppercase italic font-black">Investigator Access Privilege:</strong> As a Principal Investigator on these protocols, you have full access to non-anonymized Subject Identifiable Information. All data access is logged with timestamp, IP, and session intent for GCP compliance (Spec 16.3).
                 </p>
            </div>
        </div>
    );
}
