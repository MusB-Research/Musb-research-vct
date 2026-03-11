from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient = None
db = None


from app.utils.logger import logger

async def initialize_indexes():
    """Ensure unique indexes to prevent data conflicts between modules."""
    global db
    if db is None:
        return
    
    try:
        # User uniqueness (Shared collection)
        await db["users"].create_index("email", unique=True)
        # Study slug uniqueness (Shared collection)
        await db["studies"].create_index("slug", unique=True)
        # Device fingerprinting uniqueness (Optional but good)
        await db["users"].create_index("deviceFingerprint", sparse=True)
        
        logger.info("Database indexes initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize indexes: {str(e)}")

async def connect_db():
    """Create database connection on startup."""
    global client, db
    
    # Check for empty URL
    if not settings.DATABASE_URL:
        logger.error("DATABASE_URL is not set!")
        return

    # Configure pool size for multiple modules sharing the DB
    # We add a shorter serverSelectionTimeoutMS for faster failure feedback
    client = AsyncIOMotorClient(
        settings.DATABASE_URL,
        maxPoolSize=100,
        minPoolSize=10,
        retryWrites=True,
        serverSelectionTimeoutMS=5000  # Fail faster if unreachable (5s)
    )
    db = client[settings.DATABASE_NAME]
    
    try:
        # Actually verify connection now instead of waiting for first request
        await db.command("ping")
        logger.info(f"Connected to MongoDB: {settings.DATABASE_NAME} (Shared Cluster)")
        await initialize_indexes()
    except Exception as e:
        logger.critical(f"DATABASE CONNECTION FAILED: {str(e)}")
        # In development, we might want to continue, but in production this should crash.
        if settings.ENV == "production":
            raise e


async def close_db():
    """Close database connection on shutdown."""
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed.")


def get_db():
    """Dependency injector that returns the active database instance."""
    return db
