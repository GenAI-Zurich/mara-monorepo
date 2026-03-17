# MARA — N2N Integration Guide

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  braight (React/Vite)  :8080                             │  │
│  │                                                          │  │
│  │  ChatWindow → POST /extract  (constraint detection)      │  │
│  │            → POST /chat      (MARA recommendation)       │  │
│  │            → POST /browse    (episodic memory)           │  │
│  │            → POST /constraints (hard constraint save)    │  │
│  │                                                          │  │
│  │  Product cards hydrated from Supabase using              │  │
│  │  source_article_id returned by MARA                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────┬──────────────────────┘
                    │ HTTP                 │ HTTP
                    ▼                      ▼
     ┌──────────────────────┐   ┌─────────────────────┐
     │  mara_backend        │   │  Supabase            │
     │  FastAPI  :8001      │   │  (product catalog)   │
     │                      │   │                      │
     │  /chat  /extract     │   │  articles            │
     │  /constraints        │   │  profiles            │
     │  /browse             │   │  wishlists/projects  │
     │  /debug/*            │   │  product_interactions│
     └──────────┬───────────┘   └─────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
  ┌──────────┐    ┌──────────────┐
  │  Qdrant  │    │  Groq API    │
  │  :6333   │    │  Llama 3.3   │
  │          │    │  70B         │
  │ hard_    │    └──────────────┘
  │ constraints
  │ soft_    │
  │ preferences
  │ user_    │
  │ memory   │
  └──────────┘
```

## Quick Start (Local, no Docker)

### Prerequisites
- Python 3.11+
- Node.js 20+
- A Groq API key → https://console.groq.com
- Qdrant Cloud cluster OR local Qdrant (see below)

### 1. Configure backend secrets

Edit `mara_backend/.env`:

```env
# Qdrant Cloud
QDRANT_URL=https://<cluster-id>.<region>.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_api_key

# OR local Qdrant (start with: docker run -p 6333:6333 qdrant/qdrant)
# QDRANT_URL=http://localhost:6333
# QDRANT_API_KEY=

# Groq
GROQ_API_KEY=gsk_your_key_here

# HuggingFace (optional — only needed if model download fails without auth)
HF_TOKEN=

# Supabase — already configured
SUPABASE_URL=https://xgjiulkqwqxprgvlzpld.supabase.co
SUPABASE_ANON_KEY=...
```

### 2. One-time catalog setup (run once)

```bash
./setup.sh
```

This:
1. Extracts the product catalog from Supabase → `catalog_export.json`
2. Embeds all products and indexes them in Qdrant (downloads ~1.3GB model)
3. Enriches products with style/mood/finish metadata

### 3. Start everything

```bash
./start.sh
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:8080        |
| Backend  | http://localhost:8001        |
| API Docs | http://localhost:8001/docs   |
| Qdrant   | http://localhost:6333/dashboard |

---

## Quick Start (Docker Compose)

```bash
# Start all services
make up

# One-time catalog setup
make index
make enrich

# View logs
make logs

# Stop
make down
```

---

## How the N2N Flow Works

1. **User types a message** in the chat (e.g. "warm ceiling light under 300 CHF")
2. **Frontend calls `/extract`** — Groq detects constraints (max_price_chf: 300, kelvin_max: 2700)
3. **Frontend shows constraint chips** — user confirms or skips
4. **Frontend calls `/chat`** — MARA:
   - Embeds the query (BAAI/bge-large-en-v1.5, 1024-dim)
   - Retrieves candidates from Qdrant (hard_constraints + soft_preferences)
   - Applies constraint filtering (wattage, price, kelvin, location)
   - Applies preference boosts (style, finish, mood with exponential decay)
   - Loads user memory from Qdrant (structural/semantic/episodic)
   - Generates LLM reply via Groq
   - Returns ranked products + hydration metadata
5. **Frontend hydrates products** from Supabase using `source_article_id`
6. **Frontend renders** MARA-ranked product cards with full Supabase data
7. **User clicks a product** → `/browse` saves it as episodic memory in Qdrant
8. **Next query** uses accumulated memory for better personalization

---

## Environment Variables Reference

### `mara_backend/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `QDRANT_URL` | Yes | Qdrant cluster URL |
| `QDRANT_API_KEY` | Cloud only | Qdrant API key |
| `GROQ_API_KEY` | Yes | Groq LLM API key |
| `HF_TOKEN` | No | HuggingFace token |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `CORS_ORIGINS` | No | Additional CORS origins (comma-separated) |

### `braight/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon key |
| `VITE_MARA_BASE_URL` | Yes | MARA backend URL (default: http://localhost:8001) |

---

## Folder Structure

```
START/
├── braight/              ← Frontend (React/Vite)
│   ├── src/
│   │   ├── lib/maraApi.ts     ← MARA API client
│   │   ├── pages/Index.tsx    ← Main page + MARA integration
│   │   └── components/        ← UI components
│   └── .env                   ← Frontend secrets
│
├── mara_backend/         ← Backend (FastAPI)
│   ├── main.py                ← API endpoints
│   ├── mara_engine.py         ← Retrieval + reranking
│   ├── user_memory.py         ← Qdrant memory persistence
│   ├── embeddings.py          ← BAAI/bge-large-en-v1.5
│   ├── extract_supabase_catalog.py ← Catalog extraction
│   ├── setup_qdrant.py        ← Qdrant indexing
│   ├── enrich_products.py     ← Style/mood enrichment
│   └── .env                   ← Backend secrets
│
├── Mara/                 ← Old prototype (not used)
│
├── docker-compose.yml    ← Full N2N Docker setup
├── Makefile              ← Common commands
├── start.sh              ← Local startup (no Docker)
├── setup.sh              ← One-time catalog setup
└── N2N.md                ← This file
```
