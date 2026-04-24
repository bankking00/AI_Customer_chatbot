from dotenv import load_dotenv
load_dotenv()

from agent.orchestrator import get_agent_executor

def test():
    try:
        executor = get_agent_executor()
        res = executor.invoke({"input": "Hello", "chat_history": []})
        print("Success:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
