"use client";

import { useState } from "react";
import { 
    Search, Filter, Globe, MapPin, 
    ArrowRight, CheckCircle2, ShieldCheck, 
    Clock, DollarSign, Activity, 
    ChevronDown, X, Star, Zap
} from "lucide-react";
import Link from "next/link";
import Container from "@/components/Container";

// Mock Data for Spec 1.1
const STUDIES = [
    {
        id: "nad-plus-2026",
        name: "NAD+ Longevity & Metabolic Optimization",
        duration: "12 Weeks",
        compensation: "$1,500 - $2,500",
        eligibility: "Age 35-65, elevated fasting glucose, no prior NAD+ supplementation.",
        condition: "Metabolic Health",
        country: "USA (Remote)",
        type: "Remote (Virtual)",
        commitment: "Medium",
        enrolled: "142/200",
        featured: true,
        bg: "bg-cyan-500/10"
    },
    {
        id: "microbiome-gut",
        name: "Precision Microbiome: Gut-Brain Axis Phase II",
        duration: "6 Months",
        compensation: "$3,000",
        eligibility: "History of digestive discomfort, no antibiotics in last 90 days.",
        condition: "Digestion",
        country: "UK (Hybrid)",
        type: "Hybrid",
        commitment: "High",
        enrolled: "88/150",
        featured: false,
        bg: "bg-emerald-500/10"
    },
    {
        id: "hrv-stress",
        name: "Heart Rate Variability & Sleep Recovery Study",
        duration: "4 Weeks",
        compensation: "$400",
        eligibility: "Active athletes or high-stress professionals, owns a wearable.",
        condition: "Stress / Sleep",
        country: "Global",
        type: "100% Remote",
        commitment: "Low",
        enrolled: "310/500",
        featured: false,
        bg: "bg-indigo-500/10"
    },
    {
        id: "lidore-protocol-x",
        name: "LIDORE Protocol: Cognitive Enhancement V3",
        duration: "90 Days",
        compensation: "$5,000",
        eligibility: "Male/Female 45-70, memory performance below age-adjusted mean.",
        condition: "Cognitive",
        country: "USA (Site-based)",
        type: "In-Clinic",
        commitment: "Very High",
        enrolled: "12/50",
        featured: true,
        bg: "bg-purple-500/10"
    }
];

export default function StudiesDirectory() {
    const [search, setSearch] = useState("");
    const [filterExpanded, setFilterExpanded] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
            {/* Header / Intro */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] to-transparent pointer-events-none" />
                <Container className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full mb-6 border border-cyan-500/20 animate-fade-in">
                        <Zap size={14} className="text-cyan-400" />
                        <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">Active Enrollment Phase</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">
                        Current <span className="text-cyan-400">Clinical Trials</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg italic">
                        Explore our directory of cutting-edge clinical trials. Every study in our ecosystem is overseen by board-certified PIs and adheres to strict GxP & IRB standards.
                    </p>
                </Container>
            </section>

            {/* Main Content Area */}
            <section className="py-20 relative">
                <Container>
                    {/* Search & Filter Bar (Spec 1.1) */}
                    <div className="mb-12 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input 
                                type="text"
                                placeholder="Search by condition, keyword, or medication..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-full py-5 pl-16 pr-8 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium italic"
                            />
                        </div>
                        <button 
                            onClick={() => setFilterExpanded(!filterExpanded)}
                            className={`px-8 py-5 rounded-full border border-white/10 flex items-center gap-3 transition-all ${filterExpanded ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-900/50 text-slate-400 hover:text-white'}`}
                        >
                            <Filter size={18} />
                            <span className="text-[13px] uppercase tracking-widest font-black">Filter Selection</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${filterExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Expanded Filters (Spec 1.1 Filters) */}
                    {filterExpanded && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 animate-in slide-in-from-top-4 fade-in duration-300">
                            {[
                                { label: "Condition", opts: ["All", "Metabolic", "Digestion", "Sleep", "Cognitive"] },
                                { label: "Country", opts: ["Global", "USA", "UK", "Canada"] },
                                { label: "Age Group", opts: ["Any", "18-35", "35-50", "50-70", "70+"] },
                                { label: "Remote vs Hybrid", opts: ["All", "100% Remote", "Hybrid", "In-Clinic"] },
                                { label: "Commitment", opts: ["Any", "Low", "Medium", "High"] }
                            ].map((f, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">{f.label}</label>
                                    <select className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-[12px] font-black text-slate-300 uppercase tracking-widest outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer">
                                        {f.opts.map(o => <option key={o}>{o.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Study Cards Grid (Spec 1.1 Card Format) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {STUDIES.map((s, idx) => (
                            <Link 
                                key={s.id}
                                href={`/studies/${s.id}`}
                                className="group block relative"
                            >
                                <div className={`h-full glass rounded-[2.5rem] border border-white/5 p-10 transition-all duration-500 group-hover:border-white/10 group-hover:bg-white/[0.02] relative overflow-hidden flex flex-col`}>
                                    
                                    {/* Featured Badge */}
                                    {s.featured && (
                                        <div className="absolute top-0 right-10 -translate-y-px">
                                            <div className="bg-cyan-500 text-slate-950 px-4 py-2 rounded-b-2xl flex items-center gap-2">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Featured Protocol</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`w-16 h-16 rounded-2xl ${s.bg} border border-white/5 flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110 duration-500`}>
                                            <Activity size={32} />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic mb-1">Compensation</span>
                                            <span className="text-xl font-black text-white italic tracking-tight">{s.compensation}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-white italic tracking-tight uppercase leading-[1.2] mb-4 group-hover:text-cyan-400 transition-colors">
                                            {s.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="px-3 py-1 bg-slate-950/50 border border-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin size={12} className="text-slate-600" /> {s.country}
                                            </span>
                                            <span className="px-3 py-1 bg-slate-950/50 border border-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Globe size={12} className="text-slate-600" /> {s.type}
                                            </span>
                                            <span className="px-3 py-1 bg-slate-950/50 border border-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={12} className="text-slate-600" /> {s.duration}
                                            </span>
                                        </div>
                                        
                                        <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5 mb-8">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic mb-2">Main Eligibility Criteria</p>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">{s.eligibility}</p>
                                        </div>
                                    </div>

                                    {/* Footer / Progress */}
                                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrollment Progress</span>
                                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">{s.enrolled} Enrolled</span>
                                            </div>
                                            <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-cyan-500 transition-all duration-1000 group-hover:bg-cyan-400" 
                                                    style={{ width: `${(parseInt(s.enrolled.split('/')[0]) / parseInt(s.enrolled.split('/')[1])) * 100}%` }} 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[11px] italic transition-all group-hover:translate-x-2">
                                            See if you qualify
                                            <ArrowRight size={16} className="text-cyan-400" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Trust Indicators Section (Spec 1.1) */}
            <section className="py-24 border-t border-white/5 bg-slate-950/50 relative overflow-hidden">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-black text-white italic tracking-tight uppercase mb-6">Built on Foundation of Trust</h2>
                            <p className="text-slate-400 font-medium leading-relaxed mb-8 italic">
                                Our platform simplifies and streamlines clinical research while maintaining compliance with health data privacy and ethical oversight standards globally.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                    <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                                    <div>
                                        <p className="text-white font-black uppercase tracking-widest text-[11px] mb-1">HIPAA / GDPR</p>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase italic tracking-tighter">De-identified Data Storage</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                    <CheckCircle2 className="text-cyan-500 shrink-0" size={24} />
                                    <div>
                                        <p className="text-white font-black uppercase tracking-widest text-[11px] mb-1">IRB Approved</p>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase italic tracking-tighter">Site-specific protocols</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { val: "1.2k+", label: "Verified Subjects" },
                                { val: "45+", label: "Active Protocols" },
                                { val: "100%", label: "Privacy Rating" }
                            ].map((stat, i) => (
                                <div key={i} className="glass p-8 rounded-3xl border border-white/5 text-center min-w-[160px]">
                                    <p className="text-3xl font-black text-white italic tracking-tighter mb-2">{stat.val}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
