"use client";

import { useState, useEffect, useCallback } from "react";
import {
    BarChart3, TrendingUp, PieChart, Download, FileText,
    Users, Activity, Calendar, Loader2, Target,
    ClipboardCheck, RefreshCw, Layers, DollarSign,
    ChevronRight, ArrowUpRight, CheckCircle2, Globe
} from "lucide-react";
import { AdminAuth } from "@/lib/portal-auth";
import { format } from "date-fns";

export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [activeModule, setActiveModule] = useState("Operational");

    const getToken = () => AdminAuth.get()?.token ?? "";

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/proxy/export/stats", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <BarChart3 className="text-indigo-500" size={32} /> Reports & <span className="text-indigo-500">Analytics</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Operational performance, visit compliance & financial reconciliation (Spec 4.20)</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">Custom Query</button>
                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
                        <Download size={16} /> Export Master Report
                    </button>
                </div>
            </div>

            {/* Module Switcher */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
                {["Operational", "Recruitment", "Compliance", "Financial", "Diversity"].map(mod => (
                    <button 
                        key={mod} 
                        onClick={() => setActiveModule(mod)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeModule === mod ? 'bg-slate-800 text-indigo-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {mod}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Recruitment Funnel - Visualized */}
                    <div className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] flex items-center gap-3">
                                    <Layers className="text-indigo-400" size={16} /> Enrollment Velocity Funnel
                                </h3>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Cross-study aggregate performance</p>
                            </div>
                            <button className="text-[11px] font-black text-slate-600 hover:text-white transition-colors uppercase italic tracking-widest">Detail View <ChevronRight size={10} className="inline ml-1" /></button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { stage: "Total Leads", count: "1,482", pct: "100%", color: "bg-indigo-500" },
                                { stage: "Screened", count: "842", pct: "56.8%", color: "bg-indigo-600" },
                                { stage: "Eligible", count: "412", pct: "27.8%", color: "bg-indigo-700" },
                                { stage: "Consented", count: "385", pct: "25.9%", color: "bg-indigo-800" },
                                { stage: "Randomized", count: "342", pct: "23.1%", color: "bg-indigo-900" },
                            ].map((stage, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-widest italic mb-2 px-1">
                                        <span className="text-slate-500 group-hover:text-white transition-colors">{stage.stage}</span>
                                        <span className="text-white">{stage.count} <span className="text-slate-600 ml-2">({stage.pct})</span></span>
                                    </div>
                                    <div className="h-6 w-full bg-slate-900/50 rounded-xl overflow-hidden border border-white/5 p-1">
                                        <div className={`h-full ${stage.color} rounded-lg transition-all group-hover:brightness-125`} style={{ width: stage.pct }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                            <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-3">
                                <DollarSign className="text-emerald-400" size={16} /> Subject Compensation
                            </h3>
                            <div className="space-y-4 text-[13px] font-black italic uppercase">
                                <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                    <span className="text-slate-500">Disbursed</span>
                                    <span className="text-emerald-400">$42,150</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                    <span className="text-slate-500">Committed</span>
                                    <span className="text-amber-400">$3,420</span>
                                </div>
                                <div className="flex justify-between items-center bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                                    <span className="text-emerald-400">Net Budget Flux</span>
                                    <span className="text-white">+12.4%</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                            <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-3">
                                <Target className="text-cyan-400" size={16} /> Site Performance
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { site: "New Jersey Hub", val: "84%", col: "bg-cyan-500" },
                                    { site: "Virtual Trial Portal", val: "92%", col: "bg-indigo-500" },
                                    { site: "London Satellite", val: "45%", col: "bg-red-500" },
                                ].map((s, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest italic">
                                            <span className="text-slate-500">{s.site}</span>
                                            <span className="text-white">{s.val}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${s.col}`} style={{ width: s.val }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-emerald-500/[0.03]">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-3">
                            <ClipboardCheck className="text-emerald-400" size={16} /> Compliance Health
                        </h3>
                        <p className="text-[11px] text-slate-500 italic mb-8">Part 11 compliance score across active studies.</p>
                        
                        <div className="flex flex-col items-center py-6 mb-8 relative">
                            <div className="w-32 h-32 rounded-full border-[10px] border-slate-800 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 border-t-transparent -rotate-45" />
                                <span className="text-3xl font-black text-white italic">98.2<span className="text-sm ml-0.5">%</span></span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 italic">
                                <CheckCircle2 size={12} className="text-emerald-500" /> Electronic Signatures: 100%
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 italic">
                                <CheckCircle2 size={12} className="text-emerald-500" /> Data Quality (Queries): 0.2%
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-3">
                            <Globe className="text-indigo-400" size={16} /> Global Diversity Metric
                        </h3>
                        <p className="text-[11px] text-slate-500 italic mb-6 leading-relaxed">System is tracking multi-ethnic enrollment goals per IRB mandates.</p>
                        
                        <div className="flex gap-2 h-12 mb-6">
                            <div className="h-full bg-indigo-500 w-[40%] rounded-l-lg hover:brightness-110 transition-all cursor-help" />
                            <div className="h-full bg-cyan-500 w-[30%] hover:brightness-110 transition-all cursor-help" />
                            <div className="h-full bg-emerald-500 w-[20%] hover:brightness-110 transition-all cursor-help" />
                            <div className="h-full bg-slate-700 w-[10%] rounded-r-lg hover:brightness-110 transition-all cursor-help" />
                        </div>

                        <button className="w-full py-4 bg-slate-900 hover:bg-black text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 border border-white/5 rounded-2xl transition-all">
                            Diversity Audit Detail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
