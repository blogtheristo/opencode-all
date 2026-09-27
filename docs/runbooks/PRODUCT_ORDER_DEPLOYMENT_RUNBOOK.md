---
title: Product Order Schema-First Deployment Runbook
version: 1.0
status: Active
last_updated: 2026-09-27
owner: Lifetime Oy
harness: GitHub Copilot CLI 1.0.88
hic_approved_drift: none
---

# Product Order Schema-First Deployment Runbook

## Purpose

Prevent checkout from taking a Revolut, PayPal, or Stripe payment before the exact SKU has a durable order intent and fulfilment path.

## Required rollout order

1. Review `supabase/migrations/099_270926_product_order_fulfilment.sql`. It is intentionally marked `REVIEWED, NOT APPLIED`; applying it requires the normal HIC-controlled database procedure.
2. Apply migration 099 to the target Supabase environment before deploying the backend or checkout pages.
3. Export `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) in the deployment environment. Do not place either value in source control or command output.
4. Run `npm run preflight:product-orders`. A release may continue only when it prints `PASS: product-order schema is ready for checkout deployment.`
5. Deploy the backend. The new `/v1/payments/checkout`, `/v1/orders/notify`, and internal confirmation route remain fail-closed with HTTP 503 until the schema preflight RPC succeeds; unrelated subscription/payment routes remain available.
6. Deploy `dws10.com/checkout/` and its `landing-pages/dws10-com/checkout/` mirror together.
7. After backend deployment, call `GET https://api.lifetime.fi/v1/orders/readiness`; require HTTP 200 with `{"status":"ready"}` before deploying the checkout pages. Use a staging-only test order for the write path; do not create synthetic production orders.

## Failure and rollback

- If preflight fails, do not deploy or enable checkout. Diagnose/apply migration 099; never route the request into a legacy success response.
- If the backend is already deployed without migration 099, checkout endpoints return `PRODUCT_ORDER_SCHEMA_NOT_READY` without terminating application startup. Roll back the checkout-page release or apply the reviewed migration through the approved process.
- Never treat a redirect, provider reference, browser session record, or buyer callback as proof of payment. Only a verified Stripe webhook or authenticated operator confirmation can queue fulfilment.
