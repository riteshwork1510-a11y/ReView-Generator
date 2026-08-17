from typing import Dict, Any

def serialize_mongo_business(business: dict) -> dict:
    """
    Convert a raw MongoDB document into a frontend-friendly dictionary.
    Maps '_id' (ObjectId) to 'id' (string).
    """
    if not business:
        return None
    
    serialized = {**business}
    
    if "_id" in serialized:
        serialized["id"] = str(serialized["_id"])
        del serialized["_id"]
        
    return serialized
