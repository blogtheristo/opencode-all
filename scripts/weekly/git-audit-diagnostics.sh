#!/usr/bin/env bash
# git-audit-diagnostics.sh — Weekly git health audit (5 diagnostic commands)
#
# Auto-discovered by day-runner.sh (weekly folder convention).
# Runs every Sunday ~04:00 UTC on DGX Spark.
#
# What it does:
#   1. Churn hotspots — most-changed files in the last year
#   2. Bus factor — contributor concentration (all-time + 6-month window)
#   3. Bug hotspots — files touched in fix/bug/broken commits
#   4. Velocity — commit count by month (full history)
#   5. Firefighting — revert/hotfix/emergency/rollback frequency
#   6. Cross-reference — files appearing in both churn and bug top lists
#
# Based on: Ally Piechowski, "The Git Commands I Run Before Reading Any Code" (2026-04-08)
# Lab note: docs/field-notes/2026-04-08-ally-piechowski-git-audit-before-reading-code.md
#
# Flags:
#   --since="<duration>"  Lookback window (default: "1 year ago")
#   --top=N               Number of top files to report (default: 20)
#   --dry-run             Print JSON to stdout, don't write report file
#
# Requirements: git, jq
# No secrets required — all commands are local git operations

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
REPORT_FILE="$LOG_DIR/weekly-git-audit.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

SINCE="1 year ago"
TOP=20
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --since=*) SINCE="${arg#--since=}" ;;
    --top=*) TOP="${arg#--top=}" ;;
    --dry-run) DRY_RUN=true ;;
  esac
done

mkdir -p "$LOG_DIR"

echo "[git-audit] Starting weekly git audit at $TIMESTAMP"
echo "[git-audit] Window: --since=\"$SINCE\" | Top: $TOP"

# ============================================================================
# 1. CHURN HOTSPOTS — What changes the most
# ============================================================================
echo "[git-audit] Calculating churn hotspots..."

churn_json=$(git -C "$REPO_ROOT" log --format=format: --name-only --since="$SINCE" \
  | grep -v '^$' \
  | sort \
  | uniq -c \
  | sort -nr \
  | head -"$TOP" \
  | awk '{print "{\"file\": \"" $2 "\", \"commit_count\": " $1 "}"}' \
  | jq -s '.' 2>/dev/null) || true
churn_json="${churn_json:-[]}"

top_churned_file=$(jq -r '.[0].file // "none"' <<< "$churn_json" 2>/dev/null) || top_churned_file="none"
top_churned_count=$(jq -r '.[0].commit_count // 0' <<< "$churn_json" 2>/dev/null) || top_churned_count="0"

# ============================================================================
# 2. BUS FACTOR — Who built this
# ============================================================================
echo "[git-audit] Calculating contributor distribution..."

contributors_json=$(git -C "$REPO_ROOT" log --format='%aN' --no-merges \
  | sort \
  | uniq -c \
  | sort -nr \
  | awk '{count=$1; $1=""; sub(/^[[:space:]]+/, ""); print "{\"author\": \"" $0 "\", \"commit_count\": " count "}"}' \
  | jq -s '.' 2>/dev/null) || true
contributors_json="${contributors_json:-[]}"

total_commits=$(jq '[.[].commit_count] | add // 0' <<< "$contributors_json" 2>/dev/null) || total_commits="0"
top_author_commits=$(jq '.[0].commit_count // 0' <<< "$contributors_json" 2>/dev/null) || top_author_commits="0"
top_author_name=$(jq -r '.[0].author // "unknown"' <<< "$contributors_json" 2>/dev/null) || top_author_name="unknown"
contributor_count=$(jq 'length' <<< "$contributors_json" 2>/dev/null) || contributor_count="0"

if [[ "$total_commits" -gt 0 ]]; then
  bus_factor_pct=$(( top_author_commits * 100 / total_commits ))
else
  bus_factor_pct=0
fi

contributors_recent_json=$(git -C "$REPO_ROOT" log --format='%aN' --no-merges --since="6 months ago" \
  | sort \
  | uniq -c \
  | sort -nr \
  | awk '{count=$1; $1=""; sub(/^[[:space:]]+/, ""); print "{\"author\": \"" $0 "\", \"commit_count\": " count "}"}' \
  | jq -s '.' 2>/dev/null) || true
contributors_recent_json="${contributors_recent_json:-[]}"

contributor_count_recent=$(jq 'length' <<< "$contributors_recent_json" 2>/dev/null) || contributor_count_recent="0"

# ============================================================================
# 3. BUG HOTSPOTS — Where do bugs cluster
# ============================================================================
echo "[git-audit] Calculating bug hotspots..."

bug_json=$(git -C "$REPO_ROOT" log -i -E --grep="fix|bug|broken" --name-only --format='' --since="$SINCE" \
  | grep -v '^$' \
  | sort \
  | uniq -c \
  | sort -nr \
  | head -"$TOP" \
  | awk '{print "{\"file\": \"" $2 "\", \"bug_commit_count\": " $1 "}"}' \
  | jq -s '.' 2>/dev/null) || true
bug_json="${bug_json:-[]}"

# ============================================================================
# 4. VELOCITY — Is this project accelerating or dying
# ============================================================================
echo "[git-audit] Calculating commit velocity..."

velocity_json=$(git -C "$REPO_ROOT" log --format='%ad' --date=format:'%Y-%m' \
  | sort \
  | uniq -c \
  | awk '{print "{\"month\": \"" $2 "\", \"commit_count\": " $1 "}"}' \
  | jq -s '.' 2>/dev/null) || true
velocity_json="${velocity_json:-[]}"

# ============================================================================
# 5. FIREFIGHTING — How often is the team firefighting
# ============================================================================
echo "[git-audit] Scanning for reverts/hotfixes..."

firefighting_json=$(git -C "$REPO_ROOT" log --oneline --since="$SINCE" \
  | grep -iE 'revert|hotfix|emergency|rollback' \
  | awk '{sha=$1; $1=""; sub(/^[[:space:]]+/, ""); print "{\"sha\": \"" sha "\", \"subject\": \"" $0 "\"}"}' \
  | jq -s '.' 2>/dev/null) || true
firefighting_json="${firefighting_json:-[]}"

firefighting_count=$(jq 'length' <<< "$firefighting_json" 2>/dev/null) || firefighting_count="0"

# ============================================================================
# 6. CROSS-REFERENCE — Churn ∩ Bugs = highest risk
# ============================================================================
echo "[git-audit] Cross-referencing churn and bug hotspots..."

churn_files=$(jq -r '.[].file' <<< "$churn_json" 2>/dev/null) || churn_files=""
bug_files=$(jq -r '.[].file' <<< "$bug_json" 2>/dev/null) || bug_files=""

cross_ref_json=$(comm -12 \
  <(echo "$churn_files" | sort) \
  <(echo "$bug_files" | sort) \
  | jq -R -s 'split("\n") | map(select(length > 0))' 2>/dev/null) || true
cross_ref_json="${cross_ref_json:-[]}"

cross_ref_count=$(jq 'length' <<< "$cross_ref_json" 2>/dev/null) || cross_ref_count="0"

# ============================================================================
# REPORT
# ============================================================================

report=$(cat <<REPORT_EOF
{
  "timestamp": "$TIMESTAMP",
  "since": "$SINCE",
  "top_n": $TOP,
  "dry_run": $DRY_RUN,
  "churn_hotspots": $churn_json,
  "contributors": {
    "all_time": $contributors_json,
    "recent_6mo": $contributors_recent_json,
    "total_commits": $total_commits,
    "contributor_count_all_time": $contributor_count,
    "contributor_count_recent": $contributor_count_recent,
    "bus_factor": {
      "top_author": "$top_author_name",
      "top_author_commits": $top_author_commits,
      "top_author_pct": $bus_factor_pct
    }
  },
  "bug_hotspots": $bug_json,
  "velocity_by_month": $velocity_json,
  "firefighting": {
    "events": $firefighting_json,
    "count": $firefighting_count
  },
  "cross_reference": {
    "churn_and_bugs": $cross_ref_json,
    "count": $cross_ref_count
  }
}
REPORT_EOF
)

if [[ "$DRY_RUN" == "true" ]]; then
  jq '.' <<< "$report" 2>/dev/null || echo "$report"
  echo "[git-audit] Dry run — report not written."
else
  jq '.' <<< "$report" > "$REPORT_FILE" 2>/dev/null || echo "$report" > "$REPORT_FILE"
  echo "[git-audit] Report written to $REPORT_FILE"
fi

# Summary
echo ""
echo "=== WEEKLY GIT AUDIT SUMMARY ==="
echo "  Window:                      $SINCE"
echo "  Top churned file:            $top_churned_file ($top_churned_count commits)"
echo "  Contributors (all time):     $contributor_count"
echo "  Contributors (6mo):          $contributor_count_recent"
echo "  Bus factor (top author):     ${bus_factor_pct}% ($top_author_name)"
echo "  High-risk files (churn∩bug): $cross_ref_count"
echo "  Reverts/hotfixes:            $firefighting_count"
echo "  Report:                      $REPORT_FILE"

if [[ "$bus_factor_pct" -gt 60 ]]; then
  echo ""
  echo "  WARNING: Bus factor is ${bus_factor_pct}% — $top_author_name accounts for >60% of commits."
fi

if [[ "$cross_ref_count" -gt 0 ]]; then
  echo ""
  echo "  WARNING: $cross_ref_count file(s) appear in both churn and bug hotspots (highest risk):"
  jq -r '.[] | "    " + .' <<< "$cross_ref_json" 2>/dev/null
fi

echo ""
echo "[git-audit] Done."
