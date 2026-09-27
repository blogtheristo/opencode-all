#!/bin/bash
# Cost Audit Log Sync to Supabase (Daily)
# Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-d-dgx-persistence Date=2026-09-27
# Audit trail: git log -- scripts/daily/cost-audit-sync.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

if [ "${DWS_DRY_RUN:-false}" = "true" ]; then
  npx tsx --version
  echo "Dry run complete; cost audit sync was not sent"
  exit 0
fi

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
  exit 1
fi

echo "Syncing cost audit log to Supabase..."
npx tsx scripts/cost-audit-sync-supabase.ts

echo "Daily cost audit sync complete"
