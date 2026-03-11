"use client";

import { 
    Phone, Mail, MessageSquare, Search, Filter, 
    Calendar, UserPlus, Clock, ArrowUpRight,
    Headset, Mic, Send, History, CheckCircle2,
    Plus, Video, AlertCircle, PhoneCall
} from "lucide-react";
import { useState } from "react";

const recentOutreach = [
    { id: "OUT-101", subject: "Sarah Miller (P-4502)", via: "Phone", result: "Spoke - Interested", date: "2026-03-11 10:00", status: "Resolved" },
    { id: "OUT-102", subject: "James Wilson (Lead)", via: "Text", result: "No Answer", date: "2026-03-11 09:30", status: "Follow-up Set" },
    { id: "OUT-103", subject: "Emma Davis (P-5421)", via: "Email", result: "Sent Study Packet", date: "2026-03-10 16:00", status: "Pending" },
];

export default function CommunicationCenter() {
    const [activeTab, setActiveTab] = useState("Campaigns");

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header (Spec 18.4) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <Headset className="text-cyan-400" size={32} /> Communication Command
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Integrated VOIP, SMS, and Email outreach logic (Spec 18.4).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-cyan-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Plus size={16} /> New Campaign
                    </button>
                    <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <PhoneCall size={16} /> Rapid Dial
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Outreach Hub */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <div className="flex gap-4">
                                {["Campaigns", "Unified Inbox", "Call Log"].map(tab => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Search className="text-slate-600" size={14} />
                                <input placeholder="Find Recipient..." className="bg-transparent border-none outline-none text-[11px] text-white w-32 font-bold uppercase italic" />
                            </div>
                        </div>

                        <div className="p-8 space-y-4">
                            {recentOutreach.map((out) => (
                                <div key={out.id} className="p-6 bg-slate-950/40 border border-white/5 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center ${out.via === 'Phone' ? 'text-cyan-400' : out.via === 'Email' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {out.via === 'Phone' ? <Phone size={20} /> : out.via === 'Email' ? <Mail size={20} /> : <MessageSquare size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-black text-white italic uppercase tracking-tight">{out.subject}</h4>
                                            <div className="flex items-center gap-3 mt-1.5 font-black uppercase text-[10px] tracking-widest italic">
                                                <span className="text-slate-500">{out.via} Outreach</span>
                                                <span className="text-slate-800">•</span>
                                                <span className="text-cyan-500/70">{out.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[12px] font-black text-slate-300 uppercase tracking-tighter italic">{out.result}</p>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1 italic">{out.status}</p>
                                        </div>
                                        <button className="px-5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:border-cyan-500/40 transition-all">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Integrated Dialer Simulation (Spec 18.4) */}
                    <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 border border-white/5 relative overflow-hidden flex items-center justify-between">
                         <div className="absolute top-0 right-0 p-8 text-cyan-500/10">
                            <Mic size={120} />
                         </div>
                         <div className="relative z-10 max-w-md">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4 flex items-center gap-3">
                                Virtual Telecom Node <Phone className="animate-pulse text-cyan-500" size={24} />
                            </h3>
                            <p className="text-slate-500 text-sm font-medium italic mb-8 leading-relaxed">
                                Launch VOIP calls, broadcast SMS campaigns, or personalized email sequences directly from the subject console. All recordings and transcripts are auto-linked to the Participant Registry (Spec 18.4).
                            </p>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-cyan-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl">Initiate Call</button>
                                <button className="px-6 py-3 bg-white/5 text-white text-[11px] font-black uppercase tracking-widest rounded-xl border border-white/10">Broadcast SMS</button>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Engagement Metrics */}
                <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic mb-8 text-center sm:text-left">Daily Outreach KPI</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Total Calls", val: 42, color: "text-cyan-400" },
                                { label: "SMS Sent", val: 128, color: "text-emerald-400" },
                                { label: "Emails", val: 89, color: "text-amber-400" },
                                { label: "Connects", val: "24%", color: "text-indigo-400" },
                            ].map((k, i) => (
                                <div key={i} className="p-5 bg-slate-950/40 rounded-2xl border border-white/5 text-center">
                                    <p className={`text-2xl font-black italic tracking-tighter ${k.color}`}>{k.val}</p>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{k.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule Callback (Spec 18.4) */}
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic">Pending Callbacks</h3>
                            <Calendar size={16} className="text-slate-600" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "David Brown (P-1120)", time: "14:00 Today", icon: AlertCircle, color: "text-red-400" },
                                { name: "Prospect #902", time: "09:00 Tomorrow", icon: Clock, color: "text-amber-400" },
                            ].map((c, i) => (
                                <div key={i} className="flex flex-col p-4 bg-slate-950/60 border border-white/5 rounded-2xl group hover:border-cyan-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <c.icon size={14} className={c.color} />
                                        <span className="text-[12px] font-black text-white italic tracking-tight">{c.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{c.time}</span>
                                        <button className="text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-300">Call Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-[2rem] flex items-center gap-4">
                        <CheckCircle2 className="text-cyan-400 shrink-0" size={20} />
                        <p className="text-[11px] text-slate-500 font-medium italic">
                            All outreach successfully logged to the <strong className="text-slate-300">Governance Audit Trail (Spec 18.1).</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
