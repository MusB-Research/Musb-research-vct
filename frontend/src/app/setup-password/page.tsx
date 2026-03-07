"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Key, HeartPulse, Loader2, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function SetupPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div className="text-center">
                <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
                <h2 className="text-xl font-black text-white mb-2">Invalid Invitation Link</h2>
                <p className="text-slate-400 text-sm mb-6">This setup link is missing or malformed. Please check the email you received.</p>
                <Link href="/" className="text-cyan-400 font-bold hover:underline">Return to Home</Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-black text-white italic tracking-tight mb-2">Account Activated</h2>
                <p className="text-slate-400 text-[13px] mb-8">Your account has been successfully set up. You can now access your sponsor portal.</p>
                <Link
                    href="/sponsor/login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-[13px] rounded-xl transition-all shadow-lg shadow-cyan-600/20"
                >
                    Proceed to Login <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            return setError("Password must be at least 8 characters long.");
        }
        if (password !== confirm) {
            return setError("Passwords do not match.");
        }

        setLoading(true);
        try {
            const res = await fetch("/api/proxy/sponsor/team/setup-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to setup password");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in block">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 relative group">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-50 transition-opacity" />
                    <Key size={28} className="text-cyan-400 relative z-10" />
                </div>
                <h2 className="text-2xl font-black text-white italic tracking-tight">Set Your Password</h2>
                <p className="text-slate-400 text-[13px] mt-2 leading-relaxed">
                    Create a secure password to activate your sponsor team account.
                </p>
            </div>

            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-in fade-in">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p className="text-[13px] font-bold leading-tight">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                        New Password
                    </label>
                    <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-[13px] text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all font-bold tracking-wide"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="password"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-[13px] text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all font-bold tracking-wide"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full group relative flex items-center justify-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-[13px] font-black uppercase tracking-widest transition-all overflow-hidden"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Activate Account"}
            </button>
        </form>
    );
}

export default function SetupPasswordPage() {
    return (
        <div className="min-h-screen flex text-slate-300 relative bg-[#0B1120] overflow-hidden selection:bg-cyan-500/30 selection:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-900/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="relative w-full flex flex-col justify-center items-center p-6 z-10">
                {/* Logo */}
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all">
                        <HeartPulse size={20} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-white uppercase tracking-tight italic leading-none">MUSB</h1>
                        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-0.5">Research</p>
                    </div>
                </Link>

                {/* Form Card */}
                <div className="w-full max-w-[440px] relative">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500/20 to-transparent blur-md rounded-[32px] opacity-0 animate-in fade-in duration-1000 delay-300" />

                    <div className="glass p-8 sm:p-12 rounded-[28px] border border-white/10 relative bg-[#0f172a]/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                        <Suspense fallback={<div className="p-12 text-center text-slate-500"><Loader2 size={32} className="animate-spin mx-auto opacity-20" /></div>}>
                            <SetupPasswordForm />
                        </Suspense>
                    </div>

                    <p className="text-center mt-8 text-[11px] font-bold uppercase tracking-widest text-slate-600 leading-relaxed">
                        Secure Authentication Protocol <br />
                        MUSB Research Platform © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}
