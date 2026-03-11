"use client";

import { 
    Plus, ClipboardList, Search, FileText, 
    ArrowUpRight, Edit3, Trash2, Download,
    Settings, Eye, Share2, Layers, CheckCircle2,
    Database, Microscope, HeartPulse
} from "lucide-react";
import { useState } from "react";

export default function PIFormsBuilder() {
    const [templates] = useState([
        { id: "FRM-001", name: "In-Clinic Baseline Assessment", type: "Clinical", version: "v2.1", status: "Active" },
        { id: "FRM-002", name: "Daily Gut Adherence Log", type: "Home Diary", version: "v1.0", status: "Published" },
        { id: "FRM-003", name: "End-of-Study Feedback", type: "Survey", version: "v0.9", status: "Draft" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <ClipboardList className="text-indigo-400" size={32} /> Protocol Instrument Engine
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Design clinical forms, medical history surveys, and branching logic (Spec 16.4).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-indigo-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Layers size={16} /> Asset Library
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
                        <Plus size={16} /> Create PI Instrument
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Design Medical History", icon: HeartPulse, color: "text-red-400", bg: "bg-red-500/10" },
                    { label: "Protocol Questionnaire", icon: Microscope, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    { label: "Branching Logic Map", icon: Share2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                ].map((act, i) => (
                    <button key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                        <div className={`p-3 rounded-2xl ${act.bg} ${act.color} group-hover:scale-110 transition-transform`}>
                            <act.icon size={20} />
                        </div>
                        <span className="text-[13px] font-black text-white uppercase italic tracking-tight">{act.label}</span>
                    </button>
                ))}
            </div>

            {/* Template Registry */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Research Template Vault</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input placeholder="Filter templates..." className="bg-slate-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[11px] text-slate-400 focus:border-indigo-500/30 outline-none w-48 transition-all" />
                    </div>
                </div>
                
                <div className="divide-y divide-white/5">
                    {templates.map((tmpl) => (
                        <div key={tmpl.id} className="p-8 hover:bg-indigo-500/[0.01] transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                    <FileText size={20} className="text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-black text-white italic uppercase tracking-tight group-hover:text-indigo-400 transition-colors leading-none mb-2">{tmpl.name}</h4>
                                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-500 italic">
                                        <span>ID: {tmpl.id}</span>
                                        <span>•</span>
                                        <span className="text-indigo-400/70">{tmpl.type}</span>
                                        <span>•</span>
                                        <span className="text-slate-600">Ver: {tmpl.version}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                    tmpl.status === 'Active' || tmpl.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'
                                }`}>
                                    {tmpl.status}
                                </span>
                                <div className="flex items-center gap-2 ml-4">
                                    <button className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl" title="Edit Structure"><Edit3 size={16} /></button>
                                    <button className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl" title="Preview"><Eye size={16} /></button>
                                    <button className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl" title="Export PDF (Spec 16.4)"><Download size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scientific Logic Note */}
            <div className="p-8 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <Database className="text-indigo-400" size={32} />
                </div>
                <div className="flex-1">
                    <h4 className="text-[13px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Validation Logic Engine</h4>
                    <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                        All instruments designed here support <strong className="text-indigo-300 uppercase italic font-black">Conditional Branching</strong> and real-time medical validation. Forms created by Investigators are automatically shared with Clinical Coordinators for protocol deployment (Spec 16.3).
                    </p>
                </div>
            </div>
        </div>
    );
}
