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
    
    # 1. Any user with role SUPER_ADMIN
    print("--- ALL SUPER_ADMINS ---")
    cursor = db["users"].find({"role": "SUPER_ADMIN"})
    async for sa in cursor:
          print(f"E: {sa.get('email')} | N: {sa.get('name')} | S: {sa.get('status')} | Role: {sa.get('role')}")
    
    # 2. Any user with 'admin' in email
    print("\n--- ADMIN IN EMAIL ---")
    cursor = db["users"].find({"email": {"$regex": "admin", "$options": "i"}})
    async for u in cursor:
          print(f"E: {u.get('email')} | R: {u.get('role')}")

if __name__ == "__main__":
    asyncio.run(list_sa())
