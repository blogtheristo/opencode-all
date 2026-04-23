# Product Catalog - DWS IQ Platform

***

# VERSION AND AGENT HISTORY

Version: 3.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: r6bU3 | Date: 23.01.2026 | Changes: Initial product catalog structure, Google Merchant schema, file naming conventions
- Version: 2.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/document-layering-strategy-ddhtQ | Date: 02.03.2026 | Changes: Added VERSION AND AGENT HISTORY block; added full 30-product catalog table from products.json; added product lifecycle stages; added Store Product Format section
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/add-define-application-guide-gS1du | Date: 25.03.2026 | Changes: Added DWS IQ Climate Intelligence (DWS-CLIMATE-001) and DWS IQ Aegis (DWS-AEGIS-001) platform products; 30→32 products
- Version: 3.0 | Tool: Claude Code (Opus 4.7) | Session: claude/centralized-price-list-rl82P | Date: 23.04.2026 | Changes: Removed all hardcoded price tables (stale across 4 sections); prices are now maintained in a single place — `dws10.com/config/products.json` — and rendered on `https://dws10.com/price-list/`. Quarterly review cadence established (priceList metadata block in products.json).

Session Links & References:

- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/product-catalog/README.md

Document Status:

- Created: 23.01.2026
- Last Modified: 23.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

***

**Structured Product Information Repository**

Last Updated: 2026-04-23
Managed By: Product Management & Marketing

---

## 💶 Prices — Single Source of Truth

> **Do not hardcode prices in this file.** Previous versions of this README duplicated
> prices inline and went stale (Firehorse Omnichannel, hourly consulting, bundle pricing
> all drifted from the real figures). As of v3.0 of this catalog, this README no longer
> contains price tables.

**Canonical price list:**

| Channel                         | Location                                    | Format                                                        |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| **Authoritative data**          | `dws10.com/config/products.json`            | JSON — one record per product, `price` + `priceNote` + `type` |
| **Client-ready published list** | https://dws10.com/price-list/               | HTML, printable, B2B VAT 0%, EUR                              |
| **Live store**                  | https://dws10.com/buy/                      | Pagination 1/3, Revolut checkout                              |
| **Google Merchant feed**        | https://dws10.com/feeds/google-products.xml | XML, derived from products.json                               |

**Governance** (mirrored in `products.json` → `priceList` block):

- **Currency:** EUR (list prices)
- **VAT treatment:** B2B · VAT 0% (reverse charge for EU intra-community; FI 25.5% added at FI checkout)
- **Review cadence:** Quarterly — current version `2026.Q2`, next review `2026-07-01`
- **Payment terms:** Net 14
- **Quote validity:** 30 days
- **Owner:** Risto Anton Päärni (Lifetime Oy, BUID 0772407-9, VAT FI07724079)

**Workflow to change a price:**

1. Edit `dws10.com/config/products.json` (canonical).
2. Sync to `landing-pages/dws10-com/config/products.json` in the same commit (dual-folder rule).
3. Bump `priceList.version` if the change is material; append a `changeLog` entry.
4. No other file — store, price-list page, and Merchant feed all consume products.json at runtime. Do **not** add price tables to marketing docs.

---

## 🔄 Product Lifecycle Stages

Every product MUST have one of these lifecycle states set in `products.json` under `availability` and tracked here:

| Stage          | `availability` value          | Meaning                                       | Action Required                                   |
| -------------- | ----------------------------- | --------------------------------------------- | ------------------------------------------------- |
| **draft**      | `preorder`                    | Under development, not yet for sale           | Set `availability: preorder` in products.json     |
| **active**     | `in_stock`                    | Live, purchasable, fully supported            | Default state                                     |
| **limited**    | `in_stock`                    | Active but being phased out — no new features | Add `limited: true` to product metadata           |
| **deprecated** | `out_of_stock`                | No longer sold; existing customers supported  | Set `availability: out_of_stock`, add sunset date |
| **sunset**     | _(remove from products.json)_ | Removed from catalog entirely                 | Move to `product-catalog/archive/`                |

**Lifecycle transition rules:**

- `draft → active`: Product Manager + Engineering sign-off required
- `active → limited`: Product Manager decision, communicate to sales team
- `limited → deprecated`: 90-day notice to existing customers required
- `deprecated → sunset`: After all customer contracts expire; archive catalog entry

---

## 📁 Directory Structure

```
product-catalog/
├── README.md (this file)
├── LWM/                           # Lifetime World Model
│   ├── V0/                        # Original web content (baseline)
│   │   └── original-webpage.html
│   └── V1/                        # NVIDIA Inception submission
│       ├── product-specification.md
│       └── google-merchant-product.json
│
├── Firehorse/                     # Firehorse Product Family
│   ├── V1/                        # Firehorse Report V1 (legacy)
│   │   └── (future: migration from existing content)
│   ├── V2/                        # Firehorse V2 (enterprise - NVIDIA submission)
│   │   ├── product-specification.md
│   │   └── google-merchant-product.json
│   └── V3/                        # Firehorse V3 (SME - Jitsi + Email, €9.99/mo)
│       ├── product-specification.md
│       └── google-merchant-product.json
│
└── [Future Products]/
    └── (Additional products follow same structure)
```

---

## 🎯 Purpose

This product catalog serves as the **single source of truth** for all DWS IQ platform product information:

1. **Google Merchant Center Feed** - Structured JSON for e-commerce integration
2. **NVIDIA Inception Applications** - Technical specifications for partnership submissions
3. **Marketing Content** - Product descriptions for website, sales materials, presentations
4. **Version Control** - Track product evolution from V0 (original) → V1 (NVIDIA) → V2+ (future)

---

## 📋 File Naming Conventions

### Standard Files in Each Version Folder:

| File Name                      | Purpose                         | Format   |
| ------------------------------ | ------------------------------- | -------- |
| `google-merchant-product.json` | Google Merchant Center feed     | JSON     |
| `product-specification.md`     | Technical specs (NVIDIA, sales) | Markdown |
| `pricing-model.json`           | Pricing tiers & revenue model   | JSON     |
| `marketing-assets.md`          | Copy, taglines, positioning     | Markdown |
| `competitive-analysis.md`      | vs. competitors comparison      | Markdown |
| `customer-testimonials.md`     | Case studies, quotes            | Markdown |
| `technical-benchmarks.md`      | Performance data, benchmarks    | Markdown |

---

## 🔄 Version Naming Scheme

**Format:** `V{number}` where:

- **V0** = Original/baseline content (pre-NVIDIA)
- **V1** = First major revision (NVIDIA Inception submission)
- **V2** = Second major revision (market-ready, post-Inception)
- **V3+** = Future iterations

**When to Create New Version:**

- Major feature additions (e.g., new NVIDIA tech integration)
- Significant pricing model changes
- Rebranding or repositioning
- Regulatory compliance updates (e.g., Fit for 55 certification)

---

## 📊 Google Merchant Center Field Mapping

All `google-merchant-product.json` files follow Google Merchant Next schema:

### Core Required Fields:

- `id` - Unique product identifier (e.g., "LWM-V1-2026")
- `title` - Product name (150 chars max)
- `description` - Full description (5000 chars max)
- `link` - Product page URL
- `imageLink` - Main product image (800x800+ px)
- `price` - Price with currency
- `availability` - Stock status (in_stock / out_of_stock / preorder)
- `condition` - Product condition (new / refurbished / used)
- `brand` - Brand name (Lifetime Oy)

### DWS-Specific Custom Fields:

- `customLabel0` - Primary category (e.g., "Physical AI")
- `customLabel1` - Industry vertical (e.g., "Construction Tech")
- `customLabel2` - Regulatory focus (e.g., "Fit for 55")
- `customLabel3` - Technology type (e.g., "Sovereign AI")
- `customLabel4` - Partnership status (e.g., "NVIDIA Inception")

### Product Details Array:

Used for technical specifications:

```json
"productDetail": [
  {
    "sectionName": "Model Architecture",
    "attributeName": "Parameter Count",
    "attributeValue": "55 billion parameters"
  }
]
```

### Product Highlights Array:

Bullet points for key selling points (max 10):

```json
"productHighlights": [
  "55B parameter construction-specific Physical AI model",
  "Persistent 'Lifetime' memory of site evolution"
]
```

---

## 🔗 Integration Points

### Where This Catalog Feeds:

1. **Website Product Pages** (`/dws10.com/products/`, `/dws10.com/world-model/`)
   - Source: `google-merchant-product.json` → `description`, `productHighlights`
   - Template: Inject JSON-LD structured data into `<head>`

2. **Google Merchant Center Feed**
   - Source: `google-merchant-product.json` (direct upload)
   - Frequency: Weekly automated sync

3. **NVIDIA Inception Applications**
   - Source: `product-specification.md`
   - Format: Copy-paste into NVIDIA submission forms

4. **Sales Presentations & Decks**
   - Source: `marketing-assets.md`, `competitive-analysis.md`
   - Format: PowerPoint, PDF, sales enablement

5. **Documentation (`/docs/product-catalog.md`)**
   - Source: Aggregate all products from this catalog
   - Format: Markdown table with all 9 products

---

## 🛠️ Maintenance Workflow

### Weekly Tasks:

- [ ] Validate `availability` status (in_stock vs. out_of_stock)
- [ ] Check `price` accuracy against sales team updates
- [ ] Update `expirationDate` if products extended

### Monthly Tasks:

- [ ] Refresh `description` for SEO optimization
- [ ] Update `productHighlights` based on customer feedback
- [ ] Review `productDetail` for technical accuracy

### Quarterly Tasks:

- [ ] Audit competitive positioning (`competitive-analysis.md`)
- [ ] Update customer testimonials (`customer-testimonials.md`)
- [ ] Refresh technical benchmarks (`technical-benchmarks.md`)

### Version Release Checklist:

When creating new version (e.g., V1 → V2):

1. ✅ Create new version folder (`mkdir product-catalog/LWM/V2`)
2. ✅ Copy previous version files as baseline
3. ✅ Update `product_data_version` in JSON
4. ✅ Update `metadata.version` and `metadata.replaces_version`
5. ✅ Document changes in version's `CHANGELOG.md`
6. ✅ Update website to reference new version
7. ✅ Git commit with tag: `git tag product-lwm-v2.0`

---

## Store Product Format (CRITICAL RULE)

**Files in `Store/` use Store Product Format — NOT DWS Document Standard.**

The `Store/` directory contains product markdown files consumed by `scripts/build_store.py` to generate Google Merchant XML feeds, product HTML pages, and the store page. These files use YAML frontmatter with a fixed schema. The DWS Document Standard header (VERSION AND AGENT HISTORY) is **not compatible** with the store build pipeline and **must not be used** for store product files.

### Rule

| Location           | Format                                      | Header                               |
| ------------------ | ------------------------------------------- | ------------------------------------ |
| `Store/*.md`       | **Store Product Format** (YAML frontmatter) | `title`, `price`, `sku`, etc.        |
| `product-catalog/` | Product Catalog Standard                    | Google Merchant JSON + spec markdown |
| Everything else    | DWS Document Standard                       | VERSION AND AGENT HISTORY block      |

### Required YAML Frontmatter Fields

Every `Store/*.md` file **must** have this exact frontmatter structure:

```yaml
---
title: "Product Name"
price: "499.00"
currency: "EUR"
sku: "PRODUCT-SKU-001"
availability: "in_stock"
condition: "new"
google_product_category: "Software > Business & Productivity Software"
image_link: "https://dws10.com/static/images/product.jpg"
brand: "Lifetime"
storeCategory: "platform"
---
```

| Field                     | Required | Type   | Notes                                         |
| ------------------------- | -------- | ------ | --------------------------------------------- |
| `title`                   | Yes      | string | Product display name                          |
| `price`                   | Yes      | string | Decimal format, e.g. `"499.00"`               |
| `currency`                | Yes      | string | ISO 4217, always `"EUR"`                      |
| `sku`                     | Yes      | string | Unique product ID, matches `products.json`    |
| `availability`            | Yes      | string | `in_stock`, `out_of_stock`, or `preorder`     |
| `condition`               | Yes      | string | `new`, `refurbished`, or `used`               |
| `google_product_category` | Yes      | string | Google taxonomy string                        |
| `image_link`              | Yes      | string | Full URL to product image                     |
| `brand`                   | Yes      | string | `Lifetime` or `Firehorse`                     |
| `storeCategory`           | No       | string | `platform`, `advisory`, `ai-cloud`, `digital` |

### Markdown Body

After the `---` closing delimiter, write standard markdown:

```markdown
# Product Name

**Price:** €499 (pricing note)

## Description

Product description text.

## Key Features

- Feature 1
- Feature 2

## Ideal For

- Target audience 1
- Target audience 2
```

### Data Source Priority

The build pipeline reads from two sources. **`products.json` is the primary source** for all store products. `Store/*.md` files provide extended descriptions for products that need detailed pages.

| Source                           | Purpose                          | Products                      |
| -------------------------------- | -------------------------------- | ----------------------------- |
| `dws10.com/config/products.json` | Primary: all ~30 store products  | Full catalog                  |
| `Store/*.md`                     | Extended: detailed product pages | Subset with long descriptions |

### What NOT to Do

- Do NOT use `# VERSION AND AGENT HISTORY` in `Store/*.md` files
- Do NOT use DWS Document Standard `***` delimiters in store files
- Do NOT put product files in `Store/` without valid YAML frontmatter
- Do NOT duplicate `products.json` data in `Store/*.md` — use `sku` to link them

---

## 📝 Example: Adding New Product

To add a new product (e.g., "DWS Carbon Calculator"):

```bash
# 1. Create folder structure
mkdir -p product-catalog/CarbonCalculator/V1

# 2. Create Google Merchant JSON
cat > product-catalog/CarbonCalculator/V1/google-merchant-product.json <<EOF
{
  "product_data_version": "1.0",
  "product": {
    "id": "CARBON-CALC-V1-2026",
    "title": "DWS Carbon Calculator - Automated EN 15978 Compliance",
    ...
  }
}
EOF

# 3. Create product specification
cat > product-catalog/CarbonCalculator/V1/product-specification.md <<EOF
# DWS Carbon Calculator V1
## Product Overview
...
EOF

# 4. Update main product catalog documentation
# Edit: /docs/product-catalog.md (add row to product table)

# 5. Commit to repository
git add product-catalog/CarbonCalculator/
git commit -m "Add Carbon Calculator V1 product catalog"
```

---

## 🎨 Brand Assets

**Product Logos:**

- LWM: `/dws10.com/DWS_IQ2026.png`
- Firehorse: `/dws10.com/Firehorse2026.png`
- DWS IQ Platform: `/dws10.com/DWS_IQ2026.png`

**Trust Badges:**

- EU-Sovereign: `/product-catalog/assets/badges/EU_Sovereign.png`
- See [Badge README](./assets/badges/README.md) for usage guidelines

**Brand Colors:**

- NVIDIA Green: `#76B900` (Firehorse V2)
- DWS Blue: `#0066cc` (Platform primary)
- Dark Background: `#0a1628` (Enterprise theme)
- EU Blue: `#003399` (Sovereignty theme)
- EU Gold: `#FFCC00` (Sovereignty accent)

---

## 🇪🇺 EU-Sovereign by Design

For EU-sovereign deployment options and regulated workloads, the DWS IQ Platform provides **EU-Sovereign by Design** configurations:

1. **EU Data Residency** - For EU-sovereign configurations, data is stored in Finland/Germany
2. **No CLOUD Act Exposure (EU-sovereign options)** - No US parent company jurisdiction over EU-sovereign clusters; for Global Cloud options, CLOUD Act exposure may apply as documented in the deployment matrices
3. **GDPR Native** - Built-in compliance, not bolted on
4. **GAIA-X Aligned** - Following Level 3 sovereignty standards
5. **EU AI Act Ready** - Article 12 reasoning lineage for August 2026

These guarantees apply to explicitly designated EU-sovereign deployment options within the platform's hybrid sovereignty model (European Cloud and Sovereign Private Cloud tiers) and do not automatically extend to all Global Cloud deployment configurations.

**Sovereignty Landing Page:** [/sovereignty/sovereignty.html](/sovereignty/sovereignty.html)

**Badge Placement Required On:**

- All product specification headers (with deployment tier clarity)
- Product pages on dws10.com
- Marketing materials and sales decks
- API documentation

---

## 📞 Contact & Ownership

**Product Catalog Maintainers:**

- **Product Management:** Define features, pricing, positioning
- **Marketing:** Write copy, competitive analysis, testimonials
- **Engineering:** Validate technical specs, benchmarks
- **Sales:** Confirm pricing, customer feedback

**Review Cadence:**

- **Weekly:** Product Ops (availability, pricing sync)
- **Monthly:** Product Manager (strategy alignment)
- **Quarterly:** Cross-functional (roadmap, positioning)

**Questions or Updates:**

- Slack: `#product-catalog`
- Email: `product@lifetime.fi`

---

## 🔮 Future Enhancements

**Planned Improvements:**

1. **Automated JSON → Website Sync:** GitHub Actions to auto-update product pages
2. **Multi-language Support:** EN, FI, SV versions of all content
3. **A/B Testing Metadata:** Track which `productHighlights` convert best
4. **Customer Feedback Integration:** Link testimonials to specific product versions
5. **Competitive Intelligence API:** Auto-fetch competitor pricing for comparison

---

**Document Version:** 2.0
**Last Updated:** 2026-03-02

© 2026 Lifetime Oy · Product Catalog Management System
