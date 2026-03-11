"use client";

import { useState } from "react";
import Link from "next/link";
import {
    FileSignature,
    Plus,
    History,
    Eye,
    Edit3,
    MoreVertical,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    FileText,
    Globe,
    ShieldCheck,
    Download,
    AlertTriangle
} from "lucide-react";

export default function AdminConsentManagementPage() {
    const [activeTab, setActiveTab] = useState("Templates");
    const [templates, setTemplates] = useState([
        { id: 'C-001', name: 'Master Informed Consent v2.4', study: 'HeartWatch 2026', version: '2.4', updated: '2 days ago', status: 'ACTIVE' },
        { id: 'C-002', name: 'GDPR Data Privacy Notice', study: 'Global Studies', version: '1.2', updated: '1 week ago', status: 'ACTIVE' },
        { id: 'C-003', name: 'Pediatric Assent Form', study: 'Microbiome-Kids', version: '0.9', updated: 'New', status: 'DRAFT' },
    ]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight flex items-center gap-3">
                        <FileSignature className="text-indigo-500" size={32} /> Consent Management
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Author and version control digital consent forms and privacy notices.</p>
                </div>
                <Link href="/admin/consent/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[13px] rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                    <Plus size={16} /> New Template
                </Link>
            </div>

            {/* Tabs (Spec 9.3) */}
            <div className="flex gap-8 border-b border-white/5 pb-4">
                {["Templates", "Signed Consents", "Site Logs"].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`text-[11px] font-black uppercase tracking-[0.2em] italic transition-all relative py-2 ${activeTab === tab ? 'text-indigo-400 underline decoration-indigo-500 underline-offset-8' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-[2rem] border border-white/5 bg-slate-900/40">
                        <div className="text-[13px] font-black text-slate-500 uppercase tracking-widest italic mb-4">Registry Overview</div>
                        <div className="space-y-6 mt-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-[13px] font-bold text-slate-400">Active Forms</span>
                                <span className="text-2xl font-black text-white italic">12</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-[13px] font-bold text-slate-400">Total Signatures</span>
                                <span className="text-2xl font-black text-indigo-400 italic">1,482</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[13px] font-bold text-slate-400">Awaiting Versioning</span>
                                <span className="text-2xl font-black text-slate-600 italic">03</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-[2rem] border border-white/5 bg-indigo-500/[0.03]">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-4 flex items-center gap-2">
                            <Globe size={14} className="text-indigo-400" /> Site Reach
                        </h3>
                        <p className="text-[13px] text-slate-500 leading-relaxed mb-4 italic font-medium">Monitoring 24 global sites for IRB compliance and re-consent events.</p>
                        <div className="flex -space-x-1">
                            {['US', 'FR', 'DE', 'ES', 'JP'].map(flag => (
                                <div key={flag} className="w-8 h-6 bg-slate-800 border border-white/10 rounded overflow-hidden flex items-center justify-center text-[13px] font-black text-slate-500">
                                    {flag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6 transition-all duration-500">
                    {activeTab === "Templates" ? (
                        <div className="glass rounded-[2rem] border border-white/5 overflow-hidden bg-slate-900/40">
                            <div className="p-6 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                    <input type="text" placeholder="Find templates..." className="bg-transparent border-none text-[13px] text-white placeholder:text-slate-600 focus:ring-0 w-64 uppercase tracking-widest font-black italic" />
                                </div>
                                <button className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white flex items-center gap-2">
                                    <Filter size={12} /> Filter by Study
                                </button>
                            </div>

                            <div className="divide-y divide-white/5">
                                {templates.map((template) => (
                                    <div key={template.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-white font-black italic uppercase tracking-tight">{template.name}</h4>
                                                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-black text-slate-400 border border-white/5 uppercase italic">v{template.version}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-black uppercase tracking-widest italic">
                                                        <Globe size={10} /> {template.study}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-black uppercase tracking-widest italic">
                                                        <Clock size={10} /> {template.updated}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black italic tracking-widest ${template.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                                                {template.status}
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="p-2 text-slate-600 hover:text-white transition-all"><Eye size={16} /></button>
                                                <button className="p-2 text-slate-600 hover:text-cyan-400 transition-all"><Edit3 size={16} /></button>
                                                <button className="p-2 text-slate-600 hover:text-white transition-all"><History size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {[
                                { name: "Sarah Miller", study: "NAD+ Longevity", type: "eConsent", date: "Today, 14:20", hash: "sha256:4f92...a1" },
                                { name: "Marcus Chen", study: "NAD+ Longevity", type: "eConsent", date: "Yesterday, 09:15", hash: "sha256:bk82...09" },
                                { name: "Julia Roberts", study: "Sleep-Optim V2", type: "Paper Sync", date: "2 days ago", hash: "manual_upload" },
                                { name: "David Beck", study: "HeartWatch 2026", type: "eConsent", date: "3 days ago", hash: "sha256:xc92...ff" },
                            ].map((signed, i) => (
                                <div key={i} className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/30 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                            <FileSignature size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-white font-black uppercase tracking-tight italic">{signed.name}</h4>
                                                <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-md font-black uppercase tracking-widest">{signed.type}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">{signed.study} • Signed {signed.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden md:block">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Audit Hash</p>
                                            <p className="text-[10px] font-mono text-indigo-400/60 leading-none">{signed.hash}</p>
                                        </div>
                                        <button className="px-4 py-2 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2">
                                            <Download size={12} /> PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
