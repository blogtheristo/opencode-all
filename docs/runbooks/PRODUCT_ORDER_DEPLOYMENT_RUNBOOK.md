---
title: Product Order Schema-First Deployment Runbook
version: 1.1
status: Active
last_updated: 2026-09-27
owner: Lifetime Oy
harness: GitHub Copilot CLI 1.0.88
hic_approved_drift: none
---

# Product Order Schema-First Deployment Runbook

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: GitHub Copilot CLI 1.0.88 (openai/gpt-6-sol) | Session: opencode/product-readiness-portfolio | Date: 27.09.2026 | Changes: Recorded migration 099, DGX backend cutover, and remaining public ingress and payment-provider gates. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

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

The DGX backend has been deployed locally and returns HTTP 200 with `{"status":"ready"}` on `http://127.0.0.1:8080/v1/orders/readiness`. **This is not public readiness.** `api.lifetime.fi` has no DNS record, `api.dws6.com` still serves the old backend (readiness 404), and the DGX Cloudflare tunnel only routes `heartbeat.dws6.com`. The configured Stripe key returned `api_key_expired` on a read-only webhook-endpoint lookup. Do not publish checkout until the real public hostname, payment verification, and a staging-only order test work.

Two DNS aliases (`api.lifetime.fi.dws6.com` and `orders.dws6.com`) were created while testing the tunnel. Both currently match its 404 catch-all; an authorised DNS operator must remove or deliberately configure them. Neither is a production API.

## Required rollout order

1. Review migration 099 and confirm its ledger entry in the target database; its original `REVIEWED, NOT APPLIED` source comment is historical. Do not reapply it to the already-migrated environment.
2. Keep checkout unpublished until the public ingress, payment-provider webhooks, and operator handoff are verified.
3. Export `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) in the deployment environment. Do not place either value in source control or command output.
4. Run `npm run preflight:product-orders`. A release may continue only when it prints `PASS: product-order schema is ready for checkout deployment.`
5. Deploy the backend through the DGX Spark image/day-runner path. The new `/v1/payments/checkout`, `/v1/orders/notify`, and internal confirmation route remain fail-closed with HTTP 503 until the schema preflight RPC succeeds; unrelated subscription/payment routes remain available.
6. Verify the public API hostname reaches the DGX backend and returns HTTP 200 with `{"status":"ready"}` at `/v1/orders/readiness`. Use a staging-only test order for the write path; do not create synthetic production orders.
7. Only then deploy `dws10.com/checkout/` and its `landing-pages/dws10-com/checkout/` mirror together, updating both copies if the verified public API hostname differs from `api.lifetime.fi`.

## Failure and rollback

- If preflight fails, do not deploy or enable checkout. Diagnose/apply migration 099; never route the request into a legacy success response.
- If the backend is already deployed without migration 099, checkout endpoints return `PRODUCT_ORDER_SCHEMA_NOT_READY` without terminating application startup. Roll back the checkout-page release or apply the reviewed migration through the approved process.
- Never treat a redirect, provider reference, browser session record, or buyer callback as proof of payment. Only a verified Stripe webhook or authenticated operator confirmation can queue fulfilment.

***

Version 1.1 · 27.09.2026 · © 2026 Lifetime Oy · Internal
