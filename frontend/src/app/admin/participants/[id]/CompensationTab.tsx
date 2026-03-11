"use client";

import { useState } from "react";
import { 
    Banknote, 
    CheckCircle2, 
    AlertCircle, 
    Lock, 
    Unlock, 
    History, 
    Plus,
    DollarSign,
    PartyPopper,
    Send,
    Loader2,
    ShieldCheck,
    Smartphone
} from "lucide-react";

export default function CompensationTab({ participantId }: { participantId: string }) {
    const [isComplete, setIsComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [recontactFlag, setRecontactFlag] = useState(true);

    const [payments, setPayments] = useState([
        { id: "PAY-101", visit: "Baseline", owed: 150, paid: 150, date: "2026-03-01", status: "Paid", method: "Direct Deposit" },
        { id: "PAY-102", visit: "Week 4", owed: 200, paid: 0, date: "N/A", status: "Earned", method: "ACH" },
    ]);

    const handleCompleteStudy = () => {
        setIsProcessing(true);
        // Spec 13.2: mark complete, lock records, send thank you
        setTimeout(() => {
            setIsComplete(true);
            setIsProcessing(false);
            setShowCompleteModal(false);
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Spec 13.1 Participant View */}
            <div className="flex justify-between items-center">
                <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] flex items-center gap-2">
                    <Banknote className="text-emerald-500" size={18} /> Disbursement Ledger
                </h3>
                {!isComplete && (
                    <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/10">
                        <Plus size={14} /> Log Manual Payment
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment History Tracker (Spec 13.1) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
                                <tr>
                                    <th className="px-6 py-4">Visit Number</th>
                                    <th className="px-6 py-4">Amount Owed</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.map((p) => (
                                    <tr key={p.id} className="group hover:bg-white/[0.01]">
                                        <td className="px-6 py-5">
                                            <p className="font-black text-white italic text-[13px] uppercase tracking-tight">{p.visit}</p>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase">{p.method}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-lg font-black text-white italic">${p.owed}</p>
                                            <p className={`text-[10px] font-bold uppercase ${p.status === 'Paid' ? 'text-emerald-500' : 'text-slate-500'}`}>{p.status === 'Paid' ? `Paid ${p.date}` : 'Earned'}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-mono text-[10px] text-slate-600 uppercase">{p.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Completion Alert (Spec 13.2) */}
                    {isComplete ? (
                        <div className="p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center">
                            <PartyPopper size={48} className="text-emerald-500 mb-4" />
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">Subject Participation Complete</h3>
                            <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed italic mb-6">
                                Final compensation logged. Record is now **LOCKED** from further clinical data entry. Automated thank-you transmission confirmed.
                            </p>
                            <div className="flex gap-4">
                                <button className="px-6 py-2.5 bg-slate-900 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <History size={14} /> Audit Sequence
                                </button>
                                <button className="px-6 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Send size={14} /> Message Subject
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-[2.5rem] bg-indigo-500/[0.02] border border-indigo-500/10">
                            <h4 className="text-white font-black italic uppercase tracking-widest text-[12px] mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-indigo-400" size={16} /> Completion Sequence
                            </h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic mb-6 uppercase tracking-tight">
                                Final visit verification pending. Once confirmed, you must seal the subject record to trigger final disbursement and terminal audit hashing.
                            </p>
                            <button 
                                onClick={() => setShowCompleteModal(true)}
                                className="w-full py-4 bg-slate-950 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all italic"
                            >
                                Initiate Completion Sequence
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Logic Guidance */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-2">
                            <Lock className="text-cyan-500" size={16} /> Data Sovereignty (13.2)
                        </h3>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-2xl border transition-all ${isComplete ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-950/50 border-white/5'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-black text-white uppercase italic tracking-tight">Data Entry Lock</span>
                                    {isComplete ? <Lock size={14} className="text-red-400" /> : <Unlock size={14} className="text-emerald-500" />}
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic uppercase">
                                    {isComplete ? 'All clinical forms & measures are PERMANENTLY SEALED.' : 'Subject record is open for modification.'}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-black text-white uppercase italic tracking-tight italic">Terminal Comms</span>
                                    <Smartphone size={14} className="text-cyan-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic uppercase">
                                    Messaging & Email portal remains ACTIVE for follow-up support.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-emerald-500/[0.02]">
                        <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-4 italic italic">Automated Action Logic</h4>
                        <div className="flex items-start gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter italic">
                                Thank-you manifest prepared. System will transmit 24h after completion seal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Terminal (Spec 13.2) */}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
                    <div className="glass w-full max-w-xl p-12 rounded-[3.5rem] border border-white/10 bg-slate-950 shadow-2xl relative">
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-pulse border border-emerald-500/20">
                                <ShieldCheck size={40} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-white italic tracking-tight uppercase text-center mb-4">Confirm Study Completion</h2>
                        <p className="text-slate-500 text-center mb-10 text-sm leading-relaxed italic px-4 uppercase tracking-tight">
                            You are about to initiate the terminal sequence for Subject {participantId}. This action will lock clinical records and authorize final disbursements.
                        </p>
                        
                        <div className="space-y-6 mb-10">
                            <div className="flex items-center justify-between p-5 bg-slate-900/50 rounded-3xl border border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-white uppercase italic">Retention Opt-In</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Flag for future recontact research</p>
                                </div>
                                <button 
                                    onClick={() => setRecontactFlag(!recontactFlag)}
                                    className={`w-14 h-7 rounded-full transition-all relative ${recontactFlag ? 'bg-emerald-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${recontactFlag ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4">
                                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-1" />
                                <p className="text-[11px] text-amber-500/80 font-bold leading-relaxed uppercase tracking-tighter italic">
                                    WARNING: Clinical measures (Vitals, Lab Intake, Regimen Logs) will become READ-ONLY after sealing. PII data will still be accessible to authorized coordinators.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowCompleteModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">Abort Sequence</button>
                            <button 
                                onClick={handleCompleteStudy}
                                disabled={isProcessing}
                                className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {isProcessing ? "Processing Seal..." : "Authorize Completion & Seal"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
