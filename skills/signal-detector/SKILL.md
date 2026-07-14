---
name: signal-detector
description: >
  Use when something looks unexpected in the repo or its operational signals —
  a failing cron job, drift between a root site folder and its landing-pages
  mirror, a stale wiki article, a new regulatory deadline, an opened CRITICAL
  PR comment, or an investor INTRO_*.md going untouched. Surfaces the anomaly,
  classifies severity, and proposes the next skill to invoke.
argument-hint: "optional scope hint, e.g. 'cron', 'dual-folder', 'kb', 'pr', 'investors'"
allowed-tools: [Bash, Read, Grep, Glob]
track: gbrain
triggers:
  - "anything unusual"
  - "what's broken"
  - "signal check"
  - "anomaly"
  - "what should i look at"
  - "weekly signal scan"
reads-pages:
  - scripts/daily/**
  - scripts/weekly/**
  - scripts/hourly/**
  - scripts/on-deploy/**
  - kb/wiki/_stale.md
  - kb/wiki/signals/**
  - .claude/hooks/audit/**
writes-pages:
  - kb/raw/signals/<YYYY-MM-DD>-<slug>.md
---

# Signal Detector — Always-on Anomaly Surface

**Find what's drifting before it bites.** Runs across the repo's operational
signals (cron status, dual-folder mirrors, wiki staleness, PR queue, investor
INTRO age, audit log spikes) and surfaces the top-3 things a founder should
know about _right now_.

Based on `signal-detector` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/signal-detector).

## What it checks (in order)

1. **Cron health** — any `scripts/{daily,weekly,hourly,on-deploy}/*.sh` that
   recorded a failure in the last 24h (look in `.claude/hooks/audit/` or the
   script's local log).
2. **Dual-folder drift** — `git diff --stat` between each root folder and its
   `landing-pages/` mirror for `dws6.com`, `dws10.com`, `onelifetime.world`,
   `lifetime.fi`. Per CLAUDE.md, these must stay in lockstep.
3. **KB staleness** — read `kb/wiki/_stale.md`; any article > 30 days unaudited.
4. **PR queue** — any open PR with an unanswered review thread > 48h
   (use `mcp__github__list_pull_requests` and `mcp__github__pull_request_read`).
5. **Investor queue** — any `INTRO_*.md` (see `/investor-outreach`) without an
   update in 14+ days.
6. **Regulatory pulse** — last `/regulatory-radar` run timestamp > 7 days.

## Output

```json
{
  "signals": [
    {
      "id": "cron-drift",
      "severity": "high",
      "detail": "scripts/daily/kb-cleanup.sh failed 3x",
      "suggest": "/kb lint"
    },
    {
      "id": "mirror-drift",
      "severity": "medium",
      "detail": "dws10.com/index.html ahead of landing-pages by 4 commits",
      "suggest": "/fix-dual-folder-api-connectivity or manual sync"
    },
    {
      "id": "stale-wiki",
      "severity": "low",
      "detail": "12 wiki articles > 30d",
      "suggest": "/kb compile"
    }
  ],
  "topNext": "/kb lint"
}
```

## When NOT to use

- Acute incidents — go straight to the relevant skill (`/kb lint`, manual sync).
- Code review of a specific PR — use `/review`.
- Deep KB query — use `/kb ask`.
