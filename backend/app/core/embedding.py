

# from sentence_transformers import SentenceTransformer

# model = SentenceTransformer('all-MiniLM-L6-v2')

# def get_embedding(text):
  
#     return model.encode([text])[0]

# # to test(optional)
# if __name__ == "__main__":
#     test_text = "This is a test"
#     embedding = get_embedding(test_text)
#     print(f"Text: {test_text}")
#     print(f"Embedding shape: {len(embedding)} numbers")
#     print(f"First 5 numbers: {embedding[:5]}")


    # backend/app/core/embedding.py
from sentence_transformers import SentenceTransformer
import gc

class EmbeddingService:
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.dimension = 384
            self.initialized = True
            print("✅ Embedding service initialized (model will load on first use)")
    
    def _load_model(self):
        if self._model is None:
            print("🔄 Loading embedding model...")
            self._model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
            self._model.eval()
            print("✅ Model loaded")
        return self._model
    
    def encode(self, texts):
        model = self._load_model()
        embeddings = model.encode(texts, batch_size=8)
        gc.collect()
        return embeddings

embedding_service = EmbeddingService()