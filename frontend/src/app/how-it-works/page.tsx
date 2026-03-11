"use client";

import { 
    Search, ClipboardCheck, FlaskConical, 
    Gift, CheckCircle2, ArrowRight, ShieldCheck, 
    Smartphone, Mail, Lock, Zap, Activity
} from "lucide-react";
import Container from "@/components/Container";
import Link from "next/link";

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-indigo-500/[0.05] to-transparent">
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
                        How it <span className="text-indigo-400">Works</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg italic">
                        The MUSB Research platform simplifies clinical participation. From discovery to data delivery, we&apos;ve built a secure, virtual-first bridge between subject and scientist.
                    </p>
                </Container>
            </section>

            {/* Steps Section */}
            <section className="py-24 relative">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { 
                                icon: Search, 
                                title: "Discovery", 
                                desc: "Browse our active directory of longevity and metabolic trials. Find a protocol that matches your health goals.",
                                step: "01"
                            },
                            { 
                                icon: ClipboardCheck, 
                                title: "Scan", 
                                desc: "Complete the digital eligibility screener. Our AI-driven engine verifies your baseline biometrics instantly.",
                                step: "02"
                            },
                            { 
                                icon: Mail, 
                                title: "Consent", 
                                desc: "Review and sign GxP-compliant eConsent forms. Secure your spot in the study protocol within minutes.",
                                step: "03"
                            },
                            { 
                                icon: Smartphone, 
                                title: "Engage", 
                                desc: "Track tasks, log supplements, and coordinate site visits through your secure participant dashboard.",
                                step: "04"
                            }
                        ].map((s, i) => (
                            <div key={i} className="glass p-10 rounded-[3rem] border border-white/5 relative group hover:border-indigo-500/30 transition-all">
                                <span className="absolute top-8 right-8 text-4xl font-black text-white/5 group-hover:text-indigo-500/10 transition-colors uppercase italic">{s.step}</span>
                                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                                    <s.icon size={32} />
                                </div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-4">{s.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Feature Highlights */}
            <section className="py-24 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
                <Container className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-8 leading-tight">
                            Virtual-First <br /> <span className="text-cyan-400">Clinical Architecture</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                { title: "Secure Communication", desc: "Encrypted messaging directly to Principal Investigators and Site Coordinators.", icon: Zap },
                                { title: "Digital Compensation", desc: "Automated stipend payouts via Stripe Connect or Direct Deposit upon milestone completion.", icon: Gift },
                                { title: "Data Anonymization", desc: "Your PII is stripped before researchers see it. Full GDPR & HIPAA compliance.", icon: ShieldCheck }
                            ].map((f, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400">
                                        <f.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">{f.title}</h4>
                                        <p className="text-slate-500 font-medium italic">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-video glass rounded-[3rem] border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                             <Activity size={120} className="text-indigo-400 opacity-20 animate-pulse" />
                             <div className="absolute bottom-10 left-10 p-6 glass border border-white/10 rounded-2xl animate-in slide-in-from-bottom-4 duration-1000">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Live Tele-visit Potential</span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase italic tracking-tighter">Site 01 · Austin Protocol Node</p>
                             </div>
                        </div>
                        {/* Decorative orbs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <Container>
                    <div className="max-w-3xl mx-auto glass p-16 rounded-[4rem] border border-indigo-500/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/[0.03] pointer-events-none" />
                        <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-8 relative z-10">Start Your Contribution</h2>
                        <p className="text-slate-400 mb-10 font-medium italic relative z-10">Ready to advance medical science from the comfort of your home?</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/studies" className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[13px] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group">
                                Browse Protocols <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/signin" className="px-10 py-5 bg-white/5 border border-white/10 hover:border-white/30 text-white font-black uppercase tracking-widest text-[13px] rounded-2xl transition-all flex items-center justify-center gap-3">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
