import { useState, useEffect } from "react";
import { Users, Mail, Shield, AlertTriangle, Loader2, Plus, Edit, Trash2, CheckCircle2, ChevronDown, Lock } from "lucide-react";
import { AdminAuth } from "@/lib/portal-auth";

export default function TeamManagementTab({ studies, autoInvite = false }: { studies: any[], autoInvite?: boolean }) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showInviteModal, setShowInviteModal] = useState(autoInvite);
    const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "VIEWER", assignedStudies: [] as string[] });

    const [editingMember, setEditingMember] = useState<any | null>(null);

    const getToken = () => AdminAuth.get()?.token ?? "";

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/proxy/sponsor/team", {
                headers: { "Authorization": `Bearer ${getToken()}` },
            });
            if (res.ok) {
                setMembers(await res.json());
            } else {
                setError("Failed to fetch team members");
            }
        } catch (err) {
            setError("Network error fetching team");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("/api/proxy/sponsor/team/invite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(inviteForm),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to invite");
            }
            setSuccess(`Invitation sent to ${inviteForm.email}`);
            setShowInviteModal(false);
            setInviteForm({ name: "", email: "", role: "VIEWER", assignedStudies: [] });
            fetchTeam();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setTimeout(() => setSuccess(""), 4000);
            setTimeout(() => setError(""), 4000);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;
        setActionLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`/api/proxy/sponsor/team/${editingMember.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    role: editingMember.role,
                    assignedStudies: editingMember.assignedStudies
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to update member");
            }
            setSuccess("Team member updated successfully");
            setEditingMember(null);
            fetchTeam();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setTimeout(() => setSuccess(""), 4000);
            setTimeout(() => setError(""), 4000);
        }
    };

    const handleDeactivate = async (id: string) => {
        if (!confirm("Are you sure you want to deactivate this team member?")) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/proxy/sponsor/team/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error("Failed to deactivate member");
            setSuccess("Team member deactivated");
            fetchTeam();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setTimeout(() => setSuccess(""), 4000);
            setTimeout(() => setError(""), 4000);
        }
    };

    const toggleStudyAssignment = (studyId: string, isEditing = false) => {
        if (isEditing && editingMember) {
            const current = editingMember.assignedStudies || [];
            if (current.includes(studyId)) setEditingMember({ ...editingMember, assignedStudies: current.filter((id: string) => id !== studyId) });
            else setEditingMember({ ...editingMember, assignedStudies: [...current, studyId] });
        } else {
            const current = inviteForm.assignedStudies || [];
            if (current.includes(studyId)) setInviteForm({ ...inviteForm, assignedStudies: current.filter(id => id !== studyId) });
            else setInviteForm({ ...inviteForm, assignedStudies: [...current, studyId] });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {success && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={18} /> {success}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold text-sm">
                    <AlertTriangle size={18} /> {error}
                </div>
            )}

            <div className="glass border border-white/5 rounded-3xl overflow-hidden bg-slate-900/40">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Team Management</h2>
                        <p className="text-[12px] text-slate-500 mt-1 font-bold">{members.length} team member{members.length !== 1 ? "s" : ""}</p>
                    </div>
                    <button
                        onClick={() => { setShowInviteModal(true); setEditingMember(null); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[13px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-600/20"
                    >
                        <Plus size={14} /> Invite Member
                    </button>
                </div>

                {/* Team List Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-slate-950/50 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                <th className="p-4 pl-8">Name & Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Assigned Studies</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px] text-slate-300">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <Loader2 size={24} className="animate-spin mx-auto mb-2 opacity-20" />
                                        Fetching team members...
                                    </td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 italic">No team members found. Invite some colleagues!</td>
                                </tr>
                            ) : (
                                members.map(m => (
                                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 pl-8">
                                            <div className="font-bold text-white mb-0.5">{m.name || "Pending user"}</div>
                                            <div className="text-[12px] text-slate-500 flex items-center gap-1.5"><Mail size={12} />{m.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${m.role === 'SPONSOR_ADMIN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                m.role === 'STUDY_MANAGER' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                                    'bg-slate-800 text-slate-400 border-white/10'
                                                }`}>
                                                {m.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {m.role === 'SPONSOR_ADMIN' ? (
                                                <span className="text-amber-500/50 font-bold italic text-[11px]">ALL STUDIES</span>
                                            ) : (
                                                <span className="font-bold text-slate-400 border border-slate-700 bg-slate-800 px-2.5 py-1 rounded-lg">
                                                    {m.assignedStudies?.length || 0} studies
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1.5 font-bold ${m.status === 'ACTIVE' ? 'text-emerald-400' :
                                                m.status === 'PENDING' ? 'text-amber-400' : 'text-red-400'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${m.status === 'ACTIVE' ? 'bg-emerald-400' :
                                                    m.status === 'PENDING' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
                                                    }`} />
                                                {m.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button onClick={() => setEditingMember(m)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Edit">
                                                <Edit size={14} />
                                            </button>
                                            {m.status !== "INACTIVE" && (
                                                <button onClick={() => handleDeactivate(m.id)} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors" title="Deactivate">
                                                    <Lock size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal Overlay */}
            {(showInviteModal || editingMember) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2">
                                <Shield size={20} className="text-cyan-400" />
                                {editingMember ? "Edit Team Member" : "Invite Team Member"}
                            </h3>
                            <button onClick={() => { setShowInviteModal(false); setEditingMember(null); }} className="text-slate-500 hover:text-white">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>

                        <form onSubmit={editingMember ? handleUpdate : handleInvite} className="space-y-6">
                            {!editingMember && (
                                <>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                                        <input required value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. Dr. Jane Doe" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                                        <input required type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="jane.doe@example.com" />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Role</label>
                                <select
                                    value={editingMember ? editingMember.role : inviteForm.role}
                                    onChange={e => {
                                        if (editingMember) setEditingMember({ ...editingMember, role: e.target.value });
                                        else setInviteForm({ ...inviteForm, role: e.target.value });
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none"
                                >
                                    <option value="SPONSOR_ADMIN">Sponsor Admin (Full Access)</option>
                                    <option value="STUDY_MANAGER">Study Manager (Manage assigned studies)</option>
                                    <option value="VIEWER">Viewer (Read-only assigned studies)</option>
                                </select>
                            </div>

                            {((editingMember && editingMember.role !== "SPONSOR_ADMIN") || (!editingMember && inviteForm.role !== "SPONSOR_ADMIN")) && (
                                <div className="border border-white/5 bg-slate-900/50 p-5 rounded-2xl">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Assign Studies</label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                        {studies.map(s => {
                                            const isChecked = editingMember ? editingMember.assignedStudies?.includes(s.id) : inviteForm.assignedStudies?.includes(s.id);
                                            return (
                                                <label key={s.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isChecked ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-950/50 border-white/5 hover:border-white/20'}`}>
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${isChecked ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600'}`}>
                                                        {isChecked && <CheckCircle2 size={12} className="text-white" />}
                                                    </div>
                                                    <div>
                                                        <div className={`text-sm font-bold ${isChecked ? 'text-cyan-400' : 'text-slate-300'}`}>{s.title}</div>
                                                        <div className="text-[11px] text-slate-500">{s.condition || 'General'} • {s.status}</div>
                                                    </div>
                                                    <input type="checkbox" className="hidden" checked={isChecked || false} onChange={() => toggleStudyAssignment(s.id, !!editingMember)} />
                                                </label>
                                            )
                                        })}
                                        {studies.length === 0 && (
                                            <p className="text-[12px] text-slate-500 italic p-2 text-center">No active studies available to assign.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                                <button type="button" onClick={() => { setShowInviteModal(false); setEditingMember(null); }} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition-all disabled:opacity-50">
                                    {actionLoading && <Loader2 size={16} className="animate-spin" />}
                                    {editingMember ? "Save Changes" : "Send Invitation"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
