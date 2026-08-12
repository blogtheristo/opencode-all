# B2B Payment Flow — Flexible Deposit + Invoice

## Overview

```
Customer Journey:
┌──────────────────────────────────────────────────────────────┐
│ 1. STORE BROWSE                                              │
│    Product shown with price (e.g., €1,499)                   │
│    Copy: "maksa valitsemasi varaussumma, laskutamme          │
│    loppuosan yritykseltäsi"                                  │
│    (Pay your chosen deposit, we'll invoice the rest)         │
└──────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. REVOLUT CHECKOUT (FLEXIBLE DEPOSIT)                       │
│    Link: https://checkout.revolut.com/pay/3b94d171-0a5d...   │
│    - Customer enters custom amount (e.g., €500)              │
│    - No fixed minimum (product price floor: €0)              │
│    - Revolut processes immediately                           │
│    - Webhook → Backend: deposit_amount = €500                │
└──────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. BILLING INFO CAPTURE                                      │
│    After Revolut payment, form collects:                     │
│    ├─ Company name (required)                                │
│    ├─ VAT number / Business ID (required)                    │
│    ├─ Billing address (required)                             │
│    │  ├─ Street address                                      │
│    │  ├─ City                                                │
│    │  ├─ Postal code                                         │
│    │  └─ Country (EU/default FI)                             │
│    ├─ Contact email (required)                               │
│    └─ Contact phone (optional)                               │
└──────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. STRIPE INVOICE (REMAINDER)                                │
│    Remaining amount = Product price - Deposit paid           │
│    Example: €1,499 - €500 = €999 remaining                   │
│                                                              │
│    Stripe generates invoice with:                            │
│    ├─ Customer company details (from form)                   │
│    ├─ VAT number                                             │
│    ├─ Billing address                                        │
│    ├─ Line item: Product name / description                  │
│    ├─ Original amount: €1,499                                │
│    ├─ Deposit paid (Revolut): -€500                          │
│    ├─ Amount due: €999                                       │
│    └─ Payment link (Stripe payment)                          │
│                                                              │
│    Invoice sent to customer email                            │
└──────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. INVOICE PAYMENT (STRIPE)                                  │
│    Customer receives email with:                             │
│    ├─ Stripe invoice PDF (downloadable)                      │
│    ├─ Payment link                                           │
│    └─ Payment deadline (e.g., Net 14)                        │
│                                                              │
│    Options:                                                  │
│    ├─ Pay online via Stripe link                             │
│    ├─ Bank transfer (invoice includes wire details)          │
│    └─ Contact sales for payment terms                        │
└──────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. COMPLETION                                                │
│    ├─ Deposit + Invoice payment = Full amount received       │
│    ├─ Subscription/Service activated                         │
│    └─ Onboarding begins                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### 1. Database Schema (Supabase PostgreSQL)

#### Table: `company_billing_profiles`

```sql
CREATE TABLE company_billing_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Company info
  company_name TEXT NOT NULL,
  business_id TEXT NOT NULL,  -- ALV-numero / Business ID
  vat_number TEXT NOT NULL,

  -- Billing address
  billing_address_street TEXT NOT NULL,
  billing_address_city TEXT NOT NULL,
  billing_address_postal_code TEXT NOT NULL,
  billing_address_country VARCHAR(2) DEFAULT 'FI',

  -- Contact info
  contact_email TEXT NOT NULL,
  contact_phone TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,

  UNIQUE(user_id, business_id)
);

CREATE INDEX idx_company_billing_user ON company_billing_profiles(user_id);
CREATE INDEX idx_company_billing_business ON company_billing_profiles(business_id);
```

#### Table: `orders`

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id VARCHAR(50) NOT NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Payment flow
  payment_status VARCHAR(50) DEFAULT 'pending',  -- pending, deposit_paid, invoice_issued, paid, failed

  -- Revolut deposit
  revolut_transaction_id VARCHAR(100),
  deposit_amount DECIMAL(10,2),
  deposit_paid_at TIMESTAMP,

  -- Company billing
  company_billing_profile_id UUID REFERENCES company_billing_profiles(id),

  -- Stripe invoice
  stripe_invoice_id VARCHAR(100),
  invoice_amount DECIMAL(10,2),
  invoice_url TEXT,
  invoice_issued_at TIMESTAMP,
  invoice_due_date DATE,

  -- Stripe payment
  stripe_payment_intent_id VARCHAR(100),
  invoice_paid_at TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,

  UNIQUE(revolut_transaction_id)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

---

### 2. API Endpoints

#### POST `/api/v1/payments/b2b/billing-info`

Capture company billing information after Revolut deposit.

**Request:**

```json
{
  "revolut_transaction_id": "txn_abc123",
  "deposit_amount": 500,
  "company_name": "Acme Corporation Oy",
  "business_id": "1234567-8",
  "vat_number": "FI12345678",
  "billing_address_street": "Katuosoite 123",
  "billing_address_city": "Helsinki",
  "billing_address_postal_code": "00100",
  "billing_address_country": "FI",
  "contact_email": "accounting@acme.fi",
  "contact_phone": "+358401234567"
}
```

**Response:**

```json
{
  "status": "success",
  "order_id": "order_xyz789",
  "invoice": {
    "id": "in_stripe123",
    "url": "https://invoice.stripe.com/i/...",
    "amount_due": 999,
    "due_date": "2026-05-24",
    "payment_url": "https://pay.stripe.com/..."
  },
  "next_step": "invoice_sent",
  "email_sent_to": "accounting@acme.fi"
}
```

#### GET `/api/v1/payments/b2b/order/{order_id}`

Get order status.

**Response:**

```json
{
  "order_id": "order_xyz789",
  "product": {
    "id": "FH-OMNI-001",
    "name": "Firehorse Omnichannel V2",
    "price": 1499
  },
  "payment_flow": {
    "total": 1499,
    "deposit": {
      "amount": 500,
      "paid_at": "2026-04-24T10:00:00Z",
      "provider": "revolut"
    },
    "invoice": {
      "amount_due": 999,
      "status": "issued",
      "due_date": "2026-05-24",
      "stripe_invoice_url": "https://..."
    }
  },
  "billing_profile": {
    "company_name": "Acme Corporation Oy",
    "vat_number": "FI12345678"
  }
}
```

---

### 3. Webhook Integration

#### Revolut Webhook (Existing)

```
POST /api/v1/payments/webhook
Body: {
  "type": "payment.success",
  "payment_id": "...",
  "amount": 500,
  "currency": "EUR"
}

Trigger:
1. Create order record with deposit_paid status
2. Return billing info form to customer
```

#### Stripe Webhook (New)

```
POST /api/v1/payments/webhook
Body: {
  "type": "invoice.payment_succeeded" | "invoice.marked_uncollectible",
  "invoice_id": "in_stripe123"
}

Trigger:
1. Mark order as "paid"
2. Activate service
3. Send completion email
```

---

### 4. Frontend Flow

#### Step 1: Product Page (dws10.com/buy/)

```html
<div class="product-card">
  <h3>Firehorse Omnichannel V2</h3>
  <p class="price">€1,499</p>
  <p class="b2b-note">
    "Maksa valitsemasi varaussumma, laskutamme loppuosan yritykseltäsi." (Pay your chosen deposit,
    we'll invoice the rest from your company.)
  </p>
  <button onclick="goToCheckout()">Maksaa varaussumma Revolutilla</button>
</div>
```

#### Step 2: Revolut Checkout

Customer redirected to:

```
https://checkout.revolut.com/pay/3b94d171-0a5d-48da-bb35-18ce5a592672
```

Customer enters custom amount (e.g., €500).

#### Step 3: Billing Form (POST Revolut)

```html
<form id="billing-form">
  <h2>Laskutustiedot</h2>

  <fieldset>
    <legend>Yrityksen tiedot</legend>
    <input type="text" name="company_name" placeholder="Yrityksen nimi" required />
    <input type="text" name="business_id" placeholder="Y-tunnus (1234567-8)" required />
    <input type="text" name="vat_number" placeholder="ALV-numero (FI12345678)" required />
  </fieldset>

  <fieldset>
    <legend>Laskutusosoite</legend>
    <input type="text" name="billing_address_street" placeholder="Katuosoite" required />
    <input type="text" name="billing_address_city" placeholder="Kaupunki" required />
    <input type="text" name="billing_address_postal_code" placeholder="Postinumero" required />
    <select name="billing_address_country" value="FI">
      <option value="FI">Suomi</option>
      <option value="SE">Ruotsi</option>
      <option value="DE">Saksa</option>
      <option value="NO">Norja</option>
    </select>
  </fieldset>

  <fieldset>
    <legend>Yhteystiedot</legend>
    <input type="email" name="contact_email" placeholder="Sähköposti" required />
    <input type="tel" name="contact_phone" placeholder="Puhelinnumero (valinnainen)" />
  </fieldset>

  <button type="submit">Luo lasku ja aktivoi palvelu</button>
</form>
```

#### Step 4: Invoice Email

Customer receives Stripe invoice email with:

- Company name, billing address
- Original price, deposit paid, amount due
- Payment link
- Download as PDF

---

## Implementation Roadmap

### Phase 1: Database & Migration (Week 1)

- [ ] Create `company_billing_profiles` table
- [ ] Create `orders` table with payment flow tracking
- [ ] Add indexes for performance
- [ ] Write migration script (Supabase)

### Phase 2: Backend API (Week 1-2)

- [ ] POST `/api/v1/payments/b2b/billing-info` endpoint
- [ ] GET `/api/v1/payments/b2b/order/{order_id}` endpoint
- [ ] Stripe invoice creation logic
- [ ] Email templates (HTML)
- [ ] Validation (VAT number format, address fields)

### Phase 3: Stripe Integration (Week 2)

- [ ] Set up Stripe API connection
- [ ] Create invoice template (Stripe)
- [ ] Configure webhook for payment_succeeded
- [ ] Auto-activate service after payment
- [ ] Email service integration (Amazon SES)

### Phase 4: Frontend Form (Week 2-3)

- [ ] Create billing info form component (React)
- [ ] Form validation (client + server)
- [ ] Error handling & retry logic
- [ ] Success confirmation page
- [ ] Mobile responsiveness

### Phase 5: Testing & Deployment (Week 3)

- [ ] E2E testing (Revolut → Billing → Stripe flow)
- [ ] Load testing (payment processing)
- [ ] Security audit (PCI DSS, data handling)
- [ ] Staging environment testing
- [ ] Production rollout

---

## Security Considerations

### PCI DSS Compliance

- ❌ **Never store credit card data** (handled by Stripe)
- ✅ **Store company data only** (business_id, vat_number, address)
- ✅ **Use HTTPS** for all billing endpoints
- ✅ **Validate VAT numbers** server-side
- ✅ **Encrypt sensitive data at rest** (Supabase encryption)

### Data Privacy (GDPR)

- ✅ User can request data export (company billing profiles)
- ✅ User can request deletion (cascade to orders)
- ✅ Log all payment operations (audit trail)
- ✅ Stripe data retention policy (6 years for invoices)

### Fraud Prevention

- ✅ Webhook signature verification (Revolut + Stripe)
- ✅ Idempotency keys (prevent duplicate invoices)
- ✅ Rate limiting on billing endpoints
- ✅ VAT number validation (EU VIES API)

---

## Configuration (Environment Variables)

```bash
# Stripe
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_FROM=risto@onelifetime.world
SENDGRID_API_KEY=...  # or Amazon SES

# Database
DATABASE_URL=postgresql://...

# Frontend
VITE_API_BASE_URL=https://api.dws10.com
```

---

## Error Handling

### Common Issues & Recovery

| Scenario                                     | Issue                                | Recovery                                        |
| -------------------------------------------- | ------------------------------------ | ----------------------------------------------- |
| Revolut payment succeeds, billing form fails | Order created but billing incomplete | Retry billing form; customer can complete later |
| Billing form succeeds, Stripe invoice fails  | Order stuck in `invoice_issued`      | Retry invoice creation; admin notification      |
| Customer doesn't pay invoice within 30d      | Invoice unpaid                       | Auto-cancel order or send reminder              |
| VAT number invalid (VIES API down)           | Can't validate VAT                   | Allow manual override; flag for admin review    |
| Stripe webhook fails                         | Invoice created but not marked paid  | Cron job to sync Stripe → DB every hour         |

---

## Monitoring & Analytics

### Key Metrics

```
- Deposit conversion rate (store → Revolut)
- Billing form completion rate (Revolut → billing info)
- Invoice payment rate (issued → paid)
- Average time to payment (order → completion)
- Failed orders (top reasons)
```

### Dashboards

- Admin: Order pipeline (Revolut → Invoice → Paid)
- Finance: Revenue by company, VAT tracking
- Operations: Fulfillment status (when to activate service)

---

## References

- [Stripe Invoice API](https://stripe.com/docs/api/invoices)
- [Revolut Merchant API](https://developer.revolut.com/)
- [EU VAT Validation (VIES)](https://ec.europa.eu/taxation_customs/vies/)
- [GDPR Data Retention](https://gdpr-info.eu/)
