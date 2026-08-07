
# def chunk_text(text, chunk_size=500, overlap=50):
  
#     chunks = []
    

#     for i in range(0, len(text), chunk_size - overlap):
#         chunk = text[i:i + chunk_size]
        
       
#         if len(chunk.strip()) > 50:
#             chunks.append(chunk.strip())
    
#     return chunks
from app.core.config import settings

def recursive_chunk_text(text: str, chunk_size: int = settings.CHUNK_SIZE, overlap: int = settings.CHUNK_OVERLAP) -> list[str]:
    """
    Splits text into chunks using paragraph and line breaks to preserve context.
    """
    separators = ["\n\n", "\n", " ", ""]
    
    def split_text(text: str, separators: list[str]) -> list[str]:
        if not text:
            return []
        if len(text) <= chunk_size:
            return [text]
            
        sep = separators[-1]
        for s in separators:
            if s in text:
                sep = s
                break
                
        splits = text.split(sep) if sep != "" else list(text)
        chunks = []
        current_chunk = []
        current_length = 0
        
        for split in splits:
            split_len = len(split) + len(sep)
            if current_length + split_len > chunk_size and current_chunk:
                joined = sep.join(current_chunk)
                chunks.append(joined)
                # handle overlap
                overlap_len = 0
                overlap_chunk = []
                for item in reversed(current_chunk):
                    if overlap_len + len(item) <= overlap:
                        overlap_chunk.insert(0, item)
                        overlap_len += len(item)
                    else:
                        break
                current_chunk = overlap_chunk
                current_length = sum(len(x) for x in current_chunk)
                
            current_chunk.append(split)
            current_length += split_len
            
        if current_chunk:
            chunks.append(sep.join(current_chunk))
            
        return chunks

    return split_text(text, separators)