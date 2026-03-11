"""
Super Admin Routes
==================
Full system-level control: users, studies, admins, sponsors, audit logs,
system settings, and platform-wide statistics.

Only users with role=SUPER_ADMIN may access these endpoints.
"""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.auth import require_super_admin, get_password_hash
from app.utils.security import encrypt_data, decrypt_data, validate_password
from app.utils.email import notify_new_credentials
from app.config import get_settings

router = APIRouter(prefix="/api/super-admin", tags=["Super Admin"])


# ─── helpers ──────────────────────────────────────────────────────────────────

def _safe_id(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


# ─── Dashboard Stats ──────────────────────────────────────────────────────────

@router.get("/stats")
async def get_platform_stats(
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Full platform-wide statistics visible only to Super Admin."""
    total_users      = await db["users"].count_documents({})
    
    # ── SECTION 5.1: Refined Staff Role Grouping (Ref: PR #182) ──────────────────
    # Includes system admins, coordinators, PIs, and data managers.
    staff_roles = ["ADMIN", "SUPER_ADMIN", "COORDINATOR", "PI", "DATA_MANAGER"]
    total_staff      = await db["users"].count_documents({"role": {"$in": staff_roles}})
    
    # Sponsors and Team Members
    total_sponsors   = await db["users"].count_documents({"role": "SPONSOR"})
    total_sponsor_teams = await db["users"].count_documents({"role": {"$in": ["SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER"]}})
    combined_sponsors = total_sponsors + total_sponsor_teams
    
    # Participants (Total registered accounts)
    total_participants_acc = await db["users"].count_documents({"role": "PARTICIPANT"})
    
    # ── SECTION 5.2: Study & Clinical Counts ─────────────────────────────────────
    # Combined studies from both modules (VCT app and Website)
    vct_studies    = await db["studies"].count_documents({})
    api_studies    = await db["api_study"].count_documents({})
    total_studies  = vct_studies + api_studies
    
    active_vct   = await db["studies"].count_documents({"status": "ACTIVE"})
    active_api   = await db["api_study"].count_documents({"status": "ACTIVE"})
    active_studies = active_vct + active_api
    
    # Participant Profiles
    total_parts      = await db["participants"].count_documents({})
    active_parts     = await db["participants"].count_documents({"status": {"$in": ["ACTIVE", "ENROLLED"]}})
    open_aes         = await db["adverseEvents"].count_documents({"status": {"$ne": "Resolved"}})
    
    collection_names = await db.list_collection_names()
    
    # Website (Other Module) Stats
    staff_count      = await db["api_staffmember"].count_documents({}) if "api_staffmember" in collection_names else 0
    inquiry_count    = await db["api_facilityinquiry"].count_documents({}) if "api_facilityinquiry" in collection_names else 0
    subscribers      = await db["api_newslettersubscriber"].count_documents({}) if "api_newslettersubscriber" in collection_names else 0
    
    audit_today      = await db["audit_logs"].count_documents({
        "timestamp": {"$gte": datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)}
    })

    return {
        "totalUsers":       total_users,
        "totalAdmins":      total_staff,         # Renamed/Repurposed to include all staff
        "totalSponsors":    combined_sponsors,
        "totalSponsorTeams": total_sponsor_teams,
        "totalStudies":     total_studies,
        "activeStudies":    active_studies,
        "totalParticipants": total_participants_acc, # Total registered accounts
        "activeParticipants": active_parts,           # Enrolled/Active clinical status
        "openAdverseEvents": open_aes,
        "websiteStaff":     staff_count,
        "websiteInquiries": inquiry_count,
        "subscribers":      subscribers,
        "auditEventsToday": audit_today,
    }


# ─── User Management ──────────────────────────────────────────────────────────

@router.get("/users")
async def list_all_users(
    role:  Optional[str] = None,
    group: Optional[str] = None, # staff, participant, sponsor
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List every user in the platform with optional role/group/search filter."""
    query: dict = {}
    
    # ── Role/Group Filtration ───────────────
    if role:
        query["role"] = role
    elif group == "staff":
        query["role"] = {"$in": ["ADMIN", "SUPER_ADMIN", "COORDINATOR", "PI", "DATA_MANAGER"]}
    elif group == "participant":
        query["role"] = "PARTICIPANT"
    elif group == "sponsor":
        query["role"] = {"$in": ["SPONSOR", "SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER"]}
        
    if search:
        query["email"] = {"$regex": search, "$options": "i"}

    users = []
    async for u in db["users"].find(query).sort("createdAt", -1).skip(skip).limit(limit):
        users.append({
            "id":        str(u["_id"]),
            "name":      decrypt_data(u.get("name")) or "",
            "email":     u.get("email", ""),
            "role":      u.get("role", "PARTICIPANT"),
            "createdAt": u.get("createdAt"),
            "updatedAt": u.get("updatedAt"),
            "emailVerified": u.get("emailVerified"),
            "mustChangePassword": u.get("mustChangePassword", False),
        })
    total = await db["users"].count_documents(query)
    return {"users": users, "total": total}


class CreateUserBody(BaseModel):
    name: str
    email: str
    password: str
    role: str = "COORDINATOR"


@router.post("/users")
async def create_user(
    body: CreateUserBody,
    background_tasks: BackgroundTasks,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Create any user account (Admin, Coordinator, PI, Data Manager, Sponsor) and send welcome email."""
    # Prevent participant creation via super admin endpoint
    if body.role == "PARTICIPANT":
        raise HTTPException(
            status_code=400,
            detail="Participants cannot be created by super admin. Participants self-register through the application."
        )

    email = body.email.lower().strip()
    if await db["users"].find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email already in use.")

    # Validate Password
    is_valid, reason = validate_password(body.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=reason)

    now = datetime.now(timezone.utc)
    doc = {
        "name":         encrypt_data(body.name),
        "email":        email,
        "passwordHash": get_password_hash(body.password),
        "role":         body.role,
        "createdAt":    now,
        "updatedAt":    now,
        "createdBy":    current_user.user_id,
    }
    result = await db["users"].insert_one(doc)
    user_id = str(result.inserted_id)

    # Send welcome email with credentials
    settings = get_settings()
    login_url = f"{settings.FRONTEND_URL}/signin"

    try:
        background_tasks.add_task(
            notify_new_credentials,
            user_email=body.email,
            user_name=body.name,
            role=body.role,
            login_url=login_url,
            password=body.password
        )
        email_sent = True
    except Exception as e:
        # Log the error but don't fail the request
        print(f"Failed to send welcome email: {str(e)}")
        email_sent = False

    return {
        "id": user_id,
        "message": "User created successfully.",
        "emailSent": email_sent,
        "loginUrl": login_url,
        "note": "A welcome email with credentials has been sent to the user."
    }


class UpdateUserBody(BaseModel):
    name:     Optional[str] = None
    role:     Optional[str] = None
    password: Optional[str] = None
    suspended: Optional[bool] = None


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    body: UpdateUserBody,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Update any user's name, role, password, or suspension status."""
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID.")

    updates: dict = {"updatedAt": datetime.now(timezone.utc)}
    if body.name is not None:
        updates["name"] = encrypt_data(body.name)
    if body.role is not None:
        updates["role"] = body.role
    if body.password is not None:
        is_valid, reason = validate_password(body.password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=reason)
        updates["passwordHash"] = get_password_hash(body.password)
    if body.suspended is not None:
        updates["suspended"] = body.suspended

    result = await db["users"].update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"message": "User updated successfully."}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Permanently delete a user account."""
    # Prevent self-deletion
    if user_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account.")
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID.")

    result = await db["users"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"message": "User deleted."}


# ─── Study Management ─────────────────────────────────────────────────────────

@router.get("/studies")
async def list_all_studies(
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all studies from both modules (VCT app and Website)."""
    query: dict = {}
    if status:
        # Use case-insensitive search to bridge VCT (UPPER) and Website (Title Case) status
        query["status"] = {"$regex": f"^{status}$", "$options": "i"}

    studies = []
    
    # 1. Fetch from VCT 'studies' collection
    async for s in db["studies"].find(query).sort("createdAt", -1).skip(skip).limit(limit):
        studies.append({
            "id":          str(s["_id"]),
            "title":       s.get("title", ""),
            "slug":        s.get("slug", ""),
            "status":      s.get("status", "DRAFT"),
            "condition":   s.get("condition", ""),
            "location":    s.get("location", ""),
            "createdAt":   s.get("createdAt"),
            "targetParticipants": s.get("targetParticipants", 0),
            "source":      "VCT_APP"
        })
        
    # 2. Fetch from Website 'api_study' collection (if space in limit)
    limit_left = limit - len(studies)
    if limit_left > 0:
        # Website schema uses 'created_at' instead of 'createdAt'
        async for s in db["api_study"].find(query).sort("created_at", -1).limit(limit_left):
            studies.append({
                "id":          str(s["_id"]),
                "title":       s.get("title", ""),
                "slug":        s.get("slug", ""),
                "status":      s.get("status", "DRAFT").upper(), # Normalize status
                "condition":   s.get("condition", ""),
                "location":    s.get("location", ""),
                "createdAt":   s.get("created_at") or s.get("createdAt"),
                "targetParticipants": s.get("targetParticipants", 0),
                "source":      "WEBSITE"
            })

    vct_total = await db["studies"].count_documents(query)
    # For counting API studies, we use the same status query
    api_total = await db["api_study"].count_documents(query)
    
    return {"studies": studies, "total": vct_total + api_total}


@router.post("/studies", status_code=201)
async def super_admin_create_study(
    body: dict,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Bypass standard admin workflow and create a study directly in the VCT module."""
    now = datetime.now(timezone.utc)
    
    # Generate slug if not provided
    if not body.get("slug"):
        import re
        slug = re.sub(r'[^a-z0-9]+', '-', body.get("title", "").lower()).strip('-')
        body["slug"] = f"{slug}-{ObjectId()}" if not slug else slug
        
    doc = {
        **body,
        "createdAt": now,
        "updatedAt": now,
        "createdBy": current_user.user_id,
        "source": body.get("source", "SUPER_ADMIN"),
        "status": body.get("status", "ACTIVE")
    }
    
    result = await db["studies"].insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Study created successfully by Super Admin."}


class StudyStatusBody(BaseModel):
    status: str  # DRAFT, ACTIVE, PAUSED, COMPLETED, ARCHIVED


@router.patch("/studies/{study_id}/status")
async def update_study_status(
    study_id: str,
    body: StudyStatusBody,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Change a study's status in either module and sync is_active for public visibility."""
    try:
        oid = ObjectId(study_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid study ID.")

    now = datetime.now(timezone.utc)
    status_upper = body.status.upper()
    
    # Define which statuses count as 'active' for the public website
    is_active_for_website = status_upper in ["ACTIVE", "RECRUITING", "ONGOING", "OPEN"]

    # 1. Try VCT module (Module A)
    result = await db["studies"].update_one(
        {"_id": oid},
        {"$set": {"status": status_upper, "updatedAt": now, "updatedBy": current_user.user_id}}
    )
    
    # 2. If not found, try Website module (Module B)
    if result.matched_count == 0:
        # Website module might use title case for status (e.g., 'Recruiting' instead of 'RECRUITING')
        website_status = body.status.capitalize() if status_upper == "RECRUITING" else body.status
        
        result = await db["api_study"].update_one(
            {"_id": oid},
            {"$set": {
                "status": website_status,
                "updated_at": now,
                "is_active": is_active_for_website
            }}
        )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Study not found in any module.")
        
    return {"message": f"Study status updated to {body.status}. Public visibility: {'Active' if is_active_for_website else 'Hidden'}"}


@router.delete("/studies/{study_id}")
async def delete_study(
    study_id: str,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Permanently delete a study and all its associated data from either module."""
    try:
        oid = ObjectId(study_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid study ID.")

    # 1. Check VCT studies
    study = await db["studies"].find_one({"_id": oid})
    if study:
        sid = str(oid)
        await db["participants"].delete_many({"studyId": sid})
        await db["taskInstances"].delete_many({"studyId": sid})
        await db["studies"].delete_one({"_id": oid})
        return {"message": "VCT Study and associated data permanently deleted."}
    
    # 2. Check Website studies
    study = await db["api_study"].find_one({"_id": oid})
    if study:
        await db["api_study"].delete_one({"_id": oid})
        return {"message": "Website Study permanently deleted."}

    raise HTTPException(status_code=404, detail="Study not found.")


# ─── Sponsor / Lead Management ────────────────────────────────────────────────

@router.get("/sponsors")
async def list_sponsors(
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all sponsor users."""
    sponsors = []
    async for u in db["users"].find({"role": "SPONSOR"}).sort("createdAt", -1):
        sponsors.append({
            "id":        str(u["_id"]),
            "name":      decrypt_data(u.get("name")) or "",
            "email":     u.get("email", ""),
            "createdAt": u.get("createdAt"),
        })
    return sponsors


@router.get("/sponsors/team")
async def list_sponsor_teams(
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all sponsor team members across all sponsors."""
    team_members = []
    async for u in db["users"].find({"role": {"$in": ["SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER"]}}).sort("createdAt", -1):
        # Resolve parent sponsor email/name for context
        sponsor_email = "Unknown"
        if u.get("parentSponsorId"):
            parent = await db["users"].find_one({"_id": ObjectId(u["parentSponsorId"])})
            if parent:
                sponsor_email = parent.get("email")

        team_members.append({
            "id":        str(u["_id"]),
            "name":      decrypt_data(u.get("name")) or "",
            "email":     u.get("email", ""),
            "role":      u.get("role", ""),
            "status":    u.get("status", "ACTIVE"),
            "parentSponsorEmail": sponsor_email,
            "assignedStudies": u.get("assignedStudies", []),
            "createdAt": u.get("createdAt"),
        })
    return team_members


@router.get("/sponsor-leads")
async def list_sponsor_leads(
    status: Optional[str] = None,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all sponsor inquiry leads."""
    query: dict = {}
    if status:
        query["status"] = status

    leads = []
    async for lead in db["leads"].find(query).sort("createdAt", -1).limit(100):
        leads.append({
            "id":           str(lead["_id"]),
            "companyName":  lead.get("companyName", ""),
            "contactEmail": lead.get("contactEmail", ""),
            "status":       lead.get("status", "NEW"),
            "studyType":    lead.get("studyType", ""),
            "createdAt":    lead.get("createdAt"),
        })
    return leads


# ─── Audit Logs ──────────────────────────────────────────────────────────────

@router.get("/audit-logs")
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = None,
    user_id: Optional[str] = None,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Full audit log access for compliance monitoring."""
    query: dict = {}
    if action:
        query["action"] = action
    if user_id:
        query["userId"] = user_id

    logs = []
    async for log in db["audit_logs"].find(query).sort("timestamp", -1).skip(skip).limit(limit):
        logs.append({
            "id":        str(log["_id"]),
            "userId":    log.get("userId", ""),
            "action":    log.get("action", ""),
            "resource":  log.get("resource", ""),
            "details":   decrypt_data(log.get("details")) if log.get("details") else "—",
            "ipAddress": log.get("ipAddress", ""),
            "timestamp": log.get("timestamp"),
        })
    total = await db["audit_logs"].count_documents(query)
    return {"logs": logs, "total": total}


# ─── System Settings ─────────────────────────────────────────────────────────

@router.get("/settings")
async def get_system_settings(
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Get global system configuration."""
    doc = await db["settings"].find_one({"_id": "global"})
    if doc:
        doc.pop("_id", None)
    return doc or {}


@router.post("/settings")
async def update_system_settings(
    body: dict,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Update global system configuration."""
    body.pop("_id", None)
    await db["settings"].update_one(
        {"_id": "global"},
        {"$set": {
            **body,
            "updatedAt": datetime.now(timezone.utc),
            "updatedBy": current_user.user_id,
        }},
        upsert=True,
    )
    return {"message": "System settings updated successfully."}


# ─── Platform Announcements ──────────────────────────────────────────────────

class AnnouncementBody(BaseModel):
    title:   str
    message: str
    target:  str = "ALL"   # ALL, ADMIN, PARTICIPANT, SPONSOR
    type:    str = "INFO"   # INFO, WARNING, CRITICAL


@router.post("/announcements")
async def create_announcement(
    body: AnnouncementBody,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Broadcast a system-wide announcement."""
    doc = {
        "title":     body.title,
        "message":   body.message,
        "target":    body.target,
        "type":      body.type,
        "createdBy": current_user.user_id,
        "createdAt": datetime.now(timezone.utc),
        "active":    True,
    }
    result = await db["announcements"].insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Announcement created."}


@router.get("/announcements")
async def list_announcements(
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all platform announcements."""
    items = []
    async for a in db["announcements"].find().sort("createdAt", -1).limit(50):
        items.append({
            "id":        str(a["_id"]),
            "title":     a.get("title", ""),
            "message":   a.get("message", ""),
            "target":    a.get("target", "ALL"),
            "type":      a.get("type", "INFO"),
            "active":    a.get("active", True),
            "createdAt": a.get("createdAt"),
        })
    return items


@router.delete("/announcements/{ann_id}")
async def delete_announcement(
    ann_id: str,
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Delete an announcement."""
    try:
        oid = ObjectId(ann_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID.")
    result = await db["announcements"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found.")
    return {"message": "Announcement deleted."}


# ─── Website Management (Other Module) ────────────────────────────────────────

@router.get("/website/staff")
async def list_website_staff(
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all staff members from the website module."""
    staff = []
    async for s in db["api_staffmember"].find().sort("display_order", 1):
        staff.append({
            "id": str(s["_id"]),
            "name": s.get("name"),
            "role": s.get("role"),
            "department": s.get("department"),
            "order": s.get("display_order"),
            "isActive": s.get("is_active", True)
        })
    return staff

@router.get("/website/inquiries")
async def list_website_inquiries(
    type: str = "FACILITY", # FACILITY, CONTACT, JOB
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List inquiries from the website module."""
    coll_map = {
        "FACILITY": "api_facilityinquiry",
        "CONTACT": "api_contactinquiry",
        "JOB": "api_jobapplication"
    }
    coll_name = coll_map.get(type.upper(), "api_facilityinquiry")
    
    inquiries = []
    async for i in db[coll_name].find().sort("created_at", -1).limit(100):
        inquiries.append({
            "id": str(i["_id"]),
            "name": i.get("name") or i.get("full_name"),
            "email": i.get("email"),
            "subject": i.get("subject") or i.get("facility_name"),
            "message": i.get("message") or i.get("description"),
            "createdAt": i.get("created_at"),
            "status": i.get("status", "NEW")
        })
    return inquiries

@router.get("/website/subscribers")
async def list_website_subscribers(
    current_user=Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List newsletter subscribers from the website module."""
    subscribers = []
    async for s in db["api_newslettersubscriber"].find().sort("created_at", -1):
        subscribers.append({
            "id": str(s["_id"]),
            "email": s.get("email"),
            "active": s.get("is_active", True),
            "createdAt": s.get("created_at")
        })
    return subscribers
