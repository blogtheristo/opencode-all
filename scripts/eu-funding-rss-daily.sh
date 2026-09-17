#!/usr/bin/env bash
# ============================================================================
# EU Funding & Tenders call-updates refresh — MANUAL ONLY, not on the DGX cron
#
# Moved out of scripts/daily/ on 2026-07-18 — infrastructure/dgx-spark/day-runner.sh
# auto-discovers scripts/daily/*.{ts,sh} and would run this daily, but SEDIA
# (the live data source) is broken: every request encoding tested 500s or
# silently ignores the query filter. A daily cron here just burns a run on a
# guaranteed failure. Re-move this file into scripts/daily/ once
# scripts/eu-funding-rss.ts actually returns filtered results — needs a real
# browser DevTools "Copy as cURL" capture of the portal's search POST (see
# PR #1702 / data/eu-funding/all-horizon-open-forthcoming-grants.md).
#
# Fetches the EU Funding & Tenders Portal call-updates RSS feed and writes the
# grants/funding list to data/eu-funding/grants-funding.{md,json}.
# Never auto-commits — output files are regenerated in place each run.
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
[ "${EU_FUNDING_DEBUG_RAW:-}" = "true" ] && args+=(--debug-raw)
[ "${EU_FUNDING_PROBE:-}" = "true" ] && args+=(--probe)

exec node --import tsx scripts/eu-funding-rss.ts "${args[@]}"
