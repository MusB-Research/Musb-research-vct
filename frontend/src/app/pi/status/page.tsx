"use client";

import { 
    Activity, Play, Pause, Square, CheckCircle2, 
    BarChart3, Settings, AlertTriangle, ShieldCheck,
    Clock, RefreshCw, Layers
} from "lucide-react";
import { useState } from "react";

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: any }> = {
    ACTIVE: { label: "Fully Operational", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: Play },
    PAUSED: { label: "Temporarily Halted", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Pause },
    RECRUITING: { label: "Open for Enrollment", cls: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", icon: Activity },
    RECRUITMENT_COMPLETED: { label: "Enrollment Closed", cls: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: Square },
    ANALYSIS_UNDERWAY: { label: "Data locked / Analysis", cls: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: BarChart3 },
    COMPLETED: { label: "Study Terminated", cls: "bg-slate-800 text-slate-400 border-white/10", icon: CheckCircle2 },
};

export default function StudyStatusControl() {
    const [status, setStatus] = useState("RECRUITING");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = (newStatus: string) => {
        if (confirm(`Change study status to ${newStatus.replace(/_/g, ' ')}? This will be logged in the global audit trail.`)) {
            setIsUpdating(true);
            setTimeout(() => {
                setStatus(newStatus);
                setIsUpdating(false);
            }, 800);
        }
    };

    const cfg = STATUS_CONFIG[status];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Protocol Lifecycle Control</h1>
                    <p className="text-slate-500 mt-2 font-medium italic">High-level investigator override for study-wide operational states (Spec 16.4).</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Audit Level: HIGH</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current State Terminal */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden flex flex-col items-center text-center">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                         
                         <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center border-4 shadow-2xl mb-8 relative transition-all duration-700 ${isUpdating ? 'animate-pulse scale-90 opacity-50' : ''} ${cfg.cls.split(' ')[2].replace('border-', 'border-')}`}>
                             <div className={`p-6 rounded-[2rem] bg-slate-950 ${cfg.cls.split(' ')[1]}`}>
                                <cfg.icon size={48} />
                             </div>
                         </div>

                         <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
                             {cfg.label}
                         </h2>
                         <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 italic mb-10">Current Protocol Registry Status</p>
                         
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                             {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                 <button
                                     key={key}
                                     disabled={status === key || isUpdating}
                                     onClick={() => handleUpdate(key)}
                                     className={`p-5 rounded-[2rem] border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
                                         status === key 
                                            ? 'bg-indigo-500/10 border-indigo-500/30' 
                                            : 'bg-slate-950/40 border-white/5 hover:border-white/10 grayscale hover:grayscale-0'
                                     }`}
                                 >
                                     <div className={`p-3 rounded-2xl ${config.cls}`}>
                                         <config.icon size={20} />
                                     </div>
                                     <span className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">{config.label}</span>
                                     {status === key && <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                                 </button>
                             ))}
                         </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-indigo-500/[0.03] border border-indigo-500/10 flex items-start gap-4">
                        <ShieldCheck className="text-indigo-400 mt-1 shrink-0" size={24} />
                        <div>
                            <h4 className="text-[13px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Investigator Sign-off Required</h4>
                            <p className="text-[12px] text-slate-500 font-medium italic leading-relaxed">
                                Under GxP and IRB guidelines, changing the study state to "Paused" or "Analysis Underway" triggers a system-wide notification to all Site Coordinators and Sponsors. A mandatory reason for change will be added to the Audit Log.
                            </p>
                        </div>
                    </div>
                </div>

                {/* State Diagnostics */}
                <div className="space-y-4">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em] italic mb-8">Status Transition History</h3>
                         <div className="space-y-6 relative">
                            <div className="absolute left-3 top-2 bottom-2 w-px bg-white/5" />
                            {[
                                { date: "Mar 01, 2026", user: "PI Chen", from: "DRAFT", to: "RECRUITING" },
                                { date: "Feb 15, 2026", user: "Admin", from: "NONE", to: "DRAFT" },
                            ].map((log, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center">
                                         <RefreshCw size={10} className="text-slate-600" />
                                    </div>
                                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1">{log.date}</p>
                                    <p className="text-[12px] text-slate-400 font-bold uppercase italic">{log.user}</p>
                                    <p className="text-[11px] text-slate-500 mt-1 uppercase font-black">
                                        {log.from} <ArrowRight className="inline-block mx-1" size={10} /> {log.to}
                                    </p>
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                         <Layers className="text-slate-600 mb-4" size={24} />
                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Investigational Arms</p>
                         <h4 className="text-2xl font-black text-white italic tracking-tighter mb-4">Group A / B</h4>
                         <p className="text-[10px] text-slate-500 font-medium italic">Disabling recruitment will NOT affect current participants in Treatment or Control cycles (Spec 16.4).</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ArrowRight = ({ className, size }: { className?: string, size: number }) => (
    <Play size={size} className={className} />
);
