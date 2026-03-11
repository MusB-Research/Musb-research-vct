"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Settings, Users, FlaskConical, Target, Calendar, 
    Shield, Save, AlertTriangle, CheckCircle2, Loader2, 
    BarChart3, Clock, ArrowLeft, ClipboardList, Edit3, 
    Pause, Zap, Trash2, LayoutDashboard, Globe, 
    TrendingUp, HeartPulse, ExternalLink, ChevronLeft,
    Activity, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { AdminAuth } from "@/lib/portal-auth";

export default function SponsorStudyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;

    const [activeTab, setActiveTab] = useState<"dashboard" | "protocol" | "recruitment" | "settings">("dashboard");
    const [study, setStudy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!slug) return;

        async function loadStudy() {
            const token = AdminAuth.get()?.token ?? "";
            const authHeader = token ? { "Authorization": `Bearer ${token}` } : {};
            try {
                const res = await fetch(`/api/proxy/sponsor/studies/${slug}`, { headers: authHeader });
                if (res.ok) {
                    const data = await res.json();
                    setStudy(data);
                } else {
                    // Fallback for mock/preview if API fails
                    setStudy({
                        id: slug,
                        title: slug.toString().replace(/-/g, " ").toUpperCase(),
                        status: "RECRUITING",
                        description: "Deep-dive clinical trial protocol management.",
                        target: 200,
                        enrolled: 87,
                        condition: "Oncology"
                    });
                }
            } catch (err) {
                console.error("Connection error:", err);
            } finally {
                setLoading(false);
            }
        }

        loadStudy();
    }, [slug, router]);

    const handleSync = async () => {
        setIsSaving(true);
        const token = AdminAuth.get()?.token ?? "";
        try {
            const res = await fetch(`/api/proxy/sponsor/studies/${slug}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(study)
            });

            if (res.ok) {
                const updated = await res.json();
                setStudy(updated);
                alert("Protocol synchronized with central database.");
            } else {
                alert("Synchronization failed. Check permissions.");
            }
        } catch (err) {
            alert("Database synchronization failed. Check connection.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-amber-500 mb-4" size={32} />
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Accessing Protocol Vault...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Breadcrumb & Title Bar */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <Link href="/sponsor/studies" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors mb-4 block w-fit">
                        <ChevronLeft size={14} /> Back to My Studies
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 border border-white/5 flex items-center justify-center shadow-2xl">
                            <FlaskConical size={28} className="text-amber-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-white italic tracking-tight uppercase leading-none">{study.title}</h1>
                                <span className="px-2 py-0.5 rounded text-[11px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {study.status}
                                </span>
                            </div>
                            <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mt-2 font-sans italic">Protocol ID: {study.id} • Assigned Lead: Dr. Sarah Chen</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSync}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {isSaving ? "Syncing..." : "Sync Protocol"}
                    </button>
                    <button className="p-3 bg-slate-900 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Local Nav */}
                <aside className="w-full lg:w-64 shrink-0 space-y-2">
                    {[
                        { id: "dashboard", label: "Study Overview", icon: LayoutDashboard },
                        { id: "protocol", label: "Edit Protocol", icon: Edit3 },
                        { id: "recruitment", label: "Recruitment Analysis", icon: Target },
                        { id: "settings", label: "Confidentiality", icon: Shield },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-left border ${activeTab === tab.id
                                ? "bg-amber-600/10 text-amber-500 border-amber-500/20 shadow-xl shadow-amber-500/5"
                                : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                    <div className="pt-6 mt-6 border-t border-white/5">
                         <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Live Feed</p>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <p className="text-[11px] text-slate-400 font-medium">New e-Consent signed (P-442)</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                    <p className="text-[11px] text-slate-400 font-medium">Monitoring visit scheduled for Mar 12</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </aside>

                {/* Tab Content */}
                <main className="flex-1 min-w-0">
                    {activeTab === "dashboard" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Completion Rate", value: "91%", icon: BarChart3, color: "text-emerald-400" },
                                    { label: "Active Sites", value: "3 Global", icon: Globe, color: "text-cyan-400" },
                                    { label: "Pending IRB", value: "0 Tasks", icon: Shield, color: "text-amber-400" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-xl bg-slate-950 ${stat.color} border border-white/5`}>
                                                <stat.icon size={18} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Protocol Timeline</h3>
                                    <Calendar size={16} className="text-slate-600" />
                                </div>
                                <div className="space-y-8 relative">
                                    <div className="absolute left-4 top-1 bottom-1 w-px bg-white/5" />
                                    {[
                                        { date: "Oct 2024", label: "Study Planning & Design", status: "COMPLETED", color: "bg-emerald-500" },
                                        { date: "Dec 2024", label: "IRB & Regulatory Submission", status: "COMPLETED", color: "bg-emerald-500" },
                                        { date: "Jan 2025", label: "First Patient In (FPI)", status: "COMPLETED", color: "bg-emerald-500" },
                                        { date: "May 2025", label: "50% Enrollment Milestone", status: "IN PROGRESS", color: "bg-amber-500" },
                                        { date: "Sep 2025", label: "Last Patient Out (LPO)", status: "PROJECTED", color: "bg-slate-800" },
                                    ].map((milestone, i) => (
                                        <div key={i} className="relative pl-12">
                                            <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full ${milestone.color} flex items-center justify-center border-4 border-[#020617] shadow-xl`}>
                                                {milestone.status === 'COMPLETED' ? <CheckCircle2 size={12} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1">{milestone.date}</p>
                                                <h4 className="text-[15px] font-bold text-slate-200">{milestone.label}</h4>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.15em] mt-1.5 ${milestone.status === 'COMPLETED' ? 'text-emerald-500/70' : milestone.status === 'IN PROGRESS' ? 'text-amber-500/70' : 'text-slate-700'}`}>
                                                    {milestone.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "protocol" && (
                        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 space-y-8 animate-in fade-in duration-500">
                             <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-6">Modify Protocol Metadata</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Public Protocol Title</label>
                                            <input
                                                type="text"
                                                value={study.title || ""}
                                                onChange={(e) => setStudy({ ...study, title: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors text-lg font-black italic tracking-tight"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Therapeutic Area</label>
                                            <div className="relative">
                                                <select
                                                    value={study.condition || ""}
                                                    onChange={(e) => setStudy({ ...study, condition: e.target.value })}
                                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white appearance-none focus:outline-none focus:border-amber-500/50 transition-colors font-bold text-sm"
                                                >
                                                    <option value="Oncology">Oncology</option>
                                                    <option value="Neurology">Neurology</option>
                                                    <option value="Cardiology">Cardiology</option>
                                                    <option value="Metabolic">Metabolic Health</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                    <Calendar size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Protocol Synopsis</label>
                                        <textarea
                                            value={study.description || ""}
                                            onChange={(e) => setStudy({ ...study, description: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors min-h-[160px] text-sm leading-relaxed font-medium"
                                        />
                                    </div>
                                </div>
                             </div>

                            <div className="pt-8 border-t border-white/5">
                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Protocol Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["Double Blind", "Phase II", "Virtual Site", "Nonsquamous"].map(tag => (
                                        <div key={tag} className="px-4 py-2 bg-white/5 rounded-xl text-[12px] font-bold text-slate-400 border border-white/10 flex items-center gap-2">
                                            {tag}
                                            <button className="text-slate-600 hover:text-red-400 text-[10px]">×</button>
                                        </div>
                                    ))}
                                    <button className="px-4 py-2 border border-dashed border-white/10 rounded-xl text-[12px] font-bold text-amber-500 hover:bg-amber-500/5 transition-all">+ Add Tag</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "recruitment" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                             <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8">
                                <div className="flex justify-between items-center mb-12">
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Enrollment Velocity Analysis</h3>
                                    <TrendingUp size={16} className="text-amber-500" />
                                </div>
                                <div className="flex items-end gap-3 h-48 mb-12">
                                     {[35, 65, 45, 85, 55, 95, 75, 80, 40].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                            <div className="w-full bg-slate-950 rounded-xl relative overflow-hidden h-full border border-white/5">
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600/60 to-amber-400/80 transition-all duration-1000 group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                                    style={{ height: `${h}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">W{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Target Total</p>
                                        <p className="text-2xl font-black text-white italic">{study.target}</p>
                                    </div>
                                    <div className="text-center border-x border-white/5">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Enrolled to Date</p>
                                        <p className="text-2xl font-black text-emerald-400 italic">{study.enrolled}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Remaining</p>
                                        <p className="text-2xl font-black text-amber-500 italic">{study.target - study.enrolled}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                         <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 space-y-6 animate-in fade-in duration-500">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic mb-6">Security & Governance</h3>
                            
                            {[
                                { title: "Protocol Masking", desc: "Hide specific investigational compound names from public listings.", status: "Active", icon: ShieldCheck },
                                { title: "Clinical Data Feed", desc: "Enable real-time synchronization with EDC (Electronic Data Capture).", status: "Active", icon: Activity },
                                { title: "Sponsor-Level PI Chat", desc: "Direct secure channel to Principal Investigators.", status: "Disabled", icon: MessageSquare },
                            ].map((setting, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-950/40 border border-white/5 hover:border-amber-500/20 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-white/5 text-amber-500/60 rounded-2xl group-hover:text-amber-500 transition-colors">
                                            <setting.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight italic">{setting.title}</p>
                                            <p className="text-[11px] font-medium text-slate-500 mt-1 max-w-sm">{setting.desc}</p>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer group/switch">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.status === 'Active'} />
                                        <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:bg-amber-600 transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 shadow-inner"></div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8 border-t border-white/5 flex justify-between items-center text-red-500/50 hover:text-red-500 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <Trash2 size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Archive Protocol Intelligence</span>
                                </div>
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                            </div>
                         </div>
                    )}
                </main>
            </div>
        </div>
    );
}

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
    <Shield size={size} className={className} />
);
