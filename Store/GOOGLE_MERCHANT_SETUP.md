# Google Merchant Center Next Setup Guide

## 1. Requirement Overview
To list Lifetime products on Google Shopping (and free listings), our product data must meet the **Google Merchant Center Next** specifications.

**Key Requirements for Software/Services:**
*   **Fixed Price:** Must have a clear price (no "contact us" for Shopping ads, though free listings are more flexible).
*   **Landing Page:** Must match the feed data exactly.
*   **Image:** High-quality image required.
*   **GTIN/MPN:** We will use `identifier_exists: no` for custom services, or assign our own MPNs.

## 2. Product Data Structure (YAML Frontmatter)
We have standardized all `Store/*.md` files to include the following metadata for the feed generator:

```yaml
---
title: "Product Title"
price: "1999.00"
currency: "EUR"
sku: "FH-001"
availability: "in_stock"
condition: "new"
google_product_category: "Software > Business & Productivity Software"
image_link: "https://dws10.com/static/images/product.jpg"
brand: "Firehorse"
---
```

## 3. Setup Checklist for Merchant Center Next

### A. Account Setup
1.  Go to [Google Merchant Center Next](https://merchants.google.com/).
2.  **Business Info:** Ensure "Lifetime Oy" address and phone are verified.
3.  **Website Claim:** Verify `dws10.com` (or `lifetime.fi`) via HTML tag or Google Analytics.

### B. Feed Configuration
We will use the **Scheduled Fetch** or **Content API** method.

**Option 1: Scheduled Fetch (Recommended for now)**
1.  We need to generate a `products.xml` (RSS 2.0) feed from our `Store/` markdown files.
2.  **Action:** Create a Python script `scripts/generate_google_feed.py` to convert `Store/*.md` -> `public/products.xml`.
3.  **Host:** The build process puts `products.xml` at `https://dws10.com/products.xml`.
4.  **Schedule:** Set Merchant Center to fetch this URL daily.

### C. Policy Compliance
*   **Checkout:** The landing page must have a way to "Buy" or "Contact to Buy".
*   **Refund Policy:** Link to Refund Policy must be visible.
*   **Payment Methods:** Logos (PayPal, Visa, etc.) must be visible if online checkout is enabled.

## 4. Next Steps
1.  **Approve:** Review the metadata updates in `Store/` files.
2.  **Build:** Run the feed generator script (Task for Developer).
3.  **Connect:** Enter the Feed URL into Google Merchant Center.

