import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

async def main():
    uri = "mongodb+srv://barenyamishra123_db_user:7QAUakrbMgAIJxdr@cluster0.xlng30r.mongodb.net/"
    db_name = "musb_research"
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
