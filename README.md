<div align="center">

# MARA
### Memory-Augmented Retail Agent

**Constraint-Preserving Architecture for Long-Term Retail Reasoning**

[![Qdrant](https://img.shields.io/badge/Vector_DB-Qdrant_Cloud-EF3D4E?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNlZjNkNGUiLz48cGF0aCBkPSJNOCA4aDhsLTQgOC00LTh6IiBmaWxsPSIjZmZmIi8+PC9zdmc+&logoColor=white)](https://qdrant.tech/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/LLM_Inference-Groq-F55036?style=for-the-badge&logoColor=white)](https://groq.com/)
[![Llama](https://img.shields.io/badge/Model-Llama_3.3_70B-7F77DD?style=for-the-badge&logoColor=white)](https://ai.meta.com/llama/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-1D9E75?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![BGE](https://img.shields.io/badge/Embeddings-BGE_large_en_v1.5-378ADD?style=for-the-badge&logoColor=white)](https://huggingface.co/BAAI/bge-large-en-v1.5)
[![React](https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Language-Python_3.9+-3572A5?style=for-the-badge&logo=python&logoColor=FFD845)](https://www.python.org/)

<br/>

> **MARA reduces constraint violation rates from ~37% (baseline RAG) to ~4%** — a 9× improvement in long-term simulated retail environments.

<br/>

| 5,171 Products indexed | 1,024 Vector dimensions | 3 Memory strata |
|:---:|:---:|:---:|

</div>

---

## About the Project

Modern e-commerce recommendation systems are optimized for engagement — not for respecting what users actually told them. A user searches for a desk lamp under **CHF 120**, briefly browses premium items, and within minutes the system is confidently suggesting products at CHF 400+. Most pipelines prioritize semantic similarity or recency over invariant constraints.

We call this **constraint drift** — and it's the problem MARA is built to solve.

> *What if an AI shopping assistant could remember your preferences like a human — while never forgetting your hard constraints?*

**MARA (Memory-Augmented Retail Agent)** treats memory not just as data to retrieve, but as a *reparameterized retrieval space* where constraint safety is mathematically guaranteed. The current implementation covers a real catalog of **5,171 N2N Lighting products**, with users interacting through a natural-language chat interface.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LAYER 0 — USER INTERFACE                                               │
│  braight/ (React 18 · Vite · TypeScript · shadcn/ui)                   │
│  ChatWindow.tsx → maraApi.ts → POST /chat · /extract · /browse          │
│  Supabase JS client → product images + auth                             │
└────────────────────────┬────────────────────────────────────────────────┘
                         │  REST / JSON over HTTP
┌────────────────────────▼────────────────────────────────────────────────┐
│  LAYER 1 — AGENT ORCHESTRATION  :8001                                   │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Extractor  │  │  Retriever  │  │   Ranker    │  │  Generator  │  │
│  │   Agent     │  │   Agent     │  │   Agent     │  │   Agent     │  │
│  │ JSON mode   │  │ Qdrant ×2   │  │ Python math │  │ Groq + hist │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Memory Agent (cross-cutting) — user_memory.py                  │   │
│  │  save_constraints · save_preference · save_browse · get_context │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────┬────────────────────────────────────┬────────────────────┘
               │ embed · query · retrieve            │ hydrate articles
┌──────────────▼──────────────┐      ┌──────────────▼──────────────────┐
│  LAYER 2 — DATA             │      │  LAYER 3 — LLM REASONING        │
│                             │      │                                  │
│  Qdrant (Vector DB)         │      │  BGE-large-en-v1.5              │
│  ├ hard_constraints         │      │  text → 1024-dim vector          │
│  │  price · watt · kelvin   │      │  ~20 ms CPU · ~1.3 GB cached    │
│  ├ soft_preferences         │      │                                  │
│  │  style · mood · finish   │      │  Groq · llama-3.3-70b           │
│  └ user_memory              │      │  ① constraint extraction        │
│    structural/semantic/     │      │  ② response generation          │
│    episodic                 │      │  ③ history summarization        │
│                             │      │  temp=0.6 · max_tokens=400      │
│  Supabase (PostgreSQL)      │      │                                  │
│  ├ articles (5,171 items)   │      └──────────────────────────────────┘
│  ├ wishlists · projects     │
│  ├ auth.users               │
│  └ product_interactions     │
└─────────────────────────────┘
```

---

## Core Innovation: Memory Architecture

Traditional RAG computes `Score = Similarity(query, product)`. MARA modifies the retrieval geometry itself:

$$\text{FinalScore} = \text{Similarity}(q, p) \times W_{structural} \times e^{-\lambda t}$$

Where `W_structural = 1.0` if all hard constraints pass, `0.0` otherwise — making budget violations **mathematically impossible** at the retrieval level.

### The Three Memory Strata

| Memory Type | What It Stores | Decay λ | Half-Life | Behavior |
|---|---|:---:|:---:|---|
| 🏗 **Structural** | Budget, wattage, material, location | `0.01` | ≈ 70 days | Nearly permanent. Hard constraints are enforced as a binary gate — never violated regardless of browsing history. |
| 🎨 **Semantic** | Style, mood, finish, brand affinity | `0.10` | ≈ 7 days | Fades over weeks. Captured from chat preference reveals and confirmed style chips. |
| ⚡ **Episodic** | Recently viewed products, browsing context | `0.30` | ≈ 2.3 days | Fades within days. Prevents temporary exploration from permanently distorting recommendations. |

```
Strength │ 100%┤══════════════════════════════ structural  λ=0.01
         │  50%┤╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
         │     │╲╲╲╲╲╲╲╲══════════════════════ semantic   λ=0.10
         │     │╲╲╲══════════════════════════ episodic   λ=0.30
         └─────┴──────────────────────────────────────────── days
               0      7      14      30      60      90
```

---

## RAG Pipeline

Every `/chat` request executes a 6-step pipeline:

```
User query
    │
    ▼ 1. ENCODE
    embed(query) → [0.031, -0.142, 0.887, ...] — 1024-dim BGE vector
    │
    ├──────────────────────┬──────────────────────┐
    ▼                      ▼                      │
2a. soft_preferences   2b. hard_constraints       │
    cosine sim only        pre-filter:             │
    top_k = 5              price_chf ≤ budget      │
    → baseline feel        + cosine sim            │
                           top_k = 15              │
    └──────────────────────┘                       │
                    │  merge                       │
                    ▼                              │
              3. RERANKER                          │
              _fetch_and_score()                   │
                                                   │
              final = (sim × decay)                │
                      × constraint_w               │
                      + pref_boost                 │
              → top 5 ScoredProducts               │
                    │                              │
                    ▼                              │
              4. MEMORY RETRIEVAL ◄────────────────┘
              get_user_context()
              top 5 structural + 5 semantic + 3 episodic
              each score × e^(-λ × days)
                    │
                    ▼
              5. LLM GENERATION
              Groq llama-3.3-70b
              system: build_llm_prompt(memory, results, baseline)
              + conversation history (max 12 turns)
                    │
                    ▼
              6. HYDRATION
              Supabase articles WHERE id IN (ordered_ids)
              → hero_image_url, descriptions, prices
```

### Scoring Formula

```python
# mara_engine._fetch_and_score()

# Hard gate — constraint enforcement
constraint_w = 1.0 if (
    price <= budget and
    wattage <= max_wattage and
    material not in excluded_materials
) else 0.0

# Soft boost — temporally decayed preference signals
pref_boost = (style_match  * 0.15 * style_decay)
           + (finish_match * 0.10 * finish_decay)
           + (mood_match   * 0.05)

# Final score
final_score = (cosine_sim * semantic_decay) * constraint_w + pref_boost
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Vector DB** | [Qdrant Cloud](https://qdrant.tech/) | Dual-collection vector search — `hard_constraints` + `soft_preferences` + `user_memory` |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) | Agent orchestration, async request handling, session state |
| **LLM Inference** | [Groq](https://groq.com/) | Ultra-fast inference — constraint extraction + response generation |
| **Language Model** | Llama 3.3-70B | Conversational reasoning, JSON constraint parsing, history summarization |
| **Embeddings** | [BGE-large-en-v1.5](https://huggingface.co/BAAI/bge-large-en-v1.5) | 1024-dim vectors, multilingual, ~20 ms CPU inference |
| **Database** | [Supabase](https://supabase.com/) | Product catalog (5,171 items), auth, wishlists, interactions |
| **Frontend** | React 18 + Vite + TypeScript | Chat UI, constraint chips, product carousel |
| **Styling** | shadcn/ui + Tailwind CSS | Component library |
| **Deployment** | Render | Backend hosting |

---

## Setup & Installation

### Prerequisites

- Python 3.9+
- Qdrant Cloud cluster
- Supabase project
- Groq API key

### 1. Clone & install

```bash
git clone <repository-url>
cd mara-backend
pip install fastapi qdrant-client sentence-transformers \
            python-dotenv requests uvicorn supabase groq
```

### 2. Environment variables

```env
# .env
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### 3. One-time setup pipeline

```bash
bash setup.sh

# Or run steps individually:
python extract_supabase_catalog.py   # → catalog_export.json (5,171 products)
python validate_catalog.py           # check field coverage before indexing
python setup_qdrant.py               # embed + upsert hard_constraints + soft_preferences
python enrich_products.py            # infer missing style/mood/finish fields
python audit_embeddings.py           # verify semantic search quality with test queries
```

### 4. Start the backend

```bash
python main.py
# Server running on http://0.0.0.0:8001
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Main chat. Body: `{"user_id": "guest_abc", "message": "warm pendant under 150 CHF"}`. Returns reply + `hydration.ordered_article_ids`. |
| `POST` | `/extract` | Extract constraints from a message via Groq JSON mode. Returns `[{field, label, value}]`. |
| `POST` | `/browse` | Log a product view. Saves episodic memory (λ=0.30) for the user. |
| `POST` | `/constraints` | Confirm a constraint chip. Saves structural memory (λ=0.01) for the user. |
| `DELETE` | `/memory/{user_id}` | Reset all memory for a user. |

### Example request

```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"user_id": "guest_abc123", "message": "show me a warm pendant lamp under 150 CHF"}'
```

```json
{
  "reply": "Here are three warm pendants that fit your CHF 150 budget...",
  "hydration": {
    "ordered_article_ids": [4821, 3307, 5012]
  },
  "constraints_active": {
    "max_budget_chf": 150,
    "kelvin_range": "2700-3000"
  }
}
```

---

## Data Storage

```
Qdrant (Cloud)
├── hard_constraints     5,171 vectors × 1024-dim
│   payloads: name, price_chf, wattage, kelvin, material, location
│   indices:  price_chf (FLOAT), wattage (FLOAT), inside/outside (BOOL)
│
├── soft_preferences     5,171 vectors × 1024-dim
│   payloads: name, style, finish, mood, description, tags
│
└── user_memory          grows per user, never capped
    payloads: user_id, memory_type, text, timestamp, lambda
    indices:  user_id (KEYWORD), memory_type (KEYWORD)

Supabase (PostgreSQL)
├── articles             id, l_number, descriptions (DE), hero_image_url,
│                        price_sp_chf, price_pp_chf, classification, is_current
├── wishlists
├── projects
├── product_interactions (search · view · add-to-cart analytics)
└── auth.users

FastAPI in-memory (lost on restart)
├── constraints_store    dict[user_id → UserConstraints]
├── browsing_store       dict[user_id → list[{product_id, name, ts}]]
├── style_timestamp_store
└── conversation_store   dict[user_id → list[{role, content}]]  max 12 msgs
```

---

## Evaluation

MARA includes a dedicated evaluation pipeline using **LLM-as-a-Judge** methodology:

| Metric | Baseline RAG | MARA | Improvement |
|---|:---:|:---:|:---:|
| Constraint violation rate | ~37% | ~4% | **9×** |
| Budget retention (6-month sim.) | 63% | 96% | +33 pp |
| Semantic coherence score | — | measured per cohort | — |

Evaluation axes:
1. **Numerical Stability** — accuracy of budget/size retention across a simulated 6-month journey
2. **Context Coherence** — reasoning consistency as conversation history grows
3. **Retrieval Precision** — re-ranking accuracy of the reparameterized scoring function

---

## Challenges

**Memory Decay Engine** — Standard RAG pipelines use static cosine similarity. Adding dynamic temporal weighting required redesigning the scoring function from scratch: similarity × constraint weight × per-type exponential decay in a single pass, without adding latency.

**Hard constraint enforcement** — Combining probabilistic vector search with deterministic numeric pre-filtering at the Qdrant query level (not as a post-processing step) required extensive testing to guarantee that invalid products never enter the candidate pool — not just get filtered out afterward.

**Pipeline latency** — Keeping `Frontend → FastAPI → BGE → Qdrant → Groq → Supabase → Frontend` under a conversational response threshold required async design throughout `mara_engine.py` and strategic model caching (the 1.3 GB BGE model loads once and stays resident).

---

## What's Next

- **Multi-domain expansion** — Fashion, electronics, furniture, real estate. The memory architecture is catalog-agnostic.
- **Multimodal search** — Upload a room photo; vision models extract style features and update semantic memory automatically.
- **Shopify plugin** — Any online store deploys a memory-safe AI assistant without building custom AI infrastructure.
- **Live eval dashboard** — Real-time monitoring of constraint violation rates, memory decay curves, and retrieval precision per user cohort.

---

## Project Structure

```
mara-backend/
├── main.py                      # FastAPI app, endpoints, agent routing
├── mara_engine.py               # Retriever + Ranker agents, scoring logic
├── user_memory.py               # Memory agent — all 3 strata + retrieval
├── embeddings.py                # BGE-large wrapper, batch embedding
├── setup/
│   ├── extract_supabase_catalog.py
│   ├── validate_catalog.py
│   ├── setup_qdrant.py
│   ├── enrich_products.py
│   └── audit_embeddings.py
└── .env

braight/                         # React frontend
├── src/
│   ├── ChatWindow.tsx
│   ├── maraApi.ts
│   └── components/
└── vite.config.ts
```

---

<div align="center">

**MARA** · N2N Lighting · 2026 · *Qdrant GenAI in Retail Hackathon*

</div>
