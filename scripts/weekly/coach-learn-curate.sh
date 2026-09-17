#!/usr/bin/env bash
# Weekly Coach + Learn Curate / Sync — DGX Spark primary runtime.
#
# Auto-discovered by infrastructure/dgx-spark/day-runner.sh (runs once per week).
#
# Delegates to scripts/weekly/coach-learn-curate.cjs, which:
#   1. Renders pinned external sources (cover letter, brochure) → Learn/ HTML.
#   2. Versions Coach/ per customer (archives superseded offers) and renders the
#      newest offers → Learn/ HTML, reading each offer's COACH-META block.
#   3. Archives superseded Learn/ versions (and *_OLD) into Learn/Archive/ and
#      renders any newest *.md lacking an HTML rendering.
#   4. Rebuilds Learn/start.html (index of all current Learn material).
#
# Nothing is ever deleted — only moved. Idempotent; safe to re-run.

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

echo "[coach-learn-curate] start $(date -u +%Y-%m-%dT%H:%M:%SZ)"
node scripts/weekly/coach-learn-curate.cjs
echo "[coach-learn-curate] done"
