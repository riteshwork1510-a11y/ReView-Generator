from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.api.routes import api_router
from app.utils.errors import global_exception_handler, validation_exception_handler, http_exception_handler
from app.utils.logger import get_logger

logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up FastAPI application...")
    await connect_to_mongo()
    yield
    logger.info("Shutting down FastAPI application...")
    await close_mongo_connection()

app = FastAPI(
    title="AI Review Generator API",
    version="0.1.0",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
from fastapi import HTTPException
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

# Routes
app.include_router(api_router, prefix="/api/v1")

# Root health check (required by some environments)
@app.get("/health")
async def root_health_check():
    return {"status": "ok"}
