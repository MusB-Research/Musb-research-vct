"use client";

import { 
    Users, Target, CheckCircle2, Shield, Activity, 
    ArrowRight, TrendingUp, BarChart3, Filter
} from "lucide-react";
import { sponsoredStudies } from "../data";

export default function SponsorRecruitmentPage() {
    const study = sponsoredStudies[0];
    
    // Detailed funnel stats
    const funnel = [
        { label: "Total Leads", value: 452, icon: Users, color: "text-slate-400", bg: "bg-slate-500/10", pct: 100 },
        { label: "Screened", value: 143, icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10", pct: 31.6 },
        { label: "Eligible", value: 110, icon: Target, color: "text-amber-400", bg: "bg-amber-500/10", pct: 24.3 },
        { label: "Consented", value: 97, icon: Shield, color: "text-indigo-400", bg: "bg-indigo-500/10", pct: 21.4 },
        { label: "Enrolled", value: 87, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", pct: 19.2 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Recruitment Intelligence</h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitoring conversion velocity from lead to enrollment.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white outline-none focus:border-amber-500/40 appearance-none">
                        <option>All Sponsored Studies</option>
                        {sponsoredStudies.map(s => <option key={s.id}>{s.title}</option>)}
                    </select>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {funnel.map((step, idx) => (
                    <div key={idx} className="relative group">
                        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] text-center relative overflow-hidden h-full flex flex-col items-center justify-center">
                            <div className={`p-4 rounded-2xl ${step.bg} ${step.color} mb-4`}>
                                <step.icon size={24} />
                            </div>
                            <h3 className="text-3xl font-black text-white italic tracking-tighter mb-1">{step.value}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">{step.label}</p>
                            
                            <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-auto">
                                <div 
                                    className={`h-full ${step.color.replace('text', 'bg')} shadow-[0_0_8px_currentColor] transition-all duration-1000`} 
                                    style={{ width: `${step.pct}%` }} 
                                />
                            </div>
                            <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase">{step.pct}% Conversion</p>
                        </div>
                        {idx < funnel.length - 1 && (
                            <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 p-2 bg-slate-950 rounded-full border border-white/10 text-slate-600">
                                <ArrowRight size={14} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recruitment Channels */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2rem] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Top Source Channels</h3>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: "Meta / Social Ads", value: 182, pct: 40, color: "bg-indigo-500" },
                            { label: "Direct Referrals", value: 124, pct: 27, color: "bg-amber-500" },
                            { label: "MUSB Organic Search", value: 89, pct: 20, color: "bg-cyan-500" },
                            { label: "Patient Advocacy Groups", value: 57, pct: 13, color: "bg-emerald-500" },
                        ].map((source, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                                    <span className="text-slate-300">{source.label}</span>
                                    <span className="text-white">{source.value} Leads ({source.pct}%)</span>
                                </div>
                                <div className="h-2 w-full bg-slate-950 rounded-lg overflow-hidden">
                                    <div 
                                        className={`h-full ${source.color} shadow-[0_0_10px_rgba(255,255,255,0.05)]`} 
                                        style={{ width: `${source.pct}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Site Performance Metrics */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-8">Target vs Actual</h3>
                    <div className="flex flex-col items-center justify-center h-[200px] relative">
                        <div className="w-40 h-40 rounded-full border-[12px] border-slate-800 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-amber-500 italic tracking-tighter">43%</span>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">Enrollment</span>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                             <svg className="w-48 h-48 -rotate-90">
                                <circle 
                                    cx="96" cy="96" r="82" 
                                    fill="transparent" 
                                    stroke="currentColor" 
                                    strokeWidth="12" 
                                    strokeDasharray="515" 
                                    strokeDashoffset={515 * (1 - 0.435)} 
                                    className="text-amber-500 opacity-80"
                                />
                             </svg>
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[12px] font-bold text-slate-500">Target Enrollment</span>
                            <span className="text-[12px] font-black text-white">{study.target}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[12px] font-bold text-slate-500">Currently Enrolled</span>
                            <span className="text-[12px] font-black text-white">{study.enrolled}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] font-bold text-slate-500">Projected Date</span>
                            <span className="text-[12px] font-black text-emerald-400">Oct 2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
