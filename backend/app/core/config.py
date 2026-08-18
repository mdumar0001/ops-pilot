# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Config:
#     GROQ_API_KEY = os.getenv("GROQ_API_KEY")
#    GROQ_MODEL = "llama-3.3-70b-versatile" 
#     GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
#     GEMINI_MODEL = "gemini-2.5-flash"  
#     CHUNK_SIZE = 800
#     CHUNK_OVERLAP = 100

# config = Config()
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Add this line
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "penai/gpt-oss-120b")

    EMBEDDING_MODEL_NAME: str = os.getenv(
        "EMBEDDING_MODEL_NAME",
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", 800))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", 150))

    class Config:
        env_file = ".env"


settings = Settings()