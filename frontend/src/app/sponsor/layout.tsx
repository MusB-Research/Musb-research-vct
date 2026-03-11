"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, Briefcase, Users, PieChart, Shield, FileText,
    BarChart3, Settings, LogOut, Bell, UserCircle, Search, Menu, X,
    Globe, Microscope, MessageSquare, ClipboardList, Package,
    ChevronRight, ExternalLink
} from "lucide-react";
import { SponsorAuth, type PortalUser } from "@/lib/portal-auth";
import { signOut } from "next-auth/react";

const navItems = [
    { name: "Dashboard (Overview)", href: "/sponsor/dashboard", icon: LayoutDashboard },
    { name: "My Studies", href: "/sponsor/studies", icon: Briefcase },
    { name: "Recruitment Progress", href: "/sponsor/recruitment", icon: PieChart },
    { name: "Participant Data", href: "/sponsor/participants", icon: Users },
    { name: "Intervention / Arm View", href: "/sponsor/interventions", icon: ClipboardList },
    { name: "Lab & Sample Data", href: "/sponsor/labs", icon: Package },
    { name: "Safety (AE/SAE)", href: "/sponsor/safety", icon: Shield },
    { name: "Reports & Claims", href: "/sponsor/reports", icon: BarChart3 },
    { name: "Documents", href: "/sponsor/documents", icon: FileText },
    { name: "Messages", href: "/sponsor/messages", icon: MessageSquare },
];

export default function SponsorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sponsorUser, setSponsorUser] = useState<PortalUser | null>(null);
    const [authStatus, setAuthStatus] = useState<"loading" | "ok" | "denied">("loading");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Login page is always accessible without auth
        if (pathname === "/sponsor/login") {
            setAuthStatus("ok");
            return;
        }
        const session = SponsorAuth.get();
        if (!session || !["SPONSOR", "SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER"].includes(session.user.role)) {
            setAuthStatus("denied");
            router.replace("/sponsor/login");
        } else {
            setSponsorUser(session.user);
            setAuthStatus("ok");
        }
    }, [pathname, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        SponsorAuth.clear();
        await signOut({ redirect: false });
        window.location.href = "https://www.musbhealth.com/";
    };

    if (pathname === "/sponsor/login") {
        return <>{children}</>;
    }

    if (authStatus !== "ok") {
        return (
            <div className="h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden relative font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 lg:w-64 border-r border-white/5 bg-[#0a1120]/95 backdrop-blur-xl flex flex-col z-[70] transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <Link href="/sponsor/dashboard" className="flex items-center group">
                        <div className="bg-white px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/15 transition-transform group-hover:scale-[1.02]">
                            <img src="/musb research.png" alt="MUSB Research" className="h-[22px] w-auto object-contain" />
                        </div>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link key={item.name} href={item.href} onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group border ${isActive
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5"
                                    : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"}`}>
                                <item.icon size={18} className={isActive ? "text-amber-500" : "text-slate-500 group-hover:text-slate-400"} />
                                <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10">
                        <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Sponsor Hub</p>
                        <p className="text-[10px] text-amber-400/70 font-bold mb-3">Enterprise Insight v1.2</p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-white/5 bg-[#0a1120]/40 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex-1 sm:max-w-md lg:max-w-xl">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                                <input type="text" placeholder="Search sponsored clinical data..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs lg:text-sm text-slate-200 focus:outline-none focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-6">
                        <div className="sm:relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`p-2.5 rounded-xl border transition-all ${isNotificationsOpen ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'text-slate-500 border-white/10 hover:text-white hover:bg-white/5'}`}
                            >
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#0A1128] animate-pulse" />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-white/5 hidden sm:block" />

                        <div className="sm:relative" ref={profileRef}>
                            <button className="flex items-center gap-3 cursor-pointer group w-full text-left focus:outline-none" onClick={() => setIsProfileOpen((prev) => !prev)}>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[13px] font-bold text-white leading-none mb-1 group-hover:text-amber-400 transition-colors uppercase italic tracking-tight">{sponsorUser?.name || "Partner"}</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{sponsorUser?.role || "SPONSOR"}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center overflow-hidden hover:border-amber-500/50 transition-all">
                                    <Microscope size={24} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute left-4 right-4 sm:left-auto sm:right-0 top-[70px] sm:top-auto sm:mt-1 sm:w-60 bg-[#0a1120]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-5 border-b border-white/5">
                                        <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{sponsorUser?.name}</p>
                                        <p className="text-[11px] text-slate-500 font-bold truncate italic">{sponsorUser?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/sponsor/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                            <Settings size={16} className="text-amber-500/50" /> Portal Settings
                                        </Link>
                                        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[13px] font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all">
                                            <LogOut size={16} /> Sign Out Partner
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
