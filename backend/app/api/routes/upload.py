# backend/app/api/routes/upload.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.ingestion import process_pdf
from app.services.vector_store import vector_store

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """PDF upload karne ka endpoint"""
    
    # Check: PDF hai ya nahi
    if not file.filename.endswith('.pdf'):
        raise HTTPException(400, "Only PDF files allowed")
    
    # File read karo
    content = await file.read()
    
    # Size check (10MB max)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 10MB)")
    
    # PDF process karo
    chunks = process_pdf(content, file.filename)
    
    # Vector store mein add karo
    vector_store.add_chunks(chunks)
    
    return {
        "success": True,
        "filename": file.filename,
        "chunk_count": len(chunks),
        "message": f"✅ Processed {file.filename}"
    }