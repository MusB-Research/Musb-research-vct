"use client";

import { useState, useEffect } from "react";
import { AdminAuth } from "@/lib/portal-auth";
import { 
    MessageCircle, 
    Mail, 
    Send, 
    Search, 
    Filter, 
    MoreVertical, 
    Clock, 
    CheckCircle2, 
    Phone, 
    Users2, 
    Zap,
    ChevronRight,
    SearchCode,
    MessageSquare,
    LayoutGrid
} from "lucide-react";

interface ContactMessage {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    read: boolean;
}

export default function AdminMessages() {
    const [activeTab, setActiveTab] = useState("Participant Log");
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = AdminAuth.get()?.token;
            if (!token) return;

            try {
                const res = await fetch("/api/proxy/messages/contact", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight uppercase">Communication Log</h1>
                    <p className="text-slate-500 mt-2 font-medium">Multi-channel participant outreach & broadcast console (Spec 4.18)</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">Templates</button>
                    <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-600/20 transition-all flex items-center gap-2">
                        <Users2 size={16} /> Bulk Broadcast
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-8 border-b border-white/5 pb-4">
                {["Participant Log", "Inbound Inquiries", "Broadcast History", "Opt-out List"].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`text-[11px] font-black uppercase tracking-[0.2em] italic transition-all relative py-2 ${activeTab === tab ? 'text-cyan-400 underline decoration-cyan-500 underline-offset-8' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Message List */}
                <div className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input type="text" placeholder="Search conversations..." className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-cyan-500/50 transition-all font-medium" />
                    </div>

                    <div className="space-y-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        {[
                            { name: "Sarah Miller", last: "Thanks for the info!", time: "10m ago", unread: true },
                            { name: "James Wilson", last: "Can I reschedule my visit?", time: "2h ago", unread: false },
                            { name: "Emma Davis", last: "Is fasting required for blood test?", time: "5h ago", unread: false },
                            { name: "Michael Roark", last: "Sample kit received today.", time: "1d ago", unread: false },
                        ].map((chat, i) => (
                            <div key={i} className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center group ${chat.unread ? 'bg-cyan-500/5 border-cyan-500/30 shadow-xl shadow-cyan-500/5' : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}>
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white/5 group-hover:text-cyan-400 group-hover:border-cyan-500/20">
                                    {chat.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-[13px] font-black text-white italic truncate uppercase">{chat.name}</h4>
                                        <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap">{chat.time}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{chat.last}</p>
                                </div>
                                {chat.unread && <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversation Thread */}
                <div className="col-span-12 lg:col-span-8 flex flex-col glass rounded-[3rem] border border-white/5 min-h-[600px] overflow-hidden">
                    {/* Thread Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black border border-cyan-500/30 italic">SM</div>
                            <div>
                                <h3 className="text-white font-black italic uppercase tracking-widest text-[13px]">Sarah Miller</h3>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">● Active Participant</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-white/5"><Phone size={16} /></button>
                            <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-white/5"><MoreVertical size={16} /></button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-slate-950/20">
                        <div className="flex flex-col gap-1 max-w-[70%]">
                            <div className="p-4 bg-slate-900/80 border border-white/5 rounded-2xl rounded-tl-none text-[13px] text-slate-300 leading-relaxed shadow-lg">
                                Hello Sarah, just checking in for your Week 4 visit tomorrow at 10:00 AM. Is everything still on track?
                            </div>
                            <span className="text-[10px] text-slate-600 font-bold ml-1 uppercase">Today • 09:12 AM</span>
                        </div>

                        <div className="flex flex-col gap-1 max-w-[70%] ml-auto items-end">
                            <div className="p-4 bg-cyan-600 text-white rounded-2xl rounded-tr-none text-[13px] leading-relaxed shadow-xl shadow-cyan-600/10">
                                Yes, I'm all set! Thanks for the info!
                            </div>
                            <span className="text-[10px] text-slate-600 font-bold mr-1 uppercase">Today • 09:45 AM</span>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-6 border-t border-white/5 bg-slate-900/20">
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                placeholder="Type participant message..." 
                                className="flex-1 bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all font-medium placeholder:text-slate-700 shadow-inner" 
                            />
                            <button className="w-14 h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl shadow-xl shadow-cyan-600/20 transition-all flex items-center justify-center shrink-0">
                                <Send size={20} className="-mr-1 -mt-0.5" />
                            </button>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="text-[10px] font-black text-slate-600 hover:text-cyan-400 uppercase tracking-widest transition-all italic flex items-center gap-1.5"><MessageSquare size={12} /> SMS Channel</button>
                            <button className="text-[10px] font-black text-slate-600 hover:text-cyan-400 uppercase tracking-widest transition-all italic flex items-center gap-1.5"><Mail size={12} /> Email Portal</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
