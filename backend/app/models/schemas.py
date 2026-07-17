# backend/app/models/schemas.py

from pydantic import BaseModel
from typing import Optional, List

class ChatRequest(BaseModel):
    """User'squestion"""
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    """Assistant's reply'"""
    response: str
    sources: List[str] = []
    session_id: str

class UploadResponse(BaseModel):
    """response for file upload"""
    success: bool
    filename: str
    chunk_count: int
    message: str