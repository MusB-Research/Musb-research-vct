"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ForgotPasswordContent() {
    const searchParams = useSearchParams();
    const roleParam = searchParams.get("role") || "PARTICIPANT";

    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1); // 1 = Form, 2 = Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getReturnLink = () => {
        if (roleParam === "SPONSOR") return "/sponsor/login";
        if (roleParam === "ADMIN") return "/admin/login";
        if (roleParam === "SUPER_ADMIN") return "/super-admin/login";
        return "/signin";
    };

    const handleSendResetLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/proxy/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok && res.status !== 200) {
                const d = await res.json();
                if (res.status === 429) {
                    setError("Too many requests. Please try again later.");
                    return;
                }
            }

            setStep(2); // Show success message
        } catch (err) {
            setError("Connection failed. Please check your network.");
        } finally {
            setLoading(false);
        }
    };

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
                            <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">
                                {step === 2 ? "Check Your Email" : "Forgot Password"}
                            </h1>
                            <p className="text-slate-400 text-[13px] font-bold uppercase tracking-[0.15em] max-w-[280px] mx-auto leading-relaxed">
                                {step === 1 && "Enter your email to receive a secure reset link"}
                                {step === 2 && "A password reset link has been sent to your inbox"}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                <ShieldCheck size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <span className="text-sm text-red-200">{error}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleSendResetLink} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider text-left block">Email Address</label>
                                    <div className="relative group text-left">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                            placeholder="you@email.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-[54px] relative group overflow-hidden rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                                    <div className="relative flex items-center justify-center gap-2">
                                        <span>{loading ? "Sending..." : "Send Reset Link"}</span>
                                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                    </div>
                                </button>

                                <div className="text-center mt-6">
                                    <Link href={getReturnLink()} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                        Return to login
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                    <CheckCircle2 size={32} className="text-emerald-400" />
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Check your inbox (and spam folder) for the reset link. It will expire in 30 minutes.
                                </p>
                                <div className="pt-2">
                                    <Link href={getReturnLink()} className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 transition-all text-sm uppercase tracking-widest">
                                        Return to Log In
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-[11px] text-slate-500 hover:text-cyan-400 transition-colors uppercase font-black tracking-widest pt-4"
                                >
                                    Didn't get it? Try again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white font-black italic tracking-widest uppercase">Initializing Secure Flux...</div>}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
