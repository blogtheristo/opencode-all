#!/usr/bin/env bash
# TED weekly outreach learning aggregator — DGX Spark primary runtime.
#
# Mirrors .github/workflows/ted-learning-weekly.yml. Auto-discovered by
# infrastructure/dgx-spark/day-runner.sh (Monday 08:15 UTC target).
#
# Aggregates outreach response signals from the prior week into the
# ted_outreach_learning_log Supabase table.
#
# Env vars required:
#   SUPABASE_URL, SUPABASE_SERVICE_KEY

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

if [ ! -d "node_modules" ]; then
  echo "[ted-learning] node_modules missing; running npm ci --ignore-scripts"
  npm ci --ignore-scripts
fi

exec node --import tsx scripts/ted-learning-weekly.ts
