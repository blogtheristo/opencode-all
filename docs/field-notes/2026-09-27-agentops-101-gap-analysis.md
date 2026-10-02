# AgentOps 101 vs. DWS Engineering Discipline and KYA+I

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/fix-selected-issues-2099-2058-1847-1846-1833 | Date: 27.09.2026 | Changes: Initial gap analysis for issue #2058 using NVIDIA's official SB61080 abstract and current DWS controls. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

Session Links & References:

- NVIDIA GTC SB61080: https://www.nvidia.com/de-de/gtc/session-catalog/sessions/gtceu26-sb61080/
- Issue: https://github.com/blogtheristo/dws6/issues/2058

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-27
- **Author:** GitHub Copilot CLI, on behalf of Lifetime Oy
- **Location:** DWS6 repository, isolated local worktree
- **Context:** Issue #2058; comparison of NVIDIA GTC Europe session SB61080 with `docs/system-config/DISCIPLINE.md`, KYA+I, and the Agent Productization Rule

## Ontology Tags

- **Geography:** Europe
- **Sector:** Software > Agent Operations
- **Entities:** NVIDIA GTC, SB61080, AgentOps, KYA+I, DWS Engineering Discipline, ThinkingBox
- **Systems:** `docs/system-config/DISCIPLINE.md`, `.claude/commands/kya.md`, `CLAUDE.md`, `skills/manifest.json`
- **Temporal Context:** 2026-Q3
- **Confidence:** Medium-high. NVIDIA's official abstract and session metadata were available; the full recording or slides were not.

## The Story

NVIDIA describes SB61080, “AgentOps 101: MLOps Discipline for Agentic Systems,” as a beginner technical overview of why agents fail differently from conventional models, which MLOps practices transfer, and how evaluation, observability, guardrails, and a maturity checklist move multi-step systems from prototype to production. Speakers are Michael Balint and William Benton.

The source available for this analysis is the official abstract and takeaways, not the full talk. The comparison therefore evaluates the practices NVIDIA explicitly names; it does not attribute detailed controls, thresholds, or architecture claims that are absent from the abstract.

## Side-by-Side Gap Analysis

| SB61080 practice                                                        | DWS equivalent                                                                                                                                            | Assessment                                                                                                 | Recommendation                                                                                            |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Treat agentic systems as operationally different from predictive models | Discipline Rule 5 separates model judgment from deterministic routing; Rule 12 requires loud failures; KYA governs identity, permissions, and termination | Already covered in principle                                                                               | Keep. DWS is more explicit about deterministic control boundaries.                                        |
| Evaluate multi-step agent behavior                                      | Discipline Rule 9 requires intent-verifying tests; ThinkingBox validates tool side effects and stateful workflows                                         | Covered operationally, weakly linked from the 12 Rules                                                     | Add a cross-reference in future guidance, not a thirteenth rule.                                          |
| Observe execution across the full agent path                            | KYA Article 12 evidence, `agent_executions`, Aspire telemetry, and provider/runtime metadata                                                              | Covered, but fragmented                                                                                    | Consolidate these into one production-readiness checklist.                                                |
| Apply guardrails around agent actions                                   | KYA trust score, capability manifests, sandbox isolation, TC-4 Leash Snap, Discipline Rules 3 and 12                                                      | Already covered                                                                                            | No policy change. DWS is stronger than the abstract-level requirement.                                    |
| Use a maturity checklist from prototype to reliable production          | Productization requires CLI, JSON, MCP, skill registration, and documentation                                                                             | **Gap:** discoverability is defined, operational readiness is not one explicit gate                        | Adopt a small AgentOps Production Readiness Gate.                                                         |
| Establish clear operational ownership for “self-owned” agents           | Agent configs carry technical metadata and budgets                                                                                                        | **Gap:** no mandatory named owner, SLO, rollback/runbook, or retirement trigger in the Productization Rule | Extend the Productization Rule by proposal, after HIC review.                                             |
| Track runtime/provider changes as production changes                    | KYA+I defines IJS and provider-chain re-evaluation                                                                                                        | **Partial gap:** `/kya inference` and provider-chain reporting are still marked planned                    | Track as implementation backlog; do not claim this is enforced until the command and evidence path exist. |

## Proposed Changes — Not Applied

The following wording is proposed for HIC review. It is intentionally not merged into `CLAUDE.md` or `DISCIPLINE.md`.

### Proposal A — extend Discipline Rule 4

> For an agentic system, the done-condition includes a multi-step outcome evaluation, trace coverage for tool calls and side effects, exercised guardrails, and a tested rollback path.

### Proposal B — extend the Agent Productization Rule

> A production agent must declare an accountable owner, service objective, observable health signal, incident/runbook path, rollback or disable mechanism, and retirement trigger in addition to CLI, JSON, MCP, and skill-manifest exposure.

### Proposal C — close the KYA+I implementation/documentation gap

Create a separate implementation issue for `/kya inference` that returns the provider chain, IJS, jurisdiction changes, and evidence timestamp. Until that ships, documentation must continue to label the capability planned.

## The Insight

DWS does not lack guardrails. Its genuine gap is that mature controls exist in separate places—discipline, KYA, ThinkingBox, runtime telemetry, and productization—but no single gate proves that a production agent has passed all of them and has an accountable operator. SB61080 adds value by making that lifecycle explicit, not by replacing DWS rules.

## Learning Outcome Status

1. **KB:** N/A — this field note is the repository source for a one-session external-session comparison; no raw source file or full recording was supplied for ingestion.
2. **Field note:** Complete.
3. **Learn HTML:** Generated from this note.
4. **Drive export:** N/A — no Drive tool is available in this session.
5. **HIC decision:** Pending below.
6. **Calendar:** N/A — no dated commitment was created.

## Next Steps

- [ ] HIC Q1 (two-way door): approve, revise, or reject Proposals A and B. **Recommendation: approve both as one compact AgentOps Production Readiness Gate, without adding a thirteenth discipline rule.**
- [ ] If approved, edit `CLAUDE.md` and `docs/system-config/DISCIPLINE.md` in a dedicated standards change.
- [ ] Open a separate implementation issue for the planned `/kya inference` provider-chain evidence path.

---

Version 1.0 · 27.09.2026
Copyright © 2026 Lifetime Oy
Classification: INTERNAL
