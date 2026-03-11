"use client";

import { useState } from "react";
import { 
    Package, 
    Truck, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    FlaskConical,
    CloudDownload,
    MailCheck,
    History,
    Plus,
    Box
} from "lucide-react";

export default function KitsTab({ participantId }: { participantId: string }) {
    const [kits, setKits] = useState([
        { id: "K-9128", type: "Gut Microbiome Kit", purpose: "BASELINE", status: "RECEIVED_AT_SITE", date: "2026-03-01", siteDate: "2026-03-05" },
        { id: "K-8821", type: "Blood Collection Set", purpose: "INTERIM", status: "AWAITING_COLLECTION", date: "2026-03-08", dueDate: "2026-03-22" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header / Quick Assign (Spec 11.1) */}
            <div className="flex justify-between items-center">
                <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] flex items-center gap-2">
                    <Package className="text-emerald-500" size={18} /> Subject Specimen Inventory
                </h3>
                <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10">
                    <Plus size={14} /> New Kit Assignment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kit List Tracking (Spec 11.3) */}
                <div className="lg:col-span-2 space-y-6">
                    {kits.map((kit) => (
                        <div key={kit.id} className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 relative group hover:border-emerald-500/20 transition-all">
                            <div className="absolute right-8 top-8 opacity-10 group-hover:opacity-20 transition-all">
                                <Box size={60} className="text-emerald-400" />
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-xl font-black text-white italic uppercase tracking-tight">{kit.type}</h4>
                                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase border border-indigo-500/20 italic">{kit.purpose}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Serial: {kit.id}</p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 rounded-lg border border-white/5">
                                            <Clock size={12} className="text-slate-600" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Assigned {kit.date}</span>
                                        </div>
                                        {kit.dueDate && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 rounded-lg border border-amber-500/10">
                                                <AlertCircle size={12} className="text-amber-500" />
                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Action Due {kit.dueDate}</span>
                                            </div>
                                        )}
                                        {kit.siteDate && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Site Receipt {kit.siteDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between min-w-[200px]">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black italic tracking-[0.2em] uppercase border ${
                                        kit.status === 'RECEIVED_AT_SITE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                    }`}>
                                        {kit.status.replace(/_/g, ' ')}
                                    </span>
                                    
                                    <div className="flex gap-2 mt-4 md:mt-0">
                                        <button className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-white border border-white/5 transition-all outline-none" title="Download Instructions">
                                            <CloudDownload size={16} />
                                        </button>
                                        <button className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-white border border-white/5 transition-all outline-none" title="Audit Log">
                                            <History size={16} />
                                        </button>
                                        <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all border border-white/5">
                                            Update State
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tracking Flow Visualization & Context (Spec 11.2) */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-2">
                            <Truck className="text-cyan-500" size={16} /> Fulfillment Journey
                        </h3>
                        <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                            {[
                                { state: "Instructions Sent", date: "2026-03-01", done: true, icon: MailCheck },
                                { state: "Specimen Collected", date: "2026-03-04", done: true, icon: FlaskConical },
                                { state: "FedEx Shipped", date: "2026-03-04", done: true, icon: Truck },
                                { state: "Site Integration", date: "2026-03-05", done: true, icon: CheckCircle2 },
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6 relative group">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.done ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-950 border border-white/5 text-slate-700'}`}>
                                        <step.icon size={12} />
                                    </div>
                                    <div>
                                        <p className={`text-[11px] font-black uppercase tracking-widest italic ${step.done ? 'text-white' : 'text-slate-600'}`}>{step.state}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Spec 11.2 Reminder Insight */}
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-indigo-500/[0.03]">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-indigo-400" size={18} />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Reminder Engine</span>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic mb-6">
                            Next Reminder: INTERIM Collection notice for Subject {participantId}. Auto-triggering in 72 hours.
                        </p>
                        <button className="w-full py-4 bg-slate-950 border border-white/10 text-indigo-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            Force Manual SMS Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
