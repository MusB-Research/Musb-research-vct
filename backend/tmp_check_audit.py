import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

async def check():
    uri = "mongodb+srv://barenyamishra123_db_user:7QAUakrbMgAIJxdr@cluster0.xlng30r.mongodb.net/?appName=Cluster0"
    client = AsyncIOMotorClient(uri)
    db = client["musb_research"]
    
    now = datetime.now(timezone.utc)
    print(f"Server UTC: {now}")
    
    cursor = db["audit_logs"].find().sort("timestamp", -1).limit(5)
    async for log in cursor:
        print(f"Time: {log.get('timestamp')} | Action: {log.get('action')} | User: {log.get('userId')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check())
