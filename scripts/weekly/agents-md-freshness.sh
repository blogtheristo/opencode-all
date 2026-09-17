#!/usr/bin/env bash
# agents-md-freshness.sh — Weekly AGENTS.md freshness check (moved off GitHub Actions).
#
# Replaces: .github/workflows/agents-md-freshness.yml
# Auto-discovered by day-runner.sh (weekly folder, Monday 06:00 UTC target).
#
# Verifies AGENTS.md is in sync with src/agents/ and flags stale entries.

set -uo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

echo "[agents-md-freshness] Starting weekly freshness check"

if [ ! -d "node_modules" ]; then
  echo "[agents-md-freshness] node_modules missing; running npm ci --ignore-scripts"
  npm ci --ignore-scripts
fi

# Run the verification script
if [ -f "scripts/verify-agents-md.mjs" ]; then
  node scripts/verify-agents-md.mjs 2>&1 | tee logs/agents-md-freshness-$(date -u +%Y-%m-%d).log || true
else
  echo "[agents-md-freshness] scripts/verify-agents-md.mjs not found — skipping"
fi

echo "[agents-md-freshness] Done"
