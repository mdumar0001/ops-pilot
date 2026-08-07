# from groq import Groq
# from app.core.config import config

# client = Groq(api_key=config.GROQ_API_KEY)

# def generate_answer(question, context_chunks, history):
    
#     context_text = "\n\n".join([
#         f" SOURCE: {c['metadata'].get('filename', 'document')}\n{c['text']}"
#         for c in context_chunks
#     ])
    
#     history_text = ""
#     if history:
#         history_text = "\nPREVIOUS CONVERSATION:\n"
#         for msg in history[-6:]:
#             role = "User" if msg['role'] == 'user' else "Assistant"
#             history_text += f"{role}: {msg['content']}\n"
    
#     system_prompt = """You are OpsPilot, an AI-powered Document Intelligence Assistant.

# Rules:
# 1. ONLY answer based on the context provided
# 2. If answer is NOT in context, reply: "I don't have information about that in the uploaded documents."
# 3. NEVER make up information
# 4. Mention the source document name(s) at the end
# 5. Use history for follow-up questions"""
    
#     user_prompt = f"""
# CONTEXT:
# {context_text}

# {history_text}

# QUESTION: {question}

# ANSWER:
# """
    
#     response = client.chat.completions.create(
#         messages=[
#             {"role": "system", "content": system_prompt},
#             {"role": "user", "content": user_prompt}
#         ],
#         model=config.GROQ_MODEL,
#         temperature=0.1,
#         max_tokens=500
#     )
    
#     return response.choices[0].message.content
from groq import Groq
from app.core.config import settings
from app.models.schemas import ChatMessage, Citation


class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def generate_rag_response(
        self,
        question: str,
        retrieved_docs: list[dict],
        chat_history: list[ChatMessage],
    ) -> tuple[str, list[Citation]]:

        context_parts = []
        citations = []
        seen = set()

        for doc in retrieved_docs:
            context_parts.append(
                f"Document: {doc['source']} (Page {doc['page']})\n{doc['content']}"
            )

            key = (doc["source"], doc["page"])
            if key not in seen:
                seen.add(key)
                citations.append(
                    Citation(
                        source=doc["source"],
                        page=doc["page"],
                    )
                )

        context = "\n\n".join(context_parts)

        if not context.strip():
            return "I cannot find the answer in the uploaded documents.", []

        system_prompt = f"""
You are OpsPilot, a document assistant.

CRITICAL RULES:
1. ONLY answer based on the context provided
2. If answer is NOT in context, say "I don't have information about that"
3. NEVER make up information
4. Be concise and helpful.

Context:
{context}
"""

        messages = [
            {
                "role": "system",
                "content": system_prompt,
            }
        ]

        for msg in chat_history[-6:]:
            messages.append(
                {
                    "role": msg.role,
                    "content": msg.content,
                }
            )

        messages.append(
            {
                "role": "user",
                "content": question,
            }
        )

        try:
            response = self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=0.1,
                max_completion_tokens=1024,
            )

            answer = response.choices[0].message.content

            if not answer:
                answer = "I cannot find the answer in the uploaded documents."

            return answer.strip(), citations

        except Exception as e:
            print(f"Groq API Error: {e}")
            return f"LLM Error: {str(e)}", citations


llm_service = LLMService()