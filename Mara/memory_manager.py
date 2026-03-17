import os
import time
from datetime import datetime
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' # Silences noisy TensorFlow logs
# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

class MARAMemoryManager:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')        
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )

    def _get_embedding(self, text):
        return self.model.encode(text).tolist()

    def add_structural_constraint(self, user_id, constraint_type, value, description):
        """
        Stores hard constraints (λ ≈ 0.01). These are the 'Laws of Physics' for MARA.
        """
        vector = self._get_embedding(description)
        
        self.client.upsert(
            collection_name="structural_memory",
            points=[
                models.PointStruct(
                    id=int(time.time() * 1000), 
                    vector=vector,
                    payload={
                        "user_id": user_id,
                        "type": constraint_type,
                        "value": value,
                        "description": description,
                        "timestamp": time.time(),
                        "decay_class": "structural"
                    }
                )
            ]
        )
        print(f"🔒 [Structural] Locked: {description}")

    def add_interaction(self, user_id, text, memory_type="episodic"):
        """
        Stores interactions. 
        memory_type='semantic' (λ ≈ 0.1) for general preferences.
        memory_type='episodic' (λ ≈ 0.3) for recent browsing noise.
        """
        vector = self._get_embedding(text)
        
        self.client.upsert(
            collection_name="semantic_episodic_memory",
            points=[
                models.PointStruct(
                    id=int(time.time() * 1000),
                    vector=vector,
                    payload={
                        "user_id": user_id,
                        "text": text,
                        "memory_type": memory_type, 
                        "timestamp": time.time(),
                        "decay_class": memory_type
                    }
                )
            ]
        )
        print(f"🧠 [{memory_type.upper()}] Recorded: {text}")

if __name__ == "__main__":
    manager = MARAMemoryManager()
    USER = "nursena_dev"
    
    # Let's populate some test data for MARA
    manager.add_structural_constraint(USER, "budget", 200, "Maximum price 200 CHF")
    manager.add_structural_constraint(USER, "material", "no-plastic", "No plastic fixtures")
    
    manager.add_interaction(USER, "I love mid-century modern aesthetic", "semantic")
    manager.add_interaction(USER, "Just looked at a chrome desk lamp", "episodic")