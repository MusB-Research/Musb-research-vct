"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdminAuth } from "@/lib/portal-auth";
import {
    Users,
    ArrowUpRight,
    TrendingUp,
    AlertCircle,
    Package,
    Clock,
    ChevronRight,
    Search,
    Filter,
    CheckCircle2,
    Truck,
    ShieldAlert,
    Globe,
    Calendar,
    Briefcase,
    Activity,
    Zap,
    FileSignature,
    Binary,
    BarChart,
    Plus,
    FileText
} from "lucide-react";

const stats = [
    { label: "Total Leads", value: "1,284", change: "+12%", icon: Users, color: "text-cyan-400" },
    { label: "Screened", value: "856", change: "+8%", icon: TrendingUp, color: "text-purple-400" },
    { label: "Active Participants", value: "312", change: "+5%", icon: ArrowUpRight, color: "text-emerald-400" },
    { label: "Open AEs", value: "4", change: "", icon: AlertCircle, color: "text-red-400" },
];

const pendingTasks = [
    { id: "T1", title: "Eligibility Review: John D.", category: "Intake", priority: "High", time: "2h ago" },
    { id: "T2", title: "Missing AE Follow-up: Sarah M.", category: "Safety", priority: "Urgent", time: "5h ago" },
    { id: "T3", title: "Kit Reshipment: Mike R.", category: "Logistics", priority: "Medium", time: "1d ago" },
];

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();

    const [statsData, setStatsData] = useState<any>(null);
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [activeStudies, setActiveStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = AdminAuth.get()?.token || "";
            const headers: Record<string, string> = token
                ? { Authorization: `Bearer ${token}` }
                : {};
            try {
                const [sRes, fRes, pRes, stRes] = await Promise.all([
                    fetch("/api/proxy/admin/stats", { headers }),
                    fetch("/api/proxy/admin/recruitment-funnel", { headers }),
                    fetch("/api/proxy/participants?limit=5", { headers }),
                    fetch("/api/proxy/studies", { headers })
                ]);

                const [sData, fData, pData, stData] = await Promise.all([
                    sRes.ok ? sRes.json() : {},
                    fRes.ok ? fRes.json() : [],
                    pRes.ok ? pRes.json() : [],
                    stRes.ok ? stRes.json() : []
                ]);

                setStatsData(sData || {});
                setFunnelData(Array.isArray(fData) ? fData : []);
                setRecentActivity(Array.isArray(pData) ? pData : []);
                setActiveStudies(Array.isArray(stData) ? stData : []);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setFunnelData([]);
                setRecentActivity([]);
                setActiveStudies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = statsData ? [
        { label: "Assigned Studies", value: (statsData.assignedStudies || 2).toString(), change: "", icon: Briefcase, color: "text-blue-400" },
        { label: "Active", value: (statsData.activeStudiesCount || 1).toString(), change: "", icon: Activity, color: "text-emerald-400" },
        { label: "Recruiting", value: (statsData.recruitingCount || 1).toString(), change: "", icon: Zap, color: "text-amber-400" },
        { label: "Screened", value: (statsData.screened || 0).toLocaleString(), change: "", icon: Users, color: "text-cyan-400" },
        { label: "Eligible", value: (statsData.eligible || 0).toLocaleString(), change: "", icon: CheckCircle2, color: "text-indigo-400" },
        { label: "Consented", value: (statsData.consented || 0).toLocaleString(), change: "", icon: FileSignature, color: "text-purple-400" },
        { label: "Randomized", value: (statsData.randomized || 0).toLocaleString(), change: "", icon: Binary, color: "text-pink-400" },
        { label: "Active Participants", value: (statsData.enrolled || 0).toLocaleString(), change: "", icon: ArrowUpRight, color: "text-emerald-400" },
        { label: "Completed", value: (statsData.completed || 0).toLocaleString(), change: "", icon: CheckCircle2, color: "text-cyan-400" },
        { label: "Dropped", value: (statsData.dropped || 0).toString(), change: "", icon: AlertCircle, color: "text-red-400" },
        { label: "Kits Pending", value: "14", change: "", icon: Package, color: "text-orange-400" },
        { label: "Payments Pending", value: "8", change: "", icon: BarChart, color: "text-emerald-400" },
    ] : [];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Operational Hub</h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back, {session?.user?.name || "Coordinator"}. Research operations are running at 94% efficiency.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-slate-300 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all">
                        <BarChart size={14} /> Analytics
                    </button>
                    <Link href="/admin/studies/new" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-600/20">
                        <Plus size={14} /> Create Study
                    </Link>
                </div>
            </div>

            {/* KPI Grid (Spec 4.3) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-5 rounded-2xl border border-white/5 relative group overflow-hidden hover:border-cyan-500/20 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg bg-slate-900/50 border border-white/5 ${stat.color}`}>
                                <stat.icon size={16} />
                            </div>
                        </div>
                        <div className="text-xl font-black text-white">{stat.value}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 truncate">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Operational Widgets (Spec 4.3) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="glass rounded-[2.5rem] border border-white/5 p-8 bg-gradient-to-br from-slate-900/40 to-transparent">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-lg font-black text-white uppercase tracking-wider italic flex items-center gap-3">
                                <Activity className="text-cyan-500" size={20} /> Operational Priority
                            </h2>
                            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-widest">Live Updates</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Upcoming Visits this Week", value: "24", icon: Calendar, color: "text-emerald-400", desc: "12 In-person, 12 Virtual" },
                                { label: "Overdue Follow-ups", value: "3", icon: Clock, color: "text-red-400", desc: "Require immediate contact" },
                                { label: "Participants Needing Callback", value: "7", icon: Users, color: "text-amber-400", desc: "Lead follow-ups pending" },
                                { label: "Pending Form Completions", value: "42", icon: FileText, color: "text-blue-400", desc: "Awaiting participant input" },
                                { label: "Pending Sample Shipments", value: "11", icon: Truck, color: "text-pink-400", desc: "Outbound logistics queue" },
                                { label: "Sample Receipt Confirmations", value: "19", icon: Package, color: "text-orange-400", desc: "Awaiting lab check-in" },
                            ].map((w, i) => (
                                <div key={i} className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex items-start gap-4 hover:border-white/10 transition-all">
                                    <div className={`p-3 rounded-xl bg-slate-900 ${w.color}`}><w.icon size={20} /></div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-white">{w.value}</span>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{w.label}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-bold mt-1">{w.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recruitment Funnel */}
                    <div className="glass rounded-[2.5rem] border border-white/5 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-lg font-black text-white uppercase tracking-wider italic">Enrollment Funnel</h2>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-slate-900 border border-white/5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly</button>
                                <button className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[10px] font-black text-cyan-400 uppercase tracking-widest">Monthly</button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {Array.isArray(funnelData) && funnelData.map((step, i) => (
                                <div key={i} className="space-y-2 group">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        <span>{step.label}</span>
                                        <span className="text-white">{step.value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${step.color} transition-all duration-1000 group-hover:brightness-110`} 
                                            style={{ width: step.width }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts & Notifications (Spec 4.3) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass rounded-2xl border border-white/5 p-6 bg-slate-900/20">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                            <AlertCircle size={16} className="text-amber-500" /> Study Alerts
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: "Supply Alert: London Site", desc: "Bio-markers stock below 10%", type: "inventory" },
                                { title: "Safety Alert: P-102", desc: "Unscheduled AE reported", type: "safety" },
                                { title: "Target Milestone", desc: "LIDORE reaching 90% enrollment", type: "ops" },
                            ].map((alert, i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/50 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[12px] font-black text-white italic">{alert.title}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">{alert.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass rounded-2xl border border-white/5 p-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                            <ArrowUpRight size={16} className="text-cyan-400" /> Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {recentActivity.slice(0, 4).map((p, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-slate-400 group-hover:border-cyan-500/30 transition-all">
                                        {p.name?.[0] || 'P'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-white truncate">{p.name || 'Anonymous'}</p>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{p.status}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-700 group-hover:text-cyan-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

