"use client";

import { useState } from "react";
import { 
    Search, 
    Filter, 
    MoreVertical, 
    Zap, 
    Mail, 
    Phone, 
    Calendar,
    ChevronRight,
    Users2,
    CheckCircle2,
    AlertCircle,
    BrainCircuit,
    ArrowUpRight,
    ExternalLink,
    X,
    MessageSquare,
    PhoneCall,
    Smartphone,
    UserPlus,
    Upload,
    History,
    CheckCircle,
    Clock,
    UserCheck,
    Database,
    Share2,
    ArrowRight,
    Plus,
    Globe
} from "lucide-react";

// Spec 5.1 & 5.2 Status Options
const LEAD_STATUSES = [
    "New",
    "Contact attempted",
    "No answer",
    "Not interested",
    "Interested",
    "Needs more info",
    "Prescreening in progress",
    "Eligible",
    "Ineligible",
    "Scheduled",
    "Consented",
    "Randomized",
    "Active",
    "Completed"
];

const mockLeads = [
    { id: "L-1024", name: "Sarah Miller", source: "Online Leads", date: "2026-03-09", score: 85, status: "New", study: "NAD+ Longevity", email: "sarah.m@example.com", phone: "+1 (555) 012-3456" },
    { id: "L-1025", name: "James Wilson", source: "Referrals", date: "2026-03-09", score: 92, status: "Contact attempted", study: "NAD+ Longevity", email: "j.wilson@demo.com", phone: "+1 (555) 987-6543" },
    { id: "L-1026", name: "David Brown", source: "MusB Database", date: "2026-03-08", score: 45, status: "Prescreening in progress", study: "Microbiome Study", email: "dbrown@mail.com", phone: "+1 (555) 246-8135" },
    { id: "L-1027", name: "Emma Davis", source: "Offline Manual", date: "2026-03-08", score: 78, status: "Ineligible", study: "NAD+ Longevity", email: "emma.d@test.org", phone: "+1 (555) 135-7924" },
    { id: "L-1028", name: "Michael Roark", source: "Past Participants", date: "2026-03-07", score: 88, status: "Interested", study: "NAD+ Longevity", email: "m.roark@web.com", phone: "+1 (555) 444-5555" },
    { id: "L-1029", name: "Robert Jones", source: "Online Leads", date: "2026-03-07", score: 64, status: "No answer", study: "Microbiome Study", email: "rj@clinical.io", phone: "+1 (555) 777-8888" },
];

export default function LeadManagement() {
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [responseLog, setResponseLog] = useState("");

    const openLeadDetails = (lead: any) => {
        setSelectedLead(lead);
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Participant Lead Center</h1>
                    <p className="text-slate-500 mt-2 font-medium">Recruitment Panel & Lead Relationship Management (Spec 5)</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        <Upload size={14} /> Import Leads
                    </button>
                    <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <Users2 size={16} /> Bulk Outreach
                    </button>
                </div>
            </div>

            {/* AI Eligibility Insights */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-cyan-950/20 to-transparent">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <BrainCircuit size={32} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">Lead Eligibility Engine</h2>
                        <p className="text-slate-500 font-medium max-w-xl text-sm leading-relaxed">System is matching leads against Protocol <span className="text-white italic">NAD-2026-X</span> inclusion logic. <span className="text-emerald-400">12 new matches</span> identified today.</p>
                    </div>
                </div>
                <div className="flex gap-8 md:ml-auto">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Total leads</p>
                        <p className="text-2xl font-black text-white italic">1,284</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Conv. Rate</p>
                        <p className="text-2xl font-black text-emerald-400 italic">14.2%</p>
                    </div>
                </div>
            </div>

            {/* Filters (Spec 5.2) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar-hide">
                    <select className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-300 outline-none focus:border-cyan-500/50 transition-all italic">
                        <option>ALL STUDIES</option>
                        <option>NAD+ LONGEVITY</option>
                        <option>MICROBIOME STUDY</option>
                        <option>HEART RATE VARIABILITY</option>
                    </select>
                    <div className="w-px h-8 bg-white/5 mx-2 hidden lg:block" />
                    {["All", "New", "Interested", "Prescreening", "Eligible"].map(s => (
                        <button 
                            key={s} 
                            onClick={() => setSelectedStatus(s)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedStatus === s ? 'bg-cyan-500 text-white' : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 border border-white/5'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
                        <input type="text" placeholder="Search by name, ID or criteria..." className="bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[13px] text-white outline-none w-full md:w-80 focus:border-cyan-500/50 transition-all font-medium" />
                    </div>
                    <button className="p-2.5 bg-slate-900 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Filter size={18} /></button>
                </div>
            </div>

            {/* Lead Table (Spec 5.2) */}
            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap min-w-[1100px]">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[11px] uppercase tracking-widest text-slate-500 font-black italic">
                                <th className="py-5 px-6">Participant / ID</th>
                                <th className="py-5 px-6">Lead Source</th>
                                <th className="py-5 px-6">Interested Study</th>
                                <th className="py-5 px-6">AI Match</th>
                                <th className="py-5 px-6">Status</th>
                                <th className="py-5 px-6">Date Inbound</th>
                                <th className="py-5 px-6 text-right">Outreach</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300">
                            {mockLeads.map((lead) => (
                                <tr key={lead.id} onClick={() => openLeadDetails(lead)} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-slate-500 group-hover:border-cyan-500/30 transition-all">
                                                {lead.name.split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white uppercase italic group-hover:text-cyan-400 transition-colors">{lead.name}</span>
                                                <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mt-0.5">{lead.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 font-bold text-slate-500 uppercase tracking-widest text-[11px]">{lead.source}</td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            <span className="font-bold text-slate-400 uppercase italic truncate max-w-[150px]">{lead.study}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${lead.score > 80 ? 'bg-emerald-500' : lead.score > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${lead.score}%` }} 
                                                />
                                            </div>
                                            <span className={`font-black italic ${lead.score > 80 ? 'text-emerald-400' : lead.score > 60 ? 'text-amber-400' : 'text-red-400'}`}>{lead.score}%</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                            lead.status === 'New' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                            lead.status === 'Contact attempted' || lead.status === 'Prescreening in progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                            lead.status === 'Ineligible' || lead.status === 'No answer' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 font-bold text-slate-600 uppercase text-[11px]">{lead.date}</td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                                            >
                                                <MessageSquare size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                                            >
                                                <Phone size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recruitment Sidebar Drawer (Spec 5.2 Features) */}
            {isDrawerOpen && selectedLead && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in transition-all" onClick={() => setIsDrawerOpen(false)} />
                    <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#0A1128] border-l border-white/10 z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        {/* Drawer Header */}
                        <div className="p-8 border-b border-white/5 relative">
                            <button onClick={() => setIsDrawerOpen(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl font-black text-cyan-400 italic">
                                    {selectedLead.name.split(' ').map((n:any)=>n[0]).join('')}
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-black text-white italic tracking-tight uppercase leading-none">{selectedLead.name}</h2>
                                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-2">{selectedLead.id} • {selectedLead.source}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-600/20">
                                    <PhoneCall size={14} /> CALL NOW
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all">
                                    <MessageSquare size={14} /> SEND SMS
                                </button>
                            </div>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Personal Identifiers</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Email</p>
                                        <p className="text-[13px] text-slate-300 font-bold">{selectedLead.email}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Phone</p>
                                        <p className="text-[13px] text-slate-300 font-bold">{selectedLead.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Management (Spec 5.2 Status Options) */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Workstream Status</h3>
                                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest">Active State</span>
                                </div>
                                <select 
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-[13px] font-bold focus:border-cyan-500 outline-none transition-all appearance-none italic"
                                    value={selectedLead.status}
                                    onChange={() => {}}
                                >
                                    {LEAD_STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                </select>
                            </div>

                            {/* Response Logging (Spec 5.2) */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Interaction Logging</h3>
                                <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "did not pick phone",
                                            "spoke and not interested",
                                            "interested and wants more info",
                                            "eligible",
                                            "not eligible",
                                            "scheduled visit",
                                            "follow-up needed"
                                        ].map(outcome => (
                                            <button 
                                                key={outcome} 
                                                onClick={() => setResponseLog(outcome)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${responseLog === outcome ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {outcome}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-[13px] text-white focus:border-cyan-500/50 outline-none transition-all h-24 font-medium" 
                                        placeholder="Detailed call notes or participant feedback..."
                                    />
                                    <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-[11px] font-black uppercase tracking-widest text-white rounded-xl transition-all border border-white/5">
                                        Commit Log Entry
                                    </button>
                                </div>
                            </div>

                            {/* Follow-up Tasks (Spec 5.2) */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Operational Tasks</h3>
                                    <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1"><Plus size={12} /> Assign New</button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { task: "Send study brochure PDF", due: "Tomorrow", priority: "High" },
                                        { task: "Verify BMI in medical records", due: "Friday", priority: "Med" }
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                                            <div className="w-5 h-5 rounded border border-slate-700 flex items-center justify-center group-hover:border-cyan-500 transition-colors pointer-cursor">
                                                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-sm opacity-0 group-hover:opacity-20 transition-opacity" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[13px] font-bold text-white uppercase italic tracking-tight">{t.task}</p>
                                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5">Due: {t.due} • {t.priority} Priority</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Audit History */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Event Timeline</h3>
                                <div className="space-y-4 pl-3 border-l border-white/5">
                                    {[
                                        { event: "Inbound Referral Match", date: "2026-03-09 14:20", actor: "System AI" },
                                        { event: "Self-Reported Eligibility Confirmed", date: "2026-03-09 14:22", actor: "Participant" },
                                        { event: "Assigned to Coordinator", date: "2026-03-10 09:00", actor: "Brijesh Patel" },
                                    ].map((h, i) => (
                                        <div key={i} className="relative pb-4">
                                            <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-slate-800 border border-white/10" />
                                            <p className="text-[12px] font-bold text-slate-300 leading-tight">{h.event}</p>
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">{h.date} • {h.actor}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-8 border-t border-white/5 bg-slate-950/20">
                            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                                <UserCheck size={18} /> PROMOTE TO PARTICIPANT
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Import Modal (Spec 5.1 & 5.2 Upload Contacts) */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-6">
                    <div className="bg-[#0A1128] border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-white/5 relative">
                            <button onClick={() => setIsImportModalOpen(false)} className="absolute top-10 right-10 p-2 text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Ingest Participant Data</h2>
                            <p className="text-slate-500 font-medium">Select source protocol for inbound clinical trial leads (Spec 5.1).</p>
                        </div>
                        <div className="p-10 grid grid-cols-2 gap-6">
                            {[
                                { title: "Online Leads", icon: Globe, count: "Pending Sync" },
                                { title: "Offline Manual", icon: Upload, count: "CSV/Excel" },
                                { title: "MusB Database", icon: Database, count: "12k+ Records" },
                                { title: "Referrals", icon: Share2, count: "Partner Link" },
                                { title: "Past Participants", icon: History, count: "Active Sync" },
                                { title: "Direct Entry", icon: UserPlus, count: "Single Record" },
                            ].map((s, i) => (
                                <div key={i} className="p-6 bg-slate-900 border border-white/5 rounded-[2rem] hover:border-cyan-500/30 transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-slate-950 text-cyan-400 border border-white/5 group-hover:scale-110 transition-transform">
                                            <s.icon size={22} />
                                        </div>
                                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{s.count}</span>
                                    </div>
                                    <h4 className="text-lg font-black text-white uppercase italic tracking-tight group-hover:text-cyan-400 transition-colors">{s.title}</h4>
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-cyan-500/50 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                                        Select Source <ArrowRight size={10} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-10 pb-10">
                            <button onClick={() => setIsImportModalOpen(false)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all text-sm">
                                Cancel Operation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
