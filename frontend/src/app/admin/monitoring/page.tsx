"use client";

import { useState, useEffect } from "react";
import { 
    Activity, 
    Smartphone, 
    Wifi, 
    WifiOff, 
    Zap, 
    Clock, 
    ShieldCheck, 
    AlertCircle, 
    CheckCircle2, 
    BarChart3,
    SmartphoneNfc,
    Users
} from "lucide-react";

export default function AppMonitoringPage() {
    const [stats, setStats] = useState({
        activeNow: 42,
        syncHealth: 98.4,
        avgEngagement: "14m",
        totalDownloads: 1240,
        crashFreeRate: 99.9
    });

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">App Monitoring & Engagement</h1>
                    <p className="text-slate-500 mt-2 font-medium">Real-time participant app health, sync status & interaction metrics (Spec 4.10)</p>
                </div>
                <div className="flex gap-3">
                    <div className="text-right">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-1">Live Sessions</div>
                        <div className="text-2xl font-black text-white italic flex items-center gap-2 justify-end">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            {stats.activeNow}
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Sync Health", value: stats.syncHealth + "%", icon: Wifi, color: "text-cyan-400" },
                    { label: "Avg Session", value: stats.avgEngagement, icon: Clock, color: "text-indigo-400" },
                    { label: "Crash-Free", value: stats.crashFreeRate + "%", icon: ShieldCheck, color: "text-emerald-400" },
                    { label: "Total Installs", value: stats.totalDownloads, icon: Smartphone, color: "text-violet-400" },
                ].map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border border-white/5">
                        <div className={`p-2 w-fit rounded-xl bg-white/5 ${stat.color} mb-4`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-2xl font-black text-white italic">{stat.value}</p>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Device Distribution */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-8 flex items-center gap-2">
                        <SmartphoneNfc size={14} className="text-cyan-500" /> Device & OS Ecosystem
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: "iOS (iPhone/iPad)", value: 68, color: "bg-cyan-500" },
                            { label: "Android Mobile", value: 31, color: "bg-indigo-500" },
                            { label: "Web Portal", value: 1, color: "bg-slate-700" },
                        ].map((dev, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[13px] font-bold">
                                    <span className="text-slate-300">{dev.label}</span>
                                    <span className="text-white">{dev.value}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <div className={`h-full ${dev.color} transition-all duration-1000`} style={{ width: `${dev.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interaction Velocity */}
                <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-indigo-500/[0.03] to-transparent">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                <Zap size={14} className="text-amber-500" /> Real-time Interaction Velocity
                            </h3>
                            <p className="text-[12px] text-slate-500 mt-1">Actions per minute across global timezones.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">24 Hours</span>
                        </div>
                    </div>
                    
                    <div className="h-48 flex items-end gap-1.5 px-4">
                        {[40, 65, 30, 85, 45, 90, 60, 20, 55, 75, 95, 40, 50, 80, 35, 65, 85, 45, 90, 70, 50, 40, 60, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600/40 to-cyan-400 rounded-full transition-all hover:scale-110 cursor-pointer group relative" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] font-black text-white px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {h} APM
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:59</span>
                    </div>
                </div>

                {/* Sync Health & Alerts */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <CheckCircle2 size={20} />
                            <h4 className="text-[13px] font-black uppercase tracking-widest italic">Cloud Sync Status</h4>
                        </div>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">All edge nodes report operational status. Database consistency verified at <span className="text-white">09:15 AM EST</span>.</p>
                        <div className="flex items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest pt-2">
                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> API Latency: 42ms</span>
                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> S3 Uplink: Nominal</span>
                        </div>
                    </div>

                    <div className="p-6 bg-red-500/[0.03] border border-red-500/20 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-3 text-red-400">
                            <AlertCircle size={20} />
                            <h4 className="text-[13px] font-black uppercase tracking-widest italic">Anomalous Engagement Drops</h4>
                        </div>
                        <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[12px] font-bold text-white uppercase italic tracking-tight">London Hub (UK-S1)</span>
                                <span className="text-[10px] font-black text-red-400">DROP DETECTED</span>
                            </div>
                            <p className="text-[11px] text-red-200/60 leading-relaxed italic">12 participants in South London region haven't synced medication logs in &gt;24 hours.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
