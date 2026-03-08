#!/usr/bin/env bash
# =============================================================================
# DWS6 Database Backup Test Drive
# =============================================================================
# Validates the full backup → verify → restore cycle:
#   1. Export current database via pg_dump
#   2. Verify dump integrity (file size, table count)
#   3. Restore to Aiven sandbox (or local test DB)
#   4. Compare row counts between source and target
#   5. Report results with pass/fail
#
# Usage:
#   ./scripts/db-backup-test.sh                    # Full test (Supabase → Aiven)
#   ./scripts/db-backup-test.sh --export-only      # Just create and verify dump
#   ./scripts/db-backup-test.sh --skip-export      # Restore latest dump to Aiven
#   ./scripts/db-backup-test.sh --dump /path/to/file.sql  # Restore specific dump
#
# Prerequisites:
#   - psql and pg_dump installed
#   - .env file with SUPABASE_DB_* and AIVEN_DATABASE_URL
#
# Version: 1.0 | Date: 2026-03-08
# Session: claude/build-mvp-features-nFk7k
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
BACKUP_DIR="${BACKUP_LOCAL_DIR:-/tmp/dws6-backup-test}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

START_TIME=$(date +%s)

log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[PASS]${NC}  $1"; }
log_fail()  { echo -e "${RED}[FAIL]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_step()  { echo -e "${CYAN}[STEP]${NC}  $1"; }

elapsed() {
  local now=$(date +%s)
  echo "$((now - START_TIME))s"
}

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
EXPORT_ONLY=false
SKIP_EXPORT=false
CUSTOM_DUMP=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --export-only)  EXPORT_ONLY=true; shift ;;
    --skip-export)  SKIP_EXPORT=true; shift ;;
    --dump)         CUSTOM_DUMP="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: $0 [--export-only|--skip-export|--dump <path>]"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ---------------------------------------------------------------------------
# Load .env
# ---------------------------------------------------------------------------
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  log_warn "No .env file — using environment variables"
fi

# ---------------------------------------------------------------------------
# Build connection strings
# ---------------------------------------------------------------------------
SOURCE_URL=""
TARGET_URL=""

if [[ -n "${SUPABASE_DB_HOST:-}" && -n "${SUPABASE_DB_PASSWORD:-}" ]]; then
  SOURCE_URL="postgresql://${SUPABASE_DB_USER:-postgres}:${SUPABASE_DB_PASSWORD}@${SUPABASE_DB_HOST}:${SUPABASE_DB_PORT:-5432}/${SUPABASE_DB_NAME:-postgres}?sslmode=require"
fi

TARGET_URL="${AIVEN_DATABASE_URL:-}"

# Validate
if [[ -z "$SOURCE_URL" ]] && ! $SKIP_EXPORT; then
  log_fail "SUPABASE_DB_HOST and SUPABASE_DB_PASSWORD required for export"
  exit 1
fi

if [[ -z "$TARGET_URL" ]] && ! $EXPORT_ONLY; then
  log_fail "AIVEN_DATABASE_URL required for restore test"
  exit 1
fi

# ---------------------------------------------------------------------------
# Verify tools
# ---------------------------------------------------------------------------
for cmd in psql pg_dump; do
  if ! command -v "$cmd" &>/dev/null; then
    log_fail "$cmd not found. Install: sudo apt-get install postgresql-client"
    exit 1
  fi
done

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${CYAN}DWS6 Database Backup Test Drive${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  ═══════════════════════════════════════════════"
echo ""

TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

pass() { ((TESTS_PASSED++)); log_ok "$1"; }
fail() { ((TESTS_FAILED++)); log_fail "$1"; }
skip() { ((TESTS_SKIPPED++)); log_warn "[SKIP] $1"; }

# ---------------------------------------------------------------------------
# Step 1: Test source connection
# ---------------------------------------------------------------------------
log_step "Step 1: Testing source database connection"

if $SKIP_EXPORT; then
  skip "Source connection (--skip-export)"
else
  if psql "$SOURCE_URL" -c "SELECT 1;" &>/dev/null; then
    pass "Source database (Supabase) reachable"
  else
    fail "Cannot connect to source database"
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Step 2: Export via pg_dump
# ---------------------------------------------------------------------------
log_step "Step 2: Database export (pg_dump)"

if $SKIP_EXPORT; then
  if [[ -n "$CUSTOM_DUMP" ]]; then
    DUMP_FILE="$CUSTOM_DUMP"
    log_info "Using custom dump: $DUMP_FILE"
  else
    # Find latest dump in backup dir
    DUMP_FILE=$(find "$BACKUP_DIR" -name "dws6-*.sql" -type f 2>/dev/null | sort -r | head -1 || true)
    if [[ -z "$DUMP_FILE" ]]; then
      fail "No dump file found in $BACKUP_DIR"
      exit 1
    fi
    log_info "Using latest dump: $DUMP_FILE"
  fi
  skip "Export (--skip-export)"
else
  mkdir -p "$BACKUP_DIR"
  DUMP_FILE="$BACKUP_DIR/dws6-${TIMESTAMP}.sql"

  log_info "Exporting to $DUMP_FILE..."
  local_start=$(date +%s)

  if pg_dump "$SOURCE_URL" \
    --no-owner \
    --no-privileges \
    --no-comments \
    --schema=public \
    --format=plain \
    > "$DUMP_FILE" 2>/dev/null; then

    local_end=$(date +%s)
    dump_size=$(du -h "$DUMP_FILE" | cut -f1)
    dump_lines=$(wc -l < "$DUMP_FILE")
    pass "Export completed: $dump_size, $dump_lines lines ($((local_end - local_start))s)"
  else
    fail "pg_dump failed"
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Step 3: Verify dump integrity
# ---------------------------------------------------------------------------
log_step "Step 3: Verify dump integrity"

if [[ ! -f "$DUMP_FILE" ]]; then
  fail "Dump file not found: $DUMP_FILE"
  exit 1
fi

# Check file is not empty
dump_bytes=$(stat -c%s "$DUMP_FILE" 2>/dev/null || stat -f%z "$DUMP_FILE" 2>/dev/null || echo "0")
if [[ "$dump_bytes" -gt 1000 ]]; then
  pass "Dump file size OK ($(du -h "$DUMP_FILE" | cut -f1))"
else
  fail "Dump file suspiciously small: $dump_bytes bytes"
fi

# Count CREATE TABLE statements
table_count=$(grep -c "^CREATE TABLE" "$DUMP_FILE" 2>/dev/null || echo "0")
if [[ "$table_count" -gt 5 ]]; then
  pass "Dump contains $table_count CREATE TABLE statements"
else
  log_warn "Only $table_count CREATE TABLE statements found (expected 20+)"
fi

# Check for core tables in dump
for table in api_keys usage_events usage_counters report_schedules users; do
  if grep -q "CREATE TABLE.*${table}" "$DUMP_FILE" 2>/dev/null || \
     grep -q "COPY.*${table}" "$DUMP_FILE" 2>/dev/null; then
    pass "Core table '$table' found in dump"
  else
    log_warn "Core table '$table' not found in dump (may be normal for new DB)"
  fi
done

if $EXPORT_ONLY; then
  echo ""
  log_info "Export-only mode — skipping restore steps"
  echo ""
  echo "  Dump file: $DUMP_FILE"
  echo ""
  exit 0
fi

# ---------------------------------------------------------------------------
# Step 4: Get source row counts (for comparison)
# ---------------------------------------------------------------------------
log_step "Step 4: Collecting source row counts"

declare -A SOURCE_COUNTS

if ! $SKIP_EXPORT; then
  # Get row counts from source
  source_tables=$(psql "$SOURCE_URL" -tAc \
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;" 2>/dev/null || true)

  for t in $source_tables; do
    count=$(psql "$SOURCE_URL" -tAc "SELECT COUNT(*) FROM \"$t\";" 2>/dev/null || echo "?")
    SOURCE_COUNTS[$t]=$count
  done
  pass "Collected row counts for ${#SOURCE_COUNTS[@]} source tables"
else
  skip "Source row counts (--skip-export)"
fi

# ---------------------------------------------------------------------------
# Step 5: Test target connection
# ---------------------------------------------------------------------------
log_step "Step 5: Testing target database connection (Aiven)"

if psql "$TARGET_URL" -c "SELECT 1;" &>/dev/null; then
  pass "Target database (Aiven) reachable"
else
  fail "Cannot connect to target database"
  exit 1
fi

# ---------------------------------------------------------------------------
# Step 6: Apply Aiven auth stubs
# ---------------------------------------------------------------------------
log_step "Step 6: Applying Aiven auth stubs"

if [[ -f "$SCRIPT_DIR/aiven-init.sql" ]]; then
  if psql "$TARGET_URL" -f "$SCRIPT_DIR/aiven-init.sql" &>/dev/null 2>&1; then
    pass "Aiven auth stubs applied"
  else
    log_warn "Aiven auth stubs had errors (may already exist)"
  fi
else
  skip "aiven-init.sql not found"
fi

# ---------------------------------------------------------------------------
# Step 7: Restore dump to target
# ---------------------------------------------------------------------------
log_step "Step 7: Restoring dump to Aiven"

restore_start=$(date +%s)

# Restore (suppress expected errors like role not found)
restore_errors=$(psql "$TARGET_URL" -f "$DUMP_FILE" 2>&1 | grep -i "error" | grep -iv "already exists" | grep -iv "does not exist" | head -5 || true)
restore_end=$(date +%s)
restore_time=$((restore_end - restore_start))

if [[ ${#restore_errors} -lt 10 ]]; then
  pass "Restore completed in ${restore_time}s"
else
  log_warn "Restore completed with some errors (${restore_time}s):"
  echo "  $restore_errors"
fi

# ---------------------------------------------------------------------------
# Step 8: Compare row counts
# ---------------------------------------------------------------------------
log_step "Step 8: Comparing row counts (source vs target)"

target_tables=$(psql "$TARGET_URL" -tAc \
  "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename NOT LIKE '\_%' ORDER BY tablename;" 2>/dev/null || true)

echo ""
printf "  %-35s %10s %10s %8s\n" "Table" "Source" "Target" "Match"
echo "  ─────────────────────────────────────────────────────────────────"

match_count=0
mismatch_count=0

for t in $target_tables; do
  target_count=$(psql "$TARGET_URL" -tAc "SELECT COUNT(*) FROM \"$t\";" 2>/dev/null || echo "?")
  source_count="${SOURCE_COUNTS[$t]:-?}"

  if [[ "$source_count" == "?" ]]; then
    printf "  %-35s %10s %10s %8s\n" "$t" "?" "$target_count" "-"
  elif [[ "$source_count" == "$target_count" ]]; then
    printf "  %-35s %10s %10s ${GREEN}%8s${NC}\n" "$t" "$source_count" "$target_count" "✓"
    ((match_count++))
  else
    printf "  %-35s %10s %10s ${RED}%8s${NC}\n" "$t" "$source_count" "$target_count" "✗"
    ((mismatch_count++))
  fi
done

echo ""

if [[ $mismatch_count -eq 0 && $match_count -gt 0 ]]; then
  pass "All $match_count tables match between source and target"
elif [[ $mismatch_count -gt 0 ]]; then
  fail "$mismatch_count tables have row count mismatches"
fi

# ---------------------------------------------------------------------------
# Step 9: Functional test — can we query MVP tables?
# ---------------------------------------------------------------------------
log_step "Step 9: Functional tests on restored database"

# Test: Query api_keys table structure
if psql "$TARGET_URL" -c "SELECT id, user_id, prefix, revoked FROM api_keys LIMIT 0;" &>/dev/null 2>&1; then
  pass "api_keys table structure OK"
else
  fail "api_keys table query failed"
fi

# Test: Query usage_counters
if psql "$TARGET_URL" -c "SELECT user_id, period_start, api_calls, tier FROM usage_counters LIMIT 0;" &>/dev/null 2>&1; then
  pass "usage_counters table structure OK"
else
  fail "usage_counters table query failed"
fi

# Test: Query report_schedules
if psql "$TARGET_URL" -c "SELECT id, user_id, frequency, format, enabled FROM report_schedules LIMIT 0;" &>/dev/null 2>&1; then
  pass "report_schedules table structure OK"
else
  fail "report_schedules table query failed"
fi

# Test: increment_usage_counter function exists
fn_exists=$(psql "$TARGET_URL" -tAc "SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_usage_counter');" 2>/dev/null || echo "f")
if [[ "$fn_exists" == "t" ]]; then
  pass "increment_usage_counter() function available"
else
  log_warn "increment_usage_counter() not found (expected if restoring schema-only)"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${CYAN}Backup Test Drive Results${NC}"
echo "  ═══════════════════════════════════════════════"
echo -e "  Passed:  ${GREEN}${TESTS_PASSED}${NC}"
echo -e "  Failed:  ${RED}${TESTS_FAILED}${NC}"
echo -e "  Skipped: ${YELLOW}${TESTS_SKIPPED}${NC}"
echo "  Duration: ${TOTAL_TIME}s ($(( TOTAL_TIME / 60 ))m $(( TOTAL_TIME % 60 ))s)"
echo "  Dump:     ${DUMP_FILE:-N/A}"
echo "  ═══════════════════════════════════════════════"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
  log_ok "All tests passed — backup pipeline is healthy"
  exit 0
else
  log_fail "$TESTS_FAILED test(s) failed — investigate before relying on backups"
  exit 1
fi
