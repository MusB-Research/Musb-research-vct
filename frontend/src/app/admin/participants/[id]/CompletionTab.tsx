"use client";

import { useState, use } from "react";
import { 
    CheckCircle2, Mail, Bell, ShieldCheck, Lock, 
    ArrowRight, MessageSquare, ExternalLink, Calendar,
    FlaskConical, ClipboardCheck, History, UserCheck,
    LockIcon, PartyPopper, HeartPulse
} from "lucide-react";
import Link from "next/link";

export default function CompletionTab({ participantId }: { participantId: string }) {
    const [isLocked, setIsLocked] = useState(false);
    const [recontactOptIn, setRecontactOptIn] = useState(true);
    const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);

    const handleFinalSeal = () => {
        if (confirm("CRITICAL ACTION: This will LOCK the participant record from further data entry. This action is compliance-monitored and irreversible. Proceed?")) {
            setIsLocked(true);
            // In a real app, this would trigger:
            // 1. API call to lock the record
            // 2. Automated email trigger (Spec 14)
            // 3. Automated message trigger
            // 4. Update status to 'COMPLETED'
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Participation Status Banner (Spec 14) */}
            <div className={`p-8 rounded-[2.5rem] border transition-all ${isLocked ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/40 border-white/5'}`}>
                <div className="flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-4 shadow-2xl transition-all duration-700 ${isLocked ? 'bg-emerald-500 text-white border-white/20 scale-110' : 'bg-slate-950 text-slate-700 border-[#020617]'}`}>
                        {isLocked ? <CheckCircle2 size={40} className="animate-in zoom-in duration-500" /> : <Lock size={40} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col lg:flex-row items-center gap-4 mb-2">
                            <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">
                                {isLocked ? "Participation Complete" : "Seal Protocol Registry"}
                            </h2>
                            {isLocked && (
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">
                                    Trial Successfully Terminated
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm font-medium italic max-w-2xl leading-relaxed">
                            {isLocked 
                                ? "This record has been officially sealed. All clinical data entry is disabled. The participant retains access to their results and secure site messaging (Spec 14)."
                                : "Perform final study termination. This will lock the Participant Account, send the automated gratitude sequence, and move the subject to the de-identified analytics vault (Spec 13.2)."
                            }
                        </p>
                    </div>
                    {!isLocked && (
                        <button 
                            onClick={handleFinalSeal}
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 group shrink-0"
                        >
                            Final Study Seal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Protocol Checklist (Spec 13.2) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic mb-6">Study Closure Checklist</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Final Visit Compensation Logged", completed: true, icon: ClipboardCheck },
                                { label: "Last Sample Purpose Link Verified", completed: true, icon: FlaskConical },
                                { label: "Medical History Final Update", completed: true, icon: History },
                                { label: "Physical Measurements Entry Complete", completed: true, icon: HeartPulse },
                            ].map((task, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-white/5 group hover:border-emerald-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                                            <task.icon size={18} />
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-300">{task.label}</span>
                                    </div>
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Completion Logic & On-Screen Thank You (Spec 14) */}
                    {isLocked && (
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 relative overflow-hidden animate-in fade-in zoom-in duration-700">
                             <div className="absolute top-0 right-0 p-8 text-emerald-500/20">
                                <PartyPopper size={120} />
                             </div>
                             <div className="relative z-10 text-center lg:text-left">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4 flex items-center justify-center lg:justify-start gap-4">
                                    On-Screen Sequence Sent <Mail className="text-indigo-400" size={24} />
                                </h3>
                                <div className="space-y-4 text-slate-400 text-sm font-medium leading-relaxed italic max-w-xl">
                                    <p className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0" />
                                        <span><strong>Auto-Email:</strong> Gratitude notification with "Participation Certificate" delivered to participant inbox.</span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 shrink-0" />
                                        <span><strong>Portal Update:</strong> Forms disabled. Dashboard replaced with study results visualization.</span>
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 shrink-0" />
                                        <span><strong>Retention:</strong> Invitation to potential longevity follow-ups dispatched.</span>
                                    </p>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Termination Options (Spec 13.2 / 14) */}
                <div className="space-y-4">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem]">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic mb-8">Closure Parameters</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Termination Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input 
                                        type="date" 
                                        disabled={isLocked}
                                        value={completionDate}
                                        onChange={(e) => setCompletionDate(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[13px] text-white focus:border-amber-500/50 outline-none transition-all disabled:opacity-50" 
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <UserCheck size={16} className="text-amber-500" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Research Retention</span>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            disabled={isLocked}
                                            checked={recontactOptIn}
                                            onChange={() => setRecontactOptIn(!recontactOptIn)}
                                        />
                                        <div className="w-10 h-5 bg-slate-800 rounded-full peer peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium italic">
                                    Invitation to future recontact studies enabled (Spec 13.2 / 14).
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Engagement State</h4>
                                <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                        <MessageSquare size={16} />
                                        <span className="text-[11px] font-black uppercase">Communication Tunnel</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                                        SECURE MESSAGING REMAINS ACTIVE (SPEC 14.1) AFTER RECORD LOCK TO SUPPORT POST-STUDY FOLLOW-UP.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex items-center gap-4">
                        <LockIcon className="text-amber-500" size={20} />
                        <p className="text-[11px] text-slate-500 font-medium italic">
                           Participant ID will remain active in <strong className="text-slate-300">De-identified Data Tables</strong> for Sponsor Oversight (Spec 15.4).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
