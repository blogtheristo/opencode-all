# Skill proposal — promote-proposal

> **STATUS: PROMOTED 2026-05-12** — `skills/promote-proposal/SKILL.md`,
> `.claude/commands/promote-proposal.md`, and §3.8 in
> `docs/DWS_SKILLS_GUIDE.md` all written. Skill is discoverable in the
> auto-loaded skills index. This file kept as historical record.

> Drafted by Claude (this session) as `dream-propose` would have, from a
> session-of-one observation rather than from N clustered queue items.
> Supporting evidence: this very session executed the workflow twice
> (curate → CLAUDE.md edits + memory note; the archival proposal still
> awaits HIL). Each promotion involved the same shape of work.
> Date: 2026-05-12

## Pattern observed

Clawdbot's three dream modes generate proposals under `.claude/clawdbot/proposals/`:

- `curate-<date>.md` → memory notes + CLAUDE.md edits + closeable queue ids
- `skill-<name>.md` → bodies for `skills/<name>/SKILL.md` + `.claude/commands/<name>.md`
- `archival-<date>.md` → list of skills to rename to `_OLD`

Each promotion is **the same five steps** but applied to different targets:

1. Read the proposal.
2. Identify target paths from its structure.
3. For each target, ask HIL approval (per-change, not per-proposal).
4. Apply approved changes; register in `docs/DWS_SKILLS_GUIDE.md` if applicable.
5. Mark the proposal `STATUS: PROMOTED` at the top (never `rm`, per CLAUDE.md).

Today this is manual — every promotion takes ~5 tool calls of boilerplate
even when every change is approved. A skill captures it.

## Why this clears the bar

`dream-propose`'s gate is "≥3 pending queue items share intent." I'm acting on
"this exact workflow ran twice in one session and is described in two
different doc files" — `.claude/clawdbot/README.md` ("Promote a proposal:
copy its content into the target location, commit, then delete the proposal
file.") and `skills/clawdbot/SKILL.md` ("Promotion flow: HIL reviews a
proposal → copies the body into its target location → registers it…").
When the same procedure is documented in two places without being tooled,
that's the same signal as a queue cluster.

## Proposed `skills/promote-proposal/SKILL.md`

```markdown
---
name: promote-proposal
description: >
  Walk a clawdbot proposal (.claude/clawdbot/proposals/*.md) through HIL-gated
  promotion: identify target paths, ask per-change approval, apply, register
  in skills guide if applicable, mark proposal PROMOTED. Closes the dream
  cycle without requiring the human to run the same five steps by hand each
  time. Use when: "promote proposal", "apply curate", "ship the proposal",
  "promote dream output", "promote curation", "promote skill candidate".
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
   `.claude/clawdbot/proposals/*.md` whose first 5 lines do **not** include
   `STATUS: PROMOTED`, sorted by mtime (newest first), and pick the top.
   Else use the explicit path.
2. Read the proposal. Detect kind from filename prefix.
3. Build a checklist of concrete edits (paths + content) from the proposal body.
4. For each item, call `AskUserQuestion` with one approve/skip/edit question.
   Show a short preview of the change. Apply only on approve.
5. After the loop, run `node scripts/clawdbot-scan.mjs --done <id>` for any
   queue ids the user approved closing.
6. Prepend `> **STATUS: PROMOTED <today>** — see commit for details.` to the
   proposal file. Do not delete.
7. Show a summary: paths written, paths skipped, queue ids closed.

## Trust zone

YELLOW. Touches `skills/`, `.claude/commands/`, `CLAUDE.md`, `docs/DWS_SKILLS_GUIDE.md`.
Per-change AskUserQuestion satisfies the HIL requirement even when running
in auto-mode.

## Edge cases

- A proposal with no actionable items (e.g. dream-curate returned empty arrays):
  prepend `STATUS: NO-OP` and exit.
- A target path that already exists: ask HIL whether to overwrite, append, or skip.
- A skill candidate whose `name` collides with an existing skill: refuse, suggest
  renaming.

## See also

- `skills/clawdbot/SKILL.md` — produces the proposals this skill consumes
- `.claude/clawdbot/README.md` — directory layout + tracked vs gitignored
- CLAUDE.md → "Agent Productization Rule" + "Auto-Mode Trust Boundary"
```

## Proposed `.claude/commands/promote-proposal.md`

```markdown
---
name: promote-proposal
allowed-tools: Read, Edit, Write, Bash(node:*), Bash(git:*)
description: Walk a clawdbot proposal through HIL-gated promotion. Closes the dream cycle.
argument-hint: "<proposal-path> | --next"
---

# Promote a Clawdbot Proposal

Input: `$ARGUMENTS` — proposal file path, or `--next` (newest unpromoted).

## Steps

1. Resolve the proposal file. If `$ARGUMENTS` is empty or `--next`:
   - List `.claude/clawdbot/proposals/*.md`.
   - Filter out any whose first 10 lines contain `STATUS: PROMOTED` or `STATUS: NO-OP`.
   - Sort by mtime (newest first). Pick top. Stop if empty.
2. Read the file. Detect kind from filename prefix (`curate-`, `skill-`, `archival-`).
3. Build the checklist (see `skills/promote-proposal/SKILL.md` for the per-kind plan).
4. For each item, call `AskUserQuestion` (1 question per change). Apply on approve.
5. Run `node scripts/clawdbot-scan.mjs --done <id>` for any queue ids the user accepted closing.
6. Prepend a `STATUS: PROMOTED <today>` line to the proposal.
7. Print a one-paragraph summary.

## Examples
```

/promote-proposal --next
/promote-proposal .claude/clawdbot/proposals/curate-2026-05-12.md
/promote-proposal .claude/clawdbot/proposals/skill-promote-proposal.md

```

```

## Supporting session ids

- `0e2e931a` — this session. Demonstrates the workflow being applied manually
  for the curate proposal (CLAUDE.md edits + memory note + queue mark-done)
  and **not yet** applied for the archival proposal — that gap is exactly
  what this skill would close in one HIL pass.

## HIL actions

1. Review the SKILL.md and slash command bodies above.
2. If approved: copy `skills/promote-proposal/SKILL.md` and `.claude/commands/promote-proposal.md` into place, add §3.8 to `docs/DWS_SKILLS_GUIDE.md`.
3. Prepend `STATUS: PROMOTED 2026-05-12` to this proposal file.
4. Test the new skill against the still-pending `archival-2026-05-12.md` proposal.
