#!/usr/bin/env bash
# Regenerates dws10.com/feeds/local-inventory.tsv from products.json
# and mirrors to landing-pages/dws10-com/feeds/.
# Auto-discovered by DGX Spark day-runner — runs daily 03:00-06:00 UTC.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "[local-inventory] Generating feed..."
node "$REPO_ROOT/dws10.com/feeds/generate-local-inventory.cjs"

cp "$REPO_ROOT/dws10.com/feeds/local-inventory.tsv" \
   "$REPO_ROOT/landing-pages/dws10-com/feeds/local-inventory.tsv"

echo "[local-inventory] Synced to landing-pages/dws10-com/feeds/"
echo "[local-inventory] Done — https://dws10.com/feeds/local-inventory.tsv"
