"use client";

import { useState } from "react";
import { 
    Banknote, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ArrowUpRight, 
    ChevronRight,
    Wallet,
    DollarSign,
    CreditCard,
    TrendingUp,
    ExternalLink,
    PieChart,
    X,
    ShieldCheck,
    CheckCircle,
    Loader2
} from "lucide-react";

interface CompensationRecord {
    id: string;
    participantId: string;
    participantName: string;
    study: string;
    visitNumber: number | string;
    amountOwed: number;
    amountPaid: number;
    paymentDate?: string;
    paymentMethod: "Direct Deposit" | "Stripe Connect" | "PayPal" | "Check" | "Cash";
    status: "Earned" | "Processing" | "Paid" | "Flagged";
    notes?: string;
}

const INITIAL_RECORDS: CompensationRecord[] = [
    { id: "PAY-501", participantId: "P-4502", participantName: "Sarah Miller", study: "NAD+ Longevity", visitNumber: "Baseline", amountOwed: 150, amountPaid: 150, paymentDate: "2026-03-09", status: "Paid", paymentMethod: "Direct Deposit" },
    { id: "PAY-502", participantId: "P-7721", participantName: "James Wilson", study: "NAD+ Longevity", visitNumber: 2, amountOwed: 75, amountPaid: 0, status: "Processing", paymentMethod: "Stripe Connect" },
    { id: "PAY-503", participantId: "P-1120", participantName: "David Brown", study: "Microbiome Study", visitNumber: 1, amountOwed: 50, amountPaid: 0, status: "Earned", paymentMethod: "PayPal" },
    { id: "PAY-504", participantId: "P-8832", participantName: "Emma Davis", study: "NAD+ Longevity", visitNumber: 4, amountOwed: 200, amountPaid: 0, status: "Processing", paymentMethod: "Direct Deposit" },
];

export default function CompensationManagement() {
    const [records, setRecords] = useState<CompensationRecord[]>(INITIAL_RECORDS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [addForm, setAddForm] = useState({
        participantId: "",
        visitNumber: "",
        amount: "",
        method: "Stripe Connect" as CompensationRecord["paymentMethod"],
        notes: ""
    });

    const handleAddPayment = () => {
        setIsSaving(true);
        setTimeout(() => {
            const newRecord: CompensationRecord = {
                id: `PAY-${Math.floor(Math.random() * 900) + 100}`,
                participantId: addForm.participantId,
                participantName: "Resolved Subject", // Mock resolution
                study: "NAD+ Longevity",
                visitNumber: addForm.visitNumber,
                amountOwed: parseFloat(addForm.amount),
                amountPaid: 0,
                paymentMethod: addForm.method,
                status: "Earned",
                notes: addForm.notes
            };
            setRecords([newRecord, ...records]);
            setIsSaving(false);
            setShowAddModal(false);
            setAddForm({ participantId: "", visitNumber: "", amount: "", method: "Stripe Connect", notes: "" });
        }, 1000);
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header (Spec 13.1) */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <Banknote className="text-emerald-500" size={32} /> Compensation Ledger
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Tracking clinical trial stipends, visit reimbursements & regulatory payments (Spec 13).</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-white/5 border border-white/10 hover:border-emerald-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Plus size={16} /> Log Payment
                    </button>
                    <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <DollarSign size={16} /> Automated Payout
                    </button>
                </div>
            </div>

            {/* Stats (Spec 13.1) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Disbursed", val: "$124,500", trend: "Longevity YTD", color: "emerald", icon: Wallet },
                    { label: "Accounts Payable", val: "$12,420", trend: "Earned/Pending", color: "amber", icon: Clock },
                    { label: "Processing", val: "$4,150", trend: "ACH/Stripe", color: "blue", icon: TrendingUp },
                    { label: "Audit Health", val: "100%", trend: "Tax Compliant", color: "indigo", icon: ShieldCheck },
                ].map((s, i) => (
                    <div key={i} className={`glass p-8 rounded-[2.5rem] border border-white/5 bg-${s.color}-500/[0.03] relative group`}>
                        <div className="absolute right-6 top-6 opacity-10 group-hover:opacity-20 transition-all">
                            <s.icon size={48} className={`text-${s.color}-400`} />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">{s.label}</p>
                        <p className="text-3xl font-black text-white italic tracking-tighter mb-1">{s.val}</p>
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{s.trend}</p>
                    </div>
                ))}
            </div>

            {/* Registry (Spec 13.1) */}
            <div className="glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                    <div className="flex gap-6">
                        {["All Activities", "Pending Review", "Final Payouts"].map(t => (
                            <button key={t} className={`text-[11px] font-black uppercase tracking-widest italic transition-all ${t === 'All Activities' ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                                {t}
                                {t === 'All Activities' && <div className="h-0.5 w-full bg-emerald-500 mt-1" />}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input placeholder="Search PID or Payment ID..." className="bg-slate-950/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[11px] text-white w-64 focus:border-emerald-500/50 outline-none uppercase font-bold tracking-widest" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[11px] uppercase tracking-widest text-slate-500 font-black italic">
                                <th className="py-5 px-8 italic">Payment ID</th>
                                <th className="py-5 px-8 italic">Subject Context (13.1)</th>
                                <th className="py-5 px-8 italic">Visit / Event</th>
                                <th className="py-5 px-8 italic">Amount (Owed/Paid)</th>
                                <th className="py-5 px-8 italic">Method</th>
                                <th className="py-5 px-8 italic">Status</th>
                                <th className="py-5 px-8 text-right italic">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300">
                            {records.map((row) => (
                                <tr key={row.id} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="py-6 px-8 font-mono text-[11px] text-slate-500 uppercase">{row.id}</td>
                                    <td className="py-6 px-8">
                                        <div className="flex flex-col">
                                            <span className="font-black text-white italic uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{row.participantName}</span>
                                            <span className="text-[10px] text-cyan-500/70 font-black uppercase tracking-widest mt-1">{row.participantId}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <p className="font-bold text-slate-300 uppercase italic">Visit {row.visitNumber}</p>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{row.study}</p>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-white italic">${row.amountOwed}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${row.status === 'Paid' ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                {row.status === 'Paid' ? `Paid ${row.paymentDate}` : `Paid: $${row.amountPaid}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2">
                                            {row.paymentMethod.includes('Direct') ? <CheckCircle size={12} className="text-indigo-400" /> : <CreditCard size={12} className="text-cyan-400" />}
                                            <span className="text-[11px] font-black text-slate-500 uppercase italic">{row.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black italic tracking-widest uppercase border ${
                                            row.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            row.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2.5 bg-slate-900 border border-white/5 hover:border-emerald-500/30 text-slate-600 hover:text-white rounded-xl transition-all"><ExternalLink size={16} /></button>
                                            <button className="p-2.5 bg-slate-900 border border-white/5 hover:text-white text-slate-700 rounded-xl transition-all"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Spec 13.1 Add Payment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="glass w-full max-w-xl p-10 rounded-[3rem] border border-white/10 bg-slate-950 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAddModal(false)} className="absolute right-8 top-8 text-slate-600 hover:text-white transition-colors"><X size={24} /></button>
                        <h2 className="text-2xl font-black text-white italic tracking-tight uppercase mb-8 flex items-center gap-3">
                            <Banknote className="text-emerald-500" size={24} /> Log Subject Disbursement
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Subject ID (PID)</label>
                                <input value={addForm.participantId} onChange={e => setAddForm(p => ({ ...p, participantId: e.target.value }))} placeholder="P-4502" className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-emerald-500 outline-none transition-all uppercase font-mono" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Visit Number / Label</label>
                                <input value={addForm.visitNumber} onChange={e => setAddForm(p => ({ ...p, visitNumber: e.target.value }))} placeholder="e.g. 4 or Final" className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-emerald-500 outline-none transition-all uppercase" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Amount (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                    <input value={addForm.amount} onChange={e => setAddForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold text-white focus:border-emerald-500 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Internal Notes (Auditable)</label>
                                <textarea value={addForm.notes} onChange={e => setAddForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Optional context for financial audit..." className="w-full bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-emerald-500 outline-none transition-all resize-none" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">Cancel</button>
                            <button onClick={handleAddPayment} disabled={isSaving || !addForm.participantId || !addForm.amount} className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {isSaving ? "Authenticating..." : "Authorize Entry"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
