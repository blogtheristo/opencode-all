---
name: cron-scheduler
description: >
  Use to register, list, or remove scheduled tasks in the DWS6 scheduler
  paths (`scripts/daily`, `scripts/weekly`, `scripts/hourly`, `scripts/on-deploy`).
  Per CLAUDE.md Script Automation Rule — no human-memory-dependent scripts;
  every recurring action must live in one of those folders.
argument-hint: "list | add <script> <cadence> | remove <script>"
allowed-tools: [Bash, Read, Write, Glob]
track: gbrain
triggers:
  - "schedule this"
  - "run weekly"
  - "run daily"
  - "register a cron"
  - "list scheduled jobs"
  - "remove cron"
reads-pages:
  - scripts/daily/**
  - scripts/weekly/**
  - scripts/hourly/**
  - scripts/on-deploy/**
writes-pages:
  - scripts/daily/**
  - scripts/weekly/**
  - scripts/hourly/**
  - scripts/on-deploy/**
---

# Cron Scheduler — DWS6 Recurring Tasks

**Folder = cadence.** No external cron table; the runner discovers files in
the folder and runs them on its cadence.

Based on `cron-scheduler` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/cron-scheduler).

## Cadences

| Folder               | Cadence     | Notes                               |
| -------------------- | ----------- | ----------------------------------- |
| `scripts/hourly/`    | every hour  | Keep idempotent and fast (< 30s)    |
| `scripts/daily/`     | once a day  | E.g. `kb-cleanup.sh` runs from here |
| `scripts/weekly/`    | once a week | Heavier — wiki maintenance, reports |
| `scripts/on-deploy/` | per deploy  | Migrations, cache warm-ups          |

## Subcommands

- `list` — calls `node skills/cron-scheduler/scripts/list-jobs.mjs`,
  returns a JSON inventory grouped by cadence.
- `add <script> <cadence>` — moves the script file (must already exist) into
  the chosen cadence folder. Refuses if `<cadence>` is not one of the four above.
- `remove <script>` — moves the script out into `scripts/_disabled/` rather than
  deleting (per CLAUDE.md no-destructive rule, prefer rename-to-\_OLD style).

## PowerShell-first examples (Windows)

```powershell
# List jobs
node .\skills\cron-scheduler\scripts\list-jobs.mjs

# Add a job
Move-Item .\new-script.ps1 .\scripts\weekly\new-script.ps1
```

## Output

```json
{ "action": "add", "script": "scripts/weekly/kb-maintain.sh", "cadence": "weekly" }
```
