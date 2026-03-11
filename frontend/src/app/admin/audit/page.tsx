"use client";

import { 
    History, Search, Filter, Download, 
    User, Clock, Database, ShieldCheck,
    ArrowUpRight, Activity, HardDrive, Info,
    Eye, AlertCircle, RefreshCw
} from "lucide-react";
import { useState } from "react";

const auditLogs = [
    { id: "LOG-9021", user: "Alexander Chen (PI)", action: "Status Change", entity: "Study: NAD-001", oldVal: "RECRUITING", newVal: "PAUSED", date: "2026-03-11 14:22:10", ip: "192.168.1.45" },
    { id: "LOG-9018", user: "Sarah Miller (Sponsor)", action: "Exported Dataset", entity: "Study: NAD-001", oldVal: "N/A", newVal: "Full De-ID Export", date: "2026-03-11 12:05:01", ip: "172.16.0.12" },
    { id: "LOG-8892", user: "Brijesh (Coordinator)", action: "Participant Edit", entity: "Subject: P-4502", oldVal: "Weight: 72kg", newVal: "Weight: 74kg", date: "2026-03-11 09:15:33", ip: "192.168.1.12" },
    { id: "LOG-8845", user: "System", action: "ID Generation", entity: "Subject: P-5421", oldVal: "null", newVal: "P-5421", date: "2026-03-10 18:00:12", ip: "SERVER" },
];

export default function GlobalAuditLog() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header (Spec 18.1) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <History className="text-amber-500" size={32} /> Centralized Audit Trail
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Immutable oversight of every protocol interaction (Spec 18.1).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-amber-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Download size={16} /> Export Governance Pack
                    </button>
                    <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-amber-600/20 transition-all flex items-center gap-2">
                        <ShieldCheck size={16} /> Verify Integrity
                    </button>
                </div>
            </div>

            {/* Integrity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Logs", value: "12,842", icon: Database, color: "text-indigo-400" },
                    { label: "Storage Used", value: "2.4 GB", icon: HardDrive, color: "text-cyan-400" },
                    { label: "Security Events", value: "0", icon: ShieldCheck, color: "text-emerald-400" },
                    { label: "Active Sessions", value: "8", icon: Activity, color: "text-amber-400" },
                ].map((s, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-white/5 ${s.color}`}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tighter leading-none mb-1">{s.value}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Audit Logic Feed */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Immutable Activity Stream</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input 
                            placeholder="Filter by User or Action..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[11px] text-slate-400 focus:border-amber-500/30 outline-none w-56 transition-all" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black italic">
                                <th className="py-5 px-8 italic">Who (User)</th>
                                <th className="py-5 px-8 italic">Action (What)</th>
                                <th className="py-5 px-8 italic">Target Entity</th>
                                <th className="py-5 px-8 italic">Logic Shift (Old → New)</th>
                                <th className="py-5 px-8 italic">Timestamp</th>
                                <th className="py-5 px-8 text-right italic">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-black text-white italic tracking-tight">{log.user}</p>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{log.ip}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                            log.action === 'Status Change' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            log.action === 'Exported Dataset' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                            'bg-slate-800 text-slate-500 border-white/5'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">{log.entity}</td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase italic tracking-tight">
                                            <span className="text-slate-600 line-through decoration-slate-800">{log.oldVal}</span>
                                            <RefreshCw size={10} className="text-slate-800" />
                                            <span className="text-amber-500">{log.newVal}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} /> {log.date}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button className="p-2 bg-slate-950 border border-white/5 rounded-xl text-slate-600 hover:text-white transition-all shadow-xl group/btn">
                                            <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Compliance Banner */}
            <div className="p-8 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/10 flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <ShieldCheck className="text-indigo-400" size={32} />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-[13px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">GxP Immutable Logging</h4>
                    <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                        Every surgical, operational, and administrative action is logged to this <strong className="text-indigo-300 uppercase italic font-black">Audit Vault</strong>. Entries are cryptographic signatures and cannot be modified or deleted by any user (Spec 18.1).
                    </p>
                 </div>
            </div>
        </div>
    );
}
