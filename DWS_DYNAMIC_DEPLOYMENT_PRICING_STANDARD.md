# DWS Dynamic Deployment Pricing Standard

---

# VERSION AND AGENT HISTORY

Version: 1.8

Sessions & Modifications:

- Version: 1.8 | Tool: Claude Code (Opus 4.7) | Session: claude/ai-pricing-labor-catalog-1raj8 | Date: 14.05.2026 | Changes: §13.8 added — labor-anchored SKU schema extension (sku, tier, priceUnit, agents[], replaces{role,fteCount,fullyLoadedAnnualCostEUR}, nextUpsellSku, deploymentColor). priceVersion baseline bumped to 1.14 in line with first labor-anchored catalog (T0–T4) load. Public render rule: SaaS comparison columns removed, Replaces column required.
- Version: 1.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Code review fixes — version guard uses tuple comparison (not float, which breaks at 1.9→1.10 boundary); versioned HTML overwrite protection added to both generators; noindex meta added to pilot pricelist; subscription products now visible on live price-list/index.html; \_OLD products get productType:archived; GodAgents→Skilled Agents in DWS-IQ-006 features; priceVersion 1.13
- Version: 1.6 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Added Section 13 — Price List Versioning Standard; mandates priceVersion 1.10 baseline, 0.01 increments, date on every change, version shown in both Green and Blue price list headers and per-product version column (stable Green / pilot Blue)
- Version: 1.5 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Added Hardware Pricing Model (Section 12) — hardware is always an external product; Blue = buy-in/cost price (internal, never published), Green = client retail price (published online); unified the Blue=internal/Green=external principle across all three categories in the governing principle
- Version: 1.4 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Added Consultation Pricing Model (Section 11) — Blue = contractor pricing (confidential, never published online), Green = direct client pricing (publicly listed); confirmed Firehorse follows identical Blue/Green model; added cloud costs as separate operating costs rule; updated governing principle and TOC
- Version: 1.3 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Monthly subscription reclassified as a required separate product for all customers on both tiers — removed all optional/add-on framing; fixed duplicate section numbering in Sections 3 and 4; updated pricing table, obligation matrix, and definitions accordingly
- Version: 1.2 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Added monthly support as sellable add-on for both Blue and Green; added Product Version Governance rule (minimum 2 versions per product — one Blue, one Green); updated governing principle, Color Model table, pricing framework, and obligation matrix
- Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Reframed Blue as access-and-learning tier, Green as saleability tier — separates release status from pricing to prevent conflation; added applied product mapping (Green = DWS IQ 6, Blue = DWS IQ 6.1); tightened governing principle to match enterprise release standard
- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/dynamic-deployment-pricing-LExxQ | Date: 10.05.2026 | Changes: Initial creation — formulated the Dynamic Deployment Pricing Standard covering Blue (enterprise pilot) and Green (stable commercial) deployment tiers, transition rules, customer obligation model, and sales motion guidance

Session Links & References:

- Claude Code (claude/dynamic-deployment-pricing-LExxQ): https://github.com/blogtheristo/dws6/commits/claude/dynamic-deployment-pricing-LExxQ
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/dynamic-deployment-pricing-LExxQ/DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md

Document Status:

- Created: 10.05.2026
- Last Modified: 10.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Deployment Color Model](#2-deployment-color-model)
3. [Blue Version — Enterprise Pilot Tier](#3-blue-version--enterprise-pilot-tier)
4. [Green Version — Stable Commercial Tier](#4-green-version--stable-commercial-tier)
5. [Transition Rules](#5-transition-rules)
6. [Pricing Framework](#6-pricing-framework)
7. [Customer Obligation Matrix](#7-customer-obligation-matrix)
8. [Sales Motion Guide](#8-sales-motion-guide)
9. [Definitions](#9-definitions)
10. [Product Version Governance](#10-product-version-governance)
11. [Consultation Pricing Model](#11-consultation-pricing-model)
12. [Hardware Pricing Model](#12-hardware-pricing-model)
13. [Price List Versioning Standard](#13-price-list-versioning-standard)

---

## 1. Purpose

> **The unified Blue/Green rule**
>
> Blue is always the internal cost side. Green is always the external client price. Only Green goes online.
>
> **Software products:** Blue = early-access pilot, reduced or free for up to 12 months, with customer-nominated PMs feeding issues back to DWS. Green = stable selling release.
> **Consultations:** Blue = contractor rate. Green = direct client rate.
> **Hardware:** Blue = buy-in price. Green = client retail price.
>
> Monthly subscription is a required separate product on every contract. Cloud costs are separate operating costs, never bundled. Every DWS and Firehorse product ships with a minimum of two versions: one Blue, one Green.

This standard governs how DWS names, positions, and prices enterprise deployments across the product lifecycle. It defines two named deployment tiers — **Blue** and **Green** — each signalling a distinct release role, not just a price point.

**The core distinction is release function, not price:**

- Blue is the **access and learning** tier. It exists so that enterprise customers can get inside a product early and so that DWS can learn from real-world usage before setting the commercial baseline.
- Green is the **saleability** tier. It is what DWS can stand behind fully — supported, documented, SLA-backed, and commercially clean.

Keeping these roles separate prevents the pricing concession from being confused with the release status. A customer should never be uncertain whether they are on a pilot or a product. The color makes that unambiguous.

---

## 2. Deployment Color Model

| Attribute                | Blue Version                          | Green Version                   |
| ------------------------ | ------------------------------------- | ------------------------------- |
| **Role**                 | Access and learning                   | Saleability                     |
| **Release status**       | Early access / pilot                  | Stable, fully supported         |
| **Pricing**              | Free or reduced (side effect of role) | Full market price               |
| **Customer obligation**  | Nominated PM, structured reporting    | None                            |
| **Monthly subscription** | Required — separate product           | Required — separate product     |
| **DWS obligation**       | Rapid issue response, co-iteration    | Published SLA, standard support |
| **Target buyer**         | Enterprise innovation leads           | Procurement / standard buyers   |
| **Current product**      | DWS IQ 6.1                            | DWS IQ 6                        |

The color signals what the release is **for**, not how good it is. Pricing follows from that role — it is not the definition of it. Green is not "better" than Blue; it is ready for commercial commitments in a way that Blue is not yet.

---

## 3. Blue Version — Access and Learning Tier

Blue exists for two purposes: to give enterprise customers early access to a product before it is commercially stabilised, and to give DWS the real-world signal it needs to set the commercial baseline correctly. Reduced or free pricing is a consequence of that role, not the definition of it.

**Current Blue product: DWS IQ 6.1**

### 3.1 Enterprise Participation Requirement

In exchange for early access, the enterprise commits to structured learning participation:

1. **Nominate at least one Product Manager (PM)** as the formal DWS-interface contact.
2. The nominated PM is responsible for **documenting all observed errors, anomalies, and friction points** in the agreed format (DWS Issue Tracker or equivalent).
3. Reports must be submitted within **5 business days** of observation.
4. The PM attends a **monthly sync** with DWS to review open items and product direction.

This is a bilateral exchange: the enterprise gains early access and influence over the product direction; DWS gains real-world signal before the commercial baseline is set.

### 3.2 Pricing

- **Free** or at a **negotiated reduced rate** agreed before the pilot starts.
- Pricing must be documented in the enterprise contract with an explicit sunset clause referencing the Green transition date.
- No retroactive billing for Blue-period usage once Green is declared.

### 3.3 Monthly Subscription

Monthly subscription is a **required separate product** purchased alongside every Blue deployment. It is not optional and cannot be waived. The subscription covers the support relationship for the duration of the Blue access period.

### 3.4 Pilot Duration and Extension

- Default pilot period: as defined in the enterprise contract.
- When the product reaches **General Availability (GA)** and DWS declares a Green version, the enterprise enters the **12-month grace window** (see Section 5).
- Pilot mode cannot be extended beyond 12 months post-GA without a new negotiated agreement.

### 3.5 What Blue Does Not Include

- Guaranteed uptime or production SLA on the product itself.
- Guaranteed feature parity with the Green release schedule.
- Rights to resell or sublicense the Blue build.

---

## 4. Green Version — Saleability Tier

Green is the version DWS can stand behind commercially without qualification. It is stable, documented, SLA-backed, and priced at full market rate. A product reaches Green when DWS is confident enough in it to make contractual commitments to any customer, not just those willing to participate in its development.

**Current Green product: DWS IQ 6**

### 4.1 Definition

DWS declares a product Green when:

- Core feature set is complete and tested.
- Documentation is published.
- Support SLA is activated.
- Pricing is published in `dws10.com/config/products.json` at full market rate.

### 4.2 Pricing

- Full market price as listed in `dws10.com/config/products.json` (single source of truth per CLAUDE.md).
- No pilot obligations, no feedback requirements.

### 4.3 Monthly Subscription

Monthly subscription is a **required separate product** purchased alongside every Green deployment. It is not optional and cannot be waived. It covers support, a named DWS contact, and the published response SLA for the duration of the Green contract.

### 4.4 Customer Obligations

**None beyond the monthly subscription.** Green customers have zero mandatory interaction with DWS product development. They buy the product and the subscription; DWS delivers both. Feedback is welcomed but never required.

### 4.5 What Green Includes

- Access to all stable releases during the subscription period.
- Standard onboarding without co-development expectations.
- Named DWS contact and published SLA via the required monthly subscription.

---

## 5. Transition Rules

### 5.1 Blue → Green Grace Window

When DWS declares a product Green, existing Blue customers receive a **12-month grace period**:

- During the 12 months, the enterprise **may remain on Blue pricing terms**.
- PM documentation obligation continues during the grace window (value exchange remains active).
- After 12 months, the customer must either:
  - Convert to a Green commercial contract at full price, or
  - Conclude the engagement.

### 5.2 Early Conversion Incentive

Enterprises that convert to Green **before** the 12-month grace window expires may negotiate a **loyalty rate** (typically 10–20% below list price for year one), rewarding early commitment and smooth transition.

### 5.3 Grace Window Clock

| Event                               | Clock action                                                   |
| ----------------------------------- | -------------------------------------------------------------- |
| DWS declares Green (GA date)        | 12-month clock starts                                          |
| Enterprise signs Green contract     | Clock stops; Green terms apply                                 |
| 12 months elapse with no conversion | Blue access terminates; enterprise offered Green at list price |

### 5.4 Version Coexistence

Blue and Green versions may run concurrently in the market. DWS does not guarantee feature parity between Blue and Green at any given time. Green sets the commercial baseline; Blue tracks an adjacent early-access track.

---

## 6. Pricing Framework

Every contract is two line items: the product (Blue or Green) and the monthly subscription. Both are required.

| Line item                    | Typical Pricing                    | Notes                                          |
| ---------------------------- | ---------------------------------- | ---------------------------------------------- |
| Blue product (free)          | €0 / period                        | Strategic enterprise; high feedback value      |
| Blue product (reduced)       | 20–60% of Green list               | Enterprise with moderate pilot commitment      |
| Green product (full)         | List price per `products.json`     | Standard commercial purchase                   |
| Green product (loyalty)      | 10–20% below list, year 1          | Early conversion from Blue within grace window |
| Monthly subscription — Blue  | Negotiated per contract            | Required; covers support SLA during pilot      |
| Monthly subscription — Green | Published rate per `products.json` | Required; covers named contact + full SLA      |

Exact pricing is set per deal by the DWS account lead and must be recorded in the signed contract. No pricing commitments are valid without a signed document.

---

## 7. Customer Obligation Matrix

| Obligation               | Blue (pilot)        | Blue (grace window) | Green          |
| ------------------------ | ------------------- | ------------------- | -------------- |
| Pay full list price      | No                  | No                  | Yes            |
| Buy monthly subscription | Yes (required)      | Yes (required)      | Yes (required) |
| Nominate product PM      | Yes                 | Yes                 | No             |
| Submit error reports     | Yes (within 5 days) | Yes (within 5 days) | No             |
| Monthly sync attendance  | Yes                 | Yes                 | No             |
| Product uptime SLA       | No                  | No                  | Yes            |
| Feature roadmap input    | Invited             | Invited             | No             |

---

## 8. Sales Motion Guide

### 8.1 When to Offer Blue

Offer the Blue tier when:

- The account is a named enterprise target (see sales manifesto account list).
- DWS product coverage in that vertical or use case is thin and real-world signal is needed.
- The account has internal champions who can realistically act as product PMs.
- A free or reduced entry is the only practical way to win the first foothold.

Do **not** offer Blue when the account cannot or will not fulfill the PM obligation — a Blue engagement without quality feedback is simply discounted revenue with no return.

### 8.2 When to Position Green

Position Green when:

- The account is procurement-led and has no appetite for pilot obligations.
- The use case is already well-covered by the product.
- The account is converting from a Blue grace window.
- Speed of contract closure matters more than feedback loop value.

### 8.3 Pitch Language

**Blue opening line:**

> "Your team gets inside DWS IQ 6.1 before it goes to market. One condition: a named product manager who documents what they find. You shape how this ships; we move faster because of it. When it becomes the commercial version, you have 12 months to convert on agreed terms."

**Green opening line:**

> "This is the stable, fully supported version, ready to deploy against your SLA requirements. Straightforward commercial terms, no participation obligations."

### 8.4 Objection Handling

| Objection                                  | Response                                                                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| "We don't want to be beta testers."        | "Blue is not beta. You're running a production-grade build. The PM obligation is structured reporting, not testing."           |
| "What if we never convert to Green?"       | "After the 12-month grace window, Blue access closes. We'll offer Green at list price at that point."                          |
| "Can we stay on Blue forever?"             | "No. Blue is a time-bounded access arrangement. Once the product is Green, the clock runs for 12 months and then Blue closes." |
| "Can we negotiate the PM obligation away?" | "No. The PM obligation is the basis of the pricing concession. Without it, Green pricing applies."                             |

---

## 9. Definitions

| Term                          | Definition                                                                                                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Blue Version**              | The access and learning tier. Early-access pilot deployment, free or reduced price, with customer-nominated PMs feeding issues to DWS. Current product: DWS IQ 6.1.                                                |
| **Green Version**             | The saleability tier. Stable, fully supported commercial release that DWS can stand behind with SLA commitments. No customer participation obligations. Current product: DWS IQ 6.                                 |
| **GA (General Availability)** | The date DWS formally declares a product Green and opens full commercial sales.                                                                                                                                    |
| **Grace Window**              | The 12-month period after GA during which Blue customers may remain on Blue access terms before converting to Green.                                                                                               |
| **Nominated PM**              | The enterprise-appointed Product Manager who owns the error-documentation obligation during the Blue/grace period.                                                                                                 |
| **Loyalty Rate**              | A discounted first-year Green price offered to Blue customers who convert before the grace window expires.                                                                                                         |
| **Monthly Subscription**      | A required separate product purchased alongside every Blue or Green deployment. Cannot be waived. Covers support SLA, named DWS contact, and the ongoing service relationship. Priced separately from the product. |

---

## 10. Product Version Governance

### 10.1 Scope

This standard applies to **all DWS and Firehorse products**. The Blue/Green model and the monthly subscription requirement are not IQ-specific — they are the company-wide release and commercial standard.

Current product registry:

| Product family | Green (current) | Blue (current) |
| -------------- | --------------- | -------------- |
| DWS IQ         | DWS IQ 6        | DWS IQ 6.1     |
| Firehorse      | Firehorse Green | Firehorse Blue |

Firehorse product names follow the same Blue/Green naming logic. Specific version identifiers are maintained in the product registry and updated in the same commit as each release declaration.

### 10.2 Minimum Version Rule

Every DWS and Firehorse product in active development must maintain **a minimum of two concurrent versions** — one Green, one Blue. A product with only a Green version has no visible forward motion for enterprise customers. A product with only a Blue version has no commercial baseline. Both must exist simultaneously.

### 10.2 Version Naming Convention

Blue versions carry a minor version increment above the current Green:

- Green: `DWS IQ 6` → Blue: `DWS IQ 6.1`
- Green: `DWS IQ 7` → Blue: `DWS IQ 7.1`

Major version increments (e.g. 6 → 7) happen when a Blue track graduates to become the new Green baseline, and a new Blue track opens on top of it.

### 10.3 Governance Responsibility

| Action                                          | Owner                                                      |
| ----------------------------------------------- | ---------------------------------------------------------- |
| Declaring a product Green                       | DWS product lead + CEO sign-off                            |
| Opening a new Blue track                        | DWS product lead                                           |
| Retiring a Blue track without a Green successor | CEO approval required                                      |
| Updating current product names in this document | DWS account lead, in the same commit as the product change |

---

_This standard applies to all DWS and Firehorse enterprise product deployments and all DWS consultation engagements. Deviations require written approval from the DWS account lead and CEO. Pricing source of truth remains `dws10.com/config/products.json`._

---

## 11. Consultation Pricing Model

### 11.1 Blue and Green in Consultations

The Blue/Green color model applies to consultation engagements with a different meaning from the product tiers:

| Color     | Consultation meaning                                                                | Published online? |
| --------- | ----------------------------------------------------------------------------------- | ----------------- |
| **Blue**  | Contractor pricing — the rate DWS pays to or charges contractors and subcontractors | **Never**         |
| **Green** | Direct client pricing — the rate charged to end clients                             | **Yes**           |

The underlying principle is the same as products: Green is always the publicly visible, commercially clean price. Blue is always internal.

### 11.2 Publication Rule

**Only Green (direct client) pricing is published on dws10.com or any DWS public channel.**

Contractor (Blue) pricing is confidential and must not appear in:

- Public websites or landing pages
- Marketing materials or proposals sent to clients
- Any document that could be forwarded outside DWS

Contractor pricing is shared only in signed contractor agreements.

### 11.3 Margin Integrity

The spread between Blue (contractor) and Green (client) rates constitutes DWS margin on consultation work. This spread must be defined and approved before any contractor engagement starts. No contractor may be engaged at a rate that eliminates or inverts the margin without CEO approval.

### 11.4 Monthly Subscription and Cloud Costs

The monthly subscription and cloud costs rules from the product model carry over to consultations:

- **Monthly subscription**: billed to the client as a required separate line item covering the ongoing service relationship.
- **Cloud costs**: billed as separate operating costs, passed through at cost or at an agreed markup, never bundled into the consultation day rate.

---

## 12. Hardware Pricing Model

### 12.1 Blue and Green in Hardware

Hardware is always an externally sourced product. DWS does not manufacture hardware; it procures and resells it. The Blue/Green rule therefore maps to the buy/sell distinction:

| Color     | Hardware meaning                               | Published online? |
| --------- | ---------------------------------------------- | ----------------- |
| **Blue**  | Buy-in price — what DWS pays the supplier      | **Never**         |
| **Green** | Client retail price — what the client pays DWS | **Yes**           |

### 12.2 Publication Rule

Only Green (retail) hardware pricing appears on dws10.com or any DWS public channel. Buy-in (Blue) pricing is internal and must not appear in any customer-facing document.

### 12.3 Margin Integrity

The spread between Blue (buy-in) and Green (retail) constitutes DWS hardware margin. This spread must be recorded in the internal pricing sheet before any hardware is quoted to a client. No hardware may be sold at or below buy-in price without CEO approval.

### 12.4 Current Hardware — Green Prices (published)

| Product                                        | Green (retail)            | SKU               |
| ---------------------------------------------- | ------------------------- | ----------------- |
| Acer Veriton GN100 — EU Sovereign Edge AI Node | €3,999/unit (min 2 units) | `edge-node-gn100` |

Blue (buy-in) prices for all hardware are maintained in the internal procurement sheet, not in this document or `products.json`.

---

## 13. Price List Versioning Standard

### 13.1 Purpose

This section exists specifically to prevent silent price regressions. Any commit that touches pricing without bumping the version is detectable immediately by comparing `priceVersion` in the file against the previous commit.

### 13.2 Version Field Rules

Every price-bearing config file carries a `priceVersion` field:

| File                                           | Field          | Baseline        |
| ---------------------------------------------- | -------------- | --------------- |
| `dws10.com/config/products.json`               | `priceVersion` | `1.14`          |
| `landing-pages/dws10-com/config/products.json` | `priceVersion` | mirror of above |
| `config/pilot-blue-prices.json`                | `version`      | `1.0`           |

**Increment rule: 0.01 per change.** Steps: `1.10 → 1.11 → 1.12 → ... → 1.99 → 2.00`.

Baseline raised from `1.10` to `1.14` on 14.05.2026 with the first labor-anchored
catalog load (Blue/pilot) — see §13.8 for the schema extension that triggered the bump.

### 13.3 Required Fields on Every Price Change

A price change is invalid unless all four fields are updated in the same commit:

1. **`priceVersion`** — bumped by 0.01
2. **`lastUpdated`** — ISO 8601 date-time of the change (`YYYY-MM-DDTHH:MM:SSZ`)
3. **`priceHistory` entry** — array entry with `version`, `date`, `author`, and `changes[]`
4. **Dual-folder sync** — `landing-pages/dws10-com/config/products.json` must match in the same commit

Missing any of these four is a standard violation. CI or code review must reject the commit.

### 13.4 Product Version Display

Every product in both the Green and Blue price lists displays its version number in the following format:

```
Green v{version}  /  Blue v{blueVersion}
```

Examples:

- `Green v6  /  Blue v6.1`
- `Green v1.0  /  Blue v1.1`

**Rule:** Blue version = Green version + 0.1. When Green advances from 6 → 7, Blue becomes 7.1. Major version increment (e.g. 6 → 7) happens when a Blue track graduates to become the new Green.

### 13.5 Price List Headers

Both generated price list HTML files must display in their header:

- `priceVersion` (from `products.json`)
- `lastUpdated` date (from `products.json`)
- `version` (from `pilot-blue-prices.json`, Blue list only)
- Generated timestamp

### 13.6 Version Guard Rule

The price list generators (`generate-green-pricelist.py`, `generate-pilot-pricelist.py`) enforce a version guard at runtime:

> **If the existing `Learn/` HTML was generated from a higher `priceVersion` than the current `products.json`, the script must refuse to overwrite it and exit with an error.**

This means a stale or rolled-back `products.json` cannot silently overwrite a correct price list. The guard message names the conflicting versions so the operator knows exactly which file needs updating.

**Bypass is not permitted.** If the guard fires, the correct resolution is to update `products.json` with the right prices and bump `priceVersion` — not to delete the existing HTML.

### 13.7 Governance

| Action                            | Requirement                                              |
| --------------------------------- | -------------------------------------------------------- |
| Any price change                  | Bump `priceVersion` + add `priceHistory` entry           |
| New product added                 | Assign `version` field; bump `priceVersion`              |
| Product renamed `_OLD`            | Bump `priceVersion`; log in `priceHistory`               |
| Blue pilot price change           | Bump `pilot-blue-prices.json` `version` by 0.01          |
| Commit without version bump       | **Reject — standard violation**                          |
| Running generator on stale config | **Blocked by version guard — fix config, do not bypass** |

### 13.8 Labor-Anchored SKU Schema (added 14.05.2026)

The labor-pricing thesis (`docs/marketing/AI-AS-LABOR-PRICING-STRATEGY.md`) requires
every SKU to be benchmarked against the human role it replaces, not against any
SaaS competitor. The following fields are **required** on every SKU added or
edited from `priceVersion 1.14` onward. Pre-1.14 SKUs are grandfathered until
their next price change.

| Field             | Type                        | Required when                                                                                    | Notes |
| ----------------- | --------------------------- | ------------------------------------------------------------------------------------------------ | ----- |
| `sku`             | string                      | always                                                                                           | Canonical SKU code, e.g. `CMP-T2`, `ESG-T3`, `LAND-EUAI`. Matches the catalog in `docs/marketing/PRODUCT-CATALOG-UPSELL-TIERS-2026.md`. |
| `tier`            | enum: `T0 \| T1 \| T2 \| T3 \| T4 \| land \| meter` | always                                                              | T0=Pilot (Blue only), T1=Starter, T2=Pro, T3=Function, T4=Workforce. `meter` for per-outcome SKUs. `land` for engagement-led bundles. |
| `priceUnit`       | enum: `per-month \| per-outcome \| per-year \| per-day \| per-site-per-day \| one-time \| hourly` | always | Replaces the legacy `type` field for new SKUs. `type` may remain for back-compat. |
| `agents`          | string[]                    | always (`[]` if none — e.g. pure consulting)                                                     | List of Skilled Agents bundled in the SKU. |
| `replaces`        | `{ role: string, fteCount: number, fullyLoadedAnnualCostEUR?: number }` | always for non-`land` SKUs in T1+                                | The **labor anchor**. Rendered on every public price-list card. `fullyLoadedAnnualCostEUR` is optional but recommended — drives the "~X% of fully loaded cost" line. |
| `nextUpsellSku`   | string \| null              | always                                                                                           | Target SKU for the next tier. `null` only for the top of a ladder (T4 / pure attach SKUs). |
| `deploymentColor` | enum: `blue \| green`       | always                                                                                           | T0 is **always** `blue`. T1–T4 are `blue` until Risto signs them Green. |
| `priceVersion`    | string                      | always                                                                                           | The `priceVersion` at which this SKU was last touched. Bumps in lockstep with the file-level `priceVersion`. |

#### 13.8.1 Public render rules

The public price-list page (`dws10.com/price-list/`, mirrors, and any partner
embed) **MUST**:

1. Render the **`replaces`** field as the primary differentiator line on every SKU card:
   *"Replaces {role} ≈ {fteCount} FTE at ~{percent}% of fully loaded cost."*
2. Render a **tier badge** (`T0` … `T4`, `Land`, `Meter`) on every SKU.
3. Render a **next upsell** link to `nextUpsellSku` when set.
4. **NOT** render any SaaS-comparison column, claim, or footnote.
5. **NOT** render any `deploymentColor:"blue"` SKU on a public page. Blue SKUs
   are visible only on the Blue/pilot price list (`Learn/pilot-pricelist-*.html`)
   and internal dashboards.

#### 13.8.2 Validation gate

The pre-commit and CI validator (`scripts/validate-pricing.ts` /
`scripts/validate-pricing.ps1`) **MUST** fail the commit when:

- Any SKU is missing `sku`, `tier`, `priceUnit`, `agents`, `nextUpsellSku`, or `deploymentColor`.
- A non-`land` T1+ SKU is missing `replaces`.
- A `T0` SKU is not `deploymentColor:"blue"`.
- `dws10.com/config/products.json` and `landing-pages/dws10-com/config/products.json` differ.
- `priceVersion` did not advance versus the previous commit.
