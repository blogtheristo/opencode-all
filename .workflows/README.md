# Workflow Management System

**Version:** 1.0
**Created:** 2025-12-26
**Purpose:** Centralized workflow orchestration, monitoring, and automated failure recovery

---

## Directory Structure

```
.workflows/
├── README.md                    # This file
├── registry/                    # Workflow registry and metadata
│   ├── WORKFLOW_REGISTRY.json   # Master registry of all workflows
│   ├── github-workflows.json    # GitHub Actions workflows
│   └── site-workflows.json      # Site quality workflows
├── schedules/                   # Workflow scheduling
│   ├── daily.json              # Daily workflow schedule
│   ├── weekly.json             # Weekly workflow schedule
│   └── monthly.json            # Monthly workflow schedule
├── audit/                      # Workflow execution audits
│   ├── YYYY-MM-DD/             # Daily audit logs
│   └── failures/               # Failure analysis reports
├── agents/                     # Automated fix agents
│   ├── fix-agent.js            # Main fix agent
│   ├── audit-agent.js          # Audit agent
│   └── recovery-protocols/     # Recovery procedures
├── morning-feature-workflow.md # Morning workflow: branch + build + implement
└── templates/                  # Workflow templates
    ├── github-action.yml       # GitHub Action template
    └── site-workflow.md        # Site workflow template
```

---

## Problems Solved

### 1. ❌ **Problem: No Visibility**
**What runs today? This week? This month?**

✅ **Solution: Workflow Registry + Schedules**
- Central registry tracks all workflows
- Schedules show what runs when
- Dashboard shows today/week/month views

### 2. ❌ **Problem: Workflow Failures Go Unnoticed**
**GitHub shows "workflow failed" but no action taken**

✅ **Solution: Automated Audit System**
- Failures logged automatically
- Audit agent analyzes root cause
- Notifications sent to team

### 3. ❌ **Problem: Manual Debugging Required**
**When workflow fails, manual investigation needed**

✅ **Solution: Fix Agent**
- Automatic failure detection
- Root cause analysis
- Automated fix proposals
- Claude Code integration

---

## Workflow Types

### 1. **GitHub Actions Workflows** (.github/workflows/)

**Security & Compliance:**
- `security-scan-daily.yml` - Daily security scans
- `security-check-pr.yml` - PR security checks
- `monthly-security-audit.yml` - Monthly audit (2 versions)

**Deployment:**
- `deploy-pilot.yml` - Pilot deployment
- `sync-site-content.yml` - Sync site content
- `sync-landing-pages.yml` - Sync landing pages
- `sync-dws6-landing-pages.yml` - Sync DWS6 pages
- `update-store.yml` - Update store

**Infrastructure:**
- `purge-cloudflare-cache.yml` - Clear Cloudflare cache

**Reporting:**
- `investor-timeline-tracker.yml` - Track investor timeline
- `weekly-report.yml` - Weekly status report

**Total:** 12 GitHub workflows

### 2. **Site Quality Workflows** (our new workflows)

**Implementation:**
- IMPLEMENTATION_WORKFLOW.md - Page update workflow (10 phases)

**Management:**
- Site quality standards
- Component updates
- CTA standardization

---

## Workflow Visibility System

### Today's Workflows

**View what runs today:**
```bash
node .workflows/registry/check-schedule.js --today
```

**Output:**
```
📅 Workflows Running Today (2025-12-26)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 RUNNING NOW:
  • security-scan-daily (Started: 00:00 UTC)
  • sync-site-content (Triggered by: push to main)

⏰ SCHEDULED TODAY:
  • None

✅ COMPLETED TODAY:
  • None

❌ FAILED TODAY:
  • sync-site-content (09:30 UTC) - See audit log
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### This Week's Workflows

**View weekly schedule:**
```bash
node .workflows/registry/check-schedule.js --week
```

### This Month's Workflows

**View monthly schedule:**
```bash
node .workflows/registry/check-schedule.js --month
```

---

## Automated Failure Recovery

### When Workflow Fails

**Automatic Process:**

```
1. GitHub Workflow Fails
   ↓
2. Webhook Triggers Audit Agent
   ↓
3. Audit Agent Analyzes Failure
   ├─ Collects logs
   ├─ Identifies error type
   ├─ Determines root cause
   └─ Creates audit report
   ↓
4. Fix Agent Launched
   ├─ Reviews audit report
   ├─ Proposes fix
   ├─ Creates fix branch
   └─ Submits PR with fix
   ↓
5. Notification Sent
   └─ Team reviews and merges
```

### Audit Agent

**What it does:**
1. Detects workflow failure (GitHub webhook or API polling)
2. Retrieves workflow logs
3. Analyzes error messages
4. Classifies failure type (build, test, deploy, sync, etc.)
5. Generates audit report in `.workflows/audit/failures/`

**Run manually:**
```bash
node .workflows/agents/audit-agent.js --workflow-id <id>
```

### Fix Agent

**What it does:**
1. Reads audit report
2. Identifies fix strategy
3. Applies fix automatically (if safe)
4. Creates PR for review (if complex)
5. Notifies team

**Run manually:**
```bash
node .workflows/agents/fix-agent.js --audit <audit-id>
```

---

## Integration with Claude Code

### Launch Fix Agent via Claude

**When you see "workflow failed":**

1. **Ask Claude to audit:**
   ```
   Claude, run the workflow audit agent for the failed workflow
   ```

2. **Claude executes:**
   ```bash
   node .workflows/agents/audit-agent.js --latest-failure
   ```

3. **Claude reports:**
   ```
   Audit complete. Failure: sync-site-content.yml
   Error: rsync command failed
   Root cause: Missing directory
   Fix: Create landing-pages/ directory before rsync
   ```

4. **Ask Claude to fix:**
   ```
   Claude, launch the fix agent
   ```

5. **Claude creates fix:**
   - Creates branch `fix/sync-site-content-YYYYMMDD`
   - Updates workflow file
   - Commits fix
   - Creates PR

### Automated Claude Integration

**Setup webhook:**
```json
{
  "event": "workflow_run",
  "status": "failure",
  "action": "trigger_claude_audit"
}
```

**Claude receives:**
```
🚨 Workflow Failure Detected
Workflow: sync-site-content.yml
Time: 2025-12-26 09:30 UTC
Action: Launching audit agent...
```

---

## Workflow Registry

### Master Registry Format

**File:** `.workflows/registry/WORKFLOW_REGISTRY.json`

```json
{
  "workflows": [
    {
      "id": "security-scan-daily",
      "name": "Daily Security Scan",
      "type": "github-action",
      "file": ".github/workflows/security-scan-daily.yml",
      "schedule": {
        "frequency": "daily",
        "time": "00:00 UTC",
        "cron": "0 0 * * *"
      },
      "status": "active",
      "last_run": "2025-12-26T00:00:00Z",
      "last_status": "success",
      "failure_count": 0,
      "owner": "security-team",
      "notifications": ["security@example.com"],
      "auto_fix": false,
      "dependencies": []
    },
    {
      "id": "sync-site-content",
      "name": "Sync Site Content",
      "type": "github-action",
      "file": ".github/workflows/sync-site-content.yml",
      "schedule": {
        "frequency": "on-push",
        "trigger": ["dws10.com/**", "onelifetime.world/**"]
      },
      "status": "failing",
      "last_run": "2025-12-26T09:30:00Z",
      "last_status": "failure",
      "failure_count": 1,
      "owner": "dev-team",
      "notifications": ["dev@example.com"],
      "auto_fix": true,
      "dependencies": ["landing-pages directory"]
    }
  ],
  "last_updated": "2025-12-26T10:00:00Z"
}
```

---

## Schedule System

### Daily Schedule

**File:** `.workflows/schedules/daily.json`

```json
{
  "date": "2025-12-26",
  "workflows": [
    {
      "time": "00:00",
      "workflow_id": "security-scan-daily",
      "type": "scheduled"
    },
    {
      "time": "on-push",
      "workflow_id": "sync-site-content",
      "type": "event-triggered"
    }
  ]
}
```

### Weekly Schedule

**File:** `.workflows/schedules/weekly.json`

```json
{
  "week": "2025-W52",
  "workflows": [
    {
      "day": "Monday",
      "time": "09:00",
      "workflow_id": "weekly-report",
      "type": "scheduled"
    },
    {
      "day": "Friday",
      "time": "16:00",
      "workflow_id": "purge-cloudflare-cache",
      "type": "scheduled"
    }
  ]
}
```

### Monthly Schedule

**File:** `.workflows/schedules/monthly.json`

```json
{
  "month": "2025-12",
  "workflows": [
    {
      "day": 1,
      "time": "00:00",
      "workflow_id": "monthly-security-audit",
      "type": "scheduled"
    },
    {
      "day": 15,
      "time": "00:00",
      "workflow_id": "investor-timeline-tracker",
      "type": "scheduled"
    }
  ]
}
```

---

## Failure Audit System

### Audit Report Format

**File:** `.workflows/audit/failures/sync-site-content-20251226-0930.json`

```json
{
  "audit_id": "audit-20251226-0930-sync-site",
  "timestamp": "2025-12-26T09:30:00Z",
  "workflow": {
    "id": "sync-site-content",
    "file": ".github/workflows/sync-site-content.yml",
    "run_id": "12345678",
    "run_url": "https://github.com/user/repo/actions/runs/12345678"
  },
  "failure": {
    "step": "Sync dws10.com content",
    "exit_code": 23,
    "error_message": "rsync: link_stat \"/home/runner/work/dws6/dws6/dws10.com\" failed: No such file or directory (2)",
    "error_type": "file_not_found",
    "logs": "..."
  },
  "analysis": {
    "root_cause": "Source directory 'dws10.com' not found in workflow context",
    "likely_reason": "Workflow runs in landing-pages subdirectory, not root",
    "severity": "high",
    "impact": "Deployment sync blocked"
  },
  "fix_strategy": {
    "type": "workflow_update",
    "confidence": "high",
    "auto_fixable": true,
    "fix_description": "Update rsync paths to use correct working directory",
    "estimated_time": "5 minutes"
  },
  "recommended_actions": [
    "1. Update workflow to run from repository root",
    "2. Or update rsync paths to use correct relative paths",
    "3. Add directory existence check before rsync"
  ],
  "agent_assigned": "fix-agent",
  "status": "fix_in_progress"
}
```

---

## Commands Reference

### Check Workflow Status

```bash
# View today's workflows
node .workflows/registry/check-schedule.js --today

# View this week
node .workflows/registry/check-schedule.js --week

# View this month
node .workflows/registry/check-schedule.js --month

# View specific workflow
node .workflows/registry/check-workflow.js --id sync-site-content

# View all failures
node .workflows/audit/list-failures.js --days 7
```

### Run Audit Agent

```bash
# Audit latest failure
node .workflows/agents/audit-agent.js --latest

# Audit specific workflow run
node .workflows/agents/audit-agent.js --run-id 12345678

# Audit all failures today
node .workflows/agents/audit-agent.js --today
```

### Run Fix Agent

```bash
# Fix latest audited failure
node .workflows/agents/fix-agent.js --latest

# Fix specific audit
node .workflows/agents/fix-agent.js --audit audit-20251226-0930-sync-site

# Dry run (show fix without applying)
node .workflows/agents/fix-agent.js --latest --dry-run
```

### Update Registry

```bash
# Sync GitHub workflows to registry
node .workflows/registry/sync-github-workflows.js

# Add new workflow
node .workflows/registry/add-workflow.js --file path/to/workflow.yml

# Update workflow status
node .workflows/registry/update-status.js --id sync-site-content --status active
```

---

## GitHub Copilot Integration

See: `.workflows/GITHUB_COPILOT_GUIDE.md` for:
- How to set up automated failure detection
- How to integrate with GitHub Copilot Chat
- Prompts for Copilot to help debug workflows
- Automation scripts

---

## Maintenance

### Daily
- Review failure audits
- Check fix agent results
- Verify automated fixes

### Weekly
- Review workflow registry
- Update schedules if needed
- Clean up old audit logs (> 30 days)

### Monthly
- Review all workflow performance
- Update fix agent rules
- Optimize recovery protocols

---

## Troubleshooting

### Workflow Failed But No Audit Created

**Check:**
1. Is audit agent running? `ps aux | grep audit-agent`
2. Are GitHub webhooks configured?
3. Check audit agent logs: `cat .workflows/audit/agent.log`

### Fix Agent Not Creating PRs

**Check:**
1. GitHub token permissions
2. Fix agent logs: `cat .workflows/agents/fix-agent.log`
3. Auto-fix enabled in registry for this workflow?

### Can't See Today's Workflows

**Check:**
1. Registry up to date? Run sync: `node .workflows/registry/sync-github-workflows.js`
2. Schedule files exist? Check `.workflows/schedules/`

---

**Maintained By:** Development Team
**Last Updated:** 2025-12-26
**Next Review:** Weekly
