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
    print(f"REPORTING ON {len(super_admins)} SUPER_ADMINS")
    for sa in super_admins:
        e = sa.get('email', 'MISSING')
        s = sa.get('status', 'MISSING')
        h = 'PRESENT' if sa.get('passwordHash') else 'MISSING'
        print(f"EMAIL: {e}")
        print(f"STATUS: {s}")
        print(f"HASH: {h}")
        print("-" * 10)

if __name__ == "__main__":
    asyncio.run(list_sa())
