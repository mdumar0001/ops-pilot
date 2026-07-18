

from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text):
  
    return model.encode([text])[0]

# to test(optional)
if __name__ == "__main__":
    test_text = "This is a test"
    embedding = get_embedding(test_text)
    print(f"Text: {test_text}")
    print(f"Embedding shape: {len(embedding)} numbers")
    print(f"First 5 numbers: {embedding[:5]}")