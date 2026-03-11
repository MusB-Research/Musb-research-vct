"use client";

import { 
    FileSignature, ShieldCheck, CheckCircle2, XCircle, 
    Search, Filter, Download, Eye, ExternalLink,
    AlertCircle, FileText, Calendar, Clock,
    UserCircle, History
} from "lucide-react";
import { useState } from "react";

export default function PIConsentOversight() {
    const [filter, setFilter] = useState("Pending Review");

    const consents = [
        { id: "CNS-901", subject: "Sarah Miller (P-4502)", version: "v4.0 (NAD+)", method: "eConsent", status: "Verified", date: "2026-03-10", investigator: "PI Chen" },
        { id: "CNS-902", subject: "James Wilson (P-7721)", version: "v4.0 (NAD+)", method: "Paper Scan", status: "Pending Review", date: "2026-03-11", investigator: "N/A" },
        { id: "CNS-903", subject: "Emma Davis (P-5421)", version: "v3.2 (NAD+)", method: "eConsent", status: "Re-consent Required", date: "2026-02-28", investigator: "PI Chen" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header (Spec 16.2/19) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <FileSignature className="text-indigo-400" size={32} /> Consent Governance Hub
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Medical oversight of informed consent and re-consent logic (Spec 16.4).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-indigo-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 font-sans font-black">
                        <Download size={16} /> Export Regulatory Pack
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2 font-sans font-black">
                        <CheckCircle2 size={16} /> Batch Verify
                    </button>
                </div>
            </div>

            {/* Consent State Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Consented", value: "142", icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    { label: "Pending PI Review", value: "8", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Compliance Alerts", value: "2", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
                ].map((s, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className={`p-4 rounded-[1.5rem] ${s.bg} ${s.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                            <s.icon size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter">{s.value}</h3>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Consent Registry (Spec 16.4 / 19) */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="flex gap-4">
                        {["All Logs", "Pending Review", "Re-consents"].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setFilter(t)}
                                className={`text-[11px] font-black uppercase tracking-widest transition-all ${filter === t ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : 'text-slate-500 hover:text-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input placeholder="Search Subjects..." className="bg-slate-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[11px] text-slate-400 focus:border-indigo-500/30 outline-none w-48 transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black italic">
                                <th className="py-5 px-8 italic">Consent ID</th>
                                <th className="py-5 px-8 italic">Subject Context</th>
                                <th className="py-5 px-8 italic">Protocol Version</th>
                                <th className="py-5 px-8 italic">Method</th>
                                <th className="py-5 px-8 italic">Validation State</th>
                                <th className="py-5 px-8 text-right italic">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {consents.map((c) => (
                                <tr key={c.id} className="hover:bg-indigo-500/[0.01] transition-all group">
                                    <td className="py-6 px-8">
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">{c.id}</p>
                                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{c.date}</p>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <UserCircle size={16} />
                                            </div>
                                            <p className="text-[13px] font-black text-white italic uppercase tracking-tight">{c.subject}</p>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-[11px] font-bold text-slate-400">{c.version}</td>
                                    <td className="py-6 px-8">
                                        <span className="text-[10px] font-black uppercase text-slate-500 italic flex items-center gap-1.5">
                                            <ExternalLink size={12} /> {c.method}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                c.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                c.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl group/btn">
                                            <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* GxP Re-consent Logic (Spec 16.4) */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/5 to-amber-500/5 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="absolute top-0 right-0 p-8 text-amber-500/10">
                    <History size={120} />
                 </div>
                 <div className="relative z-10 max-w-xl">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4 flex items-center gap-3">
                        Re-consent Trigger Engine <RefreshCw className="text-amber-500" size={24} />
                    </h3>
                    <p className="text-slate-500 text-[13px] font-medium italic mb-2 leading-relaxed">
                        Detects protocol versioning mismatches and triggers automatic re-consent signatures across the participant portal. Investigators must verify medical validity of signatures to unlock treatment arms.
                    </p>
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest italic">
                        Automatic Signature Detected for v4.0 Update (Mar 01)
                    </p>
                 </div>
                 <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-500 shrink-0">
                    Review Version Shift
                 </button>
            </div>
        </div>
    );
}

const RefreshCw = ({ className, size }: { className?: string, size: number }) => (
    <History size={size} className={className} />
);
