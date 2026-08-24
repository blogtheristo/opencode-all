# Daily Site Backup Procedures

**Version:** 1.0
**Created:** 2025-12-26
**Purpose:** Automated daily backups for fail-over security
**Status:** Active

---

## Overview

Daily automated backups protect all DWS6 sites against data loss, accidental deletions, and deployment failures. Backups are date-stamped and retained for 30 days.

---

## What Gets Backed Up

### Sites
- **dws6.com/** - Main DWS6 site
- **dws10.com/** - Platform site
- **onelifetime.world/** - Community site
- **landing-pages/dws6-com/** - DWS6 landing pages
- **landing-pages/dws10-com/** - Platform landing pages
- **landing-pages/onelifetime-world/** - Community landing pages

### Excluded
- `node_modules/` - Can be rebuilt
- `.next/` - Build artifacts
- `.git/` - Version control (separate backup)
- `*.log` - Log files

---

## Backup Schedule

### Automated (GitHub Actions)
- **Frequency:** Daily at 2:00 AM UTC
- **Workflow:** `.github/workflows/daily-site-backup.yml`
- **Retention:** 30 days
- **Storage:** GitHub Actions artifacts

### Manual Backup
```bash
# Run backup script manually
./scripts/backup-sites.sh

# Creates backups in: backups/sites/YYYY-MM-DD/
```

---

## Backup Location

### Local Development
```
backups/
└── sites/
    ├── 2025-12-26/
    │   ├── dws6-com_2025-12-26_02-00-00.tar.gz
    │   ├── dws10-com_2025-12-26_02-00-00.tar.gz
    │   ├── onelifetime-world_2025-12-26_02-00-00.tar.gz
    │   ├── dws6-com_landing_2025-12-26_02-00-00.tar.gz
    │   ├── dws10-com_landing_2025-12-26_02-00-00.tar.gz
    │   ├── onelifetime-world_landing_2025-12-26_02-00-00.tar.gz
    │   └── MANIFEST.txt
    ├── 2025-12-27/
    │   └── ...
    └── latest -> 2025-12-27/  # Symlink to latest backup
```

### GitHub Actions
- **Artifacts:** Available in workflow run page
- **Download:** https://github.com/blogtheristo/dws6/actions
- **Retention:** 30 days automatic cleanup

### Audit Logs
```
.workflows/
└── audit/
    └── backups/
        ├── backup-2025-12-26.log
        ├── backup-2025-12-27.log
        └── ...
```

---

## Backup Manifest

Each backup includes a `MANIFEST.txt` file:

```
DWS6 Daily Site Backup Manifest
================================
Date: 2025-12-26
Timestamp: 2025-12-26_02-00-00
Backup Directory: backups/sites/2025-12-26

Sites Backed Up:
  - dws6-com_2025-12-26_02-00-00.tar.gz (1.2M)
  - dws10-com_2025-12-26_02-00-00.tar.gz (890K)
  - onelifetime-world_2025-12-26_02-00-00.tar.gz (1.5M)
  - dws6-com_landing_2025-12-26_02-00-00.tar.gz (980K)
  - dws10-com_landing_2025-12-26_02-00-00.tar.gz (750K)
  - onelifetime-world_landing_2025-12-26_02-00-00.tar.gz (1.1M)

Total: 6 sites backed up successfully
Skipped: 0 sites

Backup completed at: 2025-12-26 02:00:15
```

---

## Restoration Procedures

### 1. List Available Backups

```bash
# Local backups
ls -lh backups/sites/

# Latest backup
ls -lh backups/sites/latest/

# Specific date
ls -lh backups/sites/2025-12-26/
```

### 2. Restore a Site

```bash
# Example: Restore dws10.com from 2025-12-26 backup

# Step 1: Backup current state (safety)
cp -r dws10.com dws10.com.backup-$(date +%Y-%m-%d)

# Step 2: Extract backup
tar -xzf backups/sites/2025-12-26/dws10-com_2025-12-26_02-00-00.tar.gz

# Step 3: Verify extracted files
ls -la dws10.com/

# Step 4: Test locally
cd dws10.com && npm install && npm run dev

# Step 5: Deploy if needed
git add dws10.com/
git commit -m "restore: dws10.com from 2025-12-26 backup"
git push origin main
```

### 3. Restore from GitHub Actions Artifact

```bash
# Step 1: Download artifact from GitHub Actions
# Visit: https://github.com/blogtheristo/dws6/actions/workflows/daily-site-backup.yml

# Step 2: Extract downloaded artifact
unzip site-backups-[run-number].zip

# Step 3: Extract site backup
tar -xzf [site-name]_[timestamp].tar.gz

# Step 4: Follow steps 3-5 above
```

---

## Fail-Over Scenarios

### Scenario 1: Accidental Deletion
```bash
# Someone accidentally deleted dws6.com/

# Solution:
tar -xzf backups/sites/latest/dws6-com_*.tar.gz
git add dws6.com/
git commit -m "restore: recover accidentally deleted dws6.com"
git push origin main
```

### Scenario 2: Bad Deployment
```bash
# Deployment broke the site

# Solution:
# 1. Find last good backup (check manifests)
ls -lt backups/sites/

# 2. Restore from backup
tar -xzf backups/sites/2025-12-25/dws10-com_*.tar.gz

# 3. Deploy fixed version
git add dws10.com/
git commit -m "fix: rollback to 2025-12-25 working version"
git push origin main
```

### Scenario 3: Data Corruption
```bash
# Files corrupted, site won't build

# Solution:
# 1. Check multiple backups to find clean version
for backup in backups/sites/*/onelifetime-world_*.tar.gz; do
    echo "Testing: $backup"
    tar -tzf "$backup" | head -5
done

# 2. Extract clean backup
tar -xzf backups/sites/2025-12-23/onelifetime-world_*.tar.gz

# 3. Verify and deploy
```

### Scenario 4: Complete Repository Loss
```bash
# Entire local repository deleted

# Solution:
# 1. Clone fresh from GitHub
git clone https://github.com/blogtheristo/dws6.git
cd dws6

# 2. Download backup artifacts from GitHub Actions
# Visit: https://github.com/blogtheristo/dws6/actions

# 3. Extract and restore all sites
# Follow restoration procedures above
```

---

## Monitoring

### Daily Checks
- [ ] Verify backup workflow runs (GitHub Actions)
- [ ] Check artifact upload successful
- [ ] Verify backup log committed to `.workflows/audit/backups/`

### Weekly Checks
- [ ] Review backup sizes (ensure consistent)
- [ ] Test restoration of one random backup
- [ ] Verify 30-day retention working

### Monthly Checks
- [ ] Full restoration test (all sites)
- [ ] Review backup storage usage
- [ ] Update backup procedures if needed

---

## Troubleshooting

### Backup Script Fails
```bash
# Check script permissions
ls -l scripts/backup-sites.sh

# Should be: -rwxr-xr-x (executable)
chmod +x scripts/backup-sites.sh

# Check disk space
df -h

# Check backup directory permissions
ls -ld backups/sites/
```

### Workflow Fails
```bash
# View workflow logs
# Visit: https://github.com/blogtheristo/dws6/actions/workflows/daily-site-backup.yml

# Common issues:
# 1. Permissions - Check workflow has write permissions
# 2. Disk space - GitHub Actions has limits
# 3. Large files - Check backup sizes
```

### Restoration Fails
```bash
# Verify backup integrity
tar -tzf backups/sites/2025-12-26/dws6-com_*.tar.gz | head

# If corrupted, try previous day's backup
tar -tzf backups/sites/2025-12-25/dws6-com_*.tar.gz
```

---

## Configuration

### Backup Retention
Edit `scripts/backup-sites.sh`:
```bash
RETENTION_DAYS=30  # Change to desired retention period
```

### Backup Schedule
Edit `.github/workflows/daily-site-backup.yml`:
```yaml
schedule:
  - cron: '0 2 * * *'  # Change schedule (currently 2:00 AM UTC)
```

### Sites to Backup
Edit `scripts/backup-sites.sh`:
```bash
SITES=(
    "dws6.com"
    "dws10.com"
    "onelifetime.world"
    # Add more sites here
)
```

---

## Best Practices

1. **Test Restorations Regularly** - Don't wait for disaster to test backups
2. **Monitor Backup Sizes** - Sudden size changes indicate issues
3. **Keep Multiple Backup Points** - Don't rely on just one backup
4. **Document Custom Configurations** - Note any site-specific settings
5. **Verify After Restoration** - Always test before deploying restored site

---

## Related Documentation

- **Workflow Management:** `.workflows/README.md`
- **Deployment Guide:** `in-update-claude/documentation/DEPLOYMENT_GUIDE.md`
- **Admin Manual:** `ADMIN_MANUAL_FILES_AND_FOLDERS.md`
- **GitHub Actions:** `.github/workflows/README.md`

---

## Support

**For backup issues:**
- Check workflow logs: https://github.com/blogtheristo/dws6/actions
- Review audit logs: `.workflows/audit/backups/`
- Contact: risto@lifetime.fi

---

**Version:** 1.0
**Last Updated:** 2025-12-26
**Status:** ✅ ACTIVE
**Next Review:** 2026-01-26
