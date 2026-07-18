
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
from app.services.vector_store import vector_store

# FastAPI app creating
app = FastAPI(
    title="OpsPilot",
    description="Document Intelligence Assistant",
    version="1.0.0"
)

# CORS - to connect with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for development; change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes register 
app.include_router(router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "OpsPilot",
        "version": "1.0.0",
        "status": "running",
        "chunks": vector_store.index.ntotal
    }

# to start server (optional)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)