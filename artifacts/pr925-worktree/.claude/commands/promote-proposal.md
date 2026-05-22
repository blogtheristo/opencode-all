---
name: promote-proposal
allowed-tools: Read, Edit, Write, Bash(node:*), Bash(git:*)
description: Walk a clawdbot proposal through HIL-gated promotion. Closes the dream cycle by turning proposals/*.md into real edits.
argument-hint: "<proposal-path> | --next"
---

# Promote a Clawdbot Proposal

You are the **promoter** — the step between `clawdbot --dream-*` (which writes
proposals) and the repository (which has to actually change).

Input: `$ARGUMENTS` — proposal file path, or `--next` (newest unpromoted).

## Steps

1. **Resolve the proposal file.** If `$ARGUMENTS` is empty or `--next`:
   - List `.claude/clawdbot/proposals/*.md`.
   - Filter out any whose first 10 lines contain `STATUS: PROMOTED` or `STATUS: NO-OP`.
   - Sort by mtime (newest first). Pick top. Stop if empty (say so).
2. **Read** the file. Detect kind from filename prefix (`curate-`, `skill-`, `archival-`).
3. **Build the checklist** per `skills/promote-proposal/SKILL.md`:
   - `curate-` → memory notes + CLAUDE.md edits + queue ids to close
   - `skill-` → SKILL.md body + slash-command body + skills-guide §3.X entry
   - `archival-` → `git mv skills/<name> skills/<name>_OLD` per row + guide cleanup
4. **For each item, call `AskUserQuestion`** with one approve/skip/edit question.
   Preview the change in 5–10 lines. Apply only on approve. Skip silently if not.
5. After the loop, run `node scripts/clawdbot-scan.mjs --done <id>` for any
   queue ids the user accepted closing.
6. **Prepend** `> **STATUS: PROMOTED <today>** — see commit for details.` to
   the proposal file. Do **not** delete (CLAUDE.md no-rm rule).
7. **Summarize**: paths written, paths skipped, queue ids closed.

## Output style

- One sentence before the first AskUserQuestion describing the proposal kind and item count.
- After each apply, one short line confirming the path.
- End-of-turn summary: ≤2 sentences.

## Trust zone

YELLOW per CLAUDE.md "Auto-Mode Trust Boundary". Each apply is HIL-gated by
`AskUserQuestion` so this is safe to invoke in auto-mode.

## Edge cases

- No unpromoted proposals: print "Queue empty — nothing to promote" and stop.
- Target path already exists: ask whether to overwrite / append / skip.
- Skill name collision: refuse, suggest a rename.

## Examples

```
/promote-proposal --next
/promote-proposal .claude/clawdbot/proposals/curate-2026-05-12.md
/promote-proposal .claude/clawdbot/proposals/archival-2026-05-12.md
```
