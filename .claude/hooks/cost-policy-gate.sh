#!/bin/bash
# Cost Policy Enforcement Hook
# Implements DWS_COST_POLICY_STANDARD.md: DGX-first, free-credit window (Sept 20–Oct 11), hard block post-Day 21
# Invoked from session-start.sh to check policy compliance

set -euo pipefail

POLICY_START="2026-09-20"
FREE_CREDIT_DAYS=21

# Parse date strings safely
date_to_epoch() {
  date -d "$1" +%s 2>/dev/null || echo "0"
}

TODAY=$(date +%Y-%m-%d)
TODAY_EPOCH=$(date_to_epoch "$TODAY")
POLICY_EPOCH=$(date_to_epoch "$POLICY_START")

# Calculate days since policy start
DAYS_ELAPSED=$(( (TODAY_EPOCH - POLICY_EPOCH) / 86400 ))

# Create audit log directory if not present
mkdir -p "$(dirname "$0")/audit"
AUDIT_LOG="$(dirname "$0")/audit/cost-policy.log"

log_decision() {
  local session_id="$1"
  local agent_type="$2"
  local decision="$3"
  local rationale="$4"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  # YYYY-MM-DD HH:MM:SS | SESSION_ID | AGENT_TYPE | SANDBOX_STATUS | WORKLOAD_CATEGORY | DECISION | RATIONALE
  echo "$timestamp | $session_id | $agent_type | sandbox-unknown | engineering | $decision | $rationale" >> "$AUDIT_LOG"
}

# Get branch name (session ID)
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Detect cloud agent requests (look for Cursor Cloud, Grok Cloud flags in environment)
AGENT_TYPE="unknown"
SANDBOX_STATUS="unknown"

if [ -n "${CLAUDE_CODE_TOOL:-}" ] || [ -n "${CURSOR_ACTIVE:-}" ]; then
  AGENT_TYPE="cursor"
  # Check if cloud variant
  if [ -n "${CURSOR_USE_CLOUD:-}" ] || [ -n "${CURSOR_CLOUD_MODE:-}" ]; then
    AGENT_TYPE="cursor-cloud"
    SANDBOX_STATUS="vendor"
  else
    SANDBOX_STATUS="isolated"
  fi
elif [ -n "${GROK_ACTIVE:-}" ]; then
  AGENT_TYPE="grok"
  if [ -n "${GROK_USE_CLOUD:-}" ] || [ -n "${GROK_CLOUD_MODE:-}" ]; then
    AGENT_TYPE="grok-cloud"
    SANDBOX_STATUS="vendor"
  else
    SANDBOX_STATUS="isolated"
  fi
fi

# Policy enforcement logic
if [ "$TODAY_EPOCH" -lt "$POLICY_EPOCH" ]; then
  # Policy not yet active (before 2026-09-20)
  log_decision "$BRANCH" "$AGENT_TYPE" "ALLOWED" "Policy effective date not reached ($POLICY_START)"
  exit 0
fi

# OPTION B: Days 1–17 (silent log)
if [ $DAYS_ELAPSED -le 17 ]; then
  log_decision "$BRANCH" "$AGENT_TYPE" "ALLOWED" "Within free-credit window (Day $(($DAYS_ELAPSED + 1))/$FREE_CREDIT_DAYS)"
  exit 0
fi

# OPTION B: Days 18–21 (warn at session start)
if [ $DAYS_ELAPSED -le 21 ]; then
  DAYS_REMAINING=$(($FREE_CREDIT_DAYS - $DAYS_ELAPSED))

  log_decision "$BRANCH" "$AGENT_TYPE" "ALLOWED" "Approaching credit window end (Day $(($DAYS_ELAPSED + 1))/$FREE_CREDIT_DAYS, $DAYS_REMAINING days remaining)"

  # Print warning to stderr (visible to HIC)
  cat >&2 <<EOF

⚠️  COST POLICY ADVISORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Free cloud-agent credit expires in $DAYS_REMAINING day(s) (2026-10-11).
After 2026-10-12, cloud agents (Cursor Cloud, Grok Cloud) are BLOCKED.

Policy: DWS_COST_POLICY_STANDARD.md (effective 2026-09-20)
Status: DGX-first agentic compute is mandatory post-credit window.

Action: Migrate heavy workloads to local DGX pipeline now.
        If you need cloud compute, request override by creating a field note.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

  exit 0
fi

# OPTION A: Day 22+ (hard block on cloud agents)
if [ $DAYS_ELAPSED -gt 21 ]; then

  # Block cloud agents
  if [[ "$AGENT_TYPE" =~ cloud ]]; then
    log_decision "$BRANCH" "$AGENT_TYPE" "BLOCKED" "Post free-credit window (Day $(($DAYS_ELAPSED + 1))); DGX mandatory"

    cat >&2 <<EOF

❌ COST POLICY ENFORCEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cloud agents are now BLOCKED per DWS_COST_POLICY_STANDARD.md

Free-credit window ended on 2026-10-11 (today is $TODAY, Day $(($DAYS_ELAPSED + 1))).
All agentic workloads must use DGX (local sandbox) from this point forward.

Policy: See docs/DWS_COST_POLICY_STANDARD.md
Override: Request in-session override via field note if cloud is unavoidable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

    exit 2  # BLOCK
  fi

  # Allow DGX agents (silent log)
  log_decision "$BRANCH" "$AGENT_TYPE" "ALLOWED" "DGX agent, post-credit window (Day $(($DAYS_ELAPSED + 1)))"
  exit 0
fi

# Fallback (should not reach)
log_decision "$BRANCH" "$AGENT_TYPE" "ALLOWED" "Default allow (policy edge case)"
exit 0
