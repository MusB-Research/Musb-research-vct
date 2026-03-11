from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId

from app.database import get_db
from app.models import StudyCreate, StudyOut, StudyStatus
from app.auth import require_admin, get_current_user

router = APIRouter(prefix="/api/studies", tags=["Studies"])


def _map_study(doc: dict) -> StudyOut:
    return StudyOut(
        id=str(doc["_id"]),
        title=doc.get("title", "Untitled Study"),
        slug=doc.get("slug", ""),
        description=doc.get("description", ""),
        shortDescription=doc.get("shortDescription"),
        internalCode=doc.get("internalCode"),
        coordinatorId=doc.get("coordinatorId"),
        condition=doc.get("condition"),
        location=doc.get("location"),
        locationType=doc.get("locationType", "Remote"),
        duration=doc.get("duration"),
        durationUnit=doc.get("durationUnit", "weeks"),
        timeCommitment=doc.get("timeCommitment"),
        minAge=doc.get("minAge", 18),
        maxAge=doc.get("maxAge", 100),
        gender=doc.get("gender", "All"),
        inclusionCriteria=doc.get("inclusionCriteria"),
        exclusionCriteria=doc.get("exclusionCriteria"),
        targetParticipants=doc.get("targetParticipants", 100),
        regions=doc.get("regions") if isinstance(doc.get("regions"), list) else ["Global"],
        activities=doc.get("activities") if isinstance(doc.get("activities"), list) else [],
        isPaid=doc.get("isPaid", False),
        compensation=doc.get("compensation"),
        compensationAmount=doc.get("compensationAmount"),
        compensationCurrency=doc.get("compensationCurrency", "USD"),
        compensationDescription=doc.get("compensationDescription"),
        status=doc.get("status", "DRAFT"),
        overview=doc.get("overview"),
        timeline=doc.get("timeline") if isinstance(doc.get("timeline"), list) else [],
        kits=doc.get("kits"),
        safety=doc.get("safety"),
        designType=doc.get("designType", "Parallel"),
        arms=doc.get("arms") if isinstance(doc.get("arms"), list) else [],
        eligibilityRules=doc.get("eligibilityRules") if isinstance(doc.get("eligibilityRules"), list) else [],
        timepoints=doc.get("timepoints") if isinstance(doc.get("timepoints"), list) else [],
        assessmentIds=doc.get("assessmentIds") if isinstance(doc.get("assessmentIds"), list) else [],
        randomizationEnabled=doc.get("randomizationEnabled", False),
        kitType=doc.get("kitType"),
        shippingRules=doc.get("shippingRules"),
        kitDetails=doc.get("kitDetails"),
        instructions=doc.get("instructions"),
        returnLabelRequired=doc.get("returnLabelRequired", True),
        safetyAlertsEnabled=doc.get("safetyAlertsEnabled", True),
        immediateNotificationSeverity=doc.get("immediateNotificationSeverity", "SEVERE"),
        country=doc.get("country", "Global"),
        consentLanguages=doc.get("consentLanguages") if isinstance(doc.get("consentLanguages"), dict) else {},
        createdAt=doc.get("createdAt", datetime.now(timezone.utc)),
    )


@router.get("", response_model=List[StudyOut])
async def list_studies(
    status: Optional[str] = Query(None, description="Filter by status"),
    condition: Optional[str] = Query(None),
    db=Depends(get_db)
):
    """Public endpoint: list all publicly visible studies from both modules."""
    
    # 1. Fetch from Module A (VCT 'studies')
    query: dict = {"status": {"$in": ["ACTIVE", "RECRUITING", "OPEN"]}}
    if status:
        query["status"] = status
    if condition:
        query["condition"] = {"$regex": condition, "$options": "i"}

    studies = []
    
    # Module A: Fetch
    cursor = db["studies"].find(query).sort("createdAt", -1).limit(50)
    async for doc in cursor:
        try:
            studies.append(_map_study(doc))
        except Exception as e:
            print(f"Warning: Mapping error in 'studies' doc {doc.get('_id')}: {str(e)}")

    # 2. Fetch from Module B (Website 'api_study')
    # Use 'is_active: True' for public website visibility regardless of status string
    api_query = {"is_active": True}
    if condition:
        api_query["condition"] = {"$regex": condition, "$options": "i"}
        
    cursor = db["api_study"].find(api_query).sort("created_at", -1).limit(50)
    async for doc in cursor:
        try:
            # Map Website specific fields to our unified StudyOut model
            mapped = StudyOut(
                id=str(doc["_id"]),
                title=doc.get("title", "Untitled"),
                slug=doc.get("slug") or str(doc["_id"]),
                description=doc.get("description", ""),
                condition=doc.get("condition", ""),
                location=doc.get("location", ""),
                duration=doc.get("duration", ""),
                status=doc.get("status", "RECRUITING").upper(),
                createdAt=doc.get("created_at") or datetime.now(timezone.utc),
                targetParticipants=doc.get("targetParticipants", 0),
                compensation=doc.get("compensation_range", "Available"),
                isPaid=doc.get("is_paid", False)
            )
            studies.append(mapped)
        except Exception as e:
             print(f"Warning: Mapping error in 'api_study' doc {doc.get('_id')}: {str(e)}")

    return studies


@router.get("/{study_id}", response_model=StudyOut)
async def get_study(study_id: str, db=Depends(get_db)):
    """Get a single study by ID or slug from either module's collection."""
    is_oid = ObjectId.is_valid(study_id)
    query = {"_id": ObjectId(study_id)} if is_oid else {"slug": study_id}
    
    # 1. Check Module A
    doc = await db["studies"].find_one(query)
    if doc:
        return _map_study(doc)
        
    # 2. Check Module B
    # Website module might use 'slug' or string '_id' sometimes, but we handle as OID if valid
    doc = await db["api_study"].find_one(query)
    if doc:
        return StudyOut(
            id=str(doc["_id"]),
            title=doc.get("title", "Untitled"),
            slug=doc.get("slug") or str(doc["_id"]),
            description=doc.get("description", ""),
            condition=doc.get("condition", ""),
            location=doc.get("location", ""),
            duration=doc.get("duration", ""),
            status=doc.get("status", "RECRUITING").upper(),
            createdAt=doc.get("created_at") or datetime.now(timezone.utc),
            targetParticipants=doc.get("targetParticipants", 0),
            compensation=doc.get("compensation_range", "Available"),
            isPaid=doc.get("is_paid", False)
        )
        
    raise HTTPException(status_code=404, detail="Study not found")


@router.post("/", response_model=StudyOut, status_code=status.HTTP_201_CREATED)
async def create_study(
    study_in: StudyCreate,
    current_user=Depends(require_admin),
    db=Depends(get_db)
):
    """Admin only: Create a new study."""
    now = datetime.now(timezone.utc)
    doc = study_in.model_dump()
    doc["createdAt"] = now
    doc["updatedAt"] = now
    doc["createdBy"] = current_user.user_id
    result = await db["studies"].insert_one(doc)
    created = await db["studies"].find_one({"_id": result.inserted_id})
    return _map_study(created)


@router.patch("/{study_id}", response_model=StudyOut)
async def update_study(
    study_id: str,
    updates: dict,
    current_user=Depends(require_admin),
    db=Depends(get_db)
):
    """Admin only: Update a study."""
    if not ObjectId.is_valid(study_id):
        raise HTTPException(status_code=400, detail="Invalid study ID")
    updates["updatedAt"] = datetime.now(timezone.utc)
    await db["studies"].update_one(
        {"_id": ObjectId(study_id)},
        {"$set": updates}
    )
    doc = await db["studies"].find_one({"_id": ObjectId(study_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Study not found")
    return _map_study(doc)


    return {"status": "success", "message": "Study deleted"}


@router.patch("/{study_id}/status")
async def update_study_status(
    study_id: str,
    body: dict, # {"status": "...", "manualOverrideActive": bool}
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """
    Global Study Lifecycle Hook (Ref Spec 2.1, 2.2)
    Allows Super Admin, PI, and Clinical Coordinators to change status.
    Sponsor can view (via GET) but not change.
    """
    if not ObjectId.is_valid(study_id):
        raise HTTPException(status_code=400, detail="Invalid study ID")
    
    oid = ObjectId(study_id)
    study = await db["studies"].find_one({"_id": oid})
    if not study:
         study = await db["api_study"].find_one({"_id": oid})
         if not study:
             raise HTTPException(status_code=404, detail="Study not found")

    # 1. Role-based Permission Check (Spec 2.2)
    user_role = current_user.role
    user_id = current_user.user_id
    
    is_authorized = False
    if user_role in ("SUPER_ADMIN", "ADMIN"):
        is_authorized = True
    elif user_role == "PI":
        # Check if user is in piIds
        if user_id in study.get("piIds", []):
            is_authorized = True
    elif user_role == "COORDINATOR":
        # Check if user is primary coordinator or in coordinatorIds
        if user_id == study.get("coordinatorId") or user_id in study.get("coordinatorIds", []):
            is_authorized = True
    
    if not is_authorized:
        raise HTTPException(
            status_code=403, 
            detail="Access Denied: You do not have permission to change this study's status."
        )

    # 2. Update Status
    new_status = body.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status field is required")
        
    update_doc = {
        "status": new_status,
        "updatedAt": datetime.now(timezone.utc),
        "updatedBy": user_id
    }
    
    # Handle manual override logic (Spec 2.3)
    if "manualOverrideActive" in body:
        update_doc["manualOverrideActive"] = body["manualOverrideActive"]

    # Sync with Website Module (is_active toggle)
    is_active_for_website = new_status.upper() in ["ACTIVE", "RECRUITING", "RECRUITMENT COMPLETED", "OPEN"]
    
    # Update both potential collections for consistency
    await db["studies"].update_one({"_id": oid}, {"$set": update_doc})
    
    # Also update api_study if it exists
    website_updates = {**update_doc, "is_active": is_active_for_website}
    if "updatedAt" in website_updates:
        website_updates["updated_at"] = website_updates.pop("updatedAt")
        
    await db["api_study"].update_one({"_id": oid}, {"$set": website_updates})

    return {
        "message": f"Study status updated to {new_status}",
        "authorized_as": user_role
    }
