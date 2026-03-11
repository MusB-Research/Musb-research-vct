"use client";

import { useState } from "react";
import { 
    BarChart3, PieChart, TrendingUp, Download, 
    Calendar, Filter, FileBarChart, ArrowUpRight,
    Users, Target, Globe, Microscope, FileText,
    ArrowRight, Share2, ClipboardCheck
} from "lucide-react";

export default function SponsorReportsPage() {
    const [activeSection, setActiveSection] = useState("Analytics");

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header (Spec 15.1, 15.5) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <BarChart3 className="text-amber-500" size={32} /> Clinical Intelligence Hub
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Protocol reports, de-identified metrics & analytical oversight (Spec 15.5).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2 font-sans font-black">
                        <Download size={14} /> Global Dataset (.zip)
                    </button>
                    <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-amber-600/20 transition-all flex items-center gap-2 font-sans font-black">
                        <Share2 size={14} /> Request Share
                    </button>
                </div>
            </div>

            {/* View Selection (Spec 15.5 Diversity/Metrics Categories) */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
                {["Analytics", "Governance Reports", "De-ID Data Tables"].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveSection(tab)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === tab ? 'bg-slate-800 text-amber-500 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeSection === "Analytics" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Diversity (Spec 15.5 Metrics) */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 group hover:border-amber-500/20 transition-all">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-1">Demographic Diversity</h3>
                                <p className="text-[11px] font-medium text-slate-500">De-identified cohort breakdown</p>
                            </div>
                            <PieChart size={20} className="text-indigo-500" />
                        </div>
                        <div className="h-48 flex items-end gap-3 mb-8">
                            {[
                                { label: "Group 1", val: 65, color: "bg-indigo-600/40 border-indigo-500" },
                                { label: "Group 2", val: 18, color: "bg-amber-600/40 border-amber-500" },
                                { label: "Group 3", val: 11, color: "bg-cyan-600/40 border-cyan-500" },
                                { label: "Group 4", val: 6, color: "bg-slate-600/40 border-slate-500" },
                            ].map((bar, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                    <div className={`w-full rounded-xl border-t-2 ${bar.color} transition-all duration-1000 group-hover:brightness-110`} style={{ height: `${bar.val}%` }} />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{bar.val}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enrollment Velocity (Spec 15.3 Graphs) */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 group hover:border-amber-500/20 transition-all relative">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-1">Recruitment Velocity</h3>
                                <p className="text-[11px] font-medium text-slate-500">Actual vs Target enrollment curve</p>
                            </div>
                            <TrendingUp size={20} className="text-emerald-500" />
                        </div>
                        <div className="h-48 relative flex items-center justify-center border-b border-l border-white/10 ml-4 mb-4">
                            <svg className="w-full h-full overflow-visible">
                                <path d="M0,180 Q100,140 200,90 T400,20" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                                <path d="M0,180 Q100,160 200,120" fill="none" stroke="#F59E0B" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Reports Grid (Spec 15.5) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Recruitment Metrics v1.4", icon: Target, desc: "Detailed funnel analysis & source efficiency.", type: "PDF", date: "Mar 10, 2026" },
                    { label: "Progress Report Draft", icon: FileText, desc: "Interim study summary (Spec 15.5).", type: "Draft", date: "Mar 09, 2026" },
                    { label: "Site Completion Summary", icon: ClipboardCheck, desc: "Arm-wise completion summaries.", type: "XLSX", date: "Mar 01, 2026" },
                ].map((rep, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] hover:bg-white/[0.02] transition-all group relative overflow-hidden flex flex-col">
                        <div className="p-3 bg-white/5 text-amber-500/80 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                            <rep.icon size={20} />
                        </div>
                        <h4 className="text-[15px] font-black text-white italic uppercase tracking-tight mb-2">{rep.label}</h4>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-8 flex-1">{rep.desc}</p>
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{rep.date}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${rep.type === 'Draft' ? 'text-amber-500' : 'text-slate-500'}`}>{rep.type}</span>
                            </div>
                            <button className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-600 hover:text-white transition-all">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Export Capabilities Banner (Spec 15.5 exported graphics) */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/[0.05] to-amber-500/[0.05] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <FileBarChart size={32} />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">Export Protocol Graphics (Spec 15.5)</h3>
                        <p className="text-slate-500 font-medium max-w-2xl text-sm leading-relaxed italic">
                            All dashboard visualizations including Enrollment Velocity and Diversity Distributions are available for vector export (.SVG) for inclusion in regulatory dossiers and sponsor board decks.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-[11px] font-black text-white uppercase tracking-widest rounded-xl transition-all border border-white/5">Download Graphic Set</button>
                </div>
            </div>
        </div>
    );
}
