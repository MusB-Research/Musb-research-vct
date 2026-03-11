"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Layout,
    Users,
    Calendar,
    FileText,
    ShieldCheck,
    ShieldAlert,
    Plus,
    Trash2,
    FlaskConical,
    FileSignature,
    ClipboardList,
    Binary,
    Truck,
    Rocket,
    Clock,
    Loader2,
    Layers,
    Repeat,
    Grid,
    ListOrdered,
    Video,
    Globe,
    Zap,
    Search,
    Mail,
    Check,
    Settings,
    Smartphone,
    BarChart
} from "lucide-react";

export default function NewStudyBuilder() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [studyData, setStudyData] = useState({
        title: "",
        indication: "",
        description: "",
        studyType: "VIRTUAL",
        designType: "Interventional",
        blinding: "Double Blind",
        arms: [{ name: "Treatment Group", product: "" }, { name: "Placebo Group", product: "Placebo" }],
        inclusion: [""],
        exclusion: [""],
        sponsorId: "",
        coordinatorIds: [] as string[],
        piIds: [] as string[],
        targetScreened: 0,
        targetEligible: 0,
        targetConsented: 0,
        targetEnrolled: 0,
        proposedStartDate: "",
        enrollmentDeadline: "",
        completionDate: "",
        kitType: "Stool Collection (Gut)",
        carrierPreference: "FedEx Health",
        returnLabelRequired: true,
        safetyAlertsEnabled: true,
        immediateNotificationSeverity: "SEVERE"
    });

    const steps = [
        { id: 1, title: "1. Setup", icon: Layout },
        { id: 2, title: "2. Design", icon: FlaskConical },
        { id: 3, title: "3. Arms", icon: Binary },
        { id: 4, title: "4. Eligibility", icon: Users },
        { id: 5, title: "5. Consent", icon: FileSignature },
        { id: 6, title: "6. Assessments", icon: ClipboardList },
        { id: 7, title: "7. Schedule", icon: Calendar },
        { id: 8, title: "8. IRT", icon: Binary },
        { id: 9, title: "9. Logistics", icon: Truck },
        { id: 10, title: "10. Safety", icon: ShieldAlert },
        { id: 11, title: "11. Operational", icon: Settings },
        { id: 12, title: "12. Launch", icon: Rocket },
    ];

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 12));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const updateField = (field: string, value: any) => {
        setStudyData(prev => ({ ...prev, [field]: value }));
    };

    const addArrayItem = (field: 'inclusion' | 'exclusion' | 'arms', initialValue: any) => {
        setStudyData(prev => ({ ...prev, [field]: [...prev[field], initialValue] }));
    };

    const updateArrayItem = (field: 'inclusion' | 'exclusion', index: number, value: string) => {
        const newArray = [...studyData[field]];
        newArray[index] = value;
        setStudyData(prev => ({ ...prev, [field]: newArray }));
    };

    const removeArrayItem = (field: 'inclusion' | 'exclusion' | 'arms', index: number) => {
        const newArray = [...studyData[field]];
        newArray.splice(index, 1);
        setStudyData(prev => ({ ...prev, [field]: newArray }));
    };

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // Mapping frontend state to backend model naming
            const payload = {
                ...studyData,
                status: "ACTIVE", // Force active on publish
                enrollmentCount: 0,
                targetEnrollment: studyData.targetEnrolled,
                sponsorId: studyData.sponsorId || "SP-001",
            };

            const res = await fetch("/api/proxy/admin/studies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Protocol Published Successfully!");
                window.location.href = "/admin/studies";
            } else {
                const err = await res.json();
                alert(`Error: ${err.detail || "Failed to publish protocol"}`);
            }
        } catch (error) {
            alert("Connection error occurred during publication.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <Link href="/admin/studies" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-white italic tracking-tight uppercase">Protocol Builder</h1>
                    <p className="text-slate-500 text-sm font-medium">Virtual Clinical Trial System • No-Code Interface</p>
                </div>
            </div>

            {/* Stepper (Scrollable for 11 steps) */}
            <div className="flex justify-between items-start gap-2 overflow-x-auto pb-6 custom-scrollbar-hide px-2">
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center min-w-[80px] group">
                        <div
                            onClick={() => setCurrentStep(step.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${currentStep === step.id ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20 scale-110' :
                                    currentStep > step.id ? 'bg-cyan-950 text-cyan-400 border-cyan-500/50' :
                                        'bg-slate-900 text-slate-600 border-slate-700 hover:border-slate-500'
                                }`}>
                            <step.icon size={18} />
                        </div>
                        <span className={`text-[13px] font-black uppercase tracking-tighter mt-2 text-center w-max ${currentStep === step.id ? 'text-cyan-400' : 'text-slate-600'}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="glass p-8 rounded-[2rem] border border-white/5 min-h-[550px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                {/* Step 1: Study Setup */}
                {currentStep === 1 && (
                    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Layout className="text-cyan-400" size={20} /> Protocol Information (Spec 4.5)
                        </h2>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            {/* Basics */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Study Title <span className="text-cyan-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all font-bold italic"
                                        placeholder="e.g. NAD+ Supplementation for Longevity Phase II"
                                        value={studyData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Proposal Source</label>
                                        <select className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all appearance-none">
                                            <option>Online Submission</option>
                                            <option>Offline Referral</option>
                                            <option>Direct Partnership</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Study Type</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all appearance-none"
                                            value={studyData.studyType}
                                            onChange={(e) => updateField('studyType', e.target.value)}
                                        >
                                            <option value="VIRTUAL">Virtual Clinical Trial</option>
                                            <option value="IN_PERSON">In-Person Clinical Trial</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Sponsor Name</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all appearance-none"
                                            value={studyData.sponsorId}
                                            onChange={(e) => updateField('sponsorId', e.target.value)}
                                        >
                                            <option value="">Select Sponsor...</option>
                                            <option value="SP-001">BioGen Pharma Inc.</option>
                                            <option value="SP-002">Astra Biotech</option>
                                            <option value="SP-003">Longevity Labs</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Initial Status</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all appearance-none text-xs"
                                            defaultValue="Draft"
                                        >
                                            <option>Draft / Preparing</option>
                                            <option>Proposal Submitted</option>
                                            <option>Negotiation</option>
                                            <option>Sponsor Signed</option>
                                            <option>IRB Submission</option>
                                            <option>IRB Approved</option>
                                            <option>Preparing to Launch</option>
                                            <option>Active - Recruiting</option>
                                            <option>Recruitment Completed</option>
                                            <option>Analysis Underway</option>
                                            <option>Report Draft</option>
                                            <option>Report Sent</option>
                                            <option>Completed</option>
                                            <option>Paused / On Hold</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Primary Indication</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all"
                                        placeholder="e.g. Metabolic Health, Gut Microbiome"
                                        value={studyData.indication}
                                        onChange={(e) => updateField('indication', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Assignments & Dates */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Assigned PI</label>
                                        <select className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all appearance-none">
                                            <option>Unassigned</option>
                                            <option>Dr. Michael Aris</option>
                                            <option>Dr. Sarah Chen</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Coordinator</label>
                                        <select className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all appearance-none">
                                            <option>Unassigned</option>
                                            <option>Brijesh Patel</option>
                                            <option>Jane Doe</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all"
                                            value={studyData.proposedStartDate}
                                            onChange={(e) => updateField('proposedStartDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all"
                                            value={studyData.completionDate}
                                            onChange={(e) => updateField('completionDate', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Enrollment Targets (Total Participants)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black mb-1">SCREENED</p>
                                            <input type="number" className="bg-transparent border-none outline-none text-white font-bold w-full" defaultValue={500} />
                                        </div>
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black mb-1">ELIGIBLE</p>
                                            <input type="number" className="bg-transparent border-none outline-none text-white font-bold w-full" defaultValue={200} />
                                        </div>
                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-black mb-1">ENROLLED</p>
                                            <input type="number" className="bg-transparent border-none outline-none text-white font-bold w-full" defaultValue={100} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Scientific Summary</label>
                                    <textarea
                                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all h-24"
                                        placeholder="Brief overview of protocol objectives..."
                                        value={studyData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Study Design */}
                {currentStep === 2 && (
                    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Execution Methodology</h2>
                            <p className="text-slate-500 font-medium">Select the scientific framework that governs this protocol.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'Parallel', title: 'Parallel Assignment', desc: 'Participants are assigned to one of two or more arms for the entire study duration.', icon: Layers },
                                { id: 'Crossover', title: 'Crossover Assignment', desc: 'Participants receive both treatments in a sequential order with a washout period.', icon: Repeat },
                                { id: 'Factorial', title: 'Factorial Assignment', desc: 'Participants are assigned to one of multiple combinations of interventions.', icon: Grid },
                                { id: 'Sequential', title: 'Sequential Assignment', desc: 'Participants are assigned to groups determined by their entry time or prior results.', icon: ListOrdered },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => updateField('designType', item.id)}
                                    className={`p-6 rounded-[2rem] border text-left transition-all flex gap-5 items-start relative overflow-hidden group ${studyData.designType === item.id ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-2xl shadow-cyan-500/5' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10'}`}
                                >
                                    {studyData.designType === item.id && (
                                        <div className="absolute top-0 right-0 p-3">
                                            <CheckCircle2 size={16} className="text-cyan-400" />
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-2xl ${studyData.designType === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-950 text-slate-600'} group-hover:scale-110 transition-transform`}>
                                        {/* @ts-ignore - Dynamic icons */}
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg mb-1 italic uppercase tracking-tight leading-none pt-1">{item.title}</h3>
                                        <p className="text-[13px] font-medium opacity-70 leading-relaxed mt-2">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-slate-950/50 rounded-3xl border border-white/5 flex items-center justify-between">
                            <div>
                                <h4 className="text-[13px] font-black text-white uppercase tracking-widest italic">Blinding Model</h4>
                                <p className="text-[12px] text-slate-500 font-medium">Select the masking strategy to prevent bias.</p>
                            </div>
                            <div className="flex bg-slate-900 p-1.5 rounded-xl gap-1 border border-white/5">
                                {['Open Label', 'Single Blind', 'Double Blind', 'Triple Blind'].map(b => (
                                    <button 
                                        key={b} 
                                        onClick={() => updateField('blinding', b)}
                                        className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${studyData.blinding === b ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Arms & Products */}
                {currentStep === 3 && (
                    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Trial Arms</h2>
                                <p className="text-slate-500 font-medium">Define treatment groups and investigational products.</p>
                            </div>
                            <button onClick={() => addArrayItem('arms', { name: "New Arm", product: "" })} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/20">
                                <Plus size={16} /> Add Study Arm
                            </button>
                        </div>
                        <div className="space-y-4">
                            {studyData.arms.map((arm, idx) => (
                                <div key={idx} className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] group relative hover:border-cyan-500/20 transition-all">
                                    <div className="absolute top-8 right-8">
                                        <button onClick={() => removeArrayItem('arms', idx)} className="text-slate-700 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                                    </div>
                                    <div className="flex gap-8 items-start">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 border border-white/5 flex items-center justify-center text-xl font-black text-cyan-500 shadow-xl italic tracking-tighter">
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <div className="flex-1 space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Arm Designation</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-black italic tracking-tight focus:border-cyan-500 outline-none transition-all" 
                                                        value={arm.name} 
                                                        placeholder="e.g. Treatment Group A"
                                                        onChange={(e) => {
                                                            const newArms = [...studyData.arms];
                                                            newArms[idx].name = e.target.value;
                                                            setStudyData(prev => ({ ...prev, arms: newArms }));
                                                        }} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Investigational Product (IP)</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:border-cyan-500 outline-none transition-all" 
                                                        placeholder="e.g. MUSB-202X Compound"
                                                        value={arm.product} 
                                                        onChange={(e) => {
                                                            const newArms = [...studyData.arms];
                                                            newArms[idx].product = e.target.value;
                                                            setStudyData(prev => ({ ...prev, arms: newArms }));
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                                                    <span className="text-[12px] font-bold text-slate-400">Placebo Controlled</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                                                    <span className="text-[12px] font-bold text-slate-400">Active Comparator</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Eligibility Rules */}
                {currentStep === 4 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Eligibility Criteria</h2>
                                <p className="text-slate-500 font-medium">Define logic for automated participant pre-screening.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-white/5">
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Logic:</span>
                                    <select className="bg-transparent text-[11px] font-black text-cyan-400 uppercase tracking-widest outline-none">
                                        <option>AND (All Match)</option>
                                        <option>OR (Any Match)</option>
                                    </select>
                                </div>
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">Auto-Generate Form</button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-12 pt-4">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center group">
                                    <h3 className="font-black text-[13px] uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2 italic">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Inclusion Criteria
                                    </h3>
                                    <button onClick={() => addArrayItem('inclusion', "")} className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"><Plus size={16} /></button>
                                </div>
                                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                                    {studyData.inclusion.map((crit, idx) => (
                                        <div key={idx} className="flex gap-3 group/item">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-emerald-500/50 outline-none font-medium transition-all" 
                                                    placeholder="Requirement description..." 
                                                    value={crit} 
                                                    onChange={(e) => updateArrayItem('inclusion', idx, e.target.value)} 
                                                />
                                            </div>
                                            <button onClick={() => removeArrayItem('inclusion', idx)} className="text-slate-700 hover:text-red-500 transition-colors self-center p-2"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 border-l border-white/5 pl-12">
                                <div className="flex justify-between items-center group">
                                    <h3 className="font-black text-[13px] uppercase tracking-[0.2em] text-red-400 flex items-center gap-2 italic">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Exclusion Criteria
                                    </h3>
                                    <button onClick={() => addArrayItem('exclusion', "")} className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Plus size={16} /></button>
                                </div>
                                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                                    {studyData.exclusion.map((crit, idx) => (
                                        <div key={idx} className="flex gap-3 group/item">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-red-500/50 outline-none font-medium transition-all" 
                                                    placeholder="Disqualification reason..." 
                                                    value={crit} 
                                                    onChange={(e) => updateArrayItem('exclusion', idx, e.target.value)} 
                                                />
                                            </div>
                                            <button onClick={() => removeArrayItem('exclusion', idx)} className="text-slate-700 hover:text-red-500 transition-colors self-center p-2"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Consent Management */}
                {currentStep === 5 && (
                    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Consent Workflow</h2>
                                <p className="text-slate-500 font-medium">Manage Informed Consent Documentation and Signing flows.</p>
                            </div>
                            <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-black uppercase tracking-widest rounded-xl">
                                {studyData.studyType === 'VIRTUAL' ? 'e-Consent Active' : 'Hybrid Consent Enabled'}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 space-y-6">
                                <div className="p-16 border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/40 text-center group hover:border-cyan-500/40 transition-all cursor-pointer relative overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <FileSignature className="mx-auto text-slate-700 mb-6 group-hover:text-cyan-400 transition-colors scale-125" size={48} />
                                     <p className="text-xl font-black text-white italic tracking-tight mb-2 uppercase">Upload ICF MASTER</p>
                                     <p className="text-[13px] text-slate-500 font-medium uppercase tracking-[0.2em]">PDF, DOCX up to 50MB</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                     <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl group cursor-pointer hover:border-cyan-500/30 transition-all">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-xl bg-slate-950 text-cyan-400 border border-white/5"><Globe size={20} /></div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Multi-Language</h4>
                                        </div>
                                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Add localized versions for global clinical recruitment.</p>
                                     </div>
                                     <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl group cursor-pointer hover:border-cyan-500/30 transition-all">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-xl bg-slate-950 text-cyan-400 border border-white/5"><Video size={20} /></div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Video Verify</h4>
                                        </div>
                                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Require 10s face-recording during signature (Virtual only).</p>
                                     </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Workflow Settings</h4>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Automatic Re-consent', sub: 'On minor/major version delta', icon: Repeat },
                                            { label: 'E-Witness required', sub: 'Independent signing verify', icon: ShieldCheck },
                                            { label: 'Manual physical scan', sub: 'Allow PDF upload by site', icon: FileText },
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <input type="checkbox" className="mt-1 w-4 h-4 accent-cyan-500" />
                                                <div>
                                                    <p className="text-[13px] font-black text-white uppercase tracking-tight italic">{s.label}</p>
                                                    <p className="text-[11px] text-slate-600 font-medium mt-1">{s.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 6: Assessments Library */}
                {currentStep === 6 && (
                    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Protocol Assessments</h2>
                                <p className="text-slate-500 font-medium">Select validated questionnaires or design custom ePRO forms.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
                                    <input type="text" placeholder="Search Master Library..." className="bg-slate-900 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:border-cyan-500/50 outline-none w-64 transition-all" />
                                </div>
                                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
                                    <Plus size={14} /> Build Custom Form
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1 space-y-2">
                                {['Validated Scales', 'ePRO / eCOA', 'Lab Bio-markers', 'Physical Exams', 'Custom Forms'].map(cat => (
                                    <button key={cat} className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="col-span-3 grid grid-cols-2 gap-4">
                                {[
                                    { title: 'Gut Health Questionnaire', category: 'Validated', questions: 12, mode: 'Digital' },
                                    { title: 'Sleep Quality Index (PSQI)', category: 'Standard', questions: 18, mode: 'Digital' },
                                    { title: 'Mood & Stress Scale (DASS-21)', category: 'Psychological', questions: 21, mode: 'Digital' },
                                    { title: 'Stool Sample Bio-analysis', category: 'Bio-marker', questions: 45, mode: 'Physical Kit' },
                                    { title: 'Metabolic Blood Spot', category: 'Bio-marker', questions: 32, mode: 'Physical Kit' },
                                    { title: 'Weekly Diet Log (ePRO)', category: 'Custom', questions: 8, mode: 'Digital' },
                                ].map((form, i) => (
                                    <div key={i} className="p-6 bg-slate-900/80 border border-white/5 rounded-[2rem] hover:border-cyan-500/30 transition-all group cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                            <input type="checkbox" className="w-5 h-5 accent-cyan-500 rounded-lg" />
                                        </div>
                                        <div className="mb-4 flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-slate-950 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded border border-white/5">{form.category}</span>
                                            <span className="px-2 py-0.5 bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded border border-white/5">{form.mode}</span>
                                        </div>
                                        <h4 className="text-lg font-black text-white italic uppercase tracking-tight group-hover:text-cyan-400 transition-colors leading-tight mb-2">{form.title}</h4>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <ClipboardList size={14} />
                                            <span className="text-[11px] font-bold">{form.questions} data points mapped</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 7: Schedule Designer */}
                {currentStep === 7 && (
                    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Protocol Schedule</h2>
                                <p className="text-slate-500 font-medium">Define visits, assessment windows, and notification triggers.</p>
                            </div>
                            <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
                                <Plus size={16} /> Define New Visit
                            </button>
                        </div>

                        <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 p-10 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-16 relative">
                                <div className="absolute top-[22px] left-0 w-full h-px bg-white/5 -z-10" />
                                {[
                                    { day: 0, label: 'Screening', id: 'scr', color: 'bg-emerald-500' },
                                    { day: 1, label: 'Baseline (V1)', id: 'bl', color: 'bg-cyan-500' },
                                    { day: 14, label: 'Followup (V2)', id: 'f1', color: 'bg-cyan-500' },
                                    { day: 28, label: 'Mid-Point (V3)', id: 'f2', color: 'bg-cyan-500' },
                                    { day: 56, label: 'End of Study (V4)', id: 'eos', color: 'bg-indigo-500' },
                                ].map((v, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                                        <div className={`w-12 h-12 rounded-2xl ${v.color} border-4 border-[#020617] shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:shadow-cyan-500/20`}>
                                            <Calendar size={18} className="text-white" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Day {v.day}</p>
                                            <p className="text-[12px] font-black text-white uppercase tracking-tight leading-none">{v.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Clock className="text-cyan-500 group-hover:rotate-12 transition-transform" size={20} />
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Visit Windows</h4>
                                    </div>
                                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-4">Baseline: Fixed (D0)<br/>Followups: +/- 3 Days</p>
                                    <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Adjust Windows</button>
                                </div>
                                <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Zap className="text-cyan-500 group-hover:scale-110 transition-transform" size={20} />
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Reminders</h4>
                                    </div>
                                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-4">T-48h: SMS Notification<br/>T-24h: Push Alert</p>
                                    <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Configure Alerts</button>
                                </div>
                                <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3 mb-6">
                                        <ClipboardList className="text-cyan-500 group-hover:translate-y-px transition-transform" size={20} />
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Assessment Map</h4>
                                    </div>
                                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-4">12 Vital Signs<br/>3 Lab Kits mapped</p>
                                    <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Map Forms</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 8: Randomization / IRT */}
                {currentStep === 8 && (
                    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">IRT & Randomization</h2>
                                <p className="text-slate-500 font-medium">Configure subject numbering and treatment assignment logic.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">V2.0 Randomizer</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="space-y-4">
                                {[
                                    { title: 'Fixed Block Randomization', desc: 'Maintains strict balance across arms using permutation blocks.', icon: Layers },
                                    { title: 'Stratified Assignment', desc: 'Balances across criteria like Age, BMI, or Smoking Status.', icon: Grid },
                                    { title: 'Adaptive Randomization', desc: 'Dynamic logic that adjusts based on accruing data.', icon: Repeat },
                                    { id: 'simple', title: 'Simple Randomization', desc: 'Individual toss logic (Higher risk of imbalance).', icon: Binary },
                                ].map(type => (
                                    <label key={type.title} className="flex items-start gap-5 p-6 bg-slate-900 border border-white/5 rounded-[2rem] cursor-pointer hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                                        <input type="radio" name="randomType" className="mt-2 w-4 h-4 accent-cyan-500" />
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <type.icon size={48} />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-white uppercase italic tracking-tight group-hover:text-cyan-400 transition-colors uppercase">{type.title}</p>
                                            <p className="text-[13px] text-slate-500 font-medium mt-1 pr-6">{type.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="p-8 bg-slate-950/50 rounded-[3.5rem] border border-white/5 space-y-8">
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">IRT Parameters</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Block Size</label>
                                                <select className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs font-bold font-sans">
                                                    <option>4 (Recommended)</option>
                                                    <option>6</option>
                                                    <option>8 (Mixed)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Subject ID Mask</label>
                                                <input type="text" className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white text-xs font-bold" placeholder="MUSB-S-####" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                         <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Stratification Factors</h4>
                                         <div className="space-y-2">
                                            {['Biological Sex', 'Clinical Site Location', 'Age Group (18-45, 45+)'].map(f => (
                                                <div key={f} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5">
                                                    <span className="text-[11px] font-bold text-slate-300">{f}</span>
                                                    <button className="text-slate-600 hover:text-red-400 text-xs">×</button>
                                                </div>
                                            ))}
                                            <button className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[10px] font-black text-cyan-500 uppercase tracking-widest">+ Add Factor</button>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 9: Logistics */}
                {currentStep === 9 && (
                    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in-up">
                         <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Inventory & Supply</h2>
                                <p className="text-slate-500 font-medium">Configure investigational product (IP) handling and global carrier logic.</p>
                            </div>
                            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-black uppercase tracking-widest rounded-xl">
                                Cold Chain Tracking Active
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-2">Courier Integration</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { name: 'FedEx Healthcare', logo: '/fedex.svg', desc: 'Specialized medical handling with real-time GPS tracking.' },
                                        { name: 'UPS Healthcare', logo: '/ups.svg', desc: 'Premier cold-chain solutions for sensitive biologicals.' },
                                        { name: 'DHL Medical Express', logo: '/dhl.svg', desc: 'Optimized for international clinical sample exports.' },
                                    ].map(carrier => (
                                        <label key={carrier.name} className="flex items-center gap-6 p-6 bg-slate-900 border border-white/5 rounded-[2rem] cursor-pointer hover:border-blue-500/30 transition-all group">
                                            <input 
                                                type="radio" 
                                                name="carrier" 
                                                className="w-4 h-4 accent-blue-500" 
                                                checked={studyData.carrierPreference === carrier.name}
                                                onChange={() => updateField('carrierPreference', carrier.name)}
                                            />
                                            <div className="flex-1">
                                                <p className="text-base font-black text-white italic uppercase tracking-tight group-hover:text-blue-400 transition-colors">{carrier.name}</p>
                                                <p className="text-[12px] text-slate-500 font-medium mt-1 leading-relaxed">{carrier.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-8 bg-slate-950/50 rounded-[3rem] border border-white/5 space-y-8">
                                    <div>
                                         <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-6">Fulfillment Logic</h3>
                                         <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-2xl group cursor-pointer hover:border-blue-500/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <Truck className="text-blue-500" size={20} />
                                                    <div>
                                                        <p className="text-[13px] font-black text-white uppercase tracking-tight italic">Auto-Return Label</p>
                                                        <p className="text-[11px] text-slate-600 font-bold">Upon delivery confirm</p>
                                                    </div>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 accent-blue-500" 
                                                    checked={studyData.returnLabelRequired}
                                                    onChange={(e) => updateField('returnLabelRequired', e.target.checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-2xl group cursor-pointer hover:border-blue-500/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <ShieldCheck className="text-blue-500" size={20} />
                                                    <div>
                                                        <p className="text-[13px] font-black text-white uppercase tracking-tight italic">Proof of Signature</p>
                                                        <p className="text-[11px] text-slate-600 font-bold">Mandatory for all kits</p>
                                                    </div>
                                                </div>
                                                <input type="checkbox" className="w-5 h-5 accent-blue-500" defaultChecked />
                                            </div>
                                         </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                         <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-4">Stock Trigger</h3>
                                         <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <p className="text-[11px] text-slate-400 font-medium mb-2 uppercase tracking-widest">Re-order threshold</p>
                                                <div className="flex items-center gap-3">
                                                    <input type="range" className="flex-1 accent-blue-500" min="5" max="50" defaultValue="20" />
                                                    <span className="text-[14px] font-black text-white italic">20%</span>
                                                </div>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 10: Safety Configuration */}
                {currentStep === 10 && (
                    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Patient Pharmacovigilance</h2>
                                <p className="text-slate-500 font-medium">Define automated triggers for adverse event (AE/SAE) monitoring.</p>
                            </div>
                            <div 
                                onClick={() => updateField('safetyAlertsEnabled', !studyData.safetyAlertsEnabled)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl cursor-pointer transition-all border ${studyData.safetyAlertsEnabled ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${studyData.safetyAlertsEnabled ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                                <span className="text-[11px] font-black uppercase tracking-widest">{studyData.safetyAlertsEnabled ? 'Safety Engine LIVE' : 'Safety Engine DISABLED'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-4">
                            <div className="col-span-2 space-y-6">
                                <div className="p-8 bg-slate-900/40 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ShieldAlert size={64} className="text-red-500" />
                                     </div>
                                     <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-6">Notification Logic</h3>
                                     
                                     <div className="space-y-8">
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <p className="text-[13px] font-black text-white italic uppercase tracking-tight">Immediate Escalation Threshold</p>
                                                <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest">MedDRA Mapped</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['MILD', 'MODERATE', 'SEVERE'].map(lvl => (
                                                    <button 
                                                        key={lvl}
                                                        onClick={() => updateField('immediateNotificationSeverity', lvl)}
                                                        className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${studyData.immediateNotificationSeverity === lvl ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-white'}`}
                                                    >
                                                        {lvl}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest italic">Stakeholder Alerts</p>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                                <input 
                                                    type="email" 
                                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-red-500/50 outline-none font-medium transition-all" 
                                                    placeholder="Enter distribution group email..."
                                                />
                                            </div>
                                            <p className="text-[11px] text-slate-600 font-medium">Sponsors and Medical Monitors on this list will receive 24/7 pings for SAEs.</p>
                                        </div>
                                     </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Compliance Rules</h4>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'E2B(R3) Export', sub: 'Ready for FDA FAERS upload', icon: FileText },
                                            { label: 'DSMB Real-time', sub: 'Shared dashboard access', icon: Users },
                                            { label: 'Auto-Coding', sub: 'WHODrug / MedDRA mapping', icon: Binary },
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className="w-5 h-5 rounded bg-red-500/10 flex items-center justify-center text-red-500 mt-0.5">
                                                    <Check size={12} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-black text-white uppercase tracking-tight italic">{s.label}</p>
                                                    <p className="text-[11px] text-slate-600 font-medium mt-1">{s.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 11: Operational Settings (Spec 4.5 Section D) */}
                {currentStep === 11 && (
                    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-2">Operational Controls</h2>
                                <p className="text-slate-500 font-medium">Enable or disable specific research infrastructure modules.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {[
                                { label: 'Participant Portal', desc: 'Enable patient-facing app access', icon: Smartphone },
                                { label: 'Online Lead Intake', desc: 'Activate public landing page forms', icon: Rocket },
                                { label: 'Offline Uploads', desc: 'Allow site staff to upload paper records', icon: FileText },
                                { label: 'Automated Scheduling', desc: 'Sync visits with participant local time', icon: Calendar },
                                { label: 'Participant Compensation', desc: 'Enable digital payments/stipends', icon: BarChart },
                                { label: 'IRT / Kit Tracking', desc: 'Live logistics & courier integration', icon: Truck },
                                { label: 'Lab Result Imports', desc: 'Automated parsing of diagnostic data', icon: FlaskConical },
                                { label: 'Notifications (SMS/Email)', desc: 'Broadcast alerts and appointment pings', icon: Zap },
                            ].map((op, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-900/60 border border-white/5 rounded-3xl group hover:border-cyan-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-slate-950 text-cyan-500 group-hover:scale-110 transition-transform">
                                            <op.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-white uppercase tracking-tight italic">{op.label}</p>
                                            <p className="text-[11px] text-slate-600 font-bold">{op.desc}</p>
                                        </div>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 4} />
                                        <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 12: Launch */}
                {currentStep === 12 && (
                    <div className="text-center py-12 animate-fade-in-up">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                            <Rocket size={48} className="text-emerald-400 animate-bounce" />
                        </div>
                        <h2 className="text-4xl font-black text-white italic mb-4">Protocol Validated</h2>
                        <p className="text-slate-400 leading-relaxed max-w-xl mx-auto mb-10 font-medium">Your study configuration has passed automated logic checks. Publishing will initiate public recruitment and enable landing page indexing.</p>
                        <div className="flex justify-center gap-6">
                            <button 
                                disabled={isSubmitting}
                                className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all text-[13px] disabled:opacity-50"
                            >
                                Save as Build
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isSubmitting}
                                className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 transition-all text-[13px] flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
                                {isSubmitting ? "Publishing..." : "Publish Protocol"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-64 right-0 p-6 bg-[#0A1128]/80 backdrop-blur-xl border-t border-white/5 z-20">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[13px] flex items-center gap-2 transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    <div className="hidden md:flex items-center gap-2">
                        {steps.map(s => (
                            <div key={s.id} className={`w-1.5 h-1.5 rounded-full ${currentStep === s.id ? 'bg-cyan-500 w-4' : currentStep > s.id ? 'bg-cyan-900' : 'bg-slate-800'} transition-all`} />
                        ))}
                    </div>

                    {currentStep < 12 ? (
                        <button
                            onClick={handleNext}
                            className="px-10 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 text-[13px]"
                        >
                            Continue <ChevronRight size={16} />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
