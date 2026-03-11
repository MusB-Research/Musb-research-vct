"use client";

import { 
    Shield, ShieldAlert, AlertCircle, CheckCircle2, 
    Filter, Download, ArrowUpRight, ShieldCheck,
    MessageSquare, Activity, Pill
} from "lucide-react";
import { adverseEvents } from "../data";

export default function SponsorSafetyPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Safety & PharmacoVigilance</h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitoring adverse event signals and protocol deviations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2 font-sans">
                        <Download size={14} /> Export Safety Set
                    </button>
                    <select className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white outline-none focus:border-amber-500/40 appearance-none">
                        <option>All Adverse Events</option>
                        <option>Serious AE (SAE) Only</option>
                        <option>Under Review</option>
                    </select>
                </div>
            </div>

            {/* Safety Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2" />
                    <h3 className="text-4xl font-black text-white italic tracking-tighter mb-1">0</h3>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Serious Adverse Events (SAE)</p>
                    <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-emerald-500">
                        <ShieldCheck size={14} /> Critical Baseline Maintained
                    </div>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2" />
                    <h3 className="text-4xl font-black text-white italic tracking-tighter mb-1">3</h3>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Adverse Events (AE)</p>
                    <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-amber-500">
                        <Activity size={14} /> Monitoring active signals
                    </div>
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2" />
                    <h3 className="text-4xl font-black text-white italic tracking-tighter mb-1">100%</h3>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Review Compliance</p>
                    <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-emerald-500">
                        <CheckCircle2 size={14} /> All events adjudicated
                    </div>
                </div>
            </div>

            {/* AE Log Table */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Anonymized AE Log</h2>
                    <Shield size={16} className="text-amber-500/50" />
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event ID</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Participant</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Severity</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Description</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Onset Date</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {adverseEvents.map((ae, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.01] transition-all group">
                                <td className="px-8 py-6 text-[13px] font-black text-white italic">{ae.id}</td>
                                <td className="px-8 py-6 text-[13px] font-bold text-slate-400">{ae.participant}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                        ae.severity === 'SEVERE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        ae.severity === 'MODERATE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        'bg-slate-800 text-slate-400 border-white/5'
                                    }`}>
                                        {ae.severity}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-[13px] font-medium text-slate-400 max-w-xs truncate">{ae.description}</td>
                                <td className="px-8 py-6 text-[13px] font-bold text-slate-500">{ae.date}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-400">
                                        <CheckCircle2 size={12} /> {ae.status}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="px-4 py-2 bg-slate-950 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-500 hover:border-amber-500/30 transition-all flex items-center gap-2">
                                        Details <ArrowUpRight size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group hover:border-amber-500/20 transition-all">
                    <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl group-hover:scale-110 transition-transform">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">Instant Safety Escalation</h4>
                        <p className="text-[13px] text-slate-500 font-medium">Direct line to Study Medical Monitor for urgent safety concerns.</p>
                        <button className="mt-4 text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">Initiate Contact <ArrowUpRight size={14} /></button>
                    </div>
                </div>
                <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group hover:border-amber-500/20 transition-all">
                    <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform">
                        <MessageSquare size={32} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">DSMB Collaboration</h4>
                        <p className="text-[13px] text-slate-500 font-medium">Access shared workspace for the Data Safety Monitoring Board.</p>
                        <button className="mt-4 text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">Enter Workspace <ArrowUpRight size={14} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
