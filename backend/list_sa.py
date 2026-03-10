import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def list_sa():
    url = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    super_admins = await db["users"].find({"role": "SUPER_ADMIN"}).to_list(length=100)
    print(f"Index | Email | Status | Hash?")
    for i, sa in enumerate(super_admins):
        print(f"{i} | {sa['email']} | {sa.get('status', 'ACTIVE')} | {'YES' if sa.get('passwordHash') else 'NO'}")

if __name__ == "__main__":
    asyncio.run(list_sa())
