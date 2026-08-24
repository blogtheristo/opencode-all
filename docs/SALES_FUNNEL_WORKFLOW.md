# DWS IQ 6 — Sales Funnel Workflow

**Document ID:** DWS-SF-WORKFLOW-2026-001
**Version:** 1.1 | **Date:** 2026-04-26
**Owner:** Risto Anton Päämi, Lifetime Oy
**Classification:** Internal — Engineering Standard
**ARR Target:** €900k by Q4 2026

---

## Strategic Context

This workflow is the operational engine behind the €900k ARR target. The model is designed around one core insight: **EU compliance is a mandatory purchase, not a discretionary one.** The sales funnel does not need to convince — it needs to remove friction and guide the buyer from "I have a CSRD deadline" to "I have a signed invoice and a live system."

The **€1 activation model** is the key architectural decision. It:

- Verifies the buyer's payment method before any provisioning work begins
- Creates a signed commercial relationship (offer + acceptance + consideration) at minimum cost
- Gates the enterprise details form behind a financial commitment — eliminating non-serious inquiries
- Allows the React upsell form to operate post-commitment, when the buyer is already in "yes mode"

**Path to €900k ARR via this funnel:**

| Scenario                        | Customers              | Avg ARR/Customer | Total ARR |
| ------------------------------- | ---------------------- | ---------------- | --------- |
| Conservative (Tier 1 only)      | 45                     | €20,000          | €900k     |
| Base case (Tier 1 + Tier 2 mix) | 25 enterprise + 15 SME | €24,000 avg      | €975k     |
| Optimistic (Tier 2 dominant)    | 20 enterprise          | €45,000          | €900k     |

Each complete funnel pass (Steps 1–14) produces one activated customer. **Target: 3–4 funnel completions per month from June 2026.**

---

## Part 1 — Google Merchant Product Conversion

### The Problem

Google Merchant Centre does not accept `monthly` or `subscription` product types. **8 of 32 active products** fail validation. Without Google Merchant acceptance, these products cannot run paid search, Shopping ads, or appear in Google's product discovery surfaces.

### The Solution: Split-Price Architecture

Every product in `products.json` carries a **one-time price** (the only price Google Merchant sees) and a **separate recurring element** (handled by Stripe subscription, created post-purchase via the React form).

### Conversion Table — All 38 Products

**RULE:** `products.json → "type": "one-time"` for all products.
The monthly subscription is created in Stripe at Step 7 using `stripe.subscriptions.create()` with the appropriate price ID.

#### Products Already Compliant (one-time)

No change needed to type. Subscription portion (where applicable) moves to Stripe post-purchase.

| Product ID              | Google Merchant Price     | Post-Purchase Stripe Subscription            |
| ----------------------- | ------------------------- | -------------------------------------------- |
| DWS-IQ-006              | €4,999 (deployment)       | €499/month — auto-created at Step 7          |
| FH-AUTO-001             | €4,950 (project)          | None                                         |
| LIFETIME-BUNDLE-2026    | €9,990 (setup)            | €1,999/year — auto-created at Step 7         |
| FH-RPT-001              | €1,999 (template)         | None                                         |
| FH-CMS-001              | €99 (setup)               | None                                         |
| expert-services         | €4,500 (3-day engagement) | None — upsell to LIFETIME-EXP-001 retainer   |
| aws-consultancy         | €1,500 (day)              | None                                         |
| m365-consultancy        | €1,500 (day)              | None                                         |
| ai-consultant-day       | €1,500 (day)              | None                                         |
| business-mentor-30      | €4,960 (30 hours)         | None                                         |
| firehorse-coach         | €499 (workshop)           | None                                         |
| professional-web-pages  | €1,099 (day)              | None                                         |
| secure-email-proton     | €499 (implementation)     | None — Proton licence direct with Proton     |
| firehorse-data-services | €1,500 (day)              | None                                         |
| digital-design-gold     | €24,990 (setup)           | None                                         |
| cloud-ready-teams       | €1,500 (day)              | None                                         |
| ai-consulting-agentic   | €2,500 (assessment)       | €5,000/month retainer — upsell on React form |
| edge-node-gn100         | €3,999/node (hardware)    | None                                         |
| DWS-SOVEREIGN-DB-001    | €99 (assessment)          | €499/month Standard — auto-created at Step 7 |
| DWS-AEGIS-001           | €59,990 (deployment)      | €999/month — auto-created at Step 7          |
| DWS-THEMIS-001          | €14,990 (deployment)      | €499/month — auto-created at Step 7          |

#### Products Requiring Conversion (monthly → one-time setup + Stripe subscription)

| Product ID                   | Old Type                      | New GM Price | New GM Label                       | Stripe Subscription            |
| ---------------------------- | ----------------------------- | ------------ | ---------------------------------- | ------------------------------ |
| FH-OMNI-001                  | monthly €1,499                | **€1,499**   | "Campaign setup + first month"     | €1,499/month from month 2      |
| FH-SIGN-001                  | subscription €199             | **€199**     | "Annual licence activation"        | €199/year auto-renew           |
| sovereignty-cloud-consulting | monthly €1,500                | **€1,500**   | "Migration onboarding"             | €1,500/month Standard retainer |
| DWS-US-STARTER               | monthly €299 + €990 setup     | **€990**     | "US Cloud setup + first month"     | €299/month from month 2        |
| DWS-US-PILOT                 | monthly €799 + €2,490 setup   | **€2,490**   | "US Cloud pilot setup"             | €799/month                     |
| DWS-EU-STARTER               | monthly €499 + €1,490 setup   | **€1,490**   | "EU Sovereign setup + first month" | €499/month from month 2        |
| DWS-EU-PILOT                 | monthly €1,499 + €3,990 setup | **€3,990**   | "EU Sovereign pilot setup"         | €1,499/month                   |
| DWS-CLIMATE-001              | monthly €2,999 + €4,990 setup | **€4,990**   | "Climate Intelligence deployment"  | €2,999/month                   |

#### Advisory Products — React Form Only (not Google Merchant)

These do not appear as standalone Google Merchant listings. They surface on the React upsell form (Step 5) as recommended add-ons.

| Product ID           | Form Presentation                              | Conversion Target                           |
| -------------------- | ---------------------------------------------- | ------------------------------------------- |
| consulting-hourly    | "Book 2 hours with Risto — €400"               | Single-session to retainer                  |
| consulting-fit55     | "Fit for 55 specialist day — €1,500"           | Day to LIFETIME-EXP-001 retainer            |
| ai-agent-engineering | "AI engineer by the hour — €200/hr"            | Hours to ai-consulting-agentic assessment   |
| LIFETIME-EXP-001     | "Monthly compliance strategist — €4,000/month" | Primary advisory upsell for platform buyers |
| ai-koulutus-3d       | "3-day AI training programme — €6,250"         | Compliance for EU AI Act Article 4          |

---

## Part 2 — The 14-Step Funnel

```
ENTRY → [1] Bundle → [2] Discount → [3] €1 Pay → [4] Enterprise Form
      → [5] Upsell → [6] Accept → [7] Stripe → [8] Risto Alert
      → [9] Accounting → [10] Gaps handled → [11] Onboarding
      → [12] Welcome + Portal → [13] ERP Connect
      → [14] Admin Role Designation
```

---

### Step 1 — Bundle Selection with Discount

**Trigger:** Buyer arrives at `/buy/` or product details page and adds to cart.

**Cart Rules:**

| Items Selected           | Discount | Label                     |
| ------------------------ | -------- | ------------------------- |
| 1 product                | 0%       | —                         |
| 2 products               | 5%       | "Bundle Saver"            |
| 3 products               | 10%      | "Smart Bundle"            |
| 4–6 products             | 15%      | "Enterprise Bundle"       |
| 7+ products              | 20%      | "Full Stack"              |
| Pre-defined named bundle | 12–18%   | e.g. "Compliance Starter" |

**Pre-defined Named Bundles (pre-configured in `products.json → bundles[]`):**

| Bundle Name           | Products Included                                         | Bundle Price | Saving      |
| --------------------- | --------------------------------------------------------- | ------------ | ----------- |
| Compliance Starter    | FH-RPT-001 + FH-SIGN-001 + FH-CMS-001                     | €2,100       | €197 (9%)   |
| CSRD Ready            | LIFETIME-BUNDLE-2026 + DWS-CLIMATE-001 setup              | €13,990      | €990 (7%)   |
| Sovereignty Stack     | DWS-EU-STARTER + DWS-SOVEREIGN-DB-001 + edge-node-gn100×2 | €11,469      | €1,010 (8%) |
| Enterprise Compliance | DWS-AEGIS-001 + DWS-THEMIS-001 + expert-services          | €74,990      | €4,490 (6%) |

**Cart State (React context):**

```typescript
interface CartState {
  items: CartItem[]; // [{productId, qty, unitPrice}]
  bundleDiscount: number; // percentage
  namedBundle?: string; // bundle key if pre-configured
  subtotal: number; // sum of items
  discountAmount: number; // subtotal × bundleDiscount
  total: number; // subtotal − discountAmount
  currency: "EUR";
  vatTreatment: "B2B_VAT_0" | "B2B_VAT_FI"; // set after Step 4 VAT ID check
}
```

---

### Step 2 — Discount Calculation

**Engine rules (client-side, verified server-side):**

1. Apply named bundle discount first — overrides item count discount
2. Item count discount applies if no named bundle
3. Hardware (`edge-node-gn100`) counts as 1 item regardless of quantity; quantity is a separate `qty` multiplier
4. Advisory add-ons selected on Step 5 do NOT retroactively increase the Step 1 bundle discount — they are separate line items at list price
5. Annual subscription option (+2 months free) is calculated as: `monthlyPrice × 10` billed as one-time annual; label: "Annual (2 months free)"

**Price display rules:**

- Always show: original price, discount amount, final price
- For products with Stripe subscription: show "€X setup + €Y/month from [Month+1]"
- VAT treatment shown as: "Prices excl. VAT (B2B reverse charge)" until VAT ID confirmed at Step 4

---

### Step 3 — €1 Activation Payment (Apple Pay / Card)

**Purpose:** Create legal offer-and-acceptance at minimum friction. Verify payment method before triggering enterprise form. Eliminate non-serious inquiries.

**Payment processor:** Stripe Payment Intents
**Accepted methods:** Apple Pay, Google Pay, credit/debit card (Visa, Mastercard, Amex)
**Amount:** €1.00 (EUR, VAT included)
**Description:** `"DWS IQ 6 order activation — [Cart ID]"`

**On success:**

- Stripe returns `payment_intent.id` → stored as `cart.activationPaymentId`
- Cart locked (no more item changes)
- User routed to Step 4 (React form)
- Session timer starts: 30 minutes to complete Steps 4–6 or cart expires

**On failure:**

- Error shown inline: "Payment method not accepted. Please try a different card."
- Cart remains open
- No provisioning triggered

**Reconciliation:** The €1 is a deposit. It appears as a deduction on the Stripe invoice at Step 7:

```
LINE ITEM: "Activation deposit (paid)"    -€1.00
```

**Edge case — €1 paid but Steps 4–6 abandoned:**

- After 30-minute timeout, send one recovery email: "Your DWS order is waiting — complete your details in 24 hours to keep your bundle pricing"
- After 24 hours: issue €1 refund via `stripe.refunds.create({ payment_intent: cart.activationPaymentId })`, release cart. Do NOT attempt to cancel the PaymentIntent — cancellation is only possible before confirmation; a successful charge requires a Refund on the PaymentIntent/Charge.
- Log abandoned cart to `analytics.abandonedCarts[]` for retargeting

---

### Step 4 — React Enterprise Details Form

**Route:** `/checkout/enterprise-details`
**Gated by:** `cart.activationPaymentId` must exist

**Form fields (all required unless marked optional):**

```
COMPANY INFORMATION
├── Legal company name (input, max 120 chars)
├── Business ID / Registration number (input) — for FI: Y-tunnus format validated
├── EU VAT ID (input, optional) — format: FIxxxxxxxx / DExxxxxxxxx / etc.
│   └── On blur: call vat-validation API → sets cart.vatTreatment
├── Country (select, EU member states + Norway + UK)
├── Billing address line 1 (input)
├── Billing address line 2 (input, optional)
├── City (input)
├── Postal code (input)
└── Country matches selection (auto-fill, readonly)

PRIMARY CONTACT (invoice recipient)
├── Full name (input)
├── Job title (input) — used for upsell targeting at Step 5
├── Email address (input, validated)
├── Phone number (input, optional)
└── Language preference (select: FI / EN / SV)

DELIVERY & TECHNICAL CONTACT (optional — defaults to primary)
├── [ ] Same as primary contact (checkbox, default checked)
├── Technical contact name (input, conditional)
├── Technical contact email (input, conditional)
└── Technical contact phone (input, optional, conditional)

INVOICE PREFERENCES
├── PO number / reference (input, optional) — appears on invoice
├── Invoice delivery method (radio):
│   ├── ● Email PDF (default) → email field pre-filled from primary contact
│   ├── ○ eInvoice (Finvoice/TEAPPS) → OVT address input appears
│   └── ○ Both
└── Invoice email (input, pre-filled, editable)
```

**VAT logic:**

- FI VAT ID confirmed → `vatTreatment = "B2B_VAT_FI"` → add 25.5% VAT to total
- Valid non-FI EU VAT ID → `vatTreatment = "B2B_VAT_0"` → reverse charge, no VAT
- No VAT ID entered → `vatTreatment = "B2B_VAT_FI"` → add 25.5% FI VAT + show warning: "Please provide your EU VAT number to apply reverse charge. Without a valid VAT ID, Finnish VAT (25.5%) applies."

**On submit:** Form data stored in `order.enterpriseDetails`. Route to Step 5.

---

### Step 5 — Upsell Recommendations (React Form Page 2)

**Route:** `/checkout/recommendations`
**Logic:** Rule-based engine reads `cart.items[]` and `order.enterpriseDetails.jobTitle` to surface 3–5 relevant add-ons.

**Recommendation Rules:**

```
IF cart contains [DWS-IQ-006 OR LIFETIME-BUNDLE-2026 OR DWS-CLIMATE-001]
  THEN recommend: LIFETIME-EXP-001 (Monthly compliance strategist)
  LABEL: "Your platform is live — keep it ahead of every regulatory update"

IF cart contains [DWS-EU-STARTER OR DWS-EU-PILOT OR DWS-AEGIS-001]
  THEN recommend: sovereignty-cloud-consulting (monthly retainer)
  LABEL: "Sovereign migration support — guaranteed compliance throughout transition"

IF cart contains [FH-RPT-001] AND NOT cart contains [FH-SIGN-001]
  THEN recommend: FH-SIGN-001 (add-on, €199/year)
  LABEL: "Make your reports court-defensible — €199/year D&O protection"

IF cart contains any platform product
  THEN recommend: firehorse-coach (EU AI Act Literacy, €499)
  LABEL: "EU AI Act Article 4 training — mandatory for all AI system operators by 2 August 2026"

IF jobTitle contains [CTO OR Chief OR Director OR VP]
  THEN recommend: ai-consulting-agentic (assessment, €2,500)
  LABEL: "Ship 10× faster — agentic development assessment for your engineering team"

IF cart contains [expert-services OR consulting-fit55]
  THEN recommend: LIFETIME-EXP-001 (monthly retainer)
  LABEL: "Continue with your compliance strategist — monthly retainer from €4,000"

IF cart subtotal > €15,000
  THEN recommend: business-mentor-30 (AI strategy, €4,960)
  LABEL: "30 hours of AI strategy to maximise your DWS IQ investment"
```

**UX Design:**

- Each recommendation shown as a card: product name, hero text (from `heroText` field), price, toggle switch
- Toggle ON by default for FH-SIGN-001 (high value, low price)
- Toggle OFF by default for all others (respect buyer autonomy)
- "Why recommended?" expandable tooltip shows the rule explanation in plain language
- Running total updates in real-time as toggles change

**Advisory upsell format (hourly/daily products):**

- Presented as "Book a session" with calendar link, not added to invoice
- Clicking "Book" opens Calendly/Jitsi booking link in modal
- Booking confirmation creates a separate advisory invoice (not bundled into main order)

---

### Step 6 — Order Review and Acceptance

**Route:** `/checkout/review`

**Page shows:**

```
ORDER SUMMARY
─────────────────────────────────────────────────────
[Product name]                              €X,XXX.XX
[Product name]                              €X,XXX.XX
[Product name]                              €X,XXX.XX
─────────────────────────────────────────────────────
Subtotal                                   €XX,XXX.00
Bundle discount (10%)                      -€X,XXX.00
─────────────────────────────────────────────────────
Net total (excl. VAT)                      €XX,XXX.00
VAT (25.5% FI) / Reverse charge (0%)          €X,XXX
─────────────────────────────────────────────────────
TOTAL DUE                                  €XX,XXX.00
─────────────────────────────────────────────────────
Activation deposit (paid)                      -€1.00
─────────────────────────────────────────────────────
BALANCE DUE (Net 14)                       €XX,XXX.00

BILLING TO:
[Legal company name]
[VAT ID]
[Address]
Attention: [Primary contact name]

DELIVERY TO: [Technical contact email]
INVOICE TO: [Invoice email] / eInvoice OVT: [OVT address]

RECURRING SUBSCRIPTIONS (auto-activated on delivery):
• [Product] — €X,XXX/month from [delivery date + 1 month]
• [Product] — €XXX/year, auto-renews [delivery date + 1 year]
```

**Acceptance checkboxes (all required):**

- `[ ]` I confirm the company details above are correct and I am authorised to enter commercial agreements on behalf of [Company Name]
- `[ ]` I have read and accept the [DWS IQ Terms of Service] and [Data Processing Agreement (DPA)]
- `[ ]` I understand that recurring subscriptions listed above will be billed automatically and can be cancelled with 30 days notice

**Submit button:** "Confirm Order and Pay Balance"

**On submit:**

- Disable button, show spinner
- POST to `/api/checkout/confirm`
- Trigger Steps 7 → 9 in sequence (async, with retry)
- Route to Step 11 success page

---

### Step 7 — Stripe Invoice Creation and Payment

**API calls (server-side, `/api/checkout/confirm`):**

```javascript
// 1. Create or retrieve Stripe Customer
const customer = await stripe.customers.create({
  name: order.enterpriseDetails.companyName,
  email: order.enterpriseDetails.invoiceEmail,
  tax_id_data: [{ type: "eu_vat", value: order.enterpriseDetails.vatId }],
  address: { ...order.enterpriseDetails.billingAddress },
  metadata: { orderId: order.id, cartId: cart.id },
});

// 2. Create Invoice (not auto-charge — sends PDF for Net 14 payment)
const invoice = await stripe.invoices.create({
  customer: customer.id,
  collection_method: "send_invoice",
  days_until_due: 14,
  auto_advance: true,
  description: `DWS IQ 6 Order ${order.id}`,
  metadata: { orderId: order.id },
  footer: "Lifetime Oy | Business ID: 0772407-9 | VAT: FI07724079 | Payment: IBAN FI[ACCOUNT]",
});

// 3. Add line items
for (const item of cart.items) {
  await stripe.invoiceItems.create({
    customer: customer.id,
    invoice: invoice.id,
    description: item.productName,
    unit_amount: Math.round(item.unitPrice * 100), // cents
    quantity: item.qty,
    currency: "eur",
    tax_rates: vatApplicable ? [FI_VAT_RATE_ID] : [],
    metadata: { productId: item.productId },
  });
}

// 4. Add bundle discount as negative line item
if (cart.discountAmount > 0) {
  await stripe.invoiceItems.create({
    customer: customer.id,
    invoice: invoice.id,
    description: `Bundle discount (${cart.bundleDiscount}%)`,
    unit_amount: -Math.round(cart.discountAmount * 100),
    quantity: 1,
    currency: "eur",
  });
}

// 5. Deduct €1 activation deposit
await stripe.invoiceItems.create({
  customer: customer.id,
  invoice: invoice.id,
  description: "Activation deposit (paid by card)",
  unit_amount: -100,
  quantity: 1,
  currency: "eur",
});

// 6. Finalize and send invoice
await stripe.invoices.finalizeInvoice(invoice.id);
await stripe.invoices.sendInvoice(invoice.id);

// 7. Create Stripe Subscriptions for recurring products
for (const sub of order.subscriptions) {
  await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: sub.stripePriceId }],
    trial_end: sub.trialEndUnix, // delivery date + 30 days
    metadata: { orderId: order.id, productId: sub.productId },
  });
}
```

**Invoice number format:** `LTY-YYYY-NNNNN` (e.g. `LTY-2026-00042`)

**Payment methods on invoice:** IBAN bank transfer (primary), Stripe payment link (secondary)

**Stripe webhook events to handle:**

- `invoice.payment_succeeded` → trigger license key generation, send to CFO
- `invoice.payment_failed` → send payment reminder email, notify Risto
- `customer.subscription.deleted` → suspend tenant, send suspension warning

---

### Step 8 — Risto Confirmation Alert

**Trigger:** `invoice.finalized` webhook event from Stripe

**Email to:** `risto@onelifetime.world` (primary) + `risto.paarni2024@lifetime.fi` (CC)
**Subject:** `🟢 NEW ORDER — [Company Name] — €[Total] — Deliver by [Date]`

**Email body:**

```
NEW DWS IQ ORDER

Order ID:     [order.id]
Customer:     [Company Name] ([VAT ID])
Contact:      [Contact Name] <[Contact Email]>
Total:        €[total] (excl. VAT) — Invoice: [invoice.number]

PRODUCTS TO DELIVER:
✓ [Product 1] — SLA: [delivery_date]
✓ [Product 2] — SLA: [delivery_date]
✓ [Product 3] — SLA: [delivery_date]

SUBSCRIPTIONS AUTO-ACTIVATED:
• [Product] — €[price]/month — starts [start_date]

DELIVERY SLAs:
• Software deployments (DWS-IQ-006, AEGIS, THEMIS): 5 business days
• Report templates (FH-RPT-001): 3 business days
• Bundles (LIFETIME-BUNDLE-2026): 5 business days
• Consulting (expert-services, advisory): calendar booking link sent to client
• Hardware (edge-node-gn100): shipping within 7 business days
• Training (firehorse-coach, ai-koulutus-3d): scheduling email sent within 24h

ACTION REQUIRED:
→ Log this order at github.com/blogtheristo/dws6 /orders/[order.id]
→ Create tenant at admin.dws10.com/tenants/new
→ Send license key to [technical_contact_email] within SLA

Invoice: [Stripe invoice link]
Data Room entry: [order JSON link]
```

---

### Step 9 — Accounting Integration (elasku.fi)

**Endpoint:** `oma@elasku.fi`
**Format:** Finnish Finvoice 3.0 XML + PDF attachment
**Trigger:** Same webhook as Step 8 — `invoice.finalized`

**Email to accounting:**

- **To:** `oma@elasku.fi`
- **CC:** `risto@onelifetime.world`
- **Subject:** `Finvoice [LTY-YYYY-NNNNN] — [Company Name] — €[total]`
- **Attachment 1:** `invoice_[LTY-YYYY-NNNNN].pdf` (Stripe PDF, watermarked "Lifetime Oy")
- **Attachment 2:** `invoice_[LTY-YYYY-NNNNN].xml` (Finvoice 3.0 XML, generated server-side)

**Finvoice XML required fields:**

```xml
<Finvoice>
  <MessageTransmissionDetails>
    <MessageSenderDetails>
      <FromIdentifier>0772407-9</FromIdentifier>  <!-- Lifetime Oy Y-tunnus -->
      <FromIntermediator>OKOYFIHH</FromIntermediator>  <!-- bank routing -->
    </MessageSenderDetails>
    <MessageReceiverDetails>
      <ToIdentifier>[customer_ovt_or_vatid]</ToIdentifier>
    </MessageReceiverDetails>
  </MessageTransmissionDetails>
  <SellerPartyDetails>
    <SellerPartyIdentifier>0772407-9</SellerPartyIdentifier>
    <SellerOrganisationName>Lifetime Oy</SellerOrganisationName>
    <SellerPostalAddressDetails>
      <SellerStreetName>Laidunmaanraitti 2 A 25</SellerStreetName>
      <SellerTownName>Espoo</SellerTownName>
      <SellerPostCodeIdentifier>02330</SellerPostCodeIdentifier>
      <CountryCode>FI</CountryCode>
    </SellerPostalAddressDetails>
  </SellerPartyDetails>
  <!-- BuyerPartyDetails, InvoiceRow[], EpiDetails (payment info) -->
</Finvoice>
```

**VAT handling in Finvoice:**

- FI VAT (25.5%): `<VatRatePercent>25.50</VatRatePercent>`
- Reverse charge: `<VatRatePercent>0</VatRatePercent>` + `<VatExemptionReasonText>EU VAT reverse charge — Art. 196 Directive 2006/112/EC</VatExemptionReasonText>`

**Recurring subscriptions:** A separate Finvoice is generated monthly/annually on the Stripe subscription billing date. Same format, references original order ID.

---

### Step 10 — Gap Handling (Filled)

The following scenarios are not covered by the happy path and require explicit handling:

**GAP A: Payment method fails at Step 3 (€1)**

- Show inline error. Offer 3 alternative methods (Apple Pay, Google Pay, card).
- If all fail: "Unable to process payment — contact sales@dws10.com or call +358 400 319 010"
- Do NOT abandon the cart. Log the failed attempt.

**GAP B: VAT ID validation fails at Step 4**

- VIES API timeout: allow manual override with warning "VAT ID could not be validated automatically — please verify and continue"
- Invalid format: inline error with format hint (e.g. "Finnish VAT ID format: FI12345678")
- Unregistered VAT ID: treat as no-VAT-ID (apply FI VAT) with warning

**GAP C: Stripe invoice creation fails at Step 7**

- Retry up to 3 times with exponential backoff (2s, 4s, 8s)
- If all retries fail: save order state to database with status `PAYMENT_PENDING`
- Send manual processing alert to Risto
- Show customer: "Your order has been received — you will receive your invoice by email within 1 business hour"

**GAP D: Duplicate order (same company, same cart within 24h)**

- Detect by: matching company VAT ID + overlapping product IDs
- Show: "We found a recent order from [Company Name]. Is this a new order or a continuation?"
- Options: "New order" | "Check existing order status"

**GAP E: Hardware order (edge-node-gn100) — shipping details**

- If hardware is in cart: add Step 4.5 — Shipping address form (separate from billing)
- Capture: delivery address, contact name, phone, delivery instructions
- Hardware SLA: Acer Finland ship within 5 business days → customer within 7 business days
- Trigger separate Acer fulfillment notification to `risto@onelifetime.world`

**GAP F: Advisory products booked at Step 5 — calendar integration**

- When advisory product toggled ON: capture preferred date/time slot (3 options)
- On order confirmation: send Calendly/Jitsi booking link to technical contact
- Advisory engagement is confirmed separately from main invoice

**GAP G: Subscription cancellation**

- Stripe webhook `customer.subscription.deleted` triggers:
  1. Tenant status → `SUSPENDED` (not deleted — data retained 90 days)
  2. Email to customer: "Your DWS IQ subscription has ended — your data is retained for 90 days"
  3. Alert to Risto with cancellation reason (from Stripe cancellation feedback)
  4. Churn record added to `analytics.churnEvents[]`

**GAP H: PO number / procurement delay**

- Some enterprise buyers cannot pay Net 14 — they have 30–60 day procurement cycles
- If buyer requests extended terms: form field "Request extended payment terms (30/60 days)" → email to Risto for manual approval
- Approved extended terms recorded in Stripe invoice `due_date` override

---

### Step 11 — License Provisioning and Onboarding Account Creation

**Trigger:** `invoice.finalized` (immediate) — NOT waiting for payment. Net 14 terms extend trust to the customer.

**Automated provisioning flow:**

```
1. Create tenant in dws10.com admin
   POST /api/admin/tenants {
     companyName, vatId, orderId, products[], subscriptions[]
   }
   → Returns: tenantId, tenantSlug (e.g. "nokiaoy-dws")

2. Generate admin credentials
   username: [technical_contact_email]
   password: crypto.randomBytes(12).toString('base64url') — 16 chars
   → Stored: bcrypt hash in tenant.users[]
   → KYA agent identity created: [companyName]-ADMIN-001

3. Generate product license keys
   For each platform product in order:
   licenseKey = `DWS-${productId}-${tenantId}-${year}-${crypto.randomUUID().slice(0,8).toUpperCase()}`
   e.g. "DWS-IQ6-NOKIAOY-2026-3F7A2B9C"
   → Stored in tenant.licenses[]
   → KYA-audited: license issuance logged with timestamp, orderId, deliveredTo

4. Send onboarding email to technical contact
   Subject: "Your DWS IQ 6 access is ready — [Company Name]"
   → Login URL: https://[tenantSlug].dws10.com/login
   → Username: [technical_contact_email]
   → Temporary password: [generated password]
   → License keys: [listed per product]
   → Action required: "Change your password on first login"
   → Support: risto@onelifetime.world | +358 400 319 010
```

**SLA for provisioning:**

- Automated (software-only orders): within 5 minutes of `invoice.finalized`
- Manual review required (Aegis, Themis, hardware): within 5 business days
- Advisory/consulting: calendar booking link sent within 1 business day

---

### Step 12 — Welcome Onboarding Phase

**Trigger:** First login by technical contact admin

**Welcome sequence:**

```
DAY 0 — Immediate on first login
├── Welcome modal: "Welcome to DWS IQ 6, [Name]. Let's get you set up in 15 minutes."
├── Product tour: guided walkthrough of purchased products (Shepherd.js or similar)
├── Quick wins panel: "Your first 3 actions to get value today"
│   ├── 1. Create your first CSRD report (if FH-RPT-001)
│   ├── 2. Connect your first data source (ERP/API)
│   └── 3. Invite your team members
└── DWS Academy link: academy.dws10.com — self-paced compliance training

DAY 1 — Automated email (24h after first login)
└── "How is your DWS IQ setup going?" — 3 yes/no questions → routes to appropriate support

DAY 3 — Automated email
└── "Your first compliance report guide" — step-by-step PDF for their purchased products

DAY 7 — Risto personal email
└── "Hi [Name] — checking in on your DWS IQ setup. Any blockers?" — triggers calendar offer if no login activity detected

DAY 14 — Invoice due date reminder (Stripe auto-sends)
└── "Invoice [LTY-YYYY-NNNNN] is due today" — with payment link

DAY 30 — Success check-in
└── "Your first month with DWS IQ — how many hours has the platform saved your team?"
    → Opens short NPS survey
    → High NPS (9-10): trigger customer reference programme invitation
    → Low NPS (0-6): immediate alert to Risto for personal outreach
```

**Admin user management:**

```
CFO/Admin can:
├── Create additional user accounts (roles: Admin, User, ReadOnly, Auditor)
├── Set per-user product access (e.g. User A sees only FH-RPT-001)
├── Download audit trail (KYA session logs) for compliance documentation
├── Manage billing (view invoices, update payment method)
└── Manage subscriptions (upgrade, downgrade, cancel)
```

---

### Step 13 — ERP and Legacy App Connections

**Available connectors (standard, no custom development):**

| System                 | Connector                | Auth Method                  | Data Synced                                            |
| ---------------------- | ------------------------ | ---------------------------- | ------------------------------------------------------ |
| SAP S/4HANA            | REST API / OData V4      | OAuth 2.0 client credentials | Invoices, purchase orders, energy meters, cost centers |
| SAP Business One       | Service Layer API        | HTTP Basic + session         | Invoices, items, business partners                     |
| Microsoft Dynamics 365 | Power Platform connector | Azure AD OAuth               | Finance, operations, sustainability module             |
| IFS Cloud              | IFS REST API             | OAuth 2.0                    | Work orders, asset management, energy data             |
| Monitor G5             | SOAP/REST hybrid         | API key                      | Production orders, energy consumption                  |
| Procountor             | Procountor API           | OAuth 2.0                    | Invoices, purchase ledger, VAT reports                 |
| Netvisor               | Netvisor API             | HMAC-signed requests         | Accounting data, VAT, payroll                          |
| Severa PSA             | Visma API                | OAuth 2.0                    | Project data, time tracking                            |
| Google Workspace       | Google Workspace API     | Service account              | Documents, Drive compliance evidence                   |
| Microsoft 365          | Microsoft Graph API      | Azure AD                     | SharePoint, Teams, compliance content                  |
| Proton Drive           | Proton API               | API token                    | Encrypted document storage                             |
| Custom REST API        | Generic REST adapter     | API key / OAuth              | Any JSON endpoint                                      |
| CSV/Excel upload       | File parser              | Upload                       | Historical data, bulk imports                          |

**Connection setup flow (admin UI):**

```
Admin → Settings → Integrations → Add Connection
  1. Select system from list
  2. Enter connection credentials (encrypted at rest with AES-256)
  3. Test connection (→ green/red status)
  4. Map fields: system fields ↔ DWS IQ data schema
  5. Set sync schedule: real-time / hourly / daily / weekly
  6. Activate → first sync runs immediately
  → KYA logs: "Integration [system] connected by [admin] at [timestamp]"
```

**ERP data in DWS IQ context:**

- SAP invoice data → Scope 3 emissions calculation for CSRD
- Dynamics 365 energy data → Fit for 55 optimization agent input
- IFS work orders → Predictive maintenance agent triggers
- Procountor/Netvisor → Financial data for carbon cost accounting

**First connection SLA:** Admin should complete first ERP connection within 30 minutes of onboarding using the setup wizard. Support available at risto@onelifetime.world if connection fails.

---

### Step 14 — Admin Role Designation and Permission Model

**Trigger:** First successful login after Step 11 provisioning, OR explicit CFO designation via the admin portal during onboarding (Day 0–7 window).

**Why this step exists:** The CFO who paid the €1 activation and signed the Net 14 invoice is the **billing owner** — but is rarely the right person to manage users, configure ERP connectors, or approve autonomous agent actions in production. Conflating these roles produces two failure modes:

1. **Operational paralysis** — every ERP connection, user invite, or agent approval blocks on the CFO
2. **Audit / compliance risk** — the same person who approves spend also approves the autonomous actions being spent on (separation-of-duties violation under EU AI Act Article 14 human oversight requirements)

Step 14 separates these into two distinct roles, each backed by a distinct login.

**Roles defined:**

| Role                    | Login Identity                                                                       | Can Do                                                                                                                                                                                | Cannot Do                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Billing Owner (CFO)** | Email used at Step 4 (invoice recipient)                                             | View invoices, update payment method, approve subscription upgrades / downgrades, cancel subscriptions, download VAT receipts, request extended payment terms (Step 10 GAP H)         | Manage users, configure ERPs, approve agent actions, change tenant settings |
| **Tenant Admin**        | Email distinct from CFO — designated by CFO, or auto-promoted from technical contact | Manage users (create / disable / role-assign), configure ERPs (Step 13), approve autonomous agent actions, view audit / KYA logs, set per-user product access, manage tenant settings | View invoices, change payment method, approve billing changes               |

**Designation flow (two paths):**

```
PATH A — CFO designates (preferred):
1. CFO logs in at /admin (using invoice email from Step 4)
2. Admin portal shows: "You are the Billing Owner for [Company].
   Designate a Tenant Admin to manage users and integrations."
3. CFO enters: admin name + admin email + role (Tenant Admin)
4. System sends admin invitation email with separate temporary password
5. Admin completes first login → password change → MFA enrolment
6. KYA logs: "tenantAdmin designated by [cfoEmail] → [adminEmail] at [timestamp]"

PATH B — Auto-promotion (fallback, fires at Day 7 if Path A not used):
1. If technical_contact_email != invoice_email at Step 4:
   → Technical contact is auto-promoted to Tenant Admin role at Step 11
   → CFO login (invoice email) retains Billing Owner role only
2. If technical_contact_email == invoice_email:
   → Day 7 reminder email to CFO: "Designate a Tenant Admin or
     reply to confirm you will hold both roles"
   → CFO can dual-hold both roles by replying — KYA flags this as a
     separation-of-duties exception in the audit log (quarterly review)
3. KYA logs: "tenantAdmin auto-promoted by system rule at [timestamp]"
```

**Permission matrix (enforced server-side via Supabase RLS):**

| Capability               | Billing Owner | Tenant Admin | User | ReadOnly | Auditor |
| ------------------------ | :-----------: | :----------: | :--: | :------: | :-----: |
| View invoices            |       ✓       |      ✗       |  ✗   |    ✗     |    ✓    |
| Update payment method    |       ✓       |      ✗       |  ✗   |    ✗     |    ✗    |
| Cancel subscription      |       ✓       |      ✗       |  ✗   |    ✗     |    ✗    |
| Manage users             |       ✗       |      ✓       |  ✗   |    ✗     |    ✗    |
| Configure ERPs           |       ✗       |      ✓       |  ✗   |    ✗     |    ✗    |
| Approve agent actions    |       ✗       |      ✓       |  ✗   |    ✗     |    ✗    |
| Run agents (read-only)   |       ✗       |      ✓       |  ✓   |    ✓     |    ✓    |
| Download audit / KYA log |       ✗       |      ✓       |  ✗   |    ✗     |    ✓    |
| Change tenant settings   |       ✗       |      ✓       |  ✗   |    ✗     |    ✗    |
| View product data        |       ✗       |      ✓       |  ✓   |    ✓     |    ✓    |
| Edit product data        |       ✗       |      ✓       |  ✓   |    ✗     |    ✗    |

**KYA / EU AI Act Article 12 considerations:**

- Every Tenant Admin action affecting agent behaviour (approve, override, suspend) is appended to the Article 12 hash-chained ledger with `actorRole: tenantAdmin`, `actorEmail`, `tenantId`, `policyId`.
- Billing Owner actions affecting commercial terms are logged separately under `actorRole: billingOwner` — never co-mingled with operational events.
- Dual-role exception (CFO holds both) records `kyaPolicy: separation_of_duties_waived`, surfacing to the quarterly KYA review queue.

**Hand-off back to Step 13:** Once the Tenant Admin is named, ownership of the ERP integration flow at Step 13 transfers from the technical contact to the Admin role. The CFO never sees the integrations panel.

**SLA:** Tenant Admin must be designated within 14 days of `invoice.finalized`. If not designated by Day 14, KYA blocks new agent action approvals until role separation is resolved (Billing Owner can still view invoices and pay).

---

## Part 3 — ARR Bridge: How This Funnel Reaches €900k

### Revenue Model per Completed Funnel Pass

**Average order value (AOV) targets by customer segment:**

| Segment                           | Typical Bundle                                   | One-Time | Annual Recurring | Total Year-1 |
| --------------------------------- | ------------------------------------------------ | -------- | ---------------- | ------------ |
| SME Compliance (50–150 employees) | FH-RPT + FH-SIGN + firehorse-coach               | €2,697   | €199/yr          | ~€2,900      |
| SME Platform (150–500 employees)  | LIFETIME-BUNDLE-2026 + DWS-EU-STARTER            | €11,480  | €5,988/yr        | ~€17,500     |
| Mid-Market (500–2,000 employees)  | DWS-IQ-006 + DWS-CLIMATE-001 + LIFETIME-EXP-001  | €9,989   | €47,988/yr       | ~€58,000     |
| Enterprise (>2,000 employees)     | DWS-AEGIS-001 + DWS-THEMIS-001 + expert-services | €79,480  | €17,988/yr       | ~€97,500     |

### €900k ARR Target — Customer Mix Required

```
CONSERVATIVE PATH (all Tier 1 SME):
  45 SME Platform customers × €20,000 ARR = €900k ✓
  Rate needed: 3.75 customers/month for 12 months

BASE CASE (Tier 1 + Tier 2 mix):
  20 Mid-Market × €36,000 ARR    = €720k
  15 SME Platform × €12,000 ARR  = €180k
  ─────────────────────────────────────────
  35 customers total              = €900k ✓
  Rate needed: 2.9 customers/month

OPTIMISTIC PATH (Enterprise acceleration):
  10 Enterprise × €50,000 ARR    = €500k
  15 Mid-Market × €27,000 ARR    = €405k
  ─────────────────────────────────────────
  25 customers total              = €905k ✓
  Rate needed: 2.1 customers/month
```

### Funnel Conversion Assumptions

```
Arctic 15 launch (June 15): 300 qualified attendees → 60 demo requests
Demo → trial: 35% conversion = 21 trials started
Trial → paid: 40% conversion = 8-9 customers in Q3 2026

Monthly steady-state (Q4 2026+):
  Inbound (SEO + Google Merchant): 15 cart starts/month
  Outbound (NCC reference + B2B2G): 5 qualified leads/month
  Partner (Peachscore, accelerators): 3 referrals/month
  ─────────────────────────────────────────────────────
  Total qualified: 23/month
  Cart → €1 activation: 30% = 7/month
  €1 activation → completed order: 65% = 4.5/month
  ─────────────────────────────────────────────────────
  Monthly new customers: ~4–5 → €900k ARR achieved by month 12
```

---

## Part 4 — Implementation Checklist (What Needs to Be Built)

### Immediate (before Arctic 15 launch, June 15, 2026)

- [ ] `products.json` — convert all 8 monthly products to `"type": "one-time"`, add `stripeSubscriptionPriceId` field
- [ ] `/buy/` — cart state management (React context + localStorage backup)
- [ ] Bundle discount engine — client-side calculation, server-side verification
- [ ] Stripe integration — PaymentIntent for €1, Invoice creation, Subscription creation
- [ ] Step 4 React form — enterprise details, VAT ID validation (VIES API)
- [ ] Step 5 recommendations engine — rule-based, product-aware
- [ ] Step 6 order review — full itemized display with VAT calculation
- [ ] `/api/checkout/confirm` — server endpoint orchestrating Steps 7–11
- [ ] Finvoice 3.0 XML generator — for elasku.fi integration
- [ ] Email templates — Risto alert, CFO onboarding, welcome sequence
- [ ] Tenant provisioning — admin API, user creation, license key generation
- [ ] Stripe webhooks — `invoice.finalized`, `invoice.payment_succeeded`, `invoice.payment_failed`

### Q3 2026 (post-launch, pre-Series A)

- [ ] DWS Academy — self-paced onboarding content for each product
- [ ] Admin UI — user management, role assignment, subscription management
- [ ] Step 14 — Billing Owner / Tenant Admin role split, designation flow (Path A + Path B), Supabase RLS permission matrix, Article 12 logging of role events
- [ ] ERP connector library — SAP, Dynamics 365, IFS as first three
- [ ] NPS survey integration (Day 30 touchpoint)
- [ ] Abandoned cart recovery email sequence
- [ ] Analytics dashboard — `abandonedCarts[]`, `churnEvents[]`, funnel conversion rates
- [ ] Hardware fulfillment flow — Step 4.5 shipping form + Acer Finland integration
- [ ] Extended payment terms approval flow

---

_Document ID: DWS-SF-WORKFLOW-2026-001 | Version: 1.1 | 2026-04-26_
_Owner: Risto Anton Päämi | Lifetime Oy | laidunmaanraitti 2 A 25, 02330 Espoo_
_Classification: Internal Engineering Standard — do not distribute_
