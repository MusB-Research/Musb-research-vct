"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Activity, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    MoreVertical, 
    Filter, 
    Search, 
    MapPin, 
    Video, 
    Plus,
    X,
    Ban,
    ExternalLink
} from "lucide-react";

const visits = [
    { id: "V-2024", patient: "Sarah Miller", study: "NAD+ Longevity", visit: "Baseline", date: "2026-03-11", time: "10:00 AM", type: "In-Person", status: "Expected" },
    { id: "V-2025", patient: "James Wilson", study: "NAD+ Longevity", visit: "Week 4 Follow-up", date: "2026-03-11", time: "02:30 PM", type: "Virtual", status: "Verified" },
    { id: "V-2026", patient: "David Brown", study: "Microbiome Study", visit: "Month 3 Checkup", date: "2026-03-10", time: "09:15 AM", type: "In-Person", status: "Missed" },
    { id: "V-2027", patient: "Emma Davis", study: "NAD+ Longevity", visit: "Safety Evaluation", date: "2026-03-12", time: "11:45 AM", type: "Virtual", status: "Expected" },
    { id: "V-2028", patient: "Michael Roark", study: "NAD+ Longevity", visit: "Final Visit", date: "2026-03-09", time: "01:00 PM", type: "In-Person", status: "Complete" },
];

export default function VisitsAssessments() {
    const [filter, setFilter] = useState("All");

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Visits & Assessments</h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitoring clinical trial visit windows and assessment status (Spec 4.13)</p>
                </div>
                <div className="flex gap-3 font-black">
                    <Link href="/admin/scheduling" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 rounded-xl text-[11px] uppercase tracking-widest transition-all">Go to Calendar</Link>
                    <button onClick={() => alert("Batch Schedule requested (Section 4.13)")} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all">Global Schedule</button>
                </div>
            </div>

            {/* Quick Filter Bubbles */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {["All", "Expected", "Complete", "Verified", "Missed", "Out of Window"].map(f => (
                        <button 
                            key={f} 
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-600/20' : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 border border-white/5'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input type="text" placeholder="Search visits..." className="bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[13px] text-white outline-none w-64 focus:border-cyan-500/50 transition-all font-medium" />
                    </div>
                    <button className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Filter size={18} /></button>
                </div>
            </div>

            {/* Visit Table */}
            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[11px] uppercase tracking-widest text-slate-500 font-black italic">
                                <th className="py-5 px-6 italic">Subject / Patient</th>
                                <th className="py-5 px-6 italic">Visit Label</th>
                                <th className="py-5 px-6 italic">Scheduled Date</th>
                                <th className="py-5 px-6 italic">Model</th>
                                <th className="py-5 px-6 italic">Status</th>
                                <th className="py-5 px-6 text-right italic">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300">
                            {visits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic">{visit.patient}</span>
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{visit.study}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white uppercase italic tracking-tight">{visit.visit}</span>
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">ID: {visit.id}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-slate-600" />
                                                <span className="font-bold text-slate-300 italic">{visit.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock size={12} className="text-slate-700" />
                                                <span className="text-[11px] text-slate-600 font-bold">{visit.time}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 font-bold text-slate-400">
                                        <div className="flex items-center gap-2">
                                            {visit.type === 'Virtual' ? <Video size={14} className="text-cyan-500" /> : <MapPin size={14} className="text-indigo-500" />}
                                            <span className="uppercase text-[11px] italic tracking-widest">{visit.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                            visit.status === 'Complete' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                            visit.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            visit.status === 'Missed' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-lg shadow-red-500/10 animate-pulse' :
                                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                        }`}>
                                            {visit.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-500">
                                            <button title="Log Assessment" className="p-2 hover:bg-white/5 hover:text-cyan-400 rounded-lg transition-all"><Activity size={16} /></button>
                                            <button title="Reschedule" className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-all"><Calendar size={16} /></button>
                                            <div className="relative group/actions">
                                                <button className="p-2 hover:bg-white/5 text-slate-500 rounded-lg transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 hidden group-hover/actions:block w-48 bg-[#0a1120] border border-white/10 rounded-xl shadow-2xl z-50 py-1">
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300">Mark Completed</button>
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center justify-between">Verify Data <ExternalLink size={10} /></button>
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-red-400/80">Missed Visit</button>
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-red-400/80">Cancel Visit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assessment Quality Alert */}
            <div className="p-6 bg-red-400/5 border border-red-400/10 rounded-[2rem] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-400/10 text-red-400 flex items-center justify-center">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white italic uppercase tracking-widest leading-none mb-1">Attention: 3 Missed Visits (Last 72h)</p>
                        <p className="text-[12px] text-slate-500 font-medium">Please review subjects for drop-out risk or scheduling conflicts.</p>
                    </div>
                </div>
                <button className="px-5 py-2 bg-slate-900 border border-white/5 hover:border-red-400/30 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all">Review Escalations</button>
            </div>
        </div>
    );
}
