
from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.vector_store import vector_store
from app.services.llm_service import generate_answer
from app.services.session_manager import get_or_create_session, add_message, get_history

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Cchat endpoint for user queries"""
    
    # Check: Kis there documents uploaded hain ya nahi
    if vector_store.index.ntotal == 0:
        return ChatResponse(
            response="📄 Please upload a PDF first. I have no documents to search.",
            sources=[],
            session_id=request.session_id or "temp"
        )
    
    # create session if not exists
    session_id = get_or_create_session(request.session_id)
    
    # History lo
    history = get_history(session_id)
    
    # search in FAISS vector store
    # results = vector_store.search(request.message, k=5)

    # -------------------------
# Build search query
# -------------------------
    search_query = request.message
    
    # Improve follow-up questions
    if history and len(request.message.split()) <= 5:
    
        previous_user = None
    
        for msg in reversed(history):
            if msg["role"] == "user":
                previous_user = msg["content"]
                break
    
        if previous_user:
            search_query = previous_user + "\nFollow-up: " + request.message
    
    # Retrieve relevant chunks
    # results = vector_store.search(search_query, k=5)
    
    # # Agar kuch nahi mila
    # if not results:
    #     response = "I don't have information about that in the uploaded documents."
    #     add_message(session_id, "user", request.message)
    #     add_message(session_id, "assistant", response)
        
    #     return ChatResponse(
    #         response=response,
    #         sources=[],
    #         session_id=session_id
    #     )
    results = vector_store.search(search_query, k=5)

# # 🔥 DEBUG - Check if results exist
#     print(f"🔍 Search query: {search_query}")
#     print(f"📄 Results found: {len(results)}")
#     if results:
#         print(f"📄 First result: {results[0]['text'][:100]}...")
#     else:
#         print("❌ NO CHUNKS FOUND! Check FAISS index.")
    # LLM se answer lo
    answer = generate_answer(request.message, results, history=history)
    
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