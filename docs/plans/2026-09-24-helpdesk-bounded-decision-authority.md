# Specification: Helpdesk Bounded Decision Authority — AI that resolves, not only replies

---

VERSION AND AGENT HISTORY

- Version: 1.2
- Status: P1 shadow mode implemented (off by default); decision 1 approved by HIC 24.09.2026; decisions 2–4 open
- Classification: INTERNAL
- Document type: Specification
- Author: Claude Code (standby runtime) + risto.paarni2024@lifetime.fi
- Date: 2026-09-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/blissful-davinci-8782wy

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: P1 shadow mode implemented on the Phase 1 core (HIC "Kyllä", 24.09.2026): `src/decision-journey/emitter.ts`, `src/decision-journey/helpdesk-shadow.ts`, wiring in `helpdesk.agent.ts` and `support-review.routes.ts`, view `helpdesk_shadow_agreement` in migration 089. Enabled by `DECISION_JOURNEY_SHADOW=1` + `WORLD_MODEL_VERSION` after 089 is applied. Only A1 is classifiable today; the VIP allowlist check is recorded as unverified.
- Version: 1.1 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC approved §10 decision 1 — action classes A1–A4 and rollout order A1 → A2 → A3, A4 later.
- Version: 1.0 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Initial specification, requested by the HIC after the Oura warranty signal (`kb/raw/signals/2026-09-24-ai-support-decision-authority-oura.md`).

Related Documents:

- `src/agents/helpdesk.agent.ts` — current agent (drafts and recommends, never sends; escalation threshold 0.6)
- `kb/wiki/concepts/support/refund-policy.md`, `escalation-rules.md` — current policy
- `Legal/KYA_STANDARD_v1.md` §14.2 (mandate gating by ATS band), §14.2.1 (tenant profiles, tighten-only), §14.5 (evidence chain)
- `src/identity/ats-engine.ts` `evaluateMandateGate()` — existing pre-execution gate
- `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` v1.5 — the event model every decision is written to

---

## 1. Problem

In the Oura case, the customer was served above expectations because the AI **had the authority to resolve** the problem. It was more than a better chatbot. Today the DWS Helpdesk agent has no such authority by design: it drafts a reply, recommends an action and waits for a human. Every refund and chargeback is escalated regardless of size. That keeps risk low, and it guarantees "we'll get back to you".

Goal: give the agent **bounded, evidenced, reversible** decision authority per action class, so that the default outcome of a routine case is _resolved now_ instead of _queued_, without loosening any KYA floor.

## 2. Principles

1. **Authority is granted per action class, never globally.** Each class has a ceiling, required evidence, a KYA band and a phase.
2. **The agent may decide only when evidence confirms the facts.** The customer's description is an observation, not evidence. Device telemetry, contract state and order history are evidence.
3. **Every decision is a `decision_journey` event, written at decision time.** Here `decision_by` = the agent id, acting under a mandate id. There is no after-the-fact logging.
4. **Tighten-only.** Tenant profiles (KYA §14.2.1) may narrow any class. Nothing here lowers the two platform floors (no mandates below ATS 0.50; HNP only at ATS ≥ 0.90).
5. **The customer can always reach a human.** "Speak to a human" still escalates immediately (`escalation-rules.md`).
6. **Authority is earned by measured agreement.** Before going live, each class runs in shadow mode, where the agent decides and a human executes.

## 3. Action classes

| Class                                       | Example                                                                                         | Required evidence                                                                          | Ceiling (proposal; HIC sets)                                  | KYA (proposal)                      | Reversible                     | Phase                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------- | ------------------------------ | ----------------------------------------------- |
| **A1 Resolve informational**                | How-to, known issue, plan-limit explanation                                                     | Match in `known-issues.md` / `plan-limits.md` / docs                                       | n/a (no value transfer)                                       | ATS ≥ 0.80                          | Yes (follow-up reply)          | Shadow → live                                   |
| **A2 Service continuity credit**            | Temporary plan-limit uplift while an incident is open                                           | Open incident or verified platform fault in logs                                           | Tenant-set; default **0** until HIC sets a value              | ATS ≥ 0.80, decision mandate        | Yes (uplift expires)           | Shadow → live                                   |
| **A3 Warranty replacement — edge hardware** | Jetson / Control Room device under an active service subscription, fault confirmed by telemetry | `edge_devices` health telemetry (SYSTEM_CONFIRMED) + active subscription + within warranty | One replacement unit per device; ≤ 1 per device per 12 months | ATS ≥ 0.90; HNP per tenant profile  | Partly (return of faulty unit) | Shadow → live                                   |
| **A4 Refund within policy**                 | 14-day money-back on an unactivated one-time product                                            | Order record + activation state + request date                                             | Tenant-set; default 0                                         | Payment mandate per KYA §14.2 bands | No (money out)                 | Later — requires a change to `refund-policy.md` |
| **Never delegated**                         | Enterprise/VIP, GDPR erasure, security incidents, legal, press, safety, disputes                | —                                                                                          | —                                                             | —                                   | —                              | Always human                                    |

A3 is the direct analogue of the Oura case. Warranty servicing is already part of the edge device offer ("24/7 technical support + warranty servicing + remote configuration", `dws10.com/config/products.json`), and device health is already observable. The customer's promise exists today; only the authority to keep it immediately is missing.

## 4. Pre-execution gate

The agent executes an action only if **all** of the following hold. Otherwise it falls back to today's behaviour (draft + recommend + escalate).

1. The action class is enabled in the tenant profile, and the amount or quantity is within its ceiling.
2. ATS band permits it (`evaluateMandateGate()`, extended from payment mandates to decision mandates).
3. Every piece of required evidence for the class is present and machine-verified; none of it comes from the customer's text alone.
4. Agent confidence ≥ the class threshold. Proposal: 0.85, above the current 0.6 escalation floor.
5. The customer is not on the VIP/enterprise allowlist, and no "always escalate" trigger is present.
6. Frequency limit per customer and class is not exceeded.
7. The class-level kill switch is off (§6).

## 5. Evidence written per decision (decision_journey v1.5)

A3 example:

| #   | event_type           | emitted_by       | decision_by                 | evidence_quality             | evidence_refs                  |
| --- | -------------------- | ---------------- | --------------------------- | ---------------------------- | ------------------------------ |
| 1   | OBSERVATION_RECORDED | helpdesk_agent   | —                           | MANUAL_ENTRY (customer text) | ticket id                      |
| 2   | PATH_RECOMMENDED     | helpdesk_agent   | —                           | SYSTEM_CONFIRMED             | telemetry ref, subscription id |
| 3   | PATH_ACCEPTED        | helpdesk_agent   | helpdesk_agent (mandate id) | SYSTEM_CONFIRMED             | mandate id, telemetry ref      |
| 4   | ACTION_STARTED       | fulfilment       | —                           | SYSTEM_CONFIRMED             | replacement order id           |
| 5   | ACTION_COMPLETED     | fulfilment       | —                           | SYSTEM_CONFIRMED             | delivery confirmation          |
| 6   | OUTCOME_RECORDED     | device telemetry | —                           | SYSTEM_CONFIRMED             | health after 14 days           |

The mandate issue/execute events go to `kya_mandate_events` (KYA §14.5), and ticket state goes to `ticket_events`. The three chains share the ticket id and mandate id.

## 6. Human oversight and guardrails (EU AI Act Art. 14)

- **Override** is a new event (`PATH_REJECTED`, `decision_by` = human reviewer), never an edit.
- **Sampling:** a human reviews a fixed share of executed decisions per class each week. Proposal: 20 % in the first 90 days of a class.
- **Automatic kill switch per class:** the class returns to shadow mode if the reversal rate exceeds its threshold (proposal 5 % over the last 50 decisions), or if any decision exceeds a ceiling.
- **Customer transparency:** the reply states that an AI agent made the decision and how to reach a human.

## 7. Measures

Always shown together, so that speed can never be optimised at the expense of correctness:

| Measure                                               | Why                                |
| ----------------------------------------------------- | ---------------------------------- |
| Time to resolution (median)                           | The customer-visible result        |
| Share resolved without queue                          | The Oura effect                    |
| Human agreement rate (shadow mode)                    | Earns the authority                |
| Reversal rate (live)                                  | Detects wrong authority            |
| Outcome confirmed (e.g. device healthy after 14 days) | Evidence, not satisfaction surveys |

## 8. Phases

| Phase         | Content                                                                                                  | Exit criterion (proposal)              |
| ------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| P0            | This spec, HIC decisions (§10)                                                                           | HIC approval                           |
| P1 Shadow     | Agent computes the decision and writes `PATH_RECOMMENDED`; a human executes as today; agreement measured | ≥ 50 cases per class, agreement ≥ 95 % |
| P2 Live A1–A3 | Gate enforced, execution by agent, sampling + kill switch                                                | Reversal ≤ 5 %, no ceiling breach      |
| P3 A4 refunds | Payment mandate per KYA §14.2; requires `refund-policy.md` change                                        | HIC policy change signed               |

## 9. Code touch points (not implemented)

- `src/agents/helpdesk.agent.ts`: add an `execute` result alongside `Recommendation`, gated by §4; shadow mode writes the decision without executing.
- `src/identity/ats-engine.ts`: a decision-mandate variant of `evaluateMandateGate()` with per-class ceilings from the tenant profile.
- Event emission to `decision_journey_event` (migration 092, not yet applied).
- `kb/wiki/concepts/support/escalation-rules.md` and `refund-policy.md`: change only with HIC approval (they encode current policy).

## 10. HIC decisions needed

1. ~~Approve the action classes and the order A1 → A2 → A3, with A4 later.~~ **APPROVED — HIC, 24.09.2026.**
2. Set the ceilings for A2 and A3 (both default to 0 until set).
3. Customer replies are outbound customer communication. For A1, should an AI-sent reply be allowed without human approval in P2, or does every outbound message keep a human send step until P3?
4. Accept the shadow-mode exit criterion (≥ 50 cases, ≥ 95 % agreement) or set another.
