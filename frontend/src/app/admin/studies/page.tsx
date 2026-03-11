"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    ExternalLink,
    Settings2,
    BarChart3,
    FileEdit,
    Globe,
    Lock,
    Link as LinkIcon,
    Loader2
} from "lucide-react";

export default function AdminStudiesPage() {
    const { data: session } = useSession();
    const [studies, setStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetch("/api/proxy/studies")
                .then(res => res.json())
                .then(data => {
                    setStudies(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Studies fetch error", err);
                    setLoading(false);
                });
        }
    }, [session]);

    const handleApprove = async (studyId: string) => {
        if (!confirm("Are you sure you want to approve this study and make it ACTIVE?")) return;

        try {
            const res = await fetch(`/api/proxy/admin/studies/${studyId}/approve`, {
                method: "POST"
            });
            if (res.ok) {
                alert("Study approved successfully!");
                // Update local state
                setStudies(prev => prev.map(s => s.id === studyId ? { ...s, status: 'ACTIVE' } : s));
            } else {
                alert("Failed to approve study.");
            }
        } catch (err) {
            alert("Connection error.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Clinical Studies</h1>
                    <p className="text-slate-500 mt-2 font-medium">Design, launch, and monitor your decentralized trials.</p>
                </div>
                <Link href="/admin/studies/new" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                    <Plus size={18} /> New Study
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-cyan-500" size={40} />
                </div>
            ) : (
                <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap min-w-[1400px]">
                            <thead className="bg-[#0a1120]/60 border-b border-white/5">
                                <tr className="text-[11px] uppercase tracking-widest text-slate-500 font-black italic">
                                    <th className="py-5 px-6">Study ID</th>
                                    <th className="py-5 px-6">Title & Sponsor</th>
                                    <th className="py-5 px-6">Type</th>
                                    <th className="py-5 px-6">Status</th>
                                    <th className="py-5 px-6">IRB Stage</th>
                                    <th className="py-5 px-6">Enrollment Target</th>
                                    <th className="py-5 px-6">Completed Target</th>
                                    <th className="py-5 px-6 text-center">Active</th>
                                    <th className="py-5 px-6">PI / Coordinator</th>
                                    <th className="py-5 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-[13px] text-slate-300">
                                {studies.map((study) => (
                                    <tr key={study.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-5 px-6 font-mono text-cyan-500/80 font-bold uppercase">{study.protocolId || study.id?.slice(-8).toUpperCase()}</td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic">{study.title}</span>
                                                <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{study.sponsorName || "Internal Research"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${study.type === 'Virtual' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {study.type || "In-Person"}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                                study.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                study.status === 'UNDER_REVIEW' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                                {study.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 font-bold text-slate-400 uppercase italic tracking-tight">{study.irbStatus || "Under Development"}</td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, ((study.enrollmentCount || 0) / (study.targetEnrollment || 100)) * 100)}%` }} />
                                                </div>
                                                <span className="font-black text-white">{study.enrollmentCount || 0}/{study.targetEnrollment || 100}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, ((study.completedCount || 0) / (study.targetCompleted || 100)) * 100)}%` }} />
                                                </div>
                                                <span className="font-black text-white">{study.completedCount || 0}/{study.targetCompleted || 100}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-center text-emerald-400 font-black italic">{study.activeCount || 0}</td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-bold text-slate-400">PI: {study.piName || "Unassigned"}</span>
                                                <span className="text-[11px] font-bold text-slate-500">Coord: {study.coordinatorName || "Unassigned"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/studies/${study.id}`} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/5 transition-all">
                                                    <ExternalLink size={14} />
                                                </Link>
                                                <div className="relative group/actions">
                                                    <button className="p-2 hover:bg-white/5 text-slate-500 rounded-lg transition-all">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-1 hidden group-hover/actions:block w-48 bg-[#0a1120] border border-white/10 rounded-xl shadow-2xl z-[100] py-1">
                                                        <Link href={`/admin/studies/${study.id}`} className="block w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-300">Open Study</Link>
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-300">Edit Study</button>
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-300">Update Status</button>
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-300">Assign Coordinators</button>
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-300">Assign PI</button>
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-300">Open Recruitment</button>
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-300">Generate Report</button>
                                                        <div className="h-px bg-white/5 my-1" />
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-red-400/80">Pause / Resume</button>
                                                        <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[11px] font-black uppercase tracking-widest text-emerald-400/80">Mark Completed</button>
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
            )}
        </div>
    );
}
