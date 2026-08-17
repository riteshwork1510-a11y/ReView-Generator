import math
from fastapi import HTTPException
from app.repositories.business_repository import business_repository
from app.schemas.business import BusinessCreate, BusinessUpdate
from app.utils.logger import get_logger
from bson import ObjectId

logger = get_logger(__name__)

class BusinessService:
    
    @staticmethod
    def _validate_id(business_id: str):
        if not ObjectId.is_valid(business_id):
            raise HTTPException(status_code=400, detail={
                "success": False,
                "message": "Invalid business ID format",
                "error_code": "INVALID_ID"
            })

    async def create_business(self, business_in: BusinessCreate) -> dict:
        data = business_in.model_dump(exclude_unset=True, mode="json")
        # In a real app we might check for duplicates here
        # (e.g. same company_name AND website), but requirements
        # state "Only introduce a strict unique constraint if it is logically safe."
        # We will allow creation for now.
        
        try:
            created = await business_repository.create_business(data)
            return created
        except Exception as e:
            logger.error(f"Error creating business: {e}")
            raise HTTPException(status_code=500, detail={
                "success": False,
                "message": "Database error while creating business",
                "error_code": "DATABASE_ERROR"
            })

    async def get_business(self, business_id: str) -> dict:
        self._validate_id(business_id)
        
        business = await business_repository.get_business_by_id(business_id)
        if not business:
            raise HTTPException(status_code=404, detail={
                "success": False,
                "message": "Business not found",
                "error_code": "BUSINESS_NOT_FOUND"
            })
        return business

    async def get_business_by_slug(self, slug: str) -> dict:
        business = await business_repository.get_business_by_slug(slug)
        if not business:
            raise HTTPException(status_code=404, detail={
                "success": False,
                "message": "Business not found",
                "error_code": "BUSINESS_NOT_FOUND"
            })
        return business

    async def update_business(self, business_id: str, business_in: BusinessUpdate) -> dict:
        self._validate_id(business_id)
        
        data = business_in.model_dump(exclude_unset=True, mode="json")
        if not data:
            raise HTTPException(status_code=400, detail={
                "success": False,
                "message": "No fields provided for update",
                "error_code": "EMPTY_UPDATE"
            })
            
        updated = await business_repository.update_business(business_id, data)
        if not updated:
            raise HTTPException(status_code=404, detail={
                "success": False,
                "message": "Business not found",
                "error_code": "BUSINESS_NOT_FOUND"
            })
        return updated

    async def delete_business(self, business_id: str) -> bool:
        self._validate_id(business_id)
        
        success = await business_repository.delete_business(business_id)
        if not success:
            raise HTTPException(status_code=404, detail={
                "success": False,
                "message": "Business not found",
                "error_code": "BUSINESS_NOT_FOUND"
            })
        return True

    async def list_businesses(self, page: int, limit: int, search: str = None) -> dict:
        if page < 1:
            page = 1
        if limit < 1:
            limit = 20
        if limit > 100:
            limit = 100
            
        skip = (page - 1) * limit
        query = {}
        
        import re
        if search:
            # Basic text search using regex across multiple fields
            safe_search = re.escape(search)
            regex = {"$regex": safe_search, "$options": "i"}
            query = {
                "$or": [
                    {"company_name": regex},
                    {"services_products": regex},
                    {"location": regex},
                    {"address": regex},
                    {"email": regex},
                    {"website": regex}
                ]
            }
            
        try:
            items = await business_repository.search_businesses(query, skip, limit)
            total = await business_repository.count_businesses(query)
            total_pages = math.ceil(total / limit) if limit > 0 else 0
            
            return {
                "data": items,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": total,
                    "total_pages": total_pages
                }
            }
        except Exception as e:
            logger.error(f"Error listing businesses: {e}")
            raise HTTPException(status_code=500, detail={
                "success": False,
                "message": "Database error while fetching businesses",
                "error_code": "DATABASE_ERROR"
            })

business_service = BusinessService()
