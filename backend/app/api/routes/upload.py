# # backend/app/api/routes/upload.py

# from fastapi import APIRouter, UploadFile, File, HTTPException
# from app.core.ingestion import process_pdf
# from app.services.vector_store import vector_store

# router = APIRouter()

# @router.post("/upload")
# async def upload_pdf(file: UploadFile = File(...)):
#     """PDF upload karne ka endpoint"""
    
#     # Check: PDF hai ya nahi
#     if not file.filename.endswith('.pdf'):
#         raise HTTPException(400, "Only PDF files allowed")
    
#     # File read karo
#     content = await file.read()
    
#     # Size check (10MB max)
#     if len(content) > 10 * 1024 * 1024:
#         raise HTTPException(400, "File too large (max 10MB)")
    
#     # PDF process karo
#     chunks = process_pdf(content, file.filename)
    
#     # Vector store mein add karo
#     vector_store.add_chunks(chunks)
    
#     return {
#         "success": True,
#         "filename": file.filename,
#         "chunk_count": len(chunks),
#         "message": f"✅ Processed {file.filename}"
#     }
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.schemas import UploadResponse
from app.core.ingestion import extract_and_chunk_pdf
from app.services.vector_store import vector_store_service
from app.services.session_manager import session_manager

router = APIRouter()
logger = logging.getLogger(__name__)

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB per PDF

@router.post(
    "/upload", 
    response_model=UploadResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload and process PDF documents"
)
async def upload_files(
    files: list[UploadFile] = File(..., description="Upload one or more PDF files")
):
    """
    Accepts PDF documents, extracts text, chunks content, and indexes vectors into Chroma.
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No files were provided in the request."
        )

    processed_files = []
    total_chunks = 0

    for file in files:
        filename = file.filename or "unknown.pdf"

        # 1. Validate File Extension
        if not filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File '{filename}' is not a PDF. Only PDF files are supported."
            )

        try:
            # 2. Read content safely
            content = await file.read()

            # 3. Size validation
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File '{filename}' exceeds maximum allowed size of 10MB."
                )

            if len(content) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File '{filename}' is empty."
                )

            # 4. Extract text and split into chunks
            chunks = extract_and_chunk_pdf(content, filename)

            if not chunks:
                logger.warning(f"No extractable text found in '{filename}'.")
                continue

            # 5. Embed and index in vector store
            vector_store_service.add_chunks(chunks)
            session_manager.register_document(filename)

            total_chunks += len(chunks)
            processed_files.append(filename)

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing file '{filename}': {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An unexpected error occurred while processing '{filename}': {str(e)}"
            )
        finally:
            await file.close()

    if not processed_files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to extract text from any of the provided files. Ensure PDFs contain readable text."
        )

    return UploadResponse(
        message=f"Successfully processed {len(processed_files)} document(s).",
        loaded_files=session_manager.get_loaded_documents(),
        total_chunks=total_chunks
    )