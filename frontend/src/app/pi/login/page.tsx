"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Microscope, ShieldCheck, Lock, ArrowRight, 
    AtSign, Key, AlertCircle, Building2
} from "lucide-react";
import { AdminAuth } from "@/lib/portal-auth";

export default function PILogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        setTimeout(() => {
            if (email.includes("pi")) {
                AdminAuth.save("mock-pi-token", {
                    id: "pi-901",
                    name: "Dr. Alexander Chen",
                    email: email,
                    role: "PI"
                });
                router.push("/pi/dashboard");
            } else {
                setError("Scientific credentials not recognized for Investigator Hub.");
                setLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-slate-500/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
            </div>

            <div className="w-full max-w-[450px] relative z-10 shrink-0">
                <div className="bg-[#0a1120]/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-50" />
                    
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 bg-white p-4 rounded-[2rem] shadow-2xl mb-8 group-hover:scale-105 transition-transform duration-500">
                             <img src="/musb research.png" alt="MUSB" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Investigator Hub</h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Principal Investigator Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">Scientific Credentials</label>
                             <div className="relative group">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="pi@musbhealth.com"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-700 font-medium" 
                                    required
                                />
                             </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">Security Key</label>
                             <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-700" 
                                    required
                                />
                             </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle size={18} className="text-red-500 shrink-0" />
                                <p className="text-[11px] font-bold text-red-400 italic">{error}</p>
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Enter Command Hub <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-600">
                             <ShieldCheck size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">GxP Secure Environment</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                             <Building2 size={12} /> Institutional Sign-On
                             <span className="text-slate-800">|</span>
                             <Lock size={12} /> MFA Enabled
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
                    Developed by MUSB Advanced Agentic Coding Team
                </div>
            </div>
        </div>
    );
}
