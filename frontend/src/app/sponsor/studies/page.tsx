"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Plus, Search, Filter, FlaskConical, Target, Calendar, 
    ArrowRight, Activity, HeartPulse 
} from "lucide-react";
import { AdminAuth } from "@/lib/portal-auth";
import { sponsoredStudies, STATUS_CONFIG } from "../data";

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status.replace(/_/g, " "), cls: "bg-slate-800 text-slate-400 border-white/10" };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}

export default function SponsorStudiesPage() {
    const [studies, setStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const token = AdminAuth.get()?.token ?? "";
            const authHeader = token ? { "Authorization": `Bearer ${token}` } : {};
            try {
                const res = await fetch("/api/proxy/sponsor/studies", { headers: authHeader });
                if (res.ok) setStudies(await res.json());
            } catch (error) {
                console.error("Error fetching studies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const displayStudies = studies.length > 0 ? studies : sponsoredStudies;
    const filteredStudies = displayStudies.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.condition?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">My Studies</h1>
                    <p className="text-slate-500 mt-2 font-medium">Protocol portfolio and lifecycle management.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search protocols..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-300 focus:border-amber-500/50 outline-none w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <Activity className="animate-spin text-amber-500 mx-auto mb-4" size={32} />
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Accessing Research Vault...</p>
                    </div>
                ) : filteredStudies.map((s, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500/20 transition-all group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <StatusBadge status={s.status} />
                                <div className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{s.phase || "Phase II"}</div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors uppercase italic tracking-tight mb-2 leading-tight">{s.title}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-8">{s.condition} · {s.site || "Virtual Distribution"}</p>
                            
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Target</p>
                                    <p className="text-lg font-black text-white">{s.target || s.targetParticipants || 100}</p>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Enrolled</p>
                                    <p className="text-lg font-black text-cyan-400">{s.enrolled || s.enrolledCount || 0}</p>
                                </div>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Adherence</p>
                                    <p className="text-lg font-black text-emerald-400">{s.adherence || 0}%</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                                    <span>Enrollment Progress</span>
                                    <span className="text-white">{Math.round(((s.enrolled || s.enrolledCount || 0) / (s.target || s.participantCount || 100)) * 100)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-1000" 
                                        style={{ width: `${Math.min(100, Math.round(((s.enrolled || s.enrolledCount || 0) / (s.target || s.participantCount || 100)) * 100))}%` }} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex gap-3">
                            <Link 
                                href={`/sponsor/studies/${s.slug || s.id}`} 
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl text-center transition-all flex items-center justify-center gap-2 border border-white/5"
                            >
                                <FlaskConical size={14} /> Full Protocol
                            </Link>
                            <Link 
                                href={`/sponsor/recruitment?study=${s.id}`} 
                                className="flex-1 py-3 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-500/20 rounded-xl text-[11px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
                            >
                                <Target size={14} /> Recruitment
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
