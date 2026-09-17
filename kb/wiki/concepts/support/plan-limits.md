# Plan Limits

Source of truth: `subscription_plans` table (migration 008). The Helpdesk agent
reads the customer's resolved plan and may reference these limits in drafts.

## Limit dimensions

- `agent_calls_per_month` — number of paid agent invocations included in the tier.
- `edge_devices` — number of LWM / Acer edge devices the tier permits.
- `support_type` — Community (free), Email (pro), Dedicated Slack (enterprise).
- `features` (JSONB) — additional toggles per tier.

## Tier baseline (illustrative; check DB for current values)

| Tier       | Agent calls / month  | Edge devices | Support type    |
| ---------- | -------------------- | ------------ | --------------- |
| Free       | 100                  | 0            | Community       |
| Pro        | 10 000               | 2            | Email           |
| Enterprise | Unlimited (fair use) | 25           | Dedicated Slack |

## Triage rules

- If the customer's question is "why am I being throttled / blocked / rate-limited"
  and their plan has a per-month allocation, recommend `plan-upgrade-suggest` and
  include the current tier and the next tier's allocation in the draft.
- If the customer asks for a hard limit override, recommend `escalate` — only a
  human can grant a temporary override.
- Never claim a customer is on a tier they aren't actually on; always quote the
  resolved plan from the snapshot, not assumptions.
