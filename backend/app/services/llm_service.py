from groq import Groq
from app.core.config import config

client = Groq(api_key=config.GROQ_API_KEY)

def generate_answer(question, context_chunks, history):
    
    context_text = "\n\n".join([
        f" SOURCE: {c['metadata'].get('filename', 'document')}\n{c['text']}"
        for c in context_chunks
    ])
    
    history_text = ""
    if history:
        history_text = "\nPREVIOUS CONVERSATION:\n"
        for msg in history[-6:]:
            role = "User" if msg['role'] == 'user' else "Assistant"
            history_text += f"{role}: {msg['content']}\n"
    
    system_prompt = """You are OpsPilot, an AI-powered Document Intelligence Assistant.

Rules:
1. ONLY answer based on the context provided
2. If answer is NOT in context, reply: "I don't have information about that in the uploaded documents."
3. NEVER make up information
4. Mention the source document name(s) at the end
5. Use history for follow-up questions"""
    
    user_prompt = f"""
CONTEXT:
{context_text}

{history_text}

QUESTION: {question}

ANSWER:
"""
    
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        model=config.GROQ_MODEL,
        temperature=0.1,
        max_tokens=500
    )
    
    return response.choices[0].message.content