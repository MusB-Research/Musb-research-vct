import { Users, FileText, AlertTriangle, CheckCircle2, Shield } from "lucide-react";

export const sponsorInfo = {
    name: "Sponsor Partner",
    org: "BioGen Pharma Inc.",
    email: "sponsor@musbresearch.com",
    sponsorId: "SP-ORG-001",
};

export const sponsoredStudies = [
    {
        id: "lung-cancer-screening",
        title: "Early Detection Lung Cancer Screening",
        condition: "Oncology",
        status: "RECRUITING",
        phase: "Phase II",
        enrolled: 87,
        target: 200,
        screened: 143,
        withdrawn: 6,
        startDate: "Jan 2025",
        endDate: "Jan 2026",
        primaryEndpoint: "VOC Biomarker Sensitivity ≥ 85%",
        site: "Hybrid (Remote + 2 Clinic Visits)",
        aeCount: 3,
        adherence: 91,
    },
];

export const recentActivity = [
    { id: 1, type: "enrollment", message: "3 new participants enrolled today", time: "2h ago", icon: Users, color: "text-cyan-400" },
    { id: 2, type: "report", message: "Monthly Safety Report available for download", time: "Yesterday", icon: FileText, color: "text-indigo-400" },
    { id: 3, type: "ae", message: "1 Adverse Event flagged — MILD severity", time: "2 days ago", icon: AlertTriangle, color: "text-amber-400" },
    { id: 4, type: "milestone", message: "40% enrollment milestone reached!", time: "3 days ago", icon: CheckCircle2, color: "text-emerald-400" },
    { id: 5, type: "consent", message: "8 participants completed e-Consent", time: "4 days ago", icon: Shield, color: "text-purple-400" },
];

export const documents = [
    { id: 1, name: "Protocol v2.1", type: "Protocol", date: "Jan 15, 2025", size: "2.4 MB" },
    { id: 2, name: "January Safety Report", type: "Safety", date: "Feb 1, 2025", size: "1.1 MB" },
    { id: 3, name: "IRB Approval Letter", type: "Regulatory", date: "Dec 10, 2024", size: "480 KB" },
    { id: 4, name: "Informed Consent v1.2", type: "Consent", date: "Jan 3, 2025", size: "890 KB" },
];

export const adverseEvents = [
    { id: "AE-001", participant: "P-0032", severity: "MILD", description: "Mild dizziness post breath sample", date: "Feb 17, 2025", status: "Resolved" },
    { id: "AE-002", participant: "P-0045", severity: "MILD", description: "Transient nasal irritation", date: "Feb 15, 2025", status: "Resolved" },
    { id: "AE-003", participant: "P-0071", severity: "MODERATE", description: "Persistent cough, 3 days", date: "Feb 12, 2025", status: "Under Review" },
];

export const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    UNDER_REVIEW: { label: "Pending Approval", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    ACTIVE: { label: "Live on MusB Site", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    DRAFT: { label: "Draft", cls: "bg-slate-800 text-slate-400 border-white/10" },
    RECRUITING: { label: "Recruiting", cls: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
};
