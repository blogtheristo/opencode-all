# /cron — Scheduled Work Manager

Manage, audit, and troubleshoot all scheduled work across DGX Spark (primary),
Claude Code Routines (cloud backup), and GitHub Actions (manual failover).

## Trigger Phrases

`/cron`, `/cron status`, `/cron audit`, `/cron add <name>`, `/cron move <workflow>`, `/cron cost`, `/cron backup`

## Parameters

- `ACTION` — `status` (default) | `audit` | `add` | `move` | `cost` | `list` | `backup`
- `TARGET` — workflow or script name (for `add` / `move`)

## Procedure

### `/cron` or `/cron status`

1. Read `Cron-works.md` for the registry.
2. Check DGX Spark heartbeat status if accessible.
3. Show summary: how many daily/weekly/hourly scripts, how many GHA workflows retained, estimated monthly cost.

### `/cron audit`

1. Read `Cron-works.md`.
2. Scan `.github/workflows/*.yml` for any remaining `schedule:` triggers.
3. Cross-reference `scripts/daily/` and `scripts/weekly/` against the registry.
4. Report:
   - Workflows with schedule triggers not in registry.
   - Scripts in daily/weekly folders not in registry.
   - Registry entries pointing to missing scripts.
   - GHA cost estimate based on retained scheduled workflows.

### `/cron add <name>`

1. Ask: daily, weekly, or hourly?
2. Create script in `scripts/{frequency}/{name}.sh` following the pattern of existing scripts (shebang, set -uo pipefail, REPO_ROOT, echo start/done).
3. If a matching GHA workflow exists, remove its `schedule:` trigger and add removal comment.
4. Update `Cron-works.md` with the new entry.

### `/cron move <workflow>`

1. Read the named `.github/workflows/<workflow>.yml`.
2. Extract what the workflow does (steps, env vars, commands).
3. Create equivalent DGX script in `scripts/daily/` or `scripts/weekly/`.
4. Remove `schedule:` from the workflow, keep `workflow_dispatch:`.
5. Update `Cron-works.md`.

### `/cron cost`

1. Count GHA workflows that still have `schedule:` triggers.
2. Estimate monthly minutes based on frequency and typical run duration.
3. Calculate cost at $0.008/min (Linux runner).
4. Compare to budget target ($10/month).

### `/cron backup`

Review the three-tier backup architecture:

1. Read the "Claude Code Routines" section in `Cron-works.md`.
2. List the 5 critical jobs that should have Routine backups.
3. Check whether `/schedule list` shows them as configured.
4. Report gaps: which routines are missing, misconfigured, or inactive.
5. Suggest `/schedule` commands to create missing routines.

Tier architecture:
- **Tier 1:** DGX Spark cron (primary, free, 24/7)
- **Tier 2:** Claude Routines (automated cloud backup, subscription usage)
- **Tier 3:** GHA workflow_dispatch (manual failover, $0.008/min)

Claude Code scheduling options (from docs):
- **Routines** (`/schedule`): Anthropic cloud, survive laptop off, min 1h interval, API+schedule+GitHub triggers
- **Desktop Scheduled Tasks**: local machine, need app open, min 1min interval, local file access
- **`/loop`**: session-scoped, dies on session end, for live monitoring only

## Output

Structured summary with tables. For `audit`, flag any inconsistencies as actionable items.

## Quality Gate

- Every scheduled script must appear in `Cron-works.md`.
- No `schedule:` trigger in GHA without a documented reason (e.g., Docker-in-Docker).
- DGX scripts must follow the `set -uo pipefail` + `REPO_ROOT` pattern.
- Critical jobs (db-backup, ted-pipeline, morning-briefing, security-audit, construction-leads) must have a Claude Routine backup listed in `Cron-works.md`.
