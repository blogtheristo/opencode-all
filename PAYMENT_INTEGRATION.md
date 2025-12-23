# DWS IQ Platform - Payment Integration Strategy
## Revolut Business + PayPal Business

**Document Version:** 1.0
**Last Updated:** November 16, 2025
**Prepared by:** Claude Code for Lifetime Oy

---

## 🏦 Existing Payment Infrastructure

You already have:
- ✅ **Revolut Business** (EU-focused, low fees)
- ✅ **PayPal Business** (Global reach, buyer trust)

This is a **strategic advantage** that saves you:
- €500-1,000 setup costs (Stripe account)
- 2-3 weeks integration time
- Payment processor comparison research

---

## 💳 Payment Architecture

### Option A: Dual Payment Provider (Recommended)

```
┌──────────────────────────────────────────────────────────────────┐
│  USER CHECKOUT (app.lifetime.fi/subscribe)                      │
└──────────────────────────────────────────────────────────────────┘
                               ↓
                    User selects payment method
                               ↓
         ┌─────────────────────┴─────────────────────┐
         ↓                                           ↓
┌────────────────────────┐              ┌────────────────────────┐
│  EU/EEA Customers      │              │  Global Customers      │
│  (Revolut Business)    │              │  (PayPal Business)     │
└────────────────────────┘              └────────────────────────┘
         ↓                                           ↓
   SEPA, Cards (low fee)                    PayPal, Cards, etc.
         ↓                                           ↓
┌────────────────────────────────────────────────────────────────┐
│  Webhook Handlers (api.lifetime.fi/v1/webhooks)               │
│  - Revolut: /webhooks/revolut                                 │
│  - PayPal: /webhooks/paypal                                   │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│  Subscription Management (Supabase)                            │
│  - Update user subscription_tier                              │
│  - Grant access to premium features                           │
│  - Send confirmation email                                    │
└────────────────────────────────────────────────────────────────┘
```

### Why Dual Provider?

| Provider | Best For | Fees | Advantages |
|----------|----------|------|------------|
| **Revolut Business** | EU/EEA customers | 0.8% + €0.20 (cards), 0% (SEPA) | Low cost, instant SEPA, EUR native |
| **PayPal Business** | Global customers | 2.9% + €0.35 | Buyer protection, global trust, 200+ countries |

**Strategy:**
- **Default to Revolut** for EU customers (Turner Construction, etc.)
- **Fallback to PayPal** for non-EU or customers who prefer PayPal

---

## 💰 Pricing Tiers

### Subscription Plans

| Plan | Price | Agent Calls | Edge Devices | Support | Payment Methods |
|------|-------|-------------|--------------|---------|----------------|
| **Free** | €0/mo | 100/month | 0 | Community | N/A |
| **Pro** | €499/mo | 10,000/month | 5 | Email | Revolut, PayPal |
| **Enterprise** | €2,499/mo | Unlimited | 50+ | Dedicated Slack | Revolut, PayPal, Invoice |

### Turner Construction Pilot (Custom)

- **Contract:** €30,000 (one-time setup)
- **Success Fee:** €20,000 (if >10% time savings proven)
- **Payment:** Revolut Business invoice (SEPA bank transfer)

---

## 🔧 Technical Integration

### Revolut Business API

**Documentation:** https://developer.revolut.com/docs/business/payments

```typescript
// backend/services/payments/revolut.ts
import axios from 'axios'

const REVOLUT_API_URL = 'https://b2b.revolut.com/api/1.0'
const REVOLUT_API_KEY = process.env.REVOLUT_API_KEY

interface RevolutPaymentRequest {
  amount: number
  currency: 'EUR' | 'USD'
  customer_email: string
  description: string
  redirect_url: string
}

export async function createRevolutPaymentLink(
  req: RevolutPaymentRequest
): Promise<string> {
  const response = await axios.post(
    `${REVOLUT_API_URL}/payment-requests`,
    {
      amount: req.amount,
      currency: req.currency,
      recipient_email: req.customer_email,
      description: req.description,
      redirect_url: req.redirect_url
    },
    {
      headers: {
        'Authorization': `Bearer ${REVOLUT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return response.data.payment_link
}

// Webhook handler for Revolut
export async function handleRevolutWebhook(payload: any) {
  const { event_type, payment } = payload

  if (event_type === 'payment.completed') {
    // Update Supabase: user subscription activated
    await supabase
      .from('users')
      .update({
        subscription_tier: 'pro',
        subscription_status: 'active',
        subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      })
      .eq('email', payment.customer_email)

    console.log(`✅ Revolut payment completed: ${payment.id}`)
  }

  return { status: 'ok' }
}
```

### PayPal Business API

**Documentation:** https://developer.paypal.com/docs/api/overview/

```typescript
// backend/services/payments/paypal.ts
import axios from 'axios'

const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_SECRET

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')

  const response = await axios.post(
    `${PAYPAL_API_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  return response.data.access_token
}

export async function createPayPalSubscription(
  plan_id: string,
  user_email: string
): Promise<string> {
  const accessToken = await getPayPalAccessToken()

  const response = await axios.post(
    `${PAYPAL_API_URL}/v1/billing/subscriptions`,
    {
      plan_id: plan_id, // 'dwsiq-pro-monthly'
      subscriber: {
        email_address: user_email
      },
      application_context: {
        brand_name: 'DWS IQ Platform',
        user_action: 'SUBSCRIBE_NOW',
        return_url: 'https://app.lifetime.fi/subscribe/success',
        cancel_url: 'https://app.lifetime.fi/subscribe/cancel'
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  // Return approval URL for user to complete subscription
  return response.data.links.find((link: any) => link.rel === 'approve').href
}

// Webhook handler for PayPal
export async function handlePayPalWebhook(payload: any) {
  const { event_type, resource } = payload

  if (event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
    // Update Supabase
    await supabase
      .from('users')
      .update({
        subscription_tier: 'pro',
        subscription_status: 'active',
        paypal_subscription_id: resource.id
      })
      .eq('email', resource.subscriber.email_address)

    console.log(`✅ PayPal subscription activated: ${resource.id}`)
  }

  if (event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
    // Downgrade to free tier
    await supabase
      .from('users')
      .update({
        subscription_tier: 'free',
        subscription_status: 'cancelled'
      })
      .eq('paypal_subscription_id', resource.id)

    console.log(`⚠️  PayPal subscription cancelled: ${resource.id}`)
  }

  return { status: 'ok' }
}
```

### FastAPI Webhook Endpoints

```python
# backend/services/agent-orchestrator/main.py (add these routes)

from fastapi import APIRouter, HTTPException, Request
from payment.revolut import handle_revolut_webhook
from payment.paypal import handle_paypal_webhook

router = APIRouter(prefix="/v1/webhooks")

@router.post("/revolut")
async def revolut_webhook(request: Request):
    """Handle Revolut payment webhooks"""
    payload = await request.json()

    # Verify webhook signature (production security)
    # signature = request.headers.get('X-Revolut-Signature')
    # if not verify_revolut_signature(payload, signature):
    #     raise HTTPException(status_code=401, detail="Invalid signature")

    result = await handle_revolut_webhook(payload)
    return result

@router.post("/paypal")
async def paypal_webhook(request: Request):
    """Handle PayPal subscription webhooks"""
    payload = await request.json()

    # Verify webhook signature
    # headers = dict(request.headers)
    # if not verify_paypal_signature(payload, headers):
    #     raise HTTPException(status_code=401, detail="Invalid signature")

    result = await handle_paypal_webhook(payload)
    return result

app.include_router(router)
```

---

## 🔐 Webhook Security

### Revolut Webhook Verification

```python
import hmac
import hashlib

def verify_revolut_signature(payload: dict, signature: str) -> bool:
    """Verify Revolut webhook signature"""
    secret = os.getenv("REVOLUT_WEBHOOK_SECRET")

    # Compute HMAC SHA256
    computed_signature = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(computed_signature, signature)
```

### PayPal Webhook Verification

```python
import requests

def verify_paypal_signature(payload: dict, headers: dict) -> bool:
    """Verify PayPal webhook signature using PayPal API"""

    verification_response = requests.post(
        f"{PAYPAL_API_URL}/v1/notifications/verify-webhook-signature",
        json={
            "transmission_id": headers.get("paypal-transmission-id"),
            "transmission_time": headers.get("paypal-transmission-time"),
            "cert_url": headers.get("paypal-cert-url"),
            "auth_algo": headers.get("paypal-auth-algo"),
            "transmission_sig": headers.get("paypal-transmission-sig"),
            "webhook_id": os.getenv("PAYPAL_WEBHOOK_ID"),
            "webhook_event": payload
        },
        headers={
            "Authorization": f"Bearer {get_paypal_access_token()}",
            "Content-Type": "application/json"
        }
    )

    return verification_response.json().get("verification_status") == "SUCCESS"
```

---

## 💡 Frontend Implementation (Next.js)

### Subscription Page Component

```typescript
// frontend/app/subscribe/page.tsx
'use client'

import { useState } from 'react'

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro')
  const [paymentMethod, setPaymentMethod] = useState<'revolut' | 'paypal'>('revolut')
  const [loading, setLoading] = useState(false)

  const plans = {
    pro: { price: 499, features: ['10K agent calls/month', '5 edge devices', 'Email support'] },
    enterprise: { price: 2499, features: ['Unlimited calls', '50+ edge devices', 'Dedicated Slack'] }
  }

  const handleSubscribe = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          payment_method: paymentMethod,
          user_email: 'user@example.com' // From auth context
        })
      })

      const { payment_url } = await response.json()

      // Redirect to Revolut or PayPal payment page
      window.location.href = payment_url
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>

      {/* Plan Selection */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            onClick={() => setSelectedPlan(key as any)}
            className={`p-6 border-2 rounded-lg cursor-pointer ${
              selectedPlan === key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}
          >
            <h2 className="text-2xl font-bold capitalize mb-2">{key}</h2>
            <p className="text-4xl font-bold mb-4">€{plan.price}<span className="text-lg">/mo</span></p>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Method Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPaymentMethod('revolut')}
            className={`flex-1 p-4 border-2 rounded-lg ${
              paymentMethod === 'revolut' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}
          >
            <img src="/revolut-logo.png" alt="Revolut" className="h-8 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Best for EU customers (0.8% fee)</p>
          </button>

          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`flex-1 p-4 border-2 rounded-lg ${
              paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}
          >
            <img src="/paypal-logo.png" alt="PayPal" className="h-8 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Global payments (2.9% fee)</p>
          </button>
        </div>
      </div>

      {/* Subscribe Button */}
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-4 rounded-lg text-xl font-bold disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Subscribe to ${selectedPlan} - €${plans[selectedPlan].price}/mo`}
      </button>

      <p className="text-sm text-gray-600 text-center mt-4">
        Cancel anytime. No long-term contracts.
      </p>
    </div>
  )
}
```

---

## 📊 Fee Comparison

### Revolut Business Fees (EU Customers)

| Payment Type | Fee | Example (€499 plan) | Net Revenue |
|--------------|-----|---------------------|-------------|
| SEPA Transfer | 0% | €0 | €499 |
| Debit Card (EU) | 0.8% + €0.20 | €4.19 | €494.81 |
| Credit Card (EU) | 1.2% + €0.20 | €6.19 | €492.81 |
| International Card | 2.8% + €0.20 | €14.17 | €484.83 |

**Average Fee:** ~1.5% (€7.49 per €499 transaction)

### PayPal Business Fees (Global)

| Payment Type | Fee | Example (€499 plan) | Net Revenue |
|--------------|-----|---------------------|-------------|
| PayPal Balance | 2.9% + €0.35 | €14.82 | €484.18 |
| Card (any) | 2.9% + €0.35 | €14.82 | €484.18 |
| International | 3.9% + €0.35 | €19.81 | €479.19 |

**Average Fee:** ~3.2% (€15.82 per €499 transaction)

### Strategy

- **Prioritize Revolut for EU** → Save 1.7% per transaction
- **Use PayPal for non-EU** → Global reach worth the extra fee

**Annual Savings (20 EU customers):**
- 20 customers × €499/mo × 12 months = €119,760 revenue
- Revolut fees: €1,797 (1.5%)
- PayPal fees: €3,832 (3.2%)
- **Savings: €2,035/year** by using Revolut for EU

---

## 🚀 Implementation Timeline

### Week 1: Payment Infrastructure Setup

**Day 1-2: Revolut Business Configuration**
```bash
# Generate Revolut API keys
# 1. Log into Revolut Business portal
# 2. Navigate to Settings → API
# 3. Create Production API key
# 4. Set webhook URL: https://api.lifetime.fi/v1/webhooks/revolut
# 5. Enable events: payment.completed, payment.failed
```

**Day 3-4: PayPal Business Configuration**
```bash
# Setup PayPal Developer Account
# 1. Log into https://developer.paypal.com
# 2. Create App → Get Client ID and Secret
# 3. Create Subscription Plans (Pro, Enterprise)
# 4. Set webhook URL: https://api.lifetime.fi/v1/webhooks/paypal
# 5. Enable events: BILLING.SUBSCRIPTION.*
```

**Day 5: Test Payments**
```bash
# Revolut Sandbox Testing
curl -X POST https://sandbox.revolut.com/api/1.0/payment-requests \
  -H "Authorization: Bearer ${REVOLUT_SANDBOX_KEY}" \
  -d '{"amount": 499, "currency": "EUR"}'

# PayPal Sandbox Testing
# Use PayPal Sandbox accounts to test subscription flow
```

### Week 2: Frontend Integration

- Build subscription page (app.lifetime.fi/subscribe)
- Implement payment method selection
- Add webhook success/cancel pages
- Test end-to-end subscription flow

### Week 3: Production Launch

- Deploy to production (api.lifetime.fi)
- Configure production API keys (Secret Manager)
- Test with real €0.01 transactions
- Launch subscription page to public

---

## 📋 Environment Variables Needed

```bash
# .env.production (add to Google Cloud Secret Manager)

# Revolut Business
REVOLUT_API_KEY=sk_live_...
REVOLUT_WEBHOOK_SECRET=whsec_...

# PayPal Business
PAYPAL_CLIENT_ID=AYS...
PAYPAL_SECRET=EHT...
PAYPAL_WEBHOOK_ID=WH-...

# PayPal Subscription Plan IDs (create in PayPal dashboard)
PAYPAL_PLAN_ID_PRO=P-...
PAYPAL_PLAN_ID_ENTERPRISE=P-...
```

---

## 🎯 Success Metrics

### Monthly Recurring Revenue (MRR) Targets

| Month | Target Customers | Avg Plan | MRR | Payment Mix |
|-------|------------------|----------|-----|-------------|
| **M3** | 1 (Turner) | Enterprise | €2,499 | Revolut invoice |
| **M6** | 5 | Mixed | €7,495 | 80% Revolut, 20% PayPal |
| **M12** | 20 | Mixed | €29,980 | 70% Revolut, 30% PayPal |

### Payment Processing Costs

| Month | Revenue | Revolut Fees (1.5%) | PayPal Fees (3.2%) | Total Fees | Net Revenue |
|-------|---------|---------------------|-------------------|-----------|-------------|
| M3 | €2,499 | €37 | €0 | €37 | €2,462 |
| M6 | €7,495 | €90 | €48 | €138 | €7,357 |
| M12 | €29,980 | €315 | €288 | €603 | €29,377 |

**Annual Payment Processing Cost:** ~2% (€603 on €29,980 revenue)

---

## 🔒 Security & Compliance

### PCI DSS Compliance

**Good news:** You don't need PCI DSS compliance because:
- ✅ Revolut handles all card data (you never touch it)
- ✅ PayPal handles all card data (you never touch it)
- ✅ You only receive webhook notifications (no sensitive data)

**Your responsibility:**
- Secure webhook endpoints (HTTPS only)
- Verify webhook signatures (prevent spoofing)
- Store subscription IDs securely (Supabase RLS)

### GDPR Compliance

- ✅ Store minimal payment data (subscription ID, status, expires_at)
- ✅ Don't store card numbers or CVVs (handled by providers)
- ✅ Allow users to export payment history
- ✅ Allow users to cancel subscriptions (self-service)

---

## 📝 Next Steps

1. **Confirm Payment Providers**
   - ✅ You have Revolut Business (ready)
   - ✅ You have PayPal Business (ready)
   - Action: Get API credentials for both

2. **Define Subscription Plans**
   - Finalize pricing (€499 Pro, €2,499 Enterprise)
   - Create PayPal subscription plans in dashboard
   - Configure Revolut recurring payments

3. **Build Payment Infrastructure**
   - Week 1: Backend webhook handlers
   - Week 2: Frontend subscription page
   - Week 3: Production testing

**Estimated Time:** 3 weeks to full payment integration

---

**Ready to proceed?**

I can create:
1. **Complete payment integration code** (FastAPI + Next.js)
2. **Webhook handler boilerplate** (Revolut + PayPal)
3. **Subscription page UI** (ready to deploy)
4. **Testing scripts** (sandbox testing)

Let me know if you want me to build this out! 💳

---

**Document Version:** 1.0
**License:** Proprietary - Lifetime Oy
