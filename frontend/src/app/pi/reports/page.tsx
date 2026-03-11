"use client";

import { 
    BarChart3, FileBarChart, CheckCircle2, MessageSquare, 
    Calendar, Download, FileSignature, ArrowUpRight,
    ShieldCheck, Clock, Users, Database, Globe,
    ChevronRight, Microscope, FlaskConical
} from "lucide-react";
import { useState } from "react";

export default function PIReportsSignOff() {
    const [filterStatus, setFilterStatus] = useState("All");

    const reports = [
        { id: "REP-401", name: "Quarterly Safety Audit v2", type: "Safety", status: "Awaiting Sign-Off", date: "Mar 10, 2026", sponsor: "BioGen Pharma" },
        { id: "REP-402", name: "Interim Efficacy Summary", type: "Efficacy", status: "In Review", date: "Mar 08, 2026", sponsor: "MusB Internal" },
        { id: "REP-403", name: "Site Performance Metrics", type: "Operational", status: "Approved", date: "Mar 01, 2026", sponsor: "Sponsor Hub" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <FileSignature className="text-indigo-400" size={32} /> Report &amp; Sign-Off Hive
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Scientific validation and formal investigator approval of study outputs (Spec 16.4).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
                        <CheckCircle2 size={16} /> Batch Approval
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Pending Approvals", value: 3, icon: FileSignature, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Reports Generated", value: 14, icon: FileBarChart, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    { label: "Sign-off Velocity", value: "1.2d", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Data Integrity", value: "99.8%", icon: ShieldCheck, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                ].map((s, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${s.bg} rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2`} />
                        <div className={`p-3 rounded-2xl ${s.bg} ${s.color} w-fit mb-4 relative z-10 group-hover:scale-110 transition-transform`}>
                            <s.icon size={20} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white italic tracking-tighter">{s.value}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports List (Spec 16.4) */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">Investigation Approval Queue</h2>
                        <div className="flex gap-2">
                            {["All", "Pending"].map(f => (
                                <button key={f} onClick={() => setFilterStatus(f)} className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${filterStatus === f ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-slate-500 border-white/5'}`}>{f}</button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {reports.map((rep) => (
                            <div key={rep.id} className="p-8 hover:bg-white/[0.01] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all shadow-xl">
                                        <FileBarChart size={20} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-black text-white italic uppercase tracking-tight group-hover:text-indigo-400 transition-colors leading-none mb-2">{rep.name}</h4>
                                        <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-500 italic shrink-0">
                                            <span className="text-amber-500/70">{rep.type} Report</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5"><Globe size={12} /> {rep.sponsor}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5"><Clock size={12} /> {rep.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                        rep.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        rep.status === 'Awaiting Sign-Off' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-slate-800 text-slate-500 border-white/5'
                                    }`}>
                                        {rep.status}
                                    </span>
                                    <button className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg flex items-center gap-2">
                                        Review <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regulatory Feed (Spec 16.4 Draft/Send Logic) */}
                <div className="space-y-4">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic mb-6">Investigator Comments</h3>
                        <div className="space-y-4">
                            {[
                                { user: "PI Chen", msg: "Please verify Appendix B data linkage before final send.", date: "1h ago" },
                                { user: "Coordinator", msg: "Efficacy summary updated with final cohort data.", date: "4h ago" },
                            ].map((c, i) => (
                                <div key={i} className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 italic">
                                    <p className="text-[12px] text-slate-300 font-medium leading-relaxed mb-2">"{c.msg}"</p>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                                        <span className="text-indigo-400/70">{c.user}</span>
                                        <span>{c.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex gap-2">
                             <input placeholder="Add observation..." className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-[11px] outline-none focus:border-indigo-500/30 transition-all font-medium" />
                             <button className="p-2 bg-indigo-600 text-white rounded-xl"><ArrowUpRight size={18} /></button>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-amber-500/[0.03] border border-amber-500/10 flex flex-col items-center text-center">
                         <Globe className="text-amber-500/60 mb-4" size={24} />
                         <h4 className="text-[12px] font-black text-white uppercase tracking-widest italic mb-2">Pre-Sponsor Lockdown</h4>
                         <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                            Reports are kept in "Scientific Draft" state until PI Sign-off. Once signed, de-identified tables are pushed to the <strong className="text-slate-300">Sponsor Oversight Panel (Spec 15).</strong>
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
