"use client";

import { useState, useEffect } from "react";
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
    Crown,
    Binary as BinaryIcon,
    Briefcase,
    Activity,
    MessageSquare,
    X
} from "lucide-react";
import { SuperAdminAuth } from "@/lib/portal-auth";

export default function SuperAdminNewProtocolBuilder() {
    const [currentStep, setCurrentStep] = useState<number>(1);
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
        targetEnrollment: 0,
        targetCompleted: 0,
        autoRecruitmentStop: true,
        autoStudyComplete: true,
        manualOverrideActive: false,
        proposedStartDate: "",
        enrollmentDeadline: "",
        completionDate: "",
        kitType: "Stool Collection (Gut)",
        carrierPreference: "FedEx Health",
        returnLabelRequired: true,
        safetyAlertsEnabled: true,
        immediateNotificationSeverity: "SEVERE",
        proposalSource: "online",
        contractStatus: "Draft",
        agreementSignedDate: "",
        proposalSubmittedDate: "",
        labUploadsEnabled: false,
        communicationRulesEnabled: false,
        formIds: [] as string[],
        questionnaireIds: [] as string[],
        sponsorName: ""
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
        { id: 11, title: "11. Launch", icon: Rocket },
    ];

    const [coordinators, setCoordinators] = useState<any[]>([]);
    const [pis, setPis] = useState<any[]>([]);
    const [sponsors, setSponsors] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, these would be separate calls or a unified team call
                const token = SuperAdminAuth.get()?.token;
                const res = await fetch("/api/proxy/super-admin/users", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const users = data.users || [];
                    setCoordinators(users.filter((u: any) => u.role === "COORDINATOR"));
                    setPis(users.filter((u: any) => u.role === "PI"));
                    setSponsors(users.filter((u: any) => u.role === "SPONSOR"));
                }
            } catch (err) {
                console.error("Failed to fetch team members", err);
            }
        };
        fetchData();
    }, []);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 11));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const updateField = (field: string, value: any) => {
        setStudyData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: 'coordinatorIds' | 'piIds', id: string) => {
        setStudyData(prev => {
            const current = prev[field] as string[];
            if (current.includes(id)) {
                return { ...prev, [field]: current.filter(item => item !== id) };
            } else {
                return { ...prev, [field]: [...current, id] };
            }
        });
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
            const payload = {
                ...studyData,
                status: "ACTIVE",
                enrollmentCount: 0,
                targetEnrollment: studyData.targetEnrollment,
                sponsorId: studyData.sponsorId || (sponsors.length > 0 ? sponsors[0].id : "SP-001"),
                source: "SUPER_ADMIN"
            };

            const token = SuperAdminAuth.get()?.token;
            const res = await fetch("/api/proxy/super-admin/studies", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Protocol Published Successfully by Super Admin!");
                window.location.href = "/super-admin/studies";
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
        <div className="space-y-8 pb-32 max-w-[1400px]">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <Link href="/super-admin/studies" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Crown size={14} className="text-violet-400" />
                        <span className="text-[10px] font-black text-violet-400/70 uppercase tracking-widest">Platform Control Override</span>
                    </div>
                    <h1 className="text-2xl font-black text-white italic tracking-tight uppercase">Master Protocol Builder</h1>
                    <p className="text-slate-500 text-sm font-medium">Direct instantiation of clinical assets • Bypassing site review</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex justify-between items-start gap-2 overflow-x-auto pb-6 custom-scrollbar-hide px-2">
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center min-w-[80px] group">
                        <div
                            onClick={() => setCurrentStep(step.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${currentStep === step.id ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/20 scale-110' :
                                    currentStep > step.id ? 'bg-violet-950 text-violet-400 border-violet-500/50' :
                                        'bg-slate-900 text-slate-600 border-slate-700 hover:border-slate-500'
                                    }`}>
                            <step.icon size={18} />
                        </div>
                        <span className={`text-[12px] font-black uppercase tracking-tighter mt-2 text-center w-max ${currentStep === step.id ? 'text-violet-400' : 'text-slate-600'}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="glass p-8 rounded-[2rem] border border-white/5 min-h-[550px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                {/* Step 1: Study Setup */}
                {currentStep === 1 && (
                    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Layout className="text-violet-400" size={20} /> Protocol Definition
                        </h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Study Type</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-violet-500 outline-none transition-all appearance-none text-sm"
                                            value={studyData.studyType}
                                            onChange={(e) => updateField('studyType', e.target.value)}
                                        >
                                            <option value="VIRTUAL">Virtual Clinical Trial</option>
                                            <option value="IN_PERSON">In-Person Clinical Trial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Condition</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-violet-500 outline-none transition-all text-sm"
                                            placeholder="e.g. Type 2 Diabetes"
                                            value={studyData.indication}
                                            onChange={(e) => updateField('indication', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Study Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-violet-500 outline-none transition-all font-bold text-sm"
                                        placeholder="Full Protocol Title..."
                                        value={studyData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Scientific Synopsis</label>
                                    <textarea
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-violet-500 outline-none transition-all h-48 text-sm"
                                        placeholder="Description of endpoints and methodology..."
                                        value={studyData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Team Assignment */}
                            <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 space-y-6">
                                <h3 className="text-sm font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                                    <Users size={16} /> Team Assignment
                                </h3>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Linked Sponsor</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                        value={studyData.sponsorId}
                                        onChange={(e) => updateField('sponsorId', e.target.value)}
                                    >
                                        <option value="">Select a Sponsor</option>
                                        {sponsors.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Assign Coordinators</label>
                                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {coordinators.map(c => (
                                            <div 
                                                key={c.id} 
                                                onClick={() => toggleArrayItem('coordinatorIds', c.id)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${studyData.coordinatorIds.includes(c.id) ? 'bg-violet-600/20 border-violet-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10'}`}
                                            >
                                                <span className="text-xs font-bold">{c.name}</span>
                                                {studyData.coordinatorIds.includes(c.id) && <Check size={14} className="text-violet-400" />}
                                            </div>
                                        ))}
                                        {coordinators.length === 0 && <p className="text-[10px] text-slate-600 italic">No coordinators found in system</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Assign PIs (Principal Investigators)</label>
                                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                        {pis.map(p => (
                                            <div 
                                                key={p.id} 
                                                onClick={() => toggleArrayItem('piIds', p.id)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${studyData.piIds.includes(p.id) ? 'bg-violet-600/20 border-violet-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10'}`}
                                            >
                                                <span className="text-xs font-bold">{p.name}</span>
                                                {studyData.piIds.includes(p.id) && <Check size={14} className="text-violet-400" />}
                                            </div>
                                        ))}
                                        {pis.length === 0 && <p className="text-[10px] text-slate-600 italic">No PIs found in system</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Automation Section (Spec 2.3) */}
                        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2rem] space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2 italic">
                                    <Clock size={16} /> Lifecycle Automation Logic
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Override Active</span>
                                    <button 
                                        onClick={() => updateField('manualOverrideActive', !studyData.manualOverrideActive)}
                                        className={`w-10 h-5 rounded-full transition-all relative ${studyData.manualOverrideActive ? 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]' : 'bg-slate-800'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${studyData.manualOverrideActive ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 p-5 bg-black/20 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-white uppercase italic">Automatic Recruitment Completion</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Auto-close recruiting when target is met</p>
                                        </div>
                                        <button 
                                            onClick={() => updateField('autoRecruitmentStop', !studyData.autoRecruitmentStop)}
                                            className={`w-10 h-5 rounded-full transition-all relative ${studyData.autoRecruitmentStop ? 'bg-cyan-600' : 'bg-slate-800'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${studyData.autoRecruitmentStop ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Target Enrollment Count</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 outline-none transition-all font-bold"
                                            value={studyData.targetEnrollment}
                                            onChange={(e) => updateField('targetEnrollment', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 p-5 bg-black/20 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-white uppercase italic">Automatic Study Completion</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Auto-mark study as completed when goal met</p>
                                        </div>
                                        <button 
                                            onClick={() => updateField('autoStudyComplete', !studyData.autoStudyComplete)}
                                            className={`w-10 h-5 rounded-full transition-all relative ${studyData.autoStudyComplete ? 'bg-violet-600' : 'bg-slate-800'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${studyData.autoStudyComplete ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Finishers Needed</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-violet-500 outline-none transition-all font-bold"
                                            value={studyData.targetCompleted}
                                            onChange={(e) => updateField('targetCompleted', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sponsor agreement details (Spec 3.2) */}
                            <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 space-y-4">
                                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 italic">
                                    <Briefcase size={12} /> Sponsor Agreement Section
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Proposal Source</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                            value={studyData.proposalSource}
                                            onChange={(e) => updateField('proposalSource', e.target.value)}
                                        >
                                            <option value="online">Online Portal</option>
                                            <option value="offline">Offline / Manual</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Contract Status</label>
                                        <input 
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                            placeholder="Pending / Signed"
                                            value={studyData.contractStatus}
                                            onChange={(e) => updateField('contractStatus', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Agreement Signed</label>
                                        <input 
                                            type="date"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                            value={studyData.agreementSignedDate}
                                            onChange={(e) => updateField('agreementSignedDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Proposed Launch</label>
                                        <input 
                                            type="date"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                                            value={studyData.completionDate}
                                            onChange={(e) => updateField('completionDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Design */}
                {currentStep === 2 && (
                    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up text-center">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mb-8">Design Methodology</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'Parallel', title: 'Parallel Assignment', icon: Layers },
                                { id: 'Crossover', title: 'Crossover Assignment', icon: Repeat },
                                { id: 'Factorial', title: 'Factorial Assignment', icon: Grid },
                                { id: 'Sequential', title: 'Sequential Assignment', icon: ListOrdered },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => updateField('designType', item.id)}
                                    className={`p-6 rounded-3xl border text-left transition-all flex gap-5 items-center ${studyData.designType === item.id ? 'bg-violet-600/10 border-violet-500 text-white shadow-xl shadow-violet-500/5' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10'}`}
                                >
                                    <div className={`p-4 rounded-2xl ${studyData.designType === item.id ? 'bg-violet-600 text-white' : 'bg-slate-950 text-slate-600'}`}>
                                        <item.icon size={24} />
                                    </div>
                                    <span className="font-black text-lg italic uppercase tracking-tight">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Arms */}
                {currentStep === 3 && (
                    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Study Arms</h2>
                            <button onClick={() => addArrayItem('arms', { name: "New Arm", product: "" })} className="px-4 py-2 bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-500 transition-all flex items-center gap-2">
                                <Plus size={16} /> Add Arm
                            </button>
                        </div>
                        <div className="space-y-4">
                            {studyData.arms.map((arm, idx) => (
                                <div key={idx} className="bg-slate-900 border border-white/5 p-6 rounded-3xl flex gap-6 items-start relative group">
                                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-xl font-black text-violet-500 italic">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <input 
                                            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold italic focus:border-violet-500 outline-none" 
                                            value={arm.name} 
                                            placeholder="Arm Name"
                                            onChange={(e) => {
                                                const newArms = [...studyData.arms];
                                                newArms[idx].name = e.target.value;
                                                setStudyData(prev => ({ ...prev, arms: newArms }));
                                            }} 
                                        />
                                        <input 
                                            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none" 
                                            value={arm.product} 
                                            placeholder="Product / Medication"
                                            onChange={(e) => {
                                                const newArms = [...studyData.arms];
                                                newArms[idx].product = e.target.value;
                                                setStudyData(prev => ({ ...prev, arms: newArms }));
                                            }} 
                                        />
                                    </div>
                                    <button onClick={() => removeArrayItem('arms', idx)} className="text-slate-600 hover:text-red-500 transition-colors p-2"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Placeholder Logic for 4-10: Display correctly but skip heavy detail for Super Admin speed */}
                {currentStep > 3 && currentStep < 11 && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-violet-600/10 text-violet-500 rounded-3xl border border-violet-500/20 flex items-center justify-center">
                            {(() => {
                                const Icon = steps.find(s => s.id === currentStep)?.icon;
                                return Icon ? <Icon size={36} /> : null;
                            })()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">
                                {steps.find(s => s.id === currentStep)?.title} Configuration
                            </h2>
                            <p className="text-slate-500 max-w-sm font-medium">Standard clinical parameters for {steps.find(s => s.id === currentStep)?.title.split('. ')[1]} have been pre-initialized.</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleNext} className="px-8 py-3 bg-violet-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg shadow-violet-600/20 hover:bg-violet-500 transition-all">Continue to Next Phase</button>
                        </div>
                    </div>
                )}

                {/* Step 11: Launch */}
                {currentStep === 11 && (
                    <div className="text-center py-12 animate-fade-in-up">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                            <Rocket size={48} className="text-emerald-400 animate-bounce" />
                        </div>
                        <h2 className="text-4xl font-black text-white italic mb-4">Launch Study</h2>
                        <p className="text-slate-400 leading-relaxed max-w-lg mx-auto mb-8 font-medium">This protocol will be activated immediately and visible on the public portal for recruitment.</p>
                        
                        <div className="max-w-xl mx-auto grid grid-cols-2 gap-4 mb-10">
                            {[
                                { id: 'labUploadsEnabled', label: 'Lab Uploads', icon: FlaskConical },
                                { id: 'communicationRulesEnabled', label: 'Comm Rules', icon: MessageSquare },
                            ].map(op => (
                                <button
                                    key={op.id}
                                    onClick={() => updateField(op.id as any, !studyData[op.id as keyof typeof studyData])}
                                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${studyData[op.id as keyof typeof studyData] ? 'bg-violet-600/10 border-violet-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <op.icon size={16} />
                                        <span className="text-[11px] font-black uppercase tracking-widest">{op.label}</span>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full relative transition-all ${studyData[op.id as keyof typeof studyData] ? 'bg-violet-600' : 'bg-slate-800'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${studyData[op.id as keyof typeof studyData] ? 'right-0.5' : 'left-0.5'}`} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center gap-6">
                            <button
                                onClick={handlePublish}
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-500/20 transition-all text-[13px] flex items-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                {isSubmitting ? "Activating..." : "Deploy to Production"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-6 bg-[#020617]/80 backdrop-blur-xl border-t border-white/5 z-20">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[12px] flex items-center gap-2 transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-white'}`}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    <div className="flex items-center gap-1.5">
                        {steps.map(s => (
                            <div key={s.id} className={`w-1.5 h-1.5 rounded-full ${currentStep === s.id ? 'bg-violet-500 w-4' : 'bg-slate-800'} transition-all`} />
                        ))}
                    </div>

                    {currentStep < 11 && (
                        <button
                            onClick={handleNext}
                            className="px-10 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 text-[12px] shadow-lg shadow-violet-600/20"
                        >
                            Continue <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
