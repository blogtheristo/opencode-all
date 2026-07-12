#!/usr/bin/env bash
# =============================================================================
# DGX Spark Internal Postgres — Offsite Backup to Aiven
# =============================================================================
# Backs up the Tier-1 internal-ops Postgres (dws-postgres container: agent
# memory, cron/command audit logs, tool telemetry, agent nudges) running on
# this DGX Spark box to the Aiven Postgres service, since this box is also
# documented in DWS_SECURITY_STANDARD.md's DR table as a backup *destination*
# for other systems — once it holds primary data itself, a single-site
# failure here must not also take out its own only copy.
#
# Mirrors the existing scripts/db-daily-backup.sh shape (dump, checksum,
# encrypt, transfer, retention, JSON status log) and reuses the
# pg_dump/pg_restore + row-count-verification pattern already built for
# scripts/Mirror-ToAiven.ps1 — just reversed in direction (dws-postgres is
# now the source, Aiven is the destination, not the other way round).
#
# Two artifacts are produced per run:
#   1. A live restore into Aiven's dws_internal database (the actual
#      recoverable copy — queryable, not just a file at rest).
#   2. A local GPG-encrypted dump, kept for a short retention window as a
#      second, file-based redundancy layer independent of Aiven's own
#      backups.
#
# Usage:
#   ./scripts/dgx-spark-postgres-backup-to-aiven.sh                # full run
#   ./scripts/dgx-spark-postgres-backup-to-aiven.sh --dry-run
#   ./scripts/dgx-spark-postgres-backup-to-aiven.sh --skip-restore # dump+encrypt only
#   ./scripts/dgx-spark-postgres-backup-to-aiven.sh --status
#
# Prerequisites (in .env on DGX Spark, not committed):
#   INTERNAL_DB_URL         — source connection string for dws-postgres (see
#                             infrastructure/dgx-spark/.env.example)
#   AIVEN_DATABASE_URL      — destination Aiven Postgres service URI (sslmode=require)
#   BACKUP_GPG_PASSPHRASE   — for the local encrypted retention copy (optional; skips if unset)
#
# Register under scripts/daily/ (Script Automation Rule) once
# INTERNAL_DB_URL and a confirmed EU-region Aiven service exist — see
# open task: confirm Aiven service region before wiring this in for real.
#
# Code-Version: 1.0.0
# Date: 2026-07-06
# Owner: Lifetime Oy
# =============================================================================

set -euo pipefail
umask 077
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"

LOCAL_BACKUP_DIR="${INTERNAL_DB_BACKUP_DIR:-/tmp/dws-internal-backup}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_TAG=$(date +%Y%m%d)
RETENTION_DAYS="${INTERNAL_DB_BACKUP_RETENTION_DAYS:-90}"
STATUS_FILE="$LOCAL_BACKUP_DIR/.backup-status.json"

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
DRY_RUN=false
SKIP_RESTORE=false
SHOW_STATUS=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)      DRY_RUN=true; shift ;;
    --skip-restore) SKIP_RESTORE=true; shift ;;
    --status)       SHOW_STATUS=true; shift ;;
    -h|--help)
      sed -n '/^# Usage:/,/^#$/p' "$0" | sed 's/^# //'
      exit 0 ;;
    *) log_error "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if $SHOW_STATUS; then
  if [[ -f "$STATUS_FILE" ]]; then
    cat "$STATUS_FILE"
  else
    echo '{"status":"no_backups_found","message":"No backup status file at '"$STATUS_FILE"'"}'
  fi
  exit 0
fi

# ---------------------------------------------------------------------------
# Validate prerequisites
# ---------------------------------------------------------------------------
validate() {
  local errors=0

  if ! command -v pg_dump &>/dev/null; then
    log_error "pg_dump not found. Install: sudo apt-get install postgresql-client"
    ((errors++))
  fi

  if [[ -z "${INTERNAL_DB_URL:-}" ]]; then
    log_error "INTERNAL_DB_URL not set — nothing to back up from"
    ((errors++))
  fi

  if ! $SKIP_RESTORE && [[ -z "${AIVEN_DATABASE_URL:-}" ]]; then
    log_error "AIVEN_DATABASE_URL not set — cannot push offsite copy (use --skip-restore to only produce a local encrypted dump)"
    ((errors++))
  fi

  if [[ $errors -gt 0 ]]; then
    log_error "$errors validation error(s) — cannot proceed"
    exit 1
  fi
}

if ! $DRY_RUN; then
  validate
fi

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${CYAN}DGX Spark Internal Postgres to Aiven Backup${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Date:      $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  Source:    dws-postgres (dws_internal)"
echo "  Restore:   $( $SKIP_RESTORE && echo 'skipped (--skip-restore)' || echo 'Aiven Postgres' )"
echo "  Local dir: $LOCAL_BACKUP_DIR"
echo "  ═══════════════════════════════════════════════"
echo ""

if $DRY_RUN; then
  log_info "[DRY RUN] Would create: $LOCAL_BACKUP_DIR/dws-internal-${DATE_TAG}.sql"
  log_info "[DRY RUN] Would encrypt with GPG (if BACKUP_GPG_PASSPHRASE set)"
  log_info "[DRY RUN] Would pg_restore into the Aiven target (unless --skip-restore)"
  exit 0
fi

mkdir -p "$LOCAL_BACKUP_DIR"
DUMP_FILE="$LOCAL_BACKUP_DIR/dws-internal-${DATE_TAG}.sql"
CHECKSUM_FILE="$DUMP_FILE.sha256"

# ---------------------------------------------------------------------------
# Step 1: pg_dump from dws-postgres
# ---------------------------------------------------------------------------
log_info "Step 1/5: Running pg_dump against dws-postgres..."
dump_start=$(date +%s)

if pg_dump "$INTERNAL_DB_URL" \
  --no-owner \
  --no-privileges \
  --no-comments \
  --format=plain \
  > "$DUMP_FILE" 2>/dev/null; then

  dump_end=$(date +%s)
  dump_size=$(du -h "$DUMP_FILE" | cut -f1)
  dump_bytes=$(stat -c%s "$DUMP_FILE" 2>/dev/null || stat -f%z "$DUMP_FILE" 2>/dev/null || echo "0")
  dump_tables=$(grep -c "^CREATE TABLE" "$DUMP_FILE" 2>/dev/null || echo "0")
  log_ok "pg_dump completed: $dump_size, $dump_tables tables ($((dump_end - dump_start))s)"
else
  log_error "pg_dump failed"
  exit 1
fi

if [[ "$dump_bytes" -lt 100 ]]; then
  log_error "Dump file suspiciously small ($dump_bytes bytes) — aborting"
  exit 1
fi

# ---------------------------------------------------------------------------
# Step 2: SHA256 checksum
# ---------------------------------------------------------------------------
log_info "Step 2/5: Creating SHA256 checksum..."
(
  cd "$(dirname "$DUMP_FILE")" && \
    sha256sum "$(basename "$DUMP_FILE")"
) > "$CHECKSUM_FILE"
log_ok "Checksum: $(cut -d' ' -f1 < "$CHECKSUM_FILE" | head -c 16)..."

# ---------------------------------------------------------------------------
# Step 3: local GPG-encrypted retention copy (second redundancy layer)
# ---------------------------------------------------------------------------
ENCRYPTED=false
if command -v gpg &>/dev/null && [[ -n "${BACKUP_GPG_PASSPHRASE:-}" ]]; then
  log_info "Step 3/5: Encrypting local retention copy with GPG (AES-256)..."
  printf '%s' "$BACKUP_GPG_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --symmetric \
    --cipher-algo AES256 \
    --output "${DUMP_FILE}.gpg" \
    "$DUMP_FILE"
  ENCRYPTED=true
  log_ok "Encrypted: ${DUMP_FILE}.gpg"
else
  log_warn "Step 3/5: gpg or BACKUP_GPG_PASSPHRASE not available — keeping local dump unencrypted"
fi

# ---------------------------------------------------------------------------
# Step 4: restore into Aiven (live, queryable offsite copy)
# ---------------------------------------------------------------------------
RESTORE_STATUS="skipped"
ROW_COUNT_MATCH="not_checked"

if ! $SKIP_RESTORE; then
  log_info "Step 4/5: Restoring into Aiven..."
  if psql "$AIVEN_DATABASE_URL" -v ON_ERROR_STOP=1 -f "$DUMP_FILE" &>/dev/null; then
    log_ok "Restore into Aiven completed"
    RESTORE_STATUS="success"

    log_info "Verifying row counts (source vs Aiven, per table)..."
    SOURCE_COUNTS=$(psql "$INTERNAL_DB_URL" -Atc \
      "SELECT tablename || ':' || (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', schemaname, tablename), false, true, '')))[1]::text FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null || echo "")
    AIVEN_COUNTS=$(psql "$AIVEN_DATABASE_URL" -Atc \
      "SELECT tablename || ':' || (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', schemaname, tablename), false, true, '')))[1]::text FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null || echo "")

    if [[ "$SOURCE_COUNTS" == "$AIVEN_COUNTS" && -n "$SOURCE_COUNTS" ]]; then
      log_ok "Row counts match between dws-postgres and Aiven"
      ROW_COUNT_MATCH="match"
    else
      log_warn "Row counts differ — review manually (source vs Aiven table counts printed above on failure)"
      ROW_COUNT_MATCH="mismatch"
    fi
  else
    log_error "Restore into Aiven failed"
    RESTORE_STATUS="failed"
  fi
else
  log_info "Step 4/5: Restore skipped (--skip-restore)"
fi

# ---------------------------------------------------------------------------
# Step 5: retention cleanup + status log
# ---------------------------------------------------------------------------
log_info "Step 5/5: Cleaning up backups older than ${RETENTION_DAYS} days..."
find "$LOCAL_BACKUP_DIR" -name "dws-internal-*.sql*" -type f -mtime +"$RETENTION_DAYS" -delete 2>/dev/null || true

# Unencrypted dump is only needed locally if it was never encrypted;
# once a .gpg copy exists, drop the plaintext to limit exposure.
if $ENCRYPTED; then
  rm -f "$DUMP_FILE"
fi

END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

OVERALL_STATUS="success"
EXIT_CODE=0
if [[ "$RESTORE_STATUS" == "failed" || "$ROW_COUNT_MATCH" == "mismatch" ]]; then
  OVERALL_STATUS="partial"
  EXIT_CODE=2
fi

cat > "$STATUS_FILE" <<STATUSEOF
{
  "status": "$OVERALL_STATUS",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "dump_size_bytes": $dump_bytes,
  "dump_tables": $dump_tables,
  "encrypted": $ENCRYPTED,
  "checksum": "$(cut -d' ' -f1 < "$CHECKSUM_FILE" 2>/dev/null || echo 'N/A')",
  "aiven_restore": "$RESTORE_STATUS",
  "row_count_check": "$ROW_COUNT_MATCH",
  "retention_days": $RETENTION_DAYS,
  "duration_seconds": $TOTAL_TIME,
  "source": "dws-postgres",
  "target": "aiven"
}
STATUSEOF

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${CYAN}Backup Summary${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Status:       $OVERALL_STATUS"
echo "  Size:         $dump_size ($dump_tables tables)"
echo "  Encrypted:    $ENCRYPTED"
echo "  Aiven restore: $RESTORE_STATUS"
echo "  Row counts:   $ROW_COUNT_MATCH"
echo "  Duration:     ${TOTAL_TIME}s"
echo "  Status log:   $STATUS_FILE"
echo "  ═══════════════════════════════════════════════"
echo ""

exit $EXIT_CODE
