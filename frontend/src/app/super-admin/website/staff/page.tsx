"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, UserCircle, Briefcase, RefreshCw, CheckCircle2, ChevronRight, LayoutGrid, List } from "lucide-react";
import { SuperAdminAuth } from "@/lib/portal-auth";

export default function WebsiteStaffPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const token = SuperAdminAuth.get()?.token || "";

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/super-admin/website/staff`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setStaff(await res.json());
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchStaff(); }, [fetchStaff]);

    return (
        <div className="space-y-8 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <UserCircle className="text-violet-400" size={28} /> Team &amp; Staff Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Public website team directory</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/60 p-1 rounded-xl border border-white/5">
                    <button onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>
                        <LayoutGrid size={18} />
                    </button>
                    <button onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>
                        <List size={18} />
                    </button>
                    <div className="w-px h-6 bg-slate-800 mx-1" />
                    <button onClick={fetchStaff} disabled={loading}
                        className="p-2 text-slate-500 hover:text-white transition-all">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="glass p-6 rounded-3xl border border-white/5 h-64 animate-pulse">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl mb-4" />
                            <div className="h-6 bg-slate-800 rounded w-48 mb-2" />
                            <div className="h-4 bg-slate-800 rounded w-32" />
                        </div>
                    ))}
                </div>
            ) : staff.length === 0 ? (
                <div className="glass p-20 text-center rounded-3xl border border-white/5">
                    <UserCircle size={48} className="text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-bold">No staff members found.</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {staff.map((s) => (
                        <div key={s.id} className="glass p-6 rounded-3xl border border-white/5 relative group hover:border-violet-500/20 transition-all flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-white/5 flex items-center justify-center mb-5 shrink-0 shadow-lg shadow-violet-900/10 group-hover:scale-105 transition-transform">
                                <UserCircle size={40} className="text-violet-400/60" />
                            </div>
                            <h3 className="text-lg font-black text-white group-hover:text-violet-300 transition-colors leading-tight mb-1">{s.name}</h3>
                            <p className="text-[12px] font-black text-violet-400 uppercase tracking-widest leading-none mb-3">{s.role}</p>
                            <div className="flex flex-col items-center gap-1.5 mt-auto pt-4 border-t border-white/5 w-full">
                                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/50 rounded-lg text-[11px] font-bold text-slate-500">
                                    <Briefcase size={10} className="text-slate-600" /> {s.department || "General"}
                                </div>
                                {!s.isActive && (
                                    <span className="text-[10px] font-black text-red-400 px-2 py-0.5 rounded-full bg-red-400/10 uppercase border border-red-500/20">Inactive</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {staff.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center shrink-0">
                                                <UserCircle size={15} className="text-violet-400" />
                                            </div>
                                            <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{s.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{s.role}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{s.department || "—"}</td>
                                    <td className="px-6 py-4 text-[12px] font-mono text-slate-600">{s.order || "None"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${s.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                            {s.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
