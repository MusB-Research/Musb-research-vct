
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
        
        # 2. Try Standard String Fallback (Legacy)
        # print("\nAttempting Standard Connection String Fallback...")
        # Reconstruct standard URI from SRV segments (Hardcoded for this specific cluster)
        # standard_uri = "mongodb://barenyamishra123_db_user:..."
        pass
        print("\nCommon fixes:")
        print("1. IP Whitelist: Check MongoDB Atlas -> Network Access. Ensure your current IP is whitelisted.")
        print("2. Credentials: Check DATABASE_URL in .env for correct username/password.")
        print("3. Network: Check if your network blocks port 27017.")
        print("4. Status: Check if Cluster0 is active/resumed in Atlas.")

if __name__ == "__main__":
    asyncio.run(test_connection())
