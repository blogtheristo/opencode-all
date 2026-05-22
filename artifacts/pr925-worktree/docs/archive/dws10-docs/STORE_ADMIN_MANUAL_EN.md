# DWS10.com Store Administration Manual

**Version:** 1.0
**Date:** January 2026
**Author:** Lifetime Oy
**Platform:** DWS10.com E-Commerce Store

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Product Management](#product-management)
4. [Google Merchant Center Integration](#google-merchant-center-integration)
5. [Payment Processing (Revolut Business)](#payment-processing-revolut-business)
6. [Weekly Maintenance Workflow](#weekly-maintenance-workflow)
7. [Firehorse Operations Model](#firehorse-operations-model)
8. [Troubleshooting](#troubleshooting)

---

## Overview

DWS10.com is Lifetime Oy's enterprise e-commerce platform for climate intelligence solutions, compliance software, and professional consulting services. The store operates on Cloudflare Pages with static HTML generation and integrates with:

- **Google Merchant Center** (Account ID: 8496329) for product visibility
- **Revolut Business** for checkout and payments
- **Claude Code** for automated store maintenance via Firehorse operations model

### Product Categories

| Category | Products | Price Range |
|----------|----------|-------------|
| Platform Software | DWS IQ v5, v6 | €4,999 - €6,995 |
| Firehorse Suite | Automation, Report, CMS, Omnichannel | €499 - €4,950 |
| Consulting Services | Hourly, Monthly, Workshops | €98 - €6,250 |
| Training & Coaching | AI Koulutus, Coach, Mentor | €499 - €6,250 |
| Digital Products | Glossaries, Web Pages | €0.99 - €799 |

---

## Architecture

### File Structure

```
dws10.com/
├── buy/                    # Store pages
│   ├── index.html         # Main store (Page 1)
│   ├── page2/index.html   # Additional products (Page 2)
│   └── page3/index.html   # Consulting & Training (Page 3)
├── config/
│   └── products.json      # Central product catalog
├── feeds/
│   ├── generate-feed.cjs  # Feed generator script
│   └── google-products.xml # Google Merchant feed
├── return-policy/
│   └── index.html         # Return policy (required by Google)
└── docs/                   # Documentation
```

### Technology Stack

- **Hosting:** Cloudflare Pages (static HTML)
- **Build:** Node.js feed generator
- **Payment:** Revolut Business Checkout Links
- **Analytics:** Google Merchant Center
- **Operations:** Claude Code + Firehorse model

---

## Product Management

### Adding a New Product

1. **Edit products.json** (`dws10.com/config/products.json`)

```json
{
  "product-id": {
    "id": "product-id",
    "gtin": null,
    "mpn": "UNIQUE-MPN-2026",
    "name": "Product Name",
    "price": 999,
    "currency": "EUR",
    "type": "one-time",
    "description": "Product description for Google Merchant",
    "priceNote": "Pricing note displayed on store",
    "revolutLink": "https://checkout.revolut.com/pay/...",
    "image": "/static/images/product.jpg",
    "detailsUrl": "../buy/",
    "featured": false,
    "google": {
      "productCategory": "Software > Business & Productivity Software",
      "condition": "new",
      "availability": "in_stock",
      "brand": "Lifetime",
      "targetCountry": "FI",
      "contentLanguage": "en"
    }
  }
}
```

2. **Generate the feed**
```bash
cd dws10.com/feeds
node generate-feed.cjs
```

3. **Upload to Google Merchant**
```bash
curl -T google-products.xml \
  -u "mc-sftp-8496329:PASSWORD" \
  --insecure \
  "sftp://partnerupload.google.com:19321/google-products.xml"
```

### Product ID Guidelines

- Use descriptive IDs: `DWS-IQ-006`, `FH-AUTO-001`
- Match existing Google Merchant IDs to avoid duplicates
- MPN format: `CATEGORY-TYPE-YEAR` (e.g., `DWSIQ-V6-2026`)

### Price Types

| Type | Description | Example |
|------|-------------|---------|
| `one-time` | Single purchase | Platform licenses |
| `monthly` | Recurring subscription | Advisory services |
| `hourly` | Per-hour billing | Consulting |

---

## Google Merchant Center Integration

### Account Details

- **Merchant ID:** 8496329
- **Target Country:** Finland (FI)
- **Feed URL:** https://dws10.com/feeds/google-products.xml
- **SFTP Host:** partnerupload.google.com:19321

### Feed Requirements

The feed generator (`generate-feed.cjs`) produces compliant XML with:

- `g:id` - Unique product identifier
- `g:mpn` - Manufacturer Part Number
- `g:brand` - "Lifetime" or "Firehorse"
- `g:price` - Price in EUR with currency
- `g:checkout_link_template` - Revolut checkout URL
- `g:availability` - Stock status
- `g:condition` - Always "new"

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Domain mismatch | URLs pointing to old domain | Update `detailsUrl` to dws10.com |
| Duplicate products | ID mismatch with Merchant Center | Align IDs in products.json |
| Missing price | Field not set | Ensure `price` is numeric |
| identifier_exists error | Set false when brand+MPN exist | Remove field or set true |

### SFTP Upload

```bash
# Upload feed to Google Merchant Center
curl -T google-products.xml \
  -u "mc-sftp-8496329:YOUR_PASSWORD" \
  --insecure \
  "sftp://partnerupload.google.com:19321/google-products.xml"
```

Note: URL-encode special characters in password (e.g., `$` becomes `%24`)

---

## Payment Processing (Revolut Business)

### Checkout Links

Each product can have a dedicated Revolut checkout link:

```json
"revolutLink": "https://checkout.revolut.com/pay/f023d433-0bf4-48fa-98cd-494de448df39"
```

If no specific link is set, the fallback link is used:
- **Fallback:** `https://revolut.me/lifetimeoy`

### Creating Checkout Links

1. Log in to Revolut Business
2. Navigate to **Accept Payments** > **Payment Links**
3. Create new payment link with:
   - Product name
   - Fixed price
   - Description
4. Copy the checkout URL to products.json

### Benefits of Revolut Integration

- **Instant settlements** to business account
- **Multi-currency support** (EUR primary)
- **Low fees** compared to traditional processors
- **Direct Google Merchant integration** via `checkout_link_template`

---

## Weekly Maintenance Workflow

### Monday: Feed Health Check

1. **Check Google Merchant Center status**
   - Log in to Merchant Center
   - Review product diagnostics
   - Note any disapproved items

2. **Verify feed freshness**
   - Check `lastUpdated` timestamp in products.json
   - Regenerate feed if older than 7 days

### Wednesday: Performance Review

1. **Review Google Merchant metrics**
   - Impressions
   - Clicks
   - Click-through rate (CTR)

2. **Identify underperforming products**
   - Low impressions: Improve titles/descriptions
   - Low CTR: Update images or pricing

### Friday: Optimization

1. **Implement improvements**
   - Update product descriptions
   - Add new Revolut links
   - Refresh product images

2. **Upload updated feed**
   - Run feed generator
   - SFTP upload to Google

### Monthly: Catalog Review

1. **Product audit**
   - Remove discontinued products
   - Add new offerings
   - Update pricing

2. **Competitive analysis**
   - Review market pricing
   - Adjust positioning

---

## Firehorse Operations Model

### Overview

Firehorse is Lifetime's AI-assisted operations model using Claude Code for automated store maintenance. This enables:

- **Rapid product updates** via natural language
- **Automated feed generation** and upload
- **Documentation generation** (this manual)
- **Code-assisted troubleshooting**

### Workflow with Claude Code

1. **Product Changes**
   ```
   User: "Add new product X at €999"
   Claude: Updates products.json, regenerates feed, uploads to Google
   ```

2. **Store Maintenance**
   ```
   User: "Check Google Merchant status"
   Claude: Analyzes feed, identifies issues, proposes fixes
   ```

3. **Documentation**
   ```
   User: "Create admin manual"
   Claude: Generates comprehensive documentation
   ```

### Benefits

- **Speed:** Product updates in minutes, not hours
- **Accuracy:** Automated validation prevents errors
- **Consistency:** Standardized processes
- **Traceability:** Git history for all changes

### Git Workflow

All changes are tracked in git branches:
- Feature branches: `claude/<feature>-<id>`
- Pull requests for review
- Main branch for production

---

## Troubleshooting

### Feed Generation Fails

```bash
# Check Node.js is installed
node --version

# Run with verbose output
cd dws10.com/feeds
node generate-feed.cjs
```

### SFTP Upload Fails

1. **Check credentials**
   - Username: `mc-sftp-8496329`
   - Password: URL-encode special characters

2. **Test connection**
   ```bash
   curl -v --insecure "sftp://partnerupload.google.com:19321/"
   ```

### Product Not Appearing

1. Check Google Merchant Center diagnostics
2. Verify product ID matches feed
3. Ensure all required fields are present
4. Wait 24-48 hours for processing

### Payment Link Not Working

1. Verify Revolut link is active
2. Check link format in products.json
3. Test checkout flow manually

---

## Contact & Support

- **Technical Support:** support@lifetime.fi
- **Sales Inquiries:** sales@lifetime.fi
- **Revolut Business:** Lifetime Oy account
- **Google Merchant:** Account 8496329

---

*Document generated using Firehorse Operations Model with Claude Code*
*Last updated: January 2026*
