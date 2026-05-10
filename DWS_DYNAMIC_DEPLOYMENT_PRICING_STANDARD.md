# DWS Dynamic Deployment Pricing Standard

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

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

---

## 1. Purpose

> **Enterprise release principle**
>
> Blue is an early-access pilot, free or reduced price for up to 12 months, with customer-nominated product managers feeding issues directly to DWS.
> Green is the stable selling release, with no customer feedback obligations.
> Enterprise accounts can stay in Blue until the pilot window ends, even after the product moves to full price.

This standard governs how DWS names, positions, and prices enterprise deployments across the product lifecycle. It defines two named deployment tiers — **Blue** and **Green** — each signalling a distinct release role, not just a price point.

**The core distinction is release function, not price:**

- Blue is the **access and learning** tier. It exists so that enterprise customers can get inside a product early and so that DWS can learn from real-world usage before setting the commercial baseline.
- Green is the **saleability** tier. It is what DWS can stand behind fully — supported, documented, SLA-backed, and commercially clean.

Keeping these roles separate prevents the pricing concession from being confused with the release status. A customer should never be uncertain whether they are on a pilot or a product. The color makes that unambiguous.

---

## 2. Deployment Color Model

| Attribute               | Blue Version                          | Green Version                   |
| ----------------------- | ------------------------------------- | ------------------------------- |
| **Role**                | Access and learning                   | Saleability                     |
| **Release status**      | Early access / pilot                  | Stable, fully supported         |
| **Pricing**             | Free or reduced (side effect of role) | Full market price               |
| **Customer obligation** | Nominated PM, structured reporting    | None                            |
| **DWS obligation**      | Rapid issue response, co-iteration    | Published SLA, standard support |
| **Target buyer**        | Enterprise innovation leads           | Procurement / standard buyers   |
| **Current product**     | DWS IQ 6.1                            | DWS IQ 6                        |

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

### 3.3 Pilot Duration and Extension

- Default pilot period: as defined in the enterprise contract.
- When the product reaches **General Availability (GA)** and DWS declares a Green version, the enterprise enters the **12-month grace window** (see Section 5).
- Pilot mode cannot be extended beyond 12 months post-GA without a new negotiated agreement.

### 3.4 What Blue Does Not Include

- Dedicated support SLA (best-effort response applies).
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

| Term                          | Definition                                                                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Blue Version**              | The access and learning tier. Early-access pilot deployment, free or reduced price, with customer-nominated PMs feeding issues to DWS. Current product: DWS IQ 6.1.                |
| **Green Version**             | The saleability tier. Stable, fully supported commercial release that DWS can stand behind with SLA commitments. No customer participation obligations. Current product: DWS IQ 6. |
| **GA (General Availability)** | The date DWS formally declares a product Green and opens full commercial sales.                                                                                                    |
| **Grace Window**              | The 12-month period after GA during which Blue customers may remain on Blue access terms before converting to Green.                                                               |
| **Nominated PM**              | The enterprise-appointed Product Manager who owns the error-documentation obligation during the Blue/grace period.                                                                 |
| **Loyalty Rate**              | A discounted first-year Green price offered to Blue customers who convert before the grace window expires.                                                                         |

---

_This standard applies to all DWS enterprise product deployments. Deviations require written approval from the DWS account lead and CEO. Pricing source of truth remains `dws10.com/config/products.json`._
