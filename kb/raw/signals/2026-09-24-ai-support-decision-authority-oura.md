# Signal: AI customer service with decision authority (Oura warranty case)

**Source:** Public LinkedIn post by Jyri Metsälä (investor and COO, Hallitu), 24.09.2026, screenshot shared by the HIC
**Captured:** 2026-09-24
**Branch:** `claude/blissful-davinci-8782wy`
**Type:** Market signal (customer expectation). Not a DWS customer case.
**Related:** `docs/plans/2026-09-24-helpdesk-bounded-decision-authority.md`, `docs/plans/2026-09-24-decision-journey-outcome-evidence.md`

## What happened

- After a little over a year, the Oura ring's battery life had dropped to one day.
- The customer filed a warranty claim with an AI support agent at night on a Sunday. The whole process took about 10 minutes.
- The AI understood the problem, made a diagnosis and **had the authority to resolve it immediately**.
- A replacement ring was in the mailbox on Wednesday morning.
- The customer's words: no queue, no office hours, no "we'll get back to you". It exceeded expectations so clearly that they wondered whether the AI was better than a human in this situation.
- The customer's conclusion: _"Ei vain vastata asiakkaalle. Vaan ratkaista asiakkaan ongelma — heti."_ (Not just answering the customer, but solving the customer's problem, right away.)

## Why it matters for DWS

1. **What exceeded expectations was the decision authority, not the language model.** Queues, office hours and "we'll get back to you" are all symptoms of the same thing: whoever talks to the customer is not allowed to decide.
2. **In the event model, `emitted_by` = `decision_by` = the AI agent.** The capture lag is close to zero, and the replacement order is `SYSTEM_CONFIRMED` evidence. This is exactly the case that `decision_journey` is built to record (spec v1.5).
3. **The DWS Helpdesk agent is currently the opposite model.** It drafts a reply and a human approves it (`src/agents/helpdesk.agent.ts`; `kb/wiki/concepts/support/refund-policy.md`: "must never approve a refund on its own"). That is safe, but it is the "we'll get back to you" model.
4. **Sales message for the accountable buyer:** the AI is allowed to decide because every decision can be verified. KYA sets the limits of the authority, and decision_journey records every decision as it happens.

## Implication

The next step is bounded decision authority by action class. It starts in shadow mode, where the agent decides but a human executes, until agreement is measured. Spec: `docs/plans/2026-09-24-helpdesk-bounded-decision-authority.md`.

## Scope

A market signal for the PhD thesis (customer expectation, societal shift in service). Not implementation evidence for the master's thesis.
