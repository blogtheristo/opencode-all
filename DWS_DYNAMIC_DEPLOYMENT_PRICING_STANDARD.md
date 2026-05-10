# DWS Dynamic Deployment Pricing Standard

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

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

---

## 1. Purpose

> **Blue = early-access pilot, reduced price or free for up to 12 months, with customer-nominated PMs feeding issues directly to DWS.**
> **Green = stable selling release, no customer feedback obligations.**

This standard governs how DWS prices, positions, and manages enterprise deployments across the product lifecycle. It defines two named deployment tiers — **Blue** and **Green** — each with distinct pricing terms, customer obligations, and transition conditions.

The model rewards enterprise customers who co-develop quality with DWS, while protecting those who prefer a self-contained commercial relationship.

---

## 2. Deployment Color Model

| Attribute               | Blue Version                     | Green Version                 |
| ----------------------- | -------------------------------- | ----------------------------- |
| **Stage**               | Pilot / early access             | Stable commercial             |
| **Pricing**             | Free or reduced rate             | Full market price             |
| **Customer obligation** | Active quality participation     | None                          |
| **Target buyer**        | Enterprise innovation leads      | Procurement / standard buyers |
| **DWS obligation**      | Rapid bug response, co-iteration | Standard SLA                  |

The color signals the product maturity and the nature of the commercial relationship, not a quality ranking. Green is not "better" than Blue — it is a different contract mode.

---

## 3. Blue Version — Enterprise Pilot Tier

### 3.1 Pricing

- **Free** or at a **negotiated reduced rate** agreed before the pilot starts.
- Pricing must be documented in the enterprise contract with an explicit sunset clause referencing the Green transition date.
- No retroactive billing for Blue-period usage once Green is declared.

### 3.2 Enterprise Participation Requirement

In exchange for reduced pricing, the enterprise commits to structured quality participation:

1. **Nominate at least one Product Manager (PM)** as the formal DWS-interface contact.
2. The nominated PM is responsible for **documenting all observed errors, anomalies, and friction points** in the agreed format (DWS Issue Tracker or equivalent).
3. Reports must be submitted within **5 business days** of observation.
4. The PM attends a **monthly sync** with DWS to review open items and product direction.

This is a bilateral value exchange: the enterprise receives below-market access; DWS receives real-world signal that accelerates product quality.

### 3.3 Pilot Duration and Extension

- Default pilot period: as defined in the enterprise contract.
- When the product reaches **General Availability (GA)** and DWS declares a Green version, the enterprise enters the **12-month grace window** (see Section 5).
- Pilot mode cannot be extended beyond 12 months post-GA without a new negotiated agreement.

### 3.4 What Blue Does Not Include

- Dedicated support SLA (best-effort response applies).
- Guaranteed feature parity with the Green release schedule.
- Rights to resell or sublicense the Blue build.

---

## 4. Green Version — Stable Commercial Tier

### 4.1 Definition

The Green version is the **latest stable, fully supported release** of the product available for standard commercial purchase. DWS declares a product Green when:

- Core feature set is complete and tested.
- Documentation is published.
- Support SLA is activated.
- Pricing is set at full market rate.

### 4.2 Pricing

- Full market price as listed in `dws10.com/config/products.json` (single source of truth per CLAUDE.md).
- No pilot obligations, no feedback requirements.

### 4.3 Customer Obligations

**None.** Green customers have zero mandatory interaction with DWS product development. They buy a product; DWS delivers it. Feedback is welcomed but never required.

### 4.4 What Green Includes

- Published SLA and support channels.
- Access to all stable releases during the subscription period.
- Standard onboarding without co-development expectations.

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

| Tier            | Typical Pricing                | Trigger                                        |
| --------------- | ------------------------------ | ---------------------------------------------- |
| Blue (free)     | €0 / period                    | Strategic enterprise; high feedback value      |
| Blue (reduced)  | 20–60% of Green list           | Enterprise with moderate pilot commitment      |
| Green (full)    | List price per `products.json` | Standard commercial purchase                   |
| Green (loyalty) | 10–20% below list, year 1      | Early conversion from Blue within grace window |

Exact pricing is set per deal by the DWS account lead and must be recorded in the signed contract. No pricing commitments are valid without a signed document.

---

## 7. Customer Obligation Matrix

| Obligation              | Blue (pilot)        | Blue (grace window) | Green |
| ----------------------- | ------------------- | ------------------- | ----- |
| Pay full list price     | No                  | No                  | Yes   |
| Nominate product PM     | Yes                 | Yes                 | No    |
| Submit error reports    | Yes (within 5 days) | Yes (within 5 days) | No    |
| Monthly sync attendance | Yes                 | Yes                 | No    |
| SLA guarantee           | No (best-effort)    | No (best-effort)    | Yes   |
| Feature roadmap input   | Invited             | Invited             | No    |

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

> "We're giving your team early access at no cost in exchange for one thing: a named product manager who documents what they encounter. You shape the product; we ship faster. When the product goes commercial, you have 12 months to convert — no surprise pricing."

**Green opening line:**

> "This is the stable, fully supported version, ready to deploy against your SLA requirements. Straightforward commercial terms, no participation obligations."

### 8.4 Objection Handling

| Objection                                  | Response                                                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| "We don't want to be beta testers."        | "Blue is not beta. You're running a production-grade build. The PM obligation is structured reporting, not testing." |
| "What if we never convert to Green?"       | "After the 12-month grace window, Blue access closes. We'll offer Green at list price at that point."                |
| "Can we get Blue pricing forever?"         | "No. Blue is a time-bounded value exchange tied to product maturity. The clock starts when we declare GA."           |
| "Can we negotiate the PM obligation away?" | "No. The PM obligation is the basis of the pricing concession. Without it, Green pricing applies."                   |

---

## 9. Definitions

| Term                          | Definition                                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Blue Version**              | The enterprise pilot deployment tier offering free or reduced pricing in exchange for structured quality participation. |
| **Green Version**             | The latest stable commercial release at full market price with no customer participation obligations.                   |
| **GA (General Availability)** | The date DWS formally declares a product Green and begins full commercial sales.                                        |
| **Grace Window**              | The 12-month period after GA during which Blue customers may remain on pilot pricing before converting.                 |
| **Nominated PM**              | The enterprise-appointed Product Manager who owns the error-documentation obligation during the Blue/grace period.      |
| **Loyalty Rate**              | A discounted first-year Green price offered to Blue customers who convert before the grace window expires.              |

---

_This standard applies to all DWS enterprise product deployments. Deviations require written approval from the DWS account lead and CEO. Pricing source of truth remains `dws10.com/config/products.json`._
