#!/usr/bin/env bash
# kb-watch-inbox.sh — Auto-ingest new files dropped into kb/raw/articles/
#
# Auto-discovered by the day-runner per CLAUDE.md "Script Automation Rule".
# Mirrors NanoClaw's scripts/watch-articles.sh, but runs on DGX Spark (or
# wherever the day-runner runs) rather than a Raspberry Pi.
#
# Behaviour:
#   1. Find any new .md / .txt / .pdf in kb/raw/articles/ since the last
#      run (tracked via .last-watch-run sentinel file).
#   2. Pipe each through `dws kb ingest <file>` so the KB agent files them.
#   3. Touch the sentinel.
#
# Idempotent. Safe to run multiple times per day.
#
# Introduced-In: PR-claude/add-playwright-implementation-Rg5Jy (commit 2)
# Code-Version: 1.0.0
# Date: 2026-04-25

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INBOX="$REPO_ROOT/kb/raw/articles"
SENTINEL="$REPO_ROOT/kb/.last-watch-run"

if [ ! -d "$INBOX" ]; then
  echo "[kb-watch] kb/raw/articles/ missing — skipping"
  exit 0
fi

# First run: sentinel doesn't exist → ingest nothing, just record the time
# (avoids re-ingesting the entire historical inbox on first deployment).
if [ ! -f "$SENTINEL" ]; then
  touch "$SENTINEL"
  echo "[kb-watch] First run — sentinel created, no ingestion this pass"
  exit 0
fi

NEW_FILES=$(find "$INBOX" -type f \( -name '*.md' -o -name '*.txt' -o -name '*.pdf' \) \
  -newer "$SENTINEL" 2>/dev/null || true)

if [ -z "$NEW_FILES" ]; then
  echo "[kb-watch] No new files since $(date -r "$SENTINEL" -Iseconds 2>/dev/null || stat -c %y "$SENTINEL")"
  touch "$SENTINEL"
  exit 0
fi

COUNT=0
FAILED=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  echo "[kb-watch] Ingesting: ${f#$REPO_ROOT/}"
  if (cd "$REPO_ROOT" && npx tsx cli/src/cli.ts kb ingest "$f" >/dev/null 2>&1); then
    COUNT=$((COUNT + 1))
  else
    echo "[kb-watch]   ↳ ingest failed (will retry next run)"
    FAILED=$((FAILED + 1))
  fi
done <<< "$NEW_FILES"

echo "[kb-watch] Ingested $COUNT file(s), $FAILED failure(s)"

# Only advance the sentinel if everything succeeded — otherwise failed files
# are retried on the next run.
if [ "$FAILED" -eq 0 ]; then
  touch "$SENTINEL"
fi
