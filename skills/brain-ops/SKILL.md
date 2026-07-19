---
name: brain-ops
description: >
  Top-level dispatcher for the DWS6 gbrain track. Use when the user asks an
  open question that could land in `ingest`, `query`, `enrich`, `maintain`,
  `briefing`, or `signal-detector` but hasn't named one — brain-ops picks the
  right child skill. Also the entry point for "brain status" and "what does
  the brain say about X".
argument-hint: "natural-language brain request"
allowed-tools: [Read, Grep, Glob, Bash]
track: gbrain
triggers:
  - "brain ops"
  - "what does the brain"
  - "brain status"
  - "ask the brain"
  - "what do we know about"
  - "second brain"
reads-pages:
  - skills/RESOLVER.md
  - kb/kb.json
  - kb/wiki/_index.md
writes-pages: []
---

# Brain-Ops — Gbrain Track Dispatcher

**Thin harness, fat skills.** This skill does not answer questions itself — it
reads `skills/RESOLVER.md`, classifies the request, and hands off to a child
skill in the gbrain track.

Based on `brain-ops` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/brain-ops).

## Dispatch table

| Request shape                                    | Hand off to            |
| ------------------------------------------------ | ---------------------- |
| "Add this file/URL/note to the brain"            | `ingest`               |
| "What do we know about X"                        | `query` (or `/kb ask`) |
| "Link these facts" / "auto-link after ingest"    | `enrich`               |
| "Clean up the brain" / "fix broken refs"         | `maintain`             |
| "Daily briefing" / "what should I look at today" | `briefing`             |
| "Anything unusual" / "what's drifting"           | `signal-detector`      |
| "Audit founder/CEO voice" / "soul check"         | `soul-audit`           |
| "Run the firehorse / annual / board pack"        | `reports`              |
| "Schedule X to run weekly"                       | `cron-scheduler`       |
| "Create a new skill"                             | `skill-creator`        |
| "Validate the skill registry"                    | `skillpack-check`      |
| "Fix the citations in this draft"                | `citation-fixer`       |
| "Show today's tasks"                             | `daily-task-manager`   |

If two child skills match, prefer the more specific one. If none match, fall
back to `/kb ask` with the verbatim user request.

## Output contract

Return the name of the child skill you dispatched to and the structured input
you passed. Never answer the question directly from inside brain-ops.

```json
{
  "dispatchedTo": "query",
  "input": { "question": "what does CSRD say about SMEs" }
}
```
