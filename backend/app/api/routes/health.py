from fastapi import APIRouter
from app.db.mongodb import db

router = APIRouter()

@router.get("/health")
async def health_check():
    db_status = "ok" if db.client else "disconnected"
    return {
        "status": "ok",
        "database": db_status
    }
