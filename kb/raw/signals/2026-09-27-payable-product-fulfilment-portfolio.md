# Signal: catalogue-as-commercial-truth — every payable SKU maps to a shared delivery contract (2026-09-27)

**Field Note:** `docs/field-notes/2026-09-27-payable-product-fulfilment-portfolio.md`
**PR:** #2173, branch `opencode/product-readiness-portfolio`
**Status:** Implementation complete, not committed/pushed; HIC to review

## Summary — reusable architectural rule

- **Catalogue is commercial truth.** `dws10.com/config/products.json` is the single source of price, description, spec, and delivery contract for all 138 SKUs. Price list, product detail pages, and the Firehorse store all render *from* it via deterministic generators (`scripts/build_store.py`, `scripts/truth/*`, `scripts/i18n/products/*`) — never hand-edited independently.
- **Every payable SKU maps to a shared delivery capability/contract**, templated per capability chapter (13 chapters: advisory, platform, Aegis/KYA, Firehorse, hardware, infrastructure, agent, bundle, industry pack, outcome programme), not authored per-SKU. Fields: `checkoutMode`, `checkoutUrl`, `deliveryProfile`, `fulfilment` (owner/route/SLA/mode/runbook ref), `acceptanceKpi`, `exclusions`.
- **Order persistence before provider redirect.** Checkout creates a durable, idempotent order intent (Postgres `product_order_intents`, server-computed price, buyer/provider metadata) *before* any redirect to Stripe/Revolut/PayPal.
- **Verified payment before fulfilment.** Payment status and fulfilment status are tracked as separate state machines; Stripe uses webhook verification, Revolut/PayPal use managed human verification against the provider dashboard. Fulfilment never starts on an unverified transaction.
- **Managed operations fallback, never a gate.** Every product remains payable even where automation is incomplete; readiness/backlog gaps are advisory warnings (`scripts/validate-product-publication.mjs`) that never unpublish, disable, or block a sale. 185 true automation/capacity/evidence gaps are tracked as generated next-version backlog issues, one per SKU.
- **Schema preflight before deployment.** `npm run preflight:product-orders` (RPC `product_order_schema_preflight`) must pass before the order backend is deployed; migration `supabase/migrations/099_270926_product_order_fulfilment.sql` is reviewed but deliberately unapplied pending HIC action.

## Links

- Field note: `docs/field-notes/2026-09-27-payable-product-fulfilment-portfolio.md`
- Runbook: `docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md`
- Migration: `supabase/migrations/099_270926_product_order_fulfilment.sql`
- Truth artifacts: `docs/truth/PRODUCT_FULFILMENT.md`, `docs/truth/PRODUCT_READINESS_BACKLOG.md`, `docs/truth/PRODUCT_REGISTRY.md`
