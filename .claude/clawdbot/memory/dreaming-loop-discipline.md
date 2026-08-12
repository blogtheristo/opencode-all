# Memory: Firehorse Dreaming loop discipline

> Curated by Claude (this session) as the dreamer.
> Date: 2026-05-12
> Triggered by HIL directives:
>
> 1. "Important in dreaming loop that there is todo goes through planning
>    mode hil then approves"
> 2. "Study /goal use here too" (Claude Code docs:
>    <https://docs.claude.com/en/docs/claude-code/goal>)
> 3. "Remove migration from red zone" → produced separate policy edits.

## The loop, in canonical form

A Firehorse Dreaming cycle is exactly five steps. Any deviation is a bug.

1. **Dream** — `clawdbot --dream-{curate,propose,prune}` reads transcripts /
   queue / skills and writes a proposal under `.claude/clawdbot/proposals/`.
   No edits to the repo. Pure read-and-write-proposal.
2. **Plan** — `/promote-proposal <path>` (or `--next`) reads the proposal,
   extracts a TODO list of concrete edits, and **enters plan mode** with
   that TODO list presented as the plan. The TODO list is the plan.
3. **HIL approval** — the user reviews the plan in the ExitPlanMode UI and
   either approves (whole plan), edits before approving, or rejects.
   Per-item approval is NOT used in the dreaming loop; that was the old
   flow and is replaced by atomic plan-mode review.
4. **Execute** — only after HIL exits plan mode, the skill applies the
   approved edits. If `/goal` is set with a condition derived from the
   plan (e.g. "proposal file marked PROMOTED, all listed paths written"),
   the session keeps working across turns until the evaluator agrees.
5. **Record** — the proposal file is annotated `STATUS: PROMOTED <date>`
   (never deleted, per CLAUDE.md no-rm rule). For memory notes specifically,
   the body is dual-written to the canonical Firehorse CMS via
   `scripts/firehorse-memory-write.mjs` (insert-only into
   `firehorse_memory`). Then **commit, push, AND open a pull request**
   (`mcp__github__create_pull_request`). The PR is mandatory — previous
   Dreaming sessions repeatedly pushed without PR-ing, leaving curated
   work stranded on feature branches with no review surface. Without the
   PR step the loop is broken; with it the dreamer's output becomes a
   reviewable artifact in GitHub's UI immediately.

## Why plan mode and not per-item AskUserQuestion

The earlier `/promote-proposal` flow asked HIL one approve/skip question
per item. That is a fine pattern when there are 1–3 items but becomes
attention-hostile at 10+. Plan mode is the right primitive: HIL sees the
whole intent at once, can edit any line before approving, and the
approval is atomic — once exited, every line is committed-to.

Per-item AskUserQuestion is still appropriate for **runtime ambiguities**
the proposal cannot pre-resolve (e.g. "target path already exists —
overwrite, append, or skip"). That is not the same as approving the plan.

## Why `/goal` as the cross-turn engine

Per <https://docs.claude.com/en/docs/claude-code/goal>:

- `/goal <condition>` sets a session-scoped completion condition. After
  each turn, a small fast evaluator (Haiku by default) reads the
  conversation and decides whether the condition holds. If not, Claude
  takes another turn instead of returning control.
- Goals survive `--resume` / `--continue` (turn count + timer reset; the
  condition persists). That matches Firehorse Dreaming's
  multi-session-resume pattern.
- "Auto mode removes per-tool prompts, `/goal` removes per-turn prompts."
  They compose: auto mode + `/goal` = unattended execution until the
  condition evaluates true.

In the Dreaming loop, the natural goal-setting point is step 4: when HIL
approves the plan, the skill should ALSO set a `/goal` with a condition
the evaluator can verify from the transcript. Example shapes:

- For `/promote-proposal`: `/goal proposal at <path> has STATUS: PROMOTED in its first 10 lines AND all target paths from the plan have been written, or stop after 10 turns`
- For `clawdbot next` (resume queued session): `/goal queue item <shortId> has been marked done via clawdbot --done AND git status is clean, or stop after 20 turns`

The "or stop after N turns" clause is mandatory — open-ended goals are a
budget hazard.

## Bounding the loop

Two budget knobs apply:

- `CLAUDE_AUTO_MODE_BUDGET` env var bounds total auto-mode work in a
  session (per SessionStart hook).
- `/goal` condition includes a turn-cap (`or stop after N turns`) to
  prevent runaway evaluation if the condition is mis-specified.

Both must be set sensibly before a Dreaming loop is allowed to run
unattended. Default for an unattended `/promote-proposal` run: 10 turns,
~50k tokens, hard stop.

## Open implementation work (next sessions)

- [ ] Update `skills/promote-proposal/SKILL.md` to mandate plan mode entry
      at step 2 (not the per-item AskUserQuestion flow).
- [ ] Update `.claude/commands/promote-proposal.md` similarly.
- [ ] Add a `--goal` flag to `/promote-proposal` (or default-on) that
      composes a `/goal` directive from the plan and runs it.
- [ ] Same for `clawdbot --next` resume flow: enter plan mode with the
      queue file as the plan source, set a goal on completion.
- [ ] Memory note `.claude/clawdbot/memory/clawdbot-architecture.md`
      gains a "Loop discipline" pointer to this file.

## See also

- `skills/clawdbot/SKILL.md` — produces proposals
- `skills/promote-proposal/SKILL.md` — applies proposals (to be updated)
- `scripts/firehorse-memory-write.mjs` — dual-writes memory to CMS
- `supabase/migrations/065_firehorse_memory.sql` — CMS schema
- CLAUDE.md → "Auto-Mode Trust Boundary"
- <https://docs.claude.com/en/docs/claude-code/goal> — /goal reference
- <https://docs.claude.com/en/docs/claude-code/hooks-guide#prompt-based-hooks>
  — /goal is a wrapper around a prompt-based Stop hook; we could replicate
  that mechanism in-repo for non-Claude-Code agents.
