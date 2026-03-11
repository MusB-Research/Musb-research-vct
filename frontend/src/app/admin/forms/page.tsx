"use client";

import { 
    Plus, ClipboardList, Search, FileText, 
    ArrowUpRight, Edit3, Trash2, Download,
    Settings, Eye, Share2, Layers, CheckCircle2,
    Database, Microscope, HeartPulse, GitBranch,
    Calendar, AlertCircle, Info, Trash
} from "lucide-react";
import { useState } from "react";

export default function PIFormsBuilder() {
    const [templates] = useState([
        { id: "FRM-001", name: "NAD+ Treatment Medical History", type: "Clinical", version: "v2.1", status: "Active" },
        { id: "FRM-002", name: "Daily Longevity Diary", type: "Home Diary", version: "v1.0", status: "Published" },
    ]);

    const [logicBlocks, setLogicBlocks] = useState([
        { id: 1, question: "Do you have diabetes?", type: "Boolean", subQuestions: [
            { label: "When were you diagnosed?", type: "Date" },
            { label: "Which medication are you taking?", type: "Text" },
            { label: "What dose?", type: "Text" },
            { label: "Frequency?", type: "Dropdown", options: ["Morning", "Afternoon", "Evening", "With Meal"] }
        ]},
        { id: 2, question: "Have you undergone surgery?", type: "Boolean", subQuestions: [
            { label: "Please provide details and dates", type: "LongText" }
        ]},
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header (Spec 17.2) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <ClipboardList className="text-purple-400" size={32} /> No-Code Instrument Designer
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Protocol-specific logic & branching questionnaires (Spec 17.2, 17.3).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-purple-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Download size={16} /> Export PDF (IRB Protocol)
                    </button>
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 transition-all flex items-center gap-2">
                        <Plus size={16} /> Deploy to Site
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Logic Designer (Spec 17.3) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <GitBranch className="text-purple-400" size={20} />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Dynamic Branching Workspace</h3>
                            </div>
                            <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                <Plus size={14} /> Add New Root Logic
                            </button>
                        </div>

                        <div className="space-y-6">
                            {logicBlocks.map((block) => (
                                <div key={block.id} className="relative pl-12">
                                    {/* Connectivity Lines */}
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
                                    <div className="absolute left-4 top-10 w-8 h-px bg-white/5" />
                                    
                                    <div className="bg-slate-950/60 border border-white/10 p-6 rounded-[2rem] relative group">
                                        <div className="absolute -left-10 top-6 w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-purple-400 shadow-xl group-hover:scale-110 transition-transform">
                                            <Info size={14} />
                                        </div>
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 leading-none">Primary Logical Trigger</p>
                                                <input value={block.question} className="bg-transparent border-none outline-none text-[15px] font-black text-white italic tracking-tight w-full hover:bg-white/5 rounded-lg p-1 transition-all" />
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Edit3 size={14} /></button>
                                                <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash size={14} /></button>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em] italic mb-2">IF ANSWER = "YES" → SHOW CHILD FIELDS</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {block.subQuestions.map((sub, idx) => (
                                                    <div key={idx} className="p-4 bg-slate-900/60 rounded-xl border border-white/5 flex flex-col gap-2 relative group/sub">
                                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">{sub.type} Field</span>
                                                        <p className="text-[12px] font-bold text-slate-300 italic">{sub.label}</p>
                                                        <button className="absolute top-2 right-2 opacity-0 group-hover/sub:opacity-100 transition-opacity p-1 text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                <button className="p-4 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 hover:text-purple-400 hover:border-purple-500/20 transition-all group">
                                                    <Plus size={16} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logo & Compliance Rule (Spec 17.2) */}
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center">
                                <img src="/musb research.png" alt="MUSB" className="w-full h-full object-contain" />
                             </div>
                             <div>
                                <h4 className="text-[12px] font-black text-white uppercase tracking-widest italic">Global Branding Rule</h4>
                                <p className="text-[11px] text-slate-500 font-medium italic">Standard MUSB Health header applied to all outputs (Spec 17.2).</p>
                             </div>
                         </div>
                         <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                             <CheckCircle2 size={16} className="text-emerald-500" />
                             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Branding Consistent</span>
                         </div>
                    </div>
                </div>

                {/* Instrument Library & Assets */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic mb-8">Reusable Logic Snippets</h3>
                        <div className="space-y-4">
                             {[
                                { label: "Standard Vital Schema", icon: HeartPulse, color: "text-red-400" },
                                { label: "Medication Adherence (GCP)", icon: Microscope, color: "text-indigo-400" },
                                { label: "Demographic Opt-In", icon: Share2, color: "text-cyan-400" },
                             ].map((asset, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all cursor-move">
                                    <div className="flex items-center gap-3">
                                        <asset.icon size={16} className={asset.color} />
                                        <span className="text-[11px] font-black text-white uppercase italic tracking-tight">{asset.label}</span>
                                    </div>
                                    <Layers size={14} className="text-slate-600" />
                                </div>
                             ))}
                        </div>
                        <p className="mt-8 text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest italic">DRAG SNIPPETS INTO DESIGNER</p>
                    </div>

                    <div className="bg-purple-600/10 border border-purple-600/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                         <FileText className="text-purple-400 mb-4" size={32} />
                         <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-2 italic">IRB Ready (Spec 17.2)</h4>
                         <p className="text-[11px] text-slate-400 font-medium italic mb-6 leading-relaxed">
                            Generate protocol-locked PDFs for institutional review. Contains all conditional prompts and branching logic mapping for standard clinical oversight.
                         </p>
                         <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all">Download Documentation</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
