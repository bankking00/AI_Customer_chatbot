import os
from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.prompts import ChatPromptTemplate
from langchain.tools.retriever import create_retriever_tool
from langchain_core.messages import SystemMessage

from rag.retriever import get_retriever
from tools.orders import check_order_status
from tools.tickets import create_ticket, delete_ticket

def get_agent_executor():
    # Initialize the Groq LLM
    # Assumes GROQ_API_KEY environment variable is set.
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
    
    # Setup RAG Tool
    retriever = get_retriever()
    rag_tool = create_retriever_tool(
        retriever,
        "search_company_policy_and_faq",
        "Searches and returns excerpts from the company FAQ and Return Policy. Always use this tool for general questions before answering."
    )
    
    # Combine Tools
    tools = [check_order_status, create_ticket, delete_ticket, rag_tool]
    
    # Define Agent Prompt (Anti-Hallucination)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful customer support assistant. "
                   "IMPORTANT RULES:\n"
                   "1. Use the search_company_policy_and_faq tool for questions about return policies or FAQs. "
                   "2. Answer ONLY using the context provided by your tools. "
                   "3. If the answer is not in the provided documents or tool outputs, clearly state that you do not know. "
                   "4. DO NOT make up tracking links, policies, or order statuses. "
                   "5. For order inquiries, ask for their order ID if they haven't provided one, then use the check_order_status tool."
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    return agent_executor
