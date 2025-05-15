from langchain_huggingface import HuggingFaceEmbeddings

def get_embeddings_model():
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5",
        model_kwargs={'device': 'cpu'}
    )
