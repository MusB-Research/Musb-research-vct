import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def check_super_admin():
    url = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    # Check for any users
    user_count = await db["users"].count_documents({})
    print(f"Total users in DB: {user_count}")
    
    # Find SUPER_ADMIN
    super_admins = await db["users"].find({"role": "SUPER_ADMIN"}).to_list(length=10)
    print(f"Found {len(super_admins)} SUPER_ADMIN users")
    
    for sa in super_admins:
        print(f"ID: {sa['_id']}")
        print(f"Email: {sa['email']}")
        print(f"Status: {sa.get('status', 'N/A')}")
        print(f"Has Password Hash: {'Yes' if sa.get('passwordHash') else 'No'}")
        print("-" * 20)

if __name__ == "__main__":
    asyncio.run(check_super_admin())
