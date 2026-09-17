#!/usr/bin/env bash
# TED daily pipeline — DGX Spark primary runtime.
#
# Mirrors .github/workflows/ted-pipeline.yml. Auto-discovered by
# infrastructure/dgx-spark/day-runner.sh (06:00 UTC daily target).
#
# Fetches TED tenders, applies CPV / compliance filters, writes to Supabase,
# and (unless TED_DAILY_RUN_OUTREACH=false) dispatches the daily SES batch.
#
# Env vars required (provisioned via DGX cron-runner container env):
#   SUPABASE_URL, SUPABASE_SERVICE_KEY
#   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE
#   EMAIL_FROM, TED_OUTREACH_TO (or OUTREACH_DIGEST_EMAIL)
#
# Optional:
#   TED_DAILY_RUN_OUTREACH=false  → fetch-only mode (no SES send)

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

# DGX container has node_modules pre-installed; only run npm ci if missing.
if [ ! -d "node_modules" ]; then
  echo "[ted-pipeline] node_modules missing; running npm ci --ignore-scripts"
  npm ci --ignore-scripts
fi

# TED_DAILY_RUN_OUTREACH defaults to true (matches the GHA default).
export TED_DAILY_RUN_OUTREACH="${TED_DAILY_RUN_OUTREACH:-true}"

exec node --import tsx scripts/ted-daily-pipeline.ts
