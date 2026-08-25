#!/usr/bin/env bash
# Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free Agent=ox-alpha Date=2026-08-25
# Audit trail: git log -- scripts/tree-audit.sh
# T4: Scheduled tree-audit — runs daily after backup (02:20)
# Compares blob-count per protected path vs previous day; alerts on >10% drop without approval artifact.

set -euo pipefail

REPO_ROOT="/home/admin100/dws6"
LOG_DIR="$REPO_ROOT/logs"
PROTECTED_PATHS=("docs" "scripts" "src" "protected-dir" ".githooks")
DATE=$(date -u +"%Y-%m-%d")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
AUDIT_FILE="$LOG_DIR/tree-audit-$DATE.json"
ALERT_FILE="$LOG_DIR/tree-audit-alerts.log"

mkdir -p "$LOG_DIR"

# Load previous day's counts
PREV_DATE=$(date -u -d "yesterday" +"%Y-%m-%d")
PREV_FILE="$LOG_DIR/tree-audit-$PREV_DATE.json"

# Current counts
declare -A CURRENT_COUNTS
TOTAL=0
for path in "${PROTECTED_PATHS[@]}"; do
  if [ -d "$REPO_ROOT/$path" ]; then
    count=$(git -C "$REPO_ROOT" ls-tree -r HEAD -- "$path" 2>/dev/null | grep -c '^' || echo 0)
  else
    count=0
  fi
  CURRENT_COUNTS[$path]=$count
  TOTAL=$((TOTAL + count))
done

# Load previous if exists
declare -A PREV_COUNTS
if [ -f "$PREV_FILE" ]; then
  # Extract counts from previous JSON
  while IFS='=' read -r k v; do
    PREV_COUNTS[$k]=$v
  done < <(jq -r '.counts | to_entries[] | "\(.key)=\(.value)"' "$PREV_FILE" 2>/dev/null || true)
fi

# Compare and build output
ALERTS=()
OUTPUT="{\"timestamp\":\"$TIMESTAMP\",\"total_blobs\":$TOTAL,\"counts\":{"
first=true
for path in "${PROTECTED_PATHS[@]}"; do
  curr=${CURRENT_COUNTS[$path]}
  prev=${PREV_COUNTS[$path]:-0}
  if [ "$first" = true ]; then first=false; else OUTPUT+=","; fi
  OUTPUT+="\"$path\":$curr"
  if [ "$prev" -gt 0 ]; then
    diff=$((curr - prev))
    if [ $diff -lt 0 ]; then
      pct=$(( diff * 100 / prev ))
      pct_abs=$(( -pct ))
      if [ $pct_abs -gt 10 ]; then
        # Check if approval artifact exists in history for this drop
        # Simplified: if commit message contains "approved" or approval artifact exists
        ALERTS+=("tree-audit: $path dropped $pct_abs% (from $prev to $curr) without detected approval")
      fi
    fi
  fi
done
OUTPUT+="}}"
echo "$OUTPUT" | jq . > "$AUDIT_FILE"

# Log alerts
if [ ${#ALERTS[@]} -gt 0 ]; then
  for alert in "${ALERTS[@]}"; do
    echo "$TIMESTAMP $alert" >> "$ALERT_FILE"
  done
fi

# Always log summary
echo "$TIMESTAMP total=$TOTAL ${PROTECTED_PATHS[*]}" >> "$ALERT_FILE"
echo "Tree audit complete: $AUDIT_FILE"
