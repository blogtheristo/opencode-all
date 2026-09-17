# Meta Commerce Catalog — Administration Manual

**Version:** 1.0
**Date:** 2026-08-20
**Owner:** Lifetime Oy
**Related config:** `config/meta-commerce.json`
**Related PRs:** #1865

---

## 1. Overview

DWS10.com products are published to the **Meta Commerce Manager** catalog **"DWS IQ Store"**, which feeds the **WhatsApp Business catalog** (and later Advantage+ catalog ads). Products come from `dws10.com/config/products.json` and are shipped as a Google Merchant RSS feed.

**Current IDs (also in `config/meta-commerce.json`):**

| Item | Value |
|------|-------|
| Catalog name | DWS IQ Store |
| Catalog ID | `1272289434912643` |
| Business Manager | Lifetime Group — `133022958190` |
| Primary business page | Lifetime Group (`133022958190`) |
| Secondary business page | Lifetime Studios (`116629975052`) |
| Ad account | `57372468` (owner: Risto Anton Päärni) |
| Meta Pixel ID | `1061355716618688` |
| Feed URL | https://dws10.com/feeds/google-products.xml |

---

## 2. Product Images

### Image model

Every product has **two images** in the catalog:

1. **Primary image** (`image`) — generated branded product card, unique per product
2. **Secondary image** (`additionalImage`) — the former photo/hero image, optional

All 116 products have a unique primary card. 94 products carry a secondary image. The former `Risto_Malta.png` personal photo is **excluded entirely** (not used as primary or secondary).

### Generating product cards

```bash
.venv/bin/python scripts/generate_product_cards.py
```

- Reads `dws10.com/config/products.json`
- Writes 1024×1024 PNG cards to `dws10.com/static/images/products/<id>.png`
- Accent color + category label derived from `storeCategory`
- Output: 116 unique images, verified no duplicates (MD5), no blank images

### Adding a new product

1. Add the product entry to `dws10.com/config/products.json`
2. Set `"image": "/static/images/products/<id>.png"`
3. Optionally set `"additionalImage"` to a former/hero image
4. Regenerate cards: `.venv/bin/python scripts/generate_product_cards.py`
5. Sync to Pages source and regenerate feed (see §4)

---

## 3. Pricing rules

Meta/WhatsApp **do not show products priced at 0 EUR**. Two fixes were applied:

- `DWS-SOVEREIGN-DB-001` repriced from 0 → **499 EUR** (serious product, was invisible)
- Five free/pilot products repriced 0 → **1 EUR**: `LF-COMPLIANCE-AMBULANCE-001`, `CMP-T0`, `SS-T0`, `MO-T0`, `DWS-IQ-FREE-2026`

**Rule:** no product in the feed may have `price: 0`. If a product is genuinely free, either omit it from the feed or use a nominal 1 EUR price.

---

## 4. Feed generation & deploy

The feed generator reads from **both** `dws10.com/` and `landing-pages/dws10-com/` — they must stay identical.

```bash
# 1. Sync the edited source to the Pages deploy root
cp dws10.com/config/products.json landing-pages/dws10-com/config/products.json
cp -r dws10.com/static/images/products landing-pages/dws10-com/static/images/

# 2. Regenerate the feed (reads landing-pages copy)
node scripts/generate-google-feed.cjs

# 3. Keep both copies identical
cp landing-pages/dws10-com/feeds/google-products.xml dws10.com/feeds/google-products.xml
```

The feed generator now emits `g:additional_image_link` when `additionalImage` is set.

Deploy is automatic via the `.github/workflows/sync-dws6-landing-pages.yml` rsync → Cloudflare Pages pipeline after merge to `main`.

### Feed sanity checks

```bash
rg -c '<g:additional_image_link>' dws10.com/feeds/google-products.xml   # expect 94
rg -c 'Risto_Malta' dws10.com/feeds/google-products.xml                 # expect 0
rg -c '<g:price>0.00' dws10.com/feeds/google-products.xml               # expect 0
rg -o '<g:image_link>[^<]*</g:image_link>' dws10.com/feeds/google-products.xml | sort -u | wc -l   # expect 116
```

---

## 5. Meta Pixel

The Meta Pixel (`1061355716618688`) is injected into every HTML page by a **Cloudflare Pages middleware**, so no static HTML files need editing.

- **File:** `dws10.com/functions/_middleware.js` (mirrored to `landing-pages/dws10-com/functions/_middleware.js`)
- **Behavior:** reads HTML responses, injects the pixel snippet before `</head>`, skips non-HTML, large (>2 MB), and already-injected responses
- **Override:** env var `META_PIXEL_ID` overrides the hardcoded default

Deploying the middleware requires the **Cloudflare Pages project to have Functions enabled** (already true — `functions/api/contact.js` exists).

---

## 6. WhatsApp Business catalog

The WhatsApp Business catalog is powered by the same Commerce Manager catalog. After a product passes Meta validation it appears in the catalog. Expected latency after feed changes: up to 24–48 h.

Validation notes:

- Images must be public HTTPS URLs (all are under `https://dws10.com/static/images/...`)
- Prices must be non-zero (see §3)
- Products still in "pending" show as processed once Meta's review completes

---

## 7. Contact & Support

- **Config:** `config/meta-commerce.json` (ad account, business pages, catalog, feeds, pixel)
- **Repo:** dws6 — `meta-whatsapp-catalog` branch → PR #1865
- **Pixel:** Meta Events Manager, Pixel `1061355716618688`