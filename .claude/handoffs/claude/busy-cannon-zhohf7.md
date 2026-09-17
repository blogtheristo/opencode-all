# Handoff — claude/busy-cannon-zhohf7

**Task:** Automate the dominant-game recipe (field note `docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md`, steps 5–8). Founder-ratified MGD/CRC as the DWS north-star pair. COMPLETE.

## Status by step — ALL DONE

- [x] **Step 1 — REGISTER** (commit 672e37c). `DWS_TRUTH_STANDARD.md` -> v3.6, §2 row 29 (MGD/CRC) + §6 drift-log row. Mirror `dws10.com/config/metrics-northstar.json` (+ landing-pages), §3 defs verbatim, deprecated phrases from the §2 anti-games table. `/truth-check` on the banned headcount-style phrase -> FAIL; benchmark/token/pilot -> WARN; MGD -> PASS.
- [x] **Step 2 — INSTRUMENT** (commit 91419ef). `scripts/compute-mgd.mjs` deterministic, no LLM. GAP CONFIRMED: `agent_executions` (migration 030) lacks the three fields -> FAILS LOUD (exit 2). Migration `081_agent_executions_governance_fields.sql` PROPOSAL only. Fixtures + 12 vitest cases (intent).
- [x] **Step 3 — CODIFY** (commit 8d576e2). `skills/mgd-report/SKILL.md` (wraps script; CUSTOMER+RANGE; CLI+JSON) + `.claude/commands/mgd-report.md` + `skills/manifest.json` (command+pack) + `docs/DWS_SKILLS_GUIDE.md` §7.4.
- [x] **Step 4 — SCHEDULE** (this commit). `scripts/daily/mgd-game-recheck-quarterly-gate.sh` (day-runner auto-discovered, self-gates to quarter-start) writes `docs/retros/` artifact for /retro -> /learn (current/prior MGD, trend, anti-game flag; fail-loud-aware). GHA failover `.github/workflows/quarterly-mgd-recheck.yml`, active quarterly cron.

## Verification

- `npx vitest run src/__tests__/compute-mgd.test.ts` -> 12/12 pass.
- Gate no-ops off quarter-start; Jul-1 sim -> MGD=3, prior=0, trend ▲3; legacy -> fail loud (exit 2).
- All four success criteria met. NO PR (not requested).

## Out of scope (honored)

- Migration 081 is a PROPOSAL — not applied (RED). base.agent.ts logExecution() wiring is a separate review-gated change.
- Ross-quote external publication, investor copy, outbound email.
