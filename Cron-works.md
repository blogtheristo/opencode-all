# Cron-works — DWS6 Scheduled Work Registry

All scheduled work across DGX Spark (primary) and GitHub Actions (failover/PR-only).
Single source of truth for what runs when and where.

**Budget target:** GitHub Actions under $10/month (down from $18).
**Strategy:** DGX Spark is primary for all scheduled work. GHA keeps `workflow_dispatch:` for manual failover. PR/push-triggered workflows stay on GHA.

## DGX Spark — Primary Cron (24/7)

Runtime: `dws-cron` container via `infrastructure/dgx-spark/docker-compose.yml`.
Discovery: `day-runner.sh` auto-discovers scripts in `scripts/daily/` and `scripts/weekly/`.
Heartbeat: `:9999/health` — GHA workflows check this before running.

### Daily Scripts (`scripts/daily/`)

| Script | Schedule (UTC) | What it does | GHA failover |
|--------|---------------|--------------|--------------|
| `mvp-audit.sh` | 02:00 / 03:00 (DST) | Feature audit → GitHub issue | `daily-mvp-audit.yml` |
| `ted-pipeline.sh` | 06:00 | TED tender fetch → Supabase + outreach | `ted-pipeline.yml` |
| `ted-followup.sh` | 07:30 | TED day-3 follow-up emails | `ted-followup.yml` |
| `construction-leads.sh` | 03:00 / 04:00 (DST) | Lead scraping → Supabase | `construction-leads.yml` |
| `generate-campaign-post.sh` | 03:00 / 04:00 (DST) | Social media post generation | `campaign-daily-posts.yml` |
| `db-backup.sh` | 02:30 | pg_dump to 4 destinations | `daily-db-backup.yml` |
| `backup-sites.sh` | 02:00 | Site asset backup | `daily-site-backup.yml` |
| `price-list-quarterly-gate.sh` | daily (gate) | Quarterly price list stamp (runs only on Q1 dates) | `quarterly-price-list.yml` |
| `morning-emails.sh` | 04:00 | Morning briefing V2 email | — |
| `cbam-price-fetch.sh` | — | CBAM carbon price fetch | — |
| `update-fx-rates.sh` | — | FX rate update | — |
| `detect-drift.sh` | — | Configuration drift detection | — |
| `dependabot-audit.sh` | — | Dependabot alert digest | — |
| `check-ollama-models.sh` | — | Ollama model health check | — |
| `check-breach-deadlines.sh` | — | NIS2 breach deadline monitor | — |
| `kb-lint.sh` | — | Knowledge base lint | — |
| `kb-cleanup.sh` | — | Knowledge base cleanup | — |
| `kb-watch-inbox.sh` | — | KB inbox watcher | — |
| `clawdbot-digest.sh` | — | Session janitor digest | — |
| `news-to-signal.sh` | — | News → market signal pipeline | — |
| `run-evals.sh` | — | Agent evaluation suite | — |
| `autosend-x.sh` | — | Auto-send X/Twitter posts | — |
| `db-restore-verify.sh` | — | Backup restore verification | — |
| `generate-local-inventory-feed.sh` | — | Local inventory feed for Google | — |
| `flow-sales-outreach.ts` | — | Sales outreach flow | — |
| `flow-investor-outreach.ts` | — | Investor outreach flow | — |
| `flow-partner-outreach.ts` | — | Partner outreach flow | — |
| `flow-media-outreach.ts` | — | Media outreach flow | — |
| `flow-customer-onboarding.ts` | — | Customer onboarding flow | — |
| `synthetic-data-health.ts` | — | Synthetic data pipeline health | — |
| `tool-telemetry-report.ts` | — | Tool usage telemetry | — |

### Weekly Scripts (`scripts/weekly/`)

| Script | Schedule (UTC) | What it does | GHA failover |
|--------|---------------|--------------|--------------|
| `housekeeping-audit.sh` | Sun 03:00 | Public path audit, Learn/ staleness, branch hygiene | `housekeeping-weekly.yml` |
| `security-audit.sh` | Sun 04:00 | npm audit, bandit, safety, gitleaks, local-ci | `security-audit-enhanced.yml` + `security-scan-weekly.yml` + `security-scan-biweekly.yml` + `monthly-security-audit-enhanced.yml` |
| `ted-learning.sh` | Mon 08:15 | TED outreach learning aggregation | `ted-learning-weekly.yml` |
| `market-research.sh` | Mon 07:00 | Market research collection | `market-research-weekly.yml` |
| `roadmap-tracker.sh` | Mon 08:00 | PR progress by roadmap category → GitHub issue | `roadmap-weekly-tracker.yml` |
| `auth-security-audit.sh` | 1st & 15th | Auth directory OWASP scan | `biweekly-auth-security-audit.yml` |
| `agents-md-freshness.sh` | Mon 06:00 | AGENTS.md vs src/agents/ sync check | `agents-md-freshness.yml` |
| `git-audit-diagnostics.sh` | — | Git history audit | — |
| `sync-external-repos.sh` | — | External repo sync | — |
| `investor-outreach-followup.sh` | — | Investor follow-up emails | — |
| `investor-status-report.sh` | — | Investor pipeline status | — |
| `investor-regulatory-radar-refresh.sh` | — | Regulatory radar for investors | — |
| `lsj-publish-draft.sh` | — | LSJ blog draft publish | — |

### Hourly Scripts (`scripts/hourly/`)

| Script | What it does |
|--------|--------------|
| `booking-health-check.ts` | Booking system health probe |

## GitHub Actions — Retained Workflows

### PR/Push-Triggered (must stay on GHA)

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci-audit-verify.yml` | push main/claude/**, PR main | CI audit gate |
| `test-on-pr.yml` | PR main (src/**) | Test & coverage |
| `ai-pr-review.yml` | PR (opened/sync/reopen) | AI code review |
| `claude-review.yml` | PR (opened/ready) | Claude PR review |
| `claude-auto-fix.yml` | PR (opened/sync/ready) | Auto-fix lint/type issues |
| `security-check-pr.yml` | PR (*.py, *.ts, *.js) | Aikido security check |
| `copilot-preflight.yml` | push copilot/**/claude/** | Copilot agent preflight |
| `deploy-staging.yml` | push claude/** (src/**) | Deploy to staging |
| `deploy-cloudrun.yml` | push main (src/**) | Deploy to Cloud Run |
| `deploy-dgx-spark.yml` | push main | Deploy to DGX Spark |
| `image-guardian.yml` | PR (dws10.com images) | Image asset protection |
| `validate-pricing.yml` | PR (products.json) | Price catalog validation |
| `agents-md-sync.yml` | push main (src/agents/**) | AGENTS.md auto-sync |
| `sync-dws6-landing-pages.yml` | push main (dws6.com/**) | Dual-folder sync |
| `dependency-submission.yml` | push main | Dependency graph submission |
| `update-store.yml` | push main (Store/**) | Store feed update |
| `no-delete-branch-guard.yml` | branch delete event | Prevent branch deletion |
| `pr-auto-merge.yml` | check_suite/PR labeled | Auto-merge approved PRs |
| `ruff-auto-fix.yml` | workflow_dispatch | Python lint auto-fix |
| `dast-zap-scan.yml` | PR main (src/**) + monthly | OWASP ZAP scan (needs Docker) |

### Scheduled but Stays on GHA

| Workflow | Schedule | Reason |
|----------|----------|--------|
| `dast-zap-scan.yml` | 1st of month 03:00 | Needs Docker-in-Docker (ZAP container) |

### Descheduled (workflow_dispatch only)

These workflows had their `schedule:` removed. They remain available for manual failover via `gh workflow run`.

| Workflow | Removed | DGX Script |
|----------|---------|------------|
| `daily-mvp-audit.yml` | 2026-05-25 | `scripts/daily/mvp-audit.sh` |
| `ted-pipeline.yml` | 2026-05-25 | `scripts/daily/ted-pipeline.sh` |
| `ted-followup.yml` | 2026-05-25 | `scripts/daily/ted-followup.sh` |
| `ted-learning-weekly.yml` | 2026-05-25 | `scripts/weekly/ted-learning.sh` |
| `housekeeping-weekly.yml` | 2026-05-25 | `scripts/weekly/housekeeping-audit.sh` |
| `golden-principle-scan.yml` | 2026-05-25 | cron-runner.ts |
| `agents-md-freshness.yml` | 2026-05-25 | `scripts/weekly/agents-md-freshness.sh` |
| `security-audit-enhanced.yml` | 2026-05-25 | `scripts/weekly/security-audit.sh` |
| `roadmap-weekly-tracker.yml` | 2026-05-25 | `scripts/weekly/roadmap-tracker.sh` |
| `security-scan-weekly.yml` | 2026-05-25 | `scripts/weekly/security-audit.sh` |
| `security-scan-biweekly.yml` | 2026-05-25 | `scripts/weekly/security-audit.sh` |
| `biweekly-auth-security-audit.yml` | 2026-05-25 | `scripts/weekly/auth-security-audit.sh` |
| `monthly-security-audit-enhanced.yml` | 2026-05-25 | `scripts/weekly/security-audit.sh` |
| `quarterly-price-list.yml` | 2026-05-25 | `scripts/daily/price-list-quarterly-gate.sh` |
| `construction-leads.yml` | 2026-04-08 | `scripts/daily/construction-leads.sh` |
| `campaign-daily-posts.yml` | 2026-04-08 | `scripts/daily/generate-campaign-post.sh` |
| `daily-db-backup.yml` | 2026-04-08 | `scripts/daily/db-backup.sh` |
| `daily-site-backup.yml` | 2026-04-08 | `scripts/daily/backup-sites.sh` |
| `daily-backup.yml` | 2026-04-08 | redundant (git-tracked files) |
| `daily-claude-backup.yml` | 2026-04-08 | redundant (local worktrees) |
| `market-research-weekly.yml` | 2026-04-08 | `scripts/weekly/market-research.sh` |

### Disabled (.yml.disabled)

| Workflow | Why |
|----------|-----|
| `campaign-newsletter.yml` | Paused |
| `captain-briefing.yml` | Paused |
| `morning-briefing.yml` | Replaced by DGX morning-emails.sh |
| `outreach-digest.yml` | Paused |
| `regulation-monitor.yml` | Paused |
| `social-scheduler.yml` | Paused |
| `weekly-report.yml` | Paused |
| `dependency_review.yml` | Paused |
| `ruff.yml` | Replaced by ruff-auto-fix.yml |
| `secret-scan-gitleaks.yml` | Covered by security-audit.sh |
| `test.yml` | Replaced by test-on-pr.yml |
| `deploy-scaleway_OLD.yml` | Deprecated |

## Cost Estimate

| Category | Monthly GHA minutes | Cost @ $0.008/min |
|----------|-------------------|-------------------|
| PR/push workflows (retained) | ~400-500 | $3.20-4.00 |
| DAST ZAP monthly | ~15 | $0.12 |
| Descheduled failover (skip checks) | 0 | $0.00 |
| **Total estimate** | **~415-515** | **$3.32-4.12** |

**Previous:** ~2,250 min/month = $18.00
**After this change:** ~500 min/month = ~$4.00
**Savings:** ~$14/month (78%)
