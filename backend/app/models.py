from datetime import datetime, timezone
from typing import Optional, Any
from pydantic import BaseModel, Field
from bson import ObjectId


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")
        return schema


# ---------------------------------------------------------------------------
# User / Auth
# ---------------------------------------------------------------------------

class UserRole:
    PARTICIPANT = "PARTICIPANT"
    COORDINATOR = "COORDINATOR"
    PI = "PI"
    DATA_MANAGER = "DATA_MANAGER"
    SPONSOR = "SPONSOR"
    SPONSOR_ADMIN = "SPONSOR_ADMIN"
    STUDY_MANAGER = "STUDY_MANAGER"
    VIEWER = "VIEWER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class UserBase(BaseModel):
    name: Optional[str] = None
    email: str
    role: str = UserRole.PARTICIPANT
    deviceFingerprint: Optional[str] = None
    
    # Sponsor Team Management Fields
    parentSponsorId: Optional[str] = None # ID of the Sponsor Admin they belong to
    assignedStudies: list[str] = [] # Array of study IDs for access control
    status: str = "ACTIVE" # ACTIVE, INACTIVE, PENDING


    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: str
    createdAt: datetime


class UserInDB(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")
    passwordHash: Optional[str] = None
    emailVerified: Optional[datetime] = None
    deviceFingerprint: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Study
# ---------------------------------------------------------------------------

class StudyArm(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    description: Optional[str] = None
    product: Optional[str] = None
    randomizationWeight: int = 1

class EligibilityRule(BaseModel):
    question: str
    expectedAnswer: Any
    ruleType: str = "INCLUSION"
    isRequired: bool = True

class Timepoint(BaseModel):
    dayOffset: int
    name: str # e.g., "Day 0", "Week 4"
    tasks: list[str] = []

    
class StudyStatus:
    DRAFT = "Draft"
    PROPOSAL_SUBMITTED = "Proposal Submitted"
    PROPOSAL_NEGOTIATION = "Proposal Under Negotiation"
    AGREEMENT_SIGNED = "Agreement Signed"
    IRB_PROTOCOL_INITIATED = "IRB Protocol Initiated"
    IRB_SUBMISSION = "Under IRB Submission / Development"
    IRB_APPROVED = "IRB Approved"
    PREPARING_LAUNCH = "Preparing to Launch"
    ACTIVE = "Active"
    RECRUITING = "Recruiting"
    RECRUITMENT_COMPLETED = "Recruitment Completed"
    ANALYSIS_UNDERWAY = "Analysis Underway"
    REPORT_DRAFT_CREATED = "Progress Report Draft Created"
    REPORT_SENT_SPONSOR = "Project Report Sent to Sponsor"
    COMPLETED = "Completed"
    PAUSED = "Paused"
    CLOSED_ARCHIVED = "Closed / Archived"

class StudyType:
    IN_PERSON = "In-person"
    VIRTUAL = "Virtual"

class LeadStatus:
    NEW = "New"
    CONTACT_ATTEMPTED = "Contact attempted"
    NO_ANSWER = "No answer"
    NOT_INTERESTED = "Not interested"
    INTERESTED = "Interested"
    NEEDS_MORE_INFO = "Needs more info"
    PRESCREENING = "Prescreening in progress"
    ELIGIBLE = "Eligible"
    INELIGIBLE = "Ineligible"
    SCHEDULED = "Scheduled"
    CONSENTED = "Consented"
    RANDOMIZED = "Randomized"
    ACTIVE = "Active"
    COMPLETED = "Completed"

class LeadSource:
    ONLINE = "online leads"
    OFFLINE_UPLOAD = "offline manual upload"
    DATABASE = "imported from MusB participant database"
    REFERRAL = "referrals"
    PAST_PARTICIPANT = "past participants"

class SampleStatus:
    KIT_ASSIGNED = "Kit Assigned"
    AWAITING_COLLECTION = "Awaiting Collection"
    COLLECTED = "Collected"
    SHIPPED_BY_PARTICIPANT = "Shipped by Participant"
    RECEIVED_AT_SITE = "Received at Site"
    MISSING = "Missing"
    DELAYED = "Delayed"
    DAMAGED_INVALID = "Damaged / Invalid"

class StudyBase(BaseModel):
    title: str
    slug: str
    description: str # Full Description
    shortDescription: Optional[str] = None # For study cards
    internalCode: Optional[str] = None
    studyType: str = StudyType.VIRTUAL
    
    # Assignments
    coordinatorId: Optional[str] = None # Primary coordinator
    coordinatorIds: list[str] = [] # Multiple coordinators
    piIds: list[str] = [] # Multiple PIs
    sponsorId: Optional[str] = None # Linked sponsor account
    sponsorName: Optional[str] = None # Denormalized for display/reports
    
    condition: Optional[str] = None
    indication: Optional[str] = None # Added per spec
    location: Optional[str] = None
    locationType: str = "Remote" # Remote, Hybrid
    
    # Timing
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None
    launchDate: Optional[datetime] = None
    irbStatus: Optional[str] = None
    
    duration: Optional[str] = None
    durationUnit: str = "weeks" # weeks, months
    timeCommitment: Optional[str] = None
    
    # Eligibility & Enrollment Targets
    minAge: int = 18
    maxAge: int = 100
    gender: str = "All" # All, Male, Female, Other
    inclusionCriteria: Optional[str] = None
    exclusionCriteria: Optional[str] = None
    
    # Targets per spec 3.3
    targetScreened: int = 0
    targetEligible: int = 0
    targetConsented: int = 0
    targetEnrollment: int = 0 # Added per life cycle logic
    targetRandomized: int = 0
    targetActive: int = 0
    targetCompleted: int = 0 # finishers (finishers needed)
    
    # Actual Counts per spec 3.4
    actualScreened: int = 0
    actualEligible: int = 0
    actualConsented: int = 0
    actualEnrolled: int = 0 # Added
    actualRandomized: int = 0
    actualActive: int = 0
    actualCompleted: int = 0
    actualDropped: int = 0
    
    regions: list[str] = ["Global"]
    
    # Features
    activities: list[str] = [] # Surveys, logging, etc.
    isPaid: bool = False
    compensation: Optional[str] = None 
    compensationAmount: Optional[float] = None
    compensationCurrency: str = "USD"
    compensationEnabled: bool = False
    
    status: str = StudyStatus.DRAFT
    
    # Sponsor & Agreement Section per spec 3.2
    proposalSource: str = "online" # online / offline
    proposalSubmittedDate: Optional[datetime] = None
    agreementSignedDate: Optional[datetime] = None
    contractStatus: Optional[str] = None
    sponsorContactDetails: Optional[dict] = None
    sponsorDocuments: list[dict] = [] # list of {name: str, url: str, uploadedAt: datetime}
    
    # Detailed Content
    overview: Optional[str] = None
    timeline: list[dict] = [] # list of {week: str, title: str, desc: str}
    kits: Optional[str] = None
    safety: Optional[str] = None

    # Advanced Study Builder Fields
    designType: str = "Parallel"
    arms: list[StudyArm] = []
    eligibilityRules: list[EligibilityRule] = []
    timepoints: list[Timepoint] = []
    assessmentIds: list[str] = [] # IDs of Assessments to use
    formIds: list[str] = [] # IDs of Forms assigned
    questionnaireIds: list[str] = [] # IDs of Questionnaires assigned
    randomizationEnabled: bool = False
    
    # Operations config per spec 3.5
    labUploadsEnabled: bool = False
    communicationRulesEnabled: bool = False
    # compensationEnabled is handled above
    
    # Logistics Configuration
    kitType: Optional[str] = None # stool, blood, saliva, urine
    shippingRules: Optional[str] = None
    kitDetails: Optional[str] = None # Detailed kit contents
    instructions: Optional[str] = None # Usage instructions
    returnLabelRequired: bool = True
    
    # Safety Configuration
    safetyAlertsEnabled: bool = True
    immediateNotificationSeverity: str = "SEVERE"

    # Files and Archive per spec 3.6
    protocolFiles: list[dict] = [] # {version: str, url: str, date: datetime}
    irbApprovalFiles: list[dict] = []
    consentFiles: list[dict] = []
    questionnaireFiles: list[dict] = []
    exportedPDFs: list[dict] = []
    sponsorReports: list[dict] = []
    finalProjectReport: Optional[dict] = None

    # Automation Controls per spec 2.3
    autoRecruitmentStop: bool = True
    autoStudyComplete: bool = True
    manualOverrideActive: bool = False # If true, manual control takes precedence over automation

    country: str = "Global" # Primary country
    consentLanguages: dict[str, str] = {} # e.g. {"US": "English...", "FR": "French..."}

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class StudyCreate(StudyBase):
    pass


class StudyOut(StudyBase):
    id: str
    createdAt: datetime


# ---------------------------------------------------------------------------
# Participant
# ---------------------------------------------------------------------------

class ParticipantBase(BaseModel):
    userId: str
    studyId: Optional[str] = None
    status: str = LeadStatus.NEW
    leadSource: str = LeadSource.ONLINE
    phone: Optional[str] = None
    phoneVerified: Optional[datetime] = None
    timezone: str = "UTC"
    dataResidency: str = "US" # US, EU, Asia (GDPR/Regional Requirement)
    notes: Optional[str] = None
    armId: Optional[str] = None
    consentedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ParticipantOut(ParticipantBase):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None
    studyTitle: Optional[str] = None
    coordinatorId: Optional[str] = None # ID of the assigned study coordinator
    coordinatorName: Optional[str] = None # Name of the assigned study coordinator



# ---------------------------------------------------------------------------
# Screener & Consent
# ---------------------------------------------------------------------------

class ScreenerSubmit(BaseModel):
    studyId: str
    responses: dict[str, Any]


class ScreenerOut(BaseModel):
    id: str
    participantId: str
    isEligible: bool
    completedAt: datetime

class ConsentSign(BaseModel):
    studyId: str
    signatureData: str # Digital signature / Typed name
    ipAddress: Optional[str] = None

class ConsentOut(BaseModel):
    id: str
    participantId: str
    studyId: str
    signedAt: datetime

# ---------------------------------------------------------------------------
# Adverse Event
# ---------------------------------------------------------------------------

class AESeverity:
    MILD = "MILD"
    MODERATE = "MODERATE"
    SEVERE = "SEVERE"
    LIFE_THREATENING = "LIFE_THREATENING"


class AdverseEventCreate(BaseModel):
    description: str
    severity: str
    onsetDate: datetime
    actionTaken: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class AdverseEventOut(AdverseEventCreate):
    id: str
    participantId: str
    reportedAt: datetime
    status: str


# ---------------------------------------------------------------------------
# Tasks
# ---------------------------------------------------------------------------

class TaskInstanceOut(BaseModel):
    id: str
    taskId: str
    title: str
    description: Optional[str] = None
    type: str
    status: str
    availableDate: datetime
    dueDate: datetime
    completedDate: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# ---------------------------------------------------------------------------
# Messages
# ---------------------------------------------------------------------------

class MessageCreate(BaseModel):
    receiverId: str
    content: str
    studyId: Optional[str] = None # Link message to a specific study


class MessageOut(BaseModel):
    id: str
    senderId: str
    receiverId: Optional[str] = None
    content: str
    read: bool
    createdAt: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ContactMessageCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    subject: str
    message: str


class ContactMessageOut(ContactMessageCreate):
    id: str
    createdAt: datetime
    read: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# ---------------------------------------------------------------------------
# Documents
# ---------------------------------------------------------------------------

class DocumentOut(BaseModel):
    id: str
    participantId: str
    filename: str
    url: str
    category: Optional[str] = None
    uploadedAt: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# ---------------------------------------------------------------------------
# Auth Tokens
# ---------------------------------------------------------------------------

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    id: str  # Added to skip /me call
    name: Optional[str] = None  # Added to skip /me call
    email: str  # Added to skip /me call
    parent_sponsor_id: Optional[str] = None



class TokenData(BaseModel):
    user_id: str
    email: Optional[str] = None
    role: Optional[str] = None
    name: Optional[str] = None
    modules: Optional[list] = []
    parent_sponsor_id: Optional[str] = None



# ---------------------------------------------------------------------------
# Audit Log (HIPAA)
# ---------------------------------------------------------------------------

class AuditLogCreate(BaseModel):
    userId: str
    action: str  # e.g., "LOGIN", "VIEW_PATIENT", "EXPORT_DATA"
    resource: str  # e.g., "Patient:12345"
    details: Optional[str] = None
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None

class AuditLogOut(AuditLogCreate):
    id: str
    timestamp: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ---------------------------------------------------------------------------
# Scheduling
# ---------------------------------------------------------------------------

class AppointmentCreate(BaseModel):
    participantId: str
    coordinatorId: Optional[str] = None
    scheduledAt: datetime
    type: str = "Screening Call"
    status: str = "SCHEDULED" # SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    notes: Optional[str] = None

class AppointmentOut(AppointmentCreate):
    id: str
    createdAt: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ---------------------------------------------------------------------------
# Kits & Inventory
# ---------------------------------------------------------------------------

class KitInstanceCreate(BaseModel):
    sku: str
    type: str # 'stool', 'blood', 'saliva'
    lotNumber: str
    expirationDate: datetime
    status: str = "AVAILABLE" # AVAILABLE, ASSIGNED, SHIPPED, RETURNED, EXPIRED

class KitInstanceOut(KitInstanceCreate):
    id: str
    assignedTo: Optional[str] = None
    shippedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
# ---------------------------------------------------------------------------
# Identity Verification
# ---------------------------------------------------------------------------

class VerificationRequest(BaseModel):
    identifier: str # Email or Phone
    type: str # "EMAIL" or "PHONE"
    purpose: Optional[str] = "LOGIN"  # LOGIN, REGISTER, RESET

class VerificationCheck(BaseModel):
    identifier: str
    code: str
    purpose: Optional[str] = "LOGIN"


class PasswordResetRequest(BaseModel):
    email: str
    newPassword: str
    code: str


class ResetLinkRequest(BaseModel):
    email: str


class PasswordResetConfirm(BaseModel):
    token: str
    newPassword: str


class UpdatePassword(BaseModel):
    currentPassword: str
    newPassword: str
    code: Optional[str] = None # Optional OTP verification


# ---------------------------------------------------------------------------
# Assessments & Forms (ePRO)
# ---------------------------------------------------------------------------

class FormField(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    type: str # text, number, select, radio, date, scale
    label: str
    placeholder: Optional[str] = None
    options: Optional[list[str]] = None
    required: bool = True
    minValue: Optional[float] = None
    maxValue: Optional[float] = None

class AssessmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "General" # Gut Health, Sleep, Stress, etc.
    fields: list[FormField] = []

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentOut(AssessmentBase):
    id: str
    createdAt: datetime

class FormResponseCreate(BaseModel):
    assessmentId: str
    studyId: str
    responses: dict[str, Any]
    status: str = "COMPLETED" # COMPLETED, IN_PROGRESS

class FormResponseOut(FormResponseCreate):
    id: str
    participantId: str
    submittedAt: datetime

# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------

class NotificationBase(BaseModel):
    userId: str
    title: str
    content: str
    type: str = "INFO" # INFO, TASK, ALERT
    status: str = "UNREAD" # UNREAD, READ
    channel: str = "IN_APP" # IN_APP, EMAIL, SMS

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    id: str
    createdAt: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ---------------------------------------------------------------------------
# Sponsor Team Management
# ---------------------------------------------------------------------------

class TeamMemberInvite(BaseModel):
    name: str
    email: str
    role: str # SPONSOR_ADMIN, STUDY_MANAGER, VIEWER
    assignedStudies: list[str] = []

class TeamMemberUpdate(BaseModel):
    role: Optional[str] = None
    assignedStudies: Optional[list[str]] = None

class TeamMemberSetPassword(BaseModel):
    token: str
    password: str

class TeamMemberOut(BaseModel):
    id: str
    name: Optional[str] = None
    email: str
    role: str
    status: str
    assignedStudies: list[str] = []
    createdAt: datetime
    updatedAt: datetime
