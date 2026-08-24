---
name: reports
description: >
  Use as the single entry point for DWS6 report generation — delegates to the
  existing `firehorse-report-annual`, `firehorse-report-board-pack`,
  `firehorse-report-carbon`, and `firehorse-report-compliance` skills. Does
  not reimplement reporting; just routes.
argument-hint: "annual | board-pack | carbon | compliance; followed by report-specific args"
allowed-tools: [Read, Bash]
track: gbrain
triggers:
  - "generate report"
  - "run the report"
  - "annual report"
  - "board pack"
  - "compliance report"
  - "carbon report"
reads-pages:
  - skills/firehorse-report-annual/SKILL.md
  - skills/firehorse-report-board-pack/SKILL.md
  - skills/firehorse-report-carbon/SKILL.md
  - skills/firehorse-report-compliance/SKILL.md
writes-pages: []
---

# Reports — Gbrain → Firehorse Bridge

**Pure router.** Picks the right `firehorse-report-*` skill based on the
first positional argument.

Based on `reports` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/reports).
**Source pin:** garrytan/gbrain @ VERSION 0.46.23.0, observed 2026-08-20 (see docs/field-notes/2026-08-20-external-skill-provenance-audit.md).

## Routing table

| First arg    | Delegates to                         |
| ------------ | ------------------------------------ |
| `annual`     | `skills/firehorse-report-annual`     |
| `board-pack` | `skills/firehorse-report-board-pack` |
| `carbon`     | `skills/firehorse-report-carbon`     |
| `compliance` | `skills/firehorse-report-compliance` |

If the first arg is missing or unknown, list the four options and exit.

## When NOT to use

- Ad-hoc one-pager — write it inline; reports are for canonical formats only.
- Investor brief — use `/investor-outreach`.
- Daily briefing — use `briefing`.
