---
name: helpdesk-triage
version: 1.0
date: 2026-05-12
description: >
  Triages an open support ticket with the Helpdesk agent. Loads the customer, plan, prior tickets,
  and support policy KB, drafts a reply, and recommends an action (resolve / reply / escalate /
  refund / plan-upgrade-suggest). Use when user says "triage ticket", "help with this support
  case", "draft a reply", "what should we tell this customer", "review ticket", or provides a
  ticket UUID. Never sends email — a human reviewer approves the draft.
---

Invoke the Helpdesk agent to triage a support ticket — reads customer + plan + history + policy,
returns a drafted reply and a recommended action. The draft is written back to the ticket row;
a human reviewer must approve via `POST /api/v1/support/tickets/:id/send`.

Usage: /helpdesk-triage <ticketId>

Input: $ARGUMENTS

## Steps

1. **Validate input** — `$ARGUMENTS` must be a UUID matching `support_tickets.id`. If not a UUID,
   ask the user for the ticket ID instead of guessing.

2. **Invoke the Helpdesk agent**:

   ```bash
   cd cli && npx tsx src/cli.ts run helpdesk --input '{
     "action": "triage",
     "ticketId": "<uuid>"
   }'
   ```

3. **Read the structured result**:
   - `intent` — e.g. `plan-limit`, `billing`, `refund`, `bug-report`, `how-to`
   - `confidence` — 0.0–1.0
   - `draftReply` — the text the human will review
   - `recommendedAction` — `resolve` | `reply` | `escalate` | `refund` | `plan-upgrade-suggest`
   - `citedPolicySources` — KB markdown files the draft is grounded in
   - `escalationReason` — present when an escalation was created
   - `escalationId` — UUID into `hil_escalations` when one was opened

4. **Present the triage to the user**:
   - Ticket id, intent, confidence
   - Recommended action and (if any) escalation reason
   - The draft reply, verbatim
   - The cited policy sources
   - The next API call the reviewer should make (`/send` for reply, nothing extra for escalations
     since the agent already opened them)

5. **If `confidence < 0.6` or the action is `escalate` / `refund`**: the agent already created an
   `hil_escalations` row and set the ticket to `awaiting_human`. Surface the escalation ID and
   instruct the reviewer to act on it.

## Output format

```
TICKET: <id>  intent: <tag>  confidence: <0.NN>
Recommended action: <action>
Escalation: <id-or-"none">   reason: <only when escalated>

DRAFT REPLY
-----------
<draftReply>

Sources cited:
  • <kb path>
  • <kb path>

Next step: POST /api/v1/support/tickets/<id>/send   (or review escalation <id>)
```

## When NOT to use

- The ticket is already `resolved` or `closed` — no triage needed.
- You don't have a ticket UUID — create one first via `POST /api/v1/support/tickets`.
- You need a full multi-agent investigation — use `/case-run` instead.
- You want to look up support policy without a ticket — use `/kb ask` against
  `kb/wiki/concepts/support/`.
