import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from bson import ObjectId

async def check_study():
    # Use localhost if not in env
    db_url = "mongodb+srv://brijesh:t0fshlJ0f86u9Lp2@musb-cluster.un6o0.mongodb.net/?retryWrites=true&w=majority&appName=musb-cluster"
    db_name = "musb_research"
    
    # Try to load from .env if possible
    try:
        with open("backend/.env", "r") as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    db_url = line.split("=", 1)[1].strip().strip('"')
                if line.startswith("DATABASE_NAME="):
                    db_name = line.split("=", 1)[1].strip().strip('"')
    except:
        pass

    client = AsyncIOMotorClient(db_url)
    db = client[db_name]
    
    study_id = "69a450a30ec5cef242c7157f"
    print(f"Checking study {study_id} in {db_name}...")
    
    try:
        oid = ObjectId(study_id)
        s1 = await db["studies"].find_one({"_id": oid})
        s2 = await db["api_study"].find_one({"_id": oid})
        print(f"In 'studies': {'Found' if s1 else 'Not Found'}")
        print(f"In 'api_study': {'Found' if s2 else 'Not Found'}")
    except Exception as e:
        print(f"Error: {e}")
        # Try slug just in case
        s1 = await db["studies"].find_one({"slug": study_id})
        s2 = await db["api_study"].find_one({"slug": study_id})
        print(f"By slug in 'studies': {'Found' if s1 else 'Not Found'}")
        print(f"By slug in 'api_study': {'Found' if s2 else 'Not Found'}")

    client.close()

if __name__ == "__main__":
    asyncio.run(check_study())
