# Checkout Payment Testing Plan — A5 Campaign Pre-Deployment

**Status:** ⏳ Pending real-payment testing before homepage deployment  
**Blocker:** Campaign checkout flow must work end-to-end with real payment before lifetime.fi changes go live  
**Rule:** "Testaisin sen oikealla maksulla ennen kuin etusivu vaihtuu, en sen jälkeen" (Test with real payment BEFORE homepage changes, not after)

---

## Test Scope

### Products Under Test
- **LIFETIME-WEBSTORE-MINI** (€350, pre-reduced price)
- **LIFETIME-WEB-STARTER** (€650, pre-reduced price)

### Payment Providers
- Revolut (via API integration)
- PayPal (fallback option)

### Test Paths

| Path | Entry Point | Expected Flow |
|------|-------------|---|
| **Product → Checkout** | `/products/lifetime-web-starter.html` → Add to cart → checkout | Add to cart → Checkout page → Payment provider → Success |
| **Campaign → Product → Checkout** | `/campaigns/a5-kampanja-kaksipuolinen.html` CTA → Product page → Checkout | Campaign page CTA links to product; product leads to checkout |
| **Direct Checkout** | `https://dws10.com/checkout/` with product ID | Checkout loads pre-filled with product |

---

## Test Checklist

### Pre-Test (Environment Setup)
- [ ] Campaign products (WEBSTORE-MINI, WEB-STARTER) visible on price-list (`/price-list/`)
- [ ] Product detail pages render correctly with pricing
- [ ] Checkout page loads without errors
- [ ] Payment provider integrations respond (Revolut, PayPal)

### Test 1: Product Detail Page → Checkout
- [ ] Open `/products/lifetime-web-starter.html`
- [ ] Verify pricing displays as €650 (pre-reduced, no discount code field)
- [ ] Click "Add to Cart" / "Proceed to Checkout" button
- [ ] Checkout page loads with product pre-filled
- [ ] Order summary shows correct amount (€650)

### Test 2: Campaign Page → Product → Checkout
- [ ] Open `/campaigns/a5-kampanja-kaksipuolinen.html`
- [ ] Click CTA button ("Tutustu tarjoukseen →")
- [ ] Lands on product detail page (`/products/lifetime-web-starter.html`)
- [ ] Pricing correct (€650)
- [ ] Proceed to checkout

### Test 3: Real Payment - Revolut
- [ ] At checkout page, select Revolut as payment method
- [ ] Initiate **test payment of €0.01** (minimum to verify integration works)
- [ ] Complete payment flow
- [ ] **Expected outcome:** Payment success page (`/checkout/success/`)
  - Order number visible
  - Confirmation summary shows product, amount, date
  - Email confirmation sent (verify in inbox)
- [ ] Check backend: order recorded in system

### Test 4: Real Payment - PayPal  
- [ ] Return to checkout page (or new product link)
- [ ] Select PayPal as payment method
- [ ] Initiate **test payment of €0.01**
- [ ] Complete PayPal flow
- [ ] **Expected outcome:** Same as Test 3 (success page, email, backend record)

### Test 5: Error Handling
- [ ] Attempt checkout with invalid/declined payment (to verify error messages)
- [ ] Cancel payment mid-flow (verify cancel page displays)
- [ ] Check retry logic (does checkout page persist or reset?)

---

## Success Criteria

✅ **All tests pass when:**
1. Both products (€350, €650) appear in checkout with correct pricing
2. Real payments (Revolut, PayPal) complete successfully
3. Success page displays order confirmation
4. Email confirmation arrives
5. Backend order records created
6. No console errors or unexpected redirects

❌ **Blockers (do not deploy if):**
1. Checkout page 404s or fails to load
2. Payment provider integration fails (API error, timeout)
3. Pricing incorrect (displays wrong amount or shows discount code field when not expected)
4. Success page unreachable after payment
5. Email confirmation not sent
6. Backend does not record order

---

## Test Environment Notes

- **Use test payment credentials** (PayPal sandbox, Revolut test account)
- **Test amounts:** €0.01 each (sufficient to verify integration, minimal cost)
- **Timing:** Complete all tests before pushing homepage changes to production
- **Rollback:** If any test fails, do not merge homepage PR until checkout is fixed

---

## Post-Test Actions

### If All Tests Pass ✅
1. Approve homepage deployment (`/campaigns/a5-kampanja-kaksipuolinen.html` integration, lifetime.fi updates)
2. Merge PR #2053 (or create new PR if merged)
3. Monitor first real customer payment (watch for errors in production logs)

### If Any Test Fails ❌
1. Document the failure (error message, screenshot, steps to reproduce)
2. Debug checkout/payment integration issue
3. Fix and re-test before attempting deployment

---

## Related Files
- Product pages: `/dws10.com/products/lifetime-*.html`
- Campaign page: `/dws10.com/campaigns/a5-kampanja-kaksipuolinen.html`
- Checkout: `/dws10.com/checkout/index.html`
- Products config: `/dws10.com/config/products.json`

**Decision Point:** Once this testing is complete and passes, homepage deployment is unblocked.
