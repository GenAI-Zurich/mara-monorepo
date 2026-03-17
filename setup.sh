#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# MARA — One-time catalog setup
# Run this ONCE after first launch to populate Qdrant with product vectors.
# ─────────────────────────────────────────────────────────────────────────────

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'; NC='\033[0m'
info() { echo -e "${GREEN}[SETUP]${NC} $*"; }

cd "$ROOT/mara_backend"

if [ ! -d ".venv" ]; then
  python3.11 -m venv .venv
fi

. .venv/bin/activate
pip install -q -r requirements.txt

info "Step 1/3: Extracting catalog from Supabase..."
python extract_supabase_catalog.py

info "Step 2/3: Indexing products in Qdrant (this downloads ~1.3GB model on first run)..."
python setup_qdrant.py

info "Step 3/3: Enriching products with style/mood/finish..."
python enrich_products.py

deactivate

echo ""
echo -e "  ${GREEN}Setup complete!${NC}"
echo "  Run ./start.sh to launch the full N2N system."
echo ""
