# A5 Campaign — Lifetime Web Products (handoff)

**Branch:** `claude/a5-kampanja-kaksipuolinen-followup-17ser8`
**Updated:** 2026-09-23
**Status:** Live on main (#2083 → 1654fdc, #2082 → f85c931). Open: checkout test (HIC); merge PR #2085 (−40 % / OVH / reseller note).

---

## Current state (facts)

| Item                    | Value                                                                                                                                                                                                              | Source                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Products                | LIFETIME-WEB-STARTER €650, LIFETIME-WEBSTORE-MINI €350, one-time, VAT 0 % B2B (FI VAT 25.5 % added at checkout)                                                                                                    | `dws10.com/config/products.json`         |
| Campaign discount       | **One discount only, no code.** −40 % holds: OVH raised to €1,084 / €584 (VAT 0 %) = campaign price ÷ 0.6, rounded up (HIC 23.09.2026). PR #2085 | HIC 23.09.2026 |
| Resellers               | Public text only: "Myös jälleenmyyjille. Ota yhteyttä myyntiin: WhatsApp +358 400 319 010". Reseller purchase price = OVH −50 % is **confidential** and lives only in `docs/legal/LIFETIME_RESELLER_AGREEMENT_FI.md` (private repo; never in site folders) | HIC 23.09.2026 |
| Validity                | "Tarjous voimassa: toistaiseksi." (until further notice); reviewed if customer numbers grow                                                                                                                        | HIC 23.09.2026                           |
| Target group            | Finnish SMEs                                                                                                                                                                                                       | HIC 23.09.2026                           |
| Flyer (web)             | `dws10.com/campaigns/a5-kampanja-kaksipuolinen.html`: CTA → `products/lifetime-web-starter.fi.html`; WhatsApp button "Lifetime Oy Myynti" (+358 400 319 010)                                                       | #2083                                    |
| Flyer (print/PDF)       | `dws10.com/campaigns/a5-kampanja-kaksipuolinen-pdf.html`: text first, image areas below; browser Print → PDF, A5, no margins                                                                                       | #2082                                    |
| FI detail pages         | `products/lifetime-web-starter.fi.html`, `products/lifetime-webstore-mini.fi.html` (hand-translated; excluded from `scripts/i18n/products/build-all.cjs`)                                                          | #2083                                    |
| FI price list           | 31 products with a `.fi.html` page show Details (EN) + Tuotetiedot (FI). Logic lives in the EN master `price-list/index.html` (active on `lang="fi"`); regenerate with `node scripts/generate-price-list-i18n.mjs` | #2083                                    |
| Product action bar      | `shared-assets/nav/product-actions.js` follows `<html lang="fi">` (57 FI pages)                                                                                                                                    | #2083                                    |
| Checkout discount codes | Not supported by checkout                                                                                                                                                                                          | code search, 23.09.2026                  |

## Open items

1. **HIC — blocker:** checkout test of both products (Revolut, PayPal) before wider distribution. Checklist: `docs/field-notes/2026-09-20-campaign-checkout-testing.md`.
   - Note: the checklist mixes sandbox credentials with a "€0.01 real payment", and its step-by-step cases cover only WEB-STARTER.
   - A €0.01 payment is not possible for €350/€650 products without a test product or a sandbox. HIC to choose one: (a) sandbox run for both SKUs, or (b) one real purchase per SKU, refunded afterwards.
2. **HIC — merge PR #2085:** until it merges, the live pages still show OVH €910 / €490 with "−40 %" (actually −28.6 %). Also decide the bracketed terms in the reseller agreement draft.
3. **HIC — decision:** detail-page price text versus `products.json`:
   - LIFETIME-BUNDLE-2026: page shows €9,990, catalogue €6,500.
   - LF-DGX-SPARK: page shows €6,694, catalogue €6,109.

   Price injection from `products.json` into detail pages is approved in principle, but it would change these two displayed prices.

4. Optional follow-ups (not requested yet): SV/DE/FR action bar labels; flyer images; campaign analytics (UTM/Bitly); SV/EN flyer versions.

## Rules learned

- Localised pages are mostly **generated**. Edit the master and rerun the generator, never the generated `*/fi/*` or `*.fi.html` files (exception: the two hand-translated web-product pages above).
- `landing-pages/dws10-com/` must be updated in the same commit.

## Field notes

- `docs/field-notes/2026-09-23-lifetime-web-products-fi.md`
- `docs/field-notes/2026-09-23-campaign-pdf-generation.md`
- `docs/field-notes/2026-09-21-campaign-deployment-complete.md`
- `docs/field-notes/2026-09-20-campaign-checkout-testing.md`
