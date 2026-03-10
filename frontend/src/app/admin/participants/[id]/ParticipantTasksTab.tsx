"use client";

import { useState, useEffect } from "react";
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    RefreshCcw,
    Calendar,
    FileText,
    ArrowRight
} from "lucide-react";

interface Task {
    id: string;
    taskId: string;
    title: string;
    description: string;
    type: string;
    status: string;
    availableDate: string;
    dueDate: string;
    completedDate: string | null;
}

export default function ParticipantTasksTab({ participantId }: { participantId: string }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            // Fetching tasks for a specific participant
            const res = await fetch(`/api/proxy/participants/${participantId}/tasks`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (err) {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [participantId]);

    const handleComplete = async (instanceId: string) => {
        if (!confirm("Are you sure you want to mark this task as completed?")) return;

        try {
            const res = await fetch(`/api/proxy/tasks/${instanceId}/complete`, {
                method: "PATCH"
            });
            if (res.ok) {
                setTasks(prev => prev.map(t => t.id === instanceId ? { ...t, status: 'COMPLETED', completedDate: new Date().toISOString() } : t));
            }
        } catch (err) {
            alert("Failed to update task.");
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/proxy/tasks/generate/${participantId}`, {
                method: "POST"
            });
            if (res.ok) {
                fetchTasks();
            }
        } catch (err) {
            alert("Failed to generate tasks.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-slate-500 italic">Syncing task protocol...</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white italic tracking-tight">Study Protocol Tasks</h3>
                    <p className="text-slate-500 text-sm font-medium">Manage and record completion of scheduled study activities.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all"
                >
                    <RefreshCcw size={14} /> Initialize Schedule
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="glass p-12 text-center rounded-3xl border border-white/5 bg-slate-900/40">
                    <Calendar size={48} className="mx-auto text-slate-700 mb-6 opacity-20" />
                    <h4 className="text-white font-black uppercase tracking-widest mb-2 italic">No tasks active</h4>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">This participant hasn&apos;t been assigned a task schedule yet. Click the button above to generate tasks based on the study protocol.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="glass group border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-6 hover:border-cyan-500/30 transition-all bg-slate-900/30">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${task.status === 'COMPLETED'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-slate-800 text-slate-500 border-white/5'
                                    }`}>
                                    {task.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                                </div>
                                <div>
                                    <h4 className={`font-black italic tracking-tight text-[17px] ${task.status === 'COMPLETED' ? 'text-slate-400' : 'text-white'}`}>{task.title}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                                            <Calendar size={10} /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                        {task.completedDate && (
                                            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Completed: {new Date(task.completedDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${task.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'
                                        }`}>
                                        {task.status}
                                    </p>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Protocol V1.2</p>
                                </div>
                                {task.status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => handleComplete(task.id)}
                                        className="h-10 px-5 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2"
                                    >
                                        Complete <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
