#!/usr/bin/env bash
# =============================================================================
# DWS6 Database Recovery Script
# =============================================================================
# Rebuilds the full DWS6 database schema from migration files.
# Target: complete recovery in MINUTES, not hours.
#
# Usage:
#   ./scripts/db-recovery.sh --target supabase   # New Supabase project
#   ./scripts/db-recovery.sh --target aiven       # Aiven sandbox
#   ./scripts/db-recovery.sh --target custom --db-url "postgresql://..."
#   ./scripts/db-recovery.sh --target supabase --restore-dump /path/to/dump.sql
#
# Prerequisites:
#   - psql (PostgreSQL client) installed
#   - .env file with database credentials (or --db-url flag)
#   - For Supabase: SUPABASE_DB_* variables in .env
#   - For Aiven: AIVEN_DATABASE_URL in .env
#
# Version: 1.0 | Date: 2026-03-08
# Session: claude/build-mvp-features-nFk7k
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MIGRATIONS_DIR="$REPO_ROOT/supabase/migrations"
AIVEN_INIT="$SCRIPT_DIR/aiven-init.sql"
ENV_FILE="$REPO_ROOT/.env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Timing
START_TIME=$(date +%s)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

elapsed() {
  local now=$(date +%s)
  local diff=$((now - START_TIME))
  echo "${diff}s"
}

usage() {
  cat <<EOF
Usage: $0 [OPTIONS]

Options:
  --target <supabase|aiven|custom>  Target database (required)
  --db-url <url>                    Direct PostgreSQL connection URL (for custom)
  --restore-dump <path>             Restore from pg_dump file after schema setup
  --skip-migrations                 Skip migration replay (use with --restore-dump)
  --dry-run                         Print what would be done without executing
  --verbose                         Show SQL output
  -h, --help                        Show this help

Examples:
  $0 --target supabase
  $0 --target aiven
  $0 --target custom --db-url "postgresql://user:pass@host:5432/dbname"
  $0 --target supabase --restore-dump backups/dws6-20260308.sql
EOF
  exit 0
}

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
TARGET=""
DB_URL=""
RESTORE_DUMP=""
SKIP_MIGRATIONS=false
DRY_RUN=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --target)       TARGET="$2"; shift 2 ;;
    --db-url)       DB_URL="$2"; shift 2 ;;
    --restore-dump) RESTORE_DUMP="$2"; shift 2 ;;
    --skip-migrations) SKIP_MIGRATIONS=true; shift ;;
    --dry-run)      DRY_RUN=true; shift ;;
    --verbose)      VERBOSE=true; shift ;;
    -h|--help)      usage ;;
    *) log_error "Unknown option: $1"; usage ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  log_error "Missing --target. Use: supabase, aiven, or custom"
  usage
fi

# ---------------------------------------------------------------------------
# Load .env (if exists)
# ---------------------------------------------------------------------------
if [[ -f "$ENV_FILE" ]]; then
  log_info "Loading .env from $ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  log_warn "No .env file found at $ENV_FILE — using environment variables"
fi

# ---------------------------------------------------------------------------
# Resolve database URL
# ---------------------------------------------------------------------------
resolve_db_url() {
  case "$TARGET" in
    supabase)
      if [[ -z "${SUPABASE_DB_HOST:-}" || -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
        log_error "SUPABASE_DB_HOST and SUPABASE_DB_PASSWORD required in .env"
        exit 1
      fi
      local host="${SUPABASE_DB_HOST}"
      local port="${SUPABASE_DB_PORT:-5432}"
      local name="${SUPABASE_DB_NAME:-postgres}"
      local user="${SUPABASE_DB_USER:-postgres}"
      local pass="${SUPABASE_DB_PASSWORD}"
      DB_URL="postgresql://${user}:${pass}@${host}:${port}/${name}?sslmode=require"
      log_info "Target: Supabase (${host})"
      ;;
    aiven)
      if [[ -z "${AIVEN_DATABASE_URL:-}" ]]; then
        log_error "AIVEN_DATABASE_URL required in .env"
        exit 1
      fi
      DB_URL="${AIVEN_DATABASE_URL}"
      log_info "Target: Aiven"
      ;;
    custom)
      if [[ -z "$DB_URL" ]]; then
        log_error "Custom target requires --db-url"
        exit 1
      fi
      log_info "Target: Custom database"
      ;;
    *)
      log_error "Invalid target: $TARGET. Use: supabase, aiven, or custom"
      exit 1
      ;;
  esac
}

resolve_db_url

# ---------------------------------------------------------------------------
# Verify psql is available
# ---------------------------------------------------------------------------
if ! command -v psql &>/dev/null; then
  log_error "psql not found. Install PostgreSQL client: sudo apt-get install postgresql-client"
  exit 1
fi

# ---------------------------------------------------------------------------
# Test connection
# ---------------------------------------------------------------------------
test_connection() {
  log_info "Testing database connection..."
  if $DRY_RUN; then
    log_info "[DRY RUN] Would test connection to database"
    return
  fi

  if psql "$DB_URL" -c "SELECT 1;" &>/dev/null; then
    log_ok "Database connection successful ($(elapsed))"
  else
    log_error "Cannot connect to database. Check credentials."
    exit 1
  fi
}

test_connection

# ---------------------------------------------------------------------------
# Aiven: Apply auth stubs (if targeting Aiven)
# ---------------------------------------------------------------------------
apply_aiven_stubs() {
  if [[ "$TARGET" != "aiven" ]]; then
    return
  fi

  if [[ ! -f "$AIVEN_INIT" ]]; then
    log_warn "Aiven init script not found at $AIVEN_INIT — skipping auth stubs"
    return
  fi

  log_info "Applying Aiven auth stubs (auth.uid, auth.jwt, auth.role)..."
  if $DRY_RUN; then
    log_info "[DRY RUN] Would apply $AIVEN_INIT"
    return
  fi

  if $VERBOSE; then
    psql "$DB_URL" -f "$AIVEN_INIT"
  else
    psql "$DB_URL" -f "$AIVEN_INIT" 2>&1 | grep -E "(NOTICE|ERROR)" || true
  fi
  log_ok "Aiven auth stubs applied ($(elapsed))"
}

apply_aiven_stubs

# ---------------------------------------------------------------------------
# Apply migrations in order
# ---------------------------------------------------------------------------
apply_migrations() {
  if $SKIP_MIGRATIONS; then
    log_info "Skipping migrations (--skip-migrations flag)"
    return
  fi

  # Collect only numbered migration .sql files (exclude READMEs, test files, run-pending)
  local migration_files=()
  while IFS= read -r f; do
    local basename
    basename=$(basename "$f")
    # Only include files matching NNN_*.sql pattern
    if [[ "$basename" =~ ^[0-9]{3}_.*\.sql$ ]]; then
      migration_files+=("$f")
    fi
  done < <(find "$MIGRATIONS_DIR" -name "*.sql" -type f | sort)

  local total=${#migration_files[@]}
  log_info "Found $total migrations to apply"

  if $DRY_RUN; then
    for f in "${migration_files[@]}"; do
      echo "  Would apply: $(basename "$f")"
    done
    return
  fi

  local applied=0
  local failed=0

  for f in "${migration_files[@]}"; do
    local name
    name=$(basename "$f")
    local step_start
    step_start=$(date +%s)

    if $VERBOSE; then
      echo -n "  Applying $name... "
      if psql "$DB_URL" -f "$f" 2>&1; then
        local step_end=$(date +%s)
        echo -e "${GREEN}OK${NC} ($((step_end - step_start))s)"
        ((applied++))
      else
        echo -e "${RED}FAILED${NC}"
        ((failed++))
        log_warn "Migration $name failed — continuing with remaining migrations"
      fi
    else
      echo -n "  [$((applied + failed + 1))/$total] $name... "
      if psql "$DB_URL" -f "$f" &>/dev/null 2>&1; then
        local step_end=$(date +%s)
        echo -e "${GREEN}OK${NC} ($((step_end - step_start))s)"
        ((applied++))
      else
        echo -e "${RED}FAILED${NC}"
        ((failed++))
        # Try again with output to see the error
        local err
        err=$(psql "$DB_URL" -f "$f" 2>&1 | tail -3)
        log_warn "  Error: $err"
      fi
    fi
  done

  echo ""
  log_info "Migrations: $applied applied, $failed failed out of $total ($(elapsed))"

  if [[ $failed -gt 0 ]]; then
    log_warn "Some migrations failed. This may be OK if tables already exist (idempotent migrations)."
  fi
}

apply_migrations

# ---------------------------------------------------------------------------
# Restore from dump (optional)
# ---------------------------------------------------------------------------
restore_dump() {
  if [[ -z "$RESTORE_DUMP" ]]; then
    return
  fi

  if [[ ! -f "$RESTORE_DUMP" ]]; then
    # Check for GPG-encrypted dump
    if [[ -f "${RESTORE_DUMP}.gpg" ]]; then
      log_info "Found encrypted dump — decrypting..."
      if [[ -z "${BACKUP_GPG_PASSPHRASE:-}" ]]; then
        log_error "BACKUP_GPG_PASSPHRASE required in .env to decrypt backup"
        exit 1
      fi
      gpg --batch --yes --passphrase "$BACKUP_GPG_PASSPHRASE" \
        --output "$RESTORE_DUMP" --decrypt "${RESTORE_DUMP}.gpg"
      log_ok "Decrypted to $RESTORE_DUMP"
    else
      log_error "Dump file not found: $RESTORE_DUMP"
      exit 1
    fi
  fi

  local dump_size
  dump_size=$(du -h "$RESTORE_DUMP" | cut -f1)
  log_info "Restoring from dump: $RESTORE_DUMP ($dump_size)"

  if $DRY_RUN; then
    log_info "[DRY RUN] Would restore from $RESTORE_DUMP"
    return
  fi

  local restore_start
  restore_start=$(date +%s)

  if psql "$DB_URL" -f "$RESTORE_DUMP" 2>&1 | tail -5; then
    local restore_end=$(date +%s)
    log_ok "Dump restored in $((restore_end - restore_start))s"
  else
    log_error "Dump restore failed"
    exit 1
  fi
}

restore_dump

# ---------------------------------------------------------------------------
# Verify: table existence and row counts
# ---------------------------------------------------------------------------
verify_recovery() {
  log_info "Verifying recovery..."

  if $DRY_RUN; then
    log_info "[DRY RUN] Would verify table existence and row counts"
    return
  fi

  # Core tables that must exist after full migration
  local core_tables=(
    "users"
    "organizations"
    "api_keys"
    "usage_events"
    "usage_counters"
    "report_schedules"
  )

  local verified=0
  local missing=0

  echo ""
  echo "  Table Verification:"
  echo "  ─────────────────────────────────────────────"

  for table in "${core_tables[@]}"; do
    local exists
    exists=$(psql "$DB_URL" -tAc "SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '$table');" 2>/dev/null || echo "f")

    if [[ "$exists" == "t" ]]; then
      local count
      count=$(psql "$DB_URL" -tAc "SELECT COUNT(*) FROM $table;" 2>/dev/null || echo "?")
      echo -e "  ${GREEN}✓${NC} $table ($count rows)"
      ((verified++))
    else
      echo -e "  ${RED}✗${NC} $table (MISSING)"
      ((missing++))
    fi
  done

  # Check RLS status
  echo ""
  echo "  RLS Verification:"
  echo "  ─────────────────────────────────────────────"

  local rls_tables=("api_keys" "usage_events" "usage_counters" "report_schedules")
  for table in "${rls_tables[@]}"; do
    local rls
    rls=$(psql "$DB_URL" -tAc "SELECT rowsecurity FROM pg_tables WHERE tablename = '$table';" 2>/dev/null || echo "")
    if [[ "$rls" == "t" ]]; then
      echo -e "  ${GREEN}✓${NC} $table — RLS enabled"
    elif [[ -z "$rls" ]]; then
      echo -e "  ${YELLOW}-${NC} $table — table not found"
    else
      echo -e "  ${RED}✗${NC} $table — RLS NOT enabled"
    fi
  done

  # Check increment_usage_counter function
  echo ""
  local fn_exists
  fn_exists=$(psql "$DB_URL" -tAc "SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_usage_counter');" 2>/dev/null || echo "f")
  if [[ "$fn_exists" == "t" ]]; then
    echo -e "  ${GREEN}✓${NC} increment_usage_counter() function exists"
  else
    echo -e "  ${RED}✗${NC} increment_usage_counter() function MISSING"
  fi

  echo ""
  log_info "Verified: $verified tables OK, $missing missing"
}

verify_recovery

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${GREEN}DWS6 Database Recovery Complete${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Target:    $TARGET"
echo "  Duration:  ${TOTAL_TIME}s ($(( TOTAL_TIME / 60 ))m $(( TOTAL_TIME % 60 ))s)"
echo "  Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  ═══════════════════════════════════════════════"
echo ""

if [[ $TOTAL_TIME -lt 300 ]]; then
  log_ok "RTO target met: recovery completed in under 5 minutes"
else
  log_warn "RTO target at risk: recovery took ${TOTAL_TIME}s (target: <300s)"
fi
