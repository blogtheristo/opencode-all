<!-- VERSION AND AGENT HISTORY
Document: Scoped Engineering Eval — Santander autoguardrails + mutatis-mutandis vs DWS KYA/Security
Version: 1.0
Date: 2026-06-22
Author: Claude Code (Opus 4.8) + Human Review
Branch: claude/santander-ai-governance-mhd8rj
Status: PROPOSAL — scoped eval, no code adopted yet

AGENT HISTORY:
- v1.0 (2026-06-22): Initial scoped eval. Assesses two Apache-2.0 SantanderAI repos (autoguardrails, mutatis-mutandis) for selective adoption against DWS KYA runtime trust + DWS Security Standard posture. Decision gate, not an implementation. External facts cited to github.com/orgs/SantanderAI/repositories (2026-06-22). No Santander code has been added to the DWS tree.
-->

# Scoped Engineering Eval — `autoguardrails` + `mutatis-mutandis`

**Scope:** decide whether to adopt, vendor-in, or merely take inspiration from two Apache-2.0 SantanderAI repos. **This is a decision gate — no code has been pulled into the DWS tree.** Per CLAUDE.md Rule 2 (simplicity first) and Rule 8 (read before you write), the recommendation is deliberately narrow.

> License: both repos are Apache-2.0. Adoption is legally clean with attribution + NOTICE retention. Data in the repos is synthetic/anonymised. Confirm the NOTICE/LICENSE files before vendoring any file.

## Candidate 1 — `autoguardrails`

**What it is:** an alignment-research scaffold that searches over a single `policy.md` surface to harden LLM guardrails, with jailbreak stress-testing. "Autoresearch-style" — it iterates a policy file rather than training weights.

**DWS overlap:** KYA runtime trust (TC-0…TC-4) + MicroVM sandbox isolation + the DWS Security Standard prompt-injection posture. DWS already _contains_ a misbehaving agent (leash-snap); what DWS does **not** have as a first-class asset is a **repeatable jailbreak/guardrail stress-test harness** that proves the containment policy holds against an adversarial corpus.

| Dimension                 | Assessment                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fills a real DWS gap?     | **Yes** — adversarial test harness for guardrail/prompt-injection robustness (EU AI Act Art. 15).                                                                   |
| Fit with DWS architecture | Inspiration-level. The `policy.md`-search loop maps conceptually to a KYA policy surface, but DWS policy lives in KYA tiers + Security Standard, not a single file. |
| Adopt vs inspire          | **Inspire + selectively vendor the jailbreak corpus / harness runner**, not the whole scaffold. Wrap as an internal eval, not a runtime dependency.                 |
| Risk                      | Treating an external scaffold as production guardrail logic. Keep it in test/eval scope only.                                                                       |

**Recommendation:** **Inspire.** Build a small DWS-native guardrail stress-test under the existing eval path that borrows the adversarial-corpus idea. Do **not** make `autoguardrails` a runtime dependency. Effort: low-medium. Owner: Security.

## Candidate 2 — `mutatis-mutandis`

**What it is:** situation testing for discrimination analysis using counterfactual comparators — research code behind a published paper. Given a decision, it constructs counterfactual individuals (e.g. flip a protected attribute) and tests whether the outcome changes.

**DWS overlap:** this is the **clearest genuine gap.** DWS maps EU AI Act fairness/non-discrimination obligations for lending/financed decisions but does not ship a first-class **counterfactual fairness test** as a signed artifact. For Annex III high-risk use (credit scoring, insurance pricing), Art. 10 (data governance / bias) makes this directly relevant.

| Dimension                 | Assessment                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Fills a real DWS gap?     | **Yes — the strongest of the two.** No DWS counterfactual fairness artifact exists today.                                                   |
| Fit with DWS architecture | Good. Output is a discrimination-test result that slots into the Firehorse signed-report path as Art. 10 evidence.                          |
| Adopt vs inspire          | **Pilot adoption.** Paper-backed methodology + Apache-2.0 makes it defensible to auditors ("method is published, not hand-rolled").         |
| Risk                      | Methodology requires a defined protected-attribute set + comparator logic per use case — non-trivial domain config. Do not over-generalise. |

**Recommendation:** **Pilot.** Scope a counterfactual fairness check for the lending / financed-decision agent path, methodology cited to the paper, output as a signed Firehorse artifact = EU AI Act Art. 10 evidence. Effort: medium. Owner: Compliance + the financed-decision agent owner. This is the highest-value item across both this eval and the regulatory brief.

## Out of scope (do not adopt)

- `mech-gov-framework` — overlaps KYA conceptually; do not replace KYA tiers with an external regime. Cite as prior art, build nothing.
- `llm_bridge` — DWS already routes via `AgentConfig.model`; no adoption, but worth a read for adapter ergonomics.
- `gen-fraud-graph`, `sota-stressed-datasets`, `ralph*`, `causal-perception-implementation`, `auto-bayesian`, `linear-adapter-trainer`, `genetic-algorithm` — orthogonal to KYA/security; no action.

## Decision summary

| Repo               | Decision                                               | Effort     | Owner                    | EU AI Act link     |
| ------------------ | ------------------------------------------------------ | ---------- | ------------------------ | ------------------ |
| `mutatis-mutandis` | **Pilot** (counterfactual fairness, lending path)      | Medium     | Compliance + agent owner | Art. 10, Annex III |
| `autoguardrails`   | **Inspire** (guardrail stress-test harness, eval-only) | Low-Medium | Security                 | Art. 15            |
| all others         | No adoption                                            | —          | —                        | —                  |

**Next step if approved:** open a scoped task for the `mutatis-mutandis` pilot only (Rule 2 — don't start both). Verify Apache-2.0 NOTICE retention before any file is vendored. No code is pulled until this gate is signed off.

## Sources

- SantanderAI org repositories — https://github.com/orgs/SantanderAI/repositories (retrieved 2026-06-22)
- `mutatis-mutandis`, `autoguardrails` repo descriptions (same source)
