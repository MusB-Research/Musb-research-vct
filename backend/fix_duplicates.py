
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def fix_duplicates():
    url = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME")
    client = AsyncIOMotorClient(url)
    db = client[db_name]
    
    # 1. Fix musbresearch@gmail.com
    # We saw: 
    # - musbresearch@gmail.com (PARTICIPANT, No Hash)
    # - Musbresearch@gmail.com (SPONSOR, Has Hash)
    print("Fixing musbresearch@gmail.com...")
    # Delete the one without a hash
    del_res = await db["users"].delete_one({"email": "musbresearch@gmail.com", "passwordHash": None})
    if del_res.deleted_count > 0:
        print(f"  - Deleted inactive PARTICIPANT record for musbresearch@gmail.com")
    
    # Update the remaining one (mixed case) to lowercase
    upd_res = await db["users"].update_one(
        {"email": "Musbresearch@gmail.com"},
        {"$set": {"email": "musbresearch@gmail.com"}}
    )
    if upd_res.matched_count > 0:
        print(f"  - Lowercased SPONSOR record for musbresearch@gmail.com")

    # 2. Fix dryadav@musbresearch.com
    print("Fixing dryadav@musbresearch.com...")
    # Find variants
    cursor = db["users"].find({"email": {"$regex": "^dryadav", "$options": "i"}})
    variants = await cursor.to_list(length=10)
    
    for v in variants:
        email = v["email"]
        if email != email.lower():
            # Check if lowercase exists
            exists = await db["users"].find_one({"email": email.lower()})
            if exists:
                print(f"  - Found duplicate for {email.lower()}. Deleting mixed case: {email}")
                await db["users"].delete_one({"_id": v["_id"]})
            else:
                print(f"  - No duplicate for {email.lower()}. Just lowercasing: {email}")
                await db["users"].update_one({"_id": v["_id"]}, {"$set": {"email": email.lower()}})

    client.close()
    print("✅ Duplicate fix complete.")

if __name__ == "__main__":
    asyncio.run(fix_duplicates())
