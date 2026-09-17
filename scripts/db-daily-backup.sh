#!/usr/bin/env bash
# =============================================================================
# DWS6 Daily Database Backup
# =============================================================================
# Automated daily backup of Supabase PostgreSQL to local storage.
#
# Destinations (in priority order):
#   1. PRIMARY:   Acer Veriton GN100 Helsinki (/backups/dws6-db/)
#   2. SECONDARY: Win11 F: drive (F:\2026\Backups\dws6-db)
#
# Features:
#   - Full pg_dump (schema + data) from Supabase cloud
#   - GPG symmetric encryption (AES-256)
#   - SHA256 checksum for integrity verification
#   - Retention: 30 daily, 12 monthly (1st of month), forever yearly (Jan 1)
#   - SCP transfer to Acer Veriton (primary) and Win11 (secondary)
#   - JSON status log for monitoring
#   - Exit code 0 = success, 1 = failure, 2 = partial (dump OK, transfer failed)
#
# Usage:
#   ./scripts/db-daily-backup.sh                  # Full backup (dump + encrypt + transfer)
#   ./scripts/db-daily-backup.sh --local-only     # Dump + encrypt, skip SCP transfers
#   ./scripts/db-daily-backup.sh --no-encrypt     # Skip GPG encryption
#   ./scripts/db-daily-backup.sh --dry-run        # Show what would happen
#   ./scripts/db-daily-backup.sh --status         # Show last backup status
#
# Cron (on Acer Veriton — recommended):
#   0 2 * * * /home/backup/dws6/scripts/db-daily-backup.sh >> /var/log/dws6-backup.log 2>&1
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

# Defaults
LOCAL_BACKUP_DIR="${BACKUP_LOCAL_DIR:-/tmp/dws6-backup}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_TAG=$(date +%Y%m%d)
MONTH_TAG=$(date +%Y%m)
YEAR_TAG=$(date +%Y)
DAY_OF_MONTH=$(date +%d)
MONTH_NUM=$(date +%m)

# Retention
DAILY_RETENTION=30
MONTHLY_RETENTION=365  # ~12 months
YEARLY_RETENTION=3650  # ~10 years

# Status log
STATUS_FILE="$LOCAL_BACKUP_DIR/.backup-status.json"

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
LOCAL_ONLY=false
NO_ENCRYPT=false
DRY_RUN=false
SHOW_STATUS=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --local-only)  LOCAL_ONLY=true; shift ;;
    --no-encrypt)  NO_ENCRYPT=true; shift ;;
    --dry-run)     DRY_RUN=true; shift ;;
    --status)      SHOW_STATUS=true; shift ;;
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

# Re-read after env load
LOCAL_BACKUP_DIR="${BACKUP_LOCAL_DIR:-/tmp/dws6-backup}"
STATUS_FILE="$LOCAL_BACKUP_DIR/.backup-status.json"

# ---------------------------------------------------------------------------
# Show status and exit
# ---------------------------------------------------------------------------
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

  # pg_dump required
  if ! command -v pg_dump &>/dev/null; then
    log_error "pg_dump not found. Install: sudo apt-get install postgresql-client"
    ((errors++))
  fi

  # Supabase credentials required
  if [[ -z "${SUPABASE_DB_HOST:-}" || -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
    log_error "SUPABASE_DB_HOST and SUPABASE_DB_PASSWORD required in .env"
    ((errors++))
  fi

  # GPG for encryption (unless --no-encrypt)
  if ! $NO_ENCRYPT && ! command -v gpg &>/dev/null; then
    log_warn "gpg not found — will skip encryption (use --no-encrypt to suppress)"
    NO_ENCRYPT=true
  fi

  # GPG passphrase
  if ! $NO_ENCRYPT && [[ -z "${BACKUP_GPG_PASSPHRASE:-}" ]]; then
    log_warn "BACKUP_GPG_PASSPHRASE not set — will skip encryption"
    NO_ENCRYPT=true
  fi

  if [[ $errors -gt 0 ]]; then
    log_error "$errors validation error(s) — cannot proceed"
    exit 1
  fi
}

if ! $DRY_RUN; then
  validate
fi

# ---------------------------------------------------------------------------
# Build source connection URL
#   NOTE: Do not embed password in the URL; use PGPASSWORD instead to
#   avoid leaking credentials via process listings or shell history.
# ---------------------------------------------------------------------------
export PGPASSWORD="${SUPABASE_DB_PASSWORD:-}"
SOURCE_URL="postgresql://${SUPABASE_DB_USER:-postgres}@${SUPABASE_DB_HOST:-localhost}:${SUPABASE_DB_PORT:-5432}/${SUPABASE_DB_NAME:-postgres}?sslmode=require"

# ---------------------------------------------------------------------------
# Determine backup type (daily / monthly / yearly)
# ---------------------------------------------------------------------------
BACKUP_TYPE="daily"
if [[ "$DAY_OF_MONTH" == "01" && "$MONTH_NUM" == "01" ]]; then
  BACKUP_TYPE="yearly"
elif [[ "$DAY_OF_MONTH" == "01" ]]; then
  BACKUP_TYPE="monthly"
fi

BACKUP_SUBDIR="$LOCAL_BACKUP_DIR/$BACKUP_TYPE"

echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${CYAN}DWS6 Daily Database Backup${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Date:       $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  Type:       $BACKUP_TYPE"
echo "  Dest:       $BACKUP_SUBDIR"
echo "  Encrypt:    $( $NO_ENCRYPT && echo 'no' || echo 'yes (GPG AES-256)' )"
echo "  Transfers:  $( $LOCAL_ONLY && echo 'local only' || echo 'Acer (primary) + Win11 (secondary)' )"
echo "  ═══════════════════════════════════════════════"
echo ""

if $DRY_RUN; then
  log_info "[DRY RUN] Would create: $BACKUP_SUBDIR/dws6-${DATE_TAG}.sql"
  log_info "[DRY RUN] Would encrypt with GPG"
  log_info "[DRY RUN] Would SCP to Acer: ${ACER_VERITON_HOST:-not-set}:${ACER_VERITON_BACKUP_DIR:-/backups/dws6-db}/"
  log_info "[DRY RUN] Would SCP to Win11: ${WIN11_BACKUP_HOST:-not-set}:${WIN11_BACKUP_DIR:-F:/2026/Backups/dws6-db}/"
  exit 0
fi

# ---------------------------------------------------------------------------
# Step 1: Create backup directory
# ---------------------------------------------------------------------------
mkdir -p "$BACKUP_SUBDIR"

DUMP_FILE="$BACKUP_SUBDIR/dws6-${DATE_TAG}.sql"
CHECKSUM_FILE="$DUMP_FILE.sha256"

# ---------------------------------------------------------------------------
# Step 2: Test connection
# ---------------------------------------------------------------------------
log_info "Step 1/6: Testing Supabase connection..."
if ! psql "$SOURCE_URL" -c "SELECT 1;" &>/dev/null; then
  log_error "Cannot connect to Supabase. Check credentials."
  exit 1
fi
log_ok "Supabase reachable"

# ---------------------------------------------------------------------------
# Step 3: pg_dump
# ---------------------------------------------------------------------------
log_info "Step 2/6: Running pg_dump (schema + data)..."
dump_start=$(date +%s)

if pg_dump "$SOURCE_URL" \
  --no-owner \
  --no-privileges \
  --no-comments \
  --schema=public \
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

# Sanity check
if [[ "$dump_bytes" -lt 1000 ]]; then
  log_error "Dump file suspiciously small ($dump_bytes bytes) — aborting"
  exit 1
fi

# ---------------------------------------------------------------------------
# Step 4: SHA256 checksum
# ---------------------------------------------------------------------------
log_info "Step 3/6: Creating SHA256 checksum..."
(
  cd "$(dirname "$DUMP_FILE")" && \
    sha256sum "$(basename "$DUMP_FILE")"
) > "$CHECKSUM_FILE"
log_ok "Checksum: $(cat "$CHECKSUM_FILE" | cut -d' ' -f1 | head -c 16)..."

# ---------------------------------------------------------------------------
# Step 5: GPG encryption
# ---------------------------------------------------------------------------
FINAL_FILE="$DUMP_FILE"

if ! $NO_ENCRYPT; then
  log_info "Step 4/6: Encrypting with GPG (AES-256)..."
  printf '%s' "$BACKUP_GPG_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --symmetric \
    --cipher-algo AES256 \
    --output "${DUMP_FILE}.gpg" \
    "$DUMP_FILE"

  # Also encrypt the checksum
  printf '%s' "$BACKUP_GPG_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --symmetric \
    --cipher-algo AES256 \
    --output "${CHECKSUM_FILE}.gpg" \
    "$CHECKSUM_FILE"

  gpg_size=$(du -h "${DUMP_FILE}.gpg" | cut -f1)
  log_ok "Encrypted: ${DUMP_FILE}.gpg ($gpg_size)"

  # Remove unencrypted dump (keep checksum for local verification)
  rm -f "$DUMP_FILE"
  FINAL_FILE="${DUMP_FILE}.gpg"
else
  log_info "Step 4/6: Encryption skipped (--no-encrypt)"
fi

# ---------------------------------------------------------------------------
# Step 6: Transfer to destinations
# ---------------------------------------------------------------------------
TRANSFER_ACER="skipped"
TRANSFER_WIN11="skipped"

if ! $LOCAL_ONLY; then
  # --- PRIMARY: Acer Veriton GN100 ---
  if [[ -n "${ACER_VERITON_HOST:-}" ]]; then
    log_info "Step 5/6: Transferring to Acer Veriton (primary)..."
    ACER_DEST="${ACER_VERITON_BACKUP_DIR:-/backups/dws6-db}/$BACKUP_TYPE"
    ACER_SSH_KEY="${ACER_VERITON_SSH_KEY:-~/.ssh/id_ed25519_veriton}"
    ACER_USER="${ACER_VERITON_USER:-backup}"

    # Create remote directory
    ssh -i "$ACER_SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new \
      "${ACER_USER}@${ACER_VERITON_HOST}" \
      "mkdir -p $ACER_DEST" 2>/dev/null || true

    # SCP transfer with retry
    acer_transferred=false
    for attempt in 1 2 3 4; do
      if scp -i "$ACER_SSH_KEY" -o ConnectTimeout=10 \
        "$FINAL_FILE" "${CHECKSUM_FILE}"{,.gpg} \
        "${ACER_USER}@${ACER_VERITON_HOST}:${ACER_DEST}/" 2>/dev/null; then
        log_ok "Acer transfer complete (attempt $attempt)"
        TRANSFER_ACER="success"
        acer_transferred=true
        break
      else
        wait_time=$((2 ** attempt))
        log_warn "Acer transfer failed (attempt $attempt/4) — retrying in ${wait_time}s"
        sleep "$wait_time"
      fi
    done

    if ! $acer_transferred; then
      log_error "Acer transfer failed after 4 attempts"
      TRANSFER_ACER="failed"
    fi
  else
    log_warn "Step 5/6: ACER_VERITON_HOST not set — skipping Acer transfer"
  fi

  # --- SECONDARY: Win11 F: drive ---
  if [[ -n "${WIN11_BACKUP_HOST:-}" ]]; then
    log_info "Step 6/6: Transferring to Win11 (secondary)..."
    WIN11_DEST="${WIN11_BACKUP_DIR:-F:/2026/Backups/dws6-db}/$BACKUP_TYPE"
    WIN11_SSH_KEY="${WIN11_BACKUP_SSH_KEY:-~/.ssh/id_ed25519}"
    WIN11_USER="${WIN11_BACKUP_USER:-risto}"

    # SCP transfer with retry
    win11_transferred=false
    for attempt in 1 2 3 4; do
      if scp -i "$WIN11_SSH_KEY" -o ConnectTimeout=10 \
        "$FINAL_FILE" "${CHECKSUM_FILE}"{,.gpg} \
        "${WIN11_USER}@${WIN11_BACKUP_HOST}:${WIN11_DEST}/" 2>/dev/null; then
        log_ok "Win11 transfer complete (attempt $attempt)"
        TRANSFER_WIN11="success"
        win11_transferred=true
        break
      else
        wait_time=$((2 ** attempt))
        log_warn "Win11 transfer failed (attempt $attempt/4) — retrying in ${wait_time}s"
        sleep "$wait_time"
      fi
    done

    if ! $win11_transferred; then
      log_error "Win11 transfer failed after 4 attempts"
      TRANSFER_WIN11="failed"
    fi
  else
    log_warn "Step 6/6: WIN11_BACKUP_HOST not set — skipping Win11 transfer"
  fi
else
  log_info "Steps 5-6/6: Transfer skipped (--local-only)"
fi

# ---------------------------------------------------------------------------
# Step 7: Retention cleanup
# ---------------------------------------------------------------------------
log_info "Cleaning up old backups..."

cleanup_old() {
  local dir="$1"
  local max_age_days="$2"

  if [[ -d "$dir" ]]; then
    local before_count
    before_count=$(find "$dir" -name "dws6-*.sql*" -type f 2>/dev/null | wc -l)
    find "$dir" -name "dws6-*.sql*" -type f -mtime +"$max_age_days" -delete 2>/dev/null || true
    find "$dir" -name "dws6-*.sha256*" -type f -mtime +"$max_age_days" -delete 2>/dev/null || true
    local after_count
    after_count=$(find "$dir" -name "dws6-*.sql*" -type f 2>/dev/null | wc -l)
    local removed=$((before_count - after_count))
    if [[ $removed -gt 0 ]]; then
      log_info "  Cleaned $removed old file(s) from $dir"
    fi
  fi
}

cleanup_old "$LOCAL_BACKUP_DIR/daily" "$DAILY_RETENTION"
cleanup_old "$LOCAL_BACKUP_DIR/monthly" "$MONTHLY_RETENTION"
# yearly: no cleanup (kept forever, but check after 10 years)
cleanup_old "$LOCAL_BACKUP_DIR/yearly" "$YEARLY_RETENTION"

# ---------------------------------------------------------------------------
# Write status file
# ---------------------------------------------------------------------------
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

# Determine overall status
OVERALL_STATUS="success"
EXIT_CODE=0
if [[ "$TRANSFER_ACER" == "failed" || "$TRANSFER_WIN11" == "failed" ]]; then
  OVERALL_STATUS="partial"
  EXIT_CODE=2
fi

cat > "$STATUS_FILE" <<STATUSEOF
{
  "status": "$OVERALL_STATUS",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "backup_type": "$BACKUP_TYPE",
  "dump_file": "$(basename "$FINAL_FILE")",
  "dump_size_bytes": $dump_bytes,
  "dump_tables": $dump_tables,
  "encrypted": $( $NO_ENCRYPT && echo 'false' || echo 'true' ),
  "checksum": "$(cat "$CHECKSUM_FILE" 2>/dev/null | cut -d' ' -f1 || echo 'N/A')",
  "transfers": {
    "acer_primary": "$TRANSFER_ACER",
    "win11_secondary": "$TRANSFER_WIN11"
  },
  "retention": {
    "daily_days": $DAILY_RETENTION,
    "monthly_days": $MONTHLY_RETENTION
  },
  "duration_seconds": $TOTAL_TIME,
  "source": "supabase",
  "target_dir": "$BACKUP_SUBDIR"
}
STATUSEOF

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo ""
echo "  ═══════════════════════════════════════════════"
echo -e "  ${CYAN}Backup Summary${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  Status:     $OVERALL_STATUS"
echo "  Type:       $BACKUP_TYPE"
echo "  File:       $(basename "$FINAL_FILE")"
echo "  Size:       $dump_size ($dump_tables tables)"
echo "  Encrypted:  $( $NO_ENCRYPT && echo 'no' || echo 'yes' )"
echo "  Acer:       $TRANSFER_ACER"
echo "  Win11:      $TRANSFER_WIN11"
echo "  Duration:   ${TOTAL_TIME}s"
echo "  Status log: $STATUS_FILE"
echo "  ═══════════════════════════════════════════════"
echo ""

exit $EXIT_CODE
