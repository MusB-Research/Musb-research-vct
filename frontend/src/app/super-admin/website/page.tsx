"use client";

import { useEffect, useState, useCallback } from "react";
import { Globe, Users, Megaphone, RefreshCw, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { SuperAdminAuth } from "@/lib/portal-auth";

export default function WebsiteManagementPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = SuperAdminAuth.get()?.token;

    const fetchSubscribers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/super-admin/website/subscribers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setSubscribers(await res.json());
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

    return (
        <div className="space-y-8 max-w-[1400px]">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Globe className="text-cyan-400" size={28} /> Website Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        Unified control for the MusB Research public website module.
                    </p>
                </div>
                <button onClick={fetchSubscribers} disabled={loading}
                    className="p-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-slate-400 rounded-xl transition-all">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscribers Card */}
                <div className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-white/5 bg-slate-900/20 flex justify-between items-center">
                        <h2 className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Mail size={14} className="text-cyan-400" /> Newsletter Subscribers
                        </h2>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {subscribers.length} total
                        </span>
                    </div>
                    <div className="flex-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-10 text-center animate-pulse text-slate-600">Loading subscribers...</div>
                        ) : subscribers.length === 0 ? (
                            <div className="p-10 text-center text-slate-600 font-medium">No subscribers found.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-900 z-10 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="px-5 py-3">Email Address</th>
                                        <th className="px-5 py-3">Date Joined</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {subscribers.map((s) => (
                                        <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-3 text-sm font-bold text-white">{s.email}</td>
                                            <td className="px-5 py-3 text-[12px] text-slate-500">
                                                {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${s.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                                    {s.active ? "ACTIVE" : "UNSUBSCRIBED"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Links / Status */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-4">Module Health</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-bold text-slate-300">Website Backend (Module B)</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Connected</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-bold text-slate-300">Database Synchronization</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/10 to-transparent">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-2">Notice</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Changes made here affect the public landing pages and recruitment portal.
                            The database is shared across both modules to ensure seamless data flow from initial inquiry to clinical participation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
