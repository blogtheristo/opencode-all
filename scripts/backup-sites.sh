#!/bin/bash
# Daily Site Backup Script
# Creates date-stamped backups of all DWS6 sites for fail-over security.
#
# Tarballs are encrypted with GPG AES-256 when BACKUP_GPG_PASSPHRASE is set
# (read from $REPO_ROOT/.env if present). Encryption is the default — pass
# --no-encrypt to opt out for development runs only.
#
# Usage:
#   ./scripts/backup-sites.sh                # encrypt if passphrase available
#   ./scripts/backup-sites.sh --no-encrypt   # explicit dev-mode plaintext
# Cron: 0 2 * * * /path/to/dws6/scripts/backup-sites.sh

set -e

# Resolve repo root so .env is found regardless of CWD when called from cron
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# Configuration
BACKUP_DIR="backups/sites"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION_DAYS=30

# Encryption defaults — enabled when passphrase available, GPG installed,
# and --no-encrypt was not passed.
NO_ENCRYPT=0
for arg in "$@"; do
  case "$arg" in
    --no-encrypt) NO_ENCRYPT=1 ;;
    -h|--help)
      grep -E '^#( |$)' "$0" | sed 's/^# \?//'
      exit 0 ;;
  esac
done

ENCRYPT=1
if [[ $NO_ENCRYPT -eq 1 ]]; then
  ENCRYPT=0
elif ! command -v gpg >/dev/null 2>&1; then
  echo "⚠️  gpg not installed — falling back to plaintext tarballs"
  ENCRYPT=0
elif [[ -z "${BACKUP_GPG_PASSPHRASE:-}" ]]; then
  echo "⚠️  BACKUP_GPG_PASSPHRASE not set in .env — falling back to plaintext"
  echo "    Set BACKUP_GPG_PASSPHRASE to enable AES-256 encryption."
  ENCRYPT=0
fi

# Sites to backup
SITES=(
    "dws6.com"
    "dws10.com"
    "onelifetime.world"
    "landing-pages/dws6-com"
    "landing-pages/dws10-com"
    "landing-pages/onelifetime-world"
)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "DWS6 Daily Site Backup"
echo "Date: $DATE"
echo "Time: $(date +%H:%M:%S)"
echo "=========================================="
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR/$DATE"

# Function to backup a site
backup_site() {
    local site=$1
    local site_name=$(basename "$site" | sed 's/\./-/g')
    local backup_file="$BACKUP_DIR/$DATE/${site_name}_${TIMESTAMP}.tar.gz"

    if [ -d "$site" ]; then
        echo -e "${YELLOW}📦 Backing up: $site${NC}"

        # Create tarball with gzip compression
        tar -czf "$backup_file" \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='.git' \
            --exclude='*.log' \
            "$site" 2>/dev/null || {
            echo -e "${RED}❌ Failed to backup: $site${NC}"
            return 1
        }

        # Encrypt + SHA256 checksum (matches scripts/db-daily-backup.sh)
        if [[ $ENCRYPT -eq 1 ]]; then
            local enc_file="${backup_file}.gpg"
            if printf '%s' "$BACKUP_GPG_PASSPHRASE" | gpg --batch --yes \
                --pinentry-mode loopback --passphrase-fd 0 --symmetric \
                --cipher-algo AES256 \
                --output "$enc_file" \
                "$backup_file" 2>/dev/null; then
                # SHA256 of the encrypted file (verifies transport integrity)
                ( cd "$(dirname "$enc_file")" \
                    && sha256sum "$(basename "$enc_file")" \
                  ) > "${enc_file}.sha256"
                # Remove plaintext tarball — only the encrypted blob persists
                rm -f "$backup_file"
                backup_file="$enc_file"
            else
                echo -e "${RED}❌ GPG encryption failed for $site — leaving plaintext${NC}"
                return 1
            fi
        fi

        # Get backup size
        local size=$(du -h "$backup_file" | cut -f1)
        echo -e "${GREEN}✅ Backed up: $site → $backup_file ($size)${NC}"
        echo ""
        return 0
    else
        echo -e "${YELLOW}⚠️  Skipping: $site (directory not found)${NC}"
        echo ""
        return 0
    fi
}

# Backup all sites
total_sites=${#SITES[@]}
backed_up=0
skipped=0

for site in "${SITES[@]}"; do
    if backup_site "$site"; then
        ((backed_up++))
    else
        ((skipped++))
    fi
done

# Create backup manifest
MANIFEST_FILE="$BACKUP_DIR/$DATE/MANIFEST.txt"
cat > "$MANIFEST_FILE" << EOF
DWS6 Daily Site Backup Manifest
================================
Date: $DATE
Timestamp: $TIMESTAMP
Backup Directory: $BACKUP_DIR/$DATE

Sites Backed Up:
EOF

shopt -s nullglob
for file in "$BACKUP_DIR/$DATE"/*.tar.gz "$BACKUP_DIR/$DATE"/*.tar.gz.gpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        filesize=$(du -h "$file" | cut -f1)
        echo "  - $filename ($filesize)" >> "$MANIFEST_FILE"
    fi
done
shopt -u nullglob

echo "" >> "$MANIFEST_FILE"
echo "Total: $backed_up sites backed up successfully" >> "$MANIFEST_FILE"
echo "Skipped: $skipped sites" >> "$MANIFEST_FILE"
echo "Encryption: $([[ $ENCRYPT -eq 1 ]] && echo 'GPG AES-256' || echo 'NONE (plaintext)')" >> "$MANIFEST_FILE"
echo "" >> "$MANIFEST_FILE"
echo "Backup completed at: $(date +%Y-%m-%d\ %H:%M:%S)" >> "$MANIFEST_FILE"

# Cleanup old backups (older than RETENTION_DAYS)
echo -e "${YELLOW}🧹 Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Summary
echo "=========================================="
echo "Backup Summary"
echo "=========================================="
echo "Total sites: $total_sites"
echo "Backed up: $backed_up"
echo "Skipped: $skipped"
echo "Encryption: $([[ $ENCRYPT -eq 1 ]] && echo 'GPG AES-256' || echo 'NONE (plaintext)')"
echo "Backup location: $BACKUP_DIR/$DATE"
echo "Manifest: $MANIFEST_FILE"
echo ""
echo "Backup retention: $RETENTION_DAYS days"
echo "=========================================="

# Create symlink to latest backup (skip in CI environments where symlinks may fail)
if [ -z "$CI" ]; then
    ln -sfn "$BACKUP_DIR/$DATE" "$BACKUP_DIR/latest" 2>/dev/null || true
else
    echo "Skipping symlink creation in CI environment"
fi

echo -e "${GREEN}✅ Daily backup completed successfully!${NC}"
echo ""
if [[ $ENCRYPT -eq 1 ]]; then
  echo "To restore a site (encrypted blob):"
  echo "  gpg --decrypt $BACKUP_DIR/$DATE/[site]_${TIMESTAMP}.tar.gz.gpg | tar -xz"
else
  echo "To restore a site:"
  echo "  tar -xzf $BACKUP_DIR/$DATE/[site-name]_${TIMESTAMP}.tar.gz"
fi
echo ""

exit 0
