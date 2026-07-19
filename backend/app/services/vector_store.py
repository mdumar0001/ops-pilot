
# import faiss
# import numpy as np
# from app.core.embedding import get_embedding

# class VectorStore:
#     def __init__(self):
#         # 384 = output size of MiniLM model \
#         self.index = faiss.IndexFlatL2(384)
#         self.chunks = []
#         self.metadata = []
#         print(" Vector store initialized")
    
#     def add_chunks(self, chunks):
#         """ storing chunks into vector store"""
#         if not chunks:
#             return 0
        
#         for chunk in chunks:
#             # convert text to vector using embedding model
#             embedding = get_embedding(chunk["text"])
            
#             # FAISS mein add karo
#             self.index.add(np.array([embedding]).astype('float32'))
            
#             # storing text and metadata for retrieval
#             self.chunks.append(chunk["text"])
#             self.metadata.append(chunk["metadata"])
        
#         print(f"✅ Added {len(chunks)} chunks")
#         return len(chunks)
    
#     def search(self, query, k=5):
#         print(f"🔍 Searching for: {query}")
#         print(f"📊 Total chunks in index: {self.index.ntotal}")
#         """Similar chunks search karna"""
#         if self.index.ntotal == 0:
#             return []
        
#         # Query ko vector mein convert karo
#         query_embedding = get_embedding(query)
        
#         # FAISS mein search karo
#         distances, indices = self.index.search(
#             np.array([query_embedding]).astype('float32'),
#             min(k, self.index.ntotal)
#         )
        
#         # Results prepare karo
#         results = []
#         for i, idx in enumerate(indices[0]):
#             if idx < len(self.chunks):
#                 results.append({
#                     "text": self.chunks[idx],
#                     "metadata": self.metadata[idx],
#                     "score": float(distances[0][i])
#                 })
        
#         return results

# # Global instance - this will be used across the application to store and retrieve vector embeddings
# vector_store = VectorStore()

# backend/app/services/vector_store.py
import faiss
import numpy as np
import pickle
import os
import gc
from typing import List, Dict

class VectorStore:
    def __init__(self):
        self.dimension = 384
        self.persist_path = "data/faiss_index"
        self.index = None
        self.chunks = []
        self.metadata = []
        self._ensure_persist_dir()
        self._load_metadata_only()
    
    def _ensure_persist_dir(self):
        if not os.path.exists(self.persist_path):
            os.makedirs(self.persist_path)
    
    def _load_metadata_only(self):
        """Sirf metadata load karo (index baad mein)"""
        try:
            data_path = f"{self.persist_path}/data.pkl"
            if os.path.exists(data_path):
                with open(data_path, 'rb') as f:
                    data = pickle.load(f)
                    self.chunks = data['chunks']
                    self.metadata = data['metadata']
                print(f"✅ Loaded {len(self.chunks)} chunks metadata")
        except Exception as e:
            print(f"⚠️ Failed to load metadata: {e}")
    
    def _get_index(self):
        if self.index is None:
            index_path = f"{self.persist_path}/index.faiss"
            if os.path.exists(index_path):
                self.index = faiss.read_index(index_path)
                print(f"✅ Index loaded ({self.index.ntotal} vectors)")
            else:
                self.index = faiss.IndexFlatL2(self.dimension)
                print("✅ New index created")
        return self.index
    
    def add_chunks(self, chunks):
        if not chunks:
            return 0
        
        from app.core.embedding import embedding_service
        texts = [c['text'] for c in chunks]
        embeddings = embedding_service.encode(texts)
        
        index = self._get_index()
        for chunk, embedding in zip(chunks, embeddings):
            index.add(np.array([embedding]).astype('float32'))
            self.chunks.append(chunk['text'])
            self.metadata.append(chunk['metadata'])
        
        self._save_to_disk()
        gc.collect()
        return len(chunks)
    
    def search(self, query: str, k: int = 5):
        index = self._get_index()
        if index.ntotal == 0:
            return []
        
        from app.core.embedding import embedding_service
        query_embedding = embedding_service.encode(query)
        
        distances, indices = index.search(
            np.array([query_embedding]).astype('float32'),
            min(k, index.ntotal)
        )
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.chunks):
                results.append({
                    'text': self.chunks[idx],
                    'metadata': self.metadata[idx],
                    'score': float(distances[0][i])
                })
        return results
    
    def _save_to_disk(self):
        try:
            index = self._get_index()
            faiss.write_index(index, f"{self.persist_path}/index.faiss")
            with open(f"{self.persist_path}/data.pkl", 'wb') as f:
                pickle.dump({
                    'chunks': self.chunks,
                    'metadata': self.metadata
                }, f)
            print(f"✅ Saved {len(self.chunks)} chunks")
        except Exception as e:
            print(f"⚠️ Failed to save: {e}")
    
    def get_documents(self):
        return list(set(m.get('filename', 'unknown') for m in self.metadata))
    
    def total_chunks(self):
        if self.index:
            return self.index.ntotal
        return 0

vector_store = VectorStore()