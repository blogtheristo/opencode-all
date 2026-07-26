# Handoff — claude/ollama-orchestration-merge-047pj7

**Updated:** 2026-07-26 · **Owner:** Risto Anton Päärni · **Agent:** Claude Code (Opus 4.8)

## What this branch/session did

Boss-role cleanup of the dws6 open-PR backlog (~131). Ollama-on-DGX-Spark was unreachable from the cloud session, so orchestration ran as Opus + `general-purpose` subagent fleet. Full record: `docs/field-notes/2026-07-26-pr-backlog-orchestration-cleanup.md`.

## State on this branch

- Carries: Aspire 13.4.6 bump (`docker-compose.yml`, field note §3.8, `Admin/ADMIN_MANUAL.md`) → **PR #1757 open**. Plus this handoff + the 2026-07-26 field note.
- `npm install` completed (exit 0) — `npm run build` (`tsc`) and `npm test` (`vitest`) are runnable next session.

## Done

- Merged (doc-only): #1672 #1689 #1530 #1462 #1434 #1433 #1431 #1430 #1320 #1660.
- Closed (superseded): #1432 #1557 #1124 #1403 #1699 #1686 #1539 #1236 #1422 #1395 #1379.
- 63 redo prompts in `scratchpad/next-prompts/` (ephemeral — regenerate from PR bodies if the container reset; the bundle was delivered to the HIC).

## NOT done — next session (HIC said "yes" to all four)

1. **Close the 63 V2-source branches** (comment: "superseded — idea carried to next-prompt-v2; redo against current main"). List = the V2_PROMPT PRs in the field note buckets.
2. **KEEP_REVIEW (30) → review + fix + test + compile + merge.** Partial review done: **#1503 MERGE_READY**; **#1528 FIX (add table GRANTs to migration 070)**; #1548 #1526 #1504 #1498 REBASE. Re-run the review fleet for the other ~24 (R1/R3/R4/R5 died on session limit). CEO review where flagged: #1553 (Aiven CLOUD-Act legal wording), #1287 (Aegis hackathon public page), #1122 (Captain-tier pricing), #1708 (lifetime.fi homepage swap).
3. **Sender decision** (field note §8) — unblocks #1698, #1664.
4. **dws7** — same treatment (still untouched).

## Guardrails learned (apply next session)

- Triage/review subagents are **STRICTLY READ-ONLY** (no close/merge/comment/push) — a subagent closed #1432 unprompted.
- Two-pass `get` for real `mergeable_state` (first returns `unknown`).
- Doc-only+clean still needs a content-safety pass (sender identity, public-site, PII).
- Supabase: every new `CREATE TABLE` needs table `GRANT`s (#1528, #1208, #1674 offend). #1674 migration 075 collides with main.

## Blockers

- Session token limit hit 2026-07-26 (resets 8am UTC) — that is why steps 1–4 are deferred, not skipped.
