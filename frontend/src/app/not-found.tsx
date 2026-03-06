"use client";

import Link from "next/link";
import { MoveLeft, Home } from "lucide-react";
import CosmicBackground from "@/components/CosmicBackground";

export default function NotFound() {
    return (
        <div className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
            <CosmicBackground />

            <div className="z-10 animate-fade-in-up">
                <div className="mb-6 relative">
                    <h1 className="text-9xl font-black text-cyan-500/20 absolute -top-12 left-1/2 -translate-x-1/2 -z-10 blur-sm">404</h1>
                    <h1 className="text-7xl md:text-8xl font-black tracking-tight text-white mb-2">Lost in <br /> Deep Space</h1>
                </div>

                <p className="text-slate-300 text-lg md:text-xl max-w-md mx-auto mb-10 leading-relaxed font-medium">
                    The clinical discovery you're searching for hasn't reached this quadrant yet. Our researchers are still investigating.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => window.history.back()}
                        className="group bg-white/5 border border-white/10 hover:border-white/30 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold hover:-translate-x-1 hover:bg-white/10"
                    >
                        <MoveLeft size={20} className="stroke-[2.5px] group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="group bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold shadow-lg shadow-cyan-900/40 hover:-translate-y-1 hover:shadow-cyan-400/20"
                    >
                        <Home size={20} className="stroke-[2.5px]" />
                        Return Home
                    </Link>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -z-10" />
        </div>
    );
}
