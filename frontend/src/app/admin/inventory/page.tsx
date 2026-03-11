"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Package, Truck, RefreshCcw, MapPin, Box, Plus,
    X, Loader2, AlertTriangle, CheckCircle2, Clock, Send,
    FlaskConical, AlertCircle, History, MailCheck, ShieldCheck,
    Dna, Droplets, FlaskConicalOff
} from "lucide-react";
import { format, isPast } from "date-fns";
import { AdminAuth } from "@/lib/portal-auth";

type KitState = 
    | "KIT_ASSIGNED"
    | "AWAITING_COLLECTION"
    | "COLLECTED"
    | "SHIPPED_BY_PARTICIPANT"
    | "RECEIVED_AT_SITE"
    | "MISSING"
    | "DELAYED"
    | "DAMAGED_INVALID"
    | "AVAILABLE"
    | "EXPIRED";

interface Kit {
    id: string;
    sku: string;
    type: string;
    lotNumber: string;
    expirationDate: string;
    status: KitState;
    assignedTo?: string;
    participantName?: string;
    assignmentDate?: string;
    sampleDueDate?: string;
    samplePurpose?: "BASELINE" | "INTERIM" | "FINAL";
    instructionsSent?: boolean;
    shippedAt?: string;
    receivedAt?: string;
}

const KIT_TYPES = ["Gut Microbiome Kit", "Blood Collection Set", "Saliva Extraction Tube", "DNA Sample Kit", "Stool Collection Kit"];

function statusBadge(status: KitState) {
    switch (status) {
        case "AVAILABLE": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "KIT_ASSIGNED": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
        case "AWAITING_COLLECTION": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
        case "COLLECTED": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        case "SHIPPED_BY_PARTICIPANT": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "RECEIVED_AT_SITE": return "bg-teal-500/10 text-teal-400 border-teal-500/20";
        case "DELAYED": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        case "MISSING": 
        case "DAMAGED_INVALID":
        case "EXPIRED": return "bg-red-500/10 text-red-400 border-red-500/20";
        default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
}

export default function AdminKitsAndSamplesPage() {
    const [kits, setKits] = useState<Kit[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState<Kit | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    const [assignForm, setAssignForm] = useState({
        participantId: "",
        participantName: "",
        purpose: "BASELINE" as Kit["samplePurpose"],
        dueDate: "",
        sendInstructions: true as boolean
    });

    const [addForm, setAddForm] = useState({
        sku: "",
        type: "Gut Microbiome Kit",
        lotNumber: "",
        expirationDate: "",
    });

    const getToken = () => AdminAuth.get()?.token ?? "";

    const fetchKits = useCallback(async () => {
        setLoading(true);
        // In a real app, we'd fetch from /api/proxy/kits
        // Mocking clinical kit data for Spec 11 fulfillment
        setTimeout(() => {
            const mockKits: Kit[] = [
                { id: "K-001", sku: "GUT-101", type: "Gut Microbiome Kit", lotNumber: "LOT-01", expirationDate: "2027-01-01", status: "RECEIVED_AT_SITE", assignedTo: "P-4502", participantName: "Sarah Miller", assignmentDate: "2026-03-01", samplePurpose: "BASELINE", instructionsSent: true, receivedAt: "2026-03-05" },
                { id: "K-002", sku: "BLD-902", type: "Blood Collection Set", lotNumber: "LOT-02", expirationDate: "2026-12-15", status: "AWAITING_COLLECTION", assignedTo: "P-4508", participantName: "Marcus Chen", assignmentDate: "2026-03-08", samplePurpose: "INTERIM", instructionsSent: true, sampleDueDate: "2026-03-22" },
                { id: "K-003", sku: "SLV-441", type: "Saliva Extraction Tube", lotNumber: "LOT-05", expirationDate: "2026-11-20", status: "COLLECTED", assignedTo: "P-4512", participantName: "Julia Roberts", assignmentDate: "2026-03-10", samplePurpose: "BASELINE", instructionsSent: true },
                { id: "K-101", sku: "GUT-101", type: "Gut Microbiome Kit", lotNumber: "LOT-01", expirationDate: "2027-01-01", status: "AVAILABLE" },
                { id: "K-102", sku: "DNA-X2", type: "DNA Sample Kit", lotNumber: "LOT-DX", expirationDate: "2026-01-01", status: "EXPIRED" },
            ];
            setKits(mockKits);
            setLoading(false);
        }, 800);
    }, []);

    useEffect(() => { fetchKits(); }, [fetchKits]);

    const handleAssign = () => {
        if (!showAssignModal) return;
        setSaving(true);
        // Simulate assignment
        setTimeout(() => {
            setKits(prev => prev.map(k => k.id === showAssignModal.id ? {
                ...k,
                status: "KIT_ASSIGNED",
                assignedTo: assignForm.participantId,
                participantName: assignForm.participantName,
                assignmentDate: new Date().toISOString().split('T')[0],
                sampleDueDate: assignForm.dueDate,
                samplePurpose: assignForm.purpose,
                instructionsSent: assignForm.sendInstructions
            } : k));
            setSaving(false);
            setShowAssignModal(null);
        }, 1000);
    };

    // ── Stats ──────────────────────────────────────────────────────────────
    const stats = {
        shipped: kits.filter(k => k.status === "SHIPPED_BY_PARTICIPANT").length,
        received: kits.filter(k => k.status === "RECEIVED_AT_SITE").length,
        available: kits.filter(k => k.status === "AVAILABLE").length,
        expired: kits.filter(k => k.status === "EXPIRED").length,
        delayed: kits.filter(k => k.status === "DELAYED").length,
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header (Spec 11.1) */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight flex items-center gap-3 uppercase">
                        <Package size={32} className="text-emerald-500" /> Kits &amp; Sample Tracking
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Monitoring biological specimen lifecycle from kit assignment to site receipt (Spec 11).</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 font-black uppercase tracking-widest text-[11px] rounded-xl transition-all flex items-center gap-2">
                        <History size={16} /> Sample Log
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Kit Inventory
                    </button>
                </div>
            </div>

            {/* Spec 11.3 State Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                    { label: "Registry Total", val: kits.length, icon: Box, color: "slate" },
                    { label: "Site Received", val: stats.received, icon: ShieldCheck, color: "emerald" },
                    { label: "In-Transit", val: stats.shipped, icon: Truck, color: "blue" },
                    { label: "Action Required", val: stats.delayed, icon: AlertCircle, color: "amber" },
                    { label: "Inventory Opt", val: stats.available, icon: RefreshCcw, color: "cyan" },
                ].map((s, i) => (
                    <div key={i} className={`glass p-6 rounded-[2rem] border border-white/5 bg-${s.color}-500/[0.03]`}>
                        <div className="flex items-center gap-3 mb-4">
                            <s.icon size={16} className={`text-${s.color}-400 opacity-60`} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{s.label}</span>
                        </div>
                        <p className="text-3xl font-black text-white italic tracking-tighter">{s.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Registry */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                        <div className="p-6 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                            <div className="flex gap-4">
                                <select className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black text-slate-400 uppercase tracking-widest outline-none focus:border-cyan-500/50">
                                    <option>All Phases</option>
                                    <option>Baseline</option>
                                    <option>Interim</option>
                                    <option>Final</option>
                                </select>
                            </div>
                            <div className="relative">
                                <input placeholder="Filter by Participant or Kit ID..." className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white w-64 focus:border-cyan-500/50 outline-none uppercase font-bold tracking-widest" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
                                    <tr>
                                        <th className="px-8 py-5">Kit Architecture</th>
                                        <th className="px-8 py-5">Assignment Context</th>
                                        <th className="px-8 py-5">Flow State (11.3)</th>
                                        <th className="px-8 py-5">Timeline</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {kits.map((kit) => (
                                        <tr key={kit.id} className="group hover:bg-white/[0.01] transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-cyan-500/10 transition-all">
                                                        {kit.type.includes("Blood") ? <Droplets size={20} /> : kit.type.includes("DNA") ? <Dna size={20} /> : <FlaskConical size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-[13px]">{kit.type}</p>
                                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">ID: {kit.id} · LOT: {kit.lotNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {kit.assignedTo ? (
                                                    <div>
                                                        <p className="text-white font-black italic text-[13px]">{kit.participantName}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase italic">{kit.samplePurpose}</span>
                                                            {kit.instructionsSent && <MailCheck size={12} className="text-emerald-500" />}
                                                        </div>
                                                    </div>
                                                ) : <span className="text-[10px] font-bold text-slate-700 uppercase italic">Unassigned Pool</span>}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black italic tracking-widest uppercase border ${statusBadge(kit.status)}`}>
                                                    {kit.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    {kit.assignmentDate && (
                                                        <p className="text-[10px] font-bold text-slate-500">Assigned: {kit.assignmentDate}</p>
                                                    )}
                                                    {kit.sampleDueDate && (
                                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-tighter italic">Due: {kit.sampleDueDate}</p>
                                                    )}
                                                    {kit.receivedAt && (
                                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter italic">Received: {kit.receivedAt}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {kit.status === "AVAILABLE" ? (
                                                    <button 
                                                        onClick={() => setShowAssignModal(kit)}
                                                        className="px-4 py-2 bg-slate-900 border border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Assign Kit
                                                    </button>
                                                ) : (
                                                    <button className="p-2 text-slate-800 hover:text-white transition-all"><History size={16} /></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Logic Guidance (Spec 11.2) */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-6 flex items-center gap-2">
                            <Clock className="text-cyan-500" size={16} /> Reminder Matrix (11.2)
                        </h3>
                        <div className="space-y-4">
                            {[
                                { trigger: "Baseline Kit", detail: "Remind subject to collect BEFORE starting regimen", active: true },
                                { trigger: "Interim Check", detail: "Remind subject to ship 3 days after collection", active: false },
                                { trigger: "Coordinator Receipt", detail: "Verify audit trail on site receipt", active: true },
                            ].map((rem, i) => (
                                <div key={i} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 relative overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${rem.active ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-slate-700'}`} />
                                        <span className="text-[11px] font-black text-white uppercase italic tracking-tight">{rem.trigger}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">{rem.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-red-500/[0.02]">
                        <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-4 flex items-center gap-2">
                            <FlaskConicalOff className="text-red-400" size={16} /> Sample Integrity Alerts
                        </h3>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={14} className="text-red-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Damaged Supplies</span>
                            </div>
                            <p className="text-[11px] font-bold text-red-400/80 uppercase italic italic">02 Samples flagged as INVALID. Please re-assign Baseline kits for Subjects P-992 and P-882.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Modal (Spec 11.1 Features) */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300 pointer-events-auto">
                    <div className="glass w-full max-w-xl p-10 rounded-[3rem] border border-white/10 bg-slate-900 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black text-white italic tracking-tight uppercase mb-8 flex items-center gap-3">
                            <Plus size={24} className="text-cyan-500" /> Specimen Kit Assignment
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="col-span-2 space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Participant Link</label>
                                <input 
                                    placeholder="Enter Participant ID (e.g. P-4502)" 
                                    value={assignForm.participantId}
                                    onChange={e => setAssignForm(p => ({ ...p, participantId: e.target.value }))}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Sample Purpose</label>
                                <select 
                                    value={assignForm.purpose}
                                    onChange={e => setAssignForm(p => ({ ...p, purpose: e.target.value as any }))}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all"
                                >
                                    <option value="BASELINE">Baseline Collection</option>
                                    <option value="INTERIM">Interim Milestone</option>
                                    <option value="FINAL">Final Study Sample</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Sample Due Date</label>
                                <input 
                                    type="date" 
                                    value={assignForm.dueDate}
                                    onChange={e => setAssignForm(p => ({ ...p, dueDate: e.target.value }))}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all [color-scheme:dark]" 
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-8 px-2">
                            <input 
                                type="checkbox" 
                                checked={assignForm.sendInstructions} 
                                onChange={e => setAssignForm(p => ({ ...p, sendInstructions: e.target.checked }))}
                                className="w-5 h-5 rounded border-white/10 bg-slate-950 accent-cyan-500" 
                            />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] italic">Send Collection Instructions to Subject Automatically</span>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowAssignModal(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">Cancel</button>
                            <button 
                                onClick={handleAssign}
                                disabled={saving || !assignForm.participantId}
                                className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {saving ? "Processing..." : "Assign & Transmit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
