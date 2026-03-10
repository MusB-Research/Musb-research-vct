"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function StudiesDirectory() {
    useEffect(() => {
        // Redirect to the main website's trials section as the VCT directory is now centralized there
        window.location.href = "https://www.musbhealth.com/trials#current-studies";
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="glass p-12 rounded-[2.5rem] border border-cyan-500/20 max-w-md w-full animate-in fade-in zoom-in duration-500">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-6" />
                <h1 className="text-2xl font-black text-white italic mb-4">Centralizing Directory</h1>
                <p className="text-slate-400 font-medium leading-relaxed">
                    We are moving the study directory to our main public portal. You are being redirected...
                </p>
                <div className="mt-8 flex justify-center">
                    <a
                        href="https://www.musbhealth.com/trials#current-studies"
                        className="text-cyan-400 text-sm font-black uppercase tracking-widest hover:text-white transition-colors border-b border-cyan-500/30 pb-1"
                    >
                        Click here if you aren't redirected
                    </a>
                </div>
            </div>
        </div>
    );
}
