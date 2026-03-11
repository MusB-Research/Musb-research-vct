"use client";

import {
    BarChart3, Users, FlaskConical, TrendingUp,
    Activity, ArrowUpRight, HeartPulse, Target, Calendar,
    MessageSquare, ChevronRight, PieChart, Shield
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminAuth } from "@/lib/portal-auth";
import { sponsoredStudies, recentActivity, STATUS_CONFIG } from "../data";

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status.replace(/_/g, " "), cls: "bg-slate-800 text-slate-400 border-white/10" };
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-black tracking-widest uppercase border whitespace-nowrap ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}

export default function SponsorOverviewPage() {
    const [stats, setStats] = useState<any>(null);
    const [studies, setStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const token = AdminAuth.get()?.token ?? "";
        const authHeader = token ? { "Authorization": `Bearer ${token}` } : {};
        try {
            const [statsRes, studiesRes] = await Promise.all([
                fetch("/api/proxy/sponsor/stats", { headers: authHeader }),
                fetch("/api/proxy/sponsor/studies", { headers: authHeader }),
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (studiesRes.ok) setStudies(await studiesRes.json());
        } catch (error) {
            console.error("Error fetching sponsor data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const activeStudies = studies.length || sponsoredStudies.length;
    const totalParticipants = stats?.totalParticipants || 87; // Mock fallback
    const enrollmentPct = stats && stats.totalParticipants > 0
        ? Math.round((stats.enrolledParticipants / stats.totalParticipants) * 100)
        : 43; // Mock fallback

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Executive Overview</h1>
                <p className="text-slate-500 mt-2 font-medium">Real-time intelligence across your clinical trial pipeline.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Studies", value: activeStudies, trend: "+1 this month", icon: FlaskConical, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Total Participants", value: totalParticipants, trend: "Across protocols", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                    { label: "Avg. Enrollment", value: `${enrollmentPct}%`, trend: "Target: 85%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Data Integrity", value: "99.2%", trend: "Validation status", icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${kpi.bg} rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2`} />
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={20} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white italic tracking-tighter">{kpi.value}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">{kpi.label}</p>
                            <p className="text-[12px] font-bold text-slate-600 mt-4 flex items-center gap-1">
                                <ArrowUpRight size={10} className="text-emerald-500" /> {kpi.trend}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Studies List */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Study Pipeline</h2>
                    <Link
                        href="/sponsor/studies"
                        className="text-[13px] font-black uppercase text-amber-500 hover:text-amber-400 transition-colors"
                    >
                        Detailed View
                    </Link>
                </div>
                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">
                            <Activity size={24} className="animate-spin mx-auto mb-4 opacity-20" />
                            <p className="text-[13px] font-bold uppercase tracking-widest">Hydrating Dashboard...</p>
                        </div>
                    ) : (studies.length > 0 ? studies : sponsoredStudies).map((s, idx) => (
                        <div key={idx} className="p-8 hover:bg-white/[0.02] transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-amber-500/30 transition-all">
                                    <HeartPulse size={24} className="text-amber-500/50" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors uppercase italic tracking-tight">{s.title}</h3>
                                        <StatusBadge status={s.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5"><Target size={12} /> {s.targetParticipants || s.target} Target</span>
                                        <span className="flex items-center gap-1.5"><Calendar size={12} /> Active since {s.startDate || "Jan 2025"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[11px] font-black uppercase text-slate-600 tracking-widest mb-1 font-sans">Enrollment Progress</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" style={{ width: `${Math.round(((s.enrolledCount || s.enrolled || 0) / (s.participantCount || s.target || 100)) * 100)}%` }} />
                                        </div>
                                        <span className="text-[13px] font-bold text-white">{Math.round(((s.enrolledCount || s.enrolled || 0) / (s.participantCount || s.target || 100)) * 100)}%</span>
                                    </div>
                                </div>
                                <Link href={`/sponsor/studies/${s.slug || s.id}`} className="px-6 py-2.5 bg-slate-900 border border-white/10 hover:border-amber-500/30 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all font-sans">
                                    Manage
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2rem] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Intelligence Feed</h3>
                        <PieChart size={16} className="text-slate-600" />
                    </div>
                    <div className="space-y-6">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex gap-4 group">
                                <div className={`p-2 rounded-xl bg-slate-950 border border-white/5 ${activity.color} shrink-0`}>
                                    <activity.icon size={16} />
                                </div>
                                <div className="flex-1 border-b border-white/5 pb-4 group-last:border-0">
                                    <p className="text-[13px] text-slate-300 font-bold leading-tight mb-1">{activity.message}</p>
                                    <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-8">Protocol Actions</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Request IRB Amendment", icon: Shield, href: "/sponsor/documents" },
                            { label: "Study Manager Inbox", icon: MessageSquare, href: "/sponsor/messages" },
                            { label: "View Audit Log", icon: Activity, href: "/sponsor/reports" },
                        ].map((action, i) => (
                            <Link
                                key={i}
                                href={action.href}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-amber-500/30 transition-all group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <action.icon size={16} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                                    <span className="text-[13px] font-bold text-slate-400 group-hover:text-white transition-colors">{action.label}</span>
                                </div>
                                <ChevronRight size={14} className="text-slate-700 group-hover:text-amber-500" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
