

import uuid

# Sab sessions store karne ke liye dictionary
sessions = {}

def get_or_create_session(session_id=None):
    """give Session ID do, aif it is not there then create new session ID"""
    if not session_id:
        session_id = str(uuid.uuid4())
    
    if session_id not in sessions:
        sessions[session_id] = []
    
    return session_id

def add_message(session_id, role, content):
    """add mesdage to conversation history"""
    if session_id not in sessions:
        sessions[session_id] = []
    
    sessions[session_id].append({
        "role": role,
        "content": content
    })
    
    # keep only the last 10 messages (memory limit)
    if len(sessions[session_id]) > 10:
        sessions[session_id] = sessions[session_id][-10:]

def get_history(session_id):
    """give conversation history for a session"""
    return sessions.get(session_id, [])