from fastapi import APIRouter, Query, Path
from typing import Optional
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessResponse, BusinessListResponse
from app.services.business_service import business_service

router = APIRouter()

@router.post("", response_model=dict, status_code=201)
async def create_business(business_in: BusinessCreate):
    created = await business_service.create_business(business_in)
    return {
        "success": True,
        "message": "Business created successfully",
        "data": created
    }

@router.get("", response_model=BusinessListResponse)
async def get_businesses(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None)
):
    result = await business_service.list_businesses(page, limit, search)
    return {
        "success": True,
        "data": result["data"],
        "pagination": result["pagination"]
    }

@router.get("/by-slug/{slug}", response_model=dict)
async def get_business_by_slug(slug: str = Path(...)):
    business = await business_service.get_business_by_slug(slug)
    return {
        "success": True,
        "message": "Business retrieved successfully",
        "data": business
    }

@router.get("/{business_id}", response_model=dict)
async def get_business(business_id: str = Path(...)):
    business = await business_service.get_business(business_id)
    return {
        "success": True,
        "message": "Business retrieved successfully",
        "data": business
    }

@router.put("/{business_id}", response_model=dict)
async def update_business(
    business_in: BusinessUpdate,
    business_id: str = Path(...)
):
    updated = await business_service.update_business(business_id, business_in)
    return {
        "success": True,
        "message": "Business updated successfully",
        "data": updated
    }

@router.delete("/{business_id}", response_model=dict)
async def delete_business(business_id: str = Path(...)):
    await business_service.delete_business(business_id)
    return {
        "success": True,
        "message": "Business deleted successfully"
    }
