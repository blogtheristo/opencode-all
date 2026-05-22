#!/usr/bin/env bash
# KB Daily Lint — auto-discovered by day-runner
#
# Runs the knowledge base health check daily.
# Updates kb/wiki/_stale.md and kb/kb.json with health score.
#
# Introduced-In: PR-TBD
# Code-Version: 1.0
# Date: 2026-04-03

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Only run if kb/ directory exists
if [ ! -d "$REPO_ROOT/kb" ]; then
  echo "[kb-lint] No kb/ directory found — skipping"
  exit 0
fi

# Only run if there are wiki articles to lint
WIKI_COUNT=$(find "$REPO_ROOT/kb/wiki" -name "*.md" -not -name ".gitkeep" 2>/dev/null | wc -l)
if [ "$WIKI_COUNT" -eq 0 ]; then
  echo "[kb-lint] No wiki articles to lint — skipping"
  exit 0
fi

echo "[kb-lint] Running knowledge base health check..."

# Call the KB agent via API (if backend is running)
if curl -s --max-time 5 "http://localhost:8080/health" > /dev/null 2>&1; then
  curl -s --max-time 120 -X POST "http://localhost:8080/api/agents/kb/execute" \
    -H "Content-Type: application/json" \
    -d '{"context":{"projectId":"daily-lint","sessionId":"daily-lint"},"input":{"operation":"lint"}}' \
    | jq -r '.result // "lint completed"' 2>/dev/null || echo "[kb-lint] Lint completed (no jq)"
else
  echo "[kb-lint] Backend not available — skipping API lint"
fi

echo "[kb-lint] Done"
