from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv

from agent.orchestrator import get_agent_executor

# Load environment variables (e.g. GROQ_API_KEY)
load_dotenv()

app = FastAPI(
    title="AI Customer Support Assistant API",
    description="FastAPI orchestrator that routes user queries to a Groq LLM with RAG and custom JSON tools.",
    version="1.0"
)

# Enable CORS for the React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store simple in-memory session history for demonstration
# In production, use Redis or a Database
sessions: Dict[str, List[Any]] = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

agent_executor = get_agent_executor()

@app.get("/")
def read_root():
    return {"message": "Welcome to Nexus AI! Please visit http://127.0.0.1:8000/docs to view the API UI."}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if request.session_id not in sessions:
        sessions[request.session_id] = []
        
    chat_history = sessions[request.session_id]
    
    try:
        # Run agent
        result = agent_executor.invoke({
            "input": request.message,
            "chat_history": chat_history
        })
        
        output = result.get("output", "I'm sorry, I could not process that request.")
        
        # Manually updating a simple chat history list
        chat_history.append(("human", request.message))
        chat_history.append(("ai", output))
        
        # Keep only last 10 messages for context
        sessions[request.session_id] = chat_history[-10:]
        
        return ChatResponse(response=output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
