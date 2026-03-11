"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    Activity, 
    Users, 
    MousePointer2, 
    TrendingUp, 
    Target, 
    AlertCircle,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    Search,
    Filter,
    Calendar,
    ChevronRight,
    MoreVertical
} from "lucide-react";

const kpis = [
    { label: "Click-Through Rate", value: "4.2%", trend: "+0.8%", color: "text-cyan-400" },
    { label: "Lead Conversion", value: "28.5%", trend: "+1.2%", color: "text-emerald-400" },
    { label: "Cost Per Acquisition", value: "$42.10", trend: "-5.40", color: "text-white" },
    { label: "Eligibility Rate", value: "62%", trend: "-2%", color: "text-amber-400" },
    { label: "Drop-out Risk", value: "Low", trend: "Stable", color: "text-blue-400" },
];

const recruitmentFunnel = [
    { stage: "Web Traffic", count: "12,450", percent: "100%", color: "bg-slate-800" },
    { stage: "Registered Leads", count: "3,120", percent: "25%", color: "bg-cyan-900/40" },
    { stage: "Pre-screened", count: "1,850", percent: "14.8%", color: "bg-cyan-800/40" },
    { stage: "Consented", count: "420", percent: "3.4%", color: "bg-cyan-700/60" },
    { stage: "Randomized", count: "185", percent: "1.5%", color: "bg-emerald-600/40" },
];

export default function RecruitmentDashboard() {
    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Recruitment Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Real-time enrollment funnel & campaign performance (Spec 4.6)</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/leads" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Users size={16} /> Manage Leads / CRM
                    </Link>
                    <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <Target size={16} /> New Campaign
                    </button>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-5 gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{kpi.label}</p>
                        <div className="flex items-end gap-2">
                            <span className={`text-2xl font-black italic tracking-tight ${kpi.color}`}>{kpi.value}</span>
                            <span className={`text-[10px] font-bold mb-1 ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                                {kpi.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Funnel Visualization */}
                <div className="col-span-12 lg:col-span-7 glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-xl font-black text-white mb-8 italic uppercase tracking-tight flex items-center gap-3">
                        <BarChart3 className="text-cyan-400" size={20} /> Recruitment Funnel
                    </h3>
                    
                    <div className="space-y-4">
                        {recruitmentFunnel.map((step, i) => (
                            <div key={i} className="relative group">
                                <div 
                                    className={`relative z-10 h-16 ${step.color} border border-white/5 rounded-2xl flex items-center px-8 transition-transform group-hover:scale-[1.01]`}
                                    style={{ width: `calc(100% - ${i * 5}%)` }}
                                >
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest w-40">{step.stage}</span>
                                    <span className="text-xl font-black text-white italic tracking-tight ml-4">{step.count}</span>
                                    <div className="ml-auto flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Conversion</p>
                                            <p className="text-sm font-black text-cyan-400">{step.percent}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-700" />
                                    </div>
                                </div>
                                {i < recruitmentFunnel.length - 1 && (
                                    <div className="absolute left-8 top-16 w-px h-4 bg-white/5" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance by Source */}
                <div className="col-span-12 lg:col-span-5 glass p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-xl font-black text-white mb-8 italic uppercase tracking-tight flex items-center gap-3">
                        <Globe className="text-cyan-400" size={20} /> Traffic Sources
                    </h3>

                    <div className="space-y-6">
                        {[
                            { name: "Facebook Ads", leads: 1240, conv: "32%", growth: "+12%" },
                            { name: "Google Search", leads: 850, conv: "24%", growth: "+5%" },
                            { name: "ClinicalTrials.gov", leads: 420, conv: "18%", growth: "-2%" },
                            { name: "Email Outreach", leads: 310, conv: "45%", growth: "+21%" },
                            { name: "Direct/Referral", leads: 180, conv: "15%", growth: "+3%" },
                        ].map((source, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500 transition-colors group-hover:border-cyan-500/30 group-hover:text-cyan-400">
                                        {source.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white mb-0.5 group-hover:text-cyan-400 transition-colors">{source.name}</p>
                                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">{source.leads} Leads</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white italic">{source.conv}</p>
                                    <p className={`text-[10px] font-bold ${source.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{source.growth}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 py-4 bg-slate-900/50 hover:bg-slate-900 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 border border-white/5 rounded-2xl transition-all">
                        View Detailed Analytics
                    </button>
                </div>
            </div>

            {/* Campaign Controls */}
            <div className="glass p-10 rounded-[3rem] border border-white/5">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Active Recruitment Campaigns</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input type="text" placeholder="Search..." className="bg-slate-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none w-48 focus:border-cyan-500/50 transition-all font-medium" />
                        </div>
                        <button className="p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Filter size={14} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/[0.03] group hover:border-cyan-500/20 transition-all relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20 italic">Running</span>
                                <button className="text-slate-600 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                            </div>
                            <h4 className="text-lg font-black text-white italic tracking-tight mb-2 uppercase group-hover:text-cyan-400 transition-colors">Q1 Longevity Outreach</h4>
                            <p className="text-[12px] text-slate-500 font-medium mb-6">Targeting age 45-65, US-wide. Focusing on NAD+ benefits.</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Budget Spent</p>
                                    <p className="text-sm font-black text-white">$12,400</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Leads Secured</p>
                                    <p className="text-sm font-black text-cyan-400">842</p>
                                </div>
                            </div>
                            
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-[11px] font-black uppercase tracking-widest text-white border border-white/5 rounded-xl transition-all">Pause Campaign</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
