#!/usr/bin/env bash
# =============================================================================
# DGX Spark Internal Postgres — Daily Offsite Backup to Aiven
# =============================================================================
# Backs up `dws-postgres` (Tier 1 internal-ops data: agent memory, cron/command
# audit logs, tool telemetry, agent nudges — see DWS_SECURITY_STANDARD.md DR-8)
# to the Aiven PostgreSQL service, since DGX Spark now hosts both a backup
# destination (DR-2, Acer Veriton GN100 Helsinki) and the new primary internal
# store. A single-site failure here would otherwise lose both at once.
#
# Usage:
#   ./scripts/dgx-spark/backup-internal-postgres-to-aiven.sh
#   ./scripts/dgx-spark/backup-internal-postgres-to-aiven.sh --dry-run
#
# Prerequisites:
#   - INTERNAL_DATABASE_URL in .env (source — dws-postgres)
#   - AIVEN_DATABASE_URL in .env (destination — confirm EU/Finland region
#     before first real run; see DWS_SECURITY_STANDARD.md DR-8)
#   - BACKUP_GPG_PASSPHRASE in .env (per DR-3: encrypt before any remote
#     transfer, unencrypted dumps deleted immediately after encryption)
#   - pg_dump, psql, gpg on PATH
#
# Registered under scripts/daily/ per the Script Automation Rule — no one
# should have to remember to run this by hand.
#
# Version: 1.0 | Date: 2026-07-07
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
BACKUP_DIR="${INTERNAL_DB_BACKUP_DIR:-$REPO_ROOT/backups/dws-postgres}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP_FILE="$BACKUP_DIR/dws_internal_${TIMESTAMP}.dump"
RETENTION_DAYS=90

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

DRY_RUN=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    -h|--help)
      echo "Usage: $0 [--dry-run]"
      exit 0
      ;;
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
  log_warn "No .env file found at $ENV_FILE — using environment variables"
fi

if [[ -z "${INTERNAL_DATABASE_URL:-}" ]]; then
  log_error "INTERNAL_DATABASE_URL required in .env (source: dws-postgres)"
  exit 1
fi
if [[ -z "${AIVEN_DATABASE_URL:-}" ]]; then
  log_error "AIVEN_DATABASE_URL required in .env (destination — confirm EU/Finland region first)"
  exit 1
fi
if [[ -z "${BACKUP_GPG_PASSPHRASE:-}" ]]; then
  log_error "BACKUP_GPG_PASSPHRASE required in .env (DR-3: no unencrypted dump may leave disk)"
  exit 1
fi

for cmd in pg_dump psql gpg; do
  if ! command -v "$cmd" &>/dev/null; then
    log_error "$cmd not found on PATH"
    exit 1
  fi
done

mkdir -p "$BACKUP_DIR"

# ---------------------------------------------------------------------------
# 1. Dump dws-postgres
# ---------------------------------------------------------------------------
log_info "Dumping dws-postgres (internal-ops tables)..."
if $DRY_RUN; then
  log_info "[DRY RUN] Would run: pg_dump \"\$INTERNAL_DATABASE_URL\" -F c -f $DUMP_FILE"
else
  pg_dump "$INTERNAL_DATABASE_URL" -F c -f "$DUMP_FILE"
  log_ok "Dumped to $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"
fi

# ---------------------------------------------------------------------------
# 2. Encrypt, then delete the plaintext dump (DR-3)
# ---------------------------------------------------------------------------
log_info "Encrypting dump (GPG symmetric AES-256)..."
if $DRY_RUN; then
  log_info "[DRY RUN] Would encrypt $DUMP_FILE -> ${DUMP_FILE}.gpg and delete the plaintext"
else
  gpg --batch --yes --symmetric --cipher-algo AES256 \
    --passphrase "$BACKUP_GPG_PASSPHRASE" --output "${DUMP_FILE}.gpg" "$DUMP_FILE"
  rm -f "$DUMP_FILE"
  log_ok "Encrypted to ${DUMP_FILE}.gpg, plaintext deleted"
fi

# ---------------------------------------------------------------------------
# 3. Decrypt to a short-lived temp file and restore into Aiven
# ---------------------------------------------------------------------------
RESTORE_TMP="$(mktemp)"
cleanup() { rm -f "$RESTORE_TMP"; }
trap cleanup EXIT

log_info "Restoring into Aiven..."
if $DRY_RUN; then
  log_info "[DRY RUN] Would decrypt ${DUMP_FILE}.gpg to a temp file and pg_restore into \$AIVEN_DATABASE_URL"
else
  gpg --batch --yes --passphrase "$BACKUP_GPG_PASSPHRASE" \
    --output "$RESTORE_TMP" --decrypt "${DUMP_FILE}.gpg"
  pg_restore --clean --if-exists --no-owner --no-privileges \
    -d "$AIVEN_DATABASE_URL" "$RESTORE_TMP" || \
    log_warn "pg_restore reported errors — review output above (may be OK if this is a repeat run)"
  rm -f "$RESTORE_TMP"
  log_ok "Restored into Aiven"
fi

# ---------------------------------------------------------------------------
# 4. Row-count verification (DR-4 pattern)
# ---------------------------------------------------------------------------
verify_row_counts() {
  log_info "Verifying row counts (source vs. Aiven)..."
  local tables
  tables=$(psql "$INTERNAL_DATABASE_URL" -tAc \
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")

  local mismatches=0
  while IFS= read -r table; do
    [[ -z "$table" ]] && continue
    local src_count aiven_count
    src_count=$(psql "$INTERNAL_DATABASE_URL" -tAc "SELECT COUNT(*) FROM \"$table\";" 2>/dev/null || echo "?")
    aiven_count=$(psql "$AIVEN_DATABASE_URL" -tAc "SELECT COUNT(*) FROM \"$table\";" 2>/dev/null || echo "?")
    if [[ "$src_count" == "$aiven_count" ]]; then
      echo -e "  ${GREEN}✓${NC} $table ($src_count rows)"
    else
      echo -e "  ${RED}✗${NC} $table (source: $src_count, Aiven: $aiven_count)"
      ((mismatches++))
    fi
  done <<< "$tables"

  if [[ $mismatches -gt 0 ]]; then
    log_warn "$mismatches table(s) mismatched — investigate before relying on this backup"
  else
    log_ok "All tables match"
  fi
}

if $DRY_RUN; then
  log_info "[DRY RUN] Would verify row counts between source and Aiven"
else
  verify_row_counts
fi

# ---------------------------------------------------------------------------
# 5. Prune local encrypted dumps older than retention window
# ---------------------------------------------------------------------------
log_info "Pruning local backups older than ${RETENTION_DAYS} days..."
if $DRY_RUN; then
  find "$BACKUP_DIR" -name "*.dump.gpg" -mtime "+${RETENTION_DAYS}" -print
else
  find "$BACKUP_DIR" -name "*.dump.gpg" -mtime "+${RETENTION_DAYS}" -delete
fi

log_ok "Done ($(date -u +%Y-%m-%dT%H:%M:%SZ))"
