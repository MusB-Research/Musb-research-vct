"use client";

import { useEffect, useState, useCallback } from "react";
import { Building2, RefreshCw, Mail, Users, Shield, Lock, Activity } from "lucide-react";
import { SuperAdminAuth } from "@/lib/portal-auth";

export default function SuperAdminSponsorsPage() {
    const [activeTab, setActiveTab] = useState<"sponsors" | "teams">("sponsors");
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const token = SuperAdminAuth.get()?.token || "";

    const fetchSponsors = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/proxy/super-admin/sponsors", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setSponsors(await res.json());
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchTeams = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/proxy/super-admin/sponsors/team", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setTeams(await res.json());
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === "sponsors") fetchSponsors();
        else fetchTeams();
    }, [activeTab, fetchSponsors, fetchTeams]);

    const handleRefresh = () => {
        if (activeTab === "sponsors") fetchSponsors();
        else fetchTeams();
    };

    const handleDeactivateUser = async (userId: string) => {
        if (!confirm("Are you sure you want to suspend this user?")) return;
        try {
            const res = await fetch(`/api/proxy/super-admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ suspended: true })
            });
            if (res.ok) {
                alert("User suspended successfully");
                fetchTeams();
            } else {
                alert("Failed to suspend user");
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    return (
        <div className="space-y-6 max-w-[1200px]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Building2 size={22} className="text-violet-400" /> Sponsors & Teams
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage sponsor organizations and their team members</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleRefresh} disabled={loading}
                        className="p-2.5 bg-slate-900 border border-slate-800 hover:border-violet-500/30 text-slate-400 rounded-xl transition-all disabled:opacity-50">
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5 w-fit">
                <button
                    onClick={() => setActiveTab("sponsors")}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-bold uppercase tracking-widest transition-all ${activeTab === "sponsors" ? "bg-violet-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                        }`}
                >
                    <Building2 size={14} /> Organizations
                </button>
                <button
                    onClick={() => setActiveTab("teams")}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-bold uppercase tracking-widest transition-all ${activeTab === "teams" ? "bg-violet-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                        }`}
                >
                    <Users size={14} /> Team Members
                </button>
            </div>

            {activeTab === "sponsors" && (
                <div className="glass rounded-2xl border border-white/5 overflow-hidden animate-in fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                            <thead className="bg-slate-900/50 border-b border-white/5">
                                <tr>
                                    {["Name", "Email", "Member Since"].map(h => (
                                        <th key={h} className="py-3.5 px-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        {[1, 2, 3].map(j => (
                                            <td key={j} className="py-4 px-5"><div className="h-4 bg-slate-800 rounded animate-pulse w-32" /></td>
                                        ))}
                                    </tr>
                                )) : sponsors.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-16 text-center">
                                            <Building2 size={36} className="text-slate-700 mx-auto mb-3" />
                                            <p className="text-slate-600 font-medium">No sponsors found</p>
                                        </td>
                                    </tr>
                                ) : sponsors.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="py-4 px-5 text-sm font-bold text-white">{s.name || "—"}</td>
                                        <td className="py-4 px-5 text-sm text-slate-400 flex items-center gap-2">
                                            <Mail size={13} className="text-slate-600" />{s.email}
                                        </td>
                                        <td className="py-4 px-5 text-[12px] text-slate-500">
                                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "teams" && (
                <div className="glass rounded-2xl border border-white/5 overflow-hidden animate-in fade-in">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                            <thead className="bg-slate-900/50 border-b border-white/5">
                                <tr>
                                    <th className="py-3.5 px-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Team Member</th>
                                    <th className="py-3.5 px-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Sponsor Org Email</th>
                                    <th className="py-3.5 px-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="py-3.5 px-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="py-3.5 px-5 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        {[1, 2, 3, 4, 5].map(j => (
                                            <td key={j} className="py-4 px-5"><div className="h-4 bg-slate-800 rounded animate-pulse w-24" /></td>
                                        ))}
                                    </tr>
                                )) : teams.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <Users size={36} className="text-slate-700 mx-auto mb-3" />
                                            <p className="text-slate-600 font-medium">No team members found</p>
                                        </td>
                                    </tr>
                                ) : teams.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="text-sm font-bold text-white mb-0.5">{t.name || "Pending user"}</div>
                                            <div className="text-[12px] text-slate-500 flex items-center gap-1.5"><Mail size={12} />{t.email}</div>
                                        </td>
                                        <td className="py-4 px-5 text-sm text-slate-300">
                                            {t.parentSponsorEmail}
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${t.role === 'SPONSOR_ADMIN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    t.role === 'STUDY_MANAGER' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                                        'bg-slate-800 text-slate-400 border-white/10'
                                                }`}>
                                                {t.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className={`flex items-center gap-1.5 font-bold text-[12px] ${t.status === 'ACTIVE' ? 'text-emerald-400' :
                                                    t.status === 'PENDING' ? 'text-amber-400' : 'text-red-400'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-400' :
                                                        t.status === 'PENDING' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
                                                    }`} />
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right flex items-center justify-end gap-2">
                                            {t.status !== 'INACTIVE' && (
                                                <button onClick={() => handleDeactivateUser(t.id)} title="Suspend User Access"
                                                    className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                                                    <Lock size={14} />
                                                </button>
                                            )}
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
