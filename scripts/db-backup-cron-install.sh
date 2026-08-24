#!/usr/bin/env bash
# =============================================================================
# DWS6 Backup Cron Installer — Acer Veriton GN100
# =============================================================================
# Installs cron jobs for automated daily database backup and local restore.
#
# Schedule (all times UTC):
#   02:00 — Daily backup: Supabase → local → Acer → Win11
#   03:00 — Daily restore: latest backup → local Acer PostgreSQL
#   04:00 — Weekly integrity check (Sundays): verify checksums + test restore
#
# Usage:
#   ./scripts/db-backup-cron-install.sh           # Install cron jobs
#   ./scripts/db-backup-cron-install.sh --remove  # Remove cron jobs
#   ./scripts/db-backup-cron-install.sh --show    # Show current cron config
#
# Code-Version: 1.0.0
# Introduced-In: PR-TBD
# Branch: claude/local-database-backup-2Mbl7
# Date: 2026-03-23
# Owner: Lifetime Oy
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CRON_TAG="# DWS6-BACKUP-MANAGED"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
ACTION="install"

case "${1:-}" in
  --remove) ACTION="remove" ;;
  --show)   ACTION="show" ;;
  -h|--help)
    echo "Usage: $0 [--remove|--show|-h]"
    exit 0 ;;
esac

# ---------------------------------------------------------------------------
# Show current cron
# ---------------------------------------------------------------------------
if [[ "$ACTION" == "show" ]]; then
  echo "Current DWS6 backup cron entries:"
  crontab -l 2>/dev/null | grep -A1 "$CRON_TAG" || echo "  (none)"
  exit 0
fi

# ---------------------------------------------------------------------------
# Remove existing DWS6 backup cron entries
# ---------------------------------------------------------------------------
remove_existing() {
  local current
  current=$(crontab -l 2>/dev/null || true)

  if echo "$current" | grep -q "$CRON_TAG"; then
    echo "$current" | grep -v "$CRON_TAG" | crontab -
    log_ok "Removed existing DWS6 backup cron entries"
  fi
}

remove_existing

if [[ "$ACTION" == "remove" ]]; then
  log_ok "DWS6 backup cron entries removed"
  exit 0
fi

# ---------------------------------------------------------------------------
# Install cron jobs
# ---------------------------------------------------------------------------
LOG_DIR="/var/log"
if [[ ! -w "$LOG_DIR" ]]; then
  LOG_DIR="$HOME/.local/log"
  mkdir -p "$LOG_DIR"
fi

BACKUP_SCRIPT="$SCRIPT_DIR/db-daily-backup.sh"
RESTORE_SCRIPT="$SCRIPT_DIR/db-restore-local.sh"
BACKUP_TEST_SCRIPT="$SCRIPT_DIR/db-backup-test.sh"

# Verify scripts exist
for script in "$BACKUP_SCRIPT" "$RESTORE_SCRIPT"; do
  if [[ ! -x "$script" ]]; then
    log_error "Script not found or not executable: $script"
    exit 1
  fi
done

# Build cron entries
CRON_ENTRIES=$(cat <<CRONEOF
$CRON_TAG — Daily backup: Supabase → local + Acer + Win11
0 2 * * * $BACKUP_SCRIPT >> $LOG_DIR/dws6-backup.log 2>&1 $CRON_TAG
$CRON_TAG — Daily restore: latest backup → local Acer PostgreSQL
0 3 * * * $RESTORE_SCRIPT >> $LOG_DIR/dws6-restore.log 2>&1 $CRON_TAG
$CRON_TAG — Weekly integrity check (Sundays): full backup test cycle
0 4 * * 0 $BACKUP_TEST_SCRIPT --export-only >> $LOG_DIR/dws6-backup-verify.log 2>&1 $CRON_TAG
CRONEOF
)

# Append to existing crontab
(crontab -l 2>/dev/null || true; echo "$CRON_ENTRIES") | crontab -

echo ""
echo -e "  ${GREEN}DWS6 Backup Cron Installed${NC}"
echo "  ═══════════════════════════════════════════════"
echo "  02:00 UTC  Daily backup (Supabase → Acer → Win11)"
echo "  03:00 UTC  Daily restore (latest → local PostgreSQL)"
echo "  04:00 UTC  Weekly integrity check (Sundays)"
echo ""
echo "  Logs:"
echo "    $LOG_DIR/dws6-backup.log"
echo "    $LOG_DIR/dws6-restore.log"
echo "    $LOG_DIR/dws6-backup-verify.log"
echo "  ═══════════════════════════════════════════════"
echo ""

log_ok "Cron jobs installed. Verify with: crontab -l | grep DWS6"
