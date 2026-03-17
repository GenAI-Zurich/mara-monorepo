#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# MARA — Local N2N Startup Script
# Runs backend + frontend in separate terminals (no Docker required)
# ─────────────────────────────────────────────────────────────────────────────

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

info()  { echo -e "${GREEN}[MARA]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ── Check .env files ──────────────────────────────────────────────────────────
if [ ! -f "$ROOT/mara_backend/.env" ]; then
  error "mara_backend/.env not found. Copy .env_example and fill in your keys."
fi

GROQ_KEY=$(grep -E "^GROQ_API_KEY" "$ROOT/mara_backend/.env" | cut -d= -f2 | tr -d ' ')
if [[ "$GROQ_KEY" == "gsk_CHANGE_ME" || -z "$GROQ_KEY" ]]; then
  warn "GROQ_API_KEY is not set in mara_backend/.env — LLM replies will be disabled."
fi

# ── Backend venv setup ────────────────────────────────────────────────────────
info "Setting up backend virtualenv..."
cd "$ROOT/mara_backend"
if [ ! -d ".venv" ]; then
  python3.11 -m venv .venv
fi
. .venv/bin/activate
pip install -q -r requirements.txt
deactivate

# ── Frontend deps ──────────────────────────────────────────────────────────────
info "Installing frontend dependencies..."
cd "$ROOT/braight"
npm install --silent

# ── Start services in background ──────────────────────────────────────────────
info "Starting MARA backend on http://localhost:8001 ..."
cd "$ROOT/mara_backend"
. .venv/bin/activate
uvicorn main:app --reload --port 8001 &
BACKEND_PID=$!
deactivate

sleep 2

info "Starting frontend dev server on http://localhost:8080 ..."
cd "$ROOT/braight"
npm run dev &
FRONTEND_PID=$!

# ── Trap CTRL+C ───────────────────────────────────────────────────────────────
cleanup() {
  info "Shutting down..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

echo ""
echo -e "  ${GREEN}Frontend${NC}  → http://localhost:8080"
echo -e "  ${GREEN}Backend${NC}   → http://localhost:8001"
echo -e "  ${GREEN}API Docs${NC}  → http://localhost:8001/docs"
echo ""
echo "  Press CTRL+C to stop all services."
echo ""

wait
