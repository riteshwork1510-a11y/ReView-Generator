import datetime
from bson import ObjectId
from app.db.mongodb import db
from app.models.business import serialize_mongo_business
from app.utils.logger import get_logger
from app.core.config import settings

logger = get_logger(__name__)

class BusinessRepository:
    def get_collection(self):
        return db.client[settings.MONGODB_DATABASE].businesses

    async def create_business(self, business_data: dict) -> dict:
        collection = self.get_collection()
        
        now = datetime.datetime.utcnow()
        business_data["created_at"] = now
        business_data["updated_at"] = now
        
        result = await collection.insert_one(business_data)
        business_data["_id"] = result.inserted_id
        
        return serialize_mongo_business(business_data)

    async def get_business_by_id(self, business_id: str) -> dict:
        try:
            obj_id = ObjectId(business_id)
        except Exception:
            return None
            
        collection = self.get_collection()
        doc = await collection.find_one({"_id": obj_id})
        return serialize_mongo_business(doc) if doc else None

    async def update_business(self, business_id: str, update_data: dict) -> dict:
        try:
            obj_id = ObjectId(business_id)
        except Exception:
            return None
            
        if not update_data:
            return await self.get_business_by_id(business_id)
            
        collection = self.get_collection()
        update_data["updated_at"] = datetime.datetime.utcnow()
        
        # Ensure we don't accidentally update id or created_at
        update_data.pop("_id", None)
        update_data.pop("id", None)
        update_data.pop("created_at", None)
        
        result = await collection.find_one_and_update(
            {"_id": obj_id},
            {"$set": update_data},
            return_document=True
        )
        return serialize_mongo_business(result) if result else None

    async def delete_business(self, business_id: str) -> bool:
        try:
            obj_id = ObjectId(business_id)
        except Exception:
            return False
            
        collection = self.get_collection()
        result = await collection.delete_one({"_id": obj_id})
        return result.deleted_count > 0

    async def search_businesses(self, query: dict, skip: int, limit: int) -> list:
        collection = self.get_collection()
        cursor = collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)
        return [serialize_mongo_business(doc) for doc in docs]

    async def count_businesses(self, query: dict) -> int:
        collection = self.get_collection()
        return await collection.count_documents(query)

business_repository = BusinessRepository()
