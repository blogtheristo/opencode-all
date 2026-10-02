# Field Note — Every Catalogue Product Payable and Deliverable: the 138-SKU Fulfilment Portfolio

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: GitHub Copilot CLI | Session: opencode/product-readiness-portfolio | Date: 27.09.2026 | Changes: First field note for the payable-product-fulfilment-portfolio initiative (PR #2173). Records the HIC's ultimate acceptance criterion ("every catalogue product must be a real payable product Lifetime Oy can deliver at any time"), the shared catalogue-wide delivery-contract/backlog design, the durable order-intent payment path, and the pre-deployment schema-preflight gate. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

Session Links & References:

- PR: https://github.com/blogtheristo/dws6/pull/2173
- Runbook: `docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md`
- Migration (reviewed, **not applied**): `supabase/migrations/099_270926_product_order_fulfilment.sql`
- Preflight command: `npm run preflight:product-orders` → `scripts/preflight-product-orders.ts`
- Truth artifacts: `docs/truth/PRODUCT_FULFILMENT.md`, `docs/truth/PRODUCT_READINESS_BACKLOG.md`, `docs/truth/PRODUCT_REGISTRY.md`, `config/truth/product-fulfilment.json`, `config/truth/product-readiness-backlog.json`
- Canonical catalogue: `dws10.com/config/products.json`
- Order/payment services: `src/services/product-order.service.ts`, `src/routes/payment.routes.ts`, `src/routes/order-intake.routes.ts`, `src/routes/b2b-payment.routes.ts`

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: INTERNAL — field note, not for public-site publication
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-27
- **Author:** GitHub Copilot CLI, on behalf of Lifetime Oy
- **Location:** DWS6 repository, isolated local worktree (`product-readiness-portfolio`)
- **Context:** PR #2173, `docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md` — closing implementation gaps so every catalogue SKU is a real payable, deliverable product

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy, eu-north1 data residency)
- **Sector:** Software > E-commerce Governance > Catalogue/Fulfilment Automation
- **Entities:** DWS IQ 6 Platform, Firehorse Suite, Lifetime Fleet, Lifetime World Model, Stripe, Revolut, PayPal, AWS SES, Supabase
- **Systems:** `dws10.com/config/products.json`, `scripts/truth/*` generators, `scripts/build_store.py`, `scripts/i18n/products/*`, `supabase/migrations/099_270926_product_order_fulfilment.sql`, `src/services/product-order.service.ts`
- **Temporal Context:** 2026-Q3, PR #2173
- **Confidence:** High — every fact below is read directly from the repository's deterministic generators, migration file, and test run; nothing is invented.

## The Story

The HIC's original request was broad: update the price list, product descriptions, detail pages, specs, and Firehorse store per the readiness program. Mid-session the HIC sharpened the acceptance criterion twice: first toward a fail-closed payment gate, then — critically — reversed that: **never unpublish, disable, gate, or block payment for any product.** The final, binding instruction was to keep all 138 selling surfaces live exactly as they were, and instead close the *implementation* gap behind each one so every SKU that already accepts money can actually be delivered.

The resulting design treats the catalogue (`dws10.com/config/products.json`) as the single commercial source of truth and maps all 138 products across the 13 capability chapters to a shared, factual delivery-contract shape — `checkoutMode`, `checkoutUrl=/checkout/?product=<id>`, `deliveryProfile`/chapter, a `fulfilment` block (owner team under Lifetime Oy, contact route on dws10.com, 1-business-day acknowledgement, delivery mode, runbook reference), an `acceptanceKpi` object, and `exclusions`. This is templated per chapter (advisory engagement, platform, Aegis/KYA, Firehorse, hardware, infrastructure, agent, bundle, industry pack, outcome programme) rather than hand-written 138 times, and the existing detailed Aegis pilot contract was preserved untouched as the richer, already-correct exemplar. Every SKU without a canonical detail page got one generated from the existing `build_store.py` pipeline; every SKU got exactly one entry in the generated `docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md`, organised one section per chapter.

Propagation followed the same shared-source rule: `build_store.py` renders the canonical description/features/specification/acceptance/exclusions/delivery/checkout button onto every product page; `product-actions.js` (plus its dual-folder mirror) recognises a canonical slug and renders a Buy button and delivery panel from `products.json`; the price list and its locale mirrors gained a Buy action per priced row without touching lifecycle filters; the Firehorse `store-preview.html` was rewired to render its 9 Chapter 5 products dynamically from a same-origin, generated mirror of the canonical catalogue (`dws6.com/dashboard/firehorse/firehorse-chapter5-products.json`) instead of stale hardcoded HTML.

On the backend side, the payment path was made durable rather than fire-and-forget: a checkout creates a **durable order intent** in Postgres (`product_order_intents`, migration `099_270926_product_order_fulfilment.sql`) keyed by an idempotency key, recording the exact SKU, the server-computed (not client-supplied) expected payment amount, and the buyer's chosen provider, **before** any redirect to a payment processor. Stripe is wired as a verified webhook-confirmed path; Revolut and PayPal use a managed-verification path (an operator confirms the transaction reference against the provider dashboard) rather than an unverified webhook. Once a payment is verified, AWS SES sends both a buyer confirmation and an internal ops alert (`payment_review_notification_status`, `operations_notification_status` columns track delivery of each independently, with attempt counts and error capture, so a failed email never silently loses the order). Fulfilment status (`pending → queued → in_progress → fulfilled`) is tracked per order-intent row, separate from payment status, so "paid" and "delivered" are never conflated. The migration is **reviewed but deliberately not applied** — `npm run preflight:product-orders` calls a Postgres RPC (`product_order_schema_preflight`) and must pass before this backend is deployed, so a missing migration fails loudly at deploy time instead of silently at checkout time.

Every SKU that still has a true automation/capacity/evidence gap — 185 of them — got exactly one entry in the generated per-SKU readiness backlog (`docs/truth/PRODUCT_READINESS_BACKLOG.md` / `config/truth/product-readiness-backlog.json`), bucketed into current-version work versus proposed next-version issues, with IDs shaped for future GitHub issues. These backlog entries are advisory: `scripts/validate-product-publication.mjs` reports them, and Firehorse Chapter 5 mirror staleness, i18n/mirror drift, and dead detail-page links, as **warnings only** — they never fail the build, gate a sale, or unpublish a product.

The final full run before this note: **1,834 tests passed, 33 skipped**; the repository-wide security scan reported **PASS**; a manual browser QA pass over the price list, product detail pages, and Firehorse store preview also passed. `git diff --check` is clean after a separate generator-level fix removed 6,626 trailing-whitespace diagnostics from the templating pipeline itself (not a one-off output edit). Nothing in this initiative has been committed or pushed; all work sits in the `product-readiness-portfolio` worktree awaiting review on PR #2173.

## The Insight

The reusable rule this session re-proved: **when 138 things need the same fix, build one shared, chapter-templated generator over the canonical source and propagate outward — never hand-edit 138 independent copies.** The same rule applies twice here, at two different layers: (1) commercially, every SKU's delivery contract is derived from its chapter template plus its own catalogue fields, not authored per-product; (2) operationally, the payment backend records a durable, idempotent, server-priced order intent and waits for **verified** payment before fulfilment — a fail-closed backend contract that coexists with a fail-open, always-payable public catalogue. The HIC's reversal from "gate unready products" to "never gate, close the gap behind it" is the correct one for a live, revenue-bearing storefront: a warning that a human must act on is recoverable; an unpublished product that a paying customer can't find is a lost sale and, worse, a silent breach of the promise that every listed product is real. Advisory-only validation (warn, never fail) is therefore not a lesser safeguard — it is the *deliberately chosen* safeguard for the public surface, while the payment backend itself keeps a genuine fail-closed gate (schema preflight; verified-payment-before-fulfilment) where a silent failure would mean an unpaid delivery or a lost order, not a lost sale.

## Learning Outcome Status

1. **KB:** Raw signal added separately — see `kb/raw/signals/2026-09-27-payable-product-fulfilment-portfolio.md`. KB compile/wiki generation to be run by the parent session via CLI; not run from this note.
2. **Field note:** Complete (this file).
3. **Learn HTML:** Rendered to `Learn/2026-09-27-payable-product-fulfilment-portfolio.html` via `scripts/render-doc.sh`.
4. **Drive export:** N/A — no Drive MCP tool is available in this session.
5. **HIC decision:** Already given and recorded, not re-opened here: **keep every catalogue product payable; managed human delivery is the fallback fulfilment mode; never redirect a buyer to a payment provider if durable order-intake fails.** No new decision is requested by this note.
6. **Calendar:** N/A — no dated commitment is introduced by this note; the migration-before-deployment dependency is a code/process gate (`npm run preflight:product-orders`), not a personal calendar commitment.

## Next Steps

- [ ] HIC: apply `supabase/migrations/099_270926_product_order_fulfilment.sql` in a maintenance window, then run `npm run preflight:product-orders` against the target environment before the product-order backend is deployed.
- [ ] After merge of PR #2173, dispatch the Firehorse Chapter 5 preview regeneration and price-list Buy-route checks once against the deployed environment to confirm parity outside the local worktree.
- [ ] Track the 185 next-version backlog issues (`docs/truth/PRODUCT_READINESS_BACKLOG.md`) into GitHub issues using the generated IDs, prioritised by chapter.

---

**Document version:** v1.0 · **Date:** 27.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
