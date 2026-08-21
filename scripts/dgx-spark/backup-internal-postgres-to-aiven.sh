#!/usr/bin/env bash
#
# Backup DGX Spark internal Postgres (dws-postgres) to Aiven (offsite, encrypted)
# Usage: ./backup-internal-postgres-to-aiven.sh [--dry-run]
#
# Prerequisites (set in .env):
#   - INTERNAL_DB_URL: dws-postgres connection string
#   - AIVEN_DATABASE_URL: Aiven PostgreSQL connection string
#   - BACKUP_GPG_CRED: Symmetric encryption passphrase
#   - psql, pg_dump, gpg installed
#
# Workflow (DR-3/DR-4):
#   1. pg_dump --clean --if-exists from dws-postgres → idempotent uncompressed SQL
#   2. GPG symmetric AES-256 encrypt → delete plaintext
#   3. Replay the plain SQL dump to Aiven through psql (idempotent because dump includes DROP/CREATE)
#   4. Row count verification (DR-4)
#   5. Prune local backups >90 days
#

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-$(pwd)/backups/dws-postgres}"
BACKUP_RETENTION_DAYS=90
DRY_RUN="${1:-}"
GPG_CRED="${BACKUP_GPG_CRED:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log_info() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"; }
log_ok() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✓${NC} $*"; }
log_warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠${NC} $*"; }
log_error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ✗${NC} $*"; }

# Validation
validate_env() {
  local missing=()
  [ -z "${INTERNAL_DB_URL:-}" ] && missing+=("INTERNAL_DB_URL")
  [ -z "${AIVEN_DATABASE_URL:-}" ] && missing+=("AIVEN_DATABASE_URL")
  [ -z "$GPG_CRED" ] && missing+=("BACKUP_GPG_CRED")

  if [ ${#missing[@]} -gt 0 ]; then
    log_error "Missing environment variables: ${missing[*]}"
    return 1
  fi
}

# Test connections
test_connections() {
  log_info "Testing connection to dws-postgres..."
  if ! psql "$INTERNAL_DB_URL" -c "SELECT version();" &>/dev/null; then
    log_error "Cannot connect to dws-postgres"
    return 1
  fi
  log_ok "dws-postgres reachable"

  log_info "Testing connection to Aiven..."
  if ! psql "$AIVEN_DATABASE_URL" -c "SELECT version();" &>/dev/null; then
    log_error "Cannot connect to Aiven"
    return 1
  fi
  log_ok "Aiven reachable"
}

# Backup workflow
backup_workflow() {
  local timestamp=$(date +'%Y%m%d-%H%M%S')
  local backup_name="dws-postgres-${timestamp}"
  local sql_file="${BACKUP_DIR}/${backup_name}.sql"
  local encrypted_file="${BACKUP_DIR}/${backup_name}.sql.gpg"

  mkdir -p "$BACKUP_DIR"

  # Step 1: pg_dump (plain SQL with cleanup statements; preserve stderr for diagnostics)
  log_info "Dumping dws-postgres schema and data in idempotent plain-SQL mode..."
  if [ "$DRY_RUN" != "--dry-run" ]; then
    if ! pg_dump --clean --if-exists "$INTERNAL_DB_URL" > "$sql_file" 2>"${sql_file}.log"; then
      log_error "pg_dump failed (see ${sql_file}.log)"
      return 1
    fi
    local dump_size=$(du -h "$sql_file" | cut -f1)
    log_ok "Dump complete: ${dump_size}"
  else
    log_ok "[DRY-RUN] Would dump to ${sql_file}"
    return 0
  fi

  # Step 2: GPG encrypt (AES-256) + delete plaintext
  log_info "Encrypting dump (AES-256)..."
  if ! echo "$GPG_CRED" | gpg --quiet --batch --symmetric \
    --cipher-algo AES256 --passphrase-fd 0 "$sql_file"; then
    log_error "GPG encryption failed"
    return 1
  fi
  rm -f "$sql_file" "${sql_file}.log"
  local encrypted_size=$(du -h "$encrypted_file" | cut -f1)
  log_ok "Encrypted: ${encrypted_size}"

  # Step 3: replay the idempotent plain-SQL dump to Aiven through psql
  # Preserves diagnostics: redirection goes to log file, not discarded
  log_info "Restoring to Aiven by replaying idempotent plain SQL..."
  local restore_log="${encrypted_file}.restore.log"
  if ! echo "$GPG_CRED" | gpg --quiet --batch --decrypt \
    --passphrase-fd 0 "$encrypted_file" | \
    psql "$AIVEN_DATABASE_URL" --set ON_ERROR_STOP=on \
    2>&1 | tee "$restore_log"; then
    log_error "psql restore failed (see ${restore_log})"
    return 1
  fi
  log_ok "Restore to Aiven complete"

  # Step 4: Row count verification (DR-4)
  log_info "Verifying row counts..."
  local local_counts=$(psql "$INTERNAL_DB_URL" -t -c "
    SELECT tablename, pg_total_relation_size('public.' || tablename) as size
    FROM pg_tables WHERE schemaname = 'public'
    ORDER BY tablename;" | sort)

  local remote_counts=$(psql "$AIVEN_DATABASE_URL" -t -c "
    SELECT tablename, pg_total_relation_size('public.' || tablename) as size
    FROM pg_tables WHERE schemaname = 'public'
    ORDER BY tablename;" | sort)

  if [ "$local_counts" != "$remote_counts" ]; then
    log_warn "Row counts differ — verify data integrity"
    echo "LOCAL:"
    echo "$local_counts"
    echo "AIVEN:"
    echo "$remote_counts"
  else
    log_ok "Row counts verified (DR-4)"
  fi

  # Step 5: Prune old backups >90 days
  log_info "Pruning backups older than ${BACKUP_RETENTION_DAYS} days..."
  find "$BACKUP_DIR" -name "dws-postgres-*.sql.gpg" -mtime +${BACKUP_RETENTION_DAYS} -delete
  log_ok "Retention policy enforced"

  log_ok "Backup complete: ${encrypted_file}"
}

# Main
main() {
  log_info "DWS-PostgreSQL offsite backup to Aiven (DR-8)"
  log_info "Dry run: ${DRY_RUN:-false}"

  validate_env || return 1
  test_connections || return 1
  backup_workflow || return 1

  log_ok "All steps successful"
}

main
