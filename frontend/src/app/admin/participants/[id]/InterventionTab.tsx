"use client";

import { useState } from "react";
import { 
    Binary, 
    FlaskConical, 
    RotateCcw, 
    Plus, 
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    Pill,
    History,
    Package,
    ArrowUpRight,
    Milestone
} from "lucide-react";

export default function InterventionTab({ participantId }: { participantId: string }) {
    const [arm, setArm] = useState("GROUP_A");
    const [regimen, setRegimen] = useState("500mg NAD+ Sublingual / Daily");
    const [showLogForm, setShowLogForm] = useState(false);

    const [dispensingRecords, setDispensingRecords] = useState([
        { id: "DISP-1", date: "2026-03-01", bottleId: "B-9128", units: 30, buffer: "20%", returnExpected: "2026-04-01", coordinator: "Dr. Aris" },
        { id: "DISP-2", date: "2026-02-01", bottleId: "B-8821", units: 30, buffer: "20%", returnExpected: "2026-03-01", coordinator: "Dr. Aris" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Arm Assignment (Spec 10.1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[2rem] border border-white/5 bg-slate-900/40">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-2">
                            <Binary className="text-cyan-400" size={16} /> Treatment Arm
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Assigned Group</p>
                                <p className="text-xl font-black text-white italic tracking-tight">{arm.replace('_', ' ')}</p>
                            </div>
                            
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Standard Regimen</p>
                                <p className="text-sm font-bold text-slate-300 leading-relaxed">{regimen}</p>
                            </div>

                            <button className="w-full py-3 bg-slate-950 border border-white/10 text-slate-500 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mt-4">
                                Reassign Arm (Audit Required)
                            </button>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-[2rem] border border-white/5 bg-amber-500/[0.03]">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-amber-500" size={18} />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Compliance Check</span>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic mb-4">
                            Subject is entering the 20% supply buffer window (Spec 10.2). Refill required within 7 days.
                        </p>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: '85%' }} />
                        </div>
                    </div>
                </div>

                {/* Dispensing Log (Spec 10.1) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                        <div className="p-6 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] flex items-center gap-2">
                                <Pill className="text-cyan-400" size={16} /> Medication Supply Logic
                            </h3>
                            <button 
                                onClick={() => setShowLogForm(true)}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                            >
                                <Plus size={14} /> Record Intervention
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-950/50 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
                                        <th className="px-6 py-4">Bottle ID</th>
                                        <th className="px-6 py-4">Dispensed</th>
                                        <th className="px-6 py-4">Qty (Units)</th>
                                        <th className="px-6 py-4">Buffer</th>
                                        <th className="px-6 py-4">Expected Return</th>
                                        <th className="px-6 py-4 text-right">Vault ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {dispensingRecords.map((log) => (
                                        <tr key={log.id} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 font-mono text-[13px] text-white">
                                                    <Package size={14} className="text-slate-600" /> {log.bottleId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">{log.date}</p>
                                                <p className="text-[10px] text-slate-600 font-bold uppercase">{log.coordinator}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[13px] font-black text-white italic">{log.units} Caps</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-black text-emerald-400/70">{log.buffer}</span>
                                            </td>
                                            <td className="px-6 py-4 text-cyan-500 font-black italic tracking-widest text-[11px]">
                                                {log.returnExpected}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-800 hover:text-white transition-all">
                                                    <History size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Visit Flow Guide (Spec 10.3 Integration) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="glass p-6 rounded-3xl border border-white/5 bg-indigo-500/[0.02]">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="text-indigo-400" size={18} />
                                <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Next Flow Step</span>
                            </div>
                            <h4 className="text-lg font-black text-white italic tracking-tight mb-2 uppercase">Scheduled Visit: Week 4</h4>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-6 italic">Target: 2026-04-01 (In 20 Days)</p>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                    <CheckCircle2 size={12} /> Baseline Forms Verified
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <Clock size={12} /> Pending Anthropometrics Entry
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/60 flex flex-col justify-center items-center text-center">
                            <RotateCcw size={24} className="text-slate-800 mb-2" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 italic italic">Automated Action</p>
                            <button className="px-6 py-2 bg-slate-950 border border-white/10 hover:border-indigo-500/30 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Send 1-Week Visit Reminder
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dispensing Modal Overlay (Simulation) */}
            {showLogForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="glass w-full max-w-xl p-10 rounded-[3rem] border border-white/10 bg-slate-900 shadow-2xl relative">
                        <h2 className="text-2xl font-black text-white italic tracking-tight uppercase mb-8 flex items-center gap-3">
                            <FlaskConical className="text-cyan-500" size={24} /> New Intervention Entry
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Bottle ID</label>
                                <input placeholder="e.g. B-1002" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Units Dispensed</label>
                                <input type="number" defaultValue={30} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Refill Window</label>
                                <select className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all">
                                    <option>30 Days (Standard)</option>
                                    <option>15 Days (Accelerated)</option>
                                    <option>60 Days (Maintenance)</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic italic">Compliance Buffer</label>
                                <div className="px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-sm font-black text-emerald-400 italic font-mono">+20% (Auto)</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowLogForm(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">Cancel</button>
                            <button onClick={() => setShowLogForm(false)} className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center justify-center gap-2">
                                <CheckCircle2 size={16} /> Seal & Dispense
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
