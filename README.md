AI Customer Support Assistant



## 🏗️ Architecture

This project perfectly simulates how modern AI engineering is handled—bridging unstructured dynamic data (RAG) and structured logic (Function Calling/Tools) together into one powerful Agent.

*   **The Brain**: The LangChain Agent (`orchestrator.py`) utilizes the blazing-fast `llama-3.1-8b-instant` model hosted by **Groq**. 
*   **The Library (RAG)**: A completely offline FAISS Vector Database (`rag/retriever.py`) powered by HuggingFace embeddings (`all-MiniLM-L6-v2`) reads from local `.txt` documents to answer policy questions with **Zero Hallucinations**.
*   **The Hands (Tools)**: Custom Python functions allow the LLM to directly interact with our local database (`orders.json` and `tickets.json`) to read shipping statuses and open new support tickets dynamically.
*   **The Face (Frontend)**: A heavily stylized, ultra-premium React chat interface built with Vite (`frontend/`) operating seamlessly over an unlocked CORS FastAPI pipeline.

---
