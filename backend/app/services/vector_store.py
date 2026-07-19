
import faiss
import numpy as np
from app.core.embedding import get_embedding

class VectorStore:
    def __init__(self):
        # 384 = output size of MiniLM model \
        self.index = faiss.IndexFlatL2(384)
        self.chunks = []
        self.metadata = []
        print(" Vector store initialized")
    
    def add_chunks(self, chunks):
        """ storing chunks into vector store"""
        if not chunks:
            return 0
        
        for chunk in chunks:
            # convert text to vector using embedding model
            embedding = get_embedding(chunk["text"])
            
            # FAISS mein add karo
            self.index.add(np.array([embedding]).astype('float32'))
            
            # storing text and metadata for retrieval
            self.chunks.append(chunk["text"])
            self.metadata.append(chunk["metadata"])
        
        print(f"✅ Added {len(chunks)} chunks")
        return len(chunks)
    
    def search(self, query, k=5):
        print(f"🔍 Searching for: {query}")
        print(f"📊 Total chunks in index: {self.index.ntotal}")
        """Similar chunks search karna"""
        if self.index.ntotal == 0:
            return []
        
        # Query ko vector mein convert karo
        query_embedding = get_embedding(query)
        
        # FAISS mein search karo
        distances, indices = self.index.search(
            np.array([query_embedding]).astype('float32'),
            min(k, self.index.ntotal)
        )
        
        # Results prepare karo
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.chunks):
                results.append({
                    "text": self.chunks[idx],
                    "metadata": self.metadata[idx],
                    "score": float(distances[0][i])
                })
        
        return results

# Global instance - this will be used across the application to store and retrieve vector embeddings
vector_store = VectorStore()