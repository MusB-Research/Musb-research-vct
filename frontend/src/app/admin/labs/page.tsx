"use client";

import { useState } from "react";
import { 
    FlaskConical, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Clock, 
    FileText,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Eye,
    Upload,
    QrCode,
    ChevronRight,
    Lock,
    Unlock,
    X,
    FileUp,
    ShieldCheck,
    Database,
    Loader2
} from "lucide-react";

interface LabResult {
    id: string;
    patient: string;
    patientId: string;
    test: string;
    date: string;
    site: string;
    status: "Verified" | "Abnormal" | "Awaiting Review";
    flag: "Normal" | "High" | "Low";
    released: boolean;
    fileUrl?: string;
    category: "BLOOD" | "URINE" | "OTHER";
}

const INITIAL_RESULTS: LabResult[] = [
    { id: "L-9001", patient: "Sarah Miller", patientId: "P-4502", test: "Complete Blood Count", date: "2026-03-09", site: "Quest Diagnostics", status: "Verified", flag: "Normal", released: true, category: "BLOOD" },
    { id: "L-9002", patient: "James Wilson", patientId: "P-7721", test: "NAD+ Level (Serum)", date: "2026-03-08", site: "MusB Internal Lab", status: "Abnormal", flag: "High", released: false, category: "BLOOD" },
    { id: "L-9003", patient: "David Brown", patientId: "P-1120", test: "Lipid Panel", date: "2026-03-08", site: "Labcorp", status: "Awaiting Review", flag: "Normal", released: false, category: "BLOOD" },
    { id: "L-9004", patient: "Emma Davis", patientId: "P-8832", test: "Urinalysis Micro", date: "2026-03-07", site: "Quest Diagnostics", status: "Verified", flag: "Normal", released: true, category: "URINE" },
    { id: "L-9005", patient: "Michael Roark", patientId: "P-5541", test: "C-Reactive Protein", date: "2026-03-06", site: "MusB Internal Lab", status: "Abnormal", flag: "High", released: true, category: "BLOOD" },
];

export default function LabsResults() {
    const [results, setResults] = useState<LabResult[]>(INITIAL_RESULTS);
    const [activeView, setActiveView] = useState("Verified Reports");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [uploadForm, setUploadForm] = useState({
        patientId: "",
        testName: "",
        category: "BLOOD",
        testDate: new Date().toISOString().split('T')[0],
        site: "MusB Internal Lab"
    });

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate secure upload and OCR processing
        setTimeout(() => {
            const newResult: LabResult = {
                id: `L-${Math.floor(Math.random() * 9000) + 1000}`,
                patient: uploadForm.patientId, // In real app, resolved from ID
                patientId: uploadForm.patientId,
                test: uploadForm.testName,
                date: uploadForm.testDate,
                site: uploadForm.site,
                status: "Awaiting Review",
                flag: "Normal",
                released: false,
                category: uploadForm.category as any
            };
            setResults([newResult, ...results]);
            setIsUploading(false);
            setShowUploadModal(false);
            setUploadForm({ patientId: "", testName: "", category: "BLOOD", testDate: new Date().toISOString().split('T')[0], site: "MusB Internal Lab" });
        }, 1500);
    };

    const toggleRelease = (id: string) => {
        setResults(prev => prev.map(r => r.id === id ? { ...r, released: !r.released } : r));
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header (Spec 12.1) */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase flex items-center gap-3">
                        <FlaskConical className="text-emerald-500" size={32} /> Labs &amp; Clinical Results
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Secure clinical results intake, verification &amp; PII-controlled release (Spec 12).</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-white/5 border border-white/10 hover:border-emerald-500/30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <FileUp size={16} className="text-emerald-500" /> Upload Lab PDF
                    </button>
                    <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <CheckCircle2 size={16} /> Bulk Verification
                    </button>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
                {["Verified Reports", "Pending Results", "Samples Pool", "Audit Trail"].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveView(tab)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === tab ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Results Registry (Spec 12.2 Integration) */}
            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sponsor View Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Database size={14} className="text-cyan-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PII Anonymized</span>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input placeholder="Search Lab ID or Subject..." className="bg-slate-950/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[11px] text-white w-64 focus:border-cyan-500/50 outline-none uppercase font-bold tracking-widest" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[#0a1120]/60 border-b border-white/5">
                            <tr className="text-[11px] uppercase tracking-widest text-slate-500 font-black italic">
                                <th className="py-5 px-8 italic">Clinical Panel / ID</th>
                                <th className="py-5 px-8 italic text-cyan-400">Subject (PII)</th>
                                <th className="py-5 px-8 italic">Site / Lab</th>
                                <th className="py-5 px-8 italic">Clinical State</th>
                                <th className="py-5 px-8 italic">Portal Release (12.2)</th>
                                <th className="py-5 px-8 text-right italic">Audit Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300">
                            {results.map((lab) => (
                                <tr key={lab.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-6 px-8">
                                        <div className="flex flex-col">
                                            <span className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{lab.test}</span>
                                            <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Ref: {lab.id} · {lab.category}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-200 uppercase italic">{lab.patient}</span>
                                            <span className="text-[10px] text-cyan-500/70 font-black tracking-widest uppercase">{lab.patientId}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <p className="font-bold text-slate-500 uppercase tracking-tight text-[11px]">{lab.site}</p>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase italic mt-0.5">{lab.date}</p>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                                                lab.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                lab.status === 'Abnormal' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                                {lab.status}
                                            </span>
                                            {lab.flag !== 'Normal' && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <button 
                                            onClick={() => toggleRelease(lab.id)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${lab.released ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]' : 'bg-slate-900 text-slate-600 border-white/5 hover:text-slate-400'}`}>
                                            {lab.released ? <Unlock size={12} /> : <Lock size={12} />}
                                            {lab.released ? 'Live in Portal' : 'Private (CC Only)'}
                                        </button>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-500">
                                            <button title="View Secured PDF" className="p-2.5 bg-slate-900 border border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 rounded-xl transition-all"><FileText size={16} /></button>
                                            <button className="p-2.5 bg-slate-900 border border-white/5 hover:bg-white/5 text-slate-700 rounded-xl transition-all"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Spec 12.1 Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="glass w-full max-w-xl p-10 rounded-[3rem] border border-white/10 bg-slate-900 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowUploadModal(false)} className="absolute right-8 top-8 text-slate-600 hover:text-white transition-colors"><X size={24} /></button>
                        
                        <h2 className="text-2xl font-black text-white italic tracking-tight uppercase mb-8 flex items-center gap-3">
                            <Upload className="text-cyan-500" size={24} /> Clinical Document Intake
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Subject Identification (PID)</label>
                                <input 
                                    placeholder="Enter PID (e.g. P-4502)" 
                                    value={uploadForm.patientId}
                                    onChange={e => setUploadForm(p => ({ ...p, patientId: e.target.value }))}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all uppercase font-mono" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Panel Type</label>
                                <select 
                                    value={uploadForm.category}
                                    onChange={e => setUploadForm(p => ({ ...p, category: e.target.value as any }))}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all"
                                >
                                    <option value="BLOOD">Blood / Serum</option>
                                    <option value="URINE">Urinalysis</option>
                                    <option value="OTHER">Other Clinical Doc</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Collection Date</label>
                                <input 
                                    type="date" 
                                    value={uploadForm.testDate}
                                    onChange={e => setUploadForm(p => ({ ...p, testDate: e.target.value }))}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all [color-scheme:dark]" 
                                />
                            </div>
                            <div className="col-span-2 p-10 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-950/50 flex flex-col items-center justify-center text-center group hover:border-cyan-500/30 transition-all cursor-pointer">
                                <FileUp size={40} className="text-slate-700 group-hover:text-cyan-500 transition-colors mb-4" />
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic group-hover:text-slate-300">Drop Clinical PDF or Scan Report</p>
                                <p className="text-[10px] text-slate-700 font-bold uppercase mt-1 tracking-tighter italic">Secured S3 Upload · 256-bit AES Encryption</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowUploadModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">Cancel</button>
                            <button 
                                onClick={handleUpload}
                                disabled={isUploading || !uploadForm.patientId}
                                className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {isUploading ? "Encrypting & Storage..." : "Verify & Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Compliance Footer (Spec 12.2 Logic Visibility) */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/[0.05] to-emerald-500/[0.05] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 size={32} />
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">Clinical Data Integrity (Spec 12.2)</h3>
                        <p className="text-slate-500 font-medium max-w-2xl text-sm leading-relaxed italic">
                            Sponsor visibility is strictly limited to **Subject ID + Numeric Data**. No PII (Names, Contact Info, Full PDFs) is accessible to sponsor accounts. Release controls allow participants to view their own results only after Clinical Coordinator verification.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-[11px] font-black text-white uppercase tracking-widest rounded-xl transition-all border border-white/5">Configure Visibility Policy</button>
                </div>
            </div>
        </div>
    );
}
