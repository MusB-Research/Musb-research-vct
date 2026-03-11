"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ChevronLeft, 
    Save, 
    Plus, 
    Trash2, 
    FileSignature, 
    ShieldCheck, 
    AlertTriangle, 
    Info, 
    Download, 
    CheckCircle2, 
    HelpCircle,
    User,
    Eye,
    Clock,
    Layout
} from "lucide-react";

const CONSENT_TYPES = [
    "Electronic Consent (eConsent)",
    "Paper Consent (Manual Upload)",
    "Mixed Workflow"
];

interface ConsentSection {
    id: string;
    title: string;
    content: string;
    type: "summary" | "risks" | "benefits" | "privacy" | "withdrawal" | "contact" | "checkboxes";
    required?: boolean;
}

export default function NewConsentTemplatePage() {
    const [consentName, setConsentName] = useState("New Informed Consent Form");
    const [consentType, setConsentType] = useState("Electronic Consent (eConsent)");
    const [version, setVersion] = useState("1.0.0");
    const [sections, setSections] = useState<ConsentSection[]>([
        { id: "1", type: "summary", title: "Study Summary", content: "Briefly explain the purpose of the study..." },
        { id: "2", type: "risks", title: "Risks & Side Effects", content: "Detail potential risks here..." },
        { id: "3", type: "benefits", title: "Expected Benefits", content: "What can the participant expect?" },
        { id: "4", type: "privacy", title: "Privacy & Data Use", content: "Explain GDPR/HIPAA compliance..." },
        { id: "5", type: "withdrawal", title: "Rights of Withdrawal", content: "Explain how to leave the study..." },
        { id: "6", type: "contact", title: "Researcher Contact Info", content: "PI Name: [Name]\nOrganization: MusB Research\nPhone: [Number]" },
    ]);

    const addSection = (type: ConsentSection["type"]) => {
        const newSec: ConsentSection = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            title: `New ${type.toUpperCase()} Section`,
            content: ""
        };
        setSections([...sections, newSec]);
    };

    const updateSection = (id: string, field: keyof ConsentSection, value: string) => {
        setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300">
            {/* Header Overlay (Spec 9.2) */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-[100]">
                <div className="flex items-center gap-6">
                    <Link href="/admin/consent" className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <input 
                            value={consentName} 
                            onChange={e => setConsentName(e.target.value)}
                            className="bg-transparent text-xl font-black text-white italic tracking-tight uppercase outline-none border-b border-transparent focus:border-indigo-500 transition-all placeholder:opacity-50"
                        />
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Consent Engine</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Version {version}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-xl transition-all flex items-center gap-2">
                        <Download size={14} /> Download Sample
                    </button>
                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
                        <Save size={14} /> Publish v{version}
                    </button>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* Structure Sidebar (Spec 9.1 & 9.2) */}
                <div className="w-80 bg-[#0a0f1e]/50 border-r border-white/5 p-8 overflow-y-auto custom-scrollbar">
                    <div className="mb-10">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">CONSENT ARCHITECTURE</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 block">Workflow Type</label>
                                <select 
                                    value={consentType}
                                    onChange={e => setConsentType(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                                >
                                    {CONSENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">REQUIRED SECTIONS</h3>
                        {[
                            { label: "Study Summary", type: "summary", icon: Info },
                            { label: "Risks & Benefits", type: "risks", icon: AlertTriangle },
                            { label: "Privacy Notice", type: "privacy", icon: ShieldCheck },
                            { label: "Withdrawal Rights", type: "withdrawal", icon: HelpCircle },
                            { label: "Contact Info", type: "contact", icon: User },
                            { label: "Checkbox Array", type: "checkboxes", icon: CheckCircle2 },
                        ].map(item => (
                            <button 
                                key={item.type}
                                onClick={() => addSection(item.type as any)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/50 hover:bg-slate-800 border border-white/5 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={16} className="text-slate-500 group-hover:text-indigo-400" />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">{item.label}</span>
                                </div>
                                <Plus size={14} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5">
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Compliance Ready</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">System automatically generates non-repudiation audit trails for every signature.</p>
                        </div>
                    </div>
                </div>

                {/* Building Canvas (Spec 9.2 Features) */}
                <div className="flex-1 bg-[#020617] overflow-y-auto p-12 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Auto-Branding Header (Spec 8.3 heritage) */}
                        <div className="flex justify-between items-center pb-8 border-b border-indigo-500/10 grayscale opacity-40">
                            <div className="text-xl font-black text-white italic tracking-tighter uppercase">MUSB RESEARCH</div>
                            <div className="text-right">
                                <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Protocol ID: [AUTO_LINK]</div>
                                <div className="text-[10px] font-bold text-slate-500">Informed Consent v{version}</div>
                            </div>
                        </div>

                        {sections.map((sec, idx) => (
                            <div key={sec.id} className="group relative glass p-10 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/20 transition-all bg-slate-900/40">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <input 
                                            value={sec.title}
                                            onChange={e => updateSection(sec.id, 'title', e.target.value)}
                                            className="bg-transparent text-xl font-black text-white italic tracking-tight uppercase outline-none w-full border-b border-white/5 focus:border-indigo-500 transition-all"
                                        />
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">{sec.type} sequence</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeSection(sec.id)} className="p-3 bg-red-500/10 text-red-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <textarea 
                                    value={sec.content}
                                    onChange={e => updateSection(sec.id, 'content', e.target.value)}
                                    rows={4}
                                    placeholder="Enter full legal disclosure for this section..."
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-sm text-slate-400 font-medium leading-relaxed outline-none focus:border-indigo-500/30 transition-all resize-none italic"
                                />
                            </div>
                        ))}

                        {/* Signature Block Simulation (Spec 9.2) */}
                        <div className="p-12 border-2 border-dashed border-white/5 rounded-[3rem] bg-indigo-500/[0.02] flex flex-col items-center text-center">
                            <FileSignature size={40} className="text-slate-800 mb-4" />
                            <h4 className="text-white font-black uppercase tracking-widest italic mb-2">Participant Signature End-Block</h4>
                            <p className="text-slate-600 text-xs font-medium max-w-sm mb-6 uppercase tracking-wider">This block is automatically appended with date/time stamps and identity verification hashes.</p>
                            <div className="flex gap-4">
                                <div className="px-5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Capture Timestamp</div>
                                <div className="px-5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Verify ID Hash</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Versions sidebar */}
                <div className="w-80 bg-[#0a0f1e]/50 border-l border-white/5 p-8 overflow-y-auto custom-scrollbar">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">VERSION CONTROLS</h3>
                    
                    <div className="space-y-10">
                        <section className="space-y-4">
                            <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Current</span>
                                    <span className="text-xs font-black text-white">v1.2.4</span>
                                </div>
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-slate-600 font-bold uppercase italic tracking-widest">Revision Date</span>
                                    <span className="text-slate-400 font-black italic">Today</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                                Trigger Re-Consent Study-Wide
                            </button>
                        </section>

                        <section className="p-6 bg-slate-900/40 rounded-3xl border border-white/5">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 italic">IRB Submission Summary</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Total Sections</span>
                                    <span className="text-xs font-black text-white">{sections.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Est. Read Time</span>
                                    <span className="text-xs font-black text-white">4.5 min</span>
                                </div>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-white/5">
                            <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2">
                                <Eye size={16} /> Preview eConsent
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
