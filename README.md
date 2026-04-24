# 🤖 Nexus AI Customer Support Assistant

<div align="center">
  <p>A full-stack enterprise-grade AI orchestrator built with <strong>FastAPI</strong>, <strong>React</strong>, and the <strong>Groq LLM</strong>.</p>
</div>

---

## 🏗️ Architecture

This project perfectly simulates how modern AI engineering is handled—bridging unstructured dynamic data (RAG) and structured logic (Function Calling/Tools) together into one powerful Agent.

*   **The Brain**: The LangChain Agent (`orchestrator.py`) utilizes the blazing-fast `llama-3.1-8b-instant` model hosted by **Groq**. 
*   **The Library (RAG)**: A completely offline FAISS Vector Database (`rag/retriever.py`) powered by HuggingFace embeddings (`all-MiniLM-L6-v2`) reads from local `.txt` documents to answer policy questions with **Zero Hallucinations**.
*   **The Hands (Tools)**: Custom Python functions allow the LLM to directly interact with our local database (`orders.json` and `tickets.json`) to read shipping statuses and open new support tickets dynamically.
*   **The Face (Frontend)**: A heavily stylized, ultra-premium React chat interface built with Vite (`frontend/`) operating seamlessly over an unlocked CORS FastAPI pipeline.

---

## 🚀 Getting Started

### 1. Configure the AI 
*   Navigate to the `backend/` directory.
*   Rename `.env.example` to `.env`.
*   Paste in your Groq API Key (Free from `console.groq.com`).

### 2. Start the Backend API (FastAPI)
```powershell
cd backend
# Recommended: Create and activate your virtual environment using uv or generic pip
python -m venv .venv
.\.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the server (auto-reloads on changes)
python main.py

# Alternatively, you can explicitly use the uvicorn command:
uvicorn api.main:app --reload
```
*The API will boot at `http://127.0.0.1:8000` (Visit `/docs` to see the backend Swagger UI).*

### 3. Start the Frontend UI (React + Vite)
Open a **new, separate terminal** window:
```powershell
cd frontend
npm install
npm run dev
```
*The Chat Interface will boot at `http://localhost:5173`. Open this in your browser to interact with your AI Assistant!*

---

## 🛠️ Testing the Agent Capabilities

Once everything is running, try asking your Chatbot the following progression:

1.  **"What is your return policy?"** -> *Automatically triggers RAG Document Search.*
2.  **"Where is order ORD123?"** -> *Automatically triggers JSON Order Parsing Tool.*
3.  **"I'd like to return a broken product."** -> *Dynamically generates a new ticket ID and writes it directly to `backend/data/tickets.json`.*

### Tech Stack
*   `Python 3.8.10`
*   `FastAPI` + `Uvicorn`
*   `Langchain` + `Langchain-Groq`
*   `FAISS` (CPU) + `Sentence Transformers`
*   `React` + `Vite`
