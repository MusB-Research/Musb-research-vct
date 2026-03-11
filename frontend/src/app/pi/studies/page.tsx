"use client";

import { useState } from "react";
import { 
    Plus, Search, Filter, FlaskConical, Target, Calendar, 
    ArrowRight, Activity, HeartPulse, Microscope, 
    ChevronRight, Layers, Settings, ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function PIStudiesPage() {
    const studies = [
        { id: "NAD-001", title: "NAD+ Longevity & Metabolic Restoration", condition: "Metabolic Health", status: "RECRUITING", enrolled: 87, target: 150, phase: "Phase II" },
        { id: "GUT-002", title: "Microbiome Diversity & Cognitive Edge", condition: "Neurology", status: "ACTIVE", enrolled: 58, target: 100, phase: "Phase I" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Assigned Protocols</h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Clinical trial portfolio under scientific oversight (Spec 16.3).</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                            placeholder="Filter protocols..."
                            className="bg-slate-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[11px] text-slate-300 focus:border-indigo-500/50 outline-none w-64 transition-all uppercase font-black"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {studies.map((s, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/20 transition-all group relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-8 text-indigo-500/5 group-hover:text-indigo-500/10 transition-colors">
                            <Microscope size={120} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${
                                    s.status === 'RECRUITING' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                    {s.status}
                                </span>
                                <div className="text-[11px] font-black text-slate-600 uppercase tracking-widest italic">{s.phase}</div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic tracking-tight mb-2 leading-tight max-w-[80%]">{s.title}</h3>
                            <p className="text-sm text-slate-500 font-medium italic mb-8 flex items-center gap-2">
                                <Activity size={14} className="text-indigo-500/50" /> {s.condition} · Investigator Chen
                            </p>
                            
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Protocol Target</p>
                                    <p className="text-lg font-black text-white italic">{s.target}</p>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Enrolled</p>
                                    <p className="text-lg font-black text-indigo-400 italic">{s.enrolled}</p>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Completion</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-lg font-black text-emerald-400 italic">{Math.round((s.enrolled/s.target)*100)}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-6 border-t border-white/5 flex gap-3">
                            <Link 
                                href={`/pi/status?id=${s.id}`} 
                                className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl text-center transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-indigo-500/30"
                            >
                                <Settings size={14} className="text-slate-600" /> Control State
                            </Link>
                            <Link 
                                href={`/pi/participants?study=${s.id}`} 
                                className="flex-1 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-[11px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
                            >
                                <Users size={14} /> Subject Oversight
                            </Link>
                        </div>
                    </div>
                ))}

                <button className="bg-slate-900/20 border border-dashed border-white/10 p-8 rounded-[2.5rem] hover:bg-indigo-500/[0.02] hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center text-center group min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="text-slate-600 group-hover:text-indigo-400" size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-400 uppercase italic tracking-tight group-hover:text-white transition-colors">Request Protocol Assignment</h3>
                    <p className="text-[11px] text-slate-600 font-bold uppercase tracking-widest mt-2 max-w-[200px]">Link new studies to your Investigator profile</p>
                </button>
            </div>

            <div className="p-8 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <ShieldCheck className="text-indigo-400" size={32} />
                </div>
                <div className="flex-1">
                    <h4 className="text-[13px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">GxP Portfolio Compliance</h4>
                    <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                        Only protocols where you are designated as a <strong className="text-indigo-300 uppercase italic font-black">Principal or Co-Investigator</strong> are displayed here. To update study status or review clinical data for unassigned studies, contact the Super Admin (Spec 16.3).
                    </p>
                </div>
            </div>
        </div>
    );
}
