---
name: dream-on
description: >
  One-trigger entry to the Firehorse Dreaming loop. User says "dream on" (or
  invokes /dream-on); the skill walks the canonical five-step loop end-to-end:
  scan past sessions, pick the next unpromoted dream artifact (proposal or
  queue item), build a plan, enter plan mode for atomic HIL approval, set a
  /goal for cross-turn execution, then run auto-mode until the goal evaluates
  true. Replaces the old "ask the user what to do next" UX.
  Use when: "dream on", "keep dreaming", "continue dreaming", "auto-dream",
  "run the dream loop", "next dream pass".
argument-hint: "[optional topic or proposal path]"
allowed-tools: [Read, Edit, Write, Bash, ExitPlanMode]
---

# Dream-On Skill — the Firehorse Dreaming umbrella

`/dream-on` is the one-trigger entry to the canonical
**Firehorse Dreaming** loop (see
`.claude/clawdbot/memory/dreaming-loop-discipline.md` for the discipline).

It composes three already-shipped pieces — `clawdbot` (producer),
`/promote-proposal` (applier), and Claude Code `/goal` (cross-turn
runner) — into one autonomous flow gated by a single plan-mode HIL
approval at the start.

## The five-step loop, executed end-to-end

1. **Scan & pick.** If `$ARGUMENTS` is a proposal path, use it. Else
   run `node scripts/clawdbot-scan.mjs` to refresh the queue, then:
   - Prefer the newest unpromoted proposal under
     `.claude/clawdbot/proposals/` (i.e. one whose first 10 lines do
     NOT include `STATUS: PROMOTED` or `STATUS: NO-OP`).
   - Fall back to the top queue item from `--list` if there are no
     unpromoted proposals.
   - If both are empty, run one dream pass (`--dream-prune` is always
     safe; `--dream-curate` and `--dream-propose` need `--dry-run` or
     a live ollama-spark). Surface what was generated, then loop.
2. **Plan.** Build a concrete TODO list of edits the proposal requires.
   For a `curate-<date>.md`: each memory note + each CLAUDE.md edit +
   each queue-id-to-close becomes one TODO line. For a `skill-<name>.md`:
   SKILL.md write + slash-command write + skills-guide §3.X entry.
   For an `archival-<date>.md`: one `git mv skills/<name> skills/<name>_OLD`
   per row (per CLAUDE.md no-rm rule).
3. **Plan-mode HIL approval.** Call `ExitPlanMode` with the TODO list as
   the plan. HIL approves the whole plan atomically (or edits before
   approving, or rejects). Per-item `AskUserQuestion` is NOT used — that
   was the old flow. The only per-item question allowed mid-execution
   is for **runtime ambiguities** the proposal cannot pre-resolve (e.g.
   "target path already exists — overwrite, append, or skip").
4. **Execute under /goal.** After plan-mode exit, suggest a `/goal`
   directive composed from the plan, with a mandatory turn-cap clause.
   Example shapes:
   - `/goal proposal at <path> has STATUS: PROMOTED in its first 10 lines AND all listed target paths have been written, or stop after 10 turns`
   - `/goal queue item <shortId> has been marked done via clawdbot --done AND git status is clean, or stop after 20 turns`
     The user runs the `/goal` themselves (slash commands cannot invoke
     other slash commands). Auto-mode then handles per-tool prompts;
     `/goal` handles per-turn continuation until the evaluator agrees.
5. **Record.** For each promoted memory note, dual-write to the
   canonical Firehorse CMS via
   `node scripts/firehorse-memory-write.mjs --topic <kebab> --title "<title>" --body-file <path> [--dry-run]`.
   Prepend `STATUS: PROMOTED <today>` to the proposal file (never delete,
   per CLAUDE.md). Commit + push.

## When to bail out

- No unpromoted proposals AND no pending queue items AND fresh
  `--dream-prune` returned no archival candidates: print "Dream queue
  empty — nothing to do" and stop. Do NOT manufacture work.
- HIL rejects the plan: respect it; do not retry with a tweaked plan
  unless explicitly invited.
- A target path collision or a RED-zone touch surfaces mid-execution:
  stop, report, and ask before continuing.

## Trust zone

YELLOW per CLAUDE.md "Auto-Mode Trust Boundary": touches `skills/`,
`.claude/commands/`, `CLAUDE.md`, `docs/DWS_SKILLS_GUIDE.md`, and may
write to Supabase via the firehorse-memory helper (RED apply was
performed by HIL when migration 065 was applied; runtime POSTs are
authenticated YELLOW writes). The single plan-mode approval at step 3
satisfies the HIL requirement; cross-turn auto-mode requires
`CLAUDE_AUTO_MODE_BUDGET` to be set sensibly.

## Productization checklist

- [x] CLI command path: `/dream-on` slash command
- [x] Skill registered: this file
- [x] Slash command: `.claude/commands/dream-on.md`
- [ ] Structured JSON output: not yet — output is a human-readable narrative
- [ ] MCP exposure: not yet (operates over local transcripts + proposals)
- [ ] Scheduler hook: not directly. `scripts/daily/clawdbot-digest.sh`
      already runs a daily scan; `dream-on` is meant for interactive
      "drive the loop now" use, not for cron.

## See also

- `.claude/clawdbot/memory/dreaming-loop-discipline.md` — the discipline this implements
- `skills/clawdbot/SKILL.md` — the producer (writes proposals + queue)
- `skills/promote-proposal/SKILL.md` — the per-proposal applier
- `scripts/firehorse-memory-write.mjs` — CMS dual-write helper
- <https://docs.claude.com/en/docs/claude-code/goal> — /goal reference
- CLAUDE.md → "Auto-Mode Trust Boundary"
