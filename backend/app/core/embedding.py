

from sentence_transformers import SentenceTransformer

# Model loading (it loads the model in memory only once not again and again)
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text):
    """
    converting text to embedding vector.(number)
     Returns:
        Embedding vector (384 numbers ka array)
    """
    return model.encode([text])[0]

# to test(optional)
if __name__ == "__main__":
    test_text = "This is a test"
    embedding = get_embedding(test_text)
    print(f"Text: {test_text}")
    print(f"Embedding shape: {len(embedding)} numbers")
    print(f"First 5 numbers: {embedding[:5]}")