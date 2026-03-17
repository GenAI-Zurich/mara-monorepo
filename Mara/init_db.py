import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http import models

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Configuration
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
VECTOR_SIZE = 384 

def initialize_mara_storage():
    """
    Initializes the two core memory collections for MARA:
    1. Structural: For hard constraints (Budget, Size, Material).
    2. Semantic/Episodic: For evolving style preferences and browsing history.
    """
    
    if not QDRANT_URL or not QDRANT_API_KEY:
        print("Error: QDRANT_URL or QDRANT_API_KEY not found in .env file.")
        return

    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

    # 1. Structural Memory Collection (λ ≈ 0.01 - Invariants)
    print("Creating 'structural_memory' collection...")
    client.recreate_collection(
        collection_name="structural_memory",
        vectors_config=models.VectorParams(
            size=VECTOR_SIZE, 
            distance=models.Distance.COSINE
        ),
    )
    print("OK: 'structural_memory' initialized.")

    # 2. Semantic & Episodic Memory Collection (λ ≈ 0.1 to 0.3 - Adaptive)
    print("Creating 'semantic_episodic_memory' collection...")
    client.recreate_collection(
        collection_name="semantic_episodic_memory",
        vectors_config=models.VectorParams(
            size=VECTOR_SIZE, 
            distance=models.Distance.COSINE
        ),
    )
    print("OK: 'semantic_episodic_memory' initialized.")

if __name__ == "__main__":
    initialize_mara_storage()
    print("\n--- MARA Database Initialization Complete ---")