
# import io
# from PyPDF2 import PdfReader
# from .chunking import chunk_text

# def process_pdf(pdf_content, filename):
#     """
#     PDF processing : text extract + chunks making with metadata.
    
#     Args:
#         pdf_content: PDF file ka data (bytes)
#         filename: PDF name
    
#     Returns:
#         List of chunks with metadata
#     """
    
#     pdf_file = io.BytesIO(pdf_content)
#     reader = PdfReader(pdf_file)
    
#     # get text from all pages
#     full_text = ""
#     for page in reader.pages:
#         page_text = page.extract_text()
#         if page_text:
#             full_text += page_text + "\n"
    
#     # make Chunks 
#     raw_chunks = chunk_text(full_text)
    
#     #  prepare chunks with metadata
#     result = []
#     for i, chunk in enumerate(raw_chunks):
#         result.append({
#             "text": chunk,
#             "metadata": {
#                 "filename": filename,
#                 "chunk_index": i,
#                 "total_chunks": len(raw_chunks)
#             }
#         })
    
#     return result
import fitz  # PyMuPDF
from app.core.chunking import recursive_chunk_text

def extract_and_chunk_pdf(file_bytes: bytes, filename: str) -> list[dict]:
    """
    Parses PDF bytes, extracts text per page, and splits into chunks with metadata.
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    all_chunks = []

    for page_num in range(len(doc)):
        page_text = doc[page_num].get_text()
        if not page_text.strip():
            continue
            
        page_chunks = recursive_chunk_text(page_text)
        for chunk in page_chunks:
            all_chunks.append({
                "content": chunk,
                "metadata": {
                    "source": filename,
                    "page": page_num + 1
                }
            })

    return all_chunks