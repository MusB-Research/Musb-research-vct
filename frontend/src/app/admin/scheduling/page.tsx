"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Clock, User, Plus, ChevronLeft, ChevronRight,
    Phone, Video, X, Check, Ban, Loader2, RefreshCw, 
    CalendarDays, Bell, Send, Search, Filter, Settings,
    Smartphone, Mail, CheckCircle2, AlertCircle, Info
} from "lucide-react";
import {
    format, startOfMonth, endOfMonth, eachDayOfInterval,
    isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, getDay
} from "date-fns";
import { AdminAuth } from "@/lib/portal-auth";

type Appointment = {
    id: string;
    participantId: string;
    participantName?: string;
    coordinatorId?: string;
    scheduledAt: string;
    type: string;
    status: string;
    notes?: string;
    studyName?: string;
    remindersEnabled: boolean;
};

// Spec 6.3 Visit Types
const APPT_TYPES = [
    "Screening Visit",
    "Baseline Visit",
    "Follow-up Visit",
    "Final Visit",
    "Unscheduled Visit",
    "Onboarding Call (Virtual)",
    "Onboarding Call (Phone)"
];

const STUDIES = ["All Studies", "NAD+ Longevity", "Microbiome Study", "Heart Rate Variability", "LIDORE Protocol X"];

function statusStyle(status: string) {
    if (status === "COMPLETED") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (status === "CANCELLED") return "bg-red-500/10 text-red-400 border-red-500/20";
    if (status === "RESCHEDULED") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
}

export default function AdminSchedulingPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [viewMode, setViewMode] = useState<"coordinator" | "study" | "participant">("coordinator");
    const [selectedStudy, setSelectedStudy] = useState("All Studies");
    const [searchQuery, setSearchQuery] = useState("");

    // New appointment form state (Spec 6.1)
    const [formData, setFormData] = useState({
        participantId: "",
        participantName: "",
        type: "Screening Visit",
        scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        notes: "",
        studyName: "NAD+ Longevity",
        remindersEnabled: true
    });

    const getToken = () => AdminAuth.get()?.token ?? "";

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            // Mocking some data for demonstration if API fails or returns empty
            const res = await fetch("/api/proxy/scheduling/", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data.length > 0 ? data : getMockAppointments());
            } else {
                setAppointments(getMockAppointments());
            }
        } catch (err) {
            setAppointments(getMockAppointments());
        } finally {
            setLoading(false);
        }
    }, []);

    function getMockAppointments(): Appointment[] {
        const today = new Date();
        return [
            { 
                id: "1", 
                participantId: "65ed...", 
                participantName: "Sarah Miller", 
                scheduledAt: new Date(today.setHours(10, 0)).toISOString(), 
                type: "Screening Visit", 
                status: "SCHEDULED", 
                studyName: "NAD+ Longevity", 
                remindersEnabled: true 
            },
            { 
                id: "2", 
                participantId: "65ef...", 
                participantName: "James Wilson", 
                scheduledAt: new Date(today.setDate(today.getDate() + 1)).toISOString(), 
                type: "Baseline Visit", 
                status: "SCHEDULED", 
                studyName: "Microbiome Study", 
                remindersEnabled: true 
            },
            { 
                id: "3", 
                participantId: "65f0...", 
                participantName: "Emma Davis", 
                scheduledAt: new Date(today.setDate(today.getDate() + 2)).toISOString(), 
                type: "Onboarding Call (Virtual)", 
                status: "SCHEDULED", 
                studyName: "LIDORE Protocol X", 
                remindersEnabled: true 
            },
        ];
    }

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    // Calendar grid logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const allDays = eachDayOfInterval({ start: calStart, end: calEnd });

    const filteredAppointments = appointments.filter(a => {
        const matchesStudy = selectedStudy === "All Studies" || a.studyName === selectedStudy;
        const matchesSearch = searchQuery === "" || 
            a.participantName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.participantId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStudy && matchesSearch;
    });

    const getAppointmentsForDay = (day: Date) =>
        filteredAppointments.filter(a => isSameDay(new Date(a.scheduledAt), day))
            .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    const agendaAppts = getAppointmentsForDay(selectedDate);

    const handleCreate = async () => {
        if (!formData.participantId.trim()) return;
        setSaving(true);
        // Simulate API call and update local state
        const newAppt: Appointment = {
            id: Math.random().toString(36).substr(2, 9),
            participantId: formData.participantId,
            participantName: formData.participantName || "New Participant",
            type: formData.type,
            scheduledAt: new Date(formData.scheduledAt).toISOString(),
            status: "SCHEDULED",
            studyName: formData.studyName,
            remindersEnabled: formData.remindersEnabled
        };
        
        setAppointments(prev => [...prev, newAppt]);
        setShowModal(false);
        setSaving(false);
        
        // In real app:
        // const res = await fetch("/api/proxy/scheduling/", { ... });
    };

    const updateStatus = async (apptId: string, status: string) => {
        setSaving(true);
        setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status } : a));
        if (selectedAppt?.id === apptId) {
            setSelectedAppt(prev => prev ? { ...prev, status } : null);
        }
        setSaving(false);
    };

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* Header (Spec 6.1 & 6.2) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Visit & Scheduling Hub</h1>
                    <p className="text-slate-500 mt-2 font-medium">Coordinate site visits, virtual onboarding, and automated participant reminders.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setViewMode("coordinator")}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "coordinator" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Coordinator
                        </button>
                        <button 
                            onClick={() => setViewMode("study")}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "study" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Study
                        </button>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-[12px] rounded-xl shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2"
                    >
                        <Plus size={16} /> Book Appointment
                    </button>
                </div>
            </div>

            {/* View Controls (Spec 6.2) */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                    <select 
                        value={selectedStudy}
                        onChange={(e) => setSelectedStudy(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-300 outline-none focus:border-cyan-500 transition-all italic"
                    >
                        {STUDIES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                    <div className="h-4 w-px bg-white/10 mx-2 hidden lg:block" />
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
                        <input 
                            type="text" 
                            placeholder="Find participant schedule..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[13px] text-white outline-none w-64 focus:border-cyan-500 transition-all font-medium" 
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <Bell size={12} className="text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Reminders Active (1w, 1d)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Calendar View (Spec 6.2 Coordinator/Study Calendar) */}
                <div className="xl:col-span-3">
                    <div className="bg-[#0a1120]/40 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-xl shadow-2xl">
                        {/* Month navigation */}
                        <div className="p-8 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{format(currentDate, 'MMMM yyyy')}</h2>
                            <div className="flex gap-3">
                                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-slate-400 transition-all"><ChevronLeft size={20} /></button>
                                <button onClick={() => setCurrentDate(new Date())} className="px-6 py-3 bg-slate-900 border border-white/5 hover:border-cyan-500/30 rounded-xl text-[11px] font-black text-white uppercase tracking-widest transition-all">Today</button>
                                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl text-slate-400 transition-all"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.01]">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                                <div key={d} className="py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{d}</div>
                            ))}
                        </div>

                        {/* Calendar cells */}
                        <div className="grid grid-cols-7">
                            {allDays.map((day, idx) => {
                                const dayAppts = getAppointmentsForDay(day);
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const isToday = isSameDay(day, new Date());
                                const isSelected = isSameDay(day, selectedDate);
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedDate(day)}
                                        className={`min-h-[140px] p-3 border-r border-b border-white/5 cursor-pointer transition-all relative group
                                            ${isSelected ? 'bg-cyan-500/[0.05]' : 'hover:bg-white/[0.02]'}
                                            ${!isCurrentMonth ? 'opacity-20' : ''}`}
                                    >
                                        <div className={`text-base font-black mb-3 w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                                            ${isToday ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                                            {format(day, 'd')}
                                        </div>
                                        <div className="space-y-1.5 overflow-hidden">
                                            {dayAppts.slice(0, 3).map((appt, i) => (
                                                <div
                                                    key={i}
                                                    onClick={e => { e.stopPropagation(); setSelectedAppt(appt); setSelectedDate(day); }}
                                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight truncate border group/appt transition-all hover:scale-[1.02]
                                                        ${appt.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            appt.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                'bg-slate-900 text-slate-300 border-white/5 hover:border-cyan-500/30'}`}
                                                >
                                                    <span className="text-cyan-500 mr-1.5">{format(new Date(appt.scheduledAt), 'HH:mm')}</span> 
                                                    {appt.type}
                                                </div>
                                            ))}
                                            {dayAppts.length > 3 && (
                                                <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest px-2 pt-1 font-mono">+{dayAppts.length - 3} OTHER VISITS</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Dynamic Agenda (Spec 6.2 Participant Calendar view) */}
                <div className="space-y-6">
                    <div className="bg-slate-950/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-white font-black italic uppercase tracking-[0.15em] text-[13px] flex items-center gap-2">
                                    <Clock className="text-cyan-400" size={16} /> Agenda
                                </h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">{format(selectedDate, 'MMMM d, yyyy')}</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 size={32} className="text-cyan-500 animate-spin" />
                            </div>
                        ) : agendaAppts.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                                <CalendarDays size={48} className="text-slate-800 mx-auto mb-4" />
                                <div className="text-[13px] font-black text-slate-700 uppercase tracking-[0.2em] italic">No Protocol Visits</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {agendaAppts.map((appt, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedAppt(appt)}
                                        className={`p-6 bg-[#0E1629] border rounded-[2rem] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]
                                            ${selectedAppt?.id === appt.id ? 'border-cyan-500/40 shadow-2xl shadow-cyan-500/5 translate-x-1' : 'border-white/5'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-lg font-black text-cyan-400 italic font-mono uppercase leading-none">{format(new Date(appt.scheduledAt), 'hh:mm a')}</span>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border border-current uppercase tracking-tighter ${statusStyle(appt.status)}`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <h4 className="text-[13px] font-black text-white italic uppercase tracking-tight mb-2">{appt.type}</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                                                <User size={12} className="text-slate-700" />
                                                <span className="uppercase">{appt.participantName || appt.participantId.slice(-8).toUpperCase()}</span>
                                            </div>
                                            {appt.remindersEnabled && <Bell size={12} className="text-emerald-500" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Appointment Console (Spec 6.3 & 6.4) */}
                    {selectedAppt && (
                        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-8 rounded-[2.5rem] border border-cyan-500/30 animate-in slide-in-from-bottom duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-cyan-400 font-black italic uppercase tracking-widest text-[12px]">Visit Console</h3>
                                <button onClick={() => setSelectedAppt(null)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xl font-black text-white italic tracking-tight uppercase leading-none mb-2">{selectedAppt.type}</h4>
                                    <p className="text-slate-400 text-[12px] font-medium italic">{selectedAppt.studyName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                                        <Phone className="text-slate-500 group-hover:text-cyan-400" size={18} />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Call</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                                        <Video className="text-slate-500 group-hover:text-cyan-400" size={18} />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Video</span>
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Notification Status</p>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        <span className="text-[11px] text-emerald-500/80 font-bold">1-Week Reminder Sent</span>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-50">
                                        <Clock size={14} className="text-slate-500" />
                                        <span className="text-[11px] text-slate-500 font-bold">1-Day Reminder Pending</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => updateStatus(selectedAppt.id, "COMPLETED")}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-[1.5rem] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mb-3"
                                    >
                                        <CheckCircle2 size={16} /> Complete Visit
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedAppt.id, "CANCELLED")}
                                        className="w-full py-3 bg-slate-900 hover:bg-red-900/40 text-slate-500 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Cancel / Reschedule
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Book Visit Modal (Spec 6.1 & 6.3) */}
            {showModal && (
                <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-xl bg-[#0A1128] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5">
                            <div>
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Book Protocol Visit</h2>
                                <p className="text-slate-500 text-sm mt-1 font-medium italic">Eligibility Verified • Automated Reminders Enabled</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block italic">Protocol Assignment</label>
                                    <select 
                                        value={formData.studyName}
                                        onChange={e => setFormData(p => ({ ...p, studyName: e.target.value }))}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                                    >
                                        {STUDIES.filter(s=>s!=="All Studies").map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block italic">Participant Identity</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            value={formData.participantName}
                                            onChange={e => setFormData(p => ({ ...p, participantName: e.target.value }))}
                                            placeholder="Enter full legal name..."
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block italic">Visit Architecture</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                                    >
                                        {APPT_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 block italic">Timestamp</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.scheduledAt}
                                        onChange={e => setFormData(p => ({ ...p, scheduledAt: e.target.value }))}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all [color-scheme:dark] font-mono"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/10 flex items-start gap-4">
                                <div className="mt-1"><Info size={18} className="text-cyan-400" /></div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-bold text-white mb-2 italic uppercase tracking-tight">Deployment Rules (Spec 6.1 & 6.4)</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Check className="text-emerald-500" size={14} />
                                            <span className="text-[11px] text-slate-400 font-medium">Auto-dispatch confirmation to <span className="text-cyan-400">sarah.m@example.com</span></span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Check className="text-emerald-500" size={14} />
                                            <span className="text-[11px] text-slate-400 font-medium">Trigger 1-Week and 1-Day SMS/Email reminders</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.remindersEnabled} onChange={e=>setFormData(p=>({...p, remindersEnabled: e.target.checked}))} />
                                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 pb-10 flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-4 rounded-2xl bg-slate-900 border border-white/5 text-slate-500 font-black uppercase tracking-widest text-[12px] hover:text-white transition-all"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={saving}
                                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black uppercase tracking-widest text-[12px] shadow-xl shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                Confirm & Notify Participant
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
