
import chromadb
from app.core.embedding import embedding_service

class VectorStoreService:
    def __init__(self):
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(name="opspilot_documents")

    def add_chunks(self, chunks: list[dict]):
        if not chunks:
            return
            
        texts = [c["content"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]
        ids = [f"{c['metadata']['source']}_p{c['metadata']['page']}_{i}" for i, c in enumerate(chunks)]
        embeddings = embedding_service.embed_texts(texts)

        self.collection.add(
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

    def search(self, query: str, top_k: int = 4) -> list[dict]:
        query_embedding = embedding_service.embed_query(query)
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        retrieved_docs = []
        if results and results.get("documents"):
            for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
                retrieved_docs.append({
                    "content": doc,
                    "source": meta["source"],
                    "page": meta["page"]
                })
        return retrieved_docs

vector_store_service = VectorStoreService()