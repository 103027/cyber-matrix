from config.gemini_config import get_gemini_model
from config.qdrant_config import qdrant_client
from embeddings.embedding_model import get_embeddings_model
from app.memory.memory_store import memory
from langchain_qdrant import Qdrant
from langchain.schema import HumanMessage
import google.generativeai as genai

def query_text_document(user_message: str, num_chunks: int = 5, collection_name: str = "my_text_collection"):
    
    try:
        print("==> Getting embedding model")
        embeddings_model = get_embeddings_model()

        print("==> Creating retriever")
        retriever = Qdrant(
            client=qdrant_client,
            collection_name=collection_name,
            embeddings=embeddings_model
        ).as_retriever(search_type="similarity", search_kwargs={"k": num_chunks})
        print("==> Retrieving documents")
        search_results = retriever.get_relevant_documents(user_message)
        print("==> Getting project context")
        project_context = "\n\n".join([doc.page_content for doc in search_results])

        print("==> Loading chat history")
        chat_history = memory.load_memory_variables({})["chat_history"]
        print("==> Converting chat history to string")
        chat_history_str = "\n".join([
            f"Human: {msg.content}" if isinstance(msg, HumanMessage) else f"Assistant: {msg.content}"
            for msg in chat_history
        ])

        print("==> Generating prompt")
        prompt = f"""You are a chatbot that only answers based on the following project details:
---
{project_context}
---
If the user asks anything outside this document, reply with: "I don't have information about it."
User Query: {user_message}"""

        print("==> Getting Gemini model")
        model = get_gemini_model()

        print("==> Generating response")
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
                candidate_count=1,
                max_output_tokens=2048,
                top_p=0.95,
            )
        )

        MAX_TOKENS = 4000

        # Estimate total token length of chat history + current input
        total_tokens = sum(len(msg.content) for msg in chat_history if hasattr(msg, "content")) + len(user_message)

        if total_tokens > MAX_TOKENS:
            print("Resetting memory due to token limit.")
            memory.chat_memory.clear()
            chat_history = []

        print("==> Saving chat history")
        memory.save_context({"input": user_message}, {"output": response.text})

        print("==> Returning response")
        return {
            "query": user_message,
            "response": response.text,
            "chunks_used": len(search_results),
            "metadata": [doc.metadata for doc in search_results]
        }

    except Exception as e:
        return {
            "query": user_message,
            "response": f"An error occurred: {str(e)}",
            "chunks_used": 0,
            "metadata": []
        }