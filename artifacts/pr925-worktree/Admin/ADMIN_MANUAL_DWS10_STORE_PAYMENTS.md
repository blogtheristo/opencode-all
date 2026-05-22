# ADMIN MANUAL: DWS10.com Store Payments (Revolut, Stripe, Google Merchant)

---
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: Rm8Jw | Date: 06.02.2026 | Changes: Initial creation - Revolut Merchant API integration, Cloudflare Worker deployment, store payment flow documentation
  - Version: 1.1 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: current | Date: 24.04.2026 | Changes: Added latest payment updates: Revolut + Stripe hybrid process, Google Merchant feed status, and refreshed product/payment process notes

Session Links & References:
  - Claude Code (Rm8Jw): https://github.com/blogtheristo/dws6/commits/claude/research-dws-brand-standard-Rm8Jw
  - View on GitHub: N/A (Admin/ folder is gitignored - local/ProtonDrive only)

Document Status:
  - Created: 06.02.2026
  - Last Modified: 24.04.2026
  - Language: English
  - Publication Status: ACTIVE

---

**Version:** 1.1
**Purpose:** Admin, maintenance & deployment guide for DWS10.com store payments (Revolut, Stripe, Google Merchant)
**Audience:** DevOps, System Administrators, Web Developers, IT Operations
**Updated:** 24.04.2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Revolut Merchant API Integration](#3-revolut-merchant-api-integration)
4. [Cloudflare Worker: dws-revolut-checkout](#4-cloudflare-worker-dws-revolut-checkout)
5. [Store Page (buy/index.html)](#5-store-page)
6. [Products Configuration](#6-products-configuration)
7. [Deployment Guide](#7-deployment-guide)
8. [Secret Management](#8-secret-management)
9. [Payment Flow](#9-payment-flow)
10. [Troubleshooting](#10-troubleshooting)
11. [Monitoring & Logs](#11-monitoring--logs)
12. [Revolut Dashboard Operations](#12-revolut-dashboard-operations)
13. [Latest Updates (April 2026)](#13-latest-updates-april-2026)

---

## 1. System Overview

### What This Covers

The DWS10.com store sells 38 digital products (software, consulting, training) via:
- **Revolut Pay** (primary) - Web SDK popup + hosted checkout fallback
- **Stripe Invoice** (B2B remainder billing after Revolut deposit)
- **PayPal** (secondary) - Standard `_xclick` checkout

All Revolut payments flow through a **Cloudflare Worker** (`dws-revolut-checkout`) that creates orders server-side via the Revolut Merchant API. The secret key never touches the frontend.

### Key Decision: Merchant API Only

- **Merchant API** (free): Accept payments - create orders, hosted checkout, widgets
- **Business API** (NOT in use): Costs 30 EUR/month - account management, transfers, counterparties
- **Decision date:** February 2026 - Business API not worth the cost for current needs

---

## 2. Architecture

```
Customer Browser                    Cloudflare Edge                  Revolut
     |                                    |                            |
     |  1. Click "Pay with Revolut"       |                            |
     |  2. POST /checkout/create-order    |                            |
     |----------------------------------->|                            |
     |                                    |  3. POST /api/orders       |
     |                                    |     (Bearer SECRET_KEY)    |
     |                                    |--------------------------->|
     |                                    |                            |
     |                                    |  4. { token, checkout_url }|
     |                                    |<---------------------------|
     |  5. { token, checkout_url }        |                            |
     |<-----------------------------------|                            |
     |                                                                 |
     |  6. RevolutCheckout(token, 'prod')                              |
     |     .payWithPopup()                                             |
     |-------------------------------------------------------------->  |
     |                                                                 |
     |  7. Payment completed                                           |
     |<--------------------------------------------------------------- |
     |                                                                 |
     |  8. Redirect to /checkout/success/                              |
```

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Store page | `dws10.com/buy/index.html` | Product catalog + payment buttons |
| Products config | `dws10.com/config/products.json` | 30 products + Revolut settings |
| Checkout Worker | `src/cloudflare/revolut-checkout-worker.ts` | Creates orders server-side |
| Worker config | `src/cloudflare/wrangler.revolut.toml` | Cloudflare Worker deployment |
| SDK | `https://merchant.revolut.com/embed.js` | Revolut Web SDK (CDN) |

### Dual Folder Sync (CRITICAL)

Changes must exist in BOTH locations:

| File | Root (Workers/testing) | Landing-pages (Pages/production) |
|------|----------------------|----------------------------------|
| Store page | `dws10.com/buy/index.html` | `landing-pages/dws10-com/buy/index.html` |
| Products | `dws10.com/config/products.json` | `landing-pages/dws10-com/config/products.json` |

---

## 3. Revolut Merchant API Integration

### API Details

| Setting | Value |
|---------|-------|
| Base URL (Production) | `https://merchant.revolut.com/api/` |
| Base URL (Sandbox) | `https://sandbox-merchant.revolut.com/api/` |
| Auth header | `Authorization: Bearer <SECRET_KEY>` |
| API version header | `Revolut-Api-Version: 2024-09-01` |
| Public key (frontend) | `pk_4suQWIGYlrbeIBJyoQXLIL4CwjPyErCDMziP2DfPfntAYTuF` |
| Secret key (server) | Stored in Cloudflare Worker secret (never in code) |

### Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/orders` | Create an order (returns `checkout_url` + `token`) |
| `GET` | `/api/orders/{id}` | Retrieve order details |
| `GET` | `/api/orders` | List all orders |
| `PATCH` | `/api/orders/{id}` | Update an order |
| `POST` | `/api/orders/{id}/capture` | Capture authorized payment |
| `POST` | `/api/orders/{id}/cancel` | Cancel an order |
| `POST` | `/api/orders/{id}/refund` | Refund an order |

### CRITICAL: Minor Currency Units

All amounts are in **minor currency units** (cents for EUR):

| Price | Amount to send |
|-------|---------------|
| 0.99 EUR | `99` |
| 98 EUR | `9800` |
| 499 EUR | `49900` |
| 4,999 EUR | `499900` |
| 6,995 EUR | `699500` |

Formula: `amountMinor = Math.round(price * 100)`

### Create Order Request

```json
{
  "amount": 499900,
  "currency": "EUR",
  "description": "Lifetime DWS IQ Platform (Version 6)",
  "merchant_order_ext_ref": "DWS-IQ-006",
  "customer_email": "customer@example.com"
}
```

### Create Order Response

```json
{
  "id": "6516c174-b0d5-4da2-a87a-1b984b15f013",
  "token": "xxx-order-token-xxx",
  "checkout_url": "https://checkout.revolut.com/pay/xxx",
  "state": "pending",
  "created_at": "2026-02-06T12:00:00Z"
}
```

---

## 4. Cloudflare Worker: dws-revolut-checkout

### File: `src/cloudflare/revolut-checkout-worker.ts`

The Worker handles:
1. CORS preflight for allowed origins
2. POST request validation (amount, currency, description)
3. Server-side order creation via Revolut Merchant API
4. Returns only public-safe fields (token, checkout_url, order_id)

### Allowed Origins (CORS)

```typescript
const ALLOWED_ORIGINS = [
  'https://dws10.com',
  'https://www.dws10.com',
  'https://dws10-com.pages.dev',
];
```

To add a new origin, update the `ALLOWED_ORIGINS` array in the worker source and redeploy.

### Wrangler Config: `src/cloudflare/wrangler.revolut.toml`

```toml
name = "dws-revolut-checkout"
main = "revolut-checkout-worker.ts"
compatibility_date = "2024-12-01"

[vars]
REVOLUT_API_URL = "https://merchant.revolut.com/api"
ENVIRONMENT = "production"

[[routes]]
pattern = "api.dws10.com/checkout/*"
zone_name = "dws10.com"

[placement]
mode = "smart"   # EU data residency
```

### Environments

| Environment | Worker Name | API URL |
|-------------|-------------|---------|
| Production | `dws-revolut-checkout` | `https://merchant.revolut.com/api` |
| Staging | `dws-revolut-checkout-staging` | `https://sandbox-merchant.revolut.com/api` |
| Development | `dws-revolut-checkout-dev` | `https://sandbox-merchant.revolut.com/api` |

### Current Deployment

| Property | Value |
|----------|-------|
| Worker URL | `api.dws10.com/checkout/*` |
| Cloudflare Account | `124433015e7c4d4f6569ec6483734bc4` |
| Account Email | `Risto.paarni2024@lifetime.fi` |
| Version ID | `10ff918e-8d75-419d-9f17-f1d3ac2f0a30` |
| Deployed | 06.02.2026 |
| Plan | Free (no cpu_ms limits supported) |

---

## 5. Store Page

### File: `dws10.com/buy/index.html`

The store page loads products from `config/products.json` and renders:
- Product cards with name, description, price
- "Pay with Revolut" button (primary)
- "Pay with PayPal" button (secondary)
- "live-payment" badge on all products

### SDK Loading

```html
<script src="https://merchant.revolut.com/embed.js" async></script>
```

This adds `RevolutCheckout` to `window` when loaded.

### Payment Function: `payWithRevolut(productId, btn)`

1. Looks up product in `PRODUCTS` object
2. Calculates `amountMinor = Math.round(product.price * 100)`
3. POSTs to `CONFIG.revolutCheckoutApiUrl` to create order
4. If SDK loaded: `RevolutCheckout(token, 'prod').payWithPopup()`
5. On success: redirects to `/checkout/success/?product=PRODUCT_ID`
6. On error: falls back to `checkout_url` (hosted checkout)
7. On catch: falls back to static `revolutLink` or `revolut.me/lifetimeoy`

### Fallback Chain

```
SDK Popup (best UX)
  -> Hosted Checkout URL (if SDK popup fails)
    -> Static Revolut Link (if order creation fails, product has link)
      -> revolut.me/lifetimeoy (last resort)
```

---

## 6. Products Configuration

### File: `dws10.com/config/products.json`

#### Settings Section

```json
{
  "settings": {
    "defaultCurrency": "EUR",
    "revolutFallbackLink": "https://revolut.me/lifetimeoy",
    "revolutPublicKey": "pk_4suQWIGYlrbeIBJyoQXLIL4CwjPyErCDMziP2DfPfntAYTuF",
    "revolutMode": "prod",
    "revolutCheckoutApiUrl": "https://api.dws10.com/checkout/create-order",
    "paypalEmail": "risto.anton@lifetime.fi",
    "supportEmail": "support@lifetime.fi",
    "salesEmail": "sales@lifetime.fi"
  }
}
```

#### Product Count: 38

| # | Product ID | Price (EUR) | Has Static Revolut Link |
|---|-----------|-------------|------------------------|
| 1 | DWS-IQ-006 | 4,999 | Yes |
| 2 | DWS-IQ-005 | 6,995 | No |
| 3 | FH-AUTO-001 | 4,950 | Yes |
| 4 | LIFETIME-BUNDLE-2026 | 6,500 | Yes |
| 5 | FH-OMNI-001 | 499 | Yes |
| 6 | FH-RPT-001 | 1,999 | Yes |
| 7 | FH-CMS-001 | 2,999 | Yes |
| 8 | expert-services | 4,500 | Yes |
| 9 | consulting-hourly | 98 | Yes |
| 10 | LIFETIME-EXP-001 | 3,000 | Yes |
| 11 | consulting-fit55 | 3,000 | Yes |
| 12 | aws-consultancy | 4,500 | No |
| 13 | conversational-agent | 3,500 | No |
| 14 | m365-consultancy | 1,120 | No |
| 15 | powerapps-consultancy | 1,120 | No |
| 16 | ai-agent-engineering | 99 | No |
| 17 | lean-project | 4,960 | No |
| 18 | ai-consultant-day | 699 | No |
| 19 | business-mentor-30 | 4,960 | No |
| 20 | firehorse-coach | 499 | No |
| 21 | firehorse-flow | 499 | No |
| 22 | omnichannel-multimodal | 699 | No |
| 23 | professional-web-pages | 799 | No |
| 24 | secure-email-proton | 499 | No |
| 25 | firehorse-data-services | 899 | No |
| 26 | agentti-sanasto | 0.99 | No |
| 27 | devops-lead | 2,500 | No |
| 28 | digital-design-gold | 2,499 | No |
| 29 | cloud-ready-teams | 950 | No |
| 30 | ai-koulutus-3d | 6,250 | No |

- **38 products** are listed in `products.json`
- **10 products** have pre-created static Revolut checkout links (fallback)
- **28 products** rely on dynamic order creation via the Worker
- **All 38 products** can accept Revolut payments through the Worker

#### Adding a New Product

Add to the `products` object in `products.json`:

```json
"NEW-PRODUCT-ID": {
  "id": "NEW-PRODUCT-ID",
  "gtin": null,
  "mpn": "PRODUCT-MPN",
  "name": "Product Display Name",
  "price": 999,
  "currency": "EUR",
  "type": "one-time",
  "description": "Product description for the store card.",
  "priceNote": "Additional pricing info",
  "revolutLink": null,
  "paypalPlanId": null,
  "image": "/static/images/product.jpg",
  "detailsUrl": "../buy/",
  "featured": false,
  "google": {
    "productCategory": "1505",
    "condition": "new",
    "availability": "in_stock",
    "brand": "Lifetime",
    "targetCountry": "FI",
    "contentLanguage": "en"
  }
}
```

Remember to sync to `landing-pages/dws10-com/config/products.json`.

---

## 7. Deployment Guide

### Prerequisites

- Node.js 18+
- Wrangler CLI: `npm install -g wrangler` (or use `npx wrangler`)
- Cloudflare account access (Account ID: `124433015e7c4d4f6569ec6483734bc4`)

### Environment Setup (Windows PowerShell)

```powershell
# Set Cloudflare Account ID (required for wrangler)
$env:CLOUDFLARE_ACCOUNT_ID = "124433015e7c4d4f6569ec6483734bc4"

# Option A: Use API Token
$env:CLOUDFLARE_API_TOKEN = "your-api-token-here"

# Option B: Use OAuth login (opens browser)
npx wrangler login
```

### Environment Setup (Linux/macOS)

```bash
export CLOUDFLARE_ACCOUNT_ID="124433015e7c4d4f6569ec6483734bc4"

# Option A: API Token
export CLOUDFLARE_API_TOKEN="your-api-token-here"

# Option B: OAuth login
npx wrangler login
```

### Deploy the Worker

```bash
# From repository root, navigate to cloudflare source
cd src/cloudflare

# Deploy to production
npx wrangler deploy -c wrangler.revolut.toml

# Deploy to staging (uses sandbox API)
npx wrangler deploy -c wrangler.revolut.toml --env staging

# Deploy to development (uses sandbox API)
npx wrangler deploy -c wrangler.revolut.toml --env development
```

### Verify Deployment

```bash
# Check worker status
npx wrangler whoami

# Tail logs
npx wrangler tail dws-revolut-checkout
```

### Common Deployment Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `cpu_ms` error | Free plan doesn't support limits | Remove `[limits]` section from wrangler.toml |
| `placeholder account ID` | CLOUDFLARE_ACCOUNT_ID not set | Set env var before running wrangler |
| `invalid request headers` | Stale/invalid API token | Create new token from CF dashboard or use `wrangler login` |
| `ENOENT wrangler.revolut.toml` | Wrong working directory | `cd src/cloudflare` before running |

---

## 8. Secret Management

### Setting the Revolut Secret Key

The secret key (`sk_...`) is stored as a Cloudflare Worker secret, never in code or config files.

```bash
# Set for production
cd src/cloudflare
npx wrangler secret put REVOLUT_SECRET_KEY -c wrangler.revolut.toml

# Set for staging
npx wrangler secret put REVOLUT_SECRET_KEY -c wrangler.revolut.toml --env staging

# Set for development
npx wrangler secret put REVOLUT_SECRET_KEY -c wrangler.revolut.toml --env development
```

Wrangler will prompt for the secret value interactively. Paste the `sk_...` key and press Enter.

### Where Keys Live

| Key | Location | Exposed to Frontend? |
|-----|----------|---------------------|
| Public key (`pk_...`) | `dws10.com/config/products.json` settings | Yes (safe) |
| Secret key (`sk_...`) | Cloudflare Worker secret | No (server-side only) |
| PayPal email | `dws10.com/config/products.json` settings | Yes (safe) |

### Rotating the Secret Key

1. Generate new API key in Revolut Merchant dashboard
2. Run `npx wrangler secret put REVOLUT_SECRET_KEY -c wrangler.revolut.toml`
3. Paste the new key
4. The worker picks up the new key immediately (no redeploy needed)

### Rotating the Public Key

1. Update `revolutPublicKey` in `dws10.com/config/products.json`
2. Sync to `landing-pages/dws10-com/config/products.json`
3. Commit and deploy

---

## 9. Payment Flow

### Happy Path (SDK Popup)

1. Customer clicks "Pay with Revolut" on product card
2. Button shows "Processing..." and disables
3. Frontend POSTs to `https://api.dws10.com/checkout/create-order`:
   ```json
   {
     "productId": "DWS-IQ-006",
     "amount": 499900,
     "currency": "EUR",
     "description": "Lifetime DWS IQ Platform (Version 6)"
   }
   ```
4. Worker validates input, calls Revolut `POST /api/orders`
5. Worker returns `{ token, checkout_url, order_id }`
6. Frontend calls `RevolutCheckout(token, 'prod').payWithPopup()`
7. Customer completes payment in popup
8. On success: redirect to `/checkout/success/?product=DWS-IQ-006`

### Fallback: Hosted Checkout

If the SDK popup fails (e.g., popup blocked), the frontend opens `checkout_url` in a new tab. This is the Revolut-hosted checkout page.

### Fallback: Static Link

If the Worker order creation fails entirely, products with a static `revolutLink` will open that pre-created checkout URL.

### Fallback: revolut.me

If no static link exists, opens `https://revolut.me/lifetimeoy` as last resort.

### PayPal Flow

PayPal is the secondary payment method. Uses standard `_xclick` format:

```
https://www.paypal.com/cgi-bin/webscr?cmd=_xclick
  &business=risto.anton@lifetime.fi
  &item_name=PRODUCT_NAME
  &amount=PRICE
  &currency_code=EUR
```

---

## 10. Troubleshooting

### Worker Returns 502 (Payment Provider Error)

**Cause:** Revolut API rejected the request.

**Check:**
1. Secret key valid? Verify in Revolut Merchant dashboard
2. API version header correct? Should be `2024-09-01`
3. Amount is positive integer? Check minor currency conversion
4. View Worker logs: `npx wrangler tail dws-revolut-checkout`

### CORS Error in Browser Console

**Cause:** Request origin not in `ALLOWED_ORIGINS`.

**Fix:** Add the origin to the `ALLOWED_ORIGINS` array in `revolut-checkout-worker.ts` and redeploy.

### SDK Popup Not Appearing

**Cause:** `embed.js` not loaded, popup blocked, or token invalid.

**Check:**
1. Verify `<script src="https://merchant.revolut.com/embed.js" async></script>` in page
2. Check browser popup blocker
3. Verify `RevolutCheckout` is available: open browser console, type `typeof RevolutCheckout`
4. Fallback will redirect to hosted checkout URL automatically

### "Processing..." Button Stuck

**Cause:** Network error or unhandled exception.

**Fix:** The `resetButton()` function should restore the button. If it persists, check:
1. Network tab for failed requests
2. Console for JavaScript errors
3. Worker health via `npx wrangler tail`

### Order Created But No Payment

Check order status in Revolut Merchant dashboard:
- `pending` - Customer hasn't completed payment yet
- `completed` - Payment successful
- `cancelled` - Customer or merchant cancelled
- `failed` - Payment failed

### Products Not Showing in Store

1. Check `products.json` is valid JSON (use `JSON.parse()` in console)
2. Verify file is accessible: `https://dws10.com/config/products.json`
3. Check browser console for fetch errors

---

## 11. Monitoring & Logs

### Cloudflare Dashboard

- Login: `https://dash.cloudflare.com/`
- Account: `Risto.paarni2024@lifetime.fi`
- Workers & Pages > dws-revolut-checkout > Logs

### Wrangler Tail (Real-time Logs)

```bash
# Production logs
npx wrangler tail dws-revolut-checkout

# Staging logs
npx wrangler tail dws-revolut-checkout-staging
```

### Observability

The Worker has observability enabled in `wrangler.revolut.toml`:

```toml
[observability]
enabled = true

[observability.logs]
enabled = true
invocation_logs = true
```

This provides:
- Request/response logging
- Error tracking
- Invocation metrics

### Revolut Merchant Dashboard

- URL: `https://business.revolut.com/merchant`
- View all orders, their status, and payment details
- Monitor transaction volumes
- Download settlement reports

---

## 12. Revolut Dashboard Operations

### Accessing the Dashboard

1. Log in at `https://business.revolut.com/`
2. Navigate to Merchant API section

### Common Operations

| Task | Where |
|------|-------|
| View orders | Merchant > Orders |
| Refund a payment | Orders > Select order > Refund |
| View API keys | Merchant API > API Keys |
| Generate new keys | Merchant API > API Keys > Create new |
| View settlements | Merchant > Settlements |
| Set webhook | Merchant API > Webhooks |

### API Key Types

| Key Type | Prefix | Usage |
|----------|--------|-------|
| Public key | `pk_` | Frontend SDK initialization (safe to expose) |
| Secret key | `sk_` | Server-side API calls (NEVER expose) |
| Sandbox public | `pk_` | Testing with sandbox environment |
| Sandbox secret | `sk_` | Testing with sandbox environment |

---

## Appendix A: Quick Reference Commands

```bash
# Deploy worker
cd src/cloudflare && npx wrangler deploy -c wrangler.revolut.toml

# Set secret key
cd src/cloudflare && npx wrangler secret put REVOLUT_SECRET_KEY -c wrangler.revolut.toml

# View live logs
npx wrangler tail dws-revolut-checkout

# Check auth
npx wrangler whoami

# Local development (sandbox)
cd src/cloudflare && npx wrangler dev -c wrangler.revolut.toml --env development
```

## Appendix B: File Locations

```
dws6/
  src/cloudflare/
    revolut-checkout-worker.ts    # Worker source code
    wrangler.revolut.toml         # Worker deployment config
  dws10.com/
    buy/index.html                # Store page (Workers/testing)
    config/products.json          # Product catalog + Revolut settings
  landing-pages/dws10-com/
    buy/index.html                # Store page (Pages/production)
    config/products.json          # Product catalog (synced copy)
```

## Appendix C: Related Admin Manuals

- `ADMIN_MANUAL_DWS6_COM.md` - dws6.com deployment
- `ADMIN_MANUAL_AUTHENTICATION.md` - Authentication system
- `ADMIN_MANUAL_SUPABASE_EN_v1.md` - Supabase backend

---

## 13. Latest Updates (April 2026)

### 13.1 Payment Stack (Current)

1. **Revolut Merchant API** remains the primary checkout path for store cards (`/checkout/create-order`).
2. **Stripe** is active for B2B remainder invoicing after deposit confirmation (hybrid payment process).
3. **PayPal** remains secondary fallback checkout.

### 13.2 Hybrid Payment Process (Revolut -> Stripe)

1. Customer pays deposit or full amount via Revolut checkout.
2. For B2B split payments, backend confirms Revolut transaction on `/api/v1/b2b/orders/:id/confirm-deposit`.
3. Backend creates Stripe invoice for the remainder amount and stores `stripe_invoice_id`.
4. Stripe webhook updates order status to paid when invoice payment succeeds.

### 13.3 Google Merchant Feed Status

Current source of truth is `dws10.com/config/products.json`:

- Merchant feed URL: `https://dws10.com/feeds/google-products.xml`
- Content language at merchant level: `en`
- Target countries: `FI`, `SE`, `NO`, `DK`, `DE`
- Product categories use Google numeric taxonomy IDs (e.g., `1505`, `1426`, `2682`)

Latest feed remediation reference:

- `docs/GOOGLE_MERCHANT_FIX_2026_04_24.md`

### 13.4 Admin Ops Checklist (Payments + Merchant)

1. Keep `dws10.com/config/products.json` and `landing-pages/dws10-com/config/products.json` in sync.
2. After product/category edits, regenerate feed with `node dws10.com/feeds/generate-feed.cjs`.
3. Sync `dws10.com/feeds/google-products.xml` to `landing-pages/dws10-com/feeds/google-products.xml`.
4. Verify payment process in order: Revolut checkout -> (optional) Stripe invoice -> webhook status update.
