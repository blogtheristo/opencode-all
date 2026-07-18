#!/usr/bin/env bash
# ============================================================================
# Daily EU Funding & Tenders call-updates refresh
#
# Fetches the EU Funding & Tenders Portal call-updates RSS feed and writes the
# grants/funding list to data/eu-funding/grants-funding.{md,json}.
#
# Sibling of scripts/daily/ted-pipeline.sh. Auto-discovered by
# infrastructure/dgx-spark/day-runner.sh (scripts/daily/*.sh). Never
# auto-commits — output files are regenerated in place each run.
#
# Env (optional):
#   EU_FT_RSS_URL          Override feed URL.
#   EU_FUNDING_STATUS      Comma-separated status filter (e.g. "open").
#   EU_FUNDING_GREP        Keyword filter on title+description.
#   EU_FUNDING_LIMIT       Keep only the first N items.
#
# Code-Version: 1.0
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

# DGX container has node_modules pre-installed; only install if missing.
if [ ! -d "node_modules" ]; then
  echo "[eu-funding-rss] node_modules missing; running npm ci --ignore-scripts"
  npm ci --ignore-scripts
fi

args=()
[ -n "${EU_FUNDING_STATUS:-}" ] && args+=(--status "$EU_FUNDING_STATUS")
[ -n "${EU_FUNDING_GREP:-}" ] && args+=(--grep "$EU_FUNDING_GREP")
[ -n "${EU_FUNDING_LIMIT:-}" ] && args+=(--limit "$EU_FUNDING_LIMIT")
[ "${EU_FUNDING_VERBOSE:-}" = "true" ] && args+=(--verbose)

exec node --import tsx scripts/eu-funding-rss.ts "${args[@]}"
