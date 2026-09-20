# A5 Kampanja Kaksipuolinen — Follow-up Work

**Branch:** `claude/a5-kampanja-kaksipuolinen-followup-17ser8`  
**Date:** 2026-09-20  
**Status:** ✅ Predecessor merged; campaign deliverables live in main

---

## Campaign State

**Merged deliverables (PR #2052):**

- HTML campaign page: `/campaigns/a5-kampanja-kaksipuolinen.html` (live on main)
- Print-ready 6-page A5 PDF (93% scale, two-sided)
- Campaign products verified in `products.json`:
  - `LIFETIME-WEBSTORE-MINI` (350€, one-time)
  - `LIFETIME-WEB-STARTER` (650€, one-time)
- Promotional discount: `-40%` code `CAMPAIGN-A5-40`
- VAT: Finland 25.5%

**Content verified:**

- Main headline: "Tempaise liiketoiminta nousuun." (gold color)
- Service tiers: Web services, email, e-commerce, support, security
- Pricing clearly marked with discount applicability
- Two-sided layout optimized for A5 print

---

## Completed ✅

### Product Detail Pages

- ✅ Created `/products/lifetime-web-starter.html` (650€)
- ✅ Created `/products/lifetime-webstore-mini.html` (350€)
- ✅ Added campaign discount (CAMPAIGN-A5-40, -40%) to both pages
- ✅ Updated products.json with detailsUrl links
- ✅ Added both products to seriousProductIds (now public on price-list)
- ✅ Mirrored to landing-pages/ for dual-folder sync
- ✅ Regenerated feeds (google-products.xml)

### Public URLs (Live)

- **WEB-STARTER:** `https://dws10.com/products/lifetime-web-starter.html`
- **WEBSTORE-MINI:** `https://dws10.com/products/lifetime-webstore-mini.html`
- **Price List:** `https://dws10.com/price-list/` (both products now visible)

---

## Follow-up Opportunities

### 1. **Campaign Analytics Setup** (owner: HIC)

- Track campaign flyer QR code / short link clicks
- Set up UTM parameters for `CAMPAIGN-A5-40` discount code
- Monitor conversion rate from flyer → product purchase
- **Action:** Register campaign in analytics (Google Analytics 4, Bitly tracking)

### 2. **Print Distribution** (operational)

- Physical print from PDF to DWS6 office / partner distributors
- Mail/hand-distribution to target SME segment (e.g., local businesses in Espoo)
- **Action:** Obtain print order, shipping logistics, distribution contact list

### 3. **Localization & A/B Variants** (design)

- Swedish version (`a5-kampanja-kaksipuolinen-sv.html`)
- English version (`a5-kampanja-kaksipuolinen-en.html`)
- Alternative color scheme (if needed for A/B testing)
- **Action:** Confirm localization priorities with HIC

### 4. **Email Campaign** (marketing)

- Create email campaign body referencing flyer
- Send to Lifetime email list with campaign-specific offer
- Schedule follow-up sequence
- **Action:** Draft email sequence, schedule send

### 5. **Landing Page Enhancement**

- Create dedicated `/campaigns/a5-landing-page/` with form capture
- Track which product tier (WEBSTORE-MINI vs WEB-STARTER) captures more leads
- **Action:** Design landing page with CTA + form

### 6. **Campaign Duration & Validity**

- Set campaign end date (currently open-ended)
- Monitor discount code usage metrics
- Plan wind-down or extension
- **Action:** Define campaign validity window (e.g., Q4 2026)

---

## Files & Artifacts

| File                                        | Status      | Owner |
| ------------------------------------------- | ----------- | ----- |
| `/campaigns/a5-kampanja-kaksipuolinen.html` | Live (main) | ✅    |
| `dws10.com/config/products.json`            | Verified    | ✅    |
| PDF export (local print workflow)           | Ready       | 🔄    |
| Handoff (this file)                         | Created     | ✅    |

---

## Next HIC Decision

**Choose one or more:**

1. **Proceed to print & distribution** (logistical next step)
2. **Set up analytics tracking** (measure campaign ROI)
3. **Localize to SWE/EN** (expand campaign reach)
4. **Email integration** (activate distribution to Lifetime list)
5. **Hold for review** (HIC validation before proceeding)

**No immediate action required** — campaign HTML is live and products are correctly priced. All follow-up items are optional enhancements.

---

## Branch Closure Recommendation

Once follow-up scope is defined, either:

- **Merge to main** if follow-up work is added to this branch
- **Close without merge** if all future work goes to separate feature branches
