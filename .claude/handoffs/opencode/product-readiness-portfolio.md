# Handoff — product-readiness-portfolio (2026-09-27)

## Authority and scope

HIC requested merge of PR #2173 and continuation in Claude Code after Copilot promotional credit usage approached 90%. This does not authorise bypassing repository protection, fabricating a payment, or exposing credentials. The primary checkout is shared and may contain unrelated work: use an isolated worktree.

## Implementation and verified evidence

- PR #2173 implements managed-delivery contracts for 138 current products, order intake, pricing, manual Revolut/PayPal payment verification, fulfilment jobs and notifications. It does **not** automate delivery of all 138 products.
- Production Supabase migration 099 was applied and recorded. A staging purchase exposed an ambiguous PL/pgSQL conflict target. Migration 100 repairs it; isolated staging reset applied 099, 100 and the renumbered, **unapplied** NemoClaw migration 101. A rolled-back transaction proved intent creation/replay, payment-review queue, bad amount/currency rejection, verified payment, one verification, one job and three events.
- DGX backend has a persistent Cloudflare tunnel. `https://product-api.dws6.com/v1/orders/readiness` returned HTTP 200, but this is schema-only and does not prove an order can be written in production.
- Copilot cloud setup moved to `.github/workflows/copilot-setup-steps.yml` with Node 24 and `npm ci`; Cursor per-machine model URL was removed from shared workspace settings, and worktree setup uses `npm ci`. The opencode-all update command now refuses dirty/diverged submodule histories; no submodule pointer was changed. Session coordinator releases claims and guards session IDs, with regression coverage. Pricing CI uses project-local tsx instead of an unresolvable global binary.

## Release blockers and sequence

1. Confirm actual PR #2173 merge state on GitHub. No status in this document asserts a merge happened: compare with `gh pr view 2173`.
2. Production migration 100 is **not applied**. An attempted production DB inspection was denied by a repository pre-tool hook; do not bypass a security policy. Have an authorised migration operator review and apply **only 100**, register it in `supabase_migrations.schema_migrations`, then verify the function through an authorised safe method; do not replay 099 or create a synthetic production customer order.
3. If public checkout is deployed by merge, verify order intake fails closed (no provider redirect when order creation fails). Do not claim live payment-to-delivery before the production write path, notifications and operator handoff are tested. In an actual paid case check provider ledger reference, exact amount and currency before running `scripts/confirm-product-order-payment.mjs` on DGX; never infer payment from a redirect.
4. PR CI on this release was still queued on the DGX runner. Pricing check had failed because a global tsx install was invisible; local `npm exec -- tsx scripts/validate-pricing.ts` passed. Lint failures were observed in two unrelated upstream test files being edited concurrently in the primary checkout; do not overwrite those edits. Recheck CI before treating release as verified.
5. Stripe is not configured on DGX (separately checked key had expired); do not advertise Stripe until verified key and webhook are installed. Three unused Cloudflare aliases (`api.lifetime.fi.dws6.com`, `orders.dws6.com`, `checkout-api.dws6.com`) require authorised DNS cleanup. The opencode-all submodule remains pinned; review `npm run opencode:update` separately, then explicitly commit the parent gitlink if a tested update is desired.

## Next-session prompt

Continue DWS IQ 6 product fulfilment from PR #2173 in an isolated Claude Code worktree. First confirm whether the PR merged, whether public checkout is deployed, and current CI results; distinguish code merged from delivery operational. Apply migration 100 only through an authorised operator/process (no security-hook bypass), record its production ledger entry, and verify the order write path without charging a customer or making a synthetic production order. Then verify DGX/backend/checkout/notification and manual-payment handoff, fix CI regressions without overwriting concurrent work, and report exactly which products have managed-delivery versus automated delivery. Use docs/runbooks/PRODUCT_ORDER_DEPLOYMENT_RUNBOOK.md and PRODUCT_FULFILMENT_RUNBOOK.md. Do not claim end-to-end production fulfilment until the payment and handoff gates are proven.
