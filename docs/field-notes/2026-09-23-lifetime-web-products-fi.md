# 2026-09-23 — Lifetime web products: Finnish detail pages and FI price-list buttons

# VERSION AND AGENT HISTORY

---

Version: 1.2 [Latest]

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: Claude Code | Session: claude/lifetime-web-products-fi | Date: 23.09.2026 | Changes: Review fixes (Copilot, PR #2083). FI price-list logic moved to the EN master and regenerated; data-pa-lang dropped (the bar follows `<html lang="fi">`); curated FI pages excluded from the machine-translation generator; required field-note elements added.
- Version: 1.1 [not latest] | Tool: Claude Code | Session: claude/lifetime-web-products-fi | Date: 23.09.2026 | Changes: HIC approved Details + Tuotetiedot for all products with an FI page; one discount only; offer valid until further notice; WhatsApp button on the flyer.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/lifetime-web-products-fi | Date: 23.09.2026 | Changes: FI detail pages for WEB-STARTER and WEBSTORE-MINI; FI price-list buttons.

Document Status:

- Created: 23.09.2026
- Last Modified: 23.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-23
- **Author:** Claude Code for Risto Anton Päärni (HIC), risto.paarni@lifetime.fi
- **Location:** Espoo, Finland (remote session)
- **Context:** dws10.com product catalogue and FI price list; A5 two-sided campaign (LIFETIME-WEB-STARTER, LIFETIME-WEBSTORE-MINI); PR #2083

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Professional_Services > Web_Services > SME_Websites_and_E-commerce
- **Entities:** Lifetime Oy, dws10.com, LIFETIME-WEB-STARTER, LIFETIME-WEBSTORE-MINI, DWS-AEGIS-001, A5 campaign

## The Story

1. The HIC stated that the first target group for both new web products is Finnish SMEs. The campaign flyer and the price list were still sending visitors to English detail pages.
2. HIC requests, in order: rename "Details" to "Tuotetiedot"; make the buttons follow the language when FI is chosen in the price list; show both "Details" and "Tuotetiedot"; extend this to every product that has an FI page.
3. Changes made:
   - Hand-translated `lifetime-web-starter.fi.html` and `lifetime-webstore-mini.fi.html`.
   - In the FI price list, all 31 products whose detail page has a `.fi.html` counterpart show Kortti | Details (EN) | Tuotetiedot (FI) | Varaa tapaaminen | Sähköposti. The logic lives in the EN master `price-list/index.html` and switches on only when `<html lang="fi">`. The FI/SV/DE/FR pages are regenerated with `scripts/generate-price-list-i18n.mjs`.
   - `product-actions.js` follows `<html lang="fi">`. All 57 FI detail pages that load it show a Finnish bar with a Details link to the EN page.
4. HIC pricing decision: "emme anna 2 alennusta" (we do not give two discounts). The campaign prices €350 and €650 already include the 40 % discount. Code `CAMPAIGN-A5-40` is removed everywhere; checkout never supported discount codes. The offer is "voimassa: toistaiseksi" (valid until further notice).
5. The flyer's "Skannaa koodi" (scan the code) URL is replaced with a WhatsApp button, "Lifetime Oy Myynti" (+358 400 319 010).
6. The review found that generators would overwrite hand edits. Fixes:
   - The price-list change was moved into the generator's source page.
   - The two curated masters are excluded from `scripts/i18n/products/build-all.cjs`.
   - `data-pa-lang` is no longer used, so pages generated with plain `lang="fi"` keep the Finnish bar.

## The Insight

- Localised pages in this repo are mostly **generated**. A hand edit to a generated file is lost on the next run. Before editing any `*/fi/*` or `*.fi.html` file, check its generator (`generate-price-list-i18n.mjs`, `scripts/i18n/products/build-all.cjs`, `build-aegis-pages.cjs`).
- Two stacked discounts on the same offer are a trust risk with SME buyers. Show one price, and state that no code is needed.

## Next Steps

- [ ] HIC: real-payment checkout test of both campaign products (still the go-live blocker; `2026-09-20-campaign-checkout-testing.md`).
- [ ] Optional: SV/DE/FR action bar and price-list labels (not requested).
- [ ] Optional: inject product-page prices from `products.json`. EN and FI detail pages, including the machine-generated ones, still hard-code the price.
- Learn/ HTML: N/A — pandoc is not available in this cloud container. KB update and Drive export: N/A — deferred to the HIC batch review.
