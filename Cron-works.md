# Cron-works — DWS6 Scheduled Work Registry

All scheduled work across DGX Spark (primary), GitHub Actions (PR/push + manual failover),
and Claude Code Routines (automated cloud backup).
Single source of truth for what runs when and where.

**Budget target:** GitHub Actions under $10/month (down from $18).
**Strategy:** Three-tier failover: DGX Spark → Claude Routines (auto) → GHA workflow_dispatch (manual).
PR/push-triggered workflows stay on GHA.

## DGX Spark — Primary Cron (24/7)

Runtime: `dws-cron` container via `infrastructure/dgx-spark/docker-compose.yml`.
Discovery: `day-runner.sh` auto-discovers scripts in `scripts/daily/` and `scripts/weekly/`.
Heartbeat: `:9999/health` — GHA workflows check this before running.

### Daily Scripts (`scripts/daily/`)

| Script                             | Schedule (UTC)      | What it does                                                                                                                     | GHA failover                                                                                                                                                               |
| ---------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mvp-audit.sh`                     | 02:00 / 03:00 (DST) | Feature audit → GitHub issue                                                                                                     | `daily-mvp-audit.yml`                                                                                                                                                      |
| `ted-pipeline.sh`                  | 06:00               | TED tender fetch → Supabase + outreach                                                                                           | `ted-pipeline.yml`                                                                                                                                                         |
| `ted-followup.sh`                  | 07:30               | TED day-3 follow-up emails                                                                                                       | `ted-followup.yml`                                                                                                                                                         |
| `construction-leads.sh`            | 03:00 / 04:00 (DST) | Lead scraping → Supabase                                                                                                         | `construction-leads.yml`                                                                                                                                                   |
| `generate-campaign-post.sh`        | 03:00 / 04:00 (DST) | Social media post generation                                                                                                     | `campaign-daily-posts.yml`                                                                                                                                                 |
| `db-backup.sh`                     | 02:30               | pg_dump to 4 destinations                                                                                                        | `daily-db-backup.yml`                                                                                                                                                      |
| `backup-sites.sh`                  | 02:00               | Site asset backup                                                                                                                | `daily-site-backup.yml`                                                                                                                                                    |
| `price-list-quarterly-gate.sh`     | daily (gate)        | Quarterly price list stamp (runs only on Q1 dates)                                                                               | `quarterly-price-list.yml`                                                                                                                                                 |
| `morning-emails.sh`                | 04:00               | Morning briefing V2 email                                                                                                        | —                                                                                                                                                                          |
| `cbam-price-fetch.sh`              | —                   | CBAM carbon price fetch                                                                                                          | —                                                                                                                                                                          |
| `update-fx-rates.sh`               | —                   | FX rate update                                                                                                                   | —                                                                                                                                                                          |
| `detect-drift.sh`                  | —                   | Configuration drift detection                                                                                                    | —                                                                                                                                                                          |
| `dependabot-audit.sh`              | 05:00               | npm audit across all package.json dirs, non-breaking auto-fix + commit (script header claims 03:00-06:00, no time was ever set)  | none — gap (2026-07-03): 432 GH Dependabot alerts open, no failover if DGX is down; `.github/dependabot.yml` now handles version-update PRs independently as a second tier |
| `check-ollama-models.sh`           | —                   | Ollama model health check                                                                                                        | —                                                                                                                                                                          |
| `check-breach-deadlines.sh`        | —                   | NIS2 breach deadline monitor                                                                                                     | —                                                                                                                                                                          |
| `kb-lint.sh`                       | —                   | Knowledge base lint                                                                                                              | —                                                                                                                                                                          |
| `kb-cleanup.sh`                    | —                   | Knowledge base cleanup                                                                                                           | —                                                                                                                                                                          |
| `kb-watch-inbox.sh`                | —                   | KB inbox watcher                                                                                                                 | —                                                                                                                                                                          |
| `clawdbot-digest.sh`               | —                   | Session janitor digest                                                                                                           | —                                                                                                                                                                          |
| `news-to-signal.sh`                | —                   | News → market signal pipeline                                                                                                    | —                                                                                                                                                                          |
| `run-evals.sh`                     | —                   | Agent evaluation suite                                                                                                           | —                                                                                                                                                                          |
| `autosend-x.sh`                    | —                   | Auto-send X/Twitter posts                                                                                                        | —                                                                                                                                                                          |
| `db-restore-verify.sh`             | —                   | Backup restore verification                                                                                                      | —                                                                                                                                                                          |
| `generate-local-inventory-feed.sh` | —                   | Local inventory feed for Google                                                                                                  | —                                                                                                                                                                          |
| `flow-sales-outreach.ts`           | —                   | Sales outreach flow                                                                                                              | —                                                                                                                                                                          |
| `flow-investor-outreach.ts`        | —                   | Investor outreach flow                                                                                                           | —                                                                                                                                                                          |
| `flow-partner-outreach.ts`         | —                   | Partner outreach flow                                                                                                            | —                                                                                                                                                                          |
| `flow-media-outreach.ts`           | —                   | Media outreach flow                                                                                                              | —                                                                                                                                                                          |
| `flow-customer-onboarding.ts`      | —                   | Customer onboarding flow                                                                                                         | —                                                                                                                                                                          |
| `synthetic-data-health.ts`         | —                   | Synthetic data pipeline health                                                                                                   | —                                                                                                                                                                          |
| `tool-telemetry-report.ts`         | —                   | Tool usage telemetry                                                                                                             | —                                                                                                                                                                          |
| `prod-log-error-review.ts`         | 05:00               | Review production agent error log (`agent_executions`, 24h), cluster distinct errors → email digest + HIL todo for fix follow-up | —                                                                                                                                                                          |

### Weekly Scripts (`scripts/weekly/`)

| Script                                 | Schedule (UTC) | What it does                                                                                                                              | GHA failover                                                                                                                                                                                                                                  |
| -------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `housekeeping-audit.sh`                | Sun 03:00      | Public path audit, Learn/ staleness, branch hygiene                                                                                       | `housekeeping-weekly.yml`                                                                                                                                                                                                                     |
| `security-audit.sh`                    | Sun 04:00      | npm audit, bandit, safety, gitleaks, local-ci, scan_critical_bugs.py --full (added 2026-07-03, redacted summary → `gh issue`)             | `security-audit-enhanced.yml` (partial) + `security-scan-weekly.yml`. NOT `monthly-security-audit-enhanced.yml` (its score is fake, see script header) or `security-scan-biweekly.yml` (superseded by weekly cadence instead of migrated 1:1) |
| `ted-learning.sh`                      | Mon 08:15      | TED outreach learning aggregation                                                                                                         | `ted-learning-weekly.yml`                                                                                                                                                                                                                     |
| `market-research.sh`                   | Mon 07:00      | Market research collection                                                                                                                | `market-research-weekly.yml`                                                                                                                                                                                                                  |
| `roadmap-tracker.sh`                   | Mon 08:00      | PR progress by roadmap category → GitHub issue                                                                                            | `roadmap-weekly-tracker.yml`                                                                                                                                                                                                                  |
| `pkg-update.sh`                        | Mon 05:00      | npm outdated scan + safe update across all workspaces, Python report, SDK highlights, admin-docs + ontology flag → GitHub issue           | —                                                                                                                                                                                                                                             |
| `auth-security-audit.sh`               | 1st & 15th     | Auth directory OWASP scan                                                                                                                 | `biweekly-auth-security-audit.yml`                                                                                                                                                                                                            |
| `agents-md-freshness.sh`               | Mon 06:00      | AGENTS.md vs src/agents/ sync check                                                                                                       | `agents-md-freshness.yml`                                                                                                                                                                                                                     |
| `coach-learn-curate.sh`                | Sun 05:00      | Sync Coach/ + Learn/: version-archive superseded docs → Archive/, render newest Coach offers + sources → HTML, rebuild `Learn/start.html` | —                                                                                                                                                                                                                                             |
| `git-audit-diagnostics.sh`             | —              | Git history audit                                                                                                                         | —                                                                                                                                                                                                                                             |
| `sync-external-repos.sh`               | —              | External repo sync                                                                                                                        | —                                                                                                                                                                                                                                             |
| `investor-outreach-followup.sh`        | —              | Investor follow-up emails                                                                                                                 | —                                                                                                                                                                                                                                             |
| `investor-status-report.sh`            | —              | Investor pipeline status                                                                                                                  | —                                                                                                                                                                                                                                             |
| `investor-regulatory-radar-refresh.sh` | —              | Regulatory radar for investors                                                                                                            | —                                                                                                                                                                                                                                             |
| `lsj-publish-draft.sh`                 | —              | LSJ blog draft publish                                                                                                                    | —                                                                                                                                                                                                                                             |

### Hourly Scripts (`scripts/hourly/`)

| Script                    | What it does                |
| ------------------------- | --------------------------- |
| `booking-health-check.ts` | Booking system health probe |

## GitHub Actions — Retained Workflows

### PR/Push-Triggered (must stay on GHA)

| Workflow                      | Trigger                        | Purpose                       |
| ----------------------------- | ------------------------------ | ----------------------------- |
| `ci-audit-verify.yml`         | push main/claude/\*\*, PR main | CI audit gate                 |
| `test-on-pr.yml`              | PR main (src/\*\*)             | Test & coverage               |
| `ai-pr-review.yml`            | PR (opened/sync/reopen)        | AI code review                |
| `claude-review.yml`           | PR (opened/ready)              | Claude PR review              |
| `claude-auto-fix.yml`         | PR (opened/sync/ready)         | Auto-fix lint/type issues     |
| `security-check-pr.yml`       | PR (_.py, _.ts, \*.js)         | Aikido security check         |
| `copilot-preflight.yml`       | push copilot/**/claude/**      | Copilot agent preflight       |
| `deploy-staging.yml`          | push claude/** (src/**)        | Deploy to staging             |
| `deploy-cloudrun.yml`         | push main (src/\*\*)           | Deploy to Cloud Run           |
| `deploy-dgx-spark.yml`        | push main                      | Deploy to DGX Spark           |
| `image-guardian.yml`          | PR (dws10.com images)          | Image asset protection        |
| `validate-pricing.yml`        | PR (products.json)             | Price catalog validation      |
| `agents-md-sync.yml`          | push main (src/agents/\*\*)    | AGENTS.md auto-sync           |
| `sync-dws6-landing-pages.yml` | push main (dws6.com/\*\*)      | Dual-folder sync              |
| `dependency-submission.yml`   | push main                      | Dependency graph submission   |
| `update-store.yml`            | push main (Store/\*\*)         | Store feed update             |
| `no-delete-branch-guard.yml`  | branch delete event            | Prevent branch deletion       |
| `pr-auto-merge.yml`           | check_suite/PR labeled         | Auto-merge approved PRs       |
| `ruff-auto-fix.yml`           | workflow_dispatch              | Python lint auto-fix          |
| `dast-zap-scan.yml`           | PR main (src/\*\*) + monthly   | OWASP ZAP scan (needs Docker) |

### Scheduled but Stays on GHA

| Workflow            | Schedule           | Reason                                 |
| ------------------- | ------------------ | -------------------------------------- |
| `dast-zap-scan.yml` | 1st of month 03:00 | Needs Docker-in-Docker (ZAP container) |

### Descheduled (workflow_dispatch only)

These workflows had their `schedule:` removed. They remain available for manual failover via `gh workflow run`.

| Workflow                              | Removed    | DGX Script                                   |
| ------------------------------------- | ---------- | -------------------------------------------- |
| `daily-mvp-audit.yml`                 | 2026-05-25 | `scripts/daily/mvp-audit.sh`                 |
| `ted-pipeline.yml`                    | 2026-05-25 | `scripts/daily/ted-pipeline.sh`              |
| `ted-followup.yml`                    | 2026-05-25 | `scripts/daily/ted-followup.sh`              |
| `ted-learning-weekly.yml`             | 2026-05-25 | `scripts/weekly/ted-learning.sh`             |
| `housekeeping-weekly.yml`             | 2026-05-25 | `scripts/weekly/housekeeping-audit.sh`       |
| `golden-principle-scan.yml`           | 2026-05-25 | cron-runner.ts                               |
| `agents-md-freshness.yml`             | 2026-05-25 | `scripts/weekly/agents-md-freshness.sh`      |
| `security-audit-enhanced.yml`         | 2026-05-25 | `scripts/weekly/security-audit.sh`           |
| `roadmap-weekly-tracker.yml`          | 2026-05-25 | `scripts/weekly/roadmap-tracker.sh`          |
| `security-scan-weekly.yml`            | 2026-05-25 | `scripts/weekly/security-audit.sh`           |
| `security-scan-biweekly.yml`          | 2026-05-25 | `scripts/weekly/security-audit.sh`           |
| `biweekly-auth-security-audit.yml`    | 2026-05-25 | `scripts/weekly/auth-security-audit.sh`      |
| `monthly-security-audit-enhanced.yml` | 2026-05-25 | `scripts/weekly/security-audit.sh`           |
| `quarterly-price-list.yml`            | 2026-05-25 | `scripts/daily/price-list-quarterly-gate.sh` |
| `construction-leads.yml`              | 2026-04-08 | `scripts/daily/construction-leads.sh`        |
| `campaign-daily-posts.yml`            | 2026-04-08 | `scripts/daily/generate-campaign-post.sh`    |
| `daily-db-backup.yml`                 | 2026-04-08 | `scripts/daily/db-backup.sh`                 |
| `daily-site-backup.yml`               | 2026-04-08 | `scripts/daily/backup-sites.sh`              |
| `daily-backup.yml`                    | 2026-04-08 | redundant (git-tracked files)                |
| `daily-claude-backup.yml`             | 2026-04-08 | redundant (local worktrees)                  |
| `market-research-weekly.yml`          | 2026-04-08 | `scripts/weekly/market-research.sh`          |

### Disabled (.yml.disabled)

| Workflow                   | Why                               |
| -------------------------- | --------------------------------- |
| `campaign-newsletter.yml`  | Paused                            |
| `captain-briefing.yml`     | Paused                            |
| `morning-briefing.yml`     | Replaced by DGX morning-emails.sh |
| `outreach-digest.yml`      | Paused                            |
| `regulation-monitor.yml`   | Paused                            |
| `social-scheduler.yml`     | Paused                            |
| `weekly-report.yml`        | Paused                            |
| `dependency_review.yml`    | Paused                            |
| `ruff.yml`                 | Replaced by ruff-auto-fix.yml     |
| `secret-scan-gitleaks.yml` | Covered by security-audit.sh      |
| `test.yml`                 | Replaced by test-on-pr.yml        |
| `deploy-scaleway_OLD.yml`  | Deprecated                        |

## Cost Estimate

| Category                           | Monthly GHA minutes | Cost @ $0.008/min |
| ---------------------------------- | ------------------- | ----------------- |
| PR/push workflows (retained)       | ~400-500            | $3.20-4.00        |
| DAST ZAP monthly                   | ~15                 | $0.12             |
| Descheduled failover (skip checks) | 0                   | $0.00             |
| **Total estimate**                 | **~415-515**        | **$3.32-4.12**    |

**Previous:** ~2,250 min/month = $18.00
**After this change:** ~500 min/month = ~$4.00
**Savings:** ~$14/month (78%)

## Claude Desktop Scheduled Tasks — Tier 2 Automated Local Backup

Claude Desktop Scheduled Tasks run on the local Windows machine while the Claude Desktop
app is open. They persist across restarts and check DGX health before acting.
Manage via `Settings → Scheduled Tasks` or the `mcp__scheduled-tasks` tools.

### Architecture

```
Tier 1: DGX Spark cron (primary, free, 24/7 ARM64 hardware)
   ↓ heartbeat fails
Tier 2: Claude Desktop Tasks (local backup, HIL warning + first-aid boot)
   ↓ app closed / laptop off
Tier 3: GHA workflow_dispatch (manual failover, $0.008/min)
```

### Tier 2 Failover Protocol (all 5 tasks follow this)

Each Desktop Task runs the same 5-step protocol:

1. **Heartbeat check** — `curl http://192.168.101.113:9999/health`. If healthy → skip.
2. **HIL warning email** — Sends `[DWS ALERT]` email to `risto.paarni2024@lifetime.fi` via `sendEmail()` (Proton SMTP). Includes timestamp, affected job name, and SSH/dashboard links.
3. **First-aid boot** — SSH to `admin100@192.168.101.113`, runs `docker compose -f infrastructure/dgx-spark/docker-compose.yml restart`. Waits 30s, re-checks heartbeat.
4. **Local fallback** — If first-aid fails, runs the backup script locally.
5. **Report** — Prints summary of DGX status, first-aid result, and backup outcome.

### Active Desktop Scheduled Tasks (Critical Jobs Only)

| Task ID                     | Schedule (Helsinki) | DGX Script                            | Why Critical                   |
| --------------------------- | ------------------- | ------------------------------------- | ------------------------------ |
| `backup-db`                 | Daily 06:33         | `scripts/daily/db-backup.sh`          | Data loss risk if gaps > 48h   |
| `backup-ted-pipeline`       | Daily 09:33         | `scripts/daily/ted-pipeline.sh`       | Hard tender deadlines          |
| `backup-morning-briefing`   | Daily 07:33         | `scripts/daily/morning-emails.sh`     | Operator situational awareness |
| `backup-security-audit`     | Sun 07:33           | `scripts/weekly/security-audit.sh`    | Compliance: max 14-day gap     |
| `backup-construction-leads` | Mon-Sat 06:33       | `scripts/daily/construction-leads.sh` | Leads go stale in 24-48h       |

### First Run Recommendation

Run each task once manually (`Run now`) to pre-approve tool permissions (Bash, file access).
Future scheduled runs will reuse the granted permissions without prompting.

## Claude Code Routines — Tier 3 Cloud Backup (Optional)

Claude Code Routines run on Anthropic-managed cloud infrastructure. They work even when
DGX Spark is down AND the laptop is off. Configure at [claude.ai/code/routines](https://claude.ai/code/routines)
or via `/schedule` in the CLI.

These are optional — Tier 2 Desktop Tasks handle most failover scenarios.
Routines add coverage for when the laptop is also off.

### How Routines Integrate

- **Schedule trigger:** Routines run on their own schedule (minimum 1 hour interval)
- **API trigger:** DGX heartbeat monitor can POST to routine `/fire` endpoint on failure
- **GitHub trigger:** React to PR/push events (already covered by GHA, skip these)
- Routines clone the repo fresh each run — no local state dependency
- Connectors (GitHub, Slack) provide tool access during runs
- Runs appear as sessions at claude.ai — reviewable and continuable

### Recommended Routines (Critical Jobs Only)

Only the highest-value scheduled jobs justify a Routine backup. Low-value audits
and reports can wait for manual `workflow_dispatch` if DGX is down.

| Routine Name         | Schedule         | Prompt Summary                                                         | Why Critical                                                  |
| -------------------- | ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| `daily-db-backup`    | Daily 03:00 UTC  | Run `scripts/daily/db-backup.sh` — pg_dump to 4 destinations           | Data loss risk if backup gaps exceed 48h                      |
| `ted-pipeline`       | Daily 06:00 UTC  | Run `scripts/daily/ted-pipeline.sh` — fetch TED tenders, filter, store | Tender deadlines are hard; missing a day = lost opportunities |
| `morning-briefing`   | Daily 04:00 UTC  | Run `scripts/daily/morning-emails.sh` — compile and send morning brief | Operator situational awareness; no brief = blind start        |
| `security-audit`     | Weekly Sun 04:00 | Run `scripts/weekly/security-audit.sh` — npm audit, gitleaks, bandit   | Compliance requirement; max gap 14 days                       |
| `construction-leads` | Daily 03:00 UTC  | Run `scripts/daily/construction-leads.sh` — scrape + store leads       | Revenue pipeline; leads go stale in 24-48h                    |

### Routine Setup Checklist

To create each routine at [claude.ai/code/routines](https://claude.ai/code/routines):

1. **Name:** Use the names from the table above
2. **Repository:** `blogtheristo/dws6`
3. **Environment:** Create "DWS Cron" environment with:
   - Network access: Custom (add `*.supabase.co`, SMTP hosts)
   - Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `PROTON_SMTP_*` (from vault)
   - Setup script: `npm ci --ignore-scripts`
4. **Prompt:** `cd /home/user/dws6 && bash scripts/{daily|weekly}/{name}.sh`
5. **Schedule:** Match the DGX cron times (stagger 30-60 min later as backup)
6. **Connectors:** GitHub (for issue creation), Slack (for alerts)
7. **Branch pushes:** Disabled (backup runs should not push)

### API Trigger for Auto-Failover

The DGX heartbeat monitor can auto-trigger routines when it detects failure:

```bash
# In DGX heartbeat failure handler (infrastructure/dgx-spark/heartbeat.ts):
# POST to routine's /fire endpoint when health check fails 3x consecutive
curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_XXXXX/fire \
  -H "Authorization: Bearer $ROUTINE_API_TOKEN" \
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"text": "DGX Spark heartbeat failed. Running backup cron jobs."}'
```

Store `ROUTINE_API_TOKEN` in the Aiven vault alongside other secrets.

### Desktop Scheduled Tasks (Not Recommended for Backup)

Desktop tasks run on the local Windows machine but require the Claude Desktop app
to be open and the computer awake. Not suitable as a reliability backup layer.

Use Desktop tasks only for developer-experience conveniences:

- Morning PR review when laptop opens
- Pre-meeting code status check
- Local-only tasks needing uncommitted files

### `/loop` (Session-Scoped, Not for Backup)

`/loop` runs inside an open CLI session and dies when the session ends.
Use only for live monitoring during active work:

- `/loop 5m check if the deploy finished`
- `/loop 15m /review` during PR review cycles
- `/loop check CI and address review comments` (dynamic interval)
