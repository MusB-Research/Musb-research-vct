"use client";

import { useState } from "react";
import { 
    Binary, 
    Users, 
    FlaskConical, 
    ArrowUpRight, 
    AlertCircle, 
    CheckCircle2, 
    Search,
    Filter,
    Package,
    Clock,
    History,
    MoreVertical,
    Activity,
    Plus,
    Pill
} from "lucide-react";

interface InterventionRecord {
    id: string;
    participantId: string;
    participantName: string;
    study: string;
    arm: string;
    regimen: string;
    dispensedDate: string;
    nextRefill: string;
    status: "ON_TRACK" | "LOW_SUPPLY" | "MISSED_DOSE";
    bottleId: string;
}

const MOCK_RECORDS: InterventionRecord[] = [
    { id: "INT-001", participantId: "P-4502", participantName: "Sarah Miller", study: "NAD+ Longevity", arm: "Group A (High Dose)", regimen: "500mg Daily", dispensedDate: "2026-03-01", nextRefill: "2026-04-01", status: "ON_TRACK", bottleId: "B-9902" },
    { id: "INT-002", participantId: "P-4508", participantName: "Marcus Chen", study: "NAD+ Longevity", arm: "Group B (Placebo)", regimen: "1 tab Daily", dispensedDate: "2026-02-15", nextRefill: "2026-03-15", status: "LOW_SUPPLY", bottleId: "B-9122" },
    { id: "INT-003", participantId: "P-4512", participantName: "Julia Roberts", study: "Sleep-Optim V2", arm: "Arm C", regimen: "25mg Evening", dispensedDate: "2026-03-05", nextRefill: "2026-04-05", status: "ON_TRACK", bottleId: "B-8831" },
];

export default function InterventionsPage() {
    const [records] = useState<InterventionRecord[]>(MOCK_RECORDS);

    return (
        <div className="space-y-8 pb-32">
            {/* Header (Spec 10.1) */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <Binary className="text-cyan-500" size={32} /> Intervention & Arms
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Managing subject randomization arms and clinical drug/supplement regimens.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 font-black uppercase tracking-widest text-[11px] rounded-xl transition-all flex items-center gap-2">
                        <History size={16} /> Dispensing Logs
                    </button>
                    <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2 font-mono">
                        <Plus size={16} /> Randomized Assignment
                    </button>
                </div>
            </div>

            {/* Supply Logic Widgets (Spec 10.2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package size={80} className="text-cyan-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Low Supply Alerts</h3>
                    <p className="text-3xl font-black text-white italic tracking-tighter mb-1">08 <span className="text-sm text-amber-500 font-bold tracking-widest uppercase">Subjects</span></p>
                    <p className="text-xs text-slate-500 font-medium">Automatic 20% buffer threshold triggered.</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-indigo-500/[0.03] relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={80} className="text-indigo-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Refills Due (Next 7d)</h3>
                    <p className="text-3xl font-black text-white italic tracking-tighter mb-1">12 <span className="text-sm text-indigo-400 font-bold tracking-widest uppercase">Visits</span></p>
                    <p className="text-xs text-slate-500 font-medium">Auto-reminders active for 1-week window.</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-emerald-500/[0.03] relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={80} className="text-emerald-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Adherence Scoring</h3>
                    <p className="text-3xl font-black text-white italic tracking-tighter mb-1">94.2% <span className="text-sm text-emerald-400 font-bold tracking-widest uppercase">Global</span></p>
                    <p className="text-xs text-slate-500 font-medium">Calculated from capsule return weights.</p>
                </div>
            </div>

            {/* List and Filters */}
            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 bg-slate-900/50 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-6">
                        {["Active Submissions", "Historical Registry", "Supply Audits"].map(tab => (
                            <button key={tab} className={`text-[11px] font-black uppercase tracking-widest italic transition-all ${tab === 'Active Submissions' ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}>
                                {tab}
                                {tab === 'Active Submissions' && <div className="h-0.5 w-full bg-cyan-600 mt-1" />}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input type="text" placeholder="Search by SID or Bottle ID..." className="bg-slate-950/50 border border-white/10 rounded-xl px-9 py-2 text-xs text-white outline-none w-full focus:border-cyan-500/50 transition-all font-mono" />
                        </div>
                        <button className="px-4 py-2 bg-slate-950/50 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                            <Filter size={12} /> Sites
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
                                <th className="px-8 py-5">Participant Details</th>
                                <th className="px-8 py-5">Arm Assignment</th>
                                <th className="px-8 py-5">Regimen / Batch</th>
                                <th className="px-8 py-5">Dispensing Timeline</th>
                                <th className="px-8 py-5">Supply Status</th>
                                <th className="px-8 py-5 text-right">Vault Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {records.map((row) => (
                                <tr key={row.id} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-white italic tracking-tight">{row.participantName}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{row.participantId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 inline-block">
                                            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">{row.arm}</p>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{row.study}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-white font-black italic text-[13px]">{row.regimen}</p>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter mt-1 uppercase">Bottle: {row.bottleId}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-600">Dispensed</span>
                                                <span className="text-slate-400 italic">{row.dispensedDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-600">Expected Refill</span>
                                                <span className="text-cyan-500 italic">{row.nextRefill}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                            row.status === 'ON_TRACK' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                            {row.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-slate-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                                Refill Supply
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-white transition-all"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Spec 10.3 Visit Flow Guide */}
            <div className="p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/20">
                <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-2">
                    <Activity className="text-indigo-400" size={16} /> Standardized Visit Flow (Spec 10.3)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                        { step: "01", label: "Form Check", detail: "Check assigned online/offline docs" },
                        { step: "02", label: "Clinical Measurements", detail: "Vitals, Anthro, Labs" },
                        { step: "03", label: "Intervention Data", detail: "Dispense Regimen & Record bottle" },
                        { step: "04", label: "Next Visit", detail: "Schedule Window & Reminders" },
                        { step: "05", label: "Sync & Seal", detail: "Audit hash generation" },
                    ].map((step, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border border-white/5 bg-slate-900/40 relative group">
                            <span className="text-[32px] font-black text-white/5 absolute right-4 top-2 group-hover:text-indigo-500/10 transition-colors">{step.step}</span>
                            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">{step.label}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-tight">{step.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
