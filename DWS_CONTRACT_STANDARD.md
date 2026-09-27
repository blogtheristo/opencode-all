# DWS Contract Standard

***

# VERSION AND AGENT HISTORY

Version: 0.2

Sessions & Modifications:

- Version: 0.2 | Tool: Claude Code (Sonnet 5) | Session: claude/sync-motion-integration-jjkky9 | Date: 21.09.2026 | Changes: Added §4.4 Settlement Rail — Agentic Commerce (Stripe, Revolut). Grounds partner revenue-share payouts in DWS's existing, in-production Revolut Pay + Stripe Invoice hybrid (`Admin/ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md`) as the default settlement rail unless a Product Schedule states otherwise. Separately addresses agentic commerce proper — a partner's product or a DWS agent initiating a purchase on a customer's behalf — as a distinct gating question: flags Stripe's Agentic Commerce Protocol (ACP) as the relevant open, published spec (not yet integrated into any DWS product), requires any agent that can trigger a payment to hold a valid KYA identity/trust score and a Capacity Class that explicitly authorizes commerce/write actions (cross-referencing §6), and records which settlement rail actually carries an agent-initiated transaction as undecided (§13). Updated §13 Open Items to mark payment-terms partially resolved and add the new open question.
- Version: 0.1 | Tool: Claude Code (Sonnet 5) | Session: claude/sync-motion-integration-jjkky9 | Date: 21.09.2026 | Changes: **HIC-approved as v0.1** — accepted as the canonical eight-part skeleton for internal use effective immediately: (1) parties & what each brings, (2) customer-facing delivery structure, (3) revenue flow & license terms, (4) technical interface & support boundary, (5) KYA & Capacity Class responsibilities, (6) audit trail ownership, (7) Partner Captain & delivery accountability, (8) termination & existing-installation continuity. Generalizes the partner-agreement pattern piloted in `docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` (OT/hardware category) into a reusable standard applicable to any partner category — hardware, OT connectivity/data, or SaaS/software. Triggered directly by the Sync Motion partner evaluation (`docs/partnerships/sync-motion-tobias-brida.md`), where DWS-authored TAM estimates and revenue-split proposals were initially drafted without a clear separation between vendor-verified fact and DWS opening position — this standard's §2 and §11 codify that separation for every future partner evaluation. HIC approval covers the standard's own structure and internal use (Publication Status → ACTIVE); it does **not** substitute for the §12 Legal Review still required before any specific Category Schedule or Master Partner Agreement drafted from this skeleton is used for signature — that gate remains open and is tracked separately per deal.

Session Links & References:

- Claude Code (claude/sync-motion-integration-jjkky9): https://claude.ai/code/session_017HnCb3KgxsU9hXPh8gcCF3
- Precedent / first category instance: `docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` (OT/hardware partners)
- Triggering case: `docs/partnerships/sync-motion-tobias-brida.md`
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_CONTRACT_STANDARD.md

Document Status:

- Created: 21.09.2026
- Last Modified: 21.09.2026 (v0.2)
- Language: English
- Languages Available: English
- Publication Status: ACTIVE (HIC-approved 21.09.2026)
- Legal Review: NOT YET PERFORMED — HIC approval covers the standard itself; §12 Legal Review is still required per specific Category Schedule/MPA before use in any signed agreement

***

## 0. Purpose & Scope

This standard defines the canonical skeleton every DWS IQ partner contract is built from — technology partners, OT/hardware vendors, data/connectivity vendors, SaaS vendors, system integrators, and resellers alike. It exists so that no two partner deals are negotiated from a blank page, and so that the same eight questions get answered every time, in the same order, before DWS IQ or a partner signs anything.

**This is not itself a signable legal agreement.** It is the skeleton a Category Schedule (e.g. `docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` for OT/hardware) or a specific Master Partner Agreement (MPA) is drafted against. Legal must turn any instance of this skeleton into binding terms before signature (§12).

**Trigger for this version:** the Sync Motion evaluation surfaced a recurring failure mode — a DWS-authored market estimate or an opening negotiation position (a revenue split, a margin percentage) drifting into language that reads as agreed fact. §2 and §11 exist specifically to prevent that drift from recurring in any future partner evaluation, in this or any other category.

---

## 1. Contract Family — Where This Standard Sits

| Layer                                 | Document                                        | Binding?                                 | Example                                                   |
| ------------------------------------- | ----------------------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| **0. Partner Note**                   | `docs/partnerships/<partner>.md`                | No — exploratory                         | `docs/partnerships/sync-motion-tobias-brida.md`           |
| **1. This Standard**                  | `DWS_CONTRACT_STANDARD.md`                      | No — skeleton                            | This document                                             |
| **2. Category Schedule**              | `docs/plans/<CATEGORY>_PARTNER_AGREEMENT_V0.md` | No — commercial/technical starting point | `docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` (OT/hardware) |
| **3. Master Partner Agreement (MPA)** | Lawyer-drafted                                  | **Yes**                                  | One per partner, per `DWS_LEGAL_STANDARD.md`              |
| **4. Product/Deal Schedule**          | Addendum to MPA                                 | **Yes**                                  | Per SKU, per deal terms                                   |

A new partner category (e.g. "data/OT-connectivity partners," the category Sync Motion belongs to) gets its own Category Schedule once a real deal is in motion — following this standard's eight sections, the way the Themis schedule already does for OT/hardware. Until a Category Schedule exists, evaluation work stays in a Partner Note (Layer 0) and never states commercial terms as agreed.

---

## 2. Parties & What Each Brings

### 2.1 Canonical Party Roles

| Party                                                   | Typical Role                                                                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **DWS IQ** (Lifetime Oy)                                | Decision layer, evidence chain, governed route to regulated EU customers, ecosystem listing                                                |
| **Partner**                                             | Product, hardware, data, or connectivity capability that DWS IQ does not itself build                                                      |
| **System Integrator / Reseller** (optional third party) | Customer relationship, install, first-line support — present in triangulated deals                                                         |
| **Customer**                                            | End user — not a signatory to the Partner Agreement, but every clause in §3–§9 must resolve to something the customer actually experiences |

### 2.2 The Verified-vs-Proposed Rule (Mandatory)

Every fact entered under this section must be tagged one of:

- **Verified** — the partner has stated it directly (in writing, in a call, publicly), or it is independently checkable
- **DWS Estimate** — DWS-authored market sizing, TAM, or adoption assumptions, explicitly marked unverified
- **DWS Proposed** — a DWS opening negotiation position (revenue split, margin, term length) that the partner has not agreed to

**No field in this section may mix these categories without a tag.** This rule exists because the first Sync Motion assessment did exactly that — see the versioning note in `docs/field-notes/2026-09-21-sync-motion-integration-strategic-assessment.md` (v1.1–v1.2) and the correction in `docs/partnerships/sync-motion-tobias-brida.md`.

| Field                   | DWS IQ Brings     | Partner Brings    | Tag                              |
| ----------------------- | ----------------- | ----------------- | -------------------------------- |
| Product/capability      | _(fill per deal)_ | _(fill per deal)_ | Verified                         |
| Customer base / channel | _(fill per deal)_ | _(fill per deal)_ | Verified or DWS Estimate         |
| IP licensed             | _(fill per deal)_ | _(fill per deal)_ | Verified                         |
| Commercial terms        | —                 | —                 | DWS Proposed until countersigned |

---

## 3. Customer-Facing Delivery Structure

Three canonical shapes. Pick one per deal — do not blend without an explicit reason recorded in the Category Schedule.

| Shape                | Who Invoices the Customer    | Who the Customer Contracts With                                                       | Who Owns the Customer Relationship    |
| -------------------- | ---------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------- |
| **Referral**         | Partner                      | Partner                                                                               | Partner (DWS receives a referral fee) |
| **Resale / Bundled** | DWS IQ                       | DWS IQ (partner is subcontracted or embedded, disclosed or white-label per agreement) | DWS IQ                                |
| **Co-Delivery**      | Either, per Product Schedule | Joint / co-branded                                                                    | Shared, per runbook                   |

This mirrors the referral / delivery / reseller language partners themselves commonly use for their own go-to-market (e.g. Sync Motion's stated model) — the shape chosen here should match how the partner already sells, not force a shape onto them.

---

## 4. Revenue Flow & License Terms

### 4.1 Revenue Share (Illustrative Bands — DWS Proposed, Not Fixed)

| Tier              | Illustrative Share to Partner | Basis                                |
| ----------------- | ----------------------------- | ------------------------------------ |
| Referral only     | ~5% of DWS-sold deal value    | Precedent: Themis "Listed" tier      |
| Validated co-sell | ~15–20%                       | Precedent: Themis "Validated" tier   |
| Co-Delivery       | ~25–30% + services revenue    | Precedent: Themis "Co-Delivery" tier |

Any split entered against a real partner must be tagged per §2.2. These bands are a starting reference point, not a commitment DWS has made to any specific partner.

### 4.2 License Terms

- **DWS's license from the partner:** scope (list, market, bundle, integrate), exclusivity (default: non-exclusive), territory (default: Finland + EU; other territories require a separate schedule), duration, and revocation conditions.
- **Partner's license from DWS:** use of DWS IQ trademarks/ecosystem listing, reference-architecture placement, co-marketing rights — scoped to the tier held.
- **Default position:** non-exclusive both directions unless a Product Schedule states otherwise.

### 4.3 Payment Mechanics (Fill Per Deal)

Currency, payment terms (net-30/60), invoicing cadence, and true-up process are Category Schedule or MPA content — not defined generically here. See Open Items (§13).

### 4.4 Settlement Rail — Agentic Commerce (Stripe, Revolut)

**Existing, in-production DWS settlement infrastructure** (verified — `Admin/ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md`): a Revolut Pay + Stripe Invoice hybrid. Revolut Pay is primary (web SDK popup + hosted checkout, orders created server-side via a Cloudflare Worker so the secret key never reaches the frontend); Stripe Invoice handles B2B remainder billing after a Revolut deposit. **Any partner revenue-share payout under this standard settles through this existing rail unless a Product Schedule states a documented exception** — DWS does not stand up a separate payment path per partner.

**Agentic commerce, distinct question:** where a partner's product or a DWS IQ agent can _initiate_ a purchase on a customer's behalf (not just where DWS pays the partner), that transaction needs to run over a protocol built for agent-initiated checkout, not a human-clicked one. Stripe's **Agentic Commerce Protocol (ACP)** — the open, published spec Stripe released with OpenAI for AI-agent checkout — is the reference point here; it is not yet integrated into any DWS product as of this version. Treat "does this deal involve an agent that can trigger a real payment?" as a gating question:

- If **no** (the partner's product only feeds data/decisions, no purchase action) — §4.4 does not apply; use the standard rail above.
- If **yes** — the agent initiating the purchase must hold a valid KYA identity and trust score (§6) _before_ it is permitted to call any payment action, and the deployment's Capacity Class (§6) must explicitly authorize commerce/write actions, not just read/telemetry. No agent self-authorizes a payment; Themis gates it the same way it gates any other write-scope action per `DWS_CAPACITY_CLASS_STANDARD.md` §1.3.
- Which rail actually carries an agent-initiated transaction (Stripe ACP, a card-network agent-token scheme, or the existing Revolut/Stripe hybrid via a human-confirmation step) is **not yet decided** and is Category Schedule content — see §13.

This section exists so that "can an agent buy something under this contract" is asked and answered explicitly per deal, instead of being assumed either way.

---

## 5. Technical Interface & Support Boundary

### 5.1 Capability Contract (Required Regardless of Category)

Every partner — hardware, OT/data connectivity, or SaaS — publishes a versioned, machine-readable capability/interface contract before any tier above "Listed." The Themis capability-contract YAML (`docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` §4.1) is the reference template for the OT/hardware category; a data/connectivity category (e.g. Sync Motion's protocol bridging) would define its own contract covering: data schema, delivery mechanism (MQTT/Kafka/webhook), latency/completeness SLA, and non-invasiveness attestation where applicable.

### 5.2 Support Boundary (Fill Per Deal, Template Below)

| Layer                             | DWS Responsibility          | Partner Responsibility      |
| --------------------------------- | --------------------------- | --------------------------- |
| DWS decision/evidence layer       | Full ownership              | —                           |
| Partner product/data layer        | —                           | Full ownership              |
| Integration adapter               | Joint, per Product Schedule | Joint, per Product Schedule |
| Partner hardware/software defects | —                           | Full (warranty, patching)   |
| Customer-facing L1 support        | Per delivery shape (§3)     | Per delivery shape (§3)     |

### 5.3 SLA Tiers

Reference `docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` §4.3–§4.4 for the security-evidence and lifecycle-commitment pattern (SBOM, CVE response times, minimum 5-year product/security-update commitment) — apply the same discipline to any category unless the Category Schedule states a documented exception.

---

## 6. KYA & Capacity Class Responsibilities

Per `DWS_CAPACITY_CLASS_STANDARD.md` §1.3 governance chain: **KYA defines the agent's rights; Capacity Class defines the deployment's resource, capability, and security boundary; Themis verifies both hold in practice.** Every partner agreement must assign both.

| Responsibility                                                                                  | Owner                                                | Notes                                                                                                 |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| KYA identity/registration for any agent or automated component touching partner data            | DWS IQ (Themis-issued identity)                      | Partner software does not self-attest                                                                 |
| Trust score, permission scope, revocation                                                       | DWS IQ (KYA)                                         | Per `KYA-S1` (`Legal/KYA_S1.md`)                                                                      |
| Capacity Class assignment for the deployment (Core / Production / Enterprise / Sovereign-Scale) | DWS IQ                                               | Determines deployment environment, isolation, and usage limits — see `DWS_CAPACITY_CLASS_STANDARD.md` |
| Secure Model Execution Boundary evidence (if the partner ships models/weights/datasets)         | Partner provides evidence; DWS enforces the boundary | Per `DWS_CAPACITY_CLASS_STANDARD.md` §3.3                                                             |
| Ongoing conformance verification                                                                | Themis                                               | Produces the evidence that both hold                                                                  |

A partner never self-classifies its own Capacity Class or self-issues its own KYA trust score. This is a DWS IQ / Themis function in every deal, regardless of category.

---

## 7. Audit Trail Ownership

| Question                                                                         | Answer                                                                                                                                                                                          |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Who generates the evidence chain (Code Evidence Layer / Mandate Evidence Chain)? | DWS IQ, from ingested partner data plus DWS decision logic                                                                                                                                      |
| Who owns the raw partner data feed?                                              | Partner, until ingested; DWS owns the derived evidence artifact                                                                                                                                 |
| Retention period                                                                 | Per customer contract and applicable regulation (GxP, FSMA, etc.) — minimum matches the strictest regulatory frame the customer is under                                                        |
| Access on request                                                                | Customer: yes, for their own data. Partner: only its own raw feed, not DWS's derived evidence. Regulator: per customer's own audit obligations                                                  |
| Provenance header requirement                                                    | Every ingested record and every generated narrative carries a Code Evidence Layer header per CLAUDE.md ("Code Evidence Layer (EU AI Act Art. 12–14)") — tool, model, agent, date; no exceptions |
| What happens to the audit trail at termination                                   | See §9.3 — audit trail continuity is a termination-clause requirement, not an afterthought                                                                                                      |

---

## 8. Partner Captain & Delivery Accountability

This generalizes `docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` §11 to every partner category, not just OT/hardware.

### 8.1 Role

A **Partner Captain** is the named person inside the partner organization accountable for making that partner's product deliverable through DWS IQ. The role attaches to the agreement, not to a directory entry.

### 8.2 Accountability Split

| Role                 | Accountability                                  |
| -------------------- | ----------------------------------------------- |
| **DWS IQ Captain**   | Ecosystem relationship and customer outcome     |
| **Partner Captain**  | Partner product and delivery outcome            |
| **Customer Captain** | Local operational acceptance                    |
| **Themis**           | Policy, orchestration evidence, and human gates |

### 8.3 Authority & Limits

The Partner Captain **may**: propose changes, prepare deployments, coordinate support, accept product-level test results.

The Partner Captain **may not**: approve their own security-sensitive, destructive, or policy-changing actions. Themis controls policy, evidence, and approval gates — no partner self-approves into a higher tier or a live deployment.

### 8.4 Succession

If the Partner Captain leaves, the partner has a **defined 30-day handover period** to name a successor with equivalent authority. Themis pauses any Co-Delivery-tier deployment activity during the gap.

---

## 9. Termination & Existing Installations

### 9.1 Exit Triggers (Generalized)

| Trigger                                  | Action                                                      | Notice            |
| ---------------------------------------- | ----------------------------------------------------------- | ----------------- |
| Failed SLA (3+ breaches/quarter)         | Downgrade one tier                                          | 30 days           |
| Critical unpatched security issue (>24h) | Immediate suspension, all tiers                             | 24 hours          |
| Partner bankruptcy / acquisition         | Automatic review; DWS assumes support or migrates customers | Immediate         |
| Contract breach (IP, confidentiality)    | Immediate termination                                       | Per MPA           |
| Mutual / commercial exit                 | Standard wind-down                                          | 90 days minimum   |
| Product EOL announced by partner         | Deprecation path begins                                     | 12 months minimum |

### 9.2 The Question a Generic Template Usually Skips: What Happens to Live Customer Installations?

**This is non-negotiable content for any Category Schedule or MPA drafted from this standard.** Termination of the partner agreement must never silently break a customer's already-deployed installation. At minimum, every agreement must state:

- **Minimum support wind-down period** after termination notice during which the partner continues to meet its existing SLA for already-deployed customers (recommended floor: 90 days, longer for regulated verticals with GxP/FSMA-grade evidence dependencies).
- **Data/feed continuity** — whether the partner's data feed keeps flowing to already-deployed customers during wind-down, and under what terms if the underlying commercial relationship has ended.
- **Evidence chain continuity** — DWS's own evidence layer for a customer must not lose historical provenance because an upstream partner relationship ended; DWS retains and can independently attest to evidence already generated, even if new ingestion stops.
- **Customer notice** — the customer must be notified of the partner relationship's end within a defined window (recommended: 30 days), with a migration or continuity plan, before any service degrades.
- **License survival** — any license granted for already-sold/deployed instances survives termination for the life of that installation, unless the termination was for the partner's own breach.

### 9.3 Re-Validation Cadence

No auto-renewal. Each tier above "Listed" requires annual re-validation (lightweight retest, per the Themis category's TC-01/02/07/09 pattern or the category-appropriate equivalent).

---

## 10. Roles & Responsibilities Reference

Where a Category Schedule needs to name specific accountable roles beyond the three Captains in §8, use `DWS_ROLES_REGISTRY.md`'s R01–R25 taxonomy and the five buying-journey stages (Sponsors / Owners / Approvers / Drivers / Sign-off) rather than inventing new role names per deal.

---

## 11. How to Use This Standard

1. **Evaluating a possible partner, no contact made or no decision to proceed yet:** stay in a Partner Note (`docs/partnerships/<partner>.md`). Tag every commercial number per §2.2. State plainly that no agreement exists.
2. **Decision made to pursue a category that has no Category Schedule yet:** draft one under `docs/plans/<CATEGORY>_PARTNER_AGREEMENT_V0.md`, following this standard's §1–§9 in order. Use `docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md` as the worked example.
3. **Ready to contract a specific partner:** Legal drafts the MPA + Product Schedule from the Category Schedule. This standard and the Category Schedule are inputs to Legal, not a substitute for Legal (§12).
4. **Never** present a DWS Estimate or DWS Proposed figure (§2.2) as an agreed term in any customer-facing or partner-facing material until it is actually agreed.

---

## 12. Legal Review Requirement

This standard, and any Category Schedule or draft agreement built from it, is a **commercial and technical starting point — not a binding legal agreement.** Per `DWS_LEGAL_STANDARD.md`, Finnish law and Espoo District Court jurisdiction are Lifetime Oy's default governing-law position; confirm this applies to the specific partner agreement before relying on it. A qualified lawyer must review and finalize binding terms before any signature. No agent — human or AI — signs or represents DWS IQ as bound without that review.

---

## 13. Open Items — Not Yet Defined (v0.2)

- Standard payment terms (net-30/60), currency defaults, and true-up cadence — **partially resolved:** the settlement rail for partner payouts is defined (§4.4, existing Revolut/Stripe hybrid); net terms and currency defaults per deal are still open
- Which rail carries an agent-initiated purchase (Stripe Agentic Commerce Protocol vs. card-network agent tokens vs. human-confirmation fallback on the existing hybrid) — flagged in §4.4, not decided
- Data Processing Agreement (DPA) trigger and template for partners whose feed includes personal data
- Standard liability caps and insurance requirements per tier — for agentic-commerce deals, this must also cover liability for an erroneous or fraudulent agent-initiated transaction
- Dispute resolution mechanism beyond default governing law
- A second worked Category Schedule (data/OT-connectivity category) — Sync Motion is the first candidate once/if outreach proceeds

---

## Versioning

| Version | Date       | Changes                                                                                                                                                                                                                                                                                                                           | Author             |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 0.2     | 2026-09-21 | Added §4.4 Settlement Rail — Agentic Commerce (Stripe, Revolut): grounds partner payouts in the existing production Revolut/Stripe hybrid; treats agent-initiated purchases as a distinct, KYA/Capacity-Class-gated question referencing Stripe's Agentic Commerce Protocol as the relevant open spec, not yet integrated by DWS. | Risto Anton Päärni |
| 0.1     | 2026-09-21 | HIC-approved. Initial creation of the canonical eight-part partner contract skeleton, generalized from the Themis OT/hardware precedent, triggered by the Sync Motion evaluation. Publication Status → ACTIVE. §12 Legal Review remains a separate, still-open gate per future Category Schedule/MPA.                             | Risto Anton Päärni |
