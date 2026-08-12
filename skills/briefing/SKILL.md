---
name: briefing
description: >
  Use at the start of a working session to get a 60-second DWS briefing —
  what changed since last login (commits, PRs, CI, regulatory deltas),
  what's blocked, what `signal-detector` flagged, and the recommended next
  three skills to run.
argument-hint: "optional --since=<ISO date>; default: last 24h"
allowed-tools: [Bash, Read, Grep]
track: gbrain
triggers:
  - "morning briefing"
  - "what's new"
  - "since yesterday"
  - "where did we leave off"
  - "daily briefing"
  - "session start summary"
reads-pages:
  - kb/wiki/signals/**
  - kb/wiki/reports/**
  - .claude/hooks/audit/**
writes-pages:
  - kb/raw/signals/<YYYY-MM-DD>-briefing.md
---

# Briefing — Founder's 60-second Wake-up

**Returns a structured wake-up packet, not a wall of text.** Designed to be
read in one breath before opening the IDE.

Based on `briefing` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/briefing).

## Output sections (in order)

1. **Branches & PRs** — open PRs, CI red/green, unanswered review threads.
2. **Commits since** — last N commits on `main` and any active feature branch.
3. **Signals** — top 3 from `signal-detector` (cron, mirror drift, kb staleness).
4. **Regulatory** — any `/regulatory-radar` delta in the last 7 days.
5. **Investors** — INTRO\_\*.md items in `ready` or `followup` state.
6. **Today's pick** — single recommended skill to invoke first.

## Steps

1. Read git log: `git log --since="$SINCE" --oneline --branches`.
2. Use `mcp__github__list_pull_requests` to enumerate open PRs in
   `blogtheristo/dws6`; mark CI status.
3. Invoke `signal-detector` (read-only — do not write signals).
4. Read latest regulatory-radar output from `kb/wiki/signals/`.
5. Read `investor-outreach` queue via existing skill.
6. Compose the briefing in ≤ 30 lines of markdown.

## Output

```json
{
  "windowHours": 24,
  "openPRs": 3,
  "ciRed": 1,
  "topSignal": "cron-drift",
  "topNext": "/kb lint"
}
```
