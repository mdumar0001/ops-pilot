# backend/app/api/__init__.py

from fastapi import APIRouter
from app.api.routes import upload, chat, documents, health

# Main router
router = APIRouter(prefix="/api/v1")

# Sab routes register karo
router.include_router(upload.router)
router.include_router(chat.router)
router.include_router(documents.router)
router.include_router(health.router)

print("✅ API routes registered")