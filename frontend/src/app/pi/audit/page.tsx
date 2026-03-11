"use client";

import GlobalAuditLog from "../../admin/audit/page";

export default function PIAuditTrail() {
    // In a real app, this would wrap GlobalAuditLog with PI-specific filters
    return <GlobalAuditLog />;
}
