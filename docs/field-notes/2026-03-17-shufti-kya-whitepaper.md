# KYA Standard — IDV Provider Certification Requirements

**Standard:** KYA-IDV-CERT v1.0
**Date:** March 2026
**Issuer:** Lifetime Oy — DWS IQ 6 Platform
**Classification:** IDV Provider Evaluation — for engineering and compliance teams
**Purpose:** Technical and compliance requirements for IDV providers seeking KYA Certification. Providers that meet these requirements are eligible for "KYA Certified" designation and inclusion in the DWS IQ 6 identity layer across 20 EU-regulated industry verticals.

---

## 1. Background: AI Agent Identity Under EU AI Act

The EU AI Act (2026) mandates identity traceability for high-risk AI systems. Traditional IDV verifies humans at onboarding and stops. When a verified human deploys an autonomous AI agent — accessing databases, calling APIs, executing transactions across regulated industries — the identity chain must extend from the human through the agent, continuously.

**KYA (Know Your Agent)** is the DWS standard that governs this chain. It extends KYC/AML to autonomous AI agents operating inside enterprise sandboxes.

### DWS IQ 6 Platform

DWS IQ 6 trains and runs autonomous agent swarms across **20 EU-regulated industries** — steel, cement, construction, healthcare, energy, chemicals, logistics, and more. Each industry model runs inside an isolated sandbox with hardware-attested boundaries.

### KYA Certification

IDV providers that meet the requirements in this document are eligible for **KYA Certified** designation, which includes:

| Benefit | Detail |
|---------|--------|
| **"KYA Certified" branding** | Named as approved identity layer in DWS enterprise deployments |
| **20 industry verticals** | Access to healthcare, construction, energy, chemicals, steel, cement, logistics markets |
| **Recurring verification volume** | Onboarding + agent deployment + continuous monitoring per customer |
| **EU AI Act compliance chain** | IDV decisions logged in Firehorse audit trail — court-defensible by design |
| **Market category ownership** | Agent identity is a new category. No IDV vendor serves it today. |

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

---

## 3. Architecture — Where the IDV Provider Plugs In

```
┌──────────────────────────────────────────────────────────────┐
│  DWS IQ 6 Platform                                           │
│                                                              │
│  ┌──────────┐   ┌──────────────┐   ┌───────────────────┐    │
│  │ Supabase │──>│ IDV Provider │──>│ KYA Policy        │    │
│  │ Auth     │   │ REST API     │   │ Engine            │    │
│  │ (JWT)    │   │              │   │ (Shanghai Model)  │    │
│  └──────────┘   └──────────────┘   └────────┬──────────┘    │
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

| Data Point | Required Format | Why |
|------------|----------------|-----|
| `verification_status` | `approved` / `declined` / `pending` | Gate: user cannot deploy agents until approved |
| `risk_score` or `risk_level` | Numeric 0–100 preferred, or categorical bands | Input to KYA trust formula |
| `aml_screening.status` | `approved` / `declined` | Hard gate: declined = account frozen |
| `aml_screening.matched_lists` | Array of list names | EU AI Act Article 12 transparency log |
| `document_verification.status` | `approved` / `declined` | Trust score weight |
| `face_verification.status` | `approved` / `declined` | Trust score weight |
| `reference` | String (DWS session ID) | Links result to user session |

**Single flow preferred:** Document + face + liveness + AML in one API call, not three.

### 4.2 Organization Verification (Layer 2) — KYB for BYO Agents

When a customer deploys a third-party agent, DWS verifies the agent's publisher organization:

| Data Point | Why |
|------------|-----|
| Company registry validation | Agent provenance — who published this agent? |
| UBO (Ultimate Beneficial Owner) chain | Know who controls the agent's parent organization |
| Sanctions/PEP screening on directors | Risk gating for sandbox permissions |
| Country of incorporation | EU data residency compliance |

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

| IDV Signal | KYA Score | Sandbox Permission |
|------------|----------|-------------------|
| Verified, no AML flags | 90 | **Full** — all tools, network, read-write |
| Verified, minor risk flags | 70 | **Restricted** — no egress, read-only FS |
| AML screening declined | 0 | **Frozen** — agent terminated, account locked |
| Ongoing screening: risk changed | 35 | **Suspended** — human review required |

### 5.3 Risk Score Mapping

If the IDV provider returns categorical bands instead of numeric scores, DWS maps them:

| Provider Band | DWS KYA Score |
|---------------|--------------|
| Low risk | 90 |
| Medium risk | 70 |
| High risk | 30 |
| Prohibited | 0 |

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

| Component | Location | Provider |
|-----------|----------|----------|
| Database | `europe-north1` (Finland) | Supabase (PostgreSQL) |
| Backend API | `europe-north1` | Google Cloud Run |
| Edge sandbox | Helsinki, Finland | Hardware (air-gapped) |
| CDN | Global (edge) | Cloudflare Workers |
| Audit logs | EU-only | Supabase + Firehorse |

### 7.2 Requirements for IDV Partner

| Requirement | Detail |
|-------------|--------|
| **EU data processing** | All PII must remain in EU/EEA. No transatlantic transfers. |
| **GDPR** | DWS is data controller. IDV partner is data processor. DPA required. |
| **Data retention** | Verification results stored in DWS. IDV partner should not retain PII beyond what's needed for ongoing monitoring. |
| **NIS2 Directive** | Webhook delivery reliability affects DWS's NIS2 reporting chain. |
| **EU AI Act Article 12** | All IDV decisions logged with reasoning. Matched sanctions lists stored in transparency log. |

**Preferred:** Dedicated EU SaaS instance or on-premise option. Contractual DPA addendum guaranteeing EU-only processing.

---

## 8. PoC Scope — 4 Weeks to Working Demo

### 8.1 Success Criteria

| # | Criterion | Pass Condition |
|---|-----------|---------------|
| 1 | User completes IDV | Verification result received via callback with status + risk data |
| 2 | KYA score calculated | Score correctly maps to sandbox permission level |
| 3 | Agent deployed with permissions | Full/Restricted/Frozen matches verification outcome |
| 4 | Risk change triggers webhook | Provider sends webhook on simulated AML status change |
| 5 | Sandbox adjusts automatically | Agent permissions tighten within 30 seconds of webhook |

### 8.2 Deliverables

| # | Deliverable | Owner | Week |
|---|-------------|-------|------|
| 1 | Sandbox/test API credentials | **IDV Partner** | 1 |
| 2 | Webhook documentation (payload schema, retry policy) | **IDV Partner** | 1 |
| 3 | KYB API access for org verification | **IDV Partner** | 2 |
| 4 | IDV adapter integration (`src/integrations/idv/`) | **DWS** | 2–3 |
| 5 | End-to-end demo (onboard → deploy → flag → restrict) | **Joint** | 4 |

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

| Included | Detail |
|----------|--------|
| "KYA Certified" designation | Provider named as approved identity layer in DWS enterprise deployments |
| Integration support | DWS engineering builds and maintains the adapter (~200 LOC TypeScript) |
| Firehorse audit integration | IDV decisions included in EU AI Act Article 12 transparency logs |
| Co-marketing rights | Joint case study in AI governance / agent identity category |
| Enterprise deal flow | Every DWS enterprise customer = recurring IDV verification volume |

### 9.2 Commercial Models (Negotiable)

| Model | Structure | Revenue Flow |
|-------|-----------|-------------|
| **Certification fee** | IDV provider pays annual KYA Certification fee for access to DWS enterprise channel across 20 industry verticals | IDV provider → DWS |
| **Revenue share** | DWS brings enterprise clients into the IDV provider's platform. Provider pays DWS a percentage of verification revenue from DWS-originated clients. | End customer → IDV provider → DWS (share) |
| **Wholesale resale** | DWS resells IDV as "KYA Verification" within its platform at platform pricing. DWS pays IDV provider wholesale rate. | End customer → DWS → IDV provider (wholesale) |

### 9.3 Evaluation Criteria

DWS evaluates IDV providers on:

| # | Criterion | Weight |
|---|-----------|--------|
| 1 | Continuous AML monitoring capability (L5) | **Critical** — make or break |
| 2 | EU/EEA-only data processing guarantee | **Critical** |
| 3 | Webhook reliability and latency | High |
| 4 | Numeric risk scoring (not just pass/fail) | High |
| 5 | KYB depth (UBO resolution) | Medium |
| 6 | Nordic market presence and regulatory knowledge | Medium |
| 7 | Commercial partnership alignment | Medium |

**Multiple providers may be certified.** DWS may certify one primary provider and one backup, or certify different providers for different layers (e.g., one for L1 onboarding, another for L5 continuous monitoring).

---

## 10. Technical Contact

| Role | Name | Contact |
|------|------|---------|
| Founder & Architect | Risto Paarni | risto@onelifetime.world |
| Platform | DWS IQ 6 | dws10.com |
| Company | Lifetime Oy | Helsinki, Finland |

---

## Appendix A: Existing DWS Implementation

The following components are already built and awaiting IDV provider API connection:

| Component | Purpose | Status |
|-----------|---------|--------|
| KYA Policy Engine (`src/identity/kya-engine.ts`) | Shanghai Model — maps IDV signals to sandbox actions | Implemented |
| Agent Trust Score (`src/identity/ats-engine.ts`) | 0–100 scoring with permission level mapping | Implemented |
| Type System (`src/identity/types.ts`) | CapabilityManifest, TelemetryEntry, ATSResult, FaultRecord | Implemented |
| Webhook Handler (`src/routes/kya-webhook.routes.ts`) | HMAC-SHA256 validation, rate limiting, payload parsing | Implemented |
| Onboarding Routes (`src/routes/onboard.routes.ts`) | User registration and IDV flow initiation | Implemented |
| Firehorse Audit Trail | Forensic telemetry for EU AI Act Article 12 compliance | Implemented |
| Sandbox Permission Gating | Full/Restricted/Suspended/Frozen enforcement | Implemented |

**Integration effort for IDV provider:** Provide REST API + webhooks per requirements in Sections 4–5. DWS engineering writes and maintains the adapter (~200 lines of TypeScript). PoC timeline: 4 weeks to working demo.

**Note:** DWS maintains adapters for all KYA Certified providers. Switching between certified providers is a configuration change, not a rewrite.

---

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **KYA** | Know Your Agent — DWS framework extending KYC/AML to autonomous AI agents |
| **ATS** | Agent Trust Score — real-time 0–100 score computed from sandbox telemetry + IDV signals |
| **BYO** | Bring Your Own — third-party agents deployed by customers into DWS sandboxes |
| **Shanghai Model** | DWS policy engine that maps identity signals to real-time sandbox actions |
| **TC-4 Cascade** | Chain termination protocol — kills all agents in a user's session |
| **REVAL_LEASH** | Sandbox tightening — removes network/write permissions without killing agents |
| **Firehorse** | DWS forensic telemetry suite (audit trails, EU AI Act Article 12 compliance) |
| **MCP** | Model Context Protocol — standard for AI agent tool discovery and execution |
| **Control Room** | DWS dashboard managing 20 industrial model sandboxes |
| **Capability Manifest** | Signed declaration of an agent's permitted tools, paths, and TTL |
| **KYA Verified** | Branding for agents that passed the full KYA identity pyramid (L1–L5) |
