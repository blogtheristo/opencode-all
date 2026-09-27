---
title: Field Note — Workflow v2 Procedural Graphs, Chapters 0–8 Complete
date: 2026-09-22
status: PENDING_REVIEW
branch: claude/workflow-v2-procedural-graphs-k2324l
pr: 2059
author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
owner: Lifetime Oy (Business ID: 0772407-9)
---

# Field Note — 2026-09-22: Workflow v2, Chapters 0–8

## 1. What happened

Built **Workflow v2** — an implementation of the "Procedural Graphs" pattern for
long-horizon AI agent tasks — end to end, from engine to nine domain graphs, on
branch `claude/workflow-v2-procedural-graphs-k2324l` (PR #2059).

The problem it solves: an agent running a long, multi-step task tracks its own
progress in conversational memory, and conversational memory degrades. The model
hallucinates having completed a step it skipped, or loops on a broken tool call.
Workflow v2 moves that state **out of the chat** into an explicit graph the code
enforces.

### The engine (`src/agents/workflow-v2/`)

Two roles, per the pattern:

- **Executor** — acts only within the current node, and may only transition along
  edges declared in that node's `allowedNext`. An illegal transition throws
  `GraphValidationError` at runtime; it is not a prompt-level request.
- **Refiner** — reads a completed run's `ExecutionTrace` offline and proposes
  graph edits for future runs (the self-evolution half of the pattern).

Traces checkpoint to disk after every step. The engine reuses the existing
provider-agnostic `LLMClient` — no new provider wiring.

### The hard gate

`ApprovalToken` / `computeApprovalHash` / `ApprovalRequiredError`: a transition
leaving a gated node requires a SHA-256 hash binding a human's approval to the
**exact draft text** plus that graph and edge. An approval cannot be replayed
against a different draft. Built because CLAUDE.md's RED-zone rule on outbound
email must not depend on an LLM choosing to honour a prompt (Discipline rule 12,
fail loud).

### Phase 1 — KYA-gated typed transitions

`runExecutorStepTyped()` routes the transition decision through the pre-existing
`kya-jev` primitive (`src/agents/kya-jev.ts`) instead of regex-parsing prose out
of an LLM reply. Two consequences:

1. A graph run now requires a **cryptographically signed KYA verdict** to make any
   transition decision at all — `kya-jev` refuses to run without one, and a
   self-constructed `{decision:'allowed'}` object fails signature verification.
2. The typed result carries per-option probabilities across every legal next node,
   which is recorded for the Refiner. A near-even split between two options is a
   strong signal the node description is ambiguous — exactly what the Refiner's
   "identify ambiguity" rule is looking for.

### Nine chapters

| #   | Chapter                            | Gate                                 |
| --- | ---------------------------------- | ------------------------------------ |
| 0   | B2B Growth Funnel (campaign level) | —                                    |
| 1   | Sales Outreach                     | `HIC_APPROVAL_GATE → SEND`           |
| 2   | Investor Outreach                  | `HIC_APPROVAL_GATE → SEND`           |
| 3   | Compliance Assessment              | none (read-only)                     |
| 4   | Construction Site Assessment       | none (read-only)                     |
| 5   | Content Publishing                 | `HIC_APPROVAL_GATE → PUBLISH`        |
| 6   | Helpdesk Triage                    | `HIC_APPROVAL_GATE → SEND_REPLY`     |
| 7   | KYA Incident Response              | `SNAP_CONFIRM → SNAP_EXECUTE`        |
| 8   | Case Coordination (Themis)         | `HIC_APPROVAL_GATE → EXECUTE_ACTION` |

Each is grounded in the real semantics of its backing skill doc or code — Chapter 1
maps 1:1 onto the existing `OutreachStatus` enum, Chapter 5 onto `/blog-draft`'s
Rule 13 loop, Chapter 7 onto `/kya`'s IJS tiers — rather than inventing new
mechanics.

## 2. The insight

Three things are worth keeping from this build.

**The gate node id became the contract.** Chapters 1, 2, 5, 6 and 8 all reuse the
literal node id `HIC_APPROVAL_GATE`, which `DEFAULT_GATED_NODE_IDS` in `runner.ts`
already enforces in code. Each new chapter therefore inherited runtime approval
enforcement _for free, with no engine change_. That was not designed up front — it
emerged from naming the node the same thing twice, and is the single highest-leverage
accident in the build.

**Not every chapter needs a gate, and forcing one would have been worse.**
Chapters 3 and 4 are read-only assessments that issue no outbound action. Adding an
approval gate would have been cargo-culting the pattern rather than applying it.
Recording _why_ they have no gate is more useful than the gate would have been.

**Convergent discovery, independently.** `DWS7_ROADMAP.md` Phase 4.1 had already
scoped this exact problem months earlier — PR 138 (durable resumable multi-agent
workflows, via Temporal.io) and PR 146 (human-in-the-loop approval queue) — with no
reference to this work. Separately, Google Cloud's GITEX AI Türkiye framing named the
same three goals DWS's own north-star uses. Two unconnected sources converging on one
problem shape is a stronger market-timing signal than either alone, which is why it
went into the PhD thesis as Key Contribution #60 rather than staying a note.

## 3. Verification

- 51/51 unit tests pass, all deterministic and offline (no live LLM calls, no network).
- The new gate tests were checked for vacuity: temporarily adding a `REVISE → PUBLISH`
  bypass to Chapter 5's graph failed 2 tests as intended; the sabotage was reverted.
  A test that cannot fail is not evidence.
- `tsc --noEmit` clean across all `workflow-v2` paths; `scripts/evidence-audit.mjs`
  6/6 compliant.

## 4. Documentation updated

- `DWS7_ROADMAP.md` v1.7.1 → 1.7.2 — Phase 4.1 PRs 138/144/145/146 cross-referenced
  to what Workflow v2 already delivers, so that phase starts from the shipped pattern.
- `Admin/ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md` v1.0 → 1.1 — new §11 specifying the
  audit-trail view.
- Thesis lockstep v4.11 → 4.12 on all four files: V3Thesis_EN/FI §10.34
  (implementation), PHD_FIREHORSE_EN/FI §14.54 + Key Contribution #60 (market signal).
- `docs/workflow-v2-chapters-roadmap.md`, `-sales-outreach-chapter-one.md`,
  `-jev-kya-integration-plan.md`.

## 5. Next steps

The graphs exist; none has been **run for real**. Two things block that:

1. **Mission Control queue surface** — a graph paused at `HIC_APPROVAL_GATE` needs to
   appear where the HIC acts. `mission-control.js` already has the right shape
   (`CENTRES`, `HIC_ACTIONS`); it needs an `approve_draft` / `reject_draft` action and
   a queue item carrying `{ graphName, runId, currentNode, draftText }`.
2. **`workflow_v2_runs` Supabase table** — `persistTrace()` writes local JSON today,
   which no web dashboard can read. Authoring the migration is GREEN; applying it is
   RED and needs the HIC.

## 6. Known conflict, unresolved

`.claude/commands/email.md` (the `/email` skill) still documents **Resend** as its
transport. CLAUDE.md Non-Negotiable Rule 4 says Amazon SES only, and
`src/outreach/prospect-email-templates.ts` already says "ready for Amazon SES". The
skill doc is stale against policy. Chapters 1 and 2 route around it deliberately, but
the doc should be corrected independently of Workflow v2 — flagged here rather than
silently worked around.

## 7. Learning Standard record (DWS_LEARNING_STANDARD.md — EU AI Act Art. 14)

| Step | Description           | Status                                                                 |
| ---- | --------------------- | ---------------------------------------------------------------------- |
| 1    | KB update             | `kb/raw/signals/2026-09-22-workflow-v2-procedural-graphs.md`           |
| 2    | Field note            | This file                                                              |
| 3    | Learn/ HTML render    | `Learn/2026-09-22-workflow-v2-procedural-graphs.html`                  |
| 4    | Drive export          | N/A — Drive MCP not connected in this session; repo is source of truth |
| 5    | HIC decision question | §8 below                                                               |
| 6    | Calendar commitments  | N/A — no dated external commitment arose from this session             |

## 8. HIC decision question

> **Which chapter runs for real first, and on which surface?**
>
> Chapter 1 (Sales Outreach) is the obvious candidate for revenue, but it means a real
> prospect receives a real email through a gate that has never been exercised in
> production. Chapter 3 (Compliance Assessment) is read-only and cannot send anything
> — it would prove the engine on live data with zero outbound risk, but proves nothing
> about the approval gate.
>
> Recommendation: **Chapter 3 first** as an engine shakedown on real data, then
> Chapter 1 once the Mission Control queue exists to catch its gate. Running Chapter 1
> before that queue exists means the approval gate has nowhere to surface, and it
> would be approved in a terminal — which is exactly the failure mode the placement
> decision was made to prevent.

## 9. Parked, not forgotten

Thirteen blog drafts in `docs/blog-drafts/` remain `Status: DRAFT` (vendor-dependency
series, KYA one-signed-page FI/EN, sovereignty-axis in 5 languages, HIC
hallintamalli, Lifetime World Model, process-description posts). None was touched
this session. Per Rule 13 they publish only after the HIC reads the full text and
approves each one — they are **parked awaiting the HIC**, not abandoned.
