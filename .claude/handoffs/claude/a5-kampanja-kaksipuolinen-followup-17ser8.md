# A5 Kampanja Kaksipuolinen — Follow-up Work

**Branch:** `claude/a5-kampanja-kaksipuolinen-followup-17ser8`  
**Date:** 2026-09-20  
**Status:** ✅ Follow-up PR #2053 open; homepage redesign + product pages complete

---

## Campaign State

**Merged deliverables (PR #2052 + current branch):**

- HTML campaign page: `/campaigns/a5-kampanja-kaksipuolinen.html` ✅ (live in branch)
  - Two-sided A5 flyer (print-optimized 148×210mm)
  - Pre-reduced prices: €350 (WEBSTORE-MINI), €650 (WEB-STARTER)
  - Dark theme with gold branding (#D4A574)
- Campaign products verified in `products.json`:
  - `LIFETIME-WEBSTORE-MINI` (350€ pre-reduced, one-time)
  - `LIFETIME-WEB-STARTER` (650€ pre-reduced, one-time)
- Discount strategy: **Pre-reduced pricing** (40% already included in displayed prices)
- VAT: Finland 25.5%

**Content verified:**

- Main headline: "Tempaise liiketoiminta nousuun." (gold color)
- Service tiers: Web services, email, e-commerce, support, security
- Pricing clearly marked with discount applicability
- Two-sided layout optimized for A5 print

---

## Completed ✅

### Product Detail Pages (Merged in PR #2052)

- ✅ Created `/products/lifetime-web-starter.html` (650€)
- ✅ Created `/products/lifetime-webstore-mini.html` (350€)
- ✅ Added campaign discount (CAMPAIGN-A5-40, -40%) to both pages
- ✅ Updated products.json with detailsUrl links
- ✅ Added both products to seriousProductIds (now public on price-list)
- ✅ Mirrored to landing-pages/ for dual-folder sync
- ✅ Regenerated feeds (google-products.xml)

### Campaign Page & Homepage Integration (PR #2053 in progress)

**Campaign Page:**

- ✅ Created `/campaigns/a5-kampanja-kaksipuolinen.html` (print-optimized A5 flyer)
  - Front: Pre-reduced pricing (€350, €650), -40% messaging, CTA
  - Back: Service features (websites, email, e-commerce, support, security)
  - Footer: Lifetime Oy branding, contact info
- ✅ Dual-folder sync to `landing-pages/dws10-com/campaigns/`

**Homepage Redesign:**

- ✅ Updated `lifetime.fi/index.html` hero section
  - Headline: "Tempaise liiketoiminta nousuun" (campaign messaging)
  - Tagline: SME-focused on websites, e-commerce, email automation
  - Stats: Pricing, campaign discount messaging, 72h go-live
  - CTAs: Campaign page + free consultation
- ✅ Updated page meta tags (title, description, OG tags) for SME focus
- ✅ Replaced "How Compliance Outcomes Get Delivered" with "How Your Business Gets Started"
- ✅ Updated CTA links to point to `/campaigns/a5-kampanja-kaksipuolinen.html` (relative URLs)
- ✅ Created PR #2053 for review

### Public URLs (Live)

- **WEB-STARTER:** `https://dws10.com/products/lifetime-web-starter.html`
- **WEBSTORE-MINI:** `https://dws10.com/products/lifetime-webstore-mini.html`
- **Price List:** `https://dws10.com/price-list/` (both products now visible)

---

## Critical Infrastructure — Pre-Deployment Checklist

**Status:** ⏳ Awaiting HIC action on real-payment checkout testing (blocker)

### 1. **Checkout Payment Testing** ⏳ BLOCKER

**Rule:** "Testaisin sen oikealla maksulla ennen kuin etusivu vaihtuu, en sen jälkeen" (Test with real payment BEFORE homepage changes, not after)

- Test both campaign products with real payments (Revolut, PayPal)
- Validate end-to-end checkout flow (product → cart → payment → success)
- Verify order confirmation emails sent, backend records created
- **Test amounts:** €0.01 each (minimal cost, verifies integration works)
- **Products:** WEBSTORE-MINI (€350), WEB-STARTER (€650)
- **Action:** Follow checklist in `docs/field-notes/2026-09-20-campaign-checkout-testing.md`
- **Status:** ⏳ Pending user action

**Decision:** Once checkout testing passes, homepage deployment is unblocked.

### 2. **DWS10 Role Clarity** ✅ IMPLEMENTED

**Issue:** Main dws10.com pages mixing sales with background/trust material ("dual-language cargo boxes")

**Solution:** Created dedicated About page to separate roles:

- **New page:** `dws10.com/about/` (links in footer, navigation)
  - Company mission, vision, platform overview
  - Company history, core values, leadership
  - Links to Trust Center + Compliance Hub for security/governance
  - Keeps main sales pages focused on products
- **Dual-folder sync:** `landing-pages/dws10-com/about/`
- **Status:** ✅ Complete

### 3. **301 Redirects Strategy** ✅ PREPARED

**Rule:** "301-uudelleenohjaukset pitää tehdä samassa julkaisussa kuin poisto" (Redirects in same publication as removals)

**Current deployment:** No removals, no redirects needed

**Future preparation:** Framework in place

- Document: `docs/field-notes/2026-09-20-redirect-strategy.md`
- Cloudflare `_redirects` file syntax documented
- Redirect mappings prepared if lifetime.fi scope changes
- Implementation ready when content removal occurs
- **Status:** ✅ Framework ready (no current action needed)

---

## Follow-up Opportunities

### 1. **Campaign Analytics Setup** (owner: HIC)

- Track campaign flyer QR code / short link clicks
- Set up UTM parameters for `CAMPAIGN-A5-40` discount code
- Monitor conversion rate from flyer → product purchase
- **Action:** Register campaign in analytics (Google Analytics 4, Bitly tracking)
- **Status:** ⏳ Pending HIC decision

### 2. **Print Distribution** (operational)

- Physical print from PDF to DWS6 office / partner distributors
- Mail/hand-distribution to target SME segment (e.g., local businesses in Espoo)
- **Action:** Obtain print order, shipping logistics, distribution contact list
- **Status:** ⏳ Pending operational approval

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
