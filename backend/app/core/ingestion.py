
import io
from PyPDF2 import PdfReader
from .chunking import chunk_text

def process_pdf(pdf_content, filename):
    """
    PDF processing : text extract + chunks making with metadata.
    
    Args:
        pdf_content: PDF file ka data (bytes)
        filename: PDF name
    
    Returns:
        List of chunks with metadata
    """
    
    pdf_file = io.BytesIO(pdf_content)
    reader = PdfReader(pdf_file)
    
    # Sab pages se text nikaalo
    full_text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            full_text += page_text + "\n"
    
    # make Chunks 
    raw_chunks = chunk_text(full_text)
    
    #  prepare chunks with metadata
    result = []
    for i, chunk in enumerate(raw_chunks):
        result.append({
            "text": chunk,
            "metadata": {
                "filename": filename,
                "chunk_index": i,
                "total_chunks": len(raw_chunks)
            }
        })
    
    return result