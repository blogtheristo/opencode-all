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

## Open issue (not changed)

The campaign prices are already reduced (€350 and €650; "OVH" €490 and €910). The product pages also say that code `CAMPAIGN-A5-40` gives a further 40 % off at checkout. Read together, this promises a double discount. The HIC must decide which one is true.

## Learning outcome steps

- Learn/ HTML: N/A — pandoc is not available in this cloud container.
- Drive export and KB update: N/A — deferred to the HIC batch review.
