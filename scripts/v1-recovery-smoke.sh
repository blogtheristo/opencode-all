#!/usr/bin/env bash
# scripts/v1-recovery-smoke.sh
# Sanity test for V1 recovery PR #1208 — verify all un-stubbed surfaces work end-to-end.
#
# Usage:
#   BASE_URL=https://your-cloud-run-url npm run smoke:v1-recovery
#   BASE_URL=http://localhost:8080 bash scripts/v1-recovery-smoke.sh
#
# Exits non-zero on any failure.

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
ORG_ID="${SMOKE_ORG_ID:-smoke-test-org}"

pass() { printf '  \033[32mPASS\033[0m  %s\n' "$1"; }
fail() { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; FAILED=1; }
section() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }

FAILED=0

curl_status() {
  curl -sS -o /tmp/smoke-body.txt -w '%{http_code}' "$@" || echo "000"
}

# ---- Health ----
section "Health"
code=$(curl_status "$BASE_URL/health")
[[ "$code" == "200" ]] && pass "GET /health -> 200" || fail "GET /health -> $code"

# ---- Content DMS (Step 2) ----
section "Content DMS (commit d94fe734)"
code=$(curl_status "$BASE_URL/api/v1/content/stats?organization_id=$ORG_ID")
[[ "$code" == "200" || "$code" == "401" ]] && pass "GET /api/v1/content/stats -> $code (reachable)" || fail "GET /api/v1/content/stats -> $code"

code=$(curl_status "$BASE_URL/api/v1/content/expiring?organization_id=$ORG_ID&days=30")
[[ "$code" == "200" || "$code" == "401" ]] && pass "GET /api/v1/content/expiring -> $code" || fail "GET /api/v1/content/expiring -> $code"

# ---- MCP (Step 1, un-stubbed) ----
section "MCP /mcp endpoint (commit b66fc77c)"
code=$(curl_status -X POST "$BASE_URL/mcp" \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}')
[[ "$code" == "200" ]] && pass "POST /mcp tools/list -> 200" || fail "POST /mcp tools/list -> $code"

if [[ "$code" == "200" ]]; then
  count=$(grep -o '"contentms_' /tmp/smoke-body.txt | wc -l | tr -d ' ')
  [[ "$count" -ge 18 ]] && pass "MCP tools/list contains $count contentms_* tools" || fail "MCP tools/list has only $count contentms_* tools (expected 18)"
fi

# ---- Firehorse (Step 3, un-stubbed) ----
section "Firehorse (commit 974fea4c)"
code=$(curl_status "$BASE_URL/api/v1/firehorse/health")
[[ "$code" == "200" ]] && pass "GET /api/v1/firehorse/health -> 200" || fail "GET /api/v1/firehorse/health -> $code"

code=$(curl_status -X POST "$BASE_URL/api/v1/firehorse/reports/generate" \
  -H 'Content-Type: application/json' \
  -d "{\"organizationId\":\"$ORG_ID\",\"format\":\"compliance-summary\",\"periodStart\":\"2025-01-01\",\"periodEnd\":\"2025-12-31\",\"industry\":\"steel\"}")
[[ "$code" == "200" ]] && pass "POST /api/v1/firehorse/reports/generate -> 200" || fail "POST /api/v1/firehorse/reports/generate -> $code"

# ---- LinkedIn pending queue (commit 04029400) ----
section "LinkedIn pending queue"
code=$(curl_status "$BASE_URL/api/v1/firehorse/linkedin/pending")
[[ "$code" == "200" ]] && pass "GET /api/v1/firehorse/linkedin/pending -> 200" || fail "GET /api/v1/firehorse/linkedin/pending -> $code"

# ---- investor-reports (Step 2, un-stubbed) ----
section "Investor reports (commit 2316b28b)"
code=$(curl_status "$BASE_URL/api/investor-reports/cap-table")
[[ "$code" == "200" || "$code" == "401" || "$code" == "403" ]] && pass "GET /api/investor-reports/cap-table -> $code (reachable)" || fail "GET /api/investor-reports/cap-table -> $code"

# ---- Result ----
section "Result"
if [[ "$FAILED" -eq 0 ]]; then
  printf '\033[32mAll smoke checks passed.\033[0m\n'
  exit 0
else
  printf '\033[31mOne or more smoke checks failed.\033[0m\n'
  exit 1
fi
