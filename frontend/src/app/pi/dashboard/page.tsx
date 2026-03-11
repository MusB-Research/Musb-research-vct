"use client";

import { 
    Activity, Users, ClipboardList, FlaskConical, 
    AlertCircle, FileCheck, CheckCircle2, TrendingUp,
    MessageSquare, ArrowUpRight, ChevronRight, Clock,
    BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminAuth } from "@/lib/portal-auth";

export default function PIDashboard() {
    const [stats, setStats] = useState({
        assignedStudies: 2,
        pendingReviews: 8,
        alerts: 3,
        totalParticipants: 145,
        recruitmentPct: 72
    });

    const pendingReviews = [
        { id: "REV-901", type: "Lab Results", subjectId: "P-4502", study: "NAD+ Longevity", date: "2h ago", priority: "High" },
        { id: "REV-902", type: "AE Review", subjectId: "P-7721", study: "NAD+ Longevity", date: "4h ago", priority: "Critical" },
        { id: "REV-903", type: "Intake Form", subjectId: "P-1120", study: "Microbiome Study", date: "1d ago", priority: "Medium" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Scientific Command</h1>
                <p className="text-slate-500 mt-2 font-medium italic">Clinical investigator oversight and study-level diagnostics (Spec 16.4).</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Assigned Studies", value: stats.assignedStudies, icon: FlaskConical, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    { label: "Review Tasks", value: stats.pendingReviews, icon: ClipboardList, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Study Alerts", value: stats.alerts, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
                    { label: "Recruitment Avg.", value: `${stats.recruitmentPct}%`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                ].map((kpi, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${kpi.bg} rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2`} />
                        <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} w-fit mb-4 relative z-10 group-hover:scale-110 transition-transform`}>
                            <kpi.icon size={20} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white italic tracking-tighter">{kpi.value}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">{kpi.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Review Queue (Spec 16.4) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <h2 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">Pending Medical Review</h2>
                            <Link href="/pi/participants" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">View All Queue</Link>
                        </div>
                        <div className="divide-y divide-white/5">
                            {pendingReviews.map((rev) => (
                                <div key={rev.id} className="p-6 hover:bg-white/[0.02] transition-colors group flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 ${rev.priority === 'Critical' ? 'border-red-500/30' : ''}`}>
                                            {rev.type === 'Lab Results' ? <Activity size={18} className="text-cyan-400" /> : <AlertCircle size={18} className="text-amber-400" />}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-white italic uppercase tracking-tight">{rev.type} — {rev.subjectId}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">{rev.study} · {rev.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-[6px] text-[9px] font-black uppercase tracking-widest border ${
                                            rev.priority === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                            rev.priority === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                            'bg-slate-800 text-slate-500 border-white/5'
                                        }`}>
                                            {rev.priority} Priority
                                        </span>
                                        <button className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Sign-Offs (Spec 16.4) */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">Report Approval Status</h3>
                            <BarChart3 size={16} className="text-slate-600" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            {[
                                { name: "Quarterly Safety Report v1.2", status: "Awaiting Sign-Off", date: "Due in 2 days", pct: 75 },
                                { name: "Protocol Amendment IRB Submission", status: "Awaiting Sign-Off", date: "High Priority", pct: 40 },
                            ].map((rep, i) => (
                                <div key={i} className="p-5 bg-slate-950/40 rounded-[1.5rem] border border-white/5 group hover:border-indigo-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[13px] font-black text-white italic uppercase tracking-tight">{rep.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic tracking-widest">{rep.date}</p>
                                        </div>
                                        <button className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-600/20">Review & Sign</button>
                                    </div>
                                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${rep.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Study Oversight (Spec 16.4) */}
                <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic mb-6">Recruitment Funnel</h3>
                        <div className="space-y-6">
                            {[
                                { label: "Screened (Total)", value: 452, pct: 100, color: "bg-slate-700" },
                                { label: "Eligible (Med Review)", value: 112, pct: 24, color: "bg-indigo-500" },
                                { label: "Fully Enrolled", value: 87, pct: 19, color: "bg-emerald-500" },
                            ].map((step, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest italic">
                                        <span className="text-slate-500">{step.label}</span>
                                        <span className="text-white">{step.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                        <div className={`h-full ${step.color} shadow-[0_0_8px_rgba(255,255,255,0.05)]`} style={{ width: `${step.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/pi/recruitment" className="mt-8 flex items-center justify-between p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group hover:border-indigo-500/50 transition-all">
                            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Full Recruitment Audit</span>
                            <ArrowUpRight size={14} className="text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="bg-indigo-600/10 border border-indigo-600/20 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center">
                         <MessageSquare className="text-indigo-400 mb-3" size={24} />
                         <p className="text-[12px] font-bold text-white uppercase italic tracking-tight mb-1">Secure Investigator Channel</p>
                         <p className="text-[10px] text-slate-500 font-medium italic">Direct P2P communication with Site Coordinators active.</p>
                         <button className="mt-4 px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Open Messages</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
