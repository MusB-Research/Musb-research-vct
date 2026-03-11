
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    uri = os.getenv("DATABASE_URL")
    db_name = os.getenv("DATABASE_NAME", "musb_research")
    
    print(f"Testing connection to: {uri.split('@')[-1] if uri else 'None'}")
    
    try:
        # 1. Try SRV (Default)
        client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
        await client.admin.command("ping")
        print("✅ Success! SRV Connected.")
    except Exception as e:
        print(f"❌ SRV Failed: {e}")
        
        # 2. Try Standard String Fallback
        print("\nAttempting Standard Connection String Fallback...")
        # Reconstruct standard URI from SRV segments (Hardcoded for this specific cluster)
        standard_uri = "mongodb://barenyamishra123_db_user:7QAUakrbMgAIJxdr@ac-lrg4c0o-shard-00-00.xlng30r.mongodb.net:27017,ac-lrg4c0o-shard-00-01.xlng30r.mongodb.net:27017,ac-lrg4c0o-shard-00-02.xlng30r.mongodb.net:27017/musb_research?ssl=true&replicaSet=atlas-lrg4c0o-shard-0&authSource=admin"
        
        try:
            client = AsyncIOMotorClient(standard_uri, serverSelectionTimeoutMS=5000)
            await client.admin.command("ping")
            print("✅ Success! Standard Connection String worked.")
            print(f"\nNEW_DATABASE_URL={standard_uri}")
        except Exception as e2:
            print(f"❌ Standard Connection Failed: {e2}")
        print("\nCommon fixes:")
        print("1. IP Whitelist: Check MongoDB Atlas -> Network Access. Ensure your current IP is whitelisted.")
        print("2. Credentials: Check DATABASE_URL in .env for correct username/password.")
        print("3. Network: Check if your network blocks port 27017.")
        print("4. Status: Check if Cluster0 is active/resumed in Atlas.")

if __name__ == "__main__":
    asyncio.run(test_connection())
