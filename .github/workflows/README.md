# GitHub Actions Workflows

This directory contains automated workflows for the DWS6 repository.

---

## 📋 Available Workflows

### 1. Daily Backup (`daily-backup.yml`)

**Purpose:** Automatically backup all intellectual assets every day at 23:55 UTC

**Schedule:** Daily at 23:55 UTC (00:55 Finnish time)

**What It Backs Up:**
- €500K Hero Campaign
- Lifetime Fleet Carousel
- Progress Report pages
- CSRD page
- Ultra Premium Template
- All dashboard versions (V7, V8, V9)
- Login hub
- Documentation

**Features:**
- ✅ Automated daily execution
- ✅ Content verification (checks if key assets exist)
- ✅ Compressed archives (.tar.gz)
- ✅ Detailed backup reports
- ✅ 30-day retention (older backups auto-deleted)
- ✅ Git history preservation
- ✅ Manual trigger option
- ✅ Failure logging

**Manual Trigger:**
1. Go to: https://github.com/blogtheristo/dws6/actions
2. Click "Daily Intellectual Assets Backup"
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow"

**View Backup Reports:**
- Location: `backups/DAILY_BACKUP_YYYY-MM-DD.md`
- Archives: `backups/assets-backup-YYYY-MM-DD.tar.gz`

**Restore from Backup:**
```bash
# View backup history
git log --all --grep="Daily Backup" --oneline

# Restore specific file
git checkout <commit-hash> -- <file-path>

# Restore from archive
tar -xzf backups/assets-backup-YYYY-MM-DD.tar.gz
```

---

## 🔧 Configuration

### Timezone
- Workflow runs at **23:55 UTC**
- Finnish time: **01:55 EET** (winter) or **02:55 EEST** (summer)
- To change: Edit `cron: '55 23 * * *'` in `daily-backup.yml`

### Retention Period
- Default: **30 days**
- To change: Edit `tail -n +31` in cleanup step (line ~180)
- Example: Keep 60 days → change to `tail -n +61`

### Backup Scope
To add/remove files from backup:
1. Edit the `tar -czf` command in `daily-backup.yml`
2. Add/remove paths as needed
3. Commit and push changes

---

## 📊 Monitoring

### Check Workflow Status
1. Go to: https://github.com/blogtheristo/dws6/actions
2. View recent runs
3. Click on any run to see details

### Email Notifications
GitHub automatically sends emails on workflow failures to repository admins.

### View Backup Logs
```bash
# View all backup commits
git log --all --grep="Daily Backup"

# View failure log
cat backups/BACKUP_FAILURES.log
```

---

## 🚨 Troubleshooting

### Workflow Not Running
1. Check if Actions are enabled: Settings → Actions → General
2. Verify cron syntax: https://crontab.guru/
3. Check branch: Workflow must be on `main` branch

### Backup Failed
1. View failure log: `backups/BACKUP_FAILURES.log`
2. Check workflow run details on GitHub
3. Common issues:
   - Git push permissions
   - File not found errors
   - Disk space issues

### Manual Backup
If automated backup fails, run manually:
```bash
# Create backup report
date=$(date +'%Y-%m-%d')
cp backups/INTELLECTUAL_ASSETS_BACKUP_2025-12-28.md "backups/MANUAL_BACKUP_$date.md"

# Create archive
tar -czf "backups/manual-backup-$date.tar.gz" dws10.com/ dws6.com/

# Commit
git add backups/
git commit -m "Manual backup: $date"
git push
```

---

## 📝 Best Practices

### Do's ✅
- Review backup reports weekly
- Test restoration process monthly
- Keep workflow file in version control
- Document any custom changes

### Don'ts ❌
- Don't disable automated backups
- Don't delete backup files manually (use cleanup workflow)
- Don't store secrets in backup files
- Don't commit sensitive data

---

## 🔄 Workflow Updates

To update the workflow:
1. Edit `.github/workflows/daily-backup.yml`
2. Test changes with manual trigger
3. Commit and push
4. Monitor next automated run

---

## 📞 Support

**Issues:**
- Workflow failures: Check GitHub Actions logs
- Restoration help: See backup report instructions
- Custom requirements: Edit workflow file

**Documentation:**
- GitHub Actions: https://docs.github.com/en/actions
- Cron syntax: https://crontab.guru/
- Workflow syntax: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions

---

**Last Updated:** 2025-12-28  
**Maintained By:** DWS6 Repository Team  
**Status:** ✅ Active
