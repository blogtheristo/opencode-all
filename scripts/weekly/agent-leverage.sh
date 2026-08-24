#!/usr/bin/env bash
# agent-leverage.sh — Weekly Agent Leverage % metric (Playbook Stage 9).
#
# Auto-discovered by day-runner.sh (weekly folder, Sunday 04:00 UTC).
# No GitHub Actions, no remembering — Script Automation Rule compliant.
#
# Computes what share of the week's work was agent-authored vs human-typed,
# paired with a defect-rate proxy, and writes docs/metrics/agent-leverage.json
# plus a dated snapshot. Surfaced weekly through /retro.

set -uo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

echo "[agent-leverage] Starting weekly agent leverage metric"

mkdir -p logs

if [ -f "scripts/agent-leverage.mjs" ]; then
  node scripts/agent-leverage.mjs --since "7 days ago" 2>&1 \
    | tee "logs/agent-leverage-$(date -u +%Y-%m-%d).log" || true
else
  echo "[agent-leverage] scripts/agent-leverage.mjs not found — skipping"
fi

echo "[agent-leverage] Done"
