---
name: clawdbot
description: "Session janitor. Mines ~/.claude/projects transcripts for unfinished work, builds per-session continuation plans, resumes only after HIL approval."
argument-hint: "scan | list | status | next | dismiss <id> | done <id>"
allowed-tools: [Bash, Read, Edit, Write]
---

# Clawdbot — Session Janitor Skill

**Domain:** Continuation of unfinished Claude Code work across sessions, with
human-in-the-loop (HIL) approval before any resumed work executes.

**Entry point (slash command):** `/clawdbot`
**Scanner CLI:** `node scripts/clawdbot-scan.mjs`
**Queue location:** `.claude/clawdbot/queue/<short-id>.md`
**State:** `.claude/clawdbot/state.json`

## What this skill does

1. **Scans** every transcript under `~/.claude/projects/-home-user-dws6/*.jsonl`.
2. **Digests** each one into: original ask, last user message, last assistant
   message, pending `TodoWrite` items, files touched, branch, timestamps.
3. **Classifies** sessions with `hasPending` = true when any of:
   - Last `TodoWrite` call still has `pending` or `in_progress` items
   - Last assistant message contains follow-up phrasing ("next step", "would you
     like", "should I", "follow-up", "remaining", "TODO", "not yet", "to do",
     "continue", "pending")
4. **Writes** one Markdown plan per pending session to
   `.claude/clawdbot/queue/<short-id>.md`. The plan is self-contained — copy-paste
   into a fresh Claude Code session and it works as the first prompt.
5. **Pauses for HIL** approval before any resumed work runs. Plan mode is the
   recommended way to launch the follow-up session.

## Trust boundary (per .claude/hooks)

- **Scanning** is GREEN: read-only over `~/.claude/projects`, writes confined to
  `.claude/clawdbot/`.
- **Resuming** queued work may touch any zone — GREEN/YELLOW/RED. Approval per
  item is mandatory; the slash command does not auto-execute.

## State machine

```
discovered  ──scan──▶  pending  ──resume──▶  (work runs in a session)  ──done
                            │
                            └──dismiss──▶  dismissed
```

`state.json` schema:

```json
{
  "sessions": {
    "<full-session-uuid>": {
      "status": "pending|dismissed|done",
      "shortId": "<first 8 chars>",
      "queueFile": ".claude/clawdbot/queue/<short>.md",
      "branch": "claude/...",
      "lastTs": "ISO-8601",
      "summary": "first user prompt, trimmed",
      "markedAt": "ISO-8601"
    }
  }
}
```

## CLI surface

| Command                                           | Purpose                                                                                                                                                                                                                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node scripts/clawdbot-scan.mjs`                  | Scan transcripts, write queue files, update state.                                                                                                                                                                         |
| `… --list`                                        | Print pending queue items as JSON (newest first).                                                                                                                                                                          |
| `… --status`                                      | Print summary counts (pending / dismissed / done).                                                                                                                                                                         |
| `… --dismiss <id>`                                | Mark a queue item dismissed (short id or full uuid).                                                                                                                                                                       |
| `… --done <id>`                                   | Mark a queue item done.                                                                                                                                                                                                    |
| `… --preview <id>`                                | Classify a queue item's trust zone (GREEN/YELLOW/RED) from its files-touched list, without executing.                                                                                                                      |
| `… --enrich <id> [--model M] [--dry-run]`         | LLM-pass via `scripts/ollama-spark.sh` (default model `llama3.1:70b`). Appends a `## LLM Digest` section with `{summary, proposed_next, blockers, risk_notes}` JSON to the queue file. `--dry-run` prints the prompt only. |
| `… --dream-prune [--lookback-days N]`             | Pure-grep skill usage scan across transcripts (default 90 days). Writes `.claude/clawdbot/proposals/archival-<date>.md` listing unused skills as candidates for `_OLD` rename. No LLM.                                     |
| `… --dream-curate [--dry-run]`                    | LLM clusters recurring corrections from queue summaries into memory notes + CLAUDE.md edit proposals. Output: `.claude/clawdbot/proposals/curate-<date>.md`.                                                               |
| `… --dream-propose [--min-cluster N] [--dry-run]` | LLM drafts candidate `skills/<name>/SKILL.md` + slash command when ≥N (default 3) pending queue items share a verb/file cluster. Output: `.claude/clawdbot/proposals/skill-<name>.md`.                                     |
| `… --max-age <N>`                                 | Ignore sessions older than N days (default 30).                                                                                                                                                                            |

## Heuristics & caveats

- **Live-session skip** (so the scanner doesn't queue the running session):
  1. `CLAUDE_SESSION_ID` env var if set, else
  2. `--exclude <id>` flags (short or full id), else
  3. The newest `.jsonl` modified within `--live-window` seconds (default 300)
     is treated as live and skipped.
     The scan output reports which session was treated as live under
     `liveSession.{id, source}` and counts it under `skippedLive`.
- Follow-up phrasing is regex-based and may false-positive on conversational
  text. Dismiss freely — the scanner is idempotent.
- `--max-age` defaults to 30 days. Older sessions are skipped silently
  (counted under `skippedStale`).

## Productization checklist (per CLAUDE.md "Agent Productization Rule")

- [x] CLI command path: `node scripts/clawdbot-scan.mjs`
- [x] Structured JSON output: `--list`, `--status`, `--preview` emit JSON
- [x] Skill registered: this file
- [x] Slash command: `.claude/commands/clawdbot.md`
- [x] Scheduler hook: `scripts/daily/clawdbot-digest.sh` (auto-discovered by
      `day-runner.sh`; writes daily digest to `logs/clawdbot-digest-*.json`)
- [ ] MCP exposure: not yet (local-only, reads sensitive transcripts)

## Examples

```
/clawdbot scan
/clawdbot list
/clawdbot next
/clawdbot preview 0e2e931a
/clawdbot enrich 0e2e931a
/clawdbot dismiss 0e2e931a
/clawdbot done 0e2e931a
/clawdbot dream-prune
/clawdbot dream-curate
/clawdbot dream-propose
```

## Firehorse Dreaming — "offline reflection" architecture

The three `--dream-*` modes plus the `/promote-proposal` skill that consumes
their output are collectively branded **Firehorse Dreaming**. (Same naming
convention as `firehorse-report-*` in this repo: Firehorse is the umbrella,
clawdbot is the worker.) When you see "Firehorse Dreaming" in customer-facing
copy or PRs, this is what it means.

Functionally: these modes look at the population of transcripts/queue items
and propose changes to the repo itself. **None auto-apply.** Everything lands
in `.claude/clawdbot/proposals/` for HIL review and promotion via
`/promote-proposal`.

Parallel to Anthropic's `POST /v1/dreams` managed-runtime primitive (research
preview, 2026-04-21 beta); same idea, different substrate. See
`.claude/clawdbot/memory/clawdbot-architecture.md` § "Convergence with
Anthropic Dreams API" for the mapping table and the substrate-gap explanation.

| Mode              | LLM?               | Output                         | When it triggers                                 |
| ----------------- | ------------------ | ------------------------------ | ------------------------------------------------ |
| `--dream-prune`   | no                 | `proposals/archival-<date>.md` | Always; lists 0-hit skills.                      |
| `--dream-curate`  | yes (ollama-spark) | `proposals/curate-<date>.md`   | When ≥1 queue item exists.                       |
| `--dream-propose` | yes (ollama-spark) | `proposals/skill-<name>.md`    | When ≥`--min-cluster` (3) pending items cluster. |

Promotion flow: HIL reviews a proposal → copies the body into its target
location (e.g. `skills/<name>/SKILL.md`) → registers it per the Agent
Productization Rule → deletes the proposal file in the same commit.

## See also

- `.claude/commands/clawdbot.md` — slash command behavior + HIL flow
- `scripts/clawdbot-scan.mjs` — scanner source
- `docs/DWS_SKILLS_GUIDE.md` — full skill index
- CLAUDE.md → "Agent Productization Rule"
