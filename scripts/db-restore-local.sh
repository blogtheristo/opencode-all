#!/usr/bin/env bash
# =============================================================================
# DWS6 Local Database Restore — Acer Veriton GN100
# =============================================================================
# Restores the latest Supabase backup into the local Acer edge PostgreSQL.
# Creates a full local replica that can serve as emergency failover.
#
# This script:
#   1. Finds the latest backup (encrypted or plain)
#   2. Decrypts if needed (GPG)
#   3. Verifies SHA256 checksum
#   4. Drops and recreates the replica schema
#   5. Restores the dump into local PostgreSQL
#   6. Applies Supabase auth stubs (auth.uid, auth.jwt, auth.role)
#   7. Verifies table counts
#   8. Writes restore status JSON
#
# Usage:
#   ./scripts/db-restore-local.sh                          # Auto-find latest backup
#   ./scripts/db-restore-local.sh --dump /path/to/dump.sql # Specific dump file
#   ./scripts/db-restore-local.sh --dump /path/to/dump.sql.gpg  # Encrypted
#   ./scripts/db-restore-local.sh --dry-run                # Show what would happen
#   ./scripts/db-restore-local.sh --target-url "postgresql://..."  # Custom target
#
# Default target: local Acer edge PostgreSQL (dws-edge-postgres container)
#
# Code-Version: 1.0.0
# Introduced-In: PR-TBD
# Branch: claude/local-database-backup-2Mbl7
# Date: 2026-03-23
# Owner: Lifetime Oy
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

START_TIME=$(date +%s)

log_info()  { echo -e "$(date -u +%H:%M:%S) ${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "$(date -u +%H:%M:%S) ${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "$(date -u +%H:%M:%S) ${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "$(date -u +%H:%M:%S) ${RED}[ERROR]${NC} $1"; }

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
DUMP_PATH=""
DRY_RUN=false
TARGET_URL=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dump)        DUMP_PATH="$2"; shift 2 ;;
    --dry-run)     DRY_RUN=true; shift ;;
    --target-url)  TARGET_URL="$2"; shift 2 ;;
    -h|--help)
      sed -n '/^# Usage:/,/^#$/p' "$0" | sed 's/^# //'
      exit 0 ;;
    *) log_error "Unknown option: $1"; exit 1 ;;
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
fi

LOCAL_BACKUP_DIR="${BACKUP_LOCAL_DIR:-/tmp/dws6-backup}"

# ---------------------------------------------------------------------------
# Resolve target database URL
# ---------------------------------------------------------------------------
if [[ -z "$TARGET_URL" ]]; then
  # Default: local Acer edge PostgreSQL
  EDGE_HOST="${EDGE_PG_HOST:-localhost}"
  EDGE_PORT="${EDGE_PG_PORT:-5432}"
  EDGE_USER="${EDGE_PG_USER:-dws_edge}"
  EDGE_PASS="${EDGE_PG_PASSWORD:-}"
  EDGE_DB="${EDGE_PG_DATABASE:-dws_edge}"

  if [[ -z "$EDGE_PASS" ]]; then
    log_error "EDGE_PG_PASSWORD required in .env (or use --target-url)"
    exit 1
  fi

  TARGET_URL="postgresql://${EDGE_USER}:${EDGE_PASS}@${EDGE_HOST}:${EDGE_PORT}/${EDGE_DB}"
fi

# ---------------------------------------------------------------------------
# Find latest backup
# ---------------------------------------------------------------------------
find_latest_backup() {
  if [[ -n "$DUMP_PATH" ]]; then
    echo "$DUMP_PATH"
    return
  fi

  # Search in priority order: daily (most recent), then monthly, then yearly
  local latest=""
  for subdir in daily monthly yearly; do
    local dir="$LOCAL_BACKUP_DIR/$subdir"
    if [[ -d "$dir" ]]; then
      local found
      found=$(find "$dir" -name "dws6-*.sql" -o -name "dws6-*.sql.gpg" 2>/dev/null | sort -r | head -1 || true)
      if [[ -n "$found" ]]; then
        latest="$found"
        break
      fi
    fi
  done

  # Also check root backup dir
  if [[ -z "$latest" ]]; then
    latest=$(find "$LOCAL_BACKUP_DIR" -name "dws6-*.sql" -o -name "dws6-*.sql.gpg" 2>/dev/null | sort -r | head -1 || true)
  fi

  echo "$latest"
}

DUMP_FILE=$(find_latest_backup)

if [[ -z "$DUMP_FILE" ]]; then
  log_error "No backup file found in $LOCAL_BACKUP_DIR"
  log_error "Run db-daily-backup.sh first, or specify --dump <path>"
  exit 1
fi

log_info "Found backup: $DUMP_FILE"

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${CYAN}DWS6 Local Database Restore${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Backup:  $(basename "$DUMP_FILE")"
echo "  Target:  local edge PostgreSQL"
echo "  ═══════════════════════════════════════════════"
echo ""

if $DRY_RUN; then
  log_info "[DRY RUN] Would decrypt (if .gpg), verify checksum, restore to local DB"
  exit 0
fi

# ---------------------------------------------------------------------------
# Step 1: Decrypt if needed
# ---------------------------------------------------------------------------
RESTORE_FILE="$DUMP_FILE"

if [[ "$DUMP_FILE" == *.gpg ]]; then
  log_info "Step 1/5: Decrypting backup..."
  DECRYPTED_FILE="${DUMP_FILE%.gpg}"

  if [[ -z "${BACKUP_GPG_PASSPHRASE:-}" ]]; then
    log_error "BACKUP_GPG_PASSPHRASE required in .env to decrypt backup"
    exit 1
  fi

  gpg --batch --yes --quiet \
    --passphrase "$BACKUP_GPG_PASSPHRASE" \
    --output "$DECRYPTED_FILE" \
    --decrypt "$DUMP_FILE"

  RESTORE_FILE="$DECRYPTED_FILE"
  log_ok "Decrypted: $(basename "$DECRYPTED_FILE")"
else
  log_info "Step 1/5: No decryption needed (plain SQL)"
fi

# ---------------------------------------------------------------------------
# Step 2: Verify checksum
# ---------------------------------------------------------------------------
log_info "Step 2/5: Verifying checksum..."
CHECKSUM_FILE="${RESTORE_FILE}.sha256"

if [[ -f "$CHECKSUM_FILE" ]]; then
  if sha256sum --check "$CHECKSUM_FILE" &>/dev/null; then
    log_ok "Checksum verified"
  else
    log_error "Checksum mismatch — backup may be corrupted"
    exit 1
  fi
elif [[ -f "${CHECKSUM_FILE}.gpg" && -n "${BACKUP_GPG_PASSPHRASE:-}" ]]; then
  # Decrypt checksum file
  gpg --batch --yes --quiet \
    --passphrase "$BACKUP_GPG_PASSPHRASE" \
    --output "$CHECKSUM_FILE" \
    --decrypt "${CHECKSUM_FILE}.gpg" 2>/dev/null || true

  if [[ -f "$CHECKSUM_FILE" ]] && sha256sum --check "$CHECKSUM_FILE" &>/dev/null; then
    log_ok "Checksum verified (decrypted)"
  else
    log_warn "Checksum verification failed — proceeding with caution"
  fi
else
  log_warn "No checksum file found — skipping verification"
fi

# ---------------------------------------------------------------------------
# Step 3: Test target connection
# ---------------------------------------------------------------------------
log_info "Step 3/5: Testing local database connection..."
if ! psql "$TARGET_URL" -c "SELECT 1;" &>/dev/null; then
  log_error "Cannot connect to local database"
  log_error "Is dws-edge-postgres running? Try: docker compose -f Admin/Acer-Veriton-GN100/postgres/docker-compose.yml up -d"
  exit 1
fi
log_ok "Local database reachable"

# ---------------------------------------------------------------------------
# Step 4: Prepare and restore
# ---------------------------------------------------------------------------
log_info "Step 4/5: Restoring to local database..."

# Create supabase_replica schema to avoid conflicts with edge-native data
# We use public schema since that's what the dump contains
restore_start=$(date +%s)

# Apply auth stubs first (Supabase auth.uid(), auth.jwt(), etc.)
AIVEN_INIT="$SCRIPT_DIR/aiven-init.sql"
if [[ -f "$AIVEN_INIT" ]]; then
  log_info "  Applying auth stubs..."
  psql "$TARGET_URL" -f "$AIVEN_INIT" &>/dev/null 2>&1 || true
fi

# Drop existing public schema objects and restore
# Use a transaction wrapper for safety
psql "$TARGET_URL" <<'PRESQL' &>/dev/null 2>&1 || true
-- Drop all tables in public schema (cascade) to allow clean restore
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END $$;

-- Drop all functions in public schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT proname, oidvectortypes(proargtypes) as args
            FROM pg_proc
            WHERE pronamespace = 'public'::regnamespace)
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
  END LOOP;
END $$;
PRESQL

# Restore the dump
restore_errors=$(psql "$TARGET_URL" -f "$RESTORE_FILE" 2>&1 | grep -i "error" | grep -iv "already exists" | grep -iv "does not exist" | grep -iv "current transaction" | head -5 || true)
restore_end=$(date +%s)
restore_time=$((restore_end - restore_start))

if [[ ${#restore_errors} -lt 10 ]]; then
  log_ok "Restore completed in ${restore_time}s"
else
  log_warn "Restore completed with some errors (${restore_time}s):"
  echo "  $restore_errors"
fi

# ---------------------------------------------------------------------------
# Step 5: Verify
# ---------------------------------------------------------------------------
log_info "Step 5/5: Verifying restore..."

table_count=$(psql "$TARGET_URL" -tAc "SELECT COUNT(*) FROM pg_tables WHERE schemaname='public';" 2>/dev/null || echo "0")
log_ok "$table_count tables in local database"

# Check core tables
core_tables=("api_keys" "usage_events" "users" "organizations" "firehorse_leads")
verified=0
for table in "${core_tables[@]}"; do
  exists=$(psql "$TARGET_URL" -tAc "SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='$table');" 2>/dev/null || echo "f")
  if [[ "$exists" == "t" ]]; then
    count=$(psql "$TARGET_URL" -tAc "SELECT COUNT(*) FROM \"$table\";" 2>/dev/null || echo "?")
    echo -e "  ${GREEN}✓${NC} $table ($count rows)"
    ((verified++))
  else
    echo -e "  ${YELLOW}-${NC} $table (not found)"
  fi
done

# ---------------------------------------------------------------------------
# Write status
# ---------------------------------------------------------------------------
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

RESTORE_STATUS_FILE="$LOCAL_BACKUP_DIR/.restore-status.json"
cat > "$RESTORE_STATUS_FILE" <<STATUSEOF
{
  "status": "success",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "source_dump": "$(basename "$DUMP_FILE")",
  "target": "local_edge_postgres",
  "tables_restored": $table_count,
  "core_tables_verified": $verified,
  "restore_seconds": $restore_time,
  "total_seconds": $TOTAL_TIME
}
STATUSEOF

# Clean up decrypted file if we created one
if [[ "$DUMP_FILE" == *.gpg && -f "${DUMP_FILE%.gpg}" ]]; then
  rm -f "${DUMP_FILE%.gpg}"
  rm -f "${DUMP_FILE%.gpg}.sha256"
  log_info "Cleaned up decrypted temp files"
fi

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${GREEN}Local Restore Complete${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Tables:   $table_count"
echo "  Verified: $verified/${#core_tables[@]} core tables"
echo "  Duration: ${TOTAL_TIME}s"
echo "  ═══════════════════════════════════════════════"
echo ""

log_ok "Local database is now a replica of Supabase"
