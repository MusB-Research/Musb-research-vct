"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
    LayoutDashboard,
    Smartphone,
    LayoutGrid,
    Briefcase, Users, Calendar, Package, Database,
    ShieldAlert, FileText, Settings, Search, Bell, UserCircle, LogOut, BarChart, Users2,
    Zap, FileSignature, Activity, Binary, FlaskConical, MessageSquare, Plus, Mail, PlusCircle, ChevronDown
} from "lucide-react";
import { AdminAuth, type PortalUser } from "@/lib/portal-auth";
import NotificationBell from "@/components/NotificationBell";
import { Menu, X, Bell as BellIcon } from "lucide-react";
import { useRef } from "react";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "My Studies", href: "/admin/studies", icon: Briefcase },
    { name: "Study Setup", href: "/admin/studies/new", icon: Settings },
    { name: "Recruitment", href: "/admin/recruitment", icon: Zap },
    { name: "Participant Leads", href: "/admin/leads", icon: Search },
    { name: "Participants", href: "/admin/participants", icon: Users },
    { name: "Scheduling", href: "/admin/scheduling", icon: Calendar },
    { name: "Consent", href: "/admin/consent", icon: FileSignature },
    { name: "Forms & Questionnaires", href: "/admin/forms", icon: FileText },
    { name: "Visits & Assessments", href: "/admin/visits", icon: Activity },
    { name: "Intervention / Arm Assignment", href: "/admin/interventions", icon: Binary },
    { name: "Kits & Samples", href: "/admin/inventory", icon: Package },
    { name: "Labs & Results", href: "/admin/labs", icon: FlaskConical },
    { name: "Compensation", href: "/admin/compensation", icon: BarChart },
    { name: "Communication Log", href: "/admin/messages", icon: MessageSquare },
    { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart },
    { name: "Documents", href: "/admin/documents", icon: FileText },
    { name: "Audit Log", href: "/admin/audit", icon: ShieldAlert },
];

const ADMIN_ROLES = new Set(["ADMIN", "COORDINATOR", "PI", "DATA_MANAGER"]);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // ── Per-tab auth: reads from THIS TAB's sessionStorage only ──
    // Admin in Tab 2 does NOT affect Participant Tab 1 — sessionStorage is tab-isolated.
    const [adminUser, setAdminUser] = useState<PortalUser | null>(null);
    const [authStatus, setAuthStatus] = useState<"loading" | "ok" | "denied">("loading");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Login page is always accessible without auth
        if (pathname === "/admin/login") {
            setAuthStatus("ok");
            return;
        }
        const session = AdminAuth.get();
        if (!session || !ADMIN_ROLES.has(session.user.role)) {
            setAuthStatus("denied");
            router.replace("/admin/login");
        } else {
            setAdminUser(session.user);
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
        AdminAuth.clear(); // Clear only THIS TAB's admin session
        await signOut({ redirect: false });
        window.location.href = "https://www.musbhealth.com/";
    };

    // Login page: render without the dashboard shell
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Show spinner while loading or redirecting
    if (authStatus !== "ok") {
        return (
            <div className="h-screen bg-transparent flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-transparent text-slate-200 overflow-hidden relative">
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
                    <Link href="/admin" className="flex items-center group">
                        <div className="bg-white px-3.5 py-1.5 rounded-full shadow-lg shadow-cyan-500/15 transition-transform group-hover:scale-[1.02]">
                            <img src="/musb research.png" alt="MUSB Research" className="h-[22px] w-auto object-contain" />
                        </div>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group border ${isActive
                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                                    : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"}`}>
                                <item.icon size={18} className={isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-400"} />
                                <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/10">
                        <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">MUSB Cloud</p>
                        <p className="text-[10px] text-cyan-400/70 font-bold mb-3">Enterprise Research OS v2.4</p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
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
                        
                        {/* Study Switcher (Spec 4.2) */}
                        <div className="hidden xl:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl group hover:border-cyan-500/30 transition-all cursor-pointer">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[150px]">LIDORE Protocol X</span>
                            <ChevronDown size={14} className="text-slate-500" />
                        </div>

                        <div className="hidden sm:flex-1 sm:max-w-md lg:max-w-lg">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                <input type="text" placeholder="Search protocol data..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs lg:text-sm text-slate-200 focus:outline-none focus:border-cyan-500/30 focus:ring-4 focus:ring-cyan-500/5 transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-6">
                        <div className="sm:relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className={`p-2.5 rounded-xl border transition-all ${isNotificationsOpen ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'text-slate-500 border-white/10 hover:text-white hover:bg-white/5'}`}
                            >
                                <BellIcon size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#0A1128] animate-pulse" />
                            </button>

                            {/* Notifications Dropdown (Responsive) */}
                            {isNotificationsOpen && (
                                <div className="absolute left-4 right-4 sm:left-auto sm:right-0 top-[70px] sm:top-auto sm:mt-1 sm:w-96 bg-[#0a1120]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Protocol Alerts</h3>
                                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-widest">3 New</span>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                                        {[1, 2, 3].map((n) => (
                                            <div key={n} className="p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer group mb-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[13px] font-bold text-white group-hover:text-cyan-400 transition-colors">Safety Alert: Participant 00{n}</span>
                                                    <span className="text-[10px] text-slate-600 uppercase font-black italic">5m ago</span>
                                                </div>
                                                <p className="text-[12px] text-slate-400 leading-relaxed">System detected a mild adverse event entry requiring coordinator review.</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                                        <button className="text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Advanced Comm Center</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-2">
                            <button className="p-2.5 text-slate-500 hover:text-white bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all">
                                <MessageSquare size={18} />
                            </button>
                            <button className="p-2.5 text-slate-500 hover:text-white bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all">
                                <Calendar size={18} />
                            </button>
                        </div>

                        <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-cyan-600/20 transition-all">
                            <PlusCircle size={16} /> Quick Add
                        </button>

                        <div className="h-6 w-px bg-white/5 hidden sm:block" />

                        <div className="sm:relative" ref={profileRef}>
                            <button className="flex items-center gap-3 cursor-pointer group w-full text-left focus:outline-none" onClick={() => setIsProfileOpen((prev) => !prev)}>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[13px] font-bold text-white leading-none mb-1 group-hover:text-cyan-400 transition-colors">{adminUser?.name || "Coordinator"}</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{adminUser?.role || "Admin"}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center overflow-hidden hover:border-cyan-500/50 transition-all">
                                    <UserCircle size={24} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute left-4 right-4 sm:left-auto sm:right-0 top-[70px] sm:top-auto sm:mt-1 sm:w-60 bg-[#0a1120]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-5 border-b border-white/5">
                                        <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{adminUser?.name}</p>
                                        <p className="text-[11px] text-slate-500 font-bold truncate italic">{adminUser?.email || "coord@musb.research"}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/admin/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                            <Settings size={16} /> Dashboard Settings
                                        </Link>
                                        <Link href="/admin/team" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                                            <Users2 size={16} /> My Research Team
                                        </Link>
                                        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[13px] font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all">
                                            <LogOut size={16} /> Terminate Session
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar" style={{ background: 'transparent' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
