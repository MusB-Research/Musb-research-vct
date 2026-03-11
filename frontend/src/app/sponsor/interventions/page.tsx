"use client";

import { 
    ClipboardList, Filter, Download, Plus, ArrowUpRight, 
    ShieldCheck, Database, Beaker, Layers, Calendar,
    Activity, Target, CheckCircle2
} from "lucide-react";

const armSummary = [
    { arm: "Arm A (NAD+ Treatment)", subjects: 45, dosage: "500mg Daily", completion: "88%", ae: "2 (Mild)" },
    { arm: "Arm B (Placebo Control)", subjects: 42, dosage: "N/A (Normal Saline)", completion: "92%", ae: "1 (Mild)" },
];

export default function SponsorInterventionsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header (Spec 15.1) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <ClipboardList className="text-amber-500" size={32} /> Intervention &amp; Arm View
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Protocol-compliant arm oversight and dispensing de-identified summaries (Spec 15.4).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-amber-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Download size={16} /> Export Protocol Data
                    </button>
                    <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-amber-600/20 transition-all flex items-center gap-2">
                        <Layers size={16} /> Arm-Wise Analysis
                    </button>
                </div>
            </div>

            {/* Arm Metrics (Spec 15.4 Arm summaries) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {armSummary.map((arm, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-1">{arm.arm}</h3>
                                <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest">{arm.dosage}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl text-slate-500 group-hover:text-amber-500 transition-colors">
                                <Beaker size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Coded Sample Count</p>
                                <p className="text-2xl font-black text-white italic">{arm.subjects}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Adherence Rate</p>
                                <p className="text-2xl font-black text-emerald-400 italic">{arm.completion}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Flagged Events</p>
                                <p className="text-2xl font-black text-red-500/80 italic">{arm.ae}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dispensing Feed (Analytical oversight Spec 15.4) */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity size={16} className="text-cyan-500" />
                        <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Anonymized Dispensing Manifest</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-950 rounded-xl border border-white/5">
                        <Database size={12} className="text-slate-600" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EDC Linked</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black italic">
                                <th className="py-5 px-8 italic text-amber-500">Subject De-ID</th>
                                <th className="py-5 px-8 italic">Arm Assignment</th>
                                <th className="py-5 px-8 italic">Cycle #</th>
                                <th className="py-5 px-8 italic">Dispense Date</th>
                                <th className="py-5 px-8 italic">Verified By</th>
                                <th className="py-5 px-8 text-right italic">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300 font-sans">
                            {[
                                { sid: "P-821-X9", arm: "Arm A", cycle: "01 - Baseline", date: "2026-03-01", verify: "CC-901", status: "VERIFIED" },
                                { sid: "P-452-Y1", arm: "Arm B", cycle: "01 - Baseline", date: "2026-03-03", verify: "CC-772", status: "VERIFIED" },
                                { sid: "P-109-Z4", arm: "Arm A", cycle: "02 - Interim", date: "2026-03-08", verify: "CC-901", status: "DISPENSED" },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="py-6 px-8 font-black text-white italic uppercase tracking-tight">{row.sid}</td>
                                    <td className="py-6 px-8 text-slate-400 font-bold uppercase text-[11px]">{row.arm}</td>
                                    <td className="py-6 px-8 text-slate-500 font-bold uppercase text-[11px]">{row.cycle}</td>
                                    <td className="py-6 px-8 text-slate-600 font-bold uppercase text-[11px] tracking-tight">{row.date}</td>
                                    <td className="py-6 px-8 font-mono text-[10px] text-slate-600 uppercase">{row.verify}</td>
                                    <td className="py-6 px-8 text-right">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                            row.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                                        }`}>
                                            {row.status}
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
