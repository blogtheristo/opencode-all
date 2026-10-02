# Payment Testing Execution Plan — Campaign A5 Checkout Validation

**Status:** ✅ Infrastructure Ready — Awaiting Live Payment Testing  
**Date:** 2026-09-20  
**Session:** claude/campaign-payment-testing-0k2okm  
**Decision Point:** Once all tests pass → campaign homepage deployment is unblocked

---

## Configuration Status

### Products Updated

✅ Added payment provider fields to `dws10.com/config/products.json`:

- **LIFETIME-WEB-STARTER** (€650): `revolutLink: null`, `paypalPlanId: null`
- **LIFETIME-WEBSTORE-MINI** (€350): `revolutLink: null`, `paypalPlanId: null`

### Checkout Flow Ready

✅ Checkout page at `/dws10.com/checkout/index.html` supports:

- Product loading from `products.json`
- Customer information collection (name, email, company, country)
- Payment method selection (Revolut Business, PayPal)
- Success page at `/checkout/success/` with order confirmation
- Cancel page at `/checkout/cancel/` with retry option

### Fallback Payment Mechanisms

✅ Configured for both providers:

- **Revolut fallback:** `revolut.me/lifetimeoy/{amount}EUR` (used when no checkout link available)
- **PayPal:** Dynamic URL creation with `paypal.com/cgi-bin/webscr` (handles any amount)

---

## Test Execution Plan

### Phase 1: UI & Navigation Validation (No Payment Required)

**Goal:** Verify checkout flow loads correctly without errors

1. **Campaign Page → Product Page → Checkout**
   - [ ] Open `https://dws10.com/campaigns/a5-kampanja-kaksipuolinen.html`
   - [ ] Click "Tutustu tarjoukseen →" CTA
   - [ ] Verify lands on `/products/lifetime-web-starter.html`
   - [ ] Verify price shows €650
   - [ ] Click "Proceed to Checkout" / "Add to Cart" → checkout button

2. **Direct Checkout URL**
   - [ ] Navigate to `https://dws10.com/checkout/?product=LIFETIME-WEB-STARTER`
   - [ ] Verify product loads with correct name and €650 price
   - [ ] Verify form fields display (name, email, company, country)
   - [ ] Verify payment options render (Revolut, PayPal)

3. **Form Validation**
   - [ ] Submit empty form → verify error messages appear
   - [ ] Enter partial data (name only) → verify validation blocks
   - [ ] Enter all required fields → button becomes active
   - [ ] Verify form persists data on payment method toggle

### Phase 2: Real Payment Testing (€0.01 Each Product)

**Goal:** Validate end-to-end payment flow with both providers

#### Test 2A: Revolut Business Payment (WEB-STARTER €650 → €0.01 test)

**Setup:**

- Revolut Business account with EUR balance
- Payment method selected: Revolut Business (default)

**Steps:**

1. [ ] Navigate to checkout: `https://dws10.com/checkout/?product=LIFETIME-WEB-STARTER`
2. [ ] Fill form:
   - First Name: `Test`
   - Last Name: `Revolut`
   - Email: (use real email for confirmation receipt)
   - Company: `Test Company`
   - Country: `FI`
3. [ ] Verify payment method shows "Revolut Business" selected
4. [ ] Click "Pay €650 Now" button
5. [ ] **Expected:** Redirect to Revolut checkout at `https://revolut.me/lifetimeoy/650EUR` OR dedicated Revolut Checkout link
6. [ ] Complete payment for **€0.01** (or minimum test amount if revolut.me doesn't support €0.01)
7. [ ] [ ] **Verify success page:**
   - Order number visible
   - Product name: "Website Starter"
   - Amount: €650 (or €0.01 if tested with test amount)
   - Timestamp displayed
8. [ ] **Verify email confirmation:**
   - Check inbox for order confirmation email
   - Email contains: product name, amount, order details

**Troubleshooting:**

- If redirects to revolut.me fail → document URL that was attempted
- If payment form never shows → check browser console for JavaScript errors
- If success page doesn't load → check URL in browser address bar

---

#### Test 2B: PayPal Payment (WEBSTORE-MINI €350 → €0.01 test)

**Setup:**

- PayPal Business account with EUR balance or test mode enabled
- Payment method selected: PayPal

**Steps:**

1. [ ] Navigate to checkout: `https://dws10.com/checkout/?product=LIFETIME-WEBSTORE-MINI`
2. [ ] Fill form:
   - First Name: `Test`
   - Last Name: `PayPal`
   - Email: (use real email for confirmation receipt)
   - Company: `Test Company`
   - Country: `FI`
3. [ ] Click PayPal payment option to select
4. [ ] Verify payment method shows "PayPal" selected
5. [ ] Click "Pay €350 Now" button
6. [ ] **Expected:** Redirect to PayPal payment form at `paypal.com/cgi-bin/webscr`
7. [ ] Log into PayPal (if not already logged in)
8. [ ] Complete payment for **€0.01**
9. [ ] [ ] **Verify success page (same expectations as Test 2A)**
10. [ ] **Verify email confirmation (same expectations as Test 2A)**

**Troubleshooting:**

- If PayPal page doesn't load → verify domain is paypal.com (not a phishing page)
- If login required → use real PayPal account credentials
- If amount shows incorrectly on PayPal → document what it shows vs. what checkout page showed

---

#### Test 2C: Revolut Business Payment (WEBSTORE-MINI €350 test)

**Setup:** Same as Test 2A, different product

**Steps:**

1. [ ] Navigate to checkout: `https://dws10.com/checkout/?product=LIFETIME-WEBSTORE-MINI`
2. [ ] Fill form (as above, but different email/name for tracking)
3. [ ] Revolut selected (default)
4. [ ] Click "Pay €350 Now"
5. [ ] Complete payment for €0.01
6. [ ] Verify success page and email confirmation

---

#### Test 2D: PayPal Payment (WEB-STARTER €650 test)

**Setup:** Same as Test 2B, different product

**Steps:**

1. [ ] Navigate to checkout: `https://dws10.com/checkout/?product=LIFETIME-WEB-STARTER`
2. [ ] Fill form (as above, different email/name)
3. [ ] Select PayPal
4. [ ] Click "Pay €650 Now"
5. [ ] Complete payment for €0.01
6. [ ] Verify success page and email confirmation

---

### Phase 3: Error Handling & Edge Cases

**Goal:** Verify checkout handles errors gracefully

1. **Declined Payment**
   - [ ] Test with declined payment card in Revolut/PayPal (if test mode available)
   - [ ] Verify error message displays in checkout page
   - [ ] Verify can retry without losing form data

2. **Cancel Mid-Payment**
   - [ ] Complete checkout form and click "Pay" button
   - [ ] Cancel at payment provider (PayPal: "Cancel Payment", Revolut: back button)
   - [ ] [ ] **Verify redirects to** `/checkout/cancel/` with retry option

3. **Network Error During Redirect**
   - [ ] Simulate slow network or temporarily disconnect
   - [ ] Verify form doesn't submit twice
   - [ ] Verify can retry after reconnecting

---

## Success Criteria

✅ **All tests PASS when:**

1. Both products (€350, €650) display correctly on checkout page
2. Forms validate and accept customer information
3. **Revolut payments complete successfully** (redirect to payment provider works)
4. **PayPal payments complete successfully** (redirect to PayPal works)
5. Success page displays after payment with order confirmation
6. Email confirmation arrives within 5 minutes of payment
7. Backend order records are created (check admin panel / database)
8. No console errors during checkout process
9. No unexpected redirects or 404 pages

❌ **BLOCKERS (do not proceed if):**

1. Checkout page fails to load (404, blank page, errors)
2. Product pricing incorrect on checkout page
3. Payment method buttons don't respond
4. Redirect to payment provider fails (stays on checkout page)
5. Success page doesn't load after payment completion
6. Email confirmation not received
7. Backend doesn't record order
8. Form data not persisting during interaction

---

## Testing Log

### Test Results Template

```
## Test Session: YYYY-MM-DD

### Test 2A: Revolut (WEB-STARTER €0.01)
- Status: ✅ PASS / ⚠️ PARTIAL / ❌ FAIL
- Checkout page loads: YES / NO
- Redirect URL: [actual URL attempted]
- Payment completed: YES / NO
- Success page displays: YES / NO
- Email received: YES / NO / PENDING
- Notes: [any issues encountered]

### Test 2B: PayPal (WEBSTORE-MINI €0.01)
- Status: ✅ PASS / ⚠️ PARTIAL / ❌ FAIL
- [same fields...]
```

---

## Post-Testing Actions

### If All Tests Pass ✅

**HIC Decision Gate:** Approve homepage deployment

1. [ ] Review this testing log for completeness
2. [ ] Confirm all email confirmations received
3. [ ] Verify backend order records in database/admin
4. [ ] Approve PR for homepage changes (lifetime.fi integration + campaign page)
5. [ ] Merge to `main` → auto-deploys via Cloudflare Pages

### If Any Test Fails ❌

1. [ ] Document exact failure point (which test, which step)
2. [ ] Note error message from checkout page / payment provider
3. [ ] Check browser console for JavaScript errors
4. [ ] Review network tab for failed API calls
5. [ ] Debug checkout code or payment provider integration
6. [ ] Re-test after fix
7. [ ] **Do not merge homepage changes until all tests pass**

---

## Related Files

- **Checkout page:** `/dws10.com/checkout/index.html` (JavaScript, form, payment logic)
- **Products config:** `/dws10.com/config/products.json` (product definitions, pricing, payment links)
- **Campaign page:** `/dws10.com/campaigns/a5-kampanja-kaksipuolinen.html` (entry point for CTAs)
- **Product pages:**
  - `/dws10.com/products/lifetime-web-starter.html` (€650 product details)
  - `/dws10.com/products/lifetime-webstore-mini.html` (€350 product details)
- **Success page:** `/dws10.com/checkout/success/index.html` (post-payment confirmation)
- **Cancel page:** `/dws10.com/checkout/cancel/index.html` (payment cancellation fallback)

---

## Next Steps

**HIC Action Required:**

1. **Decide on Revolut Checkout Integration:**
   - Option A: Use fallback `revolut.me/lifetimeoy/{amount}EUR` links (already configured)
   - Option B: Create dedicated Revolut Checkout links in Revolut Business dashboard and update `products.json` with `revolutLink` URLs
   - Recommendation: **Option B for professional checkout experience**, but Option A is functional for testing

2. **Execute Payment Tests:**
   - Run all 4 payment tests (2 products × 2 payment methods)
   - Document results in testing log below

3. **Review Test Results:**
   - If all pass → approve homepage changes
   - If any fail → diagnose and fix before homepage deployment

4. **Post-Deployment Monitoring:**
   - Watch for first customer payments in production
   - Monitor email confirmations
   - Check backend order logs for errors

---

## Payment Provider Details

### Revolut Business

- **Domain:** `revolut.me` (personal links), `checkout.revolut.com` (merchant checkout)
- **Test URL:** `https://revolut.me/lifetimeoy/650EUR` (fallback for STARTER)
- **Account:** Lifetime Oy Business account (risto.paarni@lifetime.fi)
- **Supported currencies:** EUR
- **Test mode:** Yes, use Revolut staging environment

### PayPal

- **Domain:** `paypal.com` (production), `sandbox.paypal.com` (testing)
- **Email:** Configured as `risto.anton@lifetime.fi` in checkout code
- **Return URL:** `https://dws10.com/checkout/success/`
- **Cancel URL:** `https://dws10.com/checkout/cancel/`
- **Test mode:** Use PayPal Sandbox for non-production testing

---

**Status Summary:**  
✅ Infrastructure ready  
⏳ Awaiting HIC approval to execute payment testing  
🔴 **Campaign deployment blocked until all tests pass**
