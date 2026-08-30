# Code TODO Ledger

_Compiled 2026-08-22 · Source: full sweep of `// TODO` / `// FIXME` / `// HACK` markers in `src/**/*.ts`._

## What this is

Triage ledger for every real TODO marker in backend source. Each item is tracked here with its
code anchor so the marker comments can be audited (`rg "// TODO" src`) against this file.
Markers in code are intentional — they mark unbuilt product behaviour, not dead code.

Note: matches of the pattern `XXX` inside `T:XXXXXXXX` outreach signal tokens and
`GTM-XXXXXXX` placeholder IDs are false positives, not TODOs.

## Cluster 1 — Billing lifecycle notifications (P1 · highest-value cluster)

Owner: billing/payments workstream. All Stripe-driven customer/admin notifications are unwired.

| # | Item | Code anchor |
| - | ---- | ----------- |
| B1 | Activate service/product access on successful payment | `src/routes/stripe-webhook.routes.ts:177`, `src/services/billing.service.ts:346` |
| B2 | Trigger downstream workflows (provisioning, onboarding) after activation | `src/routes/stripe-webhook.routes.ts:178` |
| B3 | Send payment-failure notification to customer | `src/routes/stripe-webhook.routes.ts:209`, `:279` |
| B4 | Send admin alert for payment collection failures | `src/routes/stripe-webhook.routes.ts:210`, `:280` |
| B5 | Schedule auto-cancel if unpaid after 30 days | `src/routes/stripe-webhook.routes.ts:211` |
| B6 | Send payment-retry notification to customer | `src/routes/stripe-webhook.routes.ts:230` |
| B7 | Notify customer about unsupported payment method + alternatives | `src/routes/stripe-webhook.routes.ts:247-248` |
| B8 | Suggest retry with different payment method | `src/routes/stripe-webhook.routes.ts:281` |
| B9 | Update order status when refund is initiated | `src/routes/stripe-webhook.routes.ts:300` |
| B10 | Handle customer deletion (anonymize records) on `customer.deleted` | `src/routes/stripe-webhook.routes.ts:316` |
| B11 | Notify admin + remind customer on manual billing failure path | `src/services/billing.service.ts:373-374` |
| B12 | Schedule auto-cancel after 30 days (billing service path) | `src/services/billing.service.ts:375` |
| B13 | Notify admin + send customer reminder email (B2B payment path) | `src/routes/b2b-payment.routes.ts:385` |

Prerequisite: email service exists (`src/services/email.service.ts`) — wiring is mostly
template + trigger work; B5/B12 need a scheduled sweep (candidate: existing `node-cron`
infrastructure or `src/signals/signal-poller.ts` pattern).

## Cluster 2 — Email webhook contact lifecycle (P2)

| # | Item | Code anchor |
| - | ---- | ----------- |
| E1 | Mark contact as invalid in Firehorse on hard bounce | `src/routes/email-webhook.routes.ts:99` |
| E2 | Remove bounced contact from future campaigns | `src/routes/email-webhook.routes.ts:100` |
| E3 | Permanently suppress complained email address | `src/routes/email-webhook.routes.ts:199` |
| E4 | Alert founder (Risto) for manual review on complaint | `src/routes/email-webhook.routes.ts:200` |

## Cluster 3 — ERP sync gaps (P2)

| # | Item | Code anchor |
| - | ---- | ----------- |
| R1 | Map machineData rows (`machine_telemetry`, filtered by sync_status) | `src/integrations/erp/scheduler.ts:232` |
| R2 | Source pending OEE metrics per integration before syncing | `src/integrations/erp/scheduler.ts:256` |

## Cluster 4 — Dormant route (P3)

| # | Item | Code anchor |
| - | ---- | ----------- |
| G1 | Restore grok-consent routes when module becomes available | `src/app.ts:46`, `src/app.ts:458` |

## Audit

Run `rg -n "// TODO|// FIXME|// HACK" src --glob '*.ts'` — every hit must appear above.
Last audit: 2026-08-22 (26 hits, all accounted for).
