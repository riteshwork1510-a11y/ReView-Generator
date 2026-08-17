from fastapi import APIRouter
from app.schemas.settings import ApplicationSettingsUpdate, ApplicationSettingsResponse
from app.services.settings_service import settings_service

router = APIRouter()

@router.get("", response_model=dict)
async def get_settings():
    settings = await settings_service.get_settings()
    return {
        "success": True,
        "data": settings
    }

@router.put("", response_model=dict)
async def update_settings(settings_in: ApplicationSettingsUpdate):
    updated = await settings_service.update_settings(settings_in)
    return {
        "success": True,
        "message": "Settings updated successfully",
        "data": updated
    }
