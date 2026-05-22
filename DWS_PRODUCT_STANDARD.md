# DWS Product Standard

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Added Section 11 (Usage Metering & Billing Rules) — tier definitions (Free/Pro/Enterprise), metering categories, billing event triggers, customer-facing usage dashboard
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/nordic-sales-strategy-1p5VB | Date: 13.02.2026 | Changes: Initial creation - DWS Product Standard establishing authoritative pricing, product taxonomy, two-channel model, and quality rules for all DWS IQ 6, Firehorse, and Lifetime products

Session Links & References:
  - Claude Code (claude/nordic-sales-strategy-1p5VB): https://github.com/blogtheristo/dws6/commits/claude/nordic-sales-strategy-1p5VB
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_PRODUCT_STANDARD.md

Document Status:
  - Created: 13.02.2026
  - Last Modified: 13.02.2026
  - Language: English & Finnish (bilingual)
  - Languages Available: English, Suomi
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-02-13
**Last Updated:** 2026-02-13
**Status:** Active

***

## Table of Contents

1. [Purpose](#1-purpose)
2. [Product Taxonomy](#2-product-taxonomy)
3. [Two-Channel Pricing Model](#3-two-channel-pricing-model)
4. [Authoritative Product Catalog](#4-authoritative-product-catalog)
5. [Product Card Rules](#5-product-card-rules)
6. [Pricing Principles](#6-pricing-principles)
7. [Price Conflict Resolution](#7-price-conflict-resolution)
8. [One-Click Buy Requirements](#8-one-click-buy-requirements)
9. [Google Merchant Center Compliance](#9-google-merchant-center-compliance)
10. [Product Lifecycle](#10-product-lifecycle)
11. [Product Versioning](#11-product-versioning)
12. [Impact Toward DWS 7](#12-impact-toward-dws-7)

***

## 1. Purpose

### Tarkoitus

This standard is the **single source of truth** for all DWS product definitions, pricing, and presentation rules.

**Total unique products:** 30 (as defined in `dws10.com/config/products.json`)

Before this standard, the same 30 products appeared in 5 separate catalog files with conflicting prices. This document resolves all conflicts and establishes the authoritative reference.

### Scope / Soveltamisala

Applies to:
- All products on `dws10.com/buy/` store pages
- `dws10.com/config/products.json` (store database)
- `docs/product-catalog.md` (Google Merchant catalog)
- `Firehorse/PRODUCT_CATALOG.md` (Firehorse product line)
- `sales-outreach/` (enterprise sales materials)
- `Store/` (individual product pages)
- All landing pages and marketing materials
- Investor documents referencing pricing
- Master thesis product appendices

**Rule:** If a price in any file conflicts with this standard, this standard wins.

### Binding For

All tools — Claude Code, Cursor, VS Code, Codex, and human developers. No exceptions.

***

## 2. Product Taxonomy

### 2.1 Product Families

| Family | Brand | Description | Price Range |
|--------|-------|-------------|-------------|
| **Platform** | DWS IQ 6 / Lifetime | Core climate intelligence platform | €4,999-€10,950/mo |
| **Firehorse Suite** | Firehorse | Automation, reporting, omnichannel, content management | €1,999-€8,000 |
| **Lifetime World Model** | Lifetime | Sovereign AI factory for construction | €25,000-€250,000 |
| **Advisory** | Lifetime / DWS | Consulting, workshops, training | €150/hr-€15,000 |
| **Digital Services** | Lifetime | Web, email, cloud, data services | €499-€6,250 |
| **Agent Products** | Firehorse | AI agent foundry, administration | €150-€2,000/mo |

### 2.2 Store Categories (4 fixed)

Must match `storeCategory` field in `products.json`:

| Category | Key | Page | Product Count |
|----------|-----|------|---------------|
| Platform & Products | `platform` | buy/ | 6 core products |
| AI & Cloud Consulting | `ai-cloud` | buy/page2/ | 9 products |
| Expert Advisory & Training | `advisory` | buy/page3/ | 10 products |
| Digital Services | `digital` | buy/page4/ | 8+ products |

### 2.3 Product ID Convention

```
[BRAND]-[TYPE]-[VERSION]
Examples:
  DWS-IQ-006         Platform product
  FH-AUTO-001         Firehorse module
  FH-RPT-001          Firehorse module
  LIFETIME-BUNDLE-2026  Bundle product
  EXP-SVC-2026        Service product
```

### 2.4 Five-Tier Labor-Anchored Model (Skilled Agents catalog)

Reference: `docs/marketing/PRODUCT-CATALOG-UPSELL-TIERS-2026.md` and
`DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md` §13.8.

The Skilled Agents catalog is structured as a five-tier upsell ladder.
Every SKU on the ladder is **anchored to the human role it replaces**,
not to a SaaS competitor.

| Tier | Name              | Monthly band (€) | Sales motion                                                       |
|-----:|-------------------|------------------|--------------------------------------------------------------------|
|  T0  | **Pilot**         | 0 – 999          | 30–90 day pilot, single agent, capped outcomes (Blue only).        |
|  T1  | **Starter**       | 999 – 1,999      | One agent, metered per-outcome, basic SLA, EU residency.           |
|  T2  | **Pro**           | 1,999 – 3,999    | One agent, unlimited outcomes, audit pack, KYA TC-2+.              |
|  T3  | **Function**      | 3,999 – 8,499    | Function-as-a-Service bundle (2–4 agents) + Themis orchestration.  |
|  T4  | **Workforce**     | 19,990           | Full Skilled Workforce — 16 agents, premium SLA, EU AI Act co-sign.|

Two cross-cutting overlays sit on top of the ladder:

- **Industry Pods** — vertical-specialisation add-ons that sit on top of
  a T3 bundle (Mars, Helios, Vulcan, Talos, Gaia, Ceres, Neptune,
  Prometheus, BESS). They never sell standalone.
- **Land overlay** — engagement-led entry bundles (sprint / accelerator /
  bootcamp / workshop / programme) attached to a 12-month agent
  subscription. Land overlays collapse the T0 → T2/T3 climb into one
  sale and are the highest-velocity entry SKUs.

#### Brand-cut T3 bundles (sit alongside the domain-cut T3 bundles)

In addition to the five domain-cut T3 bundles above (ESG, HSE, CONSTR,
Sovereignty, GTM), three brand-cut T3 bundles package the same
underlying Skilled Agents for specific channels. They do **not** replace
the domain-cut bundles — they sell alongside them.

| SKU              | Brand                    | Primary channel              | Replaces            |
|------------------|--------------------------|------------------------------|---------------------|
| `DWS365-CMP-T3`  | DWS 365                  | Microsoft Agent 365          | 1.5 compliance FTE  |
| `FH-SKILL-T3`    | Firehorse                | Salesforce Agentforce        | 1.4 marketing/CS FTE|
| `AC365-T3`       | Agentic Commerce 365     | Commerce / Microsoft channels| 1.5 commerce ops FTE|

SKU schema, required fields, and validation rules: see
`DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md` §13.8.

***

## 3. Two-Channel Pricing Model

### 3.1 The Two Channels

DWS operates two distinct sales channels. Both are valid. Neither replaces the other.

| Channel | Target | Buy Experience | Price Level | Authority File |
|---------|--------|---------------|-------------|---------------|
| **Self-Service Store** | SMEs, first-time buyers, self-serve | One-click buy on dws10.com, Revolut/Stripe payment | Standard | `dws10.com/config/products.json` |
| **Enterprise Direct** | 250+ employees, €50M+ turnover | Sales-led, pilot agreement, e-signature | Premium (subscription tiers) | `sales-outreach/NORDIC_SALES_STRATEGY.md` |

### 3.2 Why Two Channels

The **buffet principle** (Nordic Sales Strategy, Section 5):

- Self-service store = the 13.70 EUR buffet. Published prices. No gatekeeping. Anyone can walk in.
- Enterprise direct = the captain's instrument panel. Subscription tiers with full Firehorse Suite included.

Both channels serve the same product, but different buying contexts. The store sells modules. Enterprise sells the platform as a subscription.

### 3.3 Channel Rules

| Rule | Self-Service Store | Enterprise Direct |
|------|-------------------|-------------------|
| Price visibility | Published on page | Published in sales materials |
| Negotiation | Never | Never at first engagement |
| Payment | Revolut / Stripe | Invoice / e-signature |
| Minimum commitment | One-time or per-month | 5-month pilot minimum |
| Included services | Product only | Full suite + workshop + brand support |
| Target deal size | €499-€12,500 | €29,950-€131,400/year |

***

## 4. Authoritative Product Catalog

### 4.1 Platform Products (Self-Service Channel)

| ID | Product | Price | Type | Price Note |
|----|---------|-------|------|-----------|
| DWS-IQ-006 | Lifetime DWS IQ Platform v6 | **€4,999** | One-time deployment | + €499/mo subscription |
| FH-AUTO-001 | Firehorse Automation | **€4,950** | One-time per project | |
| LIFETIME-BUNDLE-2026 | Climate Reporting Starter Bundle | **€6,500** | One-time setup | + €1,999/year |
| FH-OMNI-001 | Firehorse Omnichannel Next | **€1,499** | One-time per campaign | **UPDATED from €499** |
| FH-RPT-001 | DWS IQ Report | **€1,999** | One-time per template | |
| FH-CMS-001 | Firehorse Content Management | **€2,999** | One-time setup + migration | |

### 4.2 Enterprise Subscription Tiers (Enterprise Direct Channel)

| Tier | Monthly | Duration | Total | Includes |
|------|---------|----------|-------|----------|
| **Pilot** | **€5,990/mo** | 5 months | **€29,950** | Full DWS IQ 6 + Firehorse Suite + LWM + Workshop + Brand support |
| **Alpha** | **€7,990/mo** | 7 months | **€55,930** | Everything in Pilot + multi-site + extended training |
| **Production** | **€10,950/mo** | Ongoing | — | Everything in Alpha + OWN models + security audit + updates |

### 4.3 Advisory & Consulting

| ID | Product | Price | Note |
|----|---------|-------|------|
| consulting-hourly | Consulting Hourly | **€150/hr** | **UPDATED from €98/hr** — €98 was below market for EU climate compliance expertise |
| expert-services | Workshop 3 Days | **€6,500** | **UPDATED from €4,500** — aligned with value delivered (3 days × €2,167/day) |
| LIFETIME-EXP-001 | Expert Advisory Monthly | **€3,000/mo** | Up to 30 hrs, 2 strategy sessions |
| consulting-fit55 | Fit for 55 Specialist | **€3,000/mo** | Direct access to DWS IQ 6 architect |
| ai-consultant-day | AI Consultant Day | **€699/day** | On-site or remote |

### 4.4 AI & Cloud Consulting

| ID | Product | Price | Note |
|----|---------|-------|------|
| aws-consultancy | AWS Consultancy | €4,500 | 25 hours, valid 12 months |
| conversational-agent | Conversational Agent | €3,500 | 25 hours standard implementation |
| m365-consultancy | Microsoft M365 Consultancy | €1,120 | 8 hours |
| ai-agent-engineering | AI & Agent Engineering | **€150/hr** | **UPDATED from €99/hr** — aligned with consulting-hourly |
| lean-project | AI Project Accelerator | €4,960 | Project setup |

### 4.5 Training & Coaching

| ID | Product | Price | Note |
|----|---------|-------|------|
| firehorse-coach | EU AI Act Literacy Training | €499 | Workshop + coaching |
| ai-koulutus-3d | AI Training 3 Days | €6,250 | Team programme |
| business-mentor-30 | Business Mentor 30 Hours | €4,960 | Valid 12 months |

### 4.6 Digital Services

| ID | Product | Price | Note |
|----|---------|-------|------|
| firehorse-flow | AI Customer Agent | €499 | Setup + implementation |
| omnichannel-multimodal | Omnichannel AI Assistant | €699/mo | Subscription |
| professional-web-pages | Professional Web Pages | €799 | Starting price |
| secure-email-proton | Protonmail Implementation | €499 | 8-hour implementation |
| firehorse-data-services | Data Services | €899 | Consultancy engagement |
| agentti-sanasto | English-Finnish Glossary | €0.99 | 1-year license |
| digital-design-gold | Digital Design Gold | €2,499 | Setup |
| cloud-ready-teams | Cloud Ready Teams | €950 | Team setup |

### 4.7 Enterprise Products (Custom Pricing)

| ID | Product | Starting Price | Note |
|----|---------|---------------|------|
| LWM-V1 | Sovereign AI Factory License | €250,000 | Per major construction project |
| LWM-CARBON | Carbon Optimization Service | €50,000/year | Annual subscription |
| LWM-DTAAS | Digital Twin as a Service | €25,000/year | Per active site |
| FH-ENTERPRISE | Firehorse Enterprise | €49,999+/year | Custom, unlimited reports |
| FH-V2-AUDIT | Forensic Report License | €15,000/audit | Per major audit |
| FH-V2-COMPLIANCE | Continuous Compliance Monitoring | €25,000/year | Per active site |
| EMT-STARTER | Enterprise Model Training Starter | €50,000 | Project-based |
| EMT-PRO | Enterprise Model Training Professional | €100,000 | Project-based |
| EMT-ENTERPRISE | Enterprise Model Training Enterprise | €200,000 | Project-based |

***

## 5. Product Card Rules

### 5.1 The Two-Number Rule

Every product card MUST display exactly two numbers:

> **Buy now: €XX,XXX** — total commitment
> **Monthly: €X,XXX/mo** — if applicable

If the product has no monthly component, show only the buy-now price.

### 5.2 Required Product Card Fields

```json
{
  "id": "REQUIRED - unique product ID",
  "name": "REQUIRED - product name (max 65 chars for Google)",
  "price": "REQUIRED - number in EUR",
  "currency": "REQUIRED - always EUR",
  "type": "REQUIRED - one-time | monthly | annual | per-project",
  "priceNote": "REQUIRED - clarifies pricing model",
  "description": "REQUIRED - max 160 chars for store, 5000 for Google",
  "storeCategory": "REQUIRED - platform | ai-cloud | advisory | digital",
  "image": "REQUIRED - product image path",
  "detailsUrl": "REQUIRED - product details page",
  "featured": "OPTIONAL - boolean, shows MOST POPULAR badge",
  "revolutLink": "OPTIONAL - Revolut checkout URL",
  "google": "OPTIONAL - Google Merchant Center fields"
}
```

### 5.3 Product Description Rules

1. **First sentence:** What problem it solves (not what it is)
2. **Second sentence:** The concrete outcome
3. **Third sentence:** EU compliance or sovereignty angle
4. **No superlatives.** "Sub-100ms response" not "industry-leading performance"
5. **No jargon without context.** "CSRD compliance" is OK. "AI-powered synergy" is not.

### 5.4 Price Display Format

```
€4,999          ← one-time products
€5,990/mo       ← monthly subscription
€1,999/year     ← annual subscription
€150/hr         ← hourly services
€699/day        ← daily services
```

Always VAT 0% (B2B). Always EUR. No cents unless the price is under €10.

***

## 6. Pricing Principles

### 6.1 The Buffet Rules

From the Nordic Sales Strategy (Section 5):

| Principle | Application |
|-----------|------------|
| **Same price for everyone** | No hidden discounts. Published prices. |
| **No negotiation theater** | The price on the page is the price. |
| **Coffee is included** | Essential services (support, docs, basic training) bundled in. |
| **The salad is big** | Full product access. Not crippled trials. |
| **No one judges** | Tier 1 (€29,950) is a real product, not a teaser. |

### 6.2 Price Change Rules

1. All price changes require update in this standard FIRST
2. Then propagate to: `products.json` → `product-catalog.md` → `PRODUCT_CATALOG.md` → sales materials
3. Price increases: 30-day notice to existing customers
4. Price decreases: Effective immediately
5. All prices valid until 2026-12-31 unless updated

### 6.3 Minimum Viable Prices

These floors protect the brand from underpricing:

| Category | Minimum Price | Rationale |
|----------|--------------|-----------|
| Hourly consulting | €150/hr | EU climate compliance expertise market rate |
| Daily consulting | €699/day | Competitive with industry (Big 4 charges €2,000+/day) |
| Software module | €499 | Below this, perception shifts to "free tool" |
| Monthly subscription | €499/mo | Minimum for B2B SaaS credibility |
| Enterprise pilot | €5,990/mo | Positions as serious industrial platform |

***

## 7. Price Conflict Resolution

### 7.1 Conflicts Identified and Resolved (February 2026)

| Product | Old Conflict | Resolution | Rationale |
|---------|-------------|------------|-----------|
| Consulting Hourly | €98/hr (store) vs €350/hr (docs) | **€150/hr** | €98 too low for EU specialist; €350 too high for self-service; €150 matches workshop rate |
| AI Agent Engineering | €99/hr (store) | **€150/hr** | Aligned with consulting-hourly floor |
| Firehorse Omnichannel | €499 (store) vs €8,000 (docs) | **€1,499** (store), **included** (enterprise tiers) | €499 drastically undervalues AI campaign engine; €8,000 only for standalone enterprise |
| Workshop 3 Days | €4,500 (store) vs €15,000 (docs) | **€6,500** (store), **€15,000** (enterprise bespoke) | €4,500 below 3 days × €150/hr × 8h = €3,600 cost; €6,500 gives margin; €15,000 for deep bespoke |
| DWS IQ Platform | €4,999 (store) vs €12,500 (docs) | **€4,999** (store self-service), **€5,990/mo** (enterprise tier) | Two channels serve different contexts |
| Climate Bundle | €6,500 vs €8,500 vs €9,999 | **€6,500** (store), **included** (enterprise tiers) | Store entry point; enterprise gets full suite |
| Expert Advisory/mo | €3,000 vs €5,000 | **€3,000/mo** (store), **€5,000/mo** (enterprise bespoke with DWS IQ access) | Two service levels |

### 7.2 Resolution Protocol

When a new conflict is found:

1. Check this standard first
2. If not covered, escalate to product owner
3. Default to the **higher** price (protect brand value)
4. Update this standard, then propagate

***

## 8. One-Click Buy Requirements

### 8.1 Mandatory for All Store Products

Every product on dws10.com/buy/ MUST have:

1. **Published price** visible without clicking "details"
2. **Buy Now button** linked to Revolut/Stripe checkout
3. **Delivery timeline** stated on card ("Operational in 30 days")
4. **What's included** in 3-5 bullet points
5. **What's not included** explicitly stated

### 8.2 Self-Service Demo (Platform Products Only)

Platform products (DWS IQ 6, Firehorse Suite) should offer:

1. Live demo environment accessible with email only
2. Pre-loaded sample data (Nordic construction portfolio)
3. 7-day access window
4. No sales qualification required

### 8.3 Digital Purchase Flow

For products over €1,000:

1. **E-signature** via Visma Sign or Scrive (eIDAS compliant)
2. **Standard agreement** template (pre-approved, not negotiated per deal)
3. **Automated onboarding** email with next steps
4. **First value** within 24 hours of purchase

***

## 9. Google Merchant Center Compliance

### 9.1 Required Fields per Product

All products in `docs/product-catalog.md` and `dws10.com/config/products.json` MUST include:

| Field | Required | Format |
|-------|----------|--------|
| id | Yes | Unique product ID |
| title | Yes | Max 150 characters |
| description | Yes | Max 5,000 characters |
| price | Yes | Number + EUR |
| availability | Yes | `in_stock` / `out_of_stock` / `preorder` |
| condition | Yes | `new` |
| brand | Yes | `Lifetime` or `Firehorse` |
| mpn | Yes | Manufacturer part number |
| product_type | Yes | Google category path |
| image_link | Yes | 800x800px minimum |
| link | Yes | Product page URL |

### 9.2 Feed Update Schedule

- **Weekly:** Price validation against this standard
- **Monthly:** Availability status review
- **Quarterly:** Description refresh for SEO
- **On change:** Immediate feed regeneration

***

## 10. Product Lifecycle

### 10.1 Stages

| Stage | Pricing | Visibility | Support |
|-------|---------|-----------|---------|
| **Alpha** | Discounted (max 30% off standard) | Limited / invite-only | Best-effort |
| **Active** | Standard per this document | Public / store | Full SLA |
| **Sunset** | Frozen (no new sales) | Hidden from store | Maintenance only |
| **Retired** | N/A | Removed | Migration support 90 days |

### 10.2 Product Retirement Rules

1. Announce 90 days before retirement
2. Offer migration path to replacement product
3. Honor existing contracts through their term
4. Remove from store, Google feed, and sales materials
5. Archive product definition in this standard (moved to appendix)

***

## 11. Product Versioning

### 11.1 Product Version Convention

Products follow the platform version they belong to:

```
[Platform Version].[Product Major].[Product Minor]
Example: 6.1.0 = DWS 6, first product revision, initial release
```

### 11.2 Current Product Versions

| Product Family | Current Version | Platform | Next Version (DWS 7) |
|---------------|----------------|----------|---------------------|
| DWS IQ Platform | **v6.0** | DWS 6 | v7.0 |
| Firehorse Automation | **v6.1.0** | DWS 6 | v7.1.0 |
| DWS IQ Report | **v6.1.0** | DWS 6 | v7.1.0 |
| Firehorse Omnichannel | **v6.1.0** | DWS 6 | v7.1.0 |
| Firehorse Content Management | **v6.1.0** | DWS 6 | v7.1.0 |
| Climate Reporting Bundle | **v6.1.0** | DWS 6 | v7.1.0 |
| Lifetime World Model | **v1.0** | Independent | v2.0 |
| Enterprise Model Training | **v1.0** | Independent | v2.0 |
| Advisory & Consulting | **2026** | Year-based | 2027 |
| Digital Services | **2026** | Year-based | 2027 |

### 11.3 Version Tracking in products.json

Each product MUST include a `version` field:

```json
{
  "id": "DWS-IQ-006",
  "version": "6.0",
  "versionDate": "2026-02-13",
  "mpn": "DWSIQ-V6-2026",
  ...
}
```

### 11.4 Version Change Rules

| Change Type | Version Impact | Example | Requires |
|------------|---------------|---------|----------|
| Bug fix / minor update | Patch (+0.0.1) | 6.1.0 → 6.1.1 | Engineering approval |
| New feature / capability | Minor (+0.1.0) | 6.1.0 → 6.2.0 | Product owner approval |
| Breaking change / major rewrite | Major (+1.0.0) | 6.x → 7.0 | CEO + product owner approval |
| Price change | No version bump | — | Update this standard + Appendix B |
| New product | Starts at x.1.0 | New module = 6.1.0 | Product owner approval |
| Product retirement | Moves to Sunset | — | 90-day notice |

### 11.5 Catalog File Versioning

The authoritative catalog files themselves are versioned:

| File | Current Version | Updated By |
|------|----------------|-----------|
| `DWS_PRODUCT_STANDARD.md` (this file) | **v1.0** | Product owner |
| `dws10.com/config/products.json` | **v2026-02-07** | Date-based, auto from store |
| `docs/product-catalog.md` | **v2026-01-23** | Date-based, Google Merchant |
| `Firehorse/PRODUCT_CATALOG.md` | **v1.0** | Firehorse product line |

### 11.6 Duplicate Detection

**The 30-product rule:** There are exactly **30 unique products** in the DWS catalog. These 30 products appear (sometimes with different prices) in 5 files:

| File | Products Listed | Relationship to This Standard |
|------|----------------|------------------------------|
| `dws10.com/config/products.json` | 30 (authoritative) | Self-service store prices — MUST match Section 4 |
| `docs/product-catalog.md` | 9 (subset, Google Merchant) | Enterprise-positioned prices — MUST NOT contradict Section 4 |
| `Firehorse/PRODUCT_CATALOG.md` | 7 + 3 bundles | Firehorse product line — MUST align or reference this standard |
| `Store/*.md` | Individual pages | Marketing pages — MUST show same prices as products.json |
| `sales-outreach/*.md` | Enterprise tiers | Subscription tier prices — defined in Section 4.2 |

**When in doubt:** `products.json` is the technical source of truth for store prices. This standard is the strategic source of truth for all pricing decisions.

***

## 12. Impact Toward DWS 7

### 12.1 What This Standard Prepares

DWS 7 will be the next major platform generation. This Product Standard establishes the foundation:

| DWS 6 (Current) | DWS 7 (Target) | Standard Contribution |
|-----------------|----------------|----------------------|
| 5 catalog files, conflicting prices | Single source of truth | This document |
| Manual product updates | Automated from `products.json` | Product ID convention |
| No self-service buy | One-click purchase flow | Section 8 requirements |
| Mixed pricing signals | Two-channel clarity | Section 3 model |
| No price floors | Minimum viable prices | Section 6.3 |
| Ad-hoc product cards | Standardized two-number format | Section 5 rules |

### 12.2 DWS 7 Product Architecture Assumptions

1. **Platform-as-a-Service model:** Subscription tiers become the primary revenue model
2. **Module marketplace:** Individual Firehorse modules purchasable as add-ons
3. **Self-service onboarding:** Template portfolios eliminate manual setup
4. **API-first pricing:** Usage-based pricing layer on top of subscription tiers
5. **Multi-tenant by default:** Single deployment serves multiple customers

### 12.3 Measurable Impact Metrics

| Metric | DWS 6 Baseline | DWS 7 Target | Measured By |
|--------|----------------|-------------|-------------|
| Price conflict count | 7 conflicts (see Section 7.1) | 0 | Quarterly audit |
| Time from interest to purchase | 45-90 days | < 7 days (one-click path) | CRM |
| Product catalogs to update per change | 5 files | 1 file (this standard → auto-propagate) | Engineering |
| Pricing page bounce rate | Unknown | < 40% | Analytics |
| Self-service purchases (% of total) | 0% | 20-30% | Revenue reporting |
| Google Merchant feed accuracy | Partial | 100% field compliance | Feed validator |

***

## Appendix A: Price Update Checklist

When updating any product price:

- [ ] Update this standard (`DWS_PRODUCT_STANDARD.md`) FIRST
- [ ] Update `dws10.com/config/products.json`
- [ ] Update `docs/product-catalog.md`
- [ ] Update `Firehorse/PRODUCT_CATALOG.md` (if Firehorse product)
- [ ] Update `Store/` product page (if exists)
- [ ] Update `sales-outreach/NORDIC_SALES_STRATEGY.md` (if enterprise tier)
- [ ] Update `sales-outreach/enterprise-sales.md` (if referenced)
- [ ] Regenerate Google Merchant feed
- [ ] Update investor documents (if MRR/ARR projections affected)
- [ ] Commit all changes in single PR with "pricing:" prefix

## Appendix B: Price History

| Date | Product | Old Price | New Price | Reason | Author |
|------|---------|-----------|-----------|--------|--------|
| 13.02.2026 | Consulting Hourly | €98/hr | €150/hr | Below market for EU specialist | Product Standard v1.0 |
| 13.02.2026 | AI Agent Engineering | €99/hr | €150/hr | Aligned with consulting floor | Product Standard v1.0 |
| 13.02.2026 | Firehorse Omnichannel | €499 | €1,499 | Undervalued AI campaign engine | Product Standard v1.0 |
| 13.02.2026 | Workshop 3 Days | €4,500 | €6,500 | Below cost floor | Product Standard v1.0 |

***

## 11. Usage Metering & Billing Rules

Added: 08.03.2026 | Session: claude/build-mvp-features-nFk7k

### 11.1 Subscription Tiers

| Tier | Target Customer | Monthly Price | API Calls | Assistant Messages | Report Exports | Max Projects |
|------|----------------|---------------|-----------|-------------------|----------------|-------------|
| Free | Trial / Evaluation | €0 | 100 | 20 | 2 | 1 |
| Pro | SME / Mid-market | €499/mo | 5,000 | 500 | 50 | 10 |
| Enterprise | Large / Regulated | Custom | 100,000 | 10,000 | 500 | 100 |

### 11.2 Metering Categories

| Category | What Counts | Example |
|----------|------------|---------|
| API Call | Any authenticated request to `/api/v1/*` | GET `/api/v1/compliance/registry` |
| Assistant Message | Each message sent to the AI Climate Assistant | POST `/api/climate-assistant` |
| Report Export | Each compliance report download (CSV/JSON) | POST `/api/v1/reports/export` |

### 11.3 Billing Event Triggers

- **80% usage**: Email notification to user
- **100% usage**: API returns 429 with upgrade guidance
- **Period reset**: First of each calendar month (UTC)

### 11.4 Customer-Facing Usage Dashboard

Available at: Settings → Usage & Plan (in DWS IQ Dashboard)

Displays: progress bars per metering category, current tier, billing period start, percentage utilization with color coding (green < 70%, amber 70-90%, red > 90%).

### 11.5 Self-Service API Key Management

Customers can generate, list, and revoke API keys from the Settings page. Keys are scoped to specific capabilities (e.g., `compliance:read`, `reports:export`). Maximum 10 active keys per user.

**Included in all tiers** — no additional charge for API key management.

***

*Document follows DWS Document Standard v1.4. Use `***` delimiters for Pandoc compatibility.*
