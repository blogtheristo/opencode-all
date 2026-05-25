---
name: promote-proposal
description: "Walk a clawdbot proposal (.claude/clawdbot/proposals/*.md) through HIL-gated promotion: identify targets, approve per-change, apply, register, mark PROMOTED."
argument-hint: "<proposal-file-path> | --next (pick newest unpromoted)"
allowed-tools: [Read, Edit, Write, Bash]
---

# Promote-Proposal Skill

**Closes the loop** between clawdbot's `dream-*` modes (which propose) and
the repository (which has to actually change). Treats every proposal as a
checklist of HIL-gated edits, never bulk-applies.

## What this skill knows

Three proposal shapes, each with a deterministic promotion plan:

| Proposal kind   | Filename pattern     | Promotion steps                                                                                                                                                                                       |
| --------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Curation        | `curate-<date>.md`   | (a) Write each `memory_notes[]` to `.claude/clawdbot/memory/<topic>.md`. (b) Edit CLAUDE.md per `claude_md_edits[]`. (c) `--done <id>` per `queue_closeable[]`.                                       |
| Skill candidate | `skill-<name>.md`    | (a) Create `skills/<name>/SKILL.md` from the proposed body. (b) Create `.claude/commands/<name>.md` from the proposed slash body. (c) Add an entry to `docs/DWS_SKILLS_GUIDE.md` (Section §3.X).      |
| Archival        | `archival-<date>.md` | For each unused skill: `git mv skills/<name> skills/<name>_OLD`, remove its row from `docs/DWS_SKILLS_GUIDE.md`, remove its `.claude/commands/<name>.md` if any. Per CLAUDE.md: rename, never delete. |

## Execution flow

1. Resolve target. If `$ARGUMENTS` is `--next` or empty, list
   `.claude/clawdbot/proposals/*.md` whose first 10 lines do **not** include
   `STATUS: PROMOTED` or `STATUS: NO-OP`, sorted by mtime (newest first), and
   pick the top. Else use the explicit path.
2. Read the proposal. Detect kind from filename prefix.
3. Build a checklist of concrete edits (paths + content) from the proposal body.
4. For each item, call `AskUserQuestion` with one approve/skip/edit question.
   Show a short preview of the change. Apply only on approve.
5. After the loop, run `node scripts/clawdbot-scan.mjs --done <id>` for any
   queue ids the user approved closing.
6. Prepend `> **STATUS: PROMOTED <today>** — see commit for details.` to the
   proposal file. Do not delete (per CLAUDE.md no-rm rule).
7. Show a summary: paths written, paths skipped, queue ids closed.

## Trust zone

YELLOW per CLAUDE.md "Auto-Mode Trust Boundary". Touches `skills/`,
`.claude/commands/`, `CLAUDE.md`, `docs/DWS_SKILLS_GUIDE.md`. Per-change
AskUserQuestion satisfies the HIL requirement even when running in
auto-mode.

## Edge cases

- A proposal with no actionable items (e.g. `dream-curate` returned empty arrays):
  prepend `STATUS: NO-OP` and exit.
- A target path that already exists: ask HIL whether to overwrite, append, or skip.
- A skill candidate whose `name` collides with an existing skill: refuse, suggest
  renaming.
- An archival proposal whose target skill has a `.claude/commands/<name>.md`:
  rename both in the same commit.

## Productization checklist (per CLAUDE.md "Agent Productization Rule")

- [x] CLI command path: invoked via `/promote-proposal` slash command
- [x] Skill registered: this file
- [x] Slash command: `.claude/commands/promote-proposal.md`
- [ ] Structured JSON output: not yet — output is a human-readable summary
- [ ] MCP exposure: not yet (operates on local proposal files only)
- [ ] Scheduler hook: not applicable — strictly HIL-driven

## See also

- `skills/clawdbot/SKILL.md` — produces the proposals this skill consumes
- `.claude/clawdbot/README.md` — directory layout + tracked vs gitignored
- CLAUDE.md → "Agent Productization Rule" + "Auto-Mode Trust Boundary"
