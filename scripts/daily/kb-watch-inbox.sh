#!/usr/bin/env bash
# kb-watch-inbox.sh — Auto-ingest new files dropped into kb/raw/articles/
#
# Auto-discovered by the day-runner per CLAUDE.md "Script Automation Rule".
# Mirrors NanoClaw's scripts/watch-articles.sh, but runs on DGX Spark (or
# wherever the day-runner runs) rather than a Raspberry Pi.
#
# Behaviour:
#   1. Find files in kb/raw/articles/ to ingest.
#      - First run (no sentinel): backfill ALL existing files, capped at
#        $KB_WATCH_MAX_PER_RUN (default 25). Remaining files are picked
#        up in subsequent passes — no manual intervention required.
#      - Subsequent runs: only files newer than the sentinel.
#   2. Pipe each through `dws kb ingest <file>`.
#   3. Advance the sentinel only when every selected file ingested cleanly,
#      so failed files are retried tomorrow.
#
# Idempotent. Safe to run multiple times per day.
#
# Env:
#   KB_WATCH_MAX_PER_RUN   Hard cap on ingestions per pass (default: 25).
#                          Bounds blast radius on a large historical inbox.
#
# Introduced-In: PR-claude/add-playwright-implementation-Rg5Jy (commit 2)
# Code-Version: 1.1.0  (auto-backfill on first run)
# Date: 2026-04-25

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INBOX="$REPO_ROOT/kb/raw/articles"
SENTINEL="$REPO_ROOT/kb/.last-watch-run"
MAX_PER_RUN="${KB_WATCH_MAX_PER_RUN:-25}"

if [ ! -d "$INBOX" ]; then
  echo "[kb-watch] kb/raw/articles/ missing — skipping"
  exit 0
fi

# File selection:
#   - First run: take EVERY file (sorted oldest-first so backfill is
#     deterministic and the cap discards the newest-but-unprocessed tail).
#   - Subsequent runs: only files newer than the sentinel.
if [ ! -f "$SENTINEL" ]; then
  echo "[kb-watch] First run detected — backfilling existing inbox (cap: $MAX_PER_RUN)"
  CANDIDATES=$(find "$INBOX" -type f \( -name '*.md' -o -name '*.txt' -o -name '*.pdf' \) \
    -printf '%T@ %p\n' 2>/dev/null | sort -n | awk '{ $1=""; sub(/^ /, ""); print }')
else
  CANDIDATES=$(find "$INBOX" -type f \( -name '*.md' -o -name '*.txt' -o -name '*.pdf' \) \
    -newer "$SENTINEL" -printf '%T@ %p\n' 2>/dev/null | sort -n | awk '{ $1=""; sub(/^ /, ""); print }')
fi

if [ -z "$CANDIDATES" ]; then
  if [ -f "$SENTINEL" ]; then
    echo "[kb-watch] No new files since $(date -r "$SENTINEL" -Iseconds 2>/dev/null || stat -c %y "$SENTINEL")"
  else
    echo "[kb-watch] First run — inbox is empty"
  fi
  touch "$SENTINEL"
  exit 0
fi

# Apply per-run cap. Anything over the cap stays uningested and is picked
# up next pass (sentinel is NOT advanced when the cap is hit, so the
# remaining files are still considered "newer than sentinel" tomorrow).
TOTAL=$(printf '%s\n' "$CANDIDATES" | wc -l | tr -d ' ')
SELECTED=$(printf '%s\n' "$CANDIDATES" | head -n "$MAX_PER_RUN")
SELECTED_COUNT=$(printf '%s\n' "$SELECTED" | wc -l | tr -d ' ')
CAPPED=$(( TOTAL > SELECTED_COUNT ? 1 : 0 ))

if [ "$CAPPED" -eq 1 ]; then
  echo "[kb-watch] $TOTAL candidate(s); processing first $SELECTED_COUNT this pass"
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
done <<< "$SELECTED"

echo "[kb-watch] Ingested $COUNT file(s), $FAILED failure(s)"

# Advance the sentinel only when (a) nothing failed AND (b) we weren't
# capped — otherwise the remaining files would be hidden behind a fresh
# sentinel and never picked up.
if [ "$FAILED" -eq 0 ] && [ "$CAPPED" -eq 0 ]; then
  touch "$SENTINEL"
elif [ "$CAPPED" -eq 1 ]; then
  echo "[kb-watch] Cap reached — sentinel held back; remaining files will run next pass"
fi
