---
name: clawdbot
description: >
  Internal session janitor — mines Claude Code transcripts in
  ~/.claude/projects/-home-user-dws6/ for unfinished work, generates per-session
  continuation plans, and resumes them only after explicit human approval. Use when:
  "clawdbot", "session janitor", "resume past session", "what did I leave unfinished",
  "scan old sessions", "queue follow-up work", "continue where we left off",
  "mine transcripts", "session backlog".
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

| Command                          | Purpose                                              |
| -------------------------------- | ---------------------------------------------------- |
| `node scripts/clawdbot-scan.mjs` | Scan transcripts, write queue files, update state.   |
| `… --list`                       | Print pending queue items as JSON (newest first).    |
| `… --status`                     | Print summary counts (pending / dismissed / done).   |
| `… --dismiss <id>`               | Mark a queue item dismissed (short id or full uuid). |
| `… --done <id>`                  | Mark a queue item done.                              |
| `… --max-age <N>`                | Ignore sessions older than N days (default 30).      |

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
- [x] Structured JSON output: `--list`, `--status` emit JSON
- [x] Skill registered: this file
- [x] Slash command: `.claude/commands/clawdbot.md`
- [ ] MCP exposure: not yet (local-only, reads sensitive transcripts)
- [ ] Scheduler hook: optional — can be added to `scripts/daily/` later if the
      team wants a daily digest of pending work

## Examples

```
/clawdbot scan
/clawdbot list
/clawdbot next
/clawdbot dismiss 0e2e931a
/clawdbot done 0e2e931a
```

## See also

- `.claude/commands/clawdbot.md` — slash command behavior + HIL flow
- `scripts/clawdbot-scan.mjs` — scanner source
- `docs/DWS_SKILLS_GUIDE.md` — full skill index
- CLAUDE.md → "Agent Productization Rule"
