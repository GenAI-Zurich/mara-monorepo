# ─────────────────────────────────────────────────────────────────────────────
# MARA — N2N Makefile
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: help up down logs backend frontend index enrich audit dev-backend dev-frontend

help:
	@echo ""
	@echo "  MARA — N2N Commands"
	@echo ""
	@echo "  make up              — start all services (Docker)"
	@echo "  make down            — stop all services"
	@echo "  make logs            — tail logs from all services"
	@echo ""
	@echo "  make index           — extract catalog from Supabase + index in Qdrant"
	@echo "  make enrich          — backfill style/mood/finish on indexed products"
	@echo "  make audit           — run Qdrant health check"
	@echo ""
	@echo "  make dev-backend     — run backend locally (no Docker)"
	@echo "  make dev-frontend    — run frontend locally (no Docker)"
	@echo ""

# ── Docker ───────────────────────────────────────────────────────────────────

up:
	docker compose up --build -d
	@echo ""
	@echo "  Frontend  → http://localhost:8080"
	@echo "  Backend   → http://localhost:8001"
	@echo "  Qdrant    → http://localhost:6333"
	@echo ""

down:
	docker compose down

logs:
	docker compose logs -f

# ── One-time setup (run after 'make up') ─────────────────────────────────────

index:
	@echo "Extracting catalog from Supabase..."
	docker compose exec backend python extract_supabase_catalog.py
	@echo "Indexing products in Qdrant..."
	docker compose exec backend python setup_qdrant.py

enrich:
	docker compose exec backend python enrich_products.py

audit:
	docker compose exec backend python audit_embeddings.py

# ── Local dev (without Docker) ────────────────────────────────────────────────

dev-backend:
	cd mara_backend && \
	python3.11 -m venv .venv 2>/dev/null || true && \
	. .venv/bin/activate && \
	pip install -q -r requirements.txt && \
	uvicorn main:app --reload --port 8001

dev-frontend:
	cd braight && npm install && npm run dev
