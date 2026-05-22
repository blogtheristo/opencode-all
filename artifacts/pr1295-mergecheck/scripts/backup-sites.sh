#!/bin/bash
# Daily Site Backup Script
# Creates date-stamped backups of all DWS6 sites for fail-over security
#
# Usage: ./scripts/backup-sites.sh
# Cron: 0 2 * * * /path/to/dws6/scripts/backup-sites.sh

set -e

# Configuration
BACKUP_DIR="backups/sites"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION_DAYS=30

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

for file in "$BACKUP_DIR/$DATE"/*.tar.gz; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        filesize=$(du -h "$file" | cut -f1)
        echo "  - $filename ($filesize)" >> "$MANIFEST_FILE"
    fi
done

echo "" >> "$MANIFEST_FILE"
echo "Total: $backed_up sites backed up successfully" >> "$MANIFEST_FILE"
echo "Skipped: $skipped sites" >> "$MANIFEST_FILE"
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
echo "To restore a site:"
echo "  tar -xzf $BACKUP_DIR/$DATE/[site-name]_${TIMESTAMP}.tar.gz"
echo ""

exit 0
