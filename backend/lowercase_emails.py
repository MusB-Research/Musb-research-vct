
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def lowercase_emails():
    url = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    users = await db["users"].find({}).to_list(length=1000)
    print(f"Checking {len(users)} users...")
    
    updated_count = 0
    for user in users:
        email = user.get("email")
        if email and email != email.lower():
            print(f"Lowercasing: {email} -> {email.lower()}")
            await db["users"].update_one(
                {"_id": user["_id"]},
                {"$set": {"email": email.lower()}}
            )
            updated_count += 1
            
    print(f"✅ Successfully updated {updated_count} user(s).")
    client.close()

if __name__ == "__main__":
    asyncio.run(lowercase_emails())
