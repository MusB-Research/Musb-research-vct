from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, BackgroundTasks, File, UploadFile, Form
from pydantic import BaseModel
import re
import jwt
import json as _json
from bson import ObjectId

from app.database import get_db
from app.auth import get_current_user, create_access_token, decode_token, get_password_hash
from app.models import StudyCreate, StudyOut, TeamMemberInvite, TeamMemberUpdate, TeamMemberSetPassword, TeamMemberOut
from app.utils.security import encrypt_data, decrypt_data, validate_password
from app.utils.email import notify_admin_new_study_inquiry, notify_team_invitation
from app.config import get_settings

router = APIRouter(prefix="/api/sponsor", tags=["Sponsor"])


class SponsorStudyOut(BaseModel):
    id: str
    title: str
    status: str
    participantCount: int
    enrolledCount: int
    completedCount: int
    condition: Optional[str] = None
    createdAt: datetime


class SponsorStatsOut(BaseModel):
    totalStudies: int
    activeStudies: int
    totalParticipants: int
    enrolledParticipants: int
    completionRate: float


# ─── Sponsor: Dashboard Stats ─────────────────────────────────────────────────

@router.get("/stats", response_model=SponsorStatsOut)
async def sponsor_stats(
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    """Sponsor: aggregate dashboard KPIs."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER", "ADMIN", "COORDINATOR"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Determine query base for studies
    query = {}
    if current_user.role in ("SPONSOR", "SPONSOR_ADMIN"):
        sponsor_id = getattr(current_user, "parent_sponsor_id", None) or current_user.user_id
        query["sponsorId"] = sponsor_id
    elif current_user.role in ("STUDY_MANAGER", "VIEWER"):
        user = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
        assigned_studies = user.get("assignedStudies", [])
        query["_id"] = {"$in": [ObjectId(sid) for sid in assigned_studies if ObjectId.is_valid(sid)]}

    # Count from both VCT and API Study collections
    total_studies = await db["studies"].count_documents(query) + await db["api_study"].count_documents(query)
    
    active_query = query.copy()
    # Support both case variations
    active_query["status"] = {"$in": ["ACTIVE", "RECRUITING", "Recruiting", "Active"]}
    active_studies = await db["studies"].count_documents(active_query) + await db["api_study"].count_documents(active_query)
    
    # Find all acceptable study IDs for this sponsor
    allowed_study_ids = set()
    async for s in db["studies"].find(query, {"_id": 1}):
        allowed_study_ids.add(str(s["_id"]))
    async for s in db["api_study"].find(query, {"_id": 1}):
        allowed_study_ids.add(str(s["_id"]))

    participant_query = {"studyId": {"$in": list(allowed_study_ids)}}

    total_participants = await db["participants"].count_documents(participant_query)
    
    enrolled_query = {"studyId": {"$in": list(allowed_study_ids)}, "status": {"$in": ["ENROLLED", "ACTIVE", "COMPLETED"]}}
    enrolled = await db["participants"].count_documents(enrolled_query)
    
    completed_query = {"studyId": {"$in": list(allowed_study_ids)}, "status": "COMPLETED"}
    completed = await db["participants"].count_documents(completed_query)
    
    completion_rate = round((completed / total_participants * 100) if total_participants > 0 else 0, 1)

    return SponsorStatsOut(
        totalStudies=total_studies,
        activeStudies=active_studies,
        totalParticipants=total_participants,
        enrolledParticipants=enrolled,
        completionRate=completion_rate,
    )


# ─── Sponsor: Studies Overview ────────────────────────────────────────────────

@router.get("/studies", response_model=List[SponsorStudyOut])
async def sponsor_studies(
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    """Sponsor: list all studies with participant counts."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER", "ADMIN", "COORDINATOR"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Determine query base for studies
    query = {}
    if current_user.role in ("SPONSOR", "SPONSOR_ADMIN"):
        sponsor_id = getattr(current_user, "parent_sponsor_id", None) or current_user.user_id
        query["sponsorId"] = sponsor_id
    elif current_user.role in ("STUDY_MANAGER", "VIEWER"):
        user = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
        assigned_studies = user.get("assignedStudies", [])
        query["_id"] = {"$in": [ObjectId(sid) for sid in assigned_studies if ObjectId.is_valid(sid)]}

    result = []
    
    # 1. Fetch from studies (Module A)
    async for study in db["studies"].find(query).sort("createdAt", -1).limit(50):
        study_id = str(study["_id"])
        total = await db["participants"].count_documents({"studyId": study_id})
        enrolled = await db["participants"].count_documents({
            "studyId": study_id,
            "status": {"$in": ["ENROLLED", "ACTIVE", "COMPLETED"]}
        })
        completed = await db["participants"].count_documents({
            "studyId": study_id,
            "status": "COMPLETED"
        })
        result.append(SponsorStudyOut(
            id=study_id,
            title=study["title"],
            status=study.get("status", "DRAFT"),
            participantCount=total,
            enrolledCount=enrolled,
            completedCount=completed,
            condition=study.get("condition"),
            createdAt=study.get("createdAt", datetime.now(timezone.utc)),
        ))

    # 2. Fetch from api_study (Module B)
    # Avoid duplicates if some IDs overlap for some reason (rare but safe)
    existing_ids = {s.id for s in result}
    async for study in db["api_study"].find(query).sort("created_at", -1).limit(50):
        study_id = str(study["_id"])
        if study_id in existing_ids: continue
        
        total = await db["participants"].count_documents({"studyId": study_id})
        enrolled = await db["participants"].count_documents({
            "studyId": study_id,
            "status": {"$in": ["ENROLLED", "ACTIVE", "COMPLETED"]}
        })
        completed = await db["participants"].count_documents({
            "studyId": study_id,
            "status": "COMPLETED"
        })
        result.append(SponsorStudyOut(
            id=study_id,
            title=study["title"],
            status=study.get("status", "Recruiting"),
            participantCount=total,
            enrolledCount=enrolled,
            completedCount=completed,
            condition=study.get("condition"),
            createdAt=study.get("created_at", datetime.now(timezone.utc)),
        ))

    # Sort combined result by createdAt descending
    result.sort(key=lambda x: x.createdAt, reverse=True)
    return result[:50]


# ─── Sponsor: Launch New Study ────────────────────────────────────────────────

@router.post("/studies", response_model=StudyOut)
async def launch_study(
    study_in: StudyCreate,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor: create or launch a new study."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "ADMIN", "COORDINATOR"):
        raise HTTPException(status_code=403, detail="Only sponsors, coordinators, or admins can launch studies")

    # Generate slug from title if it looks like a placeholder
    slug = study_in.slug
    if not slug or slug == "auto":
        slug = re.sub(r'[^a-zA-Z0-9]', '-', study_in.title.lower()).strip('-')
        # Check uniqueness
        existing = await db["studies"].find_one({"slug": slug})
        if existing:
            slug = f"{slug}-{int(datetime.now().timestamp())}"

    doc = study_in.model_dump()
    doc["slug"] = slug
    doc["sponsorId"] = getattr(current_user, "parent_sponsor_id", None) or current_user.user_id
    doc["createdAt"] = datetime.now(timezone.utc)
    doc["updatedAt"] = datetime.now(timezone.utc)

    # ── Map for Module B (api_study) schema ──
    doc["created_at"] = doc["createdAt"]
    doc["updated_at"] = doc["updatedAt"]
    doc["is_active"] = True  # Sponsor requested it to show directly on main website
    
    # Map status to something consistent with website
    orig_status = doc.get("status")
    if orig_status == "ACTIVE":
        doc["status"] = "Recruiting"
    elif orig_status == "PUBLISHED":
        doc["status"] = "Recruiting"
    elif orig_status == "UNDER_REVIEW":
        doc["status"] = "Under Review"

    # Insert into api_study as per user request (unified source for website)
    result = await db["api_study"].insert_one(doc)
    created = await db["api_study"].find_one({"_id": result.inserted_id})
    
    # Also notify admin if it's an inquiry
    is_inquiry = orig_status in ("PUBLISHED", "UNDER_REVIEW")
    
    # Send Notification to Admin if it's a new inquiry
    if is_inquiry:
        settings = get_settings()
        admin_email = settings.SMTP_EMAIL # Default to system email for admin
        
        # Fetch sponsor name from DB
        sponsor_name = "A Sponsor"
        user_doc = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
        if user_doc:
            try:
                sponsor_name = decrypt_data(user_doc.get("name")) or "A Sponsor"
            except Exception:
                sponsor_name = "A Sponsor"

        # Save in-app notification for all admins to see on the bell icon
        study_title = study_in.title
        await db["notifications"].insert_one({
            "userId": "ADMIN",  # special target: all admin users see this
            "title": f"New Study Inquiry: {study_title}",
            "content": f"Sponsor {sponsor_name} ({current_user.email}) has submitted a study inquiry and is awaiting approval.",
            "type": "STUDY_INQUIRY",
            "status": "UNREAD",
            "studyId": str(result.inserted_id),
            "createdAt": doc["createdAt"],
        })

        # Pass the full study_details dict (not just study_title string)
        background_tasks.add_task(
            notify_admin_new_study_inquiry,
            admin_email=admin_email,
            sponsor_name=sponsor_name,
            sponsor_email=current_user.email,
            study_details=study_in.model_dump()
        )

    # Map _id to id for response
    created["id"] = str(created.pop("_id"))
    return created


@router.get("/studies/{slug}", response_model=StudyOut)
async def get_study_details(
    slug: str,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor: get full details of a study for management."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER", "ADMIN", "COORDINATOR"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Try both collections
    study = await db["api_study"].find_one({"slug": slug})
    if not study:
        study = await db["studies"].find_one({"slug": slug})
    
    if not study:
        # Fallback to ID
        from bson import ObjectId
        if ObjectId.is_valid(slug):
            obj_id = ObjectId(slug)
            study = await db["api_study"].find_one({"_id": obj_id})
            if not study:
                study = await db["studies"].find_one({"_id": obj_id})

    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    if current_user.role not in ("ADMIN", "COORDINATOR"):
        if current_user.role in ("SPONSOR", "SPONSOR_ADMIN"):
             sponsor_id = getattr(current_user, "parent_sponsor_id", None) or current_user.user_id
             if study.get("sponsorId") != sponsor_id:
                  raise HTTPException(status_code=403, detail="You do not have access to this study")
        elif current_user.role in ("STUDY_MANAGER", "VIEWER"):
             user = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
             if str(study["_id"]) not in user.get("assignedStudies", []):
                  raise HTTPException(status_code=403, detail="You are not assigned to this study")

    study["id"] = str(study.pop("_id"))
    return study


@router.patch("/studies/{slug}", response_model=StudyOut)
async def update_study(
    slug: str,
    study_update: dict,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor: update study parameters."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "STUDY_MANAGER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Insufficient permissions to edit study")

    # Find study in both collections
    study = await db["api_study"].find_one({"slug": slug})
    collection_name = "api_study"
    if not study:
        study = await db["studies"].find_one({"slug": slug})
        collection_name = "studies"
        
    if not study:
        from bson import ObjectId
        if ObjectId.is_valid(slug):
            obj_id = ObjectId(slug)
            study = await db["api_study"].find_one({"_id": obj_id})
            collection_name = "api_study"
            if not study:
                study = await db["studies"].find_one({"_id": obj_id})
                collection_name = "studies"
    
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    # Ensure it's THEIR study or they are admin
    if current_user.role != "ADMIN":
        if current_user.role in ("SPONSOR", "SPONSOR_ADMIN"):
             sponsor_id = getattr(current_user, "parent_sponsor_id", None) or current_user.user_id
             if study.get("sponsorId") != sponsor_id:
                 raise HTTPException(status_code=403, detail="You can only manage your own studies")
        elif current_user.role == "STUDY_MANAGER":
             user = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
             if str(study["_id"]) not in user.get("assignedStudies", []):
                 raise HTTPException(status_code=403, detail="You can only manage assigned studies")


    # Filter out immutable fields
    update_data = {k: v for k, v in study_update.items() if k not in ("id", "_id", "createdAt", "sponsorId")}
    update_data["updatedAt"] = datetime.now(timezone.utc)
    
    # Sync with Module B fields if updating in api_study
    if collection_name == "api_study":
        update_data["updated_at"] = update_data["updatedAt"]
        if "status" in update_data:
            if update_data["status"] == "ACTIVE": update_data["status"] = "Recruiting"
            elif update_data["status"] == "UNDER_REVIEW": update_data["status"] = "Under Review"
    
    await db[collection_name].update_one({"_id": study["_id"]}, {"$set": update_data})
    
    updated = await db[collection_name].find_one({"_id": study["_id"]})
    updated["id"] = str(updated.pop("_id"))
    return updated


# ─── Sponsor: Study Inquiry Lead ──────────────────────────────────────────────

@router.post("/lead")
async def submit_lead(
    background_tasks: BackgroundTasks,
    data: str = Form(...),
    file: UploadFile = File(None),
    current_user=Depends(get_current_user),
    db=Depends(get_db),
):
    """
    Handle sponsor study inquiry leads (Step 1 = preliminary, Step 2 = qualified).
    Supports multipart (with optional file attachment).
    """
    settings = get_settings()
    admin_email = settings.ADMIN_EMAIL

    ROUTE_MAP = {
        "Biorepository": admin_email,
        "Biomarker / Lab Support": admin_email,
        "Not Sure – Need Guidance": admin_email,
    }
    DEFAULT_ROUTE = admin_email
    LEGAL_EMAIL   = admin_email

    try:
        payload = _json.loads(data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload in 'data' field.")

    step        = payload.get("step", 1)
    nda_req     = payload.get("ndaRequested", False)
    status      = payload.get("status", "PRELIMINARY_LEAD")
    step1_data  = payload.get("step1", {})
    step2_data  = payload.get("step2", {})
    nda_info    = payload.get("ndaInfo", {})
    now         = datetime.now(timezone.utc)

    # ── Determine routing email ───────────────────────────────────────────────
    route_email = DEFAULT_ROUTE
    if nda_req:
        route_email = LEGAL_EMAIL
    else:
        needs: list = step1_data.get("need", []) + step2_data.get("services", [])
        for need in needs:
            if need in ROUTE_MAP:
                route_email = ROUTE_MAP[need]
                break

    # ── Upsert the lead record ────────────────────────────────────────────────
    existing = await db["leads"].find_one({"sponsorUserId": current_user.user_id})
    lead_doc = {
        "sponsorUserId": current_user.user_id,
        "sponsorEmail": current_user.email,
        "step": step,
        "status": status,
        "ndaRequested": nda_req,
        "ndaInfo": nda_info,
        "step1": step1_data,
        "step2": step2_data,
        "routedTo": route_email,
        "updatedAt": now,
    }

    if existing:
        await db["leads"].update_one({"_id": existing["_id"]}, {"$set": lead_doc})
        lead_id = str(existing["_id"])
    else:
        lead_doc["createdAt"] = now
        res = await db["leads"].insert_one(lead_doc)
        lead_id = str(res.inserted_id)

    # ── Store file reference if uploaded ──────────────────────────────────────
    if file and file.filename:
        file_bytes = await file.read()
        await db["leadAttachments"].insert_one({
            "leadId": lead_id,
            "filename": file.filename,
            "contentType": file.content_type,
            "size": len(file_bytes),
            "uploadedAt": now,
        })

    # ── Admin in-app notification ─────────────────────────────────────────────
    product_name = step1_data.get("productName", "Unknown Product")
    notif_title = (
        f"NDA Requested: {product_name}" if nda_req and step == 1
        else f"Qualified Lead: {product_name}" if step == 2
        else f"New Preliminary Lead: {product_name}"
    )
    await db["notifications"].insert_one({
        "userId": "ADMIN",
        "title": notif_title,
        "content": (
            f"Sponsor {current_user.email} submitted a study inquiry "
            f"(Status: {status}). Routed to {route_email}."
        ),
        "type": "LEAD_SUBMISSION",
        "status": "UNREAD",
        "leadId": lead_id,
        "createdAt": now,
    })

    # ── Send email notification ───────────────────────────────────────────────
    settings = get_settings()
    email_subject = (
        f"MUSB Research: NDA Requested — {product_name}" if nda_req and step == 1
        else f"MUSB Research: New Qualified Study Lead — {product_name}"
    )
    nda_block = ""
    if nda_req and nda_info:
        nda_block = f"""
NDA REQUEST DETAILS:
  Company: {nda_info.get('companyName')}
  Signatory: {nda_info.get('signatoryName')}, {nda_info.get('title')}
  Address: {nda_info.get('address')}
"""
    email_body = f"""
New sponsor inquiry received.

SPONSOR: {current_user.email}
STATUS: {status}
ROUTED TO: {route_email}

PRODUCT: {step1_data.get('productName')} ({step1_data.get('productCategory')})
STAGE: {step1_data.get('stage')}
HEALTH FOCUS: {step1_data.get('healthFocus')}
TIMELINE: {step1_data.get('timeline')}
NEEDS: {', '.join(step1_data.get('need', []))}
{nda_block}
BUDGET: {step2_data.get('budget', 'N/A')}
SERVICES: {', '.join(step2_data.get('services', []))}

DESCRIPTION:
{step2_data.get('description', 'Not provided (Step 1 only)')}

Lead ID: {lead_id}
"""
    from app.utils.email import send_email_notification
    background_tasks.add_task(send_email_notification, route_email, email_subject, email_body)

    return {
        "message": "Lead submitted successfully",
        "leadId": lead_id,
        "status": status,
        "routedTo": route_email,
    }


# ─── Sponsor: Team Management ──────────────────────────────────────────────────

@router.post("/team/invite")
async def invite_team_member(
    request: Request,
    invite_in: TeamMemberInvite,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor Admin: Invite a new team member."""
    # Ensure ONLY Sponsor Admin or Super Admin can invite
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "ADMIN", "SUPER_ADMIN"):
        raise HTTPException(status_code=403, detail="Insufficient permissions to manage team")
    
    # 1. Check if email is already in use globally
    existing = await db["users"].find_one({"email": invite_in.email})
    if existing:
        raise HTTPException(status_code=409, detail="This email is already registered in the system")

    now = datetime.now(timezone.utc)
    # 2. Add user to database with PENDING status
    new_user = {
        "name": encrypt_data(invite_in.name),
        "email": invite_in.email,
        "role": invite_in.role, # SPONSOR_ADMIN, STUDY_MANAGER, VIEWER
        "parentSponsorId": current_user.user_id,
        "assignedStudies": invite_in.assignedStudies,
        "status": "PENDING",
        "passwordHash": None, # Will be set during activation
        "createdAt": now,
        "updatedAt": now
    }
    result = await db["users"].insert_one(new_user)
    
    # 3. Generate 48-hour secure Invitation Token
    invite_token = create_access_token(
        data={"sub": str(result.inserted_id), "purpose": "TEAM_INVITE", "email": invite_in.email},
        expires_delta=timedelta(hours=48)
    )

    # 4. Send Invitation Email
    settings = get_settings()
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    activation_url = f"{frontend_url}/setup-password?token={invite_token}"

    # Try to get sponsor name for email
    sponsor_doc = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
    sponsor_name = decrypt_data(sponsor_doc.get("name")) if sponsor_doc else "A Sponsor"
    
    background_tasks.add_task(
        notify_team_invitation,
        user_email=invite_in.email,
        user_name=invite_in.name,
        sponsor_name=sponsor_name,
        role=invite_in.role,
        activation_url=activation_url
    )

    # 5. Audit Log
    from app.routes.audit import log_audit_event
    await log_audit_event(
        db, current_user.user_id, "TEAM_MEMBER_INVITED", f"User:{result.inserted_id}",
        f"Invited {invite_in.email} as {invite_in.role}", request
    )

    return {"message": f"Invitation sent to {invite_in.email}", "id": str(result.inserted_id)}


@router.post("/team/setup-password")
async def setup_team_password(
    request: Request,
    body: TeamMemberSetPassword,
    db=Depends(get_db)
):
    """Invited User: Set password via email link."""
    # 1. Decode token
    try:
        from app.auth import settings as auth_settings
        public_key_pem = auth_settings.PUBLIC_KEY.replace("\\n", "\n")
        payload = jwt.decode(body.token, public_key_pem, algorithms=["RS256"])
        if payload.get("purpose") != "TEAM_INVITE":
            raise HTTPException(status_code=400, detail="Invalid token purpose")
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=400, detail="This invitation link is invalid or has expired.")

    # 2. Find user
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")
    
    if user.get("status") == "ACTIVE":
        raise HTTPException(status_code=400, detail="Account is already activated. Please login.")

    # 3. Validate & Set Password and Activate
    is_valid, reason = validate_password(body.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=reason)

    hashed_pw = get_password_hash(body.password)
    now = datetime.now(timezone.utc)
    
    await db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "passwordHash": hashed_pw,
            "status": "ACTIVE",
            "emailVerified": now,
            "updatedAt": now
        }}
    )

    # 4. Audit Log
    from app.routes.audit import log_audit_event
    await log_audit_event(
        db, user_id, "TEAM_MEMBER_ACTIVATED", f"User:{user_id}",
        "Team member activated account", request
    )

    return {"message": "Account activated successfully. You can now login."}


@router.get("/team", response_model=List[TeamMemberOut])
async def list_team_members(
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor Admin: List all team members."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "ADMIN", "SUPER_ADMIN"):
         raise HTTPException(status_code=403, detail="Insufficient permissions")

    # If it's Super Admin, maybe they can pass a sponsor_id query param in the future.
    # For now, restrict to team members of the current sponsor.
    query = {"parentSponsorId": current_user.user_id}
    
    members = []
    async for u in db["users"].find(query).sort("createdAt", -1):
        members.append(
            TeamMemberOut(
                id=str(u["_id"]),
                name=decrypt_data(u.get("name")),
                email=u["email"],
                role=u["role"],
                status=u.get("status", "ACTIVE"),
                assignedStudies=u.get("assignedStudies", []),
                createdAt=u["createdAt"],
                updatedAt=u["updatedAt"]
            )
        )
    return members


@router.put("/team/{member_id}", response_model=TeamMemberOut)
async def update_team_member(
    member_id: str,
    update_in: TeamMemberUpdate,
    request: Request,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor Admin: Update a team member's role or studies."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "ADMIN", "SUPER_ADMIN"):
         raise HTTPException(status_code=403, detail="Insufficient permissions")

    user = await db["users"].find_one({"_id": ObjectId(member_id), "parentSponsorId": current_user.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Team member not found")

    update_doc = {"updatedAt": datetime.now(timezone.utc)}
    if update_in.role:
        update_doc["role"] = update_in.role
    if update_in.assignedStudies is not None:
        # Prevent assigning studies they don't own
        # Verify studies belong to sponsor (could be added as safety check)
        update_doc["assignedStudies"] = update_in.assignedStudies

    await db["users"].update_one({"_id": ObjectId(member_id)}, {"$set": update_doc})

    from app.routes.audit import log_audit_event
    await log_audit_event(
        db, current_user.user_id, "TEAM_MEMBER_UPDATED", f"User:{member_id}",
        f"Updated member details", request
    )

    updated_user = await db["users"].find_one({"_id": ObjectId(member_id)})
    return TeamMemberOut(
        id=str(updated_user["_id"]),
        name=decrypt_data(updated_user.get("name")),
        email=updated_user["email"],
        role=updated_user["role"],
        status=updated_user.get("status", "ACTIVE"),
        assignedStudies=updated_user.get("assignedStudies", []),
        createdAt=updated_user["createdAt"],
        updatedAt=updated_user["updatedAt"]
    )


@router.delete("/team/{member_id}")
async def deactivate_team_member(
    member_id: str,
    request: Request,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor Admin: Deactivate a team member."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "ADMIN", "SUPER_ADMIN"):
         raise HTTPException(status_code=403, detail="Insufficient permissions")

    user = await db["users"].find_one({"_id": ObjectId(member_id), "parentSponsorId": current_user.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Team member not found")

    # We do a soft deactivate, not a hard delete
    await db["users"].update_one(
        {"_id": ObjectId(member_id)},
        {"$set": {"status": "INACTIVE", "updatedAt": datetime.now(timezone.utc)}}
    )

    from app.routes.audit import log_audit_event
    await log_audit_event(
        db, current_user.user_id, "TEAM_MEMBER_DEACTIVATED", f"User:{member_id}",
        f"Deactivated member", request
    )

    return {"message": "Team member successfully deactivated"}


@router.get("/participants", response_model=List[dict])
async def list_deidentified_participants(
    study_id: Optional[str] = Query(None),
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Sponsor: List de-identified participant data for their studies."""
    if current_user.role not in ("SPONSOR", "SPONSOR_ADMIN", "STUDY_MANAGER", "VIEWER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Determine allowed study IDs
    sponsor_id = getattr(current_user, "parent_sponsor_id", None) or current_user.user_id
    allowed_study_ids = set()
    
    study_query = {}
    if current_user.role in ("SPONSOR", "SPONSOR_ADMIN"):
        study_query["sponsorId"] = sponsor_id
    elif current_user.role in ("STUDY_MANAGER", "VIEWER"):
        user = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
        assigned_studies = user.get("assignedStudies", [])
        study_query["_id"] = {"$in": [ObjectId(sid) for sid in assigned_studies if ObjectId.is_valid(sid)]}
    
    async for s in db["studies"].find(study_query, {"_id": 1}):
        allowed_study_ids.add(str(s["_id"]))
    async for s in db["api_study"].find(study_query, {"_id": 1}):
        allowed_study_ids.add(str(s["_id"]))

    if study_id:
        if study_id not in allowed_study_ids:
            raise HTTPException(status_code=403, detail="Access denied to this study")
        participant_query = {"studyId": study_id}
    else:
        participant_query = {"studyId": {"$in": list(allowed_study_ids)}}

    participants = []
    async for p in db["participants"].find(participant_query).sort("createdAt", -1).limit(200):
        # Scrub PII
        p_id_str = str(p["_id"])
        anon_id = f"P-{p_id_str[:4].upper()}-{p_id_str[-4:].upper()}"
        
        # Calculate progress
        completed = await db["taskInstances"].count_documents({"participantId": p_id_str, "status": "COMPLETED"})
        total = await db["taskInstances"].count_documents({"participantId": p_id_str})
        progress = int((completed / max(total, 1) * 100) if total > 0 else 0)

        # Get ARM name
        arm_name = "Not Assigned"
        arm_id = p.get("armId")
        if arm_id:
            # Need to find study to get arm name
            p_study_id = p.get("studyId")
            if p_study_id:
                p_study = await db["studies"].find_one({"_id": ObjectId(p_study_id)}) or await db["api_study"].find_one({"_id": ObjectId(p_study_id)})
                if p_study and "arms" in p_study:
                    for arm in p_study["arms"]:
                        if str(arm.get("id")) == str(arm_id):
                            arm_name = arm.get("name")
                            break

        participants.append({
            "id": anon_id,
            "status": p.get("status", "LEAD"),
            "progress": progress,
            "arm": arm_name,
            "createdAt": p.get("createdAt"),
            "lastVisit": p.get("updatedAt").strftime("%b %d, %Y") if p.get("updatedAt") else "N/A",
            # demographics are intentionally excluded/masked for sponsor de-identification
        })
    
    return participants

