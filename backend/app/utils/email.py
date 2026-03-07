import logging
import smtplib
from email.message import EmailMessage
from typing import Optional
from app.config import get_settings

logger = logging.getLogger(__name__)

async def send_email_notification(
    to_email: str,
    subject: str,
    body: str,
    html: Optional[str] = None,
    max_retries: int = 3
):
    """
    Utility for sending emails securely utilizing SMTP credentials from .env.
    Designed to be run via FastAPI BackgroundTasks (synchronously in a thread pool).
    Note: the def is kept `async def` but its contents await `to_thread` optionally,
    OR we can make it a regular sync `def` if called directly via add_task.
    Since we don't want to break existing direct `await send_email_notification(..)` calls,
    we'll modify it to be non-blocking internally or update all callers.

    Update: We've updated all callers to pass this to background_tasks.add_task *except* 
    where we might miss it. However, if background_tasks.add_task receives an async def, 
    FastAPI will run it in the event loop, taking up time. Let's make it a normal sync func.
    WAIT: If we make it sync, all existing `await send_email_notification(...)` will break 
    (TypeError: object NoneType can't be used in 'await' expression).
    
    Actually, BackgroundTasks accepts BOTH async and sync functions. 
    If you add an `async def` to BackgroundTasks, FastAPI runs it in the event loop asynchronously.
    So the BEST approach: Make it a regular `def`, remove `await`, and update all callers to NOT await it.
    BUT since there are many callers, another approach: KEEP it `async def`, but make its internal logic `await asyncio.to_thread(_send)`. Wait, that's what it was doing originally! The issue was that callers were `await`ing it *during the request*, delaying the response.
    So we strictly need to change the *callers* to use `background_tasks.add_task(send_email_notification, ...)`.
    And for that to not block the event loop, `send_email_notification` STILL needs `await asyncio.to_thread()`.
    
    Let's stick to keeping it `async def` with `to_thread`, AND we add retry logic inside it.
    And we will use `BackgroundTasks` in the routes.
    """
    # Still print for debugging purposes in case SMTP fails
    print(f"\n" + "="*50)
    print(f"[MAIL] EMAIL PREPARED FOR: {to_email}")
    print(f"[SUBJ] SUBJECT: {subject}")
    print("="*50 + "\n")
    
    settings = get_settings()
    host = settings.SMTP_HOST or "smtp.gmail.com"
    port = settings.SMTP_PORT
    user = settings.SMTP_EMAIL
    password = settings.SMTP_PASSWORD
    
    if not user or not password:
        logger.warning(f"SMTP credentials missing. Mocked email to {to_email} only.")
        return True
        
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"MusB Research <{user}>"
    msg["To"] = to_email
    msg.set_content(body)
    
    if html:
        msg.add_alternative(html, subtype="html")
        
    def _send_sync():
        import time
        for attempt in range(max_retries):
            try:
                with smtplib.SMTP(host, port, timeout=10) as server:
                    if port == 587:
                         server.starttls()
                    server.login(str(user), str(password))
                    server.send_message(msg)
                logger.info(f"Notification email successfully dispatched to {to_email} on attempt {attempt + 1}")
                return True
            except smtplib.SMTPException as e:
                logger.warning(f"SMTP error on attempt {attempt + 1} sending to {to_email}: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
            except Exception as e:
                logger.error(f"Unexpected error sending email to {to_email}: {str(e)}")
                break
        logger.error(f"Failed to send email to {to_email} after {max_retries} attempts.")
        return False
    
    # Offload blocking SMTP call to a separate thread to keep the event loop free
    import asyncio
    await asyncio.to_thread(_send_sync)
    return True

async def notify_coordinator_new_message(
    coordinator_email: str,
    coordinator_name: str,
    participant_name: str,
    message_excerpt: str
):
    """Helper to notify a coordinator about a new participant message."""
    subject = f"MUSB Portal: New message from {participant_name}"
    body = f"""
    Hello {coordinator_name},
    
    Participant {participant_name} has sent you a new message on the MUSB Portal:
    
    "{message_excerpt}..."
    
    Please log in to your coordinator dashboard to reply and maintain protocol adherence.
    
    Best regards,
    MUSB Research System
    """
    await send_email_notification(coordinator_email, subject, body)

async def notify_admin_new_study_inquiry(
    admin_email: str,
    sponsor_name: str,
    sponsor_email: str,
    study_details: dict
):
    """Helper to notify admin about a new study inquiry from a sponsor."""
    subject = f"MUSB Portal: New Study Inquiry - {study_details.get('title')}"
    
    # Create a nice summary of details
    details_text = "\n".join([f"• {k}: {v}" for k, v in study_details.items() if v and k not in ('description', 'inclusionCriteria', 'exclusionCriteria', 'slug')])
    
    body = f"""
    Hello Admin,
    
    A new study inquiry has been submitted by a sponsor.
    
    SPONSOR DETAILS:
    Name: {sponsor_name}
    Email: {sponsor_email}
    
    STUDY OVERVIEW:
    {details_text}
    
    DESCRIPTION:
    {study_details.get('description', 'No description provided.')[:500]}...
    
    This study is currently marked as 'UNDER_REVIEW'. Please log in to the admin dashboard 
    to carefully check the details and allow the launch if everything is correct.
    
    Best regards,
    MUSB Research System
    """
    
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #0d9488;">New Study Inquiry Submitted</h2>
        <p>A sponsor wants to launch a new study on the platform.</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #64748b;">Sponsor Contact</h3>
            <p style="margin-bottom: 4px;"><strong>Name:</strong> {sponsor_name}</p>
            <p style="margin-top: 0;"><strong>Email:</strong> {sponsor_email}</p>
        </div>
        
        <div style="background-color: #f0fdfa; padding: 16px; border-radius: 8px; border-left: 4px solid #0d9488;">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #0d9488;">Study: {study_details.get('title')}</h3>
            <p><strong>Condition:</strong> {study_details.get('condition')}</p>
            <p><strong>Target Participants:</strong> {study_details.get('targetParticipants')}</p>
            <p><strong>Compensation:</strong> {study_details.get('compensationAmount')} {study_details.get('compensationDescription')}</p>
        </div>
        
        <p style="margin-top: 24px;">Please review this study in the Admin Dashboard to approve the launch.</p>
        
        <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; pt: 16px; font-size: 12px; color: #94a3b8;">
            Sent via MUSB Research Automated Notification System
        </div>
    </div>
    """
    
    settings = get_settings()
    await send_email_notification(admin_email, subject, body, html=html)


async def notify_new_credentials(
    user_email: str,
    user_name: str,
    role: str,
    login_url: str,
    password: Optional[str] = None
):
    """Helper to notify a newly created user about their credentials."""
    # Format role name nicely (e.g., "DATA_MANAGER" -> "Data Manager")
    role_display = role.replace("_", " ").title()

    subject = f"MUSB Portal: Your Account is Ready - {role_display}"

    body = f"""
    Hello {user_name},

    Your MUSB Research account has been successfully created!

    ACCOUNT DETAILS:
    Email: {user_email}
    Role: {role_display}

    You can now log in to the MUSB Portal using your email and password.

    Login URL: {login_url}

    {"Password: " + password if password else ""}

    Please keep your credentials secure and do not share them with anyone else.

    If you have any questions or need assistance, please contact support.

    Best regards,
    MUSB Research System
    """

    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0d9488; margin: 0; font-size: 28px;">Welcome to MUSB Portal</h1>
        </div>

        <p>Hello <strong>{user_name}</strong>,</p>

        <p style="font-size: 16px;">Your MUSB Research account has been successfully created and is ready to use!</p>

        <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; border-left: 4px solid #0d9488; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #0d9488; font-size: 14px; text-transform: uppercase;">Account Details</h3>
            <p style="margin: 8px 0;"><strong>Email:</strong> {user_email}</p>
            <p style="margin: 8px 0;"><strong>Role:</strong> <span style="background-color: #cffafe; padding: 4px 8px; border-radius: 4px; font-weight: bold;">{role_display}</span></p>
            {f'<p style="margin: 8px 0;"><strong>Password:</strong> <code style="background-color: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-family: monospace;">{password}</code></p>' if password else ''}
        </div>

        <div style="text-align: center; margin: 32px 0;">
            <a href="{login_url}" style="background-color: #0d9488; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Log In to MUSB Portal
            </a>
        </div>

        <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #7f1d1d;">
                <strong>⚠️ Security Notice:</strong> Never share your credentials with anyone. The MUSB team will never ask for your password via email or phone.
            </p>
        </div>

        <p style="color: #64748b; font-size: 12px; margin-top: 32px;">
            If you did not create this account or have questions, please contact the MUSB Research support team immediately.
        </p>

        <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; pt: 16px; font-size: 12px; color: #94a3b8;">
            Sent via MUSB Research Automated Notification System
        </div>
    </div>
    """

    await send_email_notification(user_email, subject, body, html=html)


async def notify_team_invitation(
    user_email: str,
    user_name: str,
    sponsor_name: str,
    role: str,
    activation_url: str
):
    """Helper to notify a new team member that they've been invited by a sponsor."""
    role_display = role.replace("_", " ").title()
    subject = f"You've been invited to join {sponsor_name} on MUSB Research"

    body = f"""
    Hello {user_name},

    {sponsor_name} has invited you to join their team on MUSB Research.

    Role: {role_display}

    Click the link below to create your password and activate your account:
    {activation_url}

    This link will expire in 48 hours.

    If you didn't expect this invitation, please ignore this email.

    Thanks,
    MUSB Research System
    """

    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #0d9488;">You're Invited!</h2>
        <p>Hello <strong>{user_name}</strong>,</p>
        <p><strong>{sponsor_name}</strong> has invited you to join their team on MUSB Research.</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>Role:</strong> {role_display}</p>
        </div>
        
        <p>Click the button below to create your password and activate your account. This link expires in 48 hours.</p>
        
        <div style="text-align: center; margin: 32px 0;">
            <a href="{activation_url}" style="background-color: #0d9488; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Activate Account
            </a>
        </div>
        
        <p style="color: #64748b; font-size: 12px;">If you didn't expect this, you can safely ignore this email.</p>
    </div>
    """

    await send_email_notification(user_email, subject, body, html=html)
