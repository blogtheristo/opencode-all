---
name: daily-task-manager
description: >
  Use to surface today's task queue for the founder — pulls from open PRs,
  unanswered review comments, INTRO_*.md follow-ups, stale wiki entries, and
  the `signal-detector` top signals. Returns an ordered list with effort
  estimates. Not a calendar tool — see the Calendar MCP for time blocking.
argument-hint: "optional --persona=ceo|founder|engineer; default founder"
allowed-tools: [Bash, Read, Grep]
track: gbrain
triggers:
  - "today's tasks"
  - "what should i work on"
  - "task queue"
  - "founder todo"
  - "ceo queue"
reads-pages:
  - kb/wiki/signals/**
  - kb/raw/articles/INTRO_*.md
writes-pages:
  - kb/raw/signals/<YYYY-MM-DD>-tasks.md
---

# Daily Task Manager

**One ordered list. No buckets, no kanban.** Founder-grade focus.

Based on `daily-task-manager` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/daily-task-manager).
**Source pin:** garrytan/gbrain @ VERSION 0.46.23.0, observed 2026-08-20 (see docs/field-notes/2026-08-20-external-skill-provenance-audit.md).

## Sources (in priority order)

1. PRs where you are tagged or your branch is behind `main`.
2. Review comments awaiting reply > 24h.
3. Investor INTRO\_\*.md in `ready` state (per `/investor-outreach`).
4. `signal-detector` items at severity `high`.
5. Regulatory-radar items with deadline < 30 days.
6. Stale wiki articles (`kb/wiki/_stale.md`).

## Persona modifier

- `--persona=ceo` — prioritise items 3 (investors), 4 (signals), 5 (regulatory).
- `--persona=engineer` — prioritise items 1 (PRs), 2 (review threads), 6 (kb).
- `--persona=founder` (default) — interleave; cap at 7 items.

## Output

```json
{
  "tasks": [
    {
      "rank": 1,
      "source": "pr-review-thread",
      "ref": "#1287",
      "effort": "15m",
      "next": "/review #1287"
    },
    {
      "rank": 2,
      "source": "investor",
      "ref": "INTRO_DOE_ACME.md",
      "effort": "10m",
      "next": "/investor-outreach followup"
    }
  ]
}
```

## When NOT to use

- Calendar / time-blocking — that's the Calendar MCP.
- Long-horizon planning — that's `/plan-ceo-review`.
