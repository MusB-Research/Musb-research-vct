"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    Activity,
    FileText,
    Package,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Database,
    Binary
} from "lucide-react";
import ManualEntryTab from "./ManualEntryTab";
import ParticipantTasksTab from "./ParticipantTasksTab";
import InterventionTab from "./InterventionTab";
import KitsTab from "./KitsTab";
import LabsTab from "./LabsTab";
import CompensationTab from "./CompensationTab";
import CompletionTab from "./CompletionTab";

export default function ParticipantDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [participant, setParticipant] = useState<any>(null);
    const [screener, setScreener] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (session) {
            const fetchData = async () => {
                try {
                    const [pRes, sRes] = await Promise.all([
                        fetch(`/api/proxy/participants/${id}`),
                        fetch(`/api/proxy/participants/screener/${id}`)
                    ]);
                    const pData = await pRes.json();
                    const sData = await sRes.json();
                    setParticipant(pData);
                    setScreener(sData);
                } catch (err) {
                    console.error("Detail fetch error", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id, session]);

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "timeline", label: "Timeline" },
        { id: "eligibility", label: "Eligibility" },
        { id: "intake", label: "Intake Profile" },
        { id: "intervention", label: "Intervention" },
        { id: "kits", label: "Kits" },
        { id: "labs", label: "Labs" },
        { id: "compensation", label: "Compensation" },
        { id: "completion", label: "Completion" },
        { id: "tasks", label: "Tasks" },
        { id: "logs", label: "Daily Logs" },
        { id: "documents", label: "Documents" },
        { id: "manual", label: "Manual Entry" },
    ];

    if (loading || !participant) {
        return (
            <div className="flex justify-center py-40">
                <Loader2 className="animate-spin text-cyan-500" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div>
                <Link href="/admin/participants" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
                    <ChevronLeft size={16} /> Back to Participants
                </Link>

                <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                        <div className="flex gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5 shadow-2xl">
                                <User size={40} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-black text-white">{participant.name || "Anonymous"}</h1>
                                    <span className={`px-3 py-1 rounded-lg text-[13px] font-black uppercase tracking-widest border ${participant.status === "ACTIVE" || participant.status === "ENROLLED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"}`}>
                                        {participant.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm font-bold flex items-center gap-4 mb-4">
                                    <span className="flex items-center gap-1"><Mail size={14} /> {participant.email}</span>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                    <span className="flex items-center gap-1"><Phone size={14} /> {participant.phone || "No Phone"}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8 border-l border-white/5 pl-8">
                            <div>
                                <p className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-1">Study</p>
                                <p className="text-white font-bold mb-4">{participant.studyTitle || "Unassigned"}</p>
                                <p className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-1">Enrolled</p>
                                <p className="text-white font-bold">{participant.consentedAt ? new Date(participant.consentedAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-1">Adherence</p>
                                <p className="text-emerald-400 font-black text-2xl mb-2">92%</p>
                                <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `92%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 border-b border-white/5 mb-8 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-[13px] font-bold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-500 hover:text-white'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="glass p-6 rounded-2xl border border-white/5">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Activity size={18} className="text-cyan-400" /> Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { title: "Daily Supplement Log", time: "Today, 9:00 AM", status: "Completed", icon: CheckCircle2, color: "text-emerald-400" },
                                        { title: "Week 2 Symptom Survey", time: "Yesterday, 2:30 PM", status: "Completed", icon: FileText, color: "text-purple-400" },
                                        { title: "Kit Shipment Delivered", time: "Jan 15, 2026", status: "System", icon: Package, color: "text-cyan-400" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
                                            <div className={`p-2 rounded-full bg-slate-800 ${item.color}`}>
                                                <item.icon size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold text-sm">{item.title}</h4>
                                                <p className="text-slate-500 text-[13px]">{item.time}</p>
                                            </div>
                                            <span className="text-[13px] uppercase font-bold text-slate-400 tracking-wider px-2 py-1 rounded bg-slate-800">{item.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="glass p-6 rounded-2xl border border-white/5">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-red-400" /> Outstanding Tasks
                                </h3>
                                <div className="text-center py-8 text-slate-500 text-sm">No outstanding tasks.</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'eligibility' && (
                    <div className="glass p-8 rounded-2xl border border-white/5">
                        <h3 className="text-white font-bold mb-6">Screening Responses</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {screener?.responses ? Object.entries(screener.responses).map(([q, a], i) => (
                                <div key={i} className="pb-4 border-b border-white/5">
                                    <p className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-1">{q}</p>
                                    <p className="text-white font-bold">{String(a)}</p>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center py-8 text-slate-500">No screening data available.</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'intake' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                                <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-3 italic">
                                    <User size={18} className="text-cyan-400" /> Identity & Demographics
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {[
                                        { label: "Legal First Name", val: participant.firstName || "Sarah" },
                                        { label: "Legal Last Name", val: participant.lastName || "Miller" },
                                        { label: "Date of Birth", val: participant.dob || "1988-05-12" },
                                        { label: "Phone", val: participant.phone || "+1 (555) 123-4567" },
                                        { label: "Email", val: participant.email || "sarah.m@example.com" }
                                    ].map((f, i) => (
                                        <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">{f.label}</span>
                                            <span className="text-sm font-bold text-white">{f.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                                <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-3 italic">
                                    <Database size={18} className="text-blue-400" /> Residence & ID
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block italic">Verified Address</label>
                                        <p className="text-sm text-slate-300 font-medium bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                            742 Evergreen Terrace,<br />Springfield, OR 97403
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-widest">ID VERIFIED</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Driving License (Exp: 2028)</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors">View Document</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 rounded-3xl border border-white/5">
                            <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-3 italic mb-8">
                                <FileText size={18} className="text-purple-400" /> Medical History & Baseline Forms
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Surgical History", status: "Provided", date: "Jan 10, 2026" },
                                    { title: "Allergy Report", status: "Provided", date: "Jan 10, 2026" },
                                    { title: "Medication List", status: "Updated", date: "Today" },
                                    { title: "Screener V1", status: "Verified", date: "Jan 05, 2026" },
                                    { title: "Baseline Survey", status: "Provided", date: "Jan 12, 2026" },
                                    { title: "Imaging Release", status: "Signed", date: "Jan 10, 2026" }
                                ].map((doc, i) => (
                                    <div key={i} className="p-4 bg-slate-900 border border-white/5 hover:border-white/10 rounded-2xl transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors uppercase">{doc.title}</h4>
                                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase">{doc.status}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{doc.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'intervention' && (
                    <InterventionTab participantId={id} />
                )}

                {activeTab === 'kits' && (
                    <KitsTab participantId={id} />
                )}

                {activeTab === 'labs' && (
                    <LabsTab participantId={id} />
                )}

                {activeTab === 'compensation' && (
                    <CompensationTab participantId={id} />
                )}

                {activeTab === 'completion' && (
                    <CompletionTab participantId={id} />
                )}

                {activeTab === 'manual' && (
                    <ManualEntryTab participantId={id} />
                )}

                {activeTab === 'tasks' && (
                    <ParticipantTasksTab participantId={id} />
                )}
            </div>
        </div>
    );
}
