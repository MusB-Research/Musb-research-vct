"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    BarChart3,
    Users,
    Activity,
    ShieldAlert,
    Calendar,
    Settings2,
    Save,
    Trash2,
    ExternalLink,
    Loader2,
    FlaskConical,
    Target,
    Layout,
    Clock,
    CheckCircle2
} from "lucide-react";

const STUDY_STATUSES = [
    "Draft", "Proposal Submitted", "Proposal Under Negotiation", "Agreement Signed",
    "IRB Protocol Initiated", "Under IRB Submission / Development", "IRB Approved",
    "Preparing to Launch", "Active", "Recruiting", "Recruitment Completed",
    "Analysis Underway", "Progress Report Draft Created", "Project Report Sent to Sponsor",
    "Completed", "Paused", "Closed / Archived"
];

import { 
    Briefcase, 
    FileSignature, 
    FlaskConical as Flask, 
    ShieldCheck, 
    FileText, 
    Download,
    MessageSquare,
    ClipboardList,
    Layers
} from "lucide-react";

export default function StudyManagementPage() {
    const params = useParams();
    const router = useRouter();
    const studyId = params.id as string;
    const { data: session } = useSession();
    const [study, setStudy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session && studyId) {
            fetch(`/api/proxy/studies/${studyId}`)
                .then(res => res.json())
                .then(data => {
                    setStudy(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Study detail fetch error", err);
                    setLoading(false);
                });
        }
    }, [session, studyId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Use the new generic study update endpoint
            const res = await fetch(`/api/proxy/studies/${studyId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(study)
            });
            if (res.ok) {
                alert("Study updated successfully!");
            } else {
                alert("Failed to update study.");
            }
        } catch (err) {
            alert("Connection error.");
        } finally {
            setIsSaving(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/proxy/studies/${studyId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setStudy({ ...study, status: newStatus });
            }
        } catch (err) {
            console.error("Status update error", err);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-cyan-500" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Protocol Data...</p>
            </div>
        );
    }

    if (!study) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <ShieldAlert className="text-red-500" size={48} />
                <p className="text-white font-bold text-xl uppercase italic">Study Not Found</p>
                <Link href="/admin/studies" className="text-cyan-500 hover:underline">Return to Studies</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center border-b border-white/5 pb-6 gap-6">
                <div className="flex gap-4">
                    <Link href="/admin/studies" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors h-fit">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <select 
                                value={study.status}
                                onChange={(e) => updateStatus(e.target.value)}
                                className={`text-[10px] font-black px-3 py-1 rounded border uppercase tracking-widest outline-none transition-all cursor-pointer ${study.status === 'Active' || study.status === 'Recruiting' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}
                            >
                                {STUDY_STATUSES.map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                            </select>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none bg-white/5 px-2 py-1 rounded border border-white/5">PROV-{study.id.slice(-6).toUpperCase()}</span>
                            {study.manualOverrideActive && (
                                <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                                    <ShieldAlert size={10} /> Manual Override Active
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-white italic tracking-tight">{study.title}</h1>
                        <p className="text-slate-500 font-medium mt-1">{study.condition} · Phase {study.phase || "II"}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[13px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-cyan-600/10 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                    <button className="p-2.5 bg-slate-800 text-slate-400 hover:text-red-400 border border-white/5 rounded-xl transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Target Enrollment", value: study.targetEnrollment || study.targetParticipants || 100, icon: Users, color: "text-cyan-400" },
                    { label: "Actual Enrolled", value: study.actualEnrolled || study.enrollmentCount || 0, icon: Activity, color: "text-emerald-400" },
                    { label: "Finishers Needed", value: study.targetCompleted || 90, icon: Target, color: "text-indigo-400" },
                    { label: "Actual Completed", value: study.actualCompleted || 0, icon: CheckCircle2, color: "text-amber-400" },
                ].map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-white italic">{stat.value}</p>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Content Tabs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Metadata & Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                        <div>
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-6 flex items-center gap-2">
                                <Layout size={14} className="text-cyan-500" /> Protocol Synopsis
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Study Title</label>
                                    <input 
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-white font-bold italic focus:border-cyan-500 outline-none transition-all"
                                        value={study.title}
                                        onChange={(e) => setStudy({...study, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Scientific Description</label>
                                    <textarea 
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-white font-medium focus:border-cyan-500 outline-none transition-all h-32"
                                        value={study.description}
                                        onChange={(e) => setStudy({...study, description: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-6">Execution Parameters</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Design Type</label>
                                    <input 
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-all"
                                        value={study.designType}
                                        onChange={(e) => setStudy({...study, designType: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Location Type</label>
                                    <input 
                                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-all"
                                        value={study.locationType || "Remote"}
                                        onChange={(e) => setStudy({...study, locationType: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lifecycle Automation Automation */}
                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                    <Clock size={14} className="text-amber-500" /> Lifecycle Automation Controls (Spec 2.3)
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Manual Override</span>
                                    <button 
                                        onClick={() => setStudy({...study, manualOverrideActive: !study.manualOverrideActive})}
                                        className={`w-10 h-5 rounded-full transition-all relative ${study.manualOverrideActive ? 'bg-amber-600' : 'bg-slate-800'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${study.manualOverrideActive ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-3xl border border-white/5">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase italic">Auto-Recruitment Stop</p>
                                            <p className="text-[10px] text-slate-500">Stop recruiting once target reached</p>
                                        </div>
                                        <button 
                                            onClick={() => setStudy({...study, autoRecruitmentStop: !study.autoRecruitmentStop})}
                                            className={`w-10 h-5 rounded-full transition-all relative ${study.autoRecruitmentStop ? 'bg-cyan-600' : 'bg-slate-800'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${study.autoRecruitmentStop ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Enrollment Target</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white font-bold focus:border-cyan-500 outline-none transition-all"
                                            value={study.targetEnrollment || 0}
                                            onChange={(e) => setStudy({...study, targetEnrollment: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase italic">Auto-Study Completion</p>
                                            <p className="text-[10px] text-slate-500">Close study once finishers target met</p>
                                        </div>
                                        <button 
                                            onClick={() => setStudy({...study, autoStudyComplete: !study.autoStudyComplete})}
                                            className={`w-10 h-5 rounded-full transition-all relative ${study.autoStudyComplete ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${study.autoStudyComplete ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Finishers Target</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white font-bold focus:border-cyan-500 outline-none transition-all"
                                            value={study.targetCompleted || 0}
                                            onChange={(e) => setStudy({...study, targetCompleted: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sponsor & Agreement Section (Spec 3.2) */}
                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                <Briefcase size={14} className="text-amber-500" /> Sponsor & Agreement Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Proposal Source</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500"
                                            value={study.proposalSource || "online"}
                                            onChange={(e) => setStudy({...study, proposalSource: e.target.value})}
                                        >
                                            <option value="online">Online Portal</option>
                                            <option value="offline">Offline / Manual</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Contract Status</label>
                                        <input 
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500"
                                            placeholder="Pending / Signed / Negotiating"
                                            value={study.contractStatus || ""}
                                            onChange={(e) => setStudy({...study, contractStatus: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Agreement Signed Date</label>
                                        <input 
                                            type="date"
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500"
                                            value={study.agreementSignedDate ? new Date(study.agreementSignedDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => setStudy({...study, agreementSignedDate: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Proposal Submitted Date</label>
                                        <input 
                                            type="date"
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-cyan-500"
                                            value={study.proposalSubmittedDate ? new Date(study.proposalSubmittedDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => setStudy({...study, proposalSubmittedDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Study Operations & Config (Spec 3.5) */}
                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                <Activity size={14} className="text-emerald-500" /> Study Operations Center
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'labUploadsEnabled', label: 'Lab Uploads', icon: Flask, color: 'text-cyan-400' },
                                    { id: 'compensationEnabled', label: 'Compensation', icon: Trash2, color: 'text-emerald-400' },
                                    { id: 'communicationRulesEnabled', label: 'Comm Rules', icon: MessageSquare, color: 'text-indigo-400' },
                                ].map(op => (
                                    <button 
                                        key={op.id}
                                        onClick={() => setStudy({...study, [op.id]: !study[op.id]})}
                                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${study[op.id] ? 'bg-white/5 border-emerald-500/30' : 'bg-slate-950/50 border-white/5 opacity-50'}`}
                                    >
                                        <op.icon size={18} className={study[op.id] ? op.color : 'text-slate-600'} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{op.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Files & Archive (Spec 3.6) */}
                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                    <FileText size={14} className="text-indigo-500" /> Protocol Files & Archive
                                </h3>
                                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">+ Upload New</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { label: 'Master Protocol V1.2', type: 'PDF', date: 'Mar 01, 2026' },
                                    { label: 'IRB Approval Letter', type: 'PDF', date: 'Feb 15, 2026' },
                                    { label: 'Patient Consent V4', type: 'DOCX', date: 'Mar 05, 2026' },
                                    { label: 'Sponsor Agreement', type: 'PDF', date: 'Jan 20, 2026' },
                                ].map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl group hover:border-violet-500/30 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/5 text-slate-500">
                                                <Download size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-white uppercase tracking-tight">{file.label}</p>
                                                <p className="text-[9px] text-slate-600 font-bold uppercase">{file.type} • {file.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Links */}
                <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic mb-2">Protocol Resources</h3>
                        
                        <div className="space-y-3">
                            <Link href={`/admin/participants?study=${study.id}`} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl group hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <Users className="text-cyan-500" size={18} />
                                    <span className="text-[13px] font-bold text-white uppercase italic tracking-tight">Participant Roster</span>
                                </div>
                                <ExternalLink size={14} className="text-slate-600 group-hover:text-cyan-500" />
                            </Link>

                            <Link href={`/admin/data?study=${study.id}`} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="text-indigo-400" size={18} />
                                    <span className="text-[13px] font-bold text-white uppercase italic tracking-tight">Data Explorer</span>
                                </div>
                                <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-400" />
                            </Link>

                            <button className="w-full flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <Settings2 className="text-emerald-400" size={18} />
                                    <span className="text-[13px] font-bold text-white uppercase italic tracking-tight">System Config</span>
                                </div>
                                <ExternalLink size={14} className="text-slate-600 group-hover:text-emerald-400" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-cyan-600/5 border border-cyan-500/10 p-6 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-cyan-400" size={18} />
                            <h4 className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">Enrollment Timeline</h4>
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                            Study targeting completion by <span className="text-white font-bold">{study.completionDate || "Dec 2026"}</span>. 
                            Current enrollment velocity is <span className="text-emerald-400 font-bold">+12%</span> month-on-month.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
