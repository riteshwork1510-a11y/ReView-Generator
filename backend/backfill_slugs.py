import asyncio
import sys
import os

# Add backend directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.mongodb import db, connect_to_mongo, close_mongo_connection
from app.core.config import settings
import re

async def main():
    print("Connecting to MongoDB...")
    await connect_to_mongo()
    
    collection = db.client[settings.MONGODB_DATABASE].businesses
    
    # Also find documents where slug is null or empty string
    cursor = collection.find({"$or": [{"slug": {"$exists": False}}, {"slug": None}, {"slug": ""}]})
    businesses = await cursor.to_list(length=1000)
    
    print(f"Found {len(businesses)} businesses without a slug.")
    
    updated_count = 0
    for b in businesses:
        company_name = b.get("company_name", "")
        owner_name = b.get("owner_name", "")
        
        base_str = f"{company_name}-{owner_name}"
        base_slug = re.sub(r'[^a-z0-9]+', '-', base_str.lower()).strip('-')
        if not base_slug:
            base_slug = "business"
            
        slug = base_slug
        counter = 1
        
        # Check uniqueness against all documents
        while await collection.find_one({"slug": slug, "_id": {"$ne": b["_id"]}}):
            slug = f"{base_slug}-{counter}"
            counter += 1
            
        await collection.update_one({"_id": b["_id"]}, {"$set": {"slug": slug}})
        print(f"Updated {company_name} with slug: {slug}")
        updated_count += 1
        
    print(f"Successfully backfilled {updated_count} slugs.")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(main())
