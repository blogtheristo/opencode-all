# Field Note: The 12 Engineering Discipline Rules — Harness Hardening

**Date:** 2026-06-19
**Author:** DWS Team
**Source:** Senior-engineer consensus on AI-coding discipline (Karpathy-lineage), adapted for DWS IQ
**Type:** Process / Harness Engineering
**Session:** claude/karpathy-12-rules-u47rx1

---

## The Story

The repo already carried "Karpathy guidelines" — but only as a stub. The Admin
Manual's _AI Agent Operational Guidelines_ listed behaviors 1–6 and then jumped
to DWS-specific failure modes numbered 13–15, leaving an obvious 7–12 gap, and
`CLAUDE.md` — the one rules file, our institutional memory — never stated the
rules at all. Agents inherited discipline by osmosis, not by reference.

This session closes that gap. The 12 rules senior engineers converged on are now
codified once, in `CLAUDE.md`, and wired so **every agent has access to them**.

---

## What Changed

| Surface                          | Change                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `CLAUDE.md`                      | New **canonical** section "Engineering Discipline — The 12 Rules" with DWS bindings. |
| `.claude/hooks/session-start.sh` | Injects the 12-rule digest into **every** session/subagent at runtime.               |
| `AI_AGENT_GUIDELINES.md` §0      | Restates the rules for `src/agents/` BaseAgent, MCP tools, AgentFoundry, dev-fleet.  |
| `AGENTS.md`                      | Pointer at the top of the architecture overview (auto-syncer-safe region).           |
| `.claude/hooks/README.md`        | **Enforcement map** — which hook mechanizes which rule.                              |
| `Admin/ADMIN_MANUAL.md`          | Full 12-rule table replaces the 1–6 stub; v3.3; Recent Session Artifacts digest.     |

**Design choice:** one canonical home (`CLAUDE.md`), pointers everywhere else.
No copy is forked — rule 7 (surface conflicts, don't average) applied to the
rules' own documentation. This is rule 11 (match conventions): the repo already
treats `CLAUDE.md` as the single rules file.

---

## The 3% Claim — Surfaced, Not Swallowed

The source reports roughly **3% with the 12-rule version** — i.e. the disciplined
harness materially shrinks the bad-outcome rate relative to ad-hoc prompting.

Per rule 12 (fail loud) and the DWS "eval-driven, not vibe-driven" principle,
this is recorded as an **external, unverified claim**, not a DWS-measured result:

- It is **not** a canonical DWS fact and must **not** be propagated as one
  (`DWS_TRUTH_STANDARD` §5/§7). `/truth-check` would WARN if it appeared in
  public copy without this context.
- To convert it into a DWS number, run an eval: a fixed task set scored
  with/without the session-start injection, the delta reported with n and
  confidence — not a vibe. That is the only way "3%" becomes ours.

Until then: the rules earn their place on engineering merit (fewer silent
failures, tighter scope, real checkpoints), not on a borrowed percentage.

---

## Why This Compounds

What compounds is not the next framework — it is `CLAUDE.md` as institutional
memory, eval-driven changes, checkpoints over speed, explicit conflicts over
silent blending, and discipline over novelty. One repo, one rules file, no
exceptions. The harness now makes that the default an agent wakes up inside.

---

## Next Steps

- [ ] Stand up the with/without eval to validate (or replace) the 3% figure.
- [x] Added the Forward Future **Loop Library** (tested loop templates) as a
      search focus source in `skills/loop/SKILL.md` (v1.1).
- [ ] After the next `/retro`, run `/learn` to fold any rule-violation patterns
      back into the skills, not the scrollback.
