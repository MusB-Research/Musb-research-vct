"use client";

import { useState } from "react";
import {
    Activity,
    ClipboardCheck,
    Thermometer,
    Droplets,
    Heart,
    Clock,
    Save,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

interface ManualEntryTabProps {
    participantId: string;
}

export default function ManualEntryTab({ participantId }: ManualEntryTabProps) {
    const [selectedType, setSelectedType] = useState("VITALS");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form states
    const [vitals, setVitals] = useState({
        weight: "",
        systolic: "",
        diastolic: "",
        heartRate: "",
        temperature: "",
        spO2: "",
    });

    const [notes, setNotes] = useState("");
    const [loggedAt, setLoggedAt] = useState(new Date().toISOString().slice(0, 16));

    const logTypes = [
        { id: "VITALS", label: "Medical Vitals", icon: Heart },
        { id: "VISIT", label: "Clinic Visit", icon: Clock },
        { id: "LAB", label: "Lab Results", icon: Droplets },
        { id: "SURVEY", label: "Questionnaire", icon: ClipboardCheck },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                type: selectedType,
                data: selectedType === "VITALS" ? vitals : { info: "Manual entry" },
                notes: notes,
                loggedAt: new Date(loggedAt).toISOString()
            };

            const res = await fetch(`/api/proxy/logs/${participantId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save log entry");

            setSuccess(true);
            // Reset form
            if (selectedType === "VITALS") {
                setVitals({ weight: "", systolic: "", diastolic: "", heartRate: "", temperature: "", spO2: "" });
            }
            setNotes("");

            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in-up">
            {/* Sidebar selection */}
            <div className="lg:col-span-1 space-y-2">
                {logTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${selectedType === type.id
                                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                                : "bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-white border border-white/5"
                            }`}
                    >
                        <type.icon size={18} />
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Form Area */}
            <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="glass border border-white/5 rounded-2xl p-8 space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                            <Activity size={18} className="text-cyan-400" />
                            Recording: {logTypes.find(t => t.id === selectedType)?.label}
                        </h3>
                        <div className="flex items-center gap-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Entry Time</label>
                            <input
                                type="datetime-local"
                                value={loggedAt}
                                onChange={(e) => setLoggedAt(e.target.value)}
                                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                    </div>

                    {selectedType === "VITALS" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Weight (kg)</label>
                                <input
                                    type="number" step="0.1"
                                    value={vitals.weight}
                                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                                    placeholder="0.0"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Systolic BP</label>
                                <input
                                    type="number"
                                    value={vitals.systolic}
                                    onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                                    placeholder="120"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Diastolic BP</label>
                                <input
                                    type="number"
                                    value={vitals.diastolic}
                                    onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                                    placeholder="80"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Heart Rate (bpm)</label>
                                <input
                                    type="number"
                                    value={vitals.heartRate}
                                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                                    placeholder="72"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Temp (°C)</label>
                                <input
                                    type="number" step="0.1"
                                    value={vitals.temperature}
                                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                                    placeholder="36.5"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">SpO2 (%)</label>
                                <input
                                    type="number"
                                    value={vitals.spO2}
                                    onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                                    placeholder="98"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {selectedType !== "VITALS" && (
                        <div className="p-12 text-center text-slate-600 bg-slate-950/30 rounded-2xl border border-dashed border-white/10 italic">
                            Section for {logTypes.find(t => t.id === selectedType)?.label} details is under construction.
                            Use the notes field below to record findings.
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Observations / Clinical Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            placeholder="Enter any additional observations from the encounter..."
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-400 font-bold text-sm">
                            <CheckCircle2 size={18} /> Data recorded successfully.
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 font-bold text-sm">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[13px] rounded-xl shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-50"
                        >
                            {loading ? "Recording..." : <><Save size={16} /> Save Record</>}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-[11px] text-slate-600 font-bold uppercase tracking-[0.2em] flex items-center gap-2 bg-slate-900/30 px-4 py-2 rounded-full w-fit mx-auto border border-white/5">
                    <AlertCircle size={12} /> Data recorded via Surrogate Entry will be flagged for secondary review.
                </p>
            </div>
        </div>
    );
}
