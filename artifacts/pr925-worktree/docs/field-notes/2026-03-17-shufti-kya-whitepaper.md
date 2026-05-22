# KYA Standard — IDV Provider Certification Requirements

**Standard:** KYA-IDV-CERT v2.0
**Date:** April 2026
**Issuer:** Lifetime Oy — DWS IQ 6 Platform
**Classification:** IDV Provider Evaluation — for engineering and compliance teams
**Purpose:** Technical and compliance requirements for IDV providers seeking KYA Certification. Providers that meet these requirements are eligible for "KYA Certified" designation and inclusion in the DWS IQ 6 identity layer across 21 EU-regulated industry verticals.

**v2.0 Change:** Added eIDAS 2.0 native identity path — EUDI Wallet as L1 option, EU Business Wallet (EUBW) as L2 option. KYA is now positioned as an eIDAS 2.0-native AI agent identity standard.

---

# VERSION AND AGENT HISTORY

Version: 2.0
Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/shufti-meeting-prep-IHXUi | Date: 2026-03-17 | Changes: Initial creation — KYA-IDV-CERT certification requirements for IDV provider evaluation
- Version: 2.0 | Tool: Claude Code (claude-sonnet-4-6) | Session: claude/eudi-digital-euro-signals-7bIDp | Date: 2026-04-13 | Changes: Added eIDAS 2.0 native integration — EUDI Wallet L1, EU Business Wallet L2, new Section 2.5, updated architecture and glossary

Document Status:

- Created: 2026-03-17
- Last Modified: 2026-04-13
- Language: English
- Publication Status: INTERNAL — IDV Provider Evaluation

---

---

## 1. Background: AI Agent Identity Under EU AI Act

The EU AI Act (2026) mandates identity traceability for high-risk AI systems. Traditional IDV verifies humans at onboarding and stops. When a verified human deploys an autonomous AI agent — accessing databases, calling APIs, executing transactions across regulated industries — the identity chain must extend from the human through the agent, continuously.

**KYA (Know Your Agent)** is the DWS standard that governs this chain. It extends KYC/AML to autonomous AI agents operating inside enterprise sandboxes.

### DWS IQ 6 Platform

DWS IQ 6 trains and runs autonomous agent swarms across **21 EU-regulated industries** — steel, cement, construction, healthcare, energy, chemicals, logistics, and more. Each industry model runs inside an isolated sandbox with hardware-attested boundaries.

### KYA Certification

IDV providers that meet the requirements in this document are eligible for **KYA Certified** designation, which includes:

| Benefit                           | Detail                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| **"KYA Certified" branding**      | Named as approved identity layer in DWS enterprise deployments                          |
| **21 industry verticals**         | Access to healthcare, construction, energy, chemicals, steel, cement, logistics markets |
| **Recurring verification volume** | Onboarding + agent deployment + continuous monitoring per customer                      |
| **EU AI Act compliance chain**    | IDV decisions logged in Firehorse audit trail — court-defensible by design              |
| **Market category ownership**     | Agent identity is a new category. No IDV vendor serves it today.                        |

### Certification Process

1. **Technical evaluation** — Provider demonstrates compliance with requirements in Sections 4–7
2. **PoC integration** — 4-week joint integration proving end-to-end signal flow (Section 8)
3. **Compliance verification** — EU data residency and GDPR controls confirmed (Section 7)
4. **Commercial terms** — Channel partnership agreement (Section 9)
5. **KYA Certified designation** — Provider listed as approved identity layer

---

## 2. KYA Framework — Five Identity Layers

```
┌─────────────────────────────────────────────────────────────┐
│  KYA (Know Your Agent) — Identity Pyramid                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  L5: Continuous Risk Monitoring                      │ ◄─── IDV PARTNER
│  │      Ongoing AML/sanctions webhooks                  │     (continuous)
│  ├─────────────────────────────────────────────────────┤    │
│  │  L4: Runtime Behavior Scoring                        │ ◄─── DWS internal
│  │      Agent Trust Score (ATS) from sandbox telemetry  │     (Firehorse)
│  ├─────────────────────────────────────────────────────┤    │
│  │  L3: Agent Capability Manifest                       │ ◄─── DWS internal
│  │      Signed declaration of permitted tools/paths     │     (KYA engine)
│  ├─────────────────────────────────────────────────────┤    │
│  │  L2: Agent Provenance (KYB)                          │ ◄─── IDV PARTNER
│  │      Who published this agent? Org verification.     │     (one-time)
│  ├─────────────────────────────────────────────────────┤    │
│  │  L1: Human Identity (KYC/AML/IDV)                    │ ◄─── IDV PARTNER
│  │      Verify the person deploying the agent            │     (onboarding)
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**The IDV partner powers 3 of 5 layers:** L1 (human identity), L2 (org verification), and L5 (continuous risk). DWS handles L3 (capability manifests) and L4 (runtime scoring) internally.

**v2.0 update — eIDAS 2.0 native paths:**

| Layer  | Traditional IDV path          | eIDAS 2.0 native path (v2.0)                             |
| ------ | ----------------------------- | -------------------------------------------------------- |
| **L1** | Veriff, Signicat, Shufti Pro  | EUDI Wallet Verifiable Credential (eIDAS 2.0, Dec 2026+) |
| **L2** | Veriff Vespia KYB, Shufti KYB | EU Business Wallet (EUBW) org VC (Q4/2025+)              |
| **L5** | IDV provider AML webhook      | EUDI Wallet revocation / sanctions feed (roadmap)        |

For EU27 deployments after December 2026, the EUDI Wallet path satisfies L1 without a third-party IDV provider. The traditional IDV path remains valid globally and for markets where EUDI adoption is incomplete.

### KYA Maturity Ladder — Certification Tiers

No IDV vendor today covers all three layers natively. That's the point — KYA-IDV-CERT defines the maturity ladder, and providers certify at their current level while building toward full-stack coverage.

```
┌─────────────────────────────────────────────────────────────────┐
│  KYA-IDV-CERT Maturity Ladder                                    │
│                                                                 │
│  Tier 3: KYA FULL STACK (L1 + L2 + L5)          ┌──────────┐  │
│  Continuous monitoring + KYB + IDV.              │ ★★★      │  │
│  The gold standard. No vendor here yet.          │ €12–15K  │  │
│  First to certify Tier 3 owns the category.      └──────────┘  │
│                                                                 │
│  Tier 2: KYA ENTERPRISE (L1 + L2)                ┌──────────┐  │
│  Onboarding IDV + organization verification.     │ ★★       │  │
│  Strong starting position. L5 via roadmap or     │ €8K      │  │
│  partner integration.                            └──────────┘  │
│                                                                 │
│  Tier 1: KYA FOUNDATION (L1 only)                ┌──────────┐  │
│  Human identity verification at onboarding.      │ ★        │  │
│  Entry-level certification. Upgrade path clear.  │ €5K      │  │
│                                                  └──────────┘  │
│                                                                 │
│  ─── Aspiration tier ─────────────────────────────────────────  │
│                                                                 │
│  Tier 3+ : KYA L5 READY                          ┌──────────┐  │
│  Provider has continuous AML/sanctions webhooks   │ ★★★+     │  │
│  with < 24h detection latency. First-mover       │ Premium  │  │
│  advantage in AI agent identity market.           └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Strategic implication:** Providers compete to climb the ladder. L5 is where the recurring revenue is — continuous monitoring per verified user per month. The provider that reaches Tier 3 first gets named as DWS's primary identity partner across 21 industry verticals.

---

## 2.5 eIDAS 2.0 Native Integration — EUDI Wallet Path

From December 2026, EUDI Wallet Verifiable Credentials are accepted as L1 input without a third-party IDV provider. The adapter pattern is identical — DWS receives a signed W3C VC instead of an IDV REST API response.

### L1 via EUDI Wallet (EU27, Dec 2026+)

```
User opens EUDI Wallet on mobile
  → Presents age/identity VC to DWS IQ 6 login endpoint
  → DWS verifies VC signature against eIDAS Trust Anchor
  → ZKP selective disclosure: identity confirmed, minimal data shared
  → KYA L1 = SATISFIED (no third-party IDV call)
  → Agent Trust Score initialised at baseline
```

**ZKP advantage:** EUDI Wallet supports Zero-Knowledge Proofs — the user proves identity attributes (e.g., "adult", "EU national", "not sanctioned") without revealing the underlying document data. This is stronger than traditional IDV from a GDPR minimisation standpoint and is a sales differentiator with privacy-sensitive enterprise buyers.

### L2 via EU Business Wallet (EUBW, Q4/2025+)

```
Organisation deploys BYO Agent into DWS sandbox
  → DWS requests org VC from EU Business Wallet
  → EUBW presents signed org identity (VAT ID, jurisdiction, UBO)
  → KYA L2 = SATISFIED (no third-party KYB call needed)
  → Agent provenance anchored to eIDAS-verified legal entity
```

### Identity Provider Decision Tree (v2.0)

```
Is user in EU27 AND has EUDI Wallet?
  YES → Use EUDI Wallet VC for L1
  NO  → Use traditional IDV (Veriff / Signicat / Shufti)

Is org publisher in EU27 AND has EU Business Wallet?
  YES → Use EUBW VC for L2
  NO  → Use traditional KYB (Veriff Vespia / Shufti KYB)

L5 continuous monitoring:
  → Always traditional IDV webhook until EUDI revocation feed matures (2027+)
```

**Note for IDV providers:** EUDI Wallet does NOT replace the traditional IDV path globally. Non-EU markets, pre-Dec 2026 deployments, and organizations without EUBW still require a KYA Certified IDV provider. The eIDAS path is additive, not a substitute.

---

## 3. Architecture — Where the IDV Provider Plugs In

```
┌──────────────────────────────────────────────────────────────┐
│  DWS IQ 6 Platform — Identity Ingress (v2.0)                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  L1 Identity Input (choose one per deployment)       │     │
│  │  A: IDV Provider REST API  (traditional, global)     │     │
│  │  B: EUDI Wallet VC verify  (eIDAS 2.0, EU27 Dec 26+) │     │
│  └─────────────────┬───────────────────────────────────┘     │
│                    │                                          │
│  ┌──────────┐      │      ┌───────────────────┐              │
│  │ Supabase │──────┴─────>│ KYA Policy        │              │
│  │ Auth     │             │ Engine            │              │
│  │ (JWT)    │             │ (Shanghai Model)  │              │
│  └──────────┘             └────────┬──────────┘              │
│                                              │               │
│  ┌───────────────────────────────────────────┴────────────┐  │
│  │  Agent Trust Score (ATS) Calculator                     │  │
│  │  Score: 0–100 → Permission: full/restricted/frozen      │  │
│  └────────────────────────┬──────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │  Sandbox Runtime (Firecracker MicroVM)                  │  │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐              │  │
│  │  │ Steel │ │Cement │ │Health │ │ BYO   │ ← third      │  │
│  │  │ Model │ │ Model │ │ Model │ │ Agent │   party      │  │
│  │  └───────┘ └───────┘ └───────┘ └───────┘              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  IDV Webhook Listener                                   │  │
│  │  POST /api/v1/kya/webhook/{provider}                    │  │
│  │  → HMAC-SHA256 signature validation                     │  │
│  │  → Policy Engine (Shanghai Model)                       │  │
│  │  → Real-time sandbox permission adjustment              │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Integration is lightweight.** DWS has already built the policy engine, trust score calculator, webhook handler, and sandbox permission gating. The IDV provider supplies:

1. **REST API** for onboarding IDV (document + face + liveness + AML)
2. **KYB API** for organization verification (BYO agent publishers)
3. **Webhooks** for continuous risk monitoring (ongoing AML/sanctions alerts)

---

## 4. What DWS Needs from the IDV Partner

### 4.1 Onboarding IDV (Layer 1) — One-Time Per User

| Data Point                     | Required Format                               | Why                                            |
| ------------------------------ | --------------------------------------------- | ---------------------------------------------- |
| `verification_status`          | `approved` / `declined` / `pending`           | Gate: user cannot deploy agents until approved |
| `risk_score` or `risk_level`   | Numeric 0–100 preferred, or categorical bands | Input to KYA trust formula                     |
| `aml_screening.status`         | `approved` / `declined`                       | Hard gate: declined = account frozen           |
| `aml_screening.matched_lists`  | Array of list names                           | EU AI Act Article 12 transparency log          |
| `document_verification.status` | `approved` / `declined`                       | Trust score weight                             |
| `face_verification.status`     | `approved` / `declined`                       | Trust score weight                             |
| `reference`                    | String (DWS session ID)                       | Links result to user session                   |

**Single flow preferred:** Document + face + liveness + AML in one API call, not three.

### 4.2 Organization Verification (Layer 2) — KYB for BYO Agents

When a customer deploys a third-party agent, DWS verifies the agent's publisher organization:

| Data Point                            | Why                                               |
| ------------------------------------- | ------------------------------------------------- |
| Company registry validation           | Agent provenance — who published this agent?      |
| UBO (Ultimate Beneficial Owner) chain | Know who controls the agent's parent organization |
| Sanctions/PEP screening on directors  | Risk gating for sandbox permissions               |
| Country of incorporation              | EU data residency compliance                      |

**Key question:** How deep does automatic UBO resolution go? Multi-level holding structures are common for AI agent publishers.

### 4.3 Continuous Monitoring (Layer 5) — CRITICAL

This is the most valuable integration point — and the highest revenue generator.

**The problem:** A user passes KYC on Day 1. On Day 30, they appear on a sanctions list. Their agent is still running with full permissions. DWS needs a webhook **the same day** the risk profile changes.

**What DWS needs:**

- Ongoing AML/sanctions/PEP monitoring after initial verification
- Webhook notification when a verified user's risk status changes
- Payload must include: event type, reference ID, screening status, matched list names

**Revenue implication:** Continuous monitoring = monthly recurring revenue per verified user, not one-time verification fees. This is where both DWS and the IDV partner make real money.

---

## 5. How DWS Processes IDV Signals — Shanghai Model

The KYA Policy Engine (already built) processes IDV signals and maps them to sandbox actions in < 200ms:

### 5.1 Decision Tree

```
IF aml_screening.status == "declined"
  → TERMINATE_CHAIN
  → Kill all running agents in this user's session
  → Forensic dump to Firehorse audit log
  → Account frozen (KYA score = 0)

ELSE IF ongoing_screening.status == "changed"
  → REVAL_LEASH
  → Remove network egress permission from sandbox
  → Set filesystem to read-only
  → Flag for human review

ELSE (aml_screening.status == "approved")
  → UPDATE_SCORE
  → KYA score +5
  → Extend session TTL
```

### 5.2 IDV Signals → Sandbox Permissions

| IDV Signal                      | KYA Score | Sandbox Permission                            |
| ------------------------------- | --------- | --------------------------------------------- |
| Verified, no AML flags          | 90        | **Full** — all tools, network, read-write     |
| Verified, minor risk flags      | 70        | **Restricted** — no egress, read-only FS      |
| AML screening declined          | 0         | **Frozen** — agent terminated, account locked |
| Ongoing screening: risk changed | 35        | **Suspended** — human review required         |

### 5.3 Risk Score Mapping

If the IDV provider returns categorical bands instead of numeric scores, DWS maps them:

| Provider Band | DWS KYA Score |
| ------------- | ------------- |
| Low risk      | 90            |
| Medium risk   | 70            |
| High risk     | 30            |
| Prohibited    | 0             |

Numeric sub-scores (AML confidence, document confidence, liveness confidence separately) are preferred — they allow DWS to weight identity signals differently per industry vertical.

### 5.4 Webhook Security

DWS validates every incoming webhook:

- HMAC-SHA256 signature verification (constant-time comparison)
- Rate limiting: 20 requests/minute per IP
- Input validation on all fields before policy engine processing
- Full audit trail (Firehorse) for EU AI Act compliance

---

## 6. Agent Trust Score (ATS) — The Complete Formula

The ATS combines sandbox telemetry with IDV signals:

```
ATS = max(0, 1.0 - V×0.25 - L - D×0.05)

Where:
  V = KYA_VIOLATION count (policy breaches by the agent)
  L = 0.10 if avg_latency > 500ms, else 0
  D = DENIED path access attempts (agent tried unauthorized paths)

Mapped to KYA Score: ATS × 100 → 0–100 range
  >= 80 → Full sandbox (GO)
  50–79 → Restricted sandbox (GO with limits)
  < 50  → Suspended (NO_GO)
  = 0   → Frozen (immediate termination)
```

The IDV provider's role is the **identity anchor**: the ATS starts from the IDV verification result and is then adjusted by runtime behavior. A user who fails IDV never gets an ATS — their agents never start.

---

## 7. Data Residency & EU Compliance

### 7.1 DWS Infrastructure — All EU

| Component    | Location                  | Provider              |
| ------------ | ------------------------- | --------------------- |
| Database     | `europe-north1` (Finland) | Supabase (PostgreSQL) |
| Backend API  | `europe-north1`           | Google Cloud Run      |
| Edge sandbox | Helsinki, Finland         | Hardware (air-gapped) |
| CDN          | Global (edge)             | Cloudflare Workers    |
| Audit logs   | EU-only                   | Supabase + Firehorse  |

### 7.2 Requirements for IDV Partner

| Requirement              | Detail                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **EU data processing**   | All PII must remain in EU/EEA. No transatlantic transfers.                                                         |
| **GDPR**                 | DWS is data controller. IDV partner is data processor. DPA required.                                               |
| **Data retention**       | Verification results stored in DWS. IDV partner should not retain PII beyond what's needed for ongoing monitoring. |
| **NIS2 Directive**       | Webhook delivery reliability affects DWS's NIS2 reporting chain.                                                   |
| **EU AI Act Article 12** | All IDV decisions logged with reasoning. Matched sanctions lists stored in transparency log.                       |

**Preferred:** Dedicated EU SaaS instance or on-premise option. Contractual DPA addendum guaranteeing EU-only processing.

---

## 8. PoC Scope — 4 Weeks to Working Demo

### 8.1 Success Criteria

| #   | Criterion                       | Pass Condition                                                    |
| --- | ------------------------------- | ----------------------------------------------------------------- |
| 1   | User completes IDV              | Verification result received via callback with status + risk data |
| 2   | KYA score calculated            | Score correctly maps to sandbox permission level                  |
| 3   | Agent deployed with permissions | Full/Restricted/Frozen matches verification outcome               |
| 4   | Risk change triggers webhook    | Provider sends webhook on simulated AML status change             |
| 5   | Sandbox adjusts automatically   | Agent permissions tighten within 30 seconds of webhook            |

### 8.2 Deliverables

| #   | Deliverable                                          | Owner           | Week |
| --- | ---------------------------------------------------- | --------------- | ---- |
| 1   | Sandbox/test API credentials                         | **IDV Partner** | 1    |
| 2   | Webhook documentation (payload schema, retry policy) | **IDV Partner** | 1    |
| 3   | KYB API access for org verification                  | **IDV Partner** | 2    |
| 4   | IDV adapter integration (`src/integrations/idv/`)    | **DWS**         | 2–3  |
| 5   | End-to-end demo (onboard → deploy → flag → restrict) | **Joint**       | 4    |

### 8.3 Demo Scenario

```
Step 1: User registers on DWS IQ 6
        → Redirected to IDV verification journey
        → Document + face + liveness + AML check
        → Result: APPROVED, risk = low
        → KYA score = 90, sandbox = FULL

Step 2: User deploys a BYO agent (e.g., "TestBot v1")
        → Agent manifest registered with Capability Manifest
        → KYB org verification (if corporate publisher)
        → Agent enters sandbox with full permissions

Step 3: [Simulated] User's AML profile changes
        → IDV partner webhook: risk status = "changed"
        → DWS webhook handler validates signature
        → Shanghai Model: REVAL_LEASH decision
        → Sandbox: network egress removed, filesystem read-only

Step 4: [Simulated] AML screening declines user
        → IDV partner webhook: screening status = "declined"
        → Shanghai Model: TERMINATE_CHAIN decision
        → All agents killed, forensic dump created
        → Account frozen, KYA score = 0
```

---

## 9. Commercial Terms — KYA Certification

KYA Certification is a commercial relationship between Lifetime Oy (DWS IQ 6 platform operator) and the IDV provider. It is not a standard vendor-customer arrangement.

### 9.1 What KYA Certification Includes

| Included                    | Detail                                                                  |
| --------------------------- | ----------------------------------------------------------------------- |
| "KYA Certified" designation | Provider named as approved identity layer in DWS enterprise deployments |
| Integration support         | DWS engineering builds and maintains the adapter (~200 LOC TypeScript)  |
| Firehorse audit integration | IDV decisions included in EU AI Act Article 12 transparency logs        |
| Co-marketing rights         | Joint case study in AI governance / agent identity category             |
| Enterprise deal flow        | Every DWS enterprise customer = recurring IDV verification volume       |

### 9.2 Three Revenue Streams

KYA Certification generates three distinct revenue streams from the maturity ladder itself:

#### Stream 1: Certification Assessment Fee (Per Tier)

Providers pay to be assessed at each tier. They pay again when they want to move up.

| Tier                       | Layers Assessed     | Assessment Fee | What Provider Gets                                                                 |
| -------------------------- | ------------------- | -------------- | ---------------------------------------------------------------------------------- |
| **Tier 1: KYA Foundation** | L1 (Onboarding IDV) | **€5,000**     | KYA Certified badge, DWS enterprise channel access, Firehorse audit integration    |
| **Tier 2: KYA Enterprise** | L1 + L2 (+ KYB)     | **€10,000**    | All Tier 1 + org verification integration, BYO agent publisher screening           |
| **Tier 3: KYA Full Stack** | L1 + L2 + L5        | **€25,000**    | All Tier 2 + primary identity partner designation, co-marketing, premium deal flow |

**Upgrade fee:** Provider certified at Tier 1 pays Tier 2 assessment fee (€10K) to move up — not the delta. Each tier is a full assessment against that tier's requirements.

#### Stream 2: Annual Recertification

Compliance doesn't stand still. NIS2/GDPR requirements evolve, EU AI Act delegated acts get published, sanctions lists change, and DWS adds industry verticals. A Tier 2 certification today needs re-audit in 12 months.

| Tier       | Annual Recertification Fee | Includes                                                                                         |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| **Tier 1** | **€3,000/year**            | Compliance re-audit, adapter compatibility check, updated Firehorse integration                  |
| **Tier 2** | **€5,000/year**            | All Tier 1 + KYB re-assessment, new industry vertical coverage review                            |
| **Tier 3** | **€12,000/year**           | All Tier 2 + L5 monitoring SLA review, webhook reliability audit, detection latency benchmarking |

**Lapse policy:** Certification expires if recertification is not completed within 60 days of anniversary. Provider loses "KYA Certified" designation and DWS enterprise channel access until re-certified.

#### Stream 3: L5 Ready Co-Development Consulting

No provider has native L5 (continuous AML monitoring with same-day webhook delivery) today. DWS defines the L5 standard AND is the only entity that can certify against it. This creates a consulting engagement:

| Engagement                   | Scope                                                                                                                                                                                 | Fee                      | Duration   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------- |
| **L5 Readiness Assessment**  | Gap analysis: what the provider has vs. L5 requirements (webhook infra, detection latency, payload schema, SLA)                                                                       | **€8,000**               | 2 weeks    |
| **L5 Co-Development Sprint** | Joint engineering: DWS + provider build the L5 webhook pipeline to KYA spec. DWS provides the spec, test harness, and Firehorse integration. Provider builds the monitoring pipeline. | **€25,000–40,000**       | 6–10 weeks |
| **L5 Certification**         | Full Tier 3 assessment after co-development completes                                                                                                                                 | **€25,000** (Tier 3 fee) | 2 weeks    |

**Strategic lock-in:** The provider that co-develops L5 with DWS has the inside track to Tier 3 certification. They helped build the spec — they know exactly what to deliver. This is the most defensible revenue stream: DWS owns the standard AND the certification authority.

#### Revenue Model Summary

| Stream                | Type           | Year 1 Revenue (per provider)         | Recurring?            |
| --------------------- | -------------- | ------------------------------------- | --------------------- |
| **Certification**     | Assessment fee | €5K–25K (depends on tier)             | Per tier upgrade      |
| **Recertification**   | Annual         | €3K–12K/year                          | Yes — mandatory       |
| **L5 Co-Development** | Consulting     | €33K–65K (assessment + sprint + cert) | One-time per provider |

**Plus volume-based revenue:**

#### Primary Model: Wholesale Resale

DWS buys verifications wholesale from the certified IDV provider and resells as "KYA Verification" at platform pricing. DWS owns the customer relationship and controls the money flow.

| Element          | Detail                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| **Structure**    | IDV provider gives DWS a dedicated API key / sub-account at wholesale rate                      |
| **Discount**     | **40–60% off** provider's retail per-verification rate                                          |
| **Revenue flow** | End customer → DWS → IDV provider (DWS invoices the customer, pays provider wholesale)          |
| **Tracking**     | All verifications through DWS API key are DWS-originated by definition — no audit rights needed |
| **Enforcement**  | Fully enforceable — DWS controls the billing relationship and the API key                       |

**Why wholesale resale is primary:** Revenue share models (provider reports DWS-originated volume, DWS takes a cut) require audit rights, accurate provider reporting, and contractual enforcement mechanisms that are unrealistic with early-stage providers. Wholesale resale eliminates these problems — DWS sees every transaction because DWS routes every transaction.

#### Alternative Model: Revenue Share (Large Providers Only)

For established providers with mature reporting infrastructure (e.g., IN Groupe, Telia), a revenue share model may be appropriate as an alternative or complement:

| Element          | Detail                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Structure**    | DWS brings enterprise clients → provider gets verification volume → DWS takes share |
| **Range**        | **15–25%** of DWS-originated verification revenue                                   |
| **Revenue flow** | End customer → IDV provider → DWS (provider invoices customer, pays DWS share)      |
| **Tracking**     | DWS session ID in `reference` field + quarterly reconciliation report               |
| **Enforcement**  | Requires contractual audit rights + provider reporting infrastructure               |

**When to use revenue share instead of wholesale:** Only when the provider (a) has auditable reporting infrastructure, (b) has an established billing relationship with the end customer that would be disruptive to reroute through DWS, and (c) agrees to quarterly reconciliation with audit rights.

**Typical structure:** Certification fee (base) + annual recertification (recurring) + wholesale resale (volume). The certification fee funds the assessment. The recertification fee funds ongoing compliance. Wholesale resale captures volume upside while keeping enforcement simple.

### 9.3 Evaluation Criteria

DWS evaluates IDV providers on:

| #   | Criterion                                       | Weight             | Notes                                                                      |
| --- | ----------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| 1   | EU/EEA-only data processing guarantee           | **Critical**       | Hard gate — no transatlantic PII transfers                                 |
| 2   | Onboarding IDV quality (L1)                     | **Critical**       | Document + face + liveness + AML in single flow                            |
| 3   | Webhook reliability and latency                 | High               | Webhook infra required for all tiers                                       |
| 4   | Numeric risk scoring (not just pass/fail)       | High               | Enables per-industry weighting                                             |
| 5   | KYB depth (UBO resolution) (L2)                 | High               | Tier 2+ requirement                                                        |
| 6   | Continuous AML monitoring (L5)                  | **Differentiator** | No vendor has this natively today — first to deliver it owns Tier 3        |
| 7   | Nordic market presence and regulatory knowledge | Medium             | Preferred but not required                                                 |
| 8   | Willingness to co-develop L5                    | **High**           | Co-development engagement = fastest path to Tier 3 + deepest integration   |
| 9   | eIDAS 2.0 / EUDI Wallet compatibility (v2.0)    | **High**           | Support W3C VC ingestion as L1 alternative; EUBW org VC for L2 (Dec 2026+) |

**Maturity-based certification.** Providers are certified at their current tier (1, 2, or 3) and can upgrade as capabilities mature. DWS may certify multiple providers at different tiers, or certify different providers for different layers (e.g., one for L1+L2, another for L5 when the market matures). The first provider to achieve Tier 3 (full-stack L1+L2+L5) becomes the primary identity partner.

**eIDAS 2.0 note (v2.0):** Providers that support EUDI Wallet VC verification natively gain strategic advantage — they can serve as the L5 continuous monitoring layer in eIDAS-native deployments, where L1+L2 are handled by EUDI/EUBW. This is a new Tier 3+ opportunity no vendor currently occupies.

---

## 10. Technical Contact

| Role                | Name         | Contact                 |
| ------------------- | ------------ | ----------------------- |
| Founder & Architect | Risto Paarni | risto@onelifetime.world |
| Platform            | DWS IQ 6     | dws10.com               |
| Company             | Lifetime Oy  | Helsinki, Finland       |

---

## Appendix A: Existing DWS Implementation

The following components are already built and awaiting IDV provider API connection:

| Component                                            | Purpose                                                    | Status      |
| ---------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| KYA Policy Engine (`src/identity/kya-engine.ts`)     | Shanghai Model — maps IDV signals to sandbox actions       | Implemented |
| Agent Trust Score (`src/identity/ats-engine.ts`)     | 0–100 scoring with permission level mapping                | Implemented |
| Type System (`src/identity/types.ts`)                | CapabilityManifest, TelemetryEntry, ATSResult, FaultRecord | Implemented |
| Webhook Handler (`src/routes/kya-webhook.routes.ts`) | HMAC-SHA256 validation, rate limiting, payload parsing     | Implemented |
| Onboarding Routes (`src/routes/onboard.routes.ts`)   | User registration and IDV flow initiation                  | Implemented |
| Firehorse Audit Trail                                | Forensic telemetry for EU AI Act Article 12 compliance     | Implemented |
| Sandbox Permission Gating                            | Full/Restricted/Suspended/Frozen enforcement               | Implemented |

**Integration effort for IDV provider:** Provide REST API + webhooks per requirements in Sections 4–5. DWS engineering writes and maintains the adapter (~200 lines of TypeScript). PoC timeline: 4 weeks to working demo.

**Note:** DWS maintains adapters for all KYA Certified providers. Switching between certified providers is a configuration change, not a rewrite.

---

## Appendix B: Glossary

| Term                    | Definition                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **KYA**                 | Know Your Agent — DWS framework extending KYC/AML to autonomous AI agents                                                                                                      |
| **ATS**                 | Agent Trust Score — real-time 0–100 score computed from sandbox telemetry + IDV signals                                                                                        |
| **BYO**                 | Bring Your Own — third-party agents deployed by customers into DWS sandboxes                                                                                                   |
| **Shanghai Model**      | DWS policy engine that maps identity signals to real-time sandbox actions                                                                                                      |
| **TC-4 Cascade**        | Chain termination protocol — kills all agents in a user's session                                                                                                              |
| **REVAL_LEASH**         | Sandbox tightening — removes network/write permissions without killing agents                                                                                                  |
| **Firehorse**           | DWS forensic telemetry suite (audit trails, EU AI Act Article 12 compliance)                                                                                                   |
| **MCP**                 | Model Context Protocol — standard for AI agent tool discovery and execution                                                                                                    |
| **Control Room**        | DWS dashboard managing 20 industrial model sandboxes                                                                                                                           |
| **Capability Manifest** | Signed declaration of an agent's permitted tools, paths, and TTL                                                                                                               |
| **KYA Verified**        | Branding for agents that passed the full KYA identity pyramid (L1–L5)                                                                                                          |
| **EUDI Wallet**         | EU Digital Identity Wallet — mandatory in all EU27 member states by December 2026 (eIDAS 2.0 Regulation)                                                                       |
| **eIDAS 2.0**           | EU regulation establishing the legal framework for EUDI Wallet, Verifiable Credentials, and cross-border digital identity                                                      |
| **EUBW**                | EU Business Wallet — extension of EUDI Wallet to legal entities; enables org-level Verifiable Credentials for KYA L2                                                           |
| **W3C VC**              | W3C Verifiable Credential — the data format used by EUDI Wallet for identity claims; replaces raw document data with cryptographically signed attestations                     |
| **ZKP**                 | Zero-Knowledge Proof — cryptographic technique allowing identity attributes to be verified without revealing underlying data (used in EUDI Wallet for GDPR-minimal disclosure) |
| **eIDAS Trust Anchor**  | EU-operated PKI infrastructure used to verify signatures on EUDI Wallet credentials; DWS resolves trust anchors at VC verification time                                        |
| **KYA-EUDI path**       | The identity flow where EUDI Wallet VC satisfies L1 and EU Business Wallet VC satisfies L2, with no third-party IDV provider required                                          |
