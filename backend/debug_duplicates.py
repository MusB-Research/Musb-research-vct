
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def debug_users():
    url = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    email_to_check = "musbresearch@gmail.com"
    print(f"Checking for email variants of: {email_to_check}")
    
    cursor = db["users"].find({"email": {"$regex": f"^{email_to_check}$", "$options": "i"}})
    users = await cursor.to_list(length=10)
    
    for u in users:
        print(f"ID: {u['_id']}")
        print(f"Email: {u['email']}")
        print(f"Role: {u['role']}")
        print(f"Has Hash: {'Yes' if u.get('passwordHash') else 'No'}")
        print(f"Created At: {u.get('createdAt')}")
        print("-" * 20)
        
    client.close()

if __name__ == "__main__":
    asyncio.run(debug_users())
