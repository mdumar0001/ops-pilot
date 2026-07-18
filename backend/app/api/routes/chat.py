# backend/app/api/routes/chat.py

from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.vector_store import vector_store
from app.services.llm_service import generate_answer
from app.services.session_manager import get_or_create_session, add_message, get_history

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat karne ka endpoint"""
    
    # Check: Koi PDF upload hui hai?
    if vector_store.index.ntotal == 0:
        return ChatResponse(
            response="📄 Please upload a PDF first. I have no documents to search.",
            sources=[],
            session_id=request.session_id or "temp"
        )
    
    # Session create karo (ya purana lo)
    session_id = get_or_create_session(request.session_id)
    
    # History lo
    history = get_history(session_id)
    
    # FAISS mein search karo
    results = vector_store.search(request.message, k=3)
    
    # Agar kuch nahi mila
    if not results:
        response = "I don't have information about that in the uploaded documents."
        add_message(session_id, "user", request.message)
        add_message(session_id, "assistant", response)
        
        return ChatResponse(
            response=response,
            sources=[],
            session_id=session_id
        )
    
    # LLM se answer lo
    answer = generate_answer(request.message, results, history)
    
    # History mein save karo
    add_message(session_id, "user", request.message)
    add_message(session_id, "assistant", answer)
    
    # Sources nikaalo
    sources = list(set([
        r['metadata'].get('filename', 'unknown') for r in results
    ]))
    
    return ChatResponse(
        response=answer,
        sources=sources,
        session_id=session_id
    )