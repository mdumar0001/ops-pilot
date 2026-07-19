# backend/app/api/routes/documents.py

from fastapi import APIRouter
from app.services.vector_store import vector_store

router = APIRouter()

@router.get("/documents")
async def list_documents():
    """Uploaded documents ki list"""
    
    # get unique filenames from metadata
    filenames = list(set([
        m.get('filename', 'unknown') for m in vector_store.metadata
    ]))
    
    return {
        "documents": filenames,
        "count": len(filenames),
        "total_chunks": vector_store.index.ntotal
    }