#!/usr/bin/env bash
# TED day-3 follow-up emails — DGX Spark primary runtime.
#
# Mirrors .github/workflows/ted-followup.yml. Auto-discovered by
# infrastructure/dgx-spark/day-runner.sh (07:30 UTC daily target).
#
# Sends follow-up emails for tenders that received an initial outreach 3 days
# ago and have not been replied to. Counts toward the daily SES cap.
#
# Env vars required (provisioned via DGX cron-runner container env):
#   SUPABASE_URL, SUPABASE_SERVICE_KEY
#   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE
#   EMAIL_FROM, TED_OUTREACH_TO (or OUTREACH_DIGEST_EMAIL)

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

if [ ! -d "node_modules" ]; then
  echo "[ted-followup] node_modules missing; running npm ci --ignore-scripts"
  npm ci --ignore-scripts
fi

exec node --import tsx scripts/ted-followup.ts
