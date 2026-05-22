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

### Email (risto@onelifetime.world)
Workflows that send email (morning-briefing, outreach-digest, weekly-report, etc.) use:
- **Primary:** Amazon SES (SMTP) — `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- **Fallback:** `RESEND_API_KEY`
- **Sender:** `risto@onelifetime.world` (verified in Amazon SES and Resend.com)

### Workflow Failure Notifications
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

## Automated PR Workflow (AI Agent Loop)

### Overview

Three workflows automate the full PR review and merge cycle, replacing manual human-in-the-loop review:

```
Claude Code → opens PR → Claude sanity check → Gemini HIL review → @copilot fixes → CI → auto-merge
                                                      ↑                    |
                                                      └────────────────────┘  (fix loop)
```

### Workflows

#### AI Code Review — HIL Automation (`ai-pr-review.yml`)

**Trigger:** `pull_request` (opened, synchronize, reopened)

**What it does:**
1. Extracts the PR diff (code files only, truncated to 60KB)
2. **Claude** does quick sanity review (security, correctness, breaking changes)
3. **Gemini** does deep HIL review — replaces human reviewer (edge cases, tests, architecture, security audit)
4. Posts combined review as PR comment. Both must approve.
5. If REQUEST_CHANGES: extracts Gemini's required changes + test gaps → routes as structured `@copilot` instructions
6. Copilot implements fixes, pushes → review re-triggers automatically (fix loop)
7. Applies labels: `ai-reviewed` + `ai-approved` or `ai-changes-requested`

**Required secrets:** `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`

**MCP Hub integration:** Gemini review is also available at `POST /gemini/review` on the MCP Hub (`mcp-hub/server.py`) for on-demand code analysis by any agent.

#### PR Auto-Merge (`pr-auto-merge.yml`)

**Trigger:** `check_suite` completed, `pull_request` labeled with `ai-approved`

**What it does:**
1. Finds open PRs with `ai-approved` label (excludes `do-not-merge`, `needs-human-review`)
2. Verifies all CI checks passed
3. Enables squash auto-merge via GraphQL API
4. Falls back to `ready-to-merge` label if branch protection doesn't support auto-merge

**Human overrides:**
- Add `do-not-merge` label to block any PR from auto-merging
- Add `needs-human-review` label to pause automation for manual review

### Copilot Coding Agent Setup (`copilot-setup-steps.yml`)

**Location:** `.github/copilot-setup-steps.yml`

Defines environment setup for GitHub Copilot coding agent:
- Installs Node.js dependencies (`npm install`)
- Installs Python linting tools (ruff, bandit, safety)
- Builds TypeScript (`npm run build`)

This enables Copilot to autonomously implement fixes when tagged in PR comments.

### Labels

| Label | Color | Meaning |
|-------|-------|---------|
| `ai-reviewed` | Blue | AI review completed |
| `ai-approved` | Green | AI review passed |
| `ai-changes-requested` | Red | AI found issues |
| `ready-to-merge` | Green | All checks passed, merge ready |
| `do-not-merge` | — | Human override: block auto-merge |
| `needs-human-review` | — | Human override: pause for review |

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

**Last Updated:** 2026-02-20
**Maintained By:** DWS6 Repository Team  
**Status:** ✅ Active
