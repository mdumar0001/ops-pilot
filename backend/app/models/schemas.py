# # backend/app/models/schemas.py

# from pydantic import BaseModel
# from typing import Optional, List

# class ChatRequest(BaseModel):
#     """User'squestion"""
#     message: str
#     session_id: Optional[str] = None

# class ChatResponse(BaseModel):
#     """Assistant's reply'"""
#     response: str
#     sources: List[str] = []
#     session_id: str

# class UploadResponse(BaseModel):
#     """response for file upload"""
#     success: bool
#     filename: str
#     chunk_count: int
#     message: str
from pydantic import BaseModel, Field
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = "default_session"
    chat_history: Optional[List[ChatMessage]] = []

class Citation(BaseModel):
    source: str
    page: int

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]

class UploadResponse(BaseModel):
    message: str
    loaded_files: List[str]
    total_chunks: int

class DocumentListResponse(BaseModel):
    loaded_documents: List[str]

class HealthResponse(BaseModel):
    status: str
    message: str