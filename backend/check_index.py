import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def main():
    uri = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME", "musb_research")
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    print(f"Checking index on {db_name}.users.email...")
    try:
        idx = await db["users"].create_index("email", unique=True)
        print(f"Index ensured: {idx}")
        
        # Check current document count
        count = await db["users"].count_documents({})
        print(f"Total users: {count}")
    except Exception as e:
        print(f"Error checking index: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
