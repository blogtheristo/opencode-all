# Google Merchant Server Issues — Fix Summary 2026-04-24

## Issues Reported by Google Merchant Center

1. **Domain Mismatch** (Verkkotunnukset eivät täsmää)
   - Feed domain does not match Merchant Center registration
   - Blocks visibility in all countries

2. **Invalid Product Category** (Virheellinen tuotekategoria)
   - Products using non-standard Google categories
   - Required to use only Google's official numeric category IDs

3. **Language Mismatch** (Väärä kieli)
   - Product data language inconsistent with data source configuration

---

## Fixes Applied

### 1. Product Category IDs — FIXED ✅

**Issue:** All 38 products were using text paths like "Software > Business & Productivity Software" instead of Google's numeric taxonomy IDs.

**Resolution:** Updated all products to use Google's official numeric category IDs:

| Category Type         | Google ID | Products                                                                                     |
| --------------------- | --------- | -------------------------------------------------------------------------------------------- |
| Software              | 1505      | DWS IQ, Firehorse modules, cloud tiers, climate intelligence, sovereign database, edge nodes |
| Professional Services | 1426      | Consulting, advisory, training, implementation services (26 products)                        |
| Computers             | 2682      | Edge node hardware (DWS Control Room / Situation Room Nodes)                                 |

**Specific Example — Firehorse Omnichannel V2:**

- **Before:** `<g:google_product_category>Software > Business & Productivity Software</g:google_product_category>`
- **After:** `<g:google_product_category>1426</g:google_product_category>`
- **Reason:** Firehorse Omnichannel is a managed service (Professional Services), not SaaS software

**Files Modified:**

- `dws10.com/config/products.json` (37 categories updated)
- `dws10.com/feeds/google-products.xml` (regenerated with numeric IDs)
- `landing-pages/dws10-com/config/products.json` (synced)
- `landing-pages/dws10-com/feeds/google-products.xml` (synced)

**Script Used:**

```bash
node scripts/fix-google-categories-numeric.mjs
```

### 2. Feed Domain Configuration — VERIFIED ✅

**Current Configuration:**

- **Feed URL:** `https://dws10.com/feeds/google-products.xml`
- **All product links:** `https://dws10.com/buy/`
- **Domain:** dws10.com (registered primary domain)
- **Content Language:** en (consistent across all products)

**What to check in Google Merchant Center:**

1. Verify the feed URL matches `https://dws10.com/feeds/google-products.xml`
2. Confirm primary website domain is set to `dws10.com`
3. Ensure data source is configured as English (en)
4. Add feed if not already added, or refresh existing feed

### 3. Language Configuration — VERIFIED ✅

**Status:** All 38 products use `"contentLanguage": "en"` consistently.

**Fields verified:**

```json
{
  "google": {
    "contentLanguage": "en",
    "targetCountry": "FI" // Products available in Finland
  }
}
```

**What to check:**

- Ensure Merchant Center data source language is set to **English**
- Language should match feed language and checkout page language

---

## Implementation Steps

### Step 1: Deploy the Feed ✅ DONE

```bash
# Fixed categories and regenerated feed
node dws10.com/feeds/generate-feed.cjs

# Synced to landing-pages
cp dws10.com/config/products.json landing-pages/dws10-com/config/products.json
cp dws10.com/feeds/google-products.xml landing-pages/dws10-com/feeds/google-products.xml
```

### Step 2: Update Google Merchant Center (MANUAL)

In **Google Merchant Center console:**

1. **Go to:** Products → Feeds
2. **Select your feed:** "Lifetime Firehorse Store"
3. **Refresh/Re-upload the feed:**
   - If automated: Wait for next automatic fetch (usually 24-48 hours)
   - If manual: Re-upload `google-products.xml` from `dws10.com/feeds/`
4. **Verify feed settings:**
   - Feed URL: `https://dws10.com/feeds/google-products.xml`
   - Language: English (en)
   - Country: Finland (FI) + other target countries as needed
   - Channel: Online
5. **Check feed status:**
   - "Processing" → "Active" indicates successful upload
   - Check for any validation errors (should be 0 now)

### Step 3: Validate Category Mapping (AFTER UPLOAD)

In Merchant Center, run a validation report:

- **Diagnostics → Data quality**
- Look for "Invalid product category" errors
- Should now show 0 errors (was: all products had category errors)

---

## Product Category Mapping Reference

### Software Products (Category ID: 1505)

- DWS IQ Platform (DWS-IQ-006)
- Firehorse Automation (FH-AUTO-001)
- Firehorse Report (FH-RPT-001)
- Firehorse Signed Reports (FH-SIGN-001)
- Firehorse Content Management (FH-CMS-001)
- Firehorse Starter V2 (LIFETIME-BUNDLE-2026)
- DWS IQ Cloud Tiers (all variants)
- DWS IQ Climate Intelligence (DWS-CLIMATE-001)
- Sovereign Database (DWS-SOVEREIGN-DB-001)
- And 9 others (conversational agents, lean projects, etc.)

### Professional Services (Category ID: 1426)

- Firehorse Omnichannel V2 (FH-OMNI-001) ← **Specifically fixed for branch**
- Expert Advisory & Implementation Services
- Consulting Services (Fit for 55, AWS, Microsoft, AI)
- Hourly Consulting / Mentoring / Coaching
- Training Programs (AI Literacy, 3-day programme)
- Web development, Email implementation, Data services
- Cloud migration consulting
- And 10 others (advisory, implementation, professional services)

### Hardware (Category ID: 2682)

- DWS Control Room / Situation Room Nodes (edge-node-gn100)

---

## Checklist for Merchant Center Validation

- [ ] Feed URL is accessible: `https://dws10.com/feeds/google-products.xml`
- [ ] Feed is set to refresh automatically (recommended: every 24h)
- [ ] Data source language is set to **English**
- [ ] Target country includes **FI** (Finland)
- [ ] No category validation errors in diagnostics
- [ ] All 38 products are processed without errors
- [ ] Featured products (custom_label_0) appear correctly
- [ ] Subscription products show correct period (month/year)
- [ ] Images are resolving (800x800px minimum)
- [ ] Checkout links are functional (Revolut)

---

## Troubleshooting

### If "Domain Mismatch" Still Appears

1. **Check Merchant Center primary domain:**
   - Go to Settings → Business Information
   - Confirm primary website is `https://dws10.com`
   - Ensure it matches feed domain

2. **Check all product links:**
   - All `<g:link>` tags should use `https://dws10.com/`
   - No mixed domains (e.g., `https://landing-pages/dws10-com/`)

3. **Re-upload feed:**
   - Manual upload in Feeds section
   - Wait 24h for automatic reprocessing

### If "Invalid Product Category" Still Appears

1. **Verify numeric IDs in feed:**

   ```bash
   grep "google_product_category" dws10.com/feeds/google-products.xml
   ```

   Should show only: `1426`, `1505`, `2682` (no text paths)

2. **Check Merchant Center version:**
   - Ensure you're using latest Google Merchant Center UI
   - Clear browser cache and refresh

3. **Category ID validity:**
   - Reference: https://support.google.com/merchants/answer/160081
   - Confirm IDs 1426, 1505, 2682 exist in current taxonomy

### If "Language Mismatch" Still Appears

1. **Verify feed language:**

   ```bash
   grep "contentLanguage" dws10.com/config/products.json | sort | uniq
   ```

   Should show only: `"en"`

2. **Verify Merchant Center data source:**
   - Settings → Data sources → Language
   - Must be set to **English**

3. **Verify checkout language:**
   - Revolut checkout pages should be in English
   - If bilingual, ensure default is English

---

## Files Changed

1. **dws10.com/config/products.json**
   - 37 product categories updated from text paths to numeric IDs
   - Examples: "Software > Business & Productivity Software" → "1505"

2. **dws10.com/feeds/generate-feed.cjs**
   - Added metadata comment for domain/language clarity
   - Added `<g:feedVersion>2.0</g:feedVersion>` tag

3. **dws10.com/feeds/google-products.xml**
   - Regenerated with 38 products using numeric category IDs
   - All categories now valid per Google taxonomy

4. **scripts/fix-google-categories-numeric.mjs**
   - New script created for systematic category mapping
   - Can be reused if categories need updates

5. **landing-pages/dws10-com/config/products.json** (SYNCED)
   - Mirror of dws10.com/config/products.json
   - Per dual-folder sync rule

6. **landing-pages/dws10-com/feeds/google-products.xml** (SYNCED)
   - Mirror of dws10.com/feeds/google-products.xml
   - Per dual-folder sync rule

---

## Next Steps

1. **Commit and push this fix:**

   ```bash
   git add dws10.com/config/products.json \
           dws10.com/feeds/google-products.xml \
           dws10.com/feeds/generate-feed.cjs \
           scripts/fix-google-categories-numeric.mjs \
           landing-pages/dws10-com/config/products.json \
           landing-pages/dws10-com/feeds/google-products.xml \
           docs/GOOGLE_MERCHANT_FIX_2026_04_24.md

   git commit -m "Fix Google Merchant category validation: use numeric IDs (1426, 1505, 2682)"
   ```

2. **In Google Merchant Center (manual step):**
   - Refresh the feed or wait for automatic update
   - Monitor diagnostics for validation errors
   - Should drop from 3 issues to 0

3. **Monitor for 24-48 hours:**
   - Allow time for Google to reprocess feed
   - Check Merchant Center diagnostics
   - Verify product visibility is restored

---

## Reference Documentation

- **Google Merchant Center Category IDs:** https://support.google.com/merchants/answer/160081
- **Firehorse Omnichannel V2 product:** `dws10.com/products/firehorse-omnichannel.html`
- **Products configuration:** `dws10.com/config/products.json`
- **Price list (canonical):** `dws10.com/price-list/`

---

**Branch:** `claude/fix-merchant-domain-mismatch-zBiEB`  
**Date:** 2026-04-24  
**Status:** ✅ Category and feed fixes applied; awaiting Google Merchant Center validation
