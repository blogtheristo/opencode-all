# Support SLA

Response targets by plan tier. The Helpdesk agent's draft is considered the
"first response" only after a human approves and sends it.

## First-response targets (business hours, Europe/Helsinki)

| Tier       | Target           | Channel                 | Notes                                 |
| ---------- | ---------------- | ----------------------- | ------------------------------------- |
| Free       | Best-effort      | Community / docs        | No personal response guaranteed       |
| Pro        | 1 business day   | Email                   | Mon–Fri 09:00–17:00 Helsinki          |
| Enterprise | 4 business hours | Email + dedicated Slack | Includes after-hours for P1 incidents |

## Severity levels

- **P1** — production outage, data loss risk, security incident → always escalate.
- **P2** — feature broken for a single customer, blocking workflow → reply same day for Pro/Enterprise.
- **P3** — questions, how-tos, minor bugs → reply within SLA above.
- **P4** — feature requests, feedback → acknowledge; route to product backlog.

## Helpdesk agent behaviour

- Never promise a tighter SLA than the customer's plan provides.
- For P1 severity (keywords: "outage", "down", "data loss", "security", "breach"),
  recommend `escalate` with `escalationReason: "Possible P1 incident"`.
- If the customer is on the Free tier and asks for a specific response time,
  recommend `plan-upgrade-suggest` and reference this file.
