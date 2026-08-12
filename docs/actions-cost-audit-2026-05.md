# GitHub Actions Cost Audit — May 2026

**Trigger:** Hit 100% (3,000 / 3,000 min) of the included Actions allowance with 18 days left in the cycle (reset 2026-06-01).

**Goal:** Cut monthly minute consumption by routing scheduled jobs to DGX Spark (already running 24/7) and tightening the heaviest per-PR / per-push workflows.

**Branch:** `claude/investigate-actions-overages-5bavI`

---

## Strategy

Three coordinated levers:

1. **DGX Spark failover wrap** for scheduled workflows whose logic already runs (or now runs) on DGX Spark cron. Workflows keep their `schedule:` trigger but exit in <10s when the DGX heartbeat reports healthy — full automatic fallback if DGX dies.
2. **Per-PR / per-push tightening** for AI workflows that cannot move to DGX (event-driven by GitHub). Added `paths-ignore`, `concurrency: cancel-in-progress`, and draft-PR skips.
3. **Cron-frequency reduction** for workflows that genuinely cannot move (DAST/ZAP needs Docker-in-Docker).

Migration mode chosen: **safe failover wrapper** (not "delete schedule"). DGX dying does not produce a silent gap.

---

## Changes shipped

### Group A: failover-check wrap on workflows DGX already runs

| Workflow | DGX command | Est. minutes saved/month |
|---|---|---|
| `agents-md-freshness.yml` | `node scripts/verify-agents-md.mjs` | ~20 |
| `golden-principle-scan.yml` | `node scripts/golden-principle-check.mjs` | ~15 |
| `security-audit-enhanced.yml` (scheduled only — push triggers preserved) | `npm audit --json` | ~30 |
| `quarterly-price-list.yml` | `scripts/daily/price-list-quarterly-gate.sh` | ~5 |

### Group B: new DGX scripts + cron-runner.ts entries + GHA wrap

| Workflow | New DGX script | DGX cron-runner entry | Est. minutes saved/month |
|---|---|---|---|
| `housekeeping-weekly.yml` | `scripts/weekly/housekeeping-audit.sh` (new) | `0 3 * * 0` | ~5 |
| `ted-pipeline.yml` | `scripts/daily/ted-pipeline.sh` (new wrapper around `scripts/ted-daily-pipeline.ts`) | `0 6 * * *` | **~300–450** |
| `ted-followup.yml` | `scripts/daily/ted-followup.sh` (new wrapper around `scripts/ted-followup.ts`) | `30 7 * * *` | **~240–360** |
| `ted-learning-weekly.yml` | `scripts/weekly/ted-learning.sh` (new wrapper around `scripts/ted-learning-weekly.ts`) | `15 8 * * 1` | ~15 |
| `daily-mvp-audit.yml` | `scripts/daily/mvp-audit.sh` (new, full port of the inline shell logic) | `0 2 * * *` (day-runner.sh handles once-per-day de-dup) | ~60–90 |

### Group C: per-PR / per-push tightening (cannot move to DGX)

| Workflow | Changes | Est. minutes saved/month |
|---|---|---|
| `ai-pr-review.yml` | Added `paths-ignore` (\*\*.md, docs, Store, Learn); `concurrency.cancel-in-progress`; draft-PR skip | ~100–150 |
| `claude-auto-fix.yml` | Added `paths-ignore`; `concurrency.cancel-in-progress`; draft-PR skip | **~250–400** |
| `copilot-preflight.yml` | Added `paths-ignore`; `concurrency.cancel-in-progress` | ~40–80 |
| `deploy-cloudrun.yml` | Added `paths` filter (src/Dockerfile/package.json only); `concurrency.cancel-in-progress` | ~50–100 |

### Group D: schedule reduction (cannot run on DGX)

| Workflow | Change | Est. minutes saved/month |
|---|---|---|
| `dast-zap-scan.yml` | Weekly cron → monthly (1st of month); added `concurrency.cancel-in-progress` for PR runs; PR-trigger half unchanged (already paths-filtered) | ~60–90 |

### Total projected monthly savings

**Lower bound:** ~1,100 min/month
**Upper bound:** ~1,700 min/month

Even at the lower bound, this brings projected steady-state consumption to ~1,300–1,900 min/month, comfortably under the 3,000-min cap.

---

## Prerequisite: configure `DGX_SPARK_HEARTBEAT_URL` repo variable

**Status: assumed not set** (cannot verify via GitHub MCP).

The composite action at `.github/actions/dgx-failover-check/action.yml` defaults to `dgx_alive=false` when the URL is empty. That means **until this variable is set, the wrapped workflows still run on GitHub Actions as before**.

To activate savings:

1. Visit `https://github.com/blogtheristo/dws6/settings/variables/actions`.
2. Add a repository **variable** (not a secret — the URL is non-sensitive):
   - Name: `DGX_SPARK_HEARTBEAT_URL`
   - Value: the public URL of the DGX Spark heartbeat service (Cloudflare Tunnel pointing to port 9999 on the DGX). The action appends `/health` automatically.
3. Verify with `curl ${DGX_SPARK_HEARTBEAT_URL}/health` from any external machine — should return HTTP 200 + `{ "status": "healthy" }`.

---

## Verification plan

After merge and `DGX_SPARK_HEARTBEAT_URL` is set:

1. **Per-workflow smoke test.** Trigger one wrapped workflow manually (e.g. `gh workflow run agents-md-freshness.yml`). Expected output: `"DGX Spark is ALIVE — this workflow is FAILOVER only"` followed by the gated steps being skipped. Total billable time: <0.1 min.
2. **DGX side.** SSH `admin100@192.168.101.113` and `curl http://localhost:8081/status` — verify the new jobs (`daily-mvp-audit`, `ted-pipeline`, `ted-followup`, `ted-learning-weekly`, `housekeeping-weekly`) appear in the registry. Tail `/app/logs/cron-executions.jsonl` after the next scheduled time per job.
3. **Heartbeat reachable from public.** Curl `${DGX_SPARK_HEARTBEAT_URL}/health` from a non-LAN network — must return 200.
4. **PR tightening smoke test.** Open a draft PR touching only `*.md` files; confirm `ai-pr-review.yml` and `claude-auto-fix.yml` do NOT trigger. Push a `src/**` change and confirm they DO trigger.
5. **Billing.** Watch GitHub → Settings → Billing → Actions usage over 24h. With DGX alive + heartbeat URL set, accrual on scheduled workflows should drop ≥80% and on PR-driven workflows ~30–50%.

---

## Deferred / follow-up work

Tracked here so it's not lost.

### Python-on-DGX (blocks 2 workflows)

`security-scan-weekly.yml` and `monthly-security-audit-enhanced.yml` need Python 3 + project deps, which the DGX `node:22-slim` cron container does not have. Estimated savings if migrated: ~90–130 min/month.

To unblock: update `infrastructure/dgx-spark/Dockerfile.cron` to install `python3 python3-venv python3-pip`, create a `requirements.txt` for the scanners (zenfree, etc.), and add the entries to `cron-runner.ts` with `enabled: true`. Rebuild + redeploy the `dws-cron` container.

### Heavy-github-script ports

`roadmap-weekly-tracker.yml` and `biweekly-auth-security-audit.yml` use extensive `actions/github-script@v7` logic (issue creation, PR counting, label management). Porting requires rewriting that logic against `gh` CLI or `gh api`. Combined estimated savings: ~15–20 min/month — low ROI for the effort, deferred.

### Disabled workflows still in tree

`.github/workflows/*.disabled` files are not consuming minutes but contribute to repository clutter. Decide whether to delete or restore each. Not addressed in this PR.

### Variable verification automation

The GitHub MCP server exposed to this session does not include a tool to list Actions variables. A small follow-up could add a Cloud Build / DGX cron that asserts `DGX_SPARK_HEARTBEAT_URL` is set and pages a Slack channel if not — preventing silent regression where someone unsets the var and the failover wrap stops saving minutes.

---

## Files changed

**New scripts (DGX Spark primary):**
- `scripts/daily/mvp-audit.sh`
- `scripts/daily/ted-pipeline.sh`
- `scripts/daily/ted-followup.sh`
- `scripts/weekly/housekeeping-audit.sh`
- `scripts/weekly/ted-learning.sh`

**Modified registry:**
- `infrastructure/dgx-spark/cron-runner.ts` — added 5 job entries (daily-mvp-audit, ted-pipeline, ted-followup, ted-learning-weekly, housekeeping-weekly)

**Workflows wrapped with `dgx-failover-check`:**
- `.github/workflows/agents-md-freshness.yml`
- `.github/workflows/golden-principle-scan.yml`
- `.github/workflows/security-audit-enhanced.yml` (scheduled-run only)
- `.github/workflows/quarterly-price-list.yml`
- `.github/workflows/housekeeping-weekly.yml`
- `.github/workflows/ted-pipeline.yml`
- `.github/workflows/ted-followup.yml`
- `.github/workflows/ted-learning-weekly.yml`
- `.github/workflows/daily-mvp-audit.yml`

**Workflows tightened (paths / concurrency / draft skip):**
- `.github/workflows/ai-pr-review.yml`
- `.github/workflows/claude-auto-fix.yml`
- `.github/workflows/copilot-preflight.yml`
- `.github/workflows/deploy-cloudrun.yml`

**Workflows with schedule reduced:**
- `.github/workflows/dast-zap-scan.yml` (weekly → monthly)

---

## Rollback

Every change is independently reversible. Worst case: revert this PR's commit and the prior behavior is fully restored. The new DGX scripts are harmless to leave in place even if their cron-runner entries are disabled.
