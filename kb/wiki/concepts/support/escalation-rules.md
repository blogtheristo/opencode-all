# Escalation Rules

When the Helpdesk agent should hand off to a human via `recommendedAction: "escalate"`
or `"refund"`. Escalation creates an `hil_escalations` row and the ticket moves to
`awaiting_human`.

## Always escalate

- Refund or chargeback requests of any size.
- Account closure or data-deletion (GDPR Art. 17) requests.
- Security incidents — credentials leaked, unauthorised access, suspected breach.
- Legal correspondence — letters from lawyers, regulators, government bodies.
- Press / media inquiries.
- Anything mentioning suicide, self-harm, or threats to safety.
- Tickets where the agent's confidence is below 0.6 — automatic.
- Tickets from a domain on the VIP allowlist (customers tagged `enterprise`).
- Customer explicitly asks "speak to a human", "talk to a person", or similar.

## Prefer reply (no escalation)

- Documentation lookups, how-tos, "where is X in the dashboard".
- Known issues already covered in `known-issues.md`.
- Plan-limit questions answerable from `plan-limits.md`.
- Booking / scheduling confirmations.

## Escalation reason field

When recommending escalation, populate `escalationReason` with a single
sentence that tells the human exactly what they're being asked to judge —
not the full ticket, just the ambiguity:

- "Customer asks for 50% refund on annual plan after 4 months; outside the
  30-day window per refund-policy.md."
- "Possible security incident: customer reports unfamiliar IP in audit log."
- "VIP enterprise customer requesting custom integration timeline."
