from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URI)
        # Test connection
        await db.client.admin.command('ping')
        
        # Create indexes
        database = db.client[settings.MONGODB_DATABASE]
        collection = database.businesses
        await collection.create_index([("company_name", 1)])
        await collection.create_index([("created_at", -1)])
        await collection.create_index([("location", 1)])
        
        logger.info("Connected to MongoDB successfully!")
    except Exception as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        # Not raising an exception to allow FastAPI to start even if Mongo is down
        # as per requirements: "If MongoDB is unavailable, the backend must fail gracefully"

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")
