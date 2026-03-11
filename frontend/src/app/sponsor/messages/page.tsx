"use client";

import { 
    MessageSquare, Users, Search, MoreHorizontal, Send, 
    Paperclip, Shield, ShieldCheck, Lock, Activity,
    Globe, Clock, ArrowUpRight, CheckCircle2
} from "lucide-react";

export default function SponsorMessagesPage() {
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-in fade-in duration-700 pb-10">
            {/* Header (Spec 15.1, 15.6) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <MessageSquare className="text-amber-500" size={32} /> Communication Vault
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Secure institutional channel for protocol oversight (Spec 15.6).</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">End-to-End Encrypted</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-[3rem] flex overflow-hidden shadow-2xl">
                {/* Contacts Panel */}
                <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/20">
                    <div className="p-6 border-b border-white/5">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search Investigators..." 
                                className="w-full bg-slate-950 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-[11px] text-slate-400 outline-none focus:border-amber-500/30 transition-all font-bold uppercase tracking-widest" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                        {[
                            { name: "Principal Investigator", role: "Dr. Alexander Chen", active: true, time: "2m ago" },
                            { name: "Lead Site Coordinator", role: "Brijesh (Site Alpha)", active: false, time: "1h ago" },
                            { name: "Medical Monitor", role: "Institutional Unit", active: true, time: "Online" },
                        ].map((c, i) => (
                            <div key={i} className={`p-4 rounded-[1.5rem] transition-all cursor-pointer group flex items-center gap-3 ${i === 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'hover:bg-white/5 border border-transparent'}`}>
                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center relative">
                                    <Users size={18} className={i === 0 ? 'text-amber-500' : 'text-slate-500'} />
                                    {c.active && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-black text-white italic uppercase tracking-tight truncate">{c.name}</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">{c.role}</p>
                                </div>
                                <span className="text-[8px] font-black text-slate-700 uppercase">{c.time}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-white/5 text-center">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Compliance: No Participant Direct Messaging (Spec 17.1)</p>
                    </div>
                </div>

                {/* Secure Chat Terminal */}
                <div className="flex-1 flex flex-col relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                    
                    {/* Active Header */}
                    <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Users size={20} className="text-amber-500" />
                             </div>
                             <div>
                                <h3 className="text-[14px] font-black text-white italic uppercase tracking-tight">Principal Investigator</h3>
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                                    <Activity size={10} /> Operational Oversight Active
                                </p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <button className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Clock size={18} /></button>
                            <button className="p-2.5 bg-slate-950 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><MoreHorizontal size={18} /></button>
                         </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-8 relative z-10 custom-scrollbar">
                        <div className="flex flex-col items-center mb-10">
                             <div className="px-4 py-1.5 bg-slate-900 border border-white/5 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] italic mb-4">Transcript Link: NAD-001 Protocol</div>
                             <div className="p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-[2.5rem] text-center max-w-sm">
                                <Lock className="text-amber-500/30 mx-auto mb-3" size={32} />
                                <p className="text-[11px] text-slate-500 italic font-medium">All communications are logged for GxP Compliance (Spec 18.1). Direct Subject IDs are de-identified (Spec 17.1).</p>
                             </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center shrink-0 h-fit">
                                <Users size={18} className="text-slate-500" />
                            </div>
                            <div className="max-w-md bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] rounded-tl-none italic">
                                <p className="text-sm text-slate-300 leading-relaxed">Sponsor Oversight: We have updated the recruitment funnel for Site Alpha. Please review the de-identified participant data table for Subject P-452-Y1 regarding the interim efficacy shift.</p>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-4">10:45 AM · Dr. Alexander Chen</p>
                            </div>
                        </div>

                        <div className="flex gap-4 flex-row-reverse">
                            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shrink-0 h-fit shadow-lg shadow-amber-600/20">
                                <Globe size={18} className="text-white" />
                            </div>
                            <div className="max-w-md bg-amber-600/10 border border-amber-600/20 p-5 rounded-[2rem] rounded-tr-none italic text-right">
                                <p className="text-sm text-slate-200 leading-relaxed font-medium">Acknowledged. The data integrity score for P-452-Y1 remains at 99.8%. We will verify the final sign-off by EOD.</p>
                                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-4">11:02 AM · Sponsor Hub (You)</p>
                            </div>
                        </div>
                    </div>

                    {/* Input Node */}
                    <div className="p-8 border-t border-white/5 bg-slate-950/40 relative z-10">
                        <div className="bg-slate-950 border border-white/10 rounded-[2rem] p-2 flex items-center gap-3 focus-within:border-amber-500/30 transition-all shadow-xl">
                            <button className="p-3 text-slate-600 hover:text-amber-500 transition-colors"><Paperclip size={20} /></button>
                            <input 
                                type="text" 
                                placeholder="Type a secure institutional message..." 
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white italic font-medium px-2" 
                            />
                            <button className="h-14 w-14 bg-amber-600 hover:bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all shadow-amber-600/20">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
