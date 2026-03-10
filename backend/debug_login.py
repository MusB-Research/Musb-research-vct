import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def check_user():
    url = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    email_to_check = "brijeshraj6342@gmail.com"
    
    # Check exact match
    user = await db["users"].find_one({"email": email_to_check})
    if user:
        print(f"FOUND EXACT (lowercase): {user['email']}")
        print(f"Role: {user.get('role')}")
        print(f"Status: {user.get('status')}")
    else:
        print(f"NOT FOUND EXACT (lowercase): {email_to_check}")

    # Check case-insensitive
    import re
    user_ci = await db["users"].find_one({"email": re.compile(f"^{email_to_check}$", re.I)})
    if user_ci:
        print(f"FOUND CI: {user_ci['email']}")
    else:
        print("NOT FOUND CASE-INSENSITIVE")

if __name__ == "__main__":
    asyncio.run(check_user())
