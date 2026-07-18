from groq import Groq
from app.core.config import config


client = Groq(api_key=config.GROQ_API_KEY)

def generate_answer(question, context_chunks, history):
    
    context_text = "\n\n".join([
        f"From {c['metadata'].get('filename', 'document')}:\n{c['text']}"
        for c in context_chunks
    ])
    
    system_prompt = """You are OpsPilot, a document assistant.

CRITICAL RULES:
1. ONLY answer based on the context provided
2. If answer is NOT in context, say "I don't have information about that"
3. NEVER make up information
4. Be concise and helpful"""

    # User prompt
    user_prompt = f"""
Context:
{context_text}

Question: {question}

Answer (based ONLY on context above):
"""
    
    # Groq API call
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        max_tokens=500
    )
    
    return response.choices[0].message.content