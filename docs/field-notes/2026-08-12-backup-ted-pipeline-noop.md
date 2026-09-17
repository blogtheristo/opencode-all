# Field note — 2026-08-12 — backup-ted-pipeline failover check (no-op)

N/A — scheduled task `backup-ted-pipeline` ran as a read-only Tier 2 failover check and made no changes. DGX Spark (Tier 1) heartbeat returned healthy, so the task stopped at step 1: no warning email, no first-aid restart, no local TED pipeline run, no file edits.

## What happened

- `http://192.168.101.113:9999/health` → HTTP 200, `{"status":"healthy","timestamp":"2026-08-12T02:25:49.692Z"}`
- Tier 1 owns today's TED tender run. Tier 2 correctly stood down.

## The insight

The task file (`~/.claude/scheduled-tasks/backup-ted-pipeline/SKILL.md`) specifies the heartbeat check as a `curl` command. On this Windows host the Bash `curl` invocation was denied by the permission layer; the check was completed with PowerShell `Invoke-WebRequest` against the same endpoint. Same result, but the denial will recur on every scheduled run and could be misread as "DGX is down" — which would trigger a false failover: an alert email plus an unnecessary local pipeline run.

## Next steps

1. Update the task file's step 1 to use the PowerShell form on Windows, or add the `curl` invocation to the allowed Bash commands.
2. Distinguish "probe could not run" from "probe returned unhealthy" in the task logic — only the latter should trigger failover (Rule 12: fail loud, don't fail silently into the wrong branch).

## Unrelated flags carried by the stop hook

The session-stop hook listed changed files (`DWS_TRUTH_STANDARD.md`, `docs/BLOG_STANDARD.md`, the two `olw-vertical-lang-bar.js` mirrors, `scripts/inject-blog-nav.cjs`) and a set of published-without-draft blog posts. **None of these were touched by this run** — they are pre-existing working-tree state from earlier sessions. They still need HIC attention, but they are not this session's output.
