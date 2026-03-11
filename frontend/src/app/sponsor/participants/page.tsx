"use client";

import { useState, useEffect } from "react";
import { 
    Users, Search, Filter, ShieldCheck, ArrowUpRight, 
    MoreHorizontal, Download, FlaskConical, Calendar,
    Lock, CheckCircle2, Clock
} from "lucide-react";
import { sponsoredStudies } from "../data";

// Mock de-identified participant data
const deidentifiedParticipants = [
    { id: "P-821-X9", age: 43, gender: "F", arm: "Treatment Group", status: "Active", progress: 65, lastVisit: "Feb 14, 2025", nextVisit: "Mar 01, 2025" },
    { id: "P-452-Y1", age: 52, gender: "M", arm: "Control Group", status: "Active", progress: 90, lastVisit: "Feb 16, 2025", nextVisit: "Mar 15, 2025" },
    { id: "P-109-Z4", age: 31, gender: "F", arm: "Treatment Group", status: "Completed", progress: 100, lastVisit: "Feb 01, 2025", nextVisit: "N/A" },
    { id: "P-772-K3", age: 67, gender: "F", arm: "Control Group", status: "Withdrawn", progress: 20, lastVisit: "Jan 12, 2025", nextVisit: "N/A" },
    { id: "P-332-L9", age: 48, gender: "M", arm: "Treatment Group", status: "Active", progress: 40, lastVisit: "Feb 18, 2025", nextVisit: "Mar 10, 2025" },
    { id: "P-901-M2", age: 55, gender: "M", arm: "Placebo Group", status: "Active", progress: 15, lastVisit: "Feb 19, 2025", nextVisit: "Mar 05, 2025" },
];

export default function SponsorParticipantsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [participants, setParticipants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const res = await fetch("/api/proxy/sponsor/participants");
                if (res.ok) {
                    const data = await res.json();
                    setParticipants(data);
                }
            } catch (error) {
                console.error("Error fetching participants:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchParticipants();
    }, []);

    const filteredParticipants = participants.filter(p => 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.arm.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        Participant Insights
                        <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20" title="De-identified View Active">
                            <ShieldCheck size={20} />
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                        <Lock size={14} /> Strict De-identification Protocol Active (PII Scrubbed)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2 font-sans">
                        <Download size={14} /> Export CSV
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input 
                            type="text" 
                            placeholder="Anonymized ID Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-300 focus:border-amber-500/50 outline-none w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Privacy Alert */}
            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                    <ShieldCheck size={18} />
                </div>
                <div>
                    <h4 className="text-[13px] font-black text-amber-500 uppercase tracking-widest mb-1">HIPAA / GDPR Compliance Mode</h4>
                    <p className="text-[12px] text-slate-500 font-medium">Under Sponsor Access Level, all Personal Identifiable Information (PII) including Name, Email, Phone, and precise Date of Birth have been masked. Only anonymized identifiers and study-relevant demographics are visible.</p>
                </div>
            </div>

            {/* Participant Table */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center">
                        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Scrubbing PII Data...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Anonymized ID</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Demog (Age/Gen)</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Study Arm</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Status</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Progress</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Last Activity</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredParticipants.map((p, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.01] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:border-amber-500/20 transition-all">
                                                <Users size={18} className="text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white italic tracking-tight">{p.id}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase">Anonymized</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[13px] font-black text-slate-300 italic">{p.age}y · {p.gender}</p>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">De-ID Bio</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <FlaskConical size={14} className="text-amber-500/40" />
                                            <span className="text-[13px] font-bold text-slate-400">{p.arm}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                            p.status === 'ACTIVE' || p.status === 'ENROLLED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            p.status === 'COMPLETED' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                            'bg-slate-800 text-slate-500 border-white/5'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${p.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'} transition-all`} 
                                                    style={{ width: `${p.progress}%` }} 
                                                />
                                            </div>
                                            <span className="text-[12px] font-black text-white">{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                                            <Calendar size={14} />
                                            {p.lastActivity || p.lastVisit}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-slate-700 hover:text-white transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredParticipants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-600 italic font-medium">
                                        No participants found matching current criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
