"use client";

import { 
    Package, Search, FlaskConical, Filter, Download, 
    ArrowUpRight, Microscope, Database, ShieldCheck, 
    AlertCircle, CheckCircle2, Truck, Box
} from "lucide-react";

const mockSampleLogs = [
    { id: "SMP-9021", sid: "P-821-X9", type: "Gut Microbiome", status: "RECEIVED_AT_SITE", date: "2026-03-05", result: "Normal" },
    { id: "SMP-8812", sid: "P-452-Y1", type: "Blood Panel", status: "IN_TRANSIT", date: "2026-03-08", result: "Pending" },
    { id: "SMP-7712", sid: "P-109-Z4", type: "DNA Swab", status: "VERIFIED", date: "2026-03-01", result: "Normal" },
    { id: "SMP-6623", sid: "P-332-L9", type: "Urine Assay", status: "MISSING", date: "2026-02-28", result: "N/A" },
];

export default function SponsorLabsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header (Spec 15.1) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <Package className="text-amber-500" size={32} /> Lab &amp; Sample Intelligence
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">De-identified oversight of bio-custody and biomarker datasets (Spec 15.4).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-amber-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Download size={16} /> Export Dataset
                    </button>
                </div>
            </div>

            {/* KPI Cards (Spec 15.3 Graphs/KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Samples", value: "248", trend: "+12 this week", icon: Box, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "In Analysis", value: "18", trend: "Lab Partner A", icon: Microscope, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    { label: "Verifed Assays", value: "216", trend: "Data Integrity OK", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Alerts / Missing", value: "2", trend: "High Priority", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
                ].map((s, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] relative group overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${s.bg} rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 opacity-50`} />
                        <div className={`p-3 rounded-2xl ${s.bg} ${s.color} w-fit mb-4 relative z-10`}>
                            <s.icon size={20} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white italic tracking-tighter">{s.value}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">{s.label}</p>
                            <p className="text-[10px] font-bold text-slate-600 mt-3 flex items-center gap-1">{s.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Privacy Compliance Banner (Spec 15.4) */}
            <div className="p-6 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-[2rem] flex items-center gap-4">
                <ShieldCheck className="text-indigo-400" size={24} />
                <div className="flex-1">
                    <p className="text-[12px] text-slate-400 font-medium italic">
                        <strong className="text-indigo-300 uppercase italic font-black">SPONSOR DATA SHIELD:</strong> All PII (Names, PII PDFs) has been scrubbed from this view. You are accessing coded biomass tracking data linked only to de-identified Subject IDs.
                    </p>
                </div>
            </div>

            {/* Sample Activity Registry (Spec 15.4 Lab Summaries) */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Chain of Custody Stream</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input placeholder="Search CODED SID..." className="bg-slate-950 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[11px] text-slate-400 focus:border-amber-500/30 outline-none w-48 transition-all" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black italic">
                                <th className="py-5 px-8 italic">Sample Registry ID</th>
                                <th className="py-5 px-8 italic text-amber-500">De-ID SID (15.4)</th>
                                <th className="py-5 px-8 italic">Specimen Type</th>
                                <th className="py-5 px-8 italic">Logistics State</th>
                                <th className="py-5 px-8 italic">Date Ref</th>
                                <th className="py-5 px-8 italic">Data Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300 font-sans">
                            {mockSampleLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.01] transition-all">
                                    <td className="py-6 px-8 font-mono text-[11px] text-slate-500 uppercase">{log.id}</td>
                                    <td className="py-6 px-8 font-black text-white italic uppercase tracking-tight">{log.sid}</td>
                                    <td className="py-6 px-8 text-slate-400 font-bold uppercase text-[11px]">{log.type}</td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2">
                                            {log.status === 'MISSING' ? <AlertCircle size={14} className="text-red-500" /> : <Truck size={14} className="text-slate-600" />}
                                            <span className={`text-[10px] font-black uppercase tracking-widest border px-2 py-0.5 rounded ${
                                                log.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                log.status === 'MISSING' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-slate-800 text-slate-500 border-white/5'
                                            }`}>
                                                {log.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-slate-500 font-bold text-[11px] uppercase">{log.date}</td>
                                    <td className="py-6 px-8">
                                        <span className={`font-black italic uppercase ${log.result === 'Normal' ? 'text-slate-500' : log.result === 'Pending' ? 'text-amber-500' : 'text-red-400'}`}>
                                            {log.result}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
