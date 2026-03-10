"use client";

import { useEffect, useState, useCallback } from "react";
import { Megaphone, Mail, RefreshCw, CheckCircle2, AlertCircle, XCircle, Search, Clock, FileText, ChevronRight } from "lucide-react";
import { SuperAdminAuth } from "@/lib/portal-auth";

const TYPE_CONFIG = {
    FACILITY: { icon: Megaphone, label: "Facility Inquiries", color: "text-amber-400", bg: "bg-amber-500/10" },
    CONTACT: { icon: Mail, label: "Contact Inquiries", color: "text-cyan-400", bg: "bg-cyan-500/10" },
    JOB: { icon: FileText, label: "Job Applications", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function WebsiteInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<keyof typeof TYPE_CONFIG>("FACILITY");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const token = SuperAdminAuth.get()?.token || "";

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/super-admin/website/inquiries?type=${type}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setInquiries(await res.json());
            }
        } finally {
            setLoading(false);
        }
    }, [token, type]);

    useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

    const activeInquiry = inquiries.find(i => i.id === selectedId);

    return (
        <div className="space-y-8 max-w-[1400px]">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Megaphone className="text-amber-400" size={28} /> Website Inquiries
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Public website communications portal</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/60 p-1 rounded-xl border border-white/5">
                    {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                        <button key={key} onClick={() => { setType(key as any); setSelectedId(null); }}
                            className={`px-4 py-2 rounded-lg transition-all text-[12px] font-black uppercase tracking-widest flex items-center gap-2 ${type === key ? "bg-amber-600/20 text-amber-300" : "text-slate-500 hover:text-slate-300"}`}>
                            <config.icon size={13} />
                            {key}
                        </button>
                    ))}
                    <div className="w-px h-6 bg-slate-800 mx-1" />
                    <button onClick={fetchInquiries} disabled={loading}
                        className="p-2 text-slate-500 hover:text-white transition-all">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* List Side */}
                <div className="lg:col-span-5 space-y-3">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="glass p-5 rounded-2xl border border-white/5 h-20 animate-pulse" />
                        ))
                    ) : inquiries.length === 0 ? (
                        <div className="glass p-20 text-center rounded-2xl border border-white/5">
                            <Clock size={36} className="text-slate-800 mx-auto mb-3" />
                            <p className="text-slate-600 font-bold">No {type.toLowerCase()} inquiries found.</p>
                        </div>
                    ) : (
                        inquiries.map((i) => (
                            <button key={i.id} onClick={() => setSelectedId(i.id)}
                                className={`w-full glass p-5 rounded-2xl border transition-all text-left group relative cursor-pointer ${selectedId === i.id ? "border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-900/10" : "border-white/5 hover:border-white/10"}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`text-sm font-bold truncate pr-8 ${selectedId === i.id ? "text-amber-300" : "text-white"}`}>{i.name}</h3>
                                    <span className="text-[10px] text-slate-600 font-mono italic">{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : ""}</span>
                                </div>
                                <p className="text-[12px] text-slate-500 truncate mb-1">{i.subject || i.email}</p>
                                <p className="text-[11px] text-slate-600 truncate leading-relaxed">{i.message}</p>
                                {selectedId === i.id && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500">
                                        <ChevronRight size={18} />
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Content Side */}
                <div className="lg:col-span-7 sticky top-6">
                    {!selectedId ? (
                        <div className="glass p-20 text-center rounded-3xl border border-white/5 bg-slate-900/10">
                            <Search size={48} className="text-slate-800/50 mx-auto mb-4" />
                            <p className="text-slate-600 text-lg font-black uppercase tracking-widest">Select an inquiry to view details</p>
                        </div>
                    ) : activeInquiry ? (
                        <div className="glass rounded-3xl border border-white/10 overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
                            <div className="p-6 border-b border-white/10 bg-slate-900/40">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl ${TYPE_CONFIG[type].bg} border border-white/10 flex items-center justify-center`}>
                                            <Mail size={24} className={TYPE_CONFIG[type].color} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white leading-tight">{activeInquiry.name}</h2>
                                            <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest mt-1">{type} Inquiry</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-600 bg-slate-900/50 px-3 py-1.5 rounded-xl border border-white/5">
                                        {activeInquiry.createdAt ? new Date(activeInquiry.createdAt).toLocaleString() : "Date Unknown"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="text-sm font-bold text-white truncate">{activeInquiry.email}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Subject / Facility</p>
                                        <p className="text-sm font-bold text-white truncate">{activeInquiry.subject || "No Subject"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 bg-transparent">
                                <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-4">Message Content</h3>
                                <div className="bg-slate-900/30 p-6 rounded-2xl border border-white/5 min-h-[200px] text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                    {activeInquiry.message || "No message content provided."}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-slate-900/40 flex justify-end gap-3">
                                <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl transition-all text-sm border border-white/5 group">
                                    Mark as Spam
                                </button>
                                <a href={`mailto:${activeInquiry.email}`}
                                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl transition-all text-sm shadow-xl shadow-amber-900/20 flex items-center gap-2 group">
                                    <Mail size={16} /> Reply via Email
                                </a>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
