"use client";

import { use, useState } from "react";
import { 
    Calendar, CheckCircle2, Clock, Globe, 
    ChevronRight, ArrowRight, User, 
    FlaskConical, MapPin, ShieldCheck, 
    Info, Star, ExternalLink, X, Send, Loader2,
    DollarSign
} from "lucide-react";
import Container from "@/components/Container";
import Link from "next/link";

// Mock Data for Detail View (Spec 1.1 / 1.2)
const STUDY_DETAILS: Record<string, any> = {
    "nad-plus-2026": {
        name: "NAD+ Longevity & Metabolic Optimization",
        description: "This study investigates the cellular impact of next-generation NAD+ precursors on mitochondrial efficiency and biological aging markers in adults with early metabolic shift.",
        why: "To determine if targeted NAD+ elevation can reverse age-related metabolic decline and improve cellular resilience.",
        duration: "12 Weeks",
        compensation: "$2,500 Total",
        condition: "Metabolic Health",
        pi: [
            { name: "Dr. Aris Persidis", role: "Principal Investigator", bio: "Leading expert in metabolic health and cellular longevity research." },
            { name: "Dr. Sarah Johnson", role: "Medical Monitor", bio: "Specialist in mitochondrial biology and clinical trial design." }
        ],
        timeline: [
            { week: "0", title: "Baseline Assessment", desc: "In-home kit collection and initial biometric screening." },
            { week: "1-4", title: "Regimen Phase I", desc: "Daily supplement administration with weekly biosense logs." },
            { week: "6", title: "Interim Lab Visit", desc: "Blood panel at partner lab to verify NAD+ serum levels." },
            { week: "7-11", title: "Regimen Phase II", desc: "Continued administration with sleep/energy tracking." },
            { week: "12", title: "Final Assessment", desc: "Comparative biometrics and exit questionnaire." }
        ],
        kits: "In-home stool and saliva kits provided. Mobile phlebotomy available in select regions.",
        sites: ["Virtual (Global)", "Site 01 (Austin, TX)", "Site 02 (London, UK)"]
    }
};

export default function StudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const study = STUDY_DETAILS[slug] || STUDY_DETAILS["nad-plus-2026"];
    const [showScreener, setShowScreener] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Nav Back */}
            <div className="pt-24 border-b border-white/5 bg-slate-900/20">
                <Container className="py-4">
                    <Link href="/studies" className="text-[11px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                        <ChevronRight className="rotate-180" size={14} /> Back to Directory
                    </Link>
                </Container>
            </div>

            {/* Hero / Header */}
            <section className="py-20 bg-gradient-to-b from-cyan-500/[0.05] to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <Container className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">Active Enrollment</span>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{study.condition}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-[1.1]">
                            {study.name}
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed italic max-w-2xl">
                            {study.description}
                        </p>
                    </div>

                    <div className="w-full md:w-96 glass p-8 rounded-[3rem] border border-cyan-500/30 flex flex-col gap-8 bg-slate-900/40">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Total Stipend</p>
                                <p className="text-3xl font-black text-white italic tracking-tighter">{study.compensation}</p>
                            </div>
                            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Clock size={18} className="text-cyan-500" />
                                <span className="text-sm font-bold">{study.duration} Duration</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Globe size={18} className="text-cyan-500" />
                                <span className="text-sm font-bold">Remote & Site Hybrid</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowScreener(true)}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest text-[13px] rounded-2xl transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 group"
                        >
                            See If You Qualify <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </Container>
            </section>

            {/* Study Sections (Spec 1.2 Overview / Why) */}
            <section className="py-20 relative">
                <Container className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-16">
                        
                        {/* Why Join */}
                        <div>
                            <h2 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 italic flex items-center gap-4">
                                Research Context <div className="h-px flex-1 bg-white/5" />
                            </h2>
                            <h3 className="text-3xl font-black text-white mb-6 italic tracking-tight">Why this study is being conducted?</h3>
                            <p className="text-lg text-slate-400 leading-relaxed font-normal italic">
                                {study.why}
                            </p>
                        </div>

                        {/* Weekly Timeline (Spec 1.2 Timeline) */}
                        <div>
                            <h2 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12 italic flex items-center gap-4">
                                Participation Timeline <div className="h-px flex-1 bg-white/5" />
                            </h2>
                            <div className="relative border-l-2 border-slate-900 ml-4 space-y-12 pl-12">
                                {study.timeline.map((step: any, i: number) => (
                                    <div key={i} className="relative group">
                                        <div className="absolute -left-[61px] top-0 w-12 h-12 bg-slate-950 border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px] font-black text-slate-700 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-all duration-500">
                                            {step.week === "0" ? "START" : `Wk ${step.week}`}
                                        </div>
                                        <h4 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">{step.title}</h4>
                                        <p className="text-slate-500 italic max-w-xl">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kits & Lab Info (Spec 1.2 Kits) */}
                        <div className="p-10 rounded-[3rem] bg-indigo-500/[0.03] border border-white/5">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-6 flex items-center gap-3">
                                <FlaskConical className="text-indigo-400" /> At-Home Kits & Lab Requirements
                            </h3>
                            <p className="text-slate-400 leading-relaxed font-medium italic">
                                {study.kits}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar / PI / Sites */}
                    <div className="space-y-12">
                        {/* PIs (Spec 1.2 Investigators) */}
                        <div className="space-y-6">
                            <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-widest italic flex items-center gap-3">
                                <User size={16} /> Research Oversight
                            </h2>
                            {study.pi.map((person: any, i: number) => (
                                <div key={i} className="glass p-6 rounded-3xl border border-white/5">
                                    <p className="text-white font-black italic uppercase tracking-tight mb-1">{person.name}</p>
                                    <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-3">{person.role}</p>
                                    <p className="text-[12px] text-slate-500 font-medium italic">{person.bio}</p>
                                </div>
                            ))}
                        </div>

                        {/* Sites (Spec 1.2 Site Locations) */}
                        <div className="space-y-4">
                            <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-widest italic flex items-center gap-3">
                                <MapPin size={16} /> Participating Centers
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {study.sites.map((site: string, i: number) => (
                                    <span key={i} className="px-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl text-[12px] font-bold text-slate-400 italic">
                                        {site}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Compliance (Spec 1.1 Trust) */}
                        <div className="p-6 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2.5rem]">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck size={24} className="text-emerald-500" />
                                <span className="text-[13px] font-black text-white uppercase tracking-widest italic">Data Privacy Assurance</span>
                            </div>
                            <p className="text-[12px] text-slate-500 font-medium italic leading-relaxed">
                                This study is HIPAA compliant and adheres to 21 CFR Part 11 for electronic records. Your identity is anonymized for researchers.
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Eligibility Screener Modal (Spec 1.4) */}
            {showScreener && (
                <StudyScreener studyName={study.name} onClose={() => setShowScreener(false)} />
            )}
        </div>
    );
}

// ── Eligibility Screener Component (Spec 1.4) ───────────────────────────────────

function StudyScreener({ studyName, onClose }: { studyName: string; onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<"pass" | "fail" | null>(null);

    const handleCheck = () => {
        setSubmitting(true);
        setTimeout(() => {
            setResult("pass");
            setSubmitting(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="glass w-full max-w-xl p-12 rounded-[3.5rem] border border-cyan-500/30 bg-[#0A1128] shadow-[0_0_100px_rgba(6,182,212,0.1)] relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute right-10 top-10 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                {result === null ? (
                    <>
                        <div className="mb-10 text-center lg:text-left">
                            <p className="text-[12px] font-black text-cyan-500 uppercase tracking-widest mb-2">Step {step} of 3 · Eligibility Scan</p>
                            <h2 className="text-3xl font-black text-white italic tracking-tight uppercase leading-none">Qualification Screener</h2>
                            <p className="text-slate-500 text-sm mt-3 font-medium italic">Protocol: {studyName}</p>
                        </div>

                        <div className="space-y-8 mb-12">
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <h4 className="text-lg font-bold text-white uppercase italic">Basic Biometrics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Your Age</label>
                                            <input type="number" placeholder="e.g. 42" className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white font-black italic outline-none focus:border-cyan-500 transition-all placeholder:text-slate-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-2">Current Gender</label>
                                            <select className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white font-black italic outline-none focus:border-cyan-500 transition-all">
                                                <option>SELECT</option>
                                                <option>MALE</option>
                                                <option>FEMALE</option>
                                                <option>NON-BINARY</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <h4 className="text-lg font-bold text-white uppercase italic">Health History</h4>
                                    <div className="space-y-4">
                                        {[
                                            "Do you have a history of heart condition?",
                                            "Are you currently taking any NAD+ precursors?",
                                            "Have you participated in a clinical trial in the last 6 months?"
                                        ].map((q, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                                <span className="text-[13px] font-bold text-slate-300 italic">{q}</span>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1 bg-slate-800 text-[10px] font-black text-white hover:bg-cyan-500 transition-all rounded">YES</button>
                                                    <button className="px-3 py-1 bg-slate-800 text-[10px] font-black text-white hover:bg-cyan-500 transition-all rounded">NO</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 text-center">
                                    <div className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                                        <ShieldCheck size={40} className="text-cyan-400" />
                                    </div>
                                    <h4 className="text-xl font-black text-white uppercase italic">Privacy Verification</h4>
                                    <p className="text-slate-500 text-sm font-medium italic leading-relaxed">
                                        By submitting, you consent to our secure, de-identified processing of your screening data. This scan does not constitute medical advice.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {step > 1 && (
                                <button onClick={() => setStep(s => s - 1)} className="flex-1 py-4 bg-slate-900 border border-white/5 text-slate-500 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:text-white transition-all">Back</button>
                            )}
                            {step < 3 ? (
                                <button onClick={() => setStep(s => s + 1)} className="flex-[2] py-4 bg-white/5 border border-white/10 hover:border-cyan-500/50 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all">Next Component</button>
                            ) : (
                                <button 
                                    onClick={handleCheck}
                                    disabled={submitting}
                                    className="flex-[2] py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-xl shadow-cyan-600/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                    {submitting ? "Processing Baseline Scan..." : "Finalize & Verify"}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] border-4 border-emerald-500/20 flex items-center justify-center mx-auto mb-8 text-emerald-500">
                            <CheckCircle2 size={56} />
                        </div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tight mb-4">You&apos;re Eligible!</h2>
                        <p className="text-slate-500 font-medium italic mb-10 max-w-sm mx-auto">
                            Based on your metabolic profile, you are a strong candidate for the **NAD+ 2026** protocol. Join now to claim your enrollment spot.
                        </p>
                        <div className="space-y-4">
                            <Link 
                                href="/login" 
                                className="block w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[13px] rounded-2xl shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-3 group"
                            >
                                Secure My Enrollment <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <button onClick={onClose} className="w-full py-3 text-[11px] font-black text-slate-600 hover:text-white uppercase tracking-[0.2em] transition-colors italic">I&apos;ll finish later</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
