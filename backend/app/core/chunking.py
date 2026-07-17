
def chunk_text(text, chunk_size=500, overlap=50):
  
    chunks = []
    
    # Har chunk ko overlap ke saath nikalo
    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        
        # Agar chunk 50 characters se bada hai toh store karo
        if len(chunk.strip()) > 50:
            chunks.append(chunk.strip())
    
    return chunks