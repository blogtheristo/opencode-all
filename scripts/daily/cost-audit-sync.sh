#!/bin/bash
# Cost Audit Log Sync to Supabase (Daily)
# Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=cost-audit-persistence Date=2026-09-19
# Audit trail: git log -- scripts/daily/cost-audit-sync.sh

set -euo pipefail

# Load Supabase credentials from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Validate credentials
if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env"
  exit 1
fi

# Run the sync script (requires npx and TypeScript support)
echo "🔄 Syncing cost audit log to Supabase..."
npx ts-node scripts/cost-audit-sync-supabase.ts

echo "✅ Daily cost audit sync complete"
