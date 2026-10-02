---
title: Product Order Schema-First Deployment Runbook
version: 1.3
status: Active
last_updated: 2026-09-27
owner: Lifetime Oy
harness: GitHub Copilot CLI 1.0.88
hic_approved_drift: none
---

# Product Order Schema-First Deployment Runbook

---

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: GitHub Copilot CLI 1.0.88 (openai/gpt-6-sol) | Session: opencode/product-readiness-portfolio | Date: 27.09.2026 | Changes: Documented forward order-intent SQL repair and staging write-path verification. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none
- Version: 1.2 | Tool: GitHub Copilot CLI 1.0.88 (openai/gpt-6-sol) | Session: opencode/product-readiness-portfolio | Date: 27.09.2026 | Changes: Added private operator key and interactive DGX-only manual payment confirmation procedure. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none
- Version: 1.1 | Tool: GitHub Copilot CLI 1.0.88 (openai/gpt-6-sol) | Session: opencode/product-readiness-portfolio | Date: 27.09.2026 | Changes: Recorded migration 099, verified DGX public ingress, and remaining payment-provider gates. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

## Purpose

Prevent checkout from taking a Revolut, PayPal, or Stripe payment before the exact SKU has a durable order intent and fulfilment path.

## Release checkpoint (27 September 2026)

Migration 099 is applied and registered in the target Supabase database. `npm run preflight:product-orders` passes. Lifetime production moved to DGX Spark on 26 September; the Scaleway deployment workflow is retired (`.disabled`). The DGX backend image must include `dws10.com/config/products.json` for server-side SKU pricing.

Schema preflight checks presence but does not execute the order-write RPC. An isolated staging purchase found migration 099's `ON CONFLICT (idempotency_key)` ambiguous against the function's output column. Forward migration `100_270926_product_order_idempotency_conflict.sql` fixes that target without replaying 099. It applied on isolated staging, where a rolled-back test exercised intent creation and replay, payment review, mismatched amount and currency rejection, verified payment, and exactly one verification, fulfilment job and set of three events. Apply and confirm migration 100 in the production ledger before checkout release.

The DGX backend now responds publicly at `https://product-api.dws6.com/v1/orders/readiness` with HTTP 200 and `{"status":"ready"}`. The dedicated `dws-orders` tunnel is enabled as the persistent `dws-product-api-tunnel.service` systemd user unit (with user lingering enabled); it does not modify the heartbeat tunnel or `api.dws6.com`. CORS admits `https://dws10.com`, and a public checkout request with an unknown SKU returns 404 `UNKNOWN_SKU` without creating an order. Both checkout mirrors now point to `product-api.dws6.com`. **Do not publish checkout yet:** a staging-only order test and operational handoff remain to be verified. The live DGX backend has no Stripe key or Stripe webhook secret, and this checkout offers only Revolut and PayPal; do not advertise Stripe until its credentials and webhook are restored. `api.lifetime.fi` remains NXDOMAIN; it is not used by this checkout.

Three unused DNS aliases (`api.lifetime.fi.dws6.com`, `orders.dws6.com`, and `checkout-api.dws6.com`) were created while testing the tunnel. They still route to the heartbeat tunnel's 404 catch-all (the first also has a TLS hostname mismatch); an authorised Cloudflare DNS operator must remove them. The only intended new public API hostname is `product-api.dws6.com`.

## Required rollout order

1. Confirm migration 099's ledger entry; do not reapply it. Review and apply only the tested forward migration 100 to the production database, then confirm its ledger entry. Do not rely on schema-only preflight as proof of a working order write path.
2. Keep checkout unpublished until the public ingress, the Revolut/PayPal manual-verification handoff, and the staging-only write path are verified. Stripe webhook verification is required before enabling Stripe, not for the two manual providers.
3. Export `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) in the deployment environment. Do not place either value in source control or command output.
4. Run `npm run preflight:product-orders`. A release may continue only when it prints `PASS: product-order schema is ready for checkout deployment.`
5. Deploy the backend through the DGX Spark image/day-runner path. The new `/v1/payments/checkout`, `/v1/orders/notify`, and internal confirmation route remain fail-closed with HTTP 503 until the schema preflight RPC succeeds; unrelated subscription/payment routes remain available.
6. Verify the public API hostname reaches the DGX backend and returns HTTP 200 with `{"status":"ready"}` at `/v1/orders/readiness`. Use a staging-only test order for the write path; do not create synthetic production orders.
7. Only then deploy `dws10.com/checkout/` and its `landing-pages/dws10-com/checkout/` mirror together. Both copies already target the verified `product-api.dws6.com` hostname.

## Manual payment verification (DGX only)

The local DGX operator key is in the ignored, owner-only root and `infrastructure/dgx-spark/.env` files. It is loaded into the `dws-backend` container; **never print it or send it over the public Cloudflare tunnel**. A public confirmation without the key returns HTTP 401; a locally authenticated request with invalid data returns HTTP 400 without confirming payment.

1. Read the pending order intent and check the actual Revolut or PayPal provider ledger. Match its transaction reference, paid amount and currency to the immutable order amount; a redirect, browser callback, or buyer statement is not evidence of payment.
2. On the DGX host, run `node scripts/confirm-product-order-payment.mjs`. Supply the intent UUID, provider transaction reference, exact amount in cents, currency, and operator ID. Only type `VERIFIED` after provider-side comparison. The script sends the admin key **inside the local container** to `127.0.0.1:8080`; it never puts the key in a shell argument or sends it through Cloudflare.
3. Require a response with `payment_status: paid` and `fulfilment_status: queued`. Follow the SKU's owner, acceptance criteria, and one-business-day acknowledgement target in `docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md`. If notification delivery reports failure, inspect the persisted order events and notification status and reconcile manually; do not infer success from a redirect.

## Failure and rollback

- If preflight fails, do not deploy or enable checkout. Diagnose the schema and ledger; never route the request into a legacy success response.
- If migration 100 is missing, preflight may pass while order creation fails. Keep checkout unpublished until it is applied and verified.
- If the backend is already deployed without migration 099, checkout endpoints return `PRODUCT_ORDER_SCHEMA_NOT_READY` without terminating application startup. Roll back the checkout-page release or apply the reviewed migration through the approved process.
- Never treat a redirect, provider reference, browser session record, or buyer callback as proof of payment. Only a verified Stripe webhook or authenticated operator confirmation can queue fulfilment.

***

Version 1.3 · 27.09.2026 · © 2026 Lifetime Oy · Internal
