# Cloud-to-DGX Persistence Inventory

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/lane-d-dgx-persistence | Date: 27.09.2026 | Changes: Inventoried scheduled GitHub Actions and bot PR generators, ranked scheduled workflows by 30-day run count, and moved the top three to DGX-primary execution. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

Session Links & References:

- Work order: `.claude/handoffs/copilot-bonus-credits-2026-09-30.md`
- Pull request: https://github.com/blogtheristo/dws6/pull/2144
- View on GitHub: `https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-09-30-cloud-to-dgx-persistence-inventory.md`

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-27
- **Author:** GitHub Copilot CLI, on behalf of Lifetime Oy
- **Location:** DWS6 repository, isolated worktree
- **Context:** Copilot bonus-credit work order Lane D; persistent scheduled work must run on DGX rather than consume GitHub Actions schedules.

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Software > Infrastructure Operations
- **Entities:** DGX Spark, GitHub Actions, Dependabot, DWS Cost Policy
- **Systems:** `infrastructure/dgx-spark/day-runner.sh`, `scripts/daily/`, `scripts/weekly/`, `Cron-works.md`
- **Temporal Context:** 2026-Q3
- **Confidence:** High; workflow inventory is deterministic and run counts came from the GitHub Actions API.

## The Story

Lane D reviewed every active GitHub Actions schedule and every repository mechanism that autonomously opens a pull request. GitHub Actions run counts were queried for the 30-day window beginning 28.08.2026. Scheduled and event-driven activity were kept separate because event-driven automation cannot be replaced safely by a periodic shell script.

The three highest-volume scheduled migration candidates were `cost-audit-sync.yml` with 8 runs, `flake-detector.yml` with 5 runs in the exact window (6 all-time), and `dora-weekly.yml` with 3 runs. Their schedules are removed in the same change that registers the DGX scripts. Each workflow retains `workflow_dispatch` as a heartbeat-gated manual failover.

## Scheduled GitHub Actions inventory

| Workflow                       | Previous schedule (UTC)    | 30-day scheduled runs | Purpose                                      | DGX target                                         | Result                                                    |
| ------------------------------ | -------------------------- | --------------------: | -------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `cost-audit-sync.yml`          | Daily 02:00                |                     8 | Sync governed cost-audit records to Supabase | `scripts/daily/cost-audit-sync.sh`                 | Moved in Lane D                                           |
| `flake-detector.yml`           | Saturday 04:00             |                     5 | Run three shuffled Vitest suites             | `scripts/weekly/flake-detector.sh`                 | Moved in Lane D; now Sunday 04:00                         |
| `dora-weekly.yml`              | Monday 09:00               |                     3 | Generate and commit the DORA dashboard       | `scripts/weekly/dora-dashboard.sh`                 | Moved in Lane D; now Sunday 04:00                         |
| `dast-zap-scan.yml`            | First day monthly 03:00    |                     1 | OWASP ZAP baseline scan                      | Future host-level DGX Docker script                | Retained on GHA pending a Docker execution design         |
| `google-oauth-keepalive.yml`   | First day monthly 06:00    |                     1 | Refresh the Google OAuth token               | Future self-gated `scripts/daily/` script          | Deferred by run-count ranking                             |
| `public-truth-drift-audit.yml` | Sunday 04:20               |                     0 | Fail over the weekly truth-drift audit       | `scripts/weekly/public-truth-drift-audit.sh`       | Already DGX-primary; retained as heartbeat-gated failover |
| `quarterly-mgd-recheck.yml`    | Quarterly, first day 06:00 |                     0 | Fail over the quarterly MGD game re-check    | `scripts/daily/mgd-game-recheck-quarterly-gate.sh` | Already DGX-primary; retained as heartbeat-gated failover |

## Bot pull-request generator inventory

| Mechanism                                    | Trigger                                                             | Pull request produced           | DGX target                                                                                         | Result                                                               |
| -------------------------------------------- | ------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `.github/dependabot.yml`                     | Weekly Dependabot schedules across npm, pip, and Actions ecosystems | Dependency and security updates | GitHub-native service; `scripts/daily/dependabot-audit.sh` remains the independent DGX audit layer | Retained because Dependabot is the source of upstream update PRs     |
| `.github/workflows/agents-md-sync.yml`       | Path-filtered push to `main` or manual dispatch                     | Regenerated `AGENTS.md`         | Event-driven DGX webhook/service would be required                                                 | Retained; periodic polling would lose push context                   |
| `.github/workflows/campaign-daily-posts.yml` | Manual dispatch only                                                | Campaign-content pull request   | `scripts/daily/generate-campaign-post.sh` generates the DGX-primary content                        | Retained as a human-triggered failover; publishing remains HIC-gated |

`pr-auto-merge.yml` was also reviewed because it produced more than 1,600 event-driven runs in the window. It does not open pull requests and is triggered by `check_suite` and labels, so replacing it requires a DGX webhook receiver rather than cron. That is a separate architecture item and was not mixed into Lane D.

## The Insight

A schedule can move to DGX only when its execution semantics remain explicit. Folder auto-discovery changes both location and cadence: the two weekly jobs now run in the Sunday DGX window rather than on their former Saturday and Monday slots. The inventory records that behavior change rather than presenting the migration as infrastructure-only.

## Learning Outcome Status

1. **KB:** N/A — the operational registry and this field note are the canonical records.
2. **Field note:** Complete.
3. **Learn HTML:** Generated from this note.
4. **Drive export:** N/A — no Drive write tool is available in this session.
5. **HIC decision:** N/A — the work order already selected Lane D and the top-three-by-run-count rule.
6. **Calendar:** N/A — schedules are code-managed operational commitments.

## Next Steps

- Verify the first Sunday DGX executions in `logs/flake-detector.log` and `logs/dora-dashboard.log`.
- Design the ZAP scan as a host-level DGX Docker job before removing its monthly GitHub Actions schedule.
- Treat `pr-auto-merge.yml` as an event-routing optimization, not a cron migration.

---

Version 1.0 · 27.09.2026
Copyright © 2026 Lifetime Oy
Classification: INTERNAL
