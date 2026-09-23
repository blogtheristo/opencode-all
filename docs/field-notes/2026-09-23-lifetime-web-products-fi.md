# Lifetime web products — Finnish detail pages and FI price-list buttons

**Date:** 2026-09-23
**Branch:** `claude/lifetime-web-products-fi`
**Status:** PENDING_REVIEW

## What happened

HIC request (2026-09-23): "Details" → "Tuotetiedot"; when FI is chosen in the price list, the buttons and their targets follow the language. Scope: only the two new products (LIFETIME-WEB-STARTER, LIFETIME-WEBSTORE-MINI). Primary audience: Finnish SMEs.

- New `dws10.com/products/lifetime-web-starter.fi.html` and `lifetime-webstore-mini.fi.html`, translated from the EN masters (same layout and CSS).
- `price-list/fi/`: for these two rows only, buttons read Kortti | Tuotetiedot | Varaa tapaaminen | Sähköposti, and Tuotetiedot opens the `.fi.html` page. All other rows are unchanged (verified in a browser).
- `shared-assets/nav/product-actions.js`: opt-in `<html data-pa-lang="fi">` switches the product action bar labels (Kortti … Hinnasto) and the Hinnasto target to `/price-list/fi/`. Only the two new FI pages opt in. The 57 other `.fi.html` pages keep the English bar until they opt in.
- Campaign flyer CTA and the QR URL text now point to `lifetime-web-starter.fi.html`.
- EN pages: fixed broken `</strong` tags, and fixed language links that pointed to `.en.html` and `.sv.html` pages that do not exist.
- Mirrored to `landing-pages/dws10-com/`. The campaign mirror was stale compared with root commit 62fdb1f, so it was re-synced from root.

## Follow-up (same day, HIC): show both Details and Tuotetiedot, add Aegis

- The FI price-list rows for LIFETIME-WEB-STARTER, LIFETIME-WEBSTORE-MINI and DWS-AEGIS-001 now show both **Details** (English page) and **Tuotetiedot** (`.fi.html`).
- The action bar on opted-in FI detail pages shows **Details** (a link to the EN page) next to the active **Tuotetiedot**.
- Aegis: `aegis.fi.html` has `data-pa-lang="fi"`. `scripts/i18n/build-aegis-pages.cjs` now writes the same attribute on regeneration, so the change is not lost.
- 57 products have a `.fi.html` page. Only these 3 are opted in so far.

## Resolved: one discount only (HIC, 2026-09-23)

HIC: "emme anna 2 alennusta" (we do not give two discounts). The checkout has no support for discount codes, so `CAMPAIGN-A5-40` could never have worked.

- Product pages (EN + FI) no longer mention the code. They now say that the price already includes the 40 % campaign discount (regular price €910 / €490) and that no code is needed.
- The flyer badge now reads "-40 % KAMPANJAHINTA · EI KOODIA TARVITA".
- HIC: the offer is valid **until further notice** (toistaiseksi). The 31.10.2026 end date is removed everywhere. The offer will be reviewed if customer numbers grow.

## Learning outcome steps

- Learn/ HTML: N/A — pandoc is not available in this cloud container.
- Drive export and KB update: N/A — deferred to the HIC batch review.
