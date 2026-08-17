import datetime
from app.db.mongodb import db
from app.models.settings import serialize_mongo_settings
from app.utils.logger import get_logger
from app.core.config import settings

logger = get_logger(__name__)

class SettingsRepository:
    def get_collection(self):
        return db.client[settings.MONGODB_DATABASE].application_settings

    async def get_settings(self) -> dict:
        collection = self.get_collection()
        doc = await collection.find_one({"_id": "default"})
        return serialize_mongo_settings(doc) if doc else None

    async def create_settings(self, settings_data: dict) -> dict:
        collection = self.get_collection()
        
        now = datetime.datetime.utcnow()
        settings_data["_id"] = "default"
        settings_data["created_at"] = now
        settings_data["updated_at"] = now
        
        await collection.insert_one(settings_data)
        
        return serialize_mongo_settings(settings_data)

    async def update_settings(self, update_data: dict) -> dict:
        if not update_data:
            return await self.get_settings()
            
        collection = self.get_collection()
        update_data["updated_at"] = datetime.datetime.utcnow()
        
        # Ensure we don't accidentally update id or created_at
        update_data.pop("_id", None)
        update_data.pop("id", None)
        update_data.pop("created_at", None)
        
        result = await collection.find_one_and_update(
            {"_id": "default"},
            {"$set": update_data},
            return_document=True
        )
        return serialize_mongo_settings(result) if result else None

settings_repository = SettingsRepository()
