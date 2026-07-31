#!/usr/bin/env bash
# KB Daily Cleanup — auto-discovered by day-runner
#
# Cleans up ephemeral research wikis older than 7 days.
# Ephemeral wikis are created by `dws kb research` for deep research queries.
#
# Introduced-In: PR-TBD
# Code-Version: 1.0
# Date: 2026-04-03

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
EPHEMERAL_DIR="$REPO_ROOT/kb/ephemeral"

# Only run if ephemeral directory exists
if [ ! -d "$EPHEMERAL_DIR" ]; then
  echo "[kb-cleanup] No ephemeral directory — skipping"
  exit 0
fi

# Find and remove directories older than 7 days
CLEANED=0
while IFS= read -r -d '' dir; do
  echo "[kb-cleanup] Removing: $(basename "$dir")"
  rm -rf "$dir"
  CLEANED=$((CLEANED + 1))
done < <(find "$EPHEMERAL_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +7 -print0 2>/dev/null)

if [ "$CLEANED" -gt 0 ]; then
  echo "[kb-cleanup] Cleaned $CLEANED ephemeral wiki(s)"
else
  echo "[kb-cleanup] No stale ephemeral wikis to clean"
fi
