from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from app.utils.rate_limit import rate_limit_check
from bson import ObjectId

from app.database import get_db
from app.models import (
    UserCreate, UserOut, Token, VerificationRequest, VerificationCheck, 
    UpdatePassword, PasswordResetRequest, ResetLinkRequest, PasswordResetConfirm
)
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    get_modules_for_role,
)
from app.config import get_settings
from app.routes.audit import log_audit_event
from app.utils.security import encrypt_data, decrypt_data, validate_password
from app.utils.otp import generate_otp, verify_otp
from app.utils.email import send_email_notification
from app.utils.tokens import generate_secure_token, hash_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(request: Request, user_in: UserCreate, db=Depends(get_db)):
    """Register a new participant account and return an access token immediately."""
    # Rate limiting: max 3 registration attempts per hour
    await rate_limit_check(request, "/api/auth/register")

    email = user_in.email.lower().strip()
    # Check duplicate email
    existing = await db["users"].find_one({"email": email})
    if existing:
        # HIPAA Audit: Log failed registration attempt
        await log_audit_event(
            db=db,
            user_id="SYSTEM",
            action="REGISTER_FAILED",
            resource="System:Auth",
            details=f"Registration failed: Email {email} already exists",
            request=request
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    # Section 5.4: Device fingerprinting / Duplicate prevention
    if user_in.deviceFingerprint:
        fp_exists = await db["users"].find_one({"deviceFingerprint": user_in.deviceFingerprint})
        if fp_exists:
             await log_audit_event(
                db=db,
                user_id="SYSTEM",
                action="REGISTER_REJECTED",
                resource="System:Auth",
                details=f"Registration rejected: Duplicate device fingerprint detected",
                request=request
            )
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate registration attempt detected from this device."
            )

    # Section 5: Password Complexity Validation
    is_valid, reason = validate_password(user_in.password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=reason)

    now = datetime.now(timezone.utc)
    user_doc = {
        "name": encrypt_data(user_in.name),
        "email": email,
        "passwordHash": get_password_hash(user_in.password),
        "role": "PARTICIPANT",
        "deviceFingerprint": user_in.deviceFingerprint,
        "createdAt": now,
        "updatedAt": now,
    }
    result = await db["users"].insert_one(user_doc)
    created = await db["users"].find_one({"_id": result.inserted_id})

    import asyncio
    async def _create_profile():
        await db["participants"].insert_one({
            "userId": str(result.inserted_id),
            "status": "LEAD",
            "timezone": "UTC",
            "createdAt": now,
            "updatedAt": now,
        })
    async def _audit():
        await log_audit_event(
            db=db,
            user_id=str(result.inserted_id),
            action="REGISTER",
            resource="System:Auth",
            details="New participant account created",
            request=request
        )
    # Run participant profile creation + audit log in parallel (non-blocking)
    asyncio.create_task(_create_profile())
    asyncio.create_task(_audit())

    # Return a token immediately so the frontend can log the user in right away
    token = create_access_token(data={
        "sub": str(result.inserted_id),
        "email": email,
        "role": "PARTICIPANT",
        "name": user_in.name,
        "modules": get_modules_for_role("PARTICIPANT"),
    })

    return Token(
        access_token=token,
        token_type="bearer",
        role="PARTICIPANT",
        id=str(result.inserted_id),
        name=user_in.name,
        email=email,
    )

@router.post("/login", response_model=Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    """Login with email and password, returns a JWT access token."""
    # Rate limiting: max 5 attempts per 15 minutes
    await rate_limit_check(request, "/api/auth/login")

    # Step 1: User Lookup (Rapid with email index)
    email = form_data.username.lower().strip()
    user = await db["users"].find_one({"email": email})
    
    # Step 2: Handle "User Not Found" fast
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Step 3: Password Work (Costly)
    password_hash = user.get("passwordHash")
    if not password_hash or not verify_password(form_data.password, password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "name": decrypt_data(user.get("name")),  # Bug fix: include name in token
        "modules": get_modules_for_role(user["role"]),
        "parent_sponsor_id": user.get("parentSponsorId"),
    })
    
    # HIPAA Audit: Log only successful login to avoid DB bloat
    await log_audit_event(
        db=db,
        user_id=str(user["_id"]),
        action="LOGIN_SUCCESS",
        resource="System:Auth",
        details="User logged in via Password",
        request=request
    )

    return Token(
        access_token=token, 
        token_type="bearer", 
        role=user["role"],
        id=str(user["_id"]),
        name=decrypt_data(user.get("name")),
        email=email,
        parent_sponsor_id=user.get("parentSponsorId")
    )


@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user), db=Depends(get_db)):
    """Get the currently authenticated user's profile."""
    user = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=str(user["_id"]),
        name=decrypt_data(user.get("name")),
        email=user["email"],
        role=user["role"],
        createdAt=user["createdAt"],
    )


# ─── Google OAuth Upsert ─────────────────────────────────────────────────────

class GoogleUpsertRequest(BaseModel):
    email: str
    name: Optional[str] = None
    googleId: Optional[str] = None
    image: Optional[str] = None


class GoogleUpsertResponse(BaseModel):
    id: str
    name: Optional[str]
    email: str
    role: str
    access_token: Optional[str] = None


@router.post("/google-upsert", response_model=GoogleUpsertResponse)
async def google_upsert(request: Request, body: GoogleUpsertRequest, db=Depends(get_db)):
    """
    Called by NextAuth after a successful Google sign-in.
    Finds an existing user by email or creates a new PARTICIPANT account.
    Returns the user's id and role so NextAuth can populate the session.
    """
    now = datetime.now(timezone.utc)
    email = body.email.lower().strip()
    user = await db["users"].find_one({"email": email})

    if not user:
        # First-time Google login — create a new user
        user_doc = {
            "name": encrypt_data(body.name),
            "email": email,
            "googleId": body.googleId,
            "image": body.image,
            "role": "PARTICIPANT",
            "passwordHash": None,
            "emailVerified": now,
            "createdAt": now,
            "updatedAt": now,
        }
        result = await db["users"].insert_one(user_doc)
        user = await db["users"].find_one({"_id": result.inserted_id})

        # Auto-create participant profile
        await db["participants"].insert_one({
            "userId": str(user["_id"]),
            "status": "LEAD",
            "timezone": "UTC",
            "createdAt": now,
            "updatedAt": now,
        })
    else:
        # Update Google metadata on repeat logins
        await db["users"].update_one(
            {"_id": user["_id"]},
            {"$set": {
                "googleId": body.googleId,
                "image": body.image,
                "updatedAt": now,
            }}
        )
        # Bug fix: ensure participant profile exists for returning Google users
        # (profile may have been missing if they were created by an admin import)
        existing_profile = await db["participants"].find_one({"userId": str(user["_id"])})
        if not existing_profile:
            await db["participants"].insert_one({
                "userId": str(user["_id"]),
                "status": "LEAD",
                "timezone": "UTC",
                "createdAt": now,
                "updatedAt": now,
            })

    
    # HIPAA Audit: Log Google Login
    await log_audit_event(
        db=db,
        user_id=str(user["_id"]),
        action="LOGIN",
        resource="System:Auth",
        details="User logged in via Google OAuth",
        request=request
    )

    # Generate access token so NextAuth can use it for subsequent API calls
    access_token = create_access_token(
        data={
            "sub": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "PARTICIPANT"),
            "modules": get_modules_for_role(user.get("role", "PARTICIPANT")),
            "parent_sponsor_id": user.get("parentSponsorId"),
        }
    )

    return GoogleUpsertResponse(
        id=str(user["_id"]),
        name=decrypt_data(user.get("name")),
        email=user["email"],
        role=user.get("role", "PARTICIPANT"),
        access_token=access_token
    )

# ─── Identity Verification (OTP) ──────────────────────────────────────────────

@router.post("/verify/send")
async def send_verification(request: Request, body: VerificationRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    """Send a verification code via Email or Phone."""
    # Rate limiting: max 5 OTP sends per hour
    await rate_limit_check(request, "/api/auth/verify/send")

    # Check user existence based on action purpose
    user = await db["users"].find_one({"email": body.identifier})

    if body.purpose == "LOGIN":
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Account not found. Please sign up or sign in with Google."
            )
    elif body.purpose == "REGISTER":
        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account already exists. Please sign in instead."
            )
    elif body.purpose == "RESET":
        # We redirect this to the magic link flow instead for better security
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password resets must use the Magic Link flow."
        )

    otp = generate_otp(body.identifier, body.purpose)
    
    channel = "Phone" if body.type == "PHONE" else "Email"
    if channel == "Email":
        subject = f"Your MUSB {body.purpose.title()} Verification Code"
        email_body = f"Hello,\n\nYour 8-character verification code for {body.purpose.lower()} is: {otp}\n\nPlease enter this code to securely proceed. This code will expire in 10 minutes.\n\nBest,\nThe MUSB Research Team"
        background_tasks.add_task(send_email_notification, body.identifier, subject, email_body)
    # Phone SMS sending can be implemented here when SMS provider is configured
    
    await log_audit_event(
        db=db,
        user_id="SYSTEM",
        action="VERIFY_SEND",
        resource=f"Identity:{body.identifier}",
        details=f"OTP sent via {channel} (Purpose: {body.purpose})",
        request=request
    )
    
    return {"message": f"Verification code sent to {body.identifier}"}


@router.post("/verify/check")
async def check_verification(request: Request, body: VerificationCheck, db=Depends(get_db)):
    """Check a verification code and update user/participant status."""
    # Rate limiting: max 10 OTP checks per 15 minutes (allow some failed attempts)
    await rate_limit_check(request, "/api/auth/verify/check")

    is_valid = verify_otp(body.identifier, body.code, body.purpose)

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")

    now = datetime.now(timezone.utc)
    
    # Bug fix: only update emailVerified for LOGIN/RESET purposes.
    # For REGISTER, the user doesn't exist yet at verify/check time.
    if body.purpose in ("LOGIN", "RESET"):
        user = await db["users"].find_one({"email": body.identifier})
        if user:
            await db["users"].update_one(
                {"_id": user["_id"]},
                {"$set": {"emailVerified": now, "updatedAt": now}}
            )
    
    # Check if it's a phone number (identifier doesn't have @)
    if "@" not in body.identifier:
        participant = await db["participants"].find_one({"phone": encrypt_data(body.identifier)})
        if participant:
            await db["participants"].update_one(
                {"_id": participant["_id"]},
                {"$set": {"phoneVerified": now, "updatedAt": now}}
            )

    await log_audit_event(
        db=db,
        user_id="SYSTEM",
        action="VERIFY_SUCCESS",
        resource=f"Identity:{body.identifier}",
        details="Identity verified successfully",
        request=request
    )

    return {"message": "Identity verified successfully"}


@router.post("/update-password")
async def update_password(
    request: Request,
    body: UpdatePassword,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Securely update the user's password with current password verification and optional OTP."""
    user = await db["users"].find_one({"_id": ObjectId(current_user.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Block OAuth users from direct password manipulation
    if not user.get("passwordHash"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Accounts managed via Google cannot update passwords directly. Please use Google Account settings."
        )

    # Block only pure internal platform roles from this endpoint
    # Sponsors are external users who should be able to update their own passwords
    internal_only_roles = {"ADMIN", "SUPER_ADMIN", "COORDINATOR", "PI", "DATA_MANAGER"}
    if user.get("role") in internal_only_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator password management must be handled by the system administrator."
        )

    # Verify Current Password
    if not verify_password(body.currentPassword, user["passwordHash"]):
         raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED, 
             detail="Current password incorrect."
         )

    # Optional OTP Verification for high-security action
    if body.code:
        if not verify_otp(user["email"], body.code, "LOGIN"):
             raise HTTPException(
                 status_code=status.HTTP_400_BAD_REQUEST, 
                 detail="Invalid or expired verification code."
             )

    # Update Password (with strength check)
    is_valid, reason = validate_password(body.newPassword)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=reason)

    new_hash = get_password_hash(body.newPassword)
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {
            "passwordHash": new_hash, 
            "updatedAt": datetime.now(timezone.utc),
            "emailVerified": datetime.now(timezone.utc) # Mark verified as side effect of successful path
        }}
    )

    # HIPAA Audit
    await log_audit_event(
        db=db,
        user_id=str(user["_id"]),
        action="PASSWORD_UPDATE",
        resource="User:Credentials",
        details="User successfully updated account password securely",
        request=request
    )

    return {"message": "Password updated successfully."}


@router.post("/forgot-password")
async def forgot_password(request: Request, body: ResetLinkRequest, background_tasks: BackgroundTasks, db=Depends(get_db)):
    """Generate a magic link for password reset if account exists. Generic response for security."""
    await rate_limit_check(request, "/api/auth/forgot-password")

    email = body.email.lower().strip()
    user = await db["users"].find_one({"email": email})
    message = "If an account exists for this email, we've sent a password reset link."
    
    if user:
        # Security: Only block pure internal platform admin roles
        # Sponsors are external users who need self-service password reset
        internal_only_roles = {"ADMIN", "SUPER_ADMIN", "COORDINATOR", "PI", "DATA_MANAGER"}
        if user.get("role") in internal_only_roles:
            return {"message": message}

        # 1. Invalidate old tokens
        await db["password_reset_tokens"].update_many({"email": email, "used": False}, {"$set": {"used": True}})

        # 2. Generate secure token
        raw_token = generate_secure_token()
        hashed_token = hash_token(raw_token)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

        # 3. Store hashed token
        await db["password_reset_tokens"].insert_one({
            "hashed_token": hashed_token,
            "email": email,
            "expires_at": expires_at,
            "used": False,
            "createdAt": datetime.now(timezone.utc)
        })

        # 4. Construct Link
        app_url = get_settings().FRONTEND_URL or "http://localhost:3000"
        reset_url = f"{app_url}/reset-password?token={raw_token}"

        # 5. Send Email
        subject = "Reset Your Password"
        email_body = f"We received a request to reset your password.\n\nClick the link below to set a new password:\n{reset_url}\n\nThis link will expire in 30 minutes and can only be used once.\nIf you did not request this, you can safely ignore this email."
        
        email_html = f"""
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #fafafa;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0d9488; margin: 0; font-size: 24px;">MUSB Research</h1>
            </div>
            <p style="font-size: 16px; color: #333;">We received a request to reset your password. Click the button below to set a new password.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" style="background-color: #06b6d4; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #64748b;">This link will expire in 30 minutes and can only be used once.</p>
            <p style="font-size: 13px; color: #64748b;">If you did not request this, you can safely ignore this email.</p>
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
                Secured by MUSB Research HIPAA Compliance Layer
            </div>
        </div>
        """
        background_tasks.add_task(send_email_notification, body.email, subject, email_body, html=email_html)
    
    return {"message": message}


@router.post("/verify-reset-token")
async def verify_reset_token(body: dict, db=Depends(get_db)):
    """Check if the magic link token is valid before letting user see reset form."""
    token = body.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token is required.")

    # Debug logging
    from app.utils.logger import logger
    logger.info(f"Verifying token starting with: {token[:10]}...")
    
    hashed_token = hash_token(token)
    logger.info(f"Hashed token: {hashed_token[:10]}...")

    record = await db["password_reset_tokens"].find_one({
        "hashed_token": hashed_token,
    })

    if not record:
        logger.warning(f"No record found for token hash: {hashed_token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This reset link is invalid or has expired. Please request a new one."
        )
    
    if record.get("used"):
        logger.warning(f"Token already used: {hashed_token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This reset link has already been used."
        )
    
    now = datetime.now(timezone.utc)
    # Ensure expires_at is timezone-aware
    expires_at = record.get("expires_at")
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < now:
        logger.warning(f"Token expired. Now: {now}, Expires: {expires_at}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This reset link has expired."
        )

    return {"message": "Token is valid.", "email": record["email"]}


@router.post("/reset-password")
async def reset_password(request: Request, body: PasswordResetConfirm, db=Depends(get_db)):
    """Reset the user's password using the secure magic token."""
    await rate_limit_check(request, "/api/auth/reset-password")
    
    hashed_token = hash_token(body.token)
    record = await db["password_reset_tokens"].find_one({
        "hashed_token": hashed_token,
    })

    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This reset link is invalid or has already been used once. Please request a new link."
        )

    expires_at = record.get("expires_at")
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if record.get("used") or (expires_at and expires_at < datetime.now(timezone.utc)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This reset link is expired or has already been used once. Please request a new link."
        )

    user = await db["users"].find_one({"email": record["email"]})
    if not user:
         raise HTTPException(status_code=404, detail="User account not found.")

    # 1. Validate & Store New Password
    is_valid, reason = validate_password(body.newPassword)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=reason)

    new_hash = get_password_hash(body.newPassword)
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"passwordHash": new_hash, "updatedAt": datetime.now(timezone.utc)}}
    )

    # 2. Invalidate ALL tokens for this email (Single use + Cleanup)
    await db["password_reset_tokens"].update_many({"email": record["email"]}, {"$set": {"used": True}})

    # 3. Audit Log
    await log_audit_event(
        db=db,
        user_id=str(user["_id"]),
        action="RESET_PASSWORD_MAGIC",
        resource="User:Credentials",
        details="User successfully reset password via Magic Link",
        request=request
    )

    return {"message": "Password reset successfully. You can now sign in."}


@router.get("/public-key")
async def get_public_key():
    """Returns the RS256 public key so external services (e.g. Django SSO) can verify JWTs."""
    settings = get_settings()
    return {"public_key": settings.PUBLIC_KEY}
