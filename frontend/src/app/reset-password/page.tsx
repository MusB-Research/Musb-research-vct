"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import PasswordStrength from "@/components/PasswordStrength";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [status, setStatus] = useState<"VERIFYING" | "VALID" | "EXPIRED" | "SUCCESS">("VERIFYING");
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    useEffect(() => {
        if (!token) {
            setStatus("EXPIRED");
            setVerifying(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch("/api/proxy/auth/verify-reset-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserEmail(data.email);
                    setStatus("VALID");
                } else {
                    setStatus("EXPIRED");
                }
            } catch (err) {
                setError("Connection problem. Try again.");
                setStatus("EXPIRED");
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token, apiUrl]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 10) {
            setError("Password must be at least 10 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/proxy/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            if (res.ok) {
                setStatus("SUCCESS");
            } else {
                const d = await res.json();
                setError(d.detail || "Failed to reset password. Link might be used or expired.");
            }
        } catch (err) {
            setError("Connection failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto" />
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] animate-pulse">Establishing Secure Socket...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent relative isolate overflow-hidden flex items-center justify-center py-20 px-6">
            <div className="w-full max-w-md">
                <div className="glass rounded-[2.5rem] border border-white/10 p-8 md:p-12 relative overflow-hidden shadow-2xl bg-slate-900/40 backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <div className="flex flex-col items-center mb-8">
                                <a href="https://www.musbhealth.com/" className="inline-flex items-center justify-center bg-white px-6 py-4 rounded-2xl shadow-xl shadow-black/40 hover:opacity-90 transition-opacity">
                                    <img src="/musb research.png" alt="MUSB Research" className="h-10 w-auto object-contain" />
                                </a>
                            </div>

                            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase">
                                {status === "VALID" && "Secure Reset"}
                                {status === "EXPIRED" && "Link Invalid"}
                                {status === "SUCCESS" && "Success"}
                            </h1>
                            <p className="text-slate-400 text-[13px] font-bold uppercase tracking-[0.15em] max-w-[280px] mx-auto leading-relaxed">
                                {status === "VALID" && `Reset password for ${userEmail.split('@')[0].slice(0, 3)}***@${userEmail.split('@')[1]}`}
                                {status === "EXPIRED" && "This reset link is invalid or has expired"}
                                {status === "SUCCESS" && "Your password has been updated securely"}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <span className="text-sm text-red-200 font-medium">{error}</span>
                            </div>
                        )}

                        {status === "VALID" && (
                            <form onSubmit={handleReset} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider block text-left">New Password</label>
                                        <div className="relative group text-left">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                minLength={10}
                                                maxLength={32}
                                                autoFocus
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                placeholder="New password (10-32 chars)"
                                            />
                                        </div>
                                        <PasswordStrength password={newPassword} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider block text-left">Confirm Password</label>
                                        <div className="relative group text-left">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-[56px] relative group overflow-hidden rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                                    <div className="relative flex items-center justify-center gap-2">
                                        <span>{loading ? "Updating..." : "Confirm Reset"}</span>
                                        {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                                    </div>
                                </button>
                            </form>
                        )}

                        {status === "EXPIRED" && (
                            <div className="space-y-6 text-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                                    <AlertCircle size={32} className="text-red-400" />
                                </div>
                                <Link href="/forgot-password"
                                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 transition-all text-sm uppercase tracking-widest border border-white/5"
                                >
                                    Request New Link
                                    <ArrowRight size={18} />
                                </Link>
                                <Link href="/signin" className="block text-[11px] text-slate-500 hover:text-white uppercase font-bold transition-colors">
                                    Back to login
                                </Link>
                            </div>
                        )}

                        {status === "SUCCESS" && (
                            <div className="space-y-6 text-center animate-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                    <CheckCircle2 size={32} className="text-emerald-400" />
                                </div>
                                <Link href="/signin"
                                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 transition-all text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                >
                                    Return to Sign In
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Security Module...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
