#!/usr/bin/env bash
# Daily MVP Feature Audit — DGX Spark primary runtime.
#
# Mirrors .github/workflows/daily-mvp-audit.yml. Auto-discovered by
# infrastructure/dgx-spark/day-runner.sh (target 05:00 Helsinki = 02:00/03:00 UTC).
#
# DGX Spark runs in Europe/Helsinki via its own systemd timer, so no Helsinki
# time guard is needed here — day-runner.sh already guarantees once-per-day
# semantics via its state file.
#
# Checks feature parity for the MVP across 5 release categories (RC1–RC5),
# scores them, and creates/updates the open MVP audit issue.
#
# Requirements:
#   - `gh` CLI authenticated with issues:write
#   - Repo cloned and synced (day-runner.sh handles this)

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

REPORT=""
SCORE=0
TOTAL=0
MISSING=""

check() {
  local id="$1"
  local name="$2"
  local pattern="$3"
  local priority="$4"
  TOTAL=$((TOTAL + 1))
  if compgen -G "$pattern" > /dev/null 2>&1; then
    REPORT="${REPORT}| ${id} | ${name} | ✅ | ${priority} |\n"
    SCORE=$((SCORE + 1))
  else
    REPORT="${REPORT}| ${id} | ${name} | ❌ | ${priority} |\n"
    MISSING="${MISSING}- **${id} ${name}** (${priority})\n"
  fi
}

check_grep() {
  local id="$1"
  local name="$2"
  local file="$3"
  local pattern="$4"
  local priority="$5"
  TOTAL=$((TOTAL + 1))
  if [ -f "$file" ] && grep -q "$pattern" "$file" 2>/dev/null; then
    REPORT="${REPORT}| ${id} | ${name} | ✅ | ${priority} |\n"
    SCORE=$((SCORE + 1))
  else
    REPORT="${REPORT}| ${id} | ${name} | ❌ | ${priority} |\n"
    MISSING="${MISSING}- **${id} ${name}** (${priority})\n"
  fi
}

# RC1: Compliance Engine
REPORT="${REPORT}### RC1: Compliance Engine\n"
REPORT="${REPORT}| ID | Feature | Status | Priority |\n"
REPORT="${REPORT}|---|---------|--------|----------|\n"
check "1.1" "CSRD data model migration" "supabase/migrations/*csrd*" "P0"
check "1.2" "ESRS data point registry" "src/compliance/esrs-registry.*" "P0"
check "1.3" "Compliance scoring engine" "src/compliance/scoring-engine.*" "P0"
check "1.4" "ETS emission calculator" "src/compliance/ets-calculator.*" "P1"
check "1.5" "CBAM embedded emissions" "src/compliance/cbam-calculator.*" "P1"
check "1.6" "Compliance report generator" "src/compliance/report-generator.*" "P0"
REPORT="${REPORT}\n"

# RC2: Backend Production Readiness
REPORT="${REPORT}### RC2: Backend Production Readiness\n"
REPORT="${REPORT}| ID | Feature | Status | Priority |\n"
REPORT="${REPORT}|---|---------|--------|----------|\n"
check "2.1" "Centralized error handler" "src/middleware/error-handler.*" "P0"
check "2.2" "Zod request validation" "src/middleware/validate.*" "P0"
check_grep "2.3" "Health check endpoint" "src/middleware/health.ts" "health" "P0"
check_grep "2.4" "Graceful shutdown" "src/app.ts" "SIGTERM\|graceful" "P1"
check "2.5" "Startup env validation" "src/middleware/env-validation.*" "P0"
check "2.6" "Correlation ID middleware" "src/middleware/correlation-id.*" "P1"
REPORT="${REPORT}\n"

# RC3: Test Coverage
REPORT="${REPORT}### RC3: Test Coverage\n"
REPORT="${REPORT}| ID | Feature | Status | Priority |\n"
REPORT="${REPORT}|---|---------|--------|----------|\n"
check_grep "3.1" "Vitest coverage config" "vitest.config.ts" "coverage" "P0"
check "3.2" "Auth service tests" "src/__tests__/auth*" "P0"
check "3.3" "Compliance engine tests" "src/__tests__/compliance*" "P0"
check "3.4" "Auth integration tests" "src/__tests__/integration/auth*" "P1"
check "3.5" "Agent integration tests" "src/__tests__/integration/agent*" "P1"
check "3.6" "E2E smoke test" "src/__tests__/e2e/smoke*" "P1"

TEST_COUNT=$(find src/__tests__ -name '*.test.*' -o -name '*.spec.*' 2>/dev/null | wc -l)
REPORT="${REPORT}\nTest files found: **${TEST_COUNT}**\n\n"

# RC4: Dashboard Resilience
REPORT="${REPORT}### RC4: Dashboard Resilience\n"
REPORT="${REPORT}| ID | Feature | Status | Priority |\n"
REPORT="${REPORT}|---|---------|--------|----------|\n"

DASH_DIR=""
if [ -d "dws6.com/dashboard/firehorse/v10-react/src" ]; then
  DASH_DIR="dws6.com/dashboard/firehorse/v10-react/src"
elif [ -d "dws6.com/dashboard/firehorse/v9-react/src" ]; then
  DASH_DIR="dws6.com/dashboard/firehorse/v9-react/src"
fi

if [ -n "$DASH_DIR" ]; then
  check "4.1" "Error boundaries" "${DASH_DIR}/components/ErrorBoundary.*" "P0"
  check "4.2" "Loading skeletons" "${DASH_DIR}/components/Skeleton.*" "P0"
  check "4.3" "Empty state components" "${DASH_DIR}/components/EmptyState.*" "P0"
  check "4.4" "API error handling hook" "${DASH_DIR}/hooks/useApi.*" "P0"
  check "4.5" "Responsive layout" "${DASH_DIR}/App.*" "P1"
  check "4.6" "Carbon tracking page" "${DASH_DIR}/pages/CarbonTracking*" "P1"
else
  for id in 4.1 4.2 4.3 4.4 4.5 4.6; do
    TOTAL=$((TOTAL + 1))
    REPORT="${REPORT}| ${id} | Dashboard component | ❌ (no dashboard dir) | P0 |\n"
    MISSING="${MISSING}- **${id} Dashboard** (P0) — dashboard dir not found\n"
  done
fi
REPORT="${REPORT}\n"

# RC5: Customer Onboarding
REPORT="${REPORT}### RC5: Customer Onboarding\n"
REPORT="${REPORT}| ID | Feature | Status | Priority |\n"
REPORT="${REPORT}|---|---------|--------|----------|\n"

if [ -n "$DASH_DIR" ]; then
  check "5.1" "Onboarding wizard" "${DASH_DIR}/pages/Onboarding*" "P0"
else
  TOTAL=$((TOTAL + 1))
  REPORT="${REPORT}| 5.1 | Onboarding wizard | ❌ | P0 |\n"
  MISSING="${MISSING}- **5.1 Onboarding wizard** (P0)\n"
fi
check "5.2" "Organization setup API" "src/routes/onboarding*" "P0"
check "5.3" "Welcome email sequence" "src/services/onboarding-email*" "P1"
if [ -n "$DASH_DIR" ]; then
  check "5.5" "Settings page" "${DASH_DIR}/pages/Settings*" "P1"
else
  TOTAL=$((TOTAL + 1))
  REPORT="${REPORT}| 5.5 | Settings page | ❌ | P1 |\n"
  MISSING="${MISSING}- **5.5 Settings page** (P1)\n"
fi
REPORT="${REPORT}\n"

# Infrastructure metrics
REPORT="${REPORT}### Infrastructure\n"
REPORT="${REPORT}| Check | Status |\n"
REPORT="${REPORT}|-------|--------|\n"

WF_COUNT=$(find .github/workflows -name '*.yml' 2>/dev/null | wc -l)
MIGRATION_COUNT=$(find supabase/migrations -name '*.sql' 2>/dev/null | wc -l)
AGENT_COUNT=$(find src/agents -name '*.agent.ts' -o -name '*.agent.js' 2>/dev/null | wc -l)
SKILL_COUNT=$(find .claude/commands -name '*.md' 2>/dev/null | wc -l)

REPORT="${REPORT}| CI/CD workflows | ${WF_COUNT} |\n"
REPORT="${REPORT}| DB migrations | ${MIGRATION_COUNT} |\n"
REPORT="${REPORT}| Platform agents | ${AGENT_COUNT} |\n"
REPORT="${REPORT}| Claude Code skills | ${SKILL_COUNT} |\n"
REPORT="${REPORT}| Test files | ${TEST_COUNT} |\n"

WEEK_COMMITS=$(git log --oneline --since="7 days ago" 2>/dev/null | wc -l)
WEEK_PRS=$(git log --oneline --since="7 days ago" --grep="Merge pull request" 2>/dev/null | wc -l)
REPORT="${REPORT}| Commits (7d) | ${WEEK_COMMITS} |\n"
REPORT="${REPORT}| PRs merged (7d) | ${WEEK_PRS} |\n"
REPORT="${REPORT}\n"

# Summary
PCT=$((SCORE * 100 / TOTAL))
P0_MISSING=$(echo -e "$MISSING" | grep -c "P0" || true)

HEADER="# DWS IQ 6 — Daily MVP Audit\n\n"
HEADER="${HEADER}**Date:** $(date -u +%Y-%m-%d) | **Score:** ${SCORE}/${TOTAL} (${PCT}%) | **P0 gaps:** ${P0_MISSING}\n\n"

if [ "$PCT" -ge 90 ]; then
  HEADER="${HEADER}> 🟢 **SHIP READY** — all critical features present\n\n"
elif [ "$PCT" -ge 70 ]; then
  HEADER="${HEADER}> 🟡 **ALMOST** — ${P0_MISSING} P0 gaps remaining\n\n"
else
  HEADER="${HEADER}> 🔴 **NOT READY** — ${P0_MISSING} P0 features missing\n\n"
fi

if [ -n "$MISSING" ]; then
  HEADER="${HEADER}### Missing Features\n\n"
  HEADER="${HEADER}$(echo -e "$MISSING")\n\n"
fi

FULL_REPORT="${HEADER}---\n\n${REPORT}"

REPORT_FILE="$(mktemp)"
trap 'rm -f "$REPORT_FILE"' EXIT
echo -e "$FULL_REPORT" > "$REPORT_FILE"

TITLE="MVP Audit: ${SCORE}/${TOTAL} (${PCT}%) — $(date -u +%Y-%m-%d)"

if command -v gh >/dev/null 2>&1; then
  EXISTING=$(gh issue list --label "mvp-audit" --state open --limit 1 --json number -q '.[0].number' 2>/dev/null || echo "")
  if [ -n "$EXISTING" ]; then
    gh issue comment "$EXISTING" --body-file "$REPORT_FILE"
    echo "[mvp-audit] Updated issue #${EXISTING}"
  else
    gh issue create \
      --title "$TITLE" \
      --body-file "$REPORT_FILE" \
      --label "mvp-audit" 2>/dev/null \
      || echo "[mvp-audit] Could not create issue (label may not exist); report follows:" \
      && cat "$REPORT_FILE"
  fi
else
  echo "[mvp-audit] gh CLI not installed; printing report:"
  cat "$REPORT_FILE"
fi
