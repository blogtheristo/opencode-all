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
3. ~~**Sender decision** (field note §8)~~ **RESOLVED 2026-07-26 (HIC chose (b)):** CLAUDE.md now recognises `risto.paarni2024@lifetime.fi` as a legitimate outbound address (the Workspace account live threads send from). #1698 and #1664 are therefore **compliant as-is** — no sender fix needed; they can be merged/redone normally.
4. **dws7** — same treatment (still untouched).

## Guardrails learned (apply next session)

- Triage/review subagents are **STRICTLY READ-ONLY** (no close/merge/comment/push) — a subagent closed #1432 unprompted.
- Two-pass `get` for real `mergeable_state` (first returns `unknown`).
- Doc-only+clean still needs a content-safety pass (sender identity, public-site, PII).
- Supabase: every new `CREATE TABLE` needs table `GRANT`s (#1528, #1208, #1674 offend). #1674 migration 075 collides with main.

## Multi-machine coordination (agreed 2026-07-26) — ONE writer per branch

DGX + local Claude both checked out this branch. To avoid conflicts/force-pushes,
split the lanes so only ONE machine commits to `claude/ollama-orchestration-merge-047pj7`:

| Machine | Lane | Writes to this branch? |
| --- | --- | --- |
| **DGX** | KEEP_REVIEW: review + build (`tsc`) + test (`vitest`) + merge; rebase fixes; security redos (#1453 etc.). Has node_modules, local Ollama, is deploy-adjacent. Run `docs/pr-cleanup/NEXT_SESSION_PROMPT.md` **step 2 only**. First: `git pull --rebase`, `scripts/ollama-spark.sh --list`, `export OLLAMA_BASE_URL=http://localhost:11434`. | ✅ **sole writer** |
| **Local** | Non-committing work: close the 63 V2-source branches (GitHub API only), the sender decision (§8 of the field note), and dws7 (separate repo/branch). Run `NEXT_SESSION_PROMPT.md` **steps 1, 3, 4**. | ❌ does not touch this branch |

Rule: only DGX commits/pushes here; always `git pull --rebase origin claude/ollama-orchestration-merge-047pj7` before pushing. Local's lanes (closes / dws7 / sender) write nothing to this branch, so they can't conflict. Account usage limit is shared across machines on the same account (resets 8am UTC).

## Blockers

- Session token limit hit 2026-07-26 (resets 8am UTC) — that is why steps 1–4 are deferred, not skipped.
