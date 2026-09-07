---
title: DWS Engineering Standard
version: 1.0
created: 2026-08-24
last_modified: 2026-08-24
author: Lifetime Oy — HIC / ox-alpha session, manual ping-pong mode
language: en
languages_available: [en]
classification: INTERNAL
publication_status: ACTIVE
document_type: Engineering Standard / Autonomous Development Policy
toc: true
toc-depth: 3
---

# DWS Engineering Standard

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: Claude Code | Model: claude-haiku-4-5-20251001 | Session: claude/ai-software-engineering-krt01q | Date: 03.09.2026 | Changes: Added §14 AI+SWE Gap Closure Program — Five Enforcement Gates (DoD, Skill Verification, Decision Logging, DORA Metrics, Rule 5 Audit). Codifies five new mechanically-observable gates for Discipline Rules 1, 2, 4, 5, 9.

- Version: 1.1 [not latest] | Tool: OpenCode 1.18.22 | Model=opencode/x-preview-f-free (ox-alpha) | Session: interactive HIC ping-pong after #1888 recovery | Date: 24.08.2026 | Changes: Added §4a Working Contract, §8.1 Restart-Safe Handoff, §8.2 Evidence Hierarchy, §13.1 Invariant Design as the Human Role.

- Version: 1.0 [Latest] | Tool: OpenCode 1.18.22 | Model: opencode/x-preview-f-free (ox-alpha) | Session: interactive HIC ping-pong (no batch SessionID — authored live with the founder, 24.08.2026) | Date: 24.08.2026 | Changes: Initial creation. Codifies the DWS Development Model (DDM-v1): the policy layer governing autonomous agent development on the opencode-all Living Engine runtime. Origin: HIC directive of 24.08.2026 after a real defect chain (PR #1886) proved that plausible-looking agent output required a mandatory audit pipeline, a second-pass critic, and a bounded retry threshold.

Session Links & References:

- Field note (runtime): `docs/field-notes/2026-08-24-opencode-all-living-engine.md`
- Trigger PR: https://github.com/blogtheristo/dws6/pull/1886
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_ENGINEERING_STANDARD.md

Document Status:

- Created: 24.08.2026
- Last Modified: 24.08.2026
- Language: English

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Engine vs Policy — The Two Layers](#2-engine-vs-policy--the-two-layers)
3. [Cycle Model — Bounded 48-Hour Runs](#3-cycle-model--bounded-48-hour-runs)
4. [Instruction Packs & Model Routing](#4-instruction-packs--model-routing)
5. [Isolation & Restart-Safe State](#5-isolation--restart-safe-state)
6. [Mandatory Audit Gates](#6-mandatory-audit-gates)
7. [Second-Pass Critic](#7-second-pass-critic)
8. [Structured Outputs per Branch](#8-structured-outputs-per-branch)
9. [Continuation Rules](#9-continuation-rules)
10. [Retry & Stop Conditions](#10-retry--stop-conditions)
11. [NEEDS-HUMAN Boundaries](#11-needs-human-boundaries)
12. [Cycle Review Loop → DDM-v(N+1)](#12-cycle-review-loop--ddm-vn1)
13. [Governance](#13-governance)

---

## 1. Purpose & Scope

This standard defines how DWS ships software with autonomous agents. It is an **engineering standard, not an agent prompt**: any given system prompt is one implementation of this standard, and the standard must survive model changes (ox-alpha → qwen3-coder → anything stronger).

Scope: every autonomous or semi-autonomous code-producing run executed by the opencode-all Living Engine (`scripts/opencode-batch-worker.mjs`, `.workflows/opencode-all/`), including manual ping-pong sessions that borrow its gates.

Out of scope: human-authored commits, which follow the normal review flow (though they benefit from the same gates).

## 2. Engine vs Policy — The Two Layers

| Layer                                               | Artifact                                                         | Changes                   |
| --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------- |
| **Runtime** — opencode-all "Living Engine"          | `scripts/opencode-batch-worker.mjs`, queue/lifecycle state files | Code changes via PR       |
| **Policy** — DWS Development Model (DDM), versioned | This standard + per-cycle instruction packs                      | Versioned per cycle (§12) |

The engine executes; the standard decides what is worth executing, what evidence a run must produce, and when a human must decide. Neither layer may silently absorb the other's responsibilities: the engine must not encode policy in code comments, and the policy must not depend on one model's habits.

## 3. Cycle Model — Bounded 48-Hour Runs

1. Run opencode-all autonomously for **48 hours** across eligible branches.
2. Collect structured outputs per session (§8).
3. The HIC reviews the batch and converts patterns into the next instruction pack: common defects, better prompts, stricter tests, retry rules, routing rules.
4. Start a fresh 48-hour cycle with those instructions, preserving the prior cycle as evaluation history (§12).

A cycle is bounded in time, not in task count. When the window closes, in-flight sessions finish their current state-machine transition and stop; nothing carries over half-applied.

This loop is reinforcement-style learning of **policy**, not true RL: no weight training, no automated reward signal. It improves instructions and evaluation between runs.

## 4. Instruction Packs & Model Routing

Each cycle's instruction pack is a versioned artifact containing:

- Task templates for recurring work types;
- Model-routing rules (which model handles which task class, and why);
- Mandatory test and audit gates for the cycle's risk profile;
- Known architectural constraints (what agents must not touch or restructure);
- Repair patterns that worked before;
- Escalation rules for security-sensitive changes.

Routing is deterministic where possible: classification by path, file type, and risk tier — never by model judgment alone (Engineering Discipline Rule 5).

### 4a. Working Contract (plan.md formalized)

Every autonomous task begins by writing a machine-readable working contract
(the plan.md is not agent memory — it is a binding agreement):

- Objective and the exact success criteria;
- Scope: base commit, files/directories allowed to change, forbidden paths;
- Planned verification (which gates and tests will prove completion);
- Stop conditions and escalation triggers.

Deviations from the contract require an explicit re-agreement recorded in the
handoff (§8.1). A run that silently exceeds its contract fails the contract
gate regardless of test results.

## 5. Isolation & Restart-Safe State

- Every session runs in its own git worktree at a deterministic path with its own branch; ACP never runs in the primary checkout.
- Queue state lives in `.workflows/opencode-all/queue.jsonl`; state transitions are restart-safe — a killed worker resumes from persisted state, never from memory.
- Removal policy: a failed session's worktree is removed only when setup failed or nothing is reviewable; branches with commits are preserved; resumed sessions are never auto-removed.
- Self-reproducibility rule (learned in PR #1886): a commit must build and pass its tests in a clean checkout with zero uncommitted working-tree state. A green run that depended on dirty-tree residue is recorded as a false GREEN.

## 6. Mandatory Audit Gates

Every run passes through all seven gates, in order. A gate failure stops the pipeline at that gate.

1. **Scope gate** — list changed files, classify risk, reject unrelated changes.
2. **Compile gate** — syntax, typecheck, lint, focused tests, then relevant full tests.
3. **Behavioral gate** — happy path, failure path, malformed input, auth bypass, retries, timeouts, duplicate execution.
4. **Diff gate** — inspect the actual diff for duplicate declarations, dead branches, widened response shapes, leaked data, weak error handling, unrelated refactors.
5. **Contract gate** — verify the handoff against the original task, not merely whether tests pass.
6. **Provenance gate** — require commit SHA, changed-file list, commands and outputs, limitations, and an explicit GREEN or NEEDS-HUMAN verdict.
7. **Human gate** — the classes in §11 never auto-merge.

Gates 1–4 are mechanizable and belong in the worker's validation stage; gates 5–7 require judgment and produce structured findings either way.

## 7. Second-Pass Critic

For ox-alpha output specifically, a second-pass critic receives **only** the task, the diff, and the test output — not the implementer's reasoning — and must attempt to disprove the implementation before approval is granted.

The critic's approval is another review signal, not proof. Rationale: PR #1886's health patch produced plausible code with duplicate fields, overlapping branches, and a broken test helper — exactly what a task/diff/test-only critic catches.

## 8. Structured Outputs per Branch

Each branch produces, at minimum:

- Commit SHAs with messages;
- Changed-file list with per-file risk classification;
- Commands executed and their outputs (or audit-record references);
- Test results (focused + relevant full suites);
- Review findings (gates 4–5, critic);
- Runtime/model data (tool, model, session, duration);
- Unresolved risks and limitations;
- Final verdict: GREEN or NEEDS-HUMAN.

## 9. Continuation Rules

The batch continues automatically across sessions: a finished session's completion signal unblocks dependent entries without human action. A session that ends HALTED may be resumed by cleanup logic, provided resumption reads its state from the queue record, never from assumptions.

## 10. Retry & Stop Conditions

- A failed session may retry up to the worker's attempt cap, but only if the failure cause changed between attempts (new error class, new failing gate). Identical repeated failures do not consume retries.
- **Quality threshold:** two independent repair or review passes failing the same focused test means NEEDS-HUMAN — not endless retries.
- Retry infrastructure must be self-healing: a removed no-diff worktree leaves no orphan branch behind to block the next attempt (see §5 removal policy).

## 11. NEEDS-HUMAN Boundaries

The following never auto-merge, regardless of gate outcomes:

- Security changes (auth, secrets, sandboxing);
- Auth/RLS and database migrations;
- Payments and billing paths;
- Webhooks;
- Public endpoints;
- Deployment configuration (Cloud Run, Cloud Build, infra specs);
- Ambiguous scope or contract-gate mismatch;
- Repeated failure (§10 quality threshold).

NEEDS-HUMAN is a first-class outcome, not a failure of autonomy. The system is working correctly when it escalates precisely.

## 12. Cycle Review Loop → DDM-v(N+1)

Between cycles, the HIC (assisted by Boardy for synthesis) produces the next version of the policy:

1. Defect patterns from the scorecard become prompt and template changes;
2. Successful repairs become codified repair patterns (§4);
3. New gate gaps become stricter tests or new gate checks;
4. Misrouted tasks become routing-rule updates;
5. Every accepted and rejected patch is recorded with rationale.

Each cycle yields: an instruction pack, evaluation results, accepted/rejected patch ledger, and a changelog — bumping this standard's version when rules change. Prior cycles are preserved as evaluation history and are never deleted.

Scorecard dimensions: defects introduced, defects caught (and by which gate), fixes applied, regressions, useful output ratio, NEEDS-HUMAN precision.

## 13. Governance

- This standard is versioned under the DWS Document Standard (header block, `***` delimiters, lockstep filename-version rule).
- Registered in `DWS_STANDARDS_LIBRARY.md` §3.2 (Process / Quality).
- Rule source hierarchy: CLAUDE.md Non-Negotiable Rules > this standard > instruction packs > agent prompts.

### 13.1 Invariant Design as the Human Role

"No one reads code" must never mean "no one checks the system". When code
becomes derivative, the real product is the decision-and-evidence chain. The
human role rises from reading code to designing the invariants it must hold:
boundaries (what may never change), tripwires (how violations are detected),
and recoverability (how everything is restored). Every mechanism in this
standard — gates, canaries, bundles, restore exercises — is that design work
made executable.

- Model changes do not change this standard. If a new model requires different handling, that is a routing-rule update (§4) plus a version entry here — never a silent fork.

## 14. AI+SWE Gap Closure Program — Five Enforcement Gates (2026-09-03)

**Program Reference:** `docs/field-notes/2026-09-03-dws6-ai-swe-process-audit.md` (audit), `PR #1959` (implementation)

This section codifies five enforcement gates added in the AI+SWE gap closure program (September 2026). These gates make four judgment rules (Discipline Rules 1, 2, 4, 5) mechanically observable and block merge when violated.

### 14.1 Gap 1: Definition of Done (DoD) Gate

**Purpose:** Prevent merge of code that lacks intent-level test coverage or skips tests.

**Mechanism:**

- CI gate `validate:dod` (`.github/workflows/validate-dod.yml`) runs before merge
- Blocks if: (a) code coverage drops below baseline (60% statements, 55% functions), or (b) any `.skip()` or `.skip(description)` markers exist on tests
- Enforces Discipline Rule 9 (tests verify intent, not just behavior)
- Implementation: `scripts/validate-dod.sh`, integration via pre-merge hook

**Effect:** Prevents test-optional merges; test presence + intent become non-negotiable

### 14.2 Gap 2: Skill Verification Gate

**Purpose:** Experimental skills cannot transition to active status without verified test runs on all declared surfaces.

**Mechanism:**

- `skills/manifest.json` declares skill status (active/experimental/deferred) and per-surface support (web/cli/desktop/mobile)
- CI gate `skills:verify-surfaces` (`.github/workflows/verify-skills.yml`) checks that all experimental skills have `verifiedSurfaces` entries
- Blocks merge if experimental skill lacks verification for any declared surface
- Enforces §2 of this standard (Isolation & Restart-Safe State) applied to skill hygiene

**Effect:** Experimental skills stay experimental until test evidence exists on all target surfaces; accidental production escalation is impossible

### 14.3 Gap 3: Decision Logging & Agent Decision Audit

**Purpose:** Make agent judgment/routing/transform categorization observable per decision, weekly.

**Mechanism:**

- PostToolUse hook `.claude/hooks/decision-log.sh` runs after every Bash command
- Categorizes each call: judgment/transform/routing/routine/unknown
- Logs to `.claude/hooks/audit/decision-log.json` (JSONL, gitignored)
- Weekly report `scripts/analyze-decision-log.ts` generates `docs/decision-log-reports/weekly-*.md`
- Flags anomalies: high-volume judgment (should be code), high-volume routing (should be deterministic), unknown categorization

**Effect:** Agent invocation patterns become auditable; Discipline Rule 5 violations surface via anomaly detection, not code review

### 14.4 Gap 4: DORA Metrics Dashboard

**Purpose:** Measure delivery speed (lead time, frequency) and stability (change failure rate, MTTR) as continuous signals of engineering discipline in action.

**Mechanism:**

- Weekly script `scripts/dora-metrics.ts` calculates four DORA metrics from git log + GitHub API
- GitHub Actions `dora-weekly.yml` runs every Monday 09:00 UTC
- Metrics appended to `docs/dora-dashboard.md`; also inserted into Supabase `dora_weekly_reports` table
- Admin dashboard displays 4-card summary + trend charts (see `docs/DORA_DASHBOARD_INTEGRATION.md`)
- Enforces Discipline Rule 4 (goal-driven execution) by making cycle time and reliability visible

**Effect:** Engineering velocity + stability become real-time dashboarded; changes to discipline immediately correlate to observable metrics

### 14.5 Gap 5: Rule 5 Audit — Model-Call Site Categorization

**Purpose:** Audit and prevent deterministic transforms or routing logic being delegated to the model (Discipline Rule 5 violation).

**Mechanism:**

- `scripts/audit-rule-5.ts` greps codebase for model call sites (.messages.create, new Anthropic, .invoke, .generate)
- Categorizes each site: JUDGMENT (safe), ROUTING (concern), TRANSFORM (fix required), UNKNOWN
- Outputs `docs/audit-rule-5-findings.json` (structured results) + `docs/audit-rule-5-report.md` (human-readable)
- Report flags sites with high risk (loops, retry logic, error contexts, missing await)
- Not yet CI-blocked; produces audit trail for security review and manual intervention

**Effect:** Model-misuse patterns become codified, discoverable, and prioritized for refactoring; removes guesswork from "is this call doing a judgment or a transform?"

### 14.6 How the Five Gates Reinforce Each Other

| Gate                           | Detects                                                | Prevents                                            | Enabled By                      |
| ------------------------------ | ------------------------------------------------------ | --------------------------------------------------- | ------------------------------- |
| **DoD (Gap 1)**                | Untested code, skipped tests                           | Silent behavioral regressions                       | CI automation                   |
| **Skill Verification (Gap 2)** | Unverified experimental skills                         | Surface mismatches, untested agent surfaces         | Manifest governance             |
| **Decision Log (Gap 3)**       | Off-policy agent decisions (routing as judgment)       | Silent autonomy boundary violations                 | Audit trail + weekly report     |
| **DORA (Gap 4)**               | Discipline drift (cycle time / reliability regression) | Shipping reliably without knowing if you are        | Real-time metrics               |
| **Rule 5 Audit (Gap 5)**       | Deterministic operations delegated to model            | Performance waste, non-determinism, compliance risk | Grep + heuristic categorization |

Together, these gates make Discipline Rules 1, 2, 4, 5, and 9 observable and enforceable without requiring human review of every commit. They are the **tripwires** (§13.1) that detect invariant violations in real time.

### 14.7 Integration with This Standard

All five gates are registered as additional **mandatory audit gates** (extending §6):

- **Gate 5a (new):** DoD gate — coverage baseline + skip count
- **Gate 5b (new):** Skill Verification gate — manifest surface coverage
- **Gate 5c (new):** Rule 5 Audit gate — model-call categorization (advisory, not blocking)
- **Gate 5d (new):** Decision Log gate — decision pattern anomalies (weekly review, not blocking)
- **Gate 5e (new):** DORA Metrics gate — velocity/stability regression (advisory, not blocking)

Gates 5a–5b are hard CI blocks. Gates 5c–5e are advisory (produce audit records + weekly reports) and feed into HIC decision-making (§12 cycle review). No gate is silent: failures produce structured findings.

---

**Implementation Reference:**

- DoD: `scripts/validate-dod.sh`, `.github/workflows/validate-dod.yml`
- Skill Verification: `scripts/verify-skill-surfaces.ts`, `.github/workflows/verify-skills.yml`
- Decision Log: `.claude/hooks/decision-log.sh`, `scripts/analyze-decision-log.ts`
- DORA: `scripts/dora-metrics.ts`, `.github/workflows/dora-weekly.yml`, `docs/DORA_DASHBOARD_INTEGRATION.md`
- Rule 5: `scripts/audit-rule-5.ts`, `docs/audit-rule-5-report.md`
