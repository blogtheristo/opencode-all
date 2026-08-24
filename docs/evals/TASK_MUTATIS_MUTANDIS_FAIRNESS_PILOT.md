<!-- VERSION AND AGENT HISTORY
Document: Scoped Task — Counterfactual Fairness Pilot (mutatis-mutandis methodology)
Version: 1.0
Date: 2026-06-22
Author: Claude Code (Opus 4.8) + Human Review
Branch: claude/santander-ai-governance-mhd8rj
Status: READY — scoped task, awaiting pick-up

AGENT HISTORY:
- v1.0 (2026-06-22): Initial scoped task. Derived from the "Pilot" decision in docs/evals/SANTANDER_AUTOGUARDRAILS_MUTATIS_EVAL.md. Scopes ONLY the mutatis-mutandis counterfactual fairness pilot (autoguardrails is inspire-only, not in this task). No code is vendored until the Apache-2.0 NOTICE check passes.
-->

# Scoped Task — Counterfactual Fairness Pilot

**One task only.** Per CLAUDE.md Rule 2 (simplicity) and Rule 3 (surgical), this scopes the `mutatis-mutandis` pilot **and nothing else**. `autoguardrails` stays inspire-only (separate, later, eval-scoped).

## Goal (Rule 4 — explicit done-condition)

Produce **one signed counterfactual-fairness artifact** for a single financed-decision / lending agent path, using the published `mutatis-mutandis` situation-testing methodology, emitted through the Firehorse signed-report path as EU AI Act **Art. 10 / Annex III** evidence.

**Done when all are true:**

1. A defined protected-attribute set + comparator logic exists for **one** agent decision type (pick the simplest lending/underwriting path already in the tree).
2. The check runs on a synthetic/anonymised dataset and outputs a pass/fail fairness result with the counterfactual deltas shown (Rule 12 — surface the numbers, don't hide them).
3. The result is wrapped as a signed Firehorse artifact with Article-12 logging.
4. The artifact cites the published methodology (paper-backed), not a hand-rolled metric (Rule 9 — test verifies intent).
5. A reviewer can re-run it and get the same result (reproducibility).

## Out of scope (do not expand)

- Productionising across all agent paths — pilot is **one** path.
- `autoguardrails` / guardrail stress-testing — different task.
- `mech-gov-framework` / `llm_bridge` adoption — explicitly rejected in the eval.
- Generalising the protected-attribute config into a framework — Rule 2; build for one case first.

## Pre-conditions (gate before any code)

- [ ] Confirm `mutatis-mutandis` LICENSE + NOTICE (Apache-2.0) and decide: vendor specific files (retain NOTICE) vs reimplement methodology from the paper. Prefer reimplement-from-paper if the vendored surface is large.
- [ ] Pick the target agent path (recommend the existing lending/financed-decision agent referenced in the FS compliance flow).
- [ ] Confirm a synthetic/anonymised dataset is available (no PII — CLAUDE.md Non-Negotiable Rule 1).

## Acceptance checks (Rule 9 — assert intent)

- Flipping a protected attribute on a held-out synthetic record changes the _measured_ fairness delta (a test that can't fail when the logic changes is wrong).
- The signed artifact validates and the Article-12 log entry is written.
- Re-run produces an identical signed result.

## Owners

- **Compliance** (methodology + Art. 10 framing) + **the financed-decision agent owner** (integration).
- **Reviewer:** security-reviewer or code-reviewer agent before `/ship`.

## Lineage

- Decision source: `docs/evals/SANTANDER_AUTOGUARDRAILS_MUTATIS_EVAL.md` (Pilot)
- Regulatory framing: `docs/regulatory-radar/SANTANDER_AI_GOVERNANCE_BRIEF.md` (Art. 10 gap)
- Method source: `mutatis-mutandis` — https://github.com/SantanderAI/mutatis-mutandis (Apache-2.0)
