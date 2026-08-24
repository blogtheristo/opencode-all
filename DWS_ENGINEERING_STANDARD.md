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

Version: 1.0

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: OpenCode 1.18.22 | Model: opencode/x-preview-f-free (ox-alpha) | Session: interactive HIC ping-pong (no batch SessionID — authored live with the founder, 24.08.2026) | Date: 24.08.2026 | Changes: Initial creation. Codifies the DWS Development Model (DDM-v1): the policy layer governing autonomous agent development on the opencode-all Living Engine runtime. Origin: HIC directive of 24.08.2026 after a real defect chain (PR #1886) proved that plausible-looking agent output required a mandatory audit pipeline, a second-pass critic, and a bounded retry threshold.

Session Links & References:

- Field note (runtime): `docs/field-notes/2026-08-24-opencode-all-living-engine.md`
- Trigger PR: https://github.com/blogtheristo/dws6/pull/1886
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_ENGINEERING_STANDARD.md

Document Status:

- Created: 24.08.2026
- Last Modified: 24.08.2026
- Language: English

***

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

***

## 1. Purpose & Scope

This standard defines how DWS ships software with autonomous agents. It is an **engineering standard, not an agent prompt**: any given system prompt is one implementation of this standard, and the standard must survive model changes (ox-alpha → qwen3-coder → anything stronger).

Scope: every autonomous or semi-autonomous code-producing run executed by the opencode-all Living Engine (`scripts/opencode-batch-worker.mjs`, `.workflows/opencode-all/`), including manual ping-pong sessions that borrow its gates.

Out of scope: human-authored commits, which follow the normal review flow (though they benefit from the same gates).

## 2. Engine vs Policy — The Two Layers

| Layer | Artifact | Changes |
| --- | --- | --- |
| **Runtime** — opencode-all "Living Engine" | `scripts/opencode-batch-worker.mjs`, queue/lifecycle state files | Code changes via PR |
| **Policy** — DWS Development Model (DDM), versioned | This standard + per-cycle instruction packs | Versioned per cycle (§12) |

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
- Model changes do not change this standard. If a new model requires different handling, that is a routing-rule update (§4) plus a version entry here — never a silent fork.
