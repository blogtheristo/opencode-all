#!/usr/bin/env bash
# outreach-lead-pipeline.sh — daily invocation of the outreach-orchestrator agent
# Auto-discovered by day-runner.sh (scripts/daily/ convention)
#
# Runs Steps 1-2 of the 4-step outreach pipeline (find leads -> craft drafts).
# autoSend is always false here, so Step 3 (actual send) is never triggered
# by this script — drafts land in outreach_threads (status: researched) for
# human review via the morning brief / send list. Rotates industry by day of
# week across the 6 industries in EU_TARGET_UNIVERSE so the same handful of
# companies aren't re-scored every day.
#
# Context: the outreach-orchestrator agent was built 2026-07-07 (PR #1622)
# but never wired into automated execution -- outreach_orgs/outreach_threads
# had zero new rows since before this agent existed. This script closes that
# gap (found during the 2026-07-12 stalled-morning-brief audit).
#
# Code-Version: 1.0
# Date: 2026-07-12
# Owner: Lifetime Oy

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

DAY_OF_WEEK=$(date -u +%u) # 1=Mon .. 7=Sun
INDUSTRIES=(steel construction cement manufacturing energy logistics)
IDX=$(((DAY_OF_WEEK - 1) % 6))
INDUSTRY="${INDUSTRIES[$IDX]}"

echo "[outreach-lead-pipeline] $(date -u +%Y-%m-%dT%H:%M:%SZ) — running outreach-orchestrator for industry=$INDUSTRY"

INPUT=$(
  cat <<JSON
{
  "icp": "EU industrial enterprises exposed to CBAM/CSRD/EU-Taxonomy/ETS compliance deadlines",
  "industry": "$INDUSTRY",
  "region": "EU",
  "regulatoryTrigger": "CSRD",
  "offering": "DWS IQ compliance intelligence platform",
  "maxLeads": 3,
  "emailStyle": "consultative",
  "linkedinDraft": true,
  "autoSend": false
}
JSON
)

cd "$REPO_ROOT/cli"
npx tsx src/cli.ts run outreach-orchestrator --input "$INPUT"
