import os
import time
import math
import numpy as np
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

load_dotenv()

# --- MARA PROPOSAL CORE CONSTANTS ---
# λ (Lambda) values for exponential decay
DECAY_RATES = {
    "structural": 0.01,
    "semantic":   0.10,
    "episodic":   0.30
}

# Base weights for different memory strata (α)
# Structural (Hard Constraints) get the highest priority multiplier
STRATA_WEIGHTS = {
    "structural": 1.0,
    "semantic":   0.8,
    "episodic":   0.6
}

class MARARetriever:
    def __init__(self):
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )

    def decay_factor(self, memory_type: str, timestamp: float) -> float:
        """
        Implementation of: e^(-λ * t_days)
        """
        t_days = (time.time() - timestamp) / (24 * 3600)
        λ = DECAY_RATES.get(memory_type, 0.1)
        return math.exp(-λ * t_days)

    def compute_final_score(self, similarity: float, memory_type: str, timestamp: float) -> float:
        """
        MARA Formula: FinalScore = Similarity * StructuralWeight * Decay
        """
        decay = self.decay_factor(memory_type, timestamp)
        alpha = STRATA_WEIGHTS.get(memory_type, 0.7)
        
        return similarity * alpha * decay

    def get_contextual_memory(self, user_query, user_id):
        query_vector = self.model.encode(user_query).tolist()
        
        # 1. Fetch Structural Constraints (Hard Rules)
        structural_results = self.client.query_points(
            collection_name="structural_memory",
            query=query_vector,
            limit=3
        ).points
        
        # 2. Fetch Semantic/Episodic Memories (Flexible Context)
        semantic_results = self.client.query_points(
            collection_name="semantic_episodic_memory",
            query=query_vector,
            limit=5
        ).points
        
        all_memories = []

        # Process results with Reparameterized Scoring
        for res in (list(structural_results) + list(semantic_results)):
            m_type = res.payload.get("decay_class", "semantic")
            ts = res.payload.get("timestamp", time.time())
            
            # --- APPLY MARA GEOMETRY ---
            final_score = self.compute_final_score(res.score, m_type, ts)
            
            all_memories.append({
                "text": res.payload.get("description") or res.payload.get("text"),
                "type": m_type,
                "original_similarity": res.score,
                "weighted_score": final_score
            })
            
        # Re-rank based on the new weighted score
        return sorted(all_memories, key=lambda x: x['weighted_score'], reverse=True)

if __name__ == "__main__":
    retriever = MARARetriever()
    memories = retriever.get_contextual_memory("Suggest a desk lamp", "nursena_dev")
    
    print("\n--- MARA RE-PARAMETERIZED RETRIEVAL ---")
    print(f"{'TYPE':<12} | {'FINAL SCORE':<12} | {'CONTENT'}")
    print("-" * 60)
    for m in memories:
        print(f"{m['type'].upper():<12} | {m['weighted_score']:.4f}       | {m['text']}")