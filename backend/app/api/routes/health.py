# backend/app/api/routes/health.py

from fastapi import APIRouter
from app.services.vector_store import vector_store

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "chunks": vector_store.index.ntotal,
        "documents": len(set([m.get('filename') for m in vector_store.metadata]))
    }