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
    
    # 1. Total admins
    total = await db["users"].count_documents({"role": "SUPER_ADMIN"})
    print(f"Total SUPER_ADMIN found: {total}")
    
    # 2. List all carefully
    cursor = db["users"].find({"role": "SUPER_ADMIN"})
    async for sa in cursor:
        print(f"E: {sa.get('email')} | S: {sa.get('status')} | Role: {sa.get('role')}")
    
    # 3. Check info account specifically
    info = await db["users"].find_one({"email": "info@musbresearch.com"})
    if info:
        print(f"INFO ACCOUNT FOUND: Role={info.get('role')} Status={info.get('status')}")
    else:
        print("INFO ACCOUNT NOT FOUND")

if __name__ == "__main__":
    asyncio.run(list_sa())
