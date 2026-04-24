import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
VECTOR_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "faiss_index")

def create_retriever():
    """Builds and returns a FAISS retriever based on FAQ and return policy docs."""
    files = ["faq.txt", "return_policy.txt"]
    docs = []
    
    for file in files:
        filepath = os.path.join(DATA_DIR, file)
        assert os.path.exists(filepath), f"{filepath} does not exist."
        loader = TextLoader(filepath)
        docs.extend(loader.load())
        
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    splits = text_splitter.split_documents(docs)
    
    # Using local embeddings to avoid requiring an external API key for embedding
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)
    
    # Save locally to avoid recompiling every time - optional but good practice
    vectorstore.save_local(VECTOR_DB_PATH)
    
    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
    return retriever

def get_retriever():
    """Loads the retriever from disk if it exists, else creates it."""
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    if os.path.exists(VECTOR_DB_PATH):
        vectorstore = FAISS.load_local(VECTOR_DB_PATH, embeddings, allow_dangerous_deserialization=True)
        return vectorstore.as_retriever(search_kwargs={"k": 2})
    return create_retriever()
