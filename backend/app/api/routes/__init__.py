from fastapi import APIRouter
from app.api.routes.health import router as health_router
from app.api.routes.businesses import router as businesses_router
from app.api.routes.settings import router as settings_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(businesses_router, prefix="/businesses", tags=["businesses"])
api_router.include_router(settings_router, prefix="/settings", tags=["settings"])
