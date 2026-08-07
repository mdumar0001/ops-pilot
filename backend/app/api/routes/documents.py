# # backend/app/api/routes/documents.py

# from fastapi import APIRouter
# from app.services.vector_store import vector_store

# router = APIRouter()

# @router.get("/documents")
# async def list_documents():
#     """Uploaded documents ki list"""
    
#     # get unique filenames from metadata
#     filenames = list(set([
#         m.get('filename', 'unknown') for m in vector_store.metadata
#     ]))
    
#     return {
#         "documents": filenames,
#         "count": len(filenames),
#         "total_chunks": vector_store.total_chunks()
#     }
from fastapi import APIRouter
from app.models.schemas import DocumentListResponse
from app.services.session_manager import session_manager

router = APIRouter()

@router.get("/documents", response_model=DocumentListResponse)
async def list_documents():
    return DocumentListResponse(loaded_documents=session_manager.get_loaded_documents())