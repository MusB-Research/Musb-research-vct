"use client";

import {
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    Mail,
    Phone,
    User,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";


// Status styles mapping
const statusStyles: any = {
    "ACTIVE": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "CONSENTED": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "SCREENED": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "ENROLLED": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "LEAD": "bg-slate-500/10 text-slate-400 border-slate-500/20",
    "COMPLETED": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};


export default function ParticipantsPage() {
    const { data: session } = useSession();
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (session) {
            fetch("/api/proxy/participants")
                .then(res => res.json())
                .then(data => {
                    setParticipants(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Participants fetch error", err);
                    setLoading(false);
                });
        }
    }, [session]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredParticipants = participants.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredParticipants.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredParticipants.map(p => p.id));
        }
    };

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Participant Registry</h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitoring enrolled subjects and screening leads across global sites.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/participants/new" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[12px] rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <UserPlus size={16} /> Register Participant
                    </Link>
                    <div className="text-right">
                        <div className="text-[13px] font-black text-slate-500 uppercase tracking-widest italic mb-1">Total Records</div>
                        <div className="text-2xl font-black text-white italic">{participants.length}</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter by name, USUBJID, or assigned study..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all font-medium italic"
                    />
                </div>
                <button className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-3 text-[13px] font-black uppercase tracking-widest italic">
                    <Filter size={16} /> Advanced Filter
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-cyan-500" size={40} />
                </div>
            ) : (
                /* Table */
                <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl overflow-x-auto relative mb-24">
                    <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[11px] uppercase tracking-widest text-slate-500 font-black italic">
                                <th className="py-5 px-6 italic">Patient ID</th>
                                <th className="py-5 px-6 italic">Patient Name</th>
                                <th className="py-5 px-6 italic">Assigned Study & Arm</th>
                                <th className="py-5 px-6 italic">Stage</th>
                                <th className="py-5 px-6 italic">Enrollment Date</th>
                                <th className="py-5 px-6 italic">Last Activity</th>
                                <th className="py-5 px-6 italic">Status</th>
                                <th className="py-5 px-6 text-right italic">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300">
                            {filteredParticipants.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-6 font-mono text-cyan-500/80 font-bold uppercase">{p.id.slice(-8).toUpperCase()}</td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic">{p.name || "Anonymous"}</span>
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{p.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-300 italic">{p.studyTitle || "Unassigned"}</span>
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{p.arm || "No Arm Assigned"}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 font-bold text-slate-400 uppercase italic tracking-tight">{p.stage || "Screening"}</td>
                                    <td className="py-5 px-6 font-bold text-slate-500 uppercase italic">{p.enrolledAt || p.createdAt?.split('T')[0] || "N/A"}</td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-slate-600" />
                                            <span className="text-slate-500 font-bold italic">{p.lastActivity || "Today"}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${statusStyles[p.status] || statusStyles['LEAD']}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/participants/${p.id}`} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-white/5 transition-all">
                                                <User size={14} />
                                            </Link>
                                            <div className="relative group/actions">
                                                <button className="p-2 hover:bg-white/5 text-slate-500 rounded-lg transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 hidden group-hover/actions:block w-48 bg-[#0a1120] border border-white/10 rounded-xl shadow-2xl z-50 py-1">
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300">Message Patient</button>
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300">Log Visit</button>
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300">Dispense Kit</button>
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300">Update Status</button>
                                                    <div className="h-px bg-white/5 my-1" />
                                                    <button className="w-full text-left px-4 py-2 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-red-400/80">Mark Dropped</button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-900 border border-cyan-500/30 px-8 py-4 rounded-3xl shadow-2xl glass z-50 animate-fade-in-up">
                    <div className="text-[13px] font-black text-white italic tracking-widest uppercase">
                        {selectedIds.length} Subjects Selected
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <div className="flex gap-4">
                        <button className="text-[13px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all">Send SMS Reminder</button>
                        <button className="text-[13px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all">Assign to Study</button>
                        <button className="text-[13px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest transition-all">Bulk Deny</button>
                    </div>
                    <button onClick={() => setSelectedIds([])} className="ml-4 p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
                        <CheckCircle2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

