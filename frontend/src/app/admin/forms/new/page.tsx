"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    FileText, 
    Plus, 
    Trash2, 
    Settings, 
    ChevronLeft, 
    ChevronRight,
    GripVertical,
    CheckCircle2,
    Eye,
    Save,
    Download,
    Share2,
    Lock,
    Unlock,
    Archive,
    Type,
    CheckSquare,
    CircleDot,
    List,
    Calendar,
    Upload,
    ArrowRight,
    BrainCircuit,
    Info,
    Layout
} from "lucide-react";

// Spec 8.2 Form Types
const FORM_TYPES = [
    "Intake Form",
    "Medical History",
    "Eligibility Questionnaire",
    "Visit Form",
    "Follow-up Questionnaire",
    "Symptom Diary",
    "Home Sample Tracking",
    "Adherence Form",
    "Lab Upload Form",
    "Final Feedback Form"
];

// Spec 8.5 Form States
const FORM_STATES = [
    "Draft",
    "Published",
    "Assigned",
    "Completed",
    "Incomplete",
    "Requires coordinator review",
    "Locked",
    "Archived"
];

type FieldType = "text" | "number" | "radio" | "checkbox" | "select" | "date" | "file";

interface FormField {
    id: string;
    type: FieldType;
    label: string;
    required: boolean;
    options?: string[]; // For radio/select/checkbox
    logic?: {
        dependsOn: string; // ID of the field it depends on
        value: string; // The value that triggers visibility
    };
}

export default function FormBuilderPage() {
    const [formName, setFormName] = useState("Untitled Research Form");
    const [formType, setFormType] = useState("Intake Form");
    const [formState, setFormState] = useState("Draft");
    const [fields, setFields] = useState<FormField[]>([
        { id: "1", type: "text", label: "Full Name", required: true },
        { id: "2", type: "date", label: "Date of Birth", required: true },
    ]);
    const [activeTab, setActiveTab] = useState<"builder" | "logic" | "preview">("builder");
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    const addField = (type: FieldType) => {
        const newField: FormField = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            label: `New ${type.toUpperCase()} Question`,
            required: false,
            options: type === "radio" || type === "select" || type === "checkbox" ? ["Option 1", "Option 2"] : undefined
        };
        setFields([...fields, newField]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
        if (selectedFieldId === id) setSelectedFieldId(null);
    };

    const updateFieldLabel = (id: string, label: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, label } : f));
    };

    const toggleRequired = (id: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, required: !f.required } : f));
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        const newFields = [...fields];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= fields.length) return;
        [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
        setFields(newFields);
    };

    // Example logic from Spec 8.4
    const addMedicalExample = () => {
        const diabetesField: FormField = { id: "dia-1", type: "radio", label: "Do you have diabetes?", required: true, options: ["Yes", "No"] };
        const diagnosisField: FormField = { id: "dia-2", type: "date", label: "When were you diagnosed?", required: false, logic: { dependsOn: "dia-1", value: "Yes" } };
        const medicationField: FormField = { id: "dia-3", type: "text", label: "Which medication are you taking?", required: false, logic: { dependsOn: "dia-1", value: "Yes" } };
        setFields([...fields, diabetesField, diagnosisField, medicationField]);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300">
            {/* Nav Bar */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-[100]">
                <div className="flex items-center gap-6">
                    <Link href="/admin/forms" className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <input 
                            value={formName} 
                            onChange={e => setFormName(e.target.value)}
                            className="bg-transparent text-xl font-black text-white italic tracking-tight uppercase outline-none border-b border-transparent focus:border-cyan-500 transition-all placeholder:opacity-50"
                        />
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">{formType}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            <span className={`text-[10px] font-black uppercase tracking-widest italic ${formState === 'Published' ? 'text-emerald-500' : 'text-amber-500'}`}>{formState}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-xl transition-all flex items-center gap-2">
                        <Download size={14} /> PDF Export
                    </button>
                    <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <Save size={14} /> Save Template
                    </button>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* Left Sidebar: Components (Spec 8.3) */}
                <div className="w-72 bg-[#0a0f1e]/50 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">FORM ARCHITECTURE</h3>
                    
                    <div className="space-y-6">
                        <section>
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Field Elements</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { type: "text", icon: Type, label: "Short Answer" },
                                    { type: "number", icon: List, label: "Numerical Data" },
                                    { type: "date", icon: Calendar, label: "Date / Time" },
                                    { type: "radio", icon: CircleDot, label: "Single Choice" },
                                    { type: "checkbox", icon: CheckSquare, label: "Multi Choice" },
                                    { type: "select", icon: List, label: "Dropdown List" },
                                    { type: "file", icon: Upload, label: "File Upload" },
                                ].map(item => (
                                    <button 
                                        key={item.label}
                                        onClick={() => addField(item.type as FieldType)}
                                        className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 hover:bg-slate-800 border border-white/5 rounded-2xl transition-all group"
                                    >
                                        <item.icon size={16} className="text-slate-500 group-hover:text-cyan-400" />
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Protocol Snippets</h4>
                            <button 
                                onClick={addMedicalExample}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl transition-all group"
                            >
                                <BrainCircuit size={16} className="text-indigo-400" />
                                <span className="text-xs font-bold text-indigo-300">Med-History Block</span>
                            </button>
                        </section>
                    </div>
                </div>

                {/* Main Canvas (Spec 8.3 Builder) */}
                <div className="flex-1 bg-[#020617] overflow-y-auto p-12 custom-scrollbar flex justify-center">
                    <div className="w-full max-w-3xl space-y-8">
                        {/* Tabs */}
                        <div className="flex justify-center mb-12">
                            <div className="flex bg-slate-900/80 p-1.5 rounded-[1.5rem] border border-white/5">
                                {[
                                    { id: "builder", label: "Builder", icon: Layout },
                                    { id: "logic", label: "Logic Engine", icon: BrainCircuit },
                                    { id: "preview", label: "Preview", icon: Eye }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <tab.icon size={14} /> {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === "builder" && (
                            <div className="space-y-4 pb-40">
                                {/* MusB Auto Logo (Spec 8.3) */}
                                <div className="text-center mb-12 opacity-30 pointer-events-none">
                                    <div className="text-lg font-black text-white italic tracking-tighter uppercase mb-1">MUSB RESEARCH</div>
                                    <div className="text-[10px] font-black tracking-[0.4em] uppercase">Clinical Protocol System</div>
                                </div>

                                {fields.length === 0 ? (
                                    <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                                        <Plus className="mx-auto text-slate-800 mb-4" size={48} />
                                        <p className="text-slate-600 font-black uppercase tracking-widest italic">Drag elements here to build your protocol</p>
                                    </div>
                                ) : (
                                    fields.map((field, idx) => (
                                        <div 
                                            key={field.id}
                                            onClick={() => setSelectedFieldId(field.id)}
                                            className={`group relative bg-slate-900/40 p-8 rounded-[2rem] border transition-all cursor-pointer ${selectedFieldId === field.id ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10' : 'border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-500/30 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {field.logic && (
                                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-indigo-500/90 text-white px-3 py-1.5 rounded-full z-10 shadow-lg animate-in slide-in-from-left-4">
                                                    <BrainCircuit size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Conditional Branch</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <GripVertical className="text-slate-700 cursor-grab" size={18} />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest italic mb-1">{field.type} Field</span>
                                                        <input 
                                                            value={field.label}
                                                            onChange={e => updateFieldLabel(field.id, e.target.value)}
                                                            className="bg-transparent text-lg font-black text-white italic tracking-tight uppercase outline-none w-full border-b border-white/5 focus:border-cyan-500 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => moveField(idx, 'up')} className="p-2 hover:bg-white/5 text-slate-500 hover:text-white transition-colors"><ChevronLeft size={16} className="rotate-90" /></button>
                                                    <button onClick={() => moveField(idx, 'down')} className="p-2 hover:bg-white/5 text-slate-500 hover:text-white transition-colors"><ChevronLeft size={16} className="-rotate-90" /></button>
                                                    <button onClick={() => removeField(field.id)} className="p-2 hover:bg-red-900/20 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </div>

                                            <div className="pl-10">
                                                {field.type === "text" && <div className="h-12 border border-white/5 rounded-xl bg-slate-950/50 animate-pulse" />}
                                                {field.type === "date" && <div className="h-12 border border-white/5 rounded-xl bg-slate-950/50 flex items-center px-4"><Calendar size={14} className="text-slate-700" /></div>}
                                                {(field.type === "radio" || field.type === "checkbox") && (
                                                    <div className="space-y-3">
                                                        {field.options?.map((opt, i) => (
                                                            <div key={i} className="flex items-center gap-3">
                                                                <div className={`w-4 h-4 rounded-${field.type === 'radio' ? 'full' : 'md'} border border-slate-700`} />
                                                                <span className="text-sm font-bold text-slate-400">{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "logic" && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/20">
                                    <h3 className="text-white font-black italic uppercase tracking-widest text-[13px] mb-4 flex items-center gap-2">
                                        <BrainCircuit className="text-indigo-400" size={16} /> Logic Configuration (Spec 8.4)
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium italic mb-8">Define how questions branch based on participant responses. Ideal for clinical diagnostics.</p>
                                    
                                    <div className="space-y-6">
                                        {fields.filter(f => f.logic).map(field => (
                                            <div key={field.id} className="p-6 bg-[#0a0f1e] rounded-3xl border border-white/5 flex items-center gap-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">IF</div>
                                                    <div className="w-[2px] h-8 bg-indigo-900" />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black uppercase text-slate-500 italic">When Question</span>
                                                        <span className="text-xs font-bold text-indigo-400 uppercase italic">"{fields.find(f => f.id === field.logic?.dependsOn)?.label}"</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black uppercase text-slate-500 italic">Equals Value</span>
                                                        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-bold text-white uppercase italic tracking-widest">"{field.logic?.value}"</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 pt-2">
                                                        <ArrowRight size={14} className="text-emerald-500" />
                                                        <span className="text-xs font-bold text-white uppercase italic">Show: "{field.label}"</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Settings & States (Spec 8.5 & 8.6) */}
                <div className="w-80 bg-[#0a0f1e]/50 border-l border-white/5 p-8 overflow-y-auto custom-scrollbar">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-8 italic">TEMPLATE SETTINGS</h3>
                    
                    <div className="space-y-10">
                        <section>
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 block">Deployment State</label>
                            <div className="grid grid-cols-1 gap-2">
                                {FORM_STATES.map(state => (
                                    <button 
                                        key={state}
                                        onClick={() => setFormState(state)}
                                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all text-left flex items-center justify-between ${formState === state ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-900/50 text-slate-500 hover:text-white border-white/5'}`}
                                    >
                                        {state}
                                        {formState === state && <CheckCircle2 size={12} />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="p-6 bg-slate-900/40 rounded-3xl border border-white/5">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 italic">Security & Restrictions</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Lock Responses</span>
                                    <Lock size={14} className="text-slate-600 hover:text-amber-500 cursor-pointer" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Enable PDF DL</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-full" />
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">Version History</span>
                                    <span className="text-[10px] font-black text-indigo-400">v1.2.4</span>
                                </div>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-white/5">
                            <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 mb-3">
                                <Eye size={16} /> Live Test
                            </button>
                            <button className="w-full py-4 bg-slate-950 hover:bg-red-900/20 text-red-400/60 hover:text-red-400 border border-red-500/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                                Archive Form
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
