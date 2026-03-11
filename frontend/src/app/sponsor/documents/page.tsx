"use client";

import { 
    FileText, FilePlus, Search, Filter, Download, 
    ChevronRight, Globe, Lock, Clock, Trash2,
    Shield
} from "lucide-react";
import { documents } from "../data";

export default function SponsorDocumentsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Document Repository</h1>
                    <p className="text-slate-500 mt-2 font-medium">Centralized vault for protocols, regulatory filings, and IRB docs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2">
                        <FilePlus size={16} /> Submit Amendment
                    </button>
                </div>
            </div>

            {/* Folder Grid (Mock) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { name: "Protocols", count: 3, icon: FileText, color: "text-amber-500" },
                    { name: "Regulatory", count: 12, icon: Globe, color: "text-indigo-500" },
                    { name: "IRB Approvals", count: 4, icon: Shield, color: "text-emerald-500" },
                    { name: "Safety Reports", count: 8, icon: Lock, color: "text-red-500" },
                ].map((folder, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.02] transition-all group cursor-pointer">
                        <div className={`p-3 rounded-2xl bg-white/5 ${folder.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                            <folder.icon size={20} />
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{folder.name}</h3>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">{folder.count} Documents</p>
                    </div>
                ))}
            </div>

            {/* Document List */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search document vault..."
                            className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-400 focus:border-amber-500/30 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="divide-y divide-white/[0.03]">
                    {documents.map((doc) => (
                        <div key={doc.id} className="p-8 hover:bg-white/[0.01] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:border-amber-500/30 transition-all shadow-xl">
                                    <FileText size={20} className="text-slate-500" />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-black text-white italic uppercase tracking-tight group-hover:text-amber-400 transition-colors">{doc.name}</h4>
                                    <div className="flex items-center gap-4 mt-1 text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-amber-500/70">{doc.type}</span>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-slate-500 flex items-center gap-1.5"><Clock size={12} /> {doc.date}</span>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-slate-500">{doc.size}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 bg-slate-950 border border-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                                    <Download size={18} />
                                </button>
                                <button className="px-6 py-3 bg-slate-900 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:border-amber-500/30 transition-all flex items-center gap-2">
                                    View Online <ChevronRight size={14} className="text-slate-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
