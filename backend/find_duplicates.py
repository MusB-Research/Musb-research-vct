
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def find_duplicates():
    url = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    users = await db["users"].find({}).to_list(length=1000)
    emails = {}
    for user in users:
        email = user.get("email", "").lower()
        if email in emails:
            emails[email].append((user["email"], str(user["_id"])))
        else:
            emails[email] = [(user["email"], str(user["_id"]))]
            
    for email, docs in emails.items():
        if len(docs) > 1:
            print(f"DUPLICATE EMAIL (case-insensitive): {email}")
            for original, uid in docs:
                print(f"  - {original} (ID: {uid})")
                
    client.close()

if __name__ == "__main__":
    asyncio.run(find_duplicates())
