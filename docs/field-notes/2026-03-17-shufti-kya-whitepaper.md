# KYA Integration Whitepaper — Shufti Pro + DWS IQ 6

**Date:** March 2026
**Author:** Lifetime Oy Engineering
**Classification:** PARTNER — for Shufti Pro engineering team
**Purpose:** Technical reference for Shufti engineers. Covers architecture, API contracts, data flows, and integration requirements so both teams can align on implementation without lengthy calls.

---

## 1. Executive Summary

DWS IQ 6 is an enterprise AI platform that runs autonomous agents inside isolated sandboxes across 16 EU-regulated industries. We need Shufti Pro to power two specific layers of our identity framework:

| Layer | What Shufti Does | When |
|-------|-----------------|------|
| **L1 — Human Identity** | Verify the person deploying agents (KYC/AML/IDV) | At onboarding |
| **L5 — Continuous Risk** | Notify us when a verified user's risk profile changes | Ongoing, post-onboarding |

**We are not asking Shufti to build anything new.** We need API access, webhook delivery, and documentation to connect existing Shufti capabilities to our policy engine.

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  DWS IQ 6 Platform                                       │
│                                                          │
│  ┌──────────┐   ┌─────────────┐   ┌──────────────────┐  │
│  │ Supabase │──>│ Shufti Pro  │──>│ KYA Policy       │  │
│  │ Auth     │   │ IDV API     │   │ Engine           │  │
│  │ (JWT)    │   │ (REST)      │   │ (Shanghai Model) │  │
│  └──────────┘   └─────────────┘   └────────┬─────────┘  │
│                                             │            │
│  ┌──────────────────────────────────────────┴─────────┐  │
│  │  Agent Trust Score (ATS) Calculator                 │  │
│  │  Score: 0–100 → Permission: full/restricted/frozen  │  │
│  └────────────────────────┬───────────────────────────┘  │
│                           │                              │
│  ┌────────────────────────┴───────────────────────────┐  │
│  │  Sandbox Runtime (Firecracker MicroVM)              │  │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐          │  │
│  │  │ Steel │ │Cement │ │Constr.│ │ BYO   │ ← third  │  │
│  │  │ Model │ │ Model │ │ Model │ │ Agent │   party   │  │
│  │  └───────┘ └───────┘ └───────┘ └───────┘          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Shufti Webhook Listener                            │  │
│  │  POST /api/v1/kya/webhook/shufti                    │  │
│  │  → HMAC-SHA256 validation                           │  │
│  │  → Policy Engine (Shanghai Model)                   │  │
│  │  → Sandbox permission adjustment                    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Integration Point 1: Onboarding IDV (KYA Layer 1)

### 3.1 Flow

```
User clicks "Deploy Agent" on DWS IQ dashboard
  → DWS frontend redirects to Shufti verification journey
  → Shufti performs: document check + face match + liveness + AML screening
  → Shufti returns verification result to DWS callback URL
  → DWS stores result in user profile (Supabase)
  → KYA Policy Engine sets initial sandbox permissions
```

### 3.2 What We Need from Shufti API

| Field | Required Format | Why DWS Needs It |
|-------|----------------|-----------------|
| `verification_status` | `approved` / `declined` / `pending` | Gate: user cannot deploy agents until approved |
| `risk_score` or `risk_level` | **Numeric 0–100 preferred**, or categorical (low/medium/high/prohibited) | Input to KYA trust formula. If categorical, DWS maps: low=90, medium=70, high=30, prohibited=0 |
| `aml_screening.status` | `approved` / `declined` | Hard gate: declined = account frozen, zero agent access |
| `aml_screening.filters` | Array of matched list names | Stored in audit log (EU AI Act Article 12 transparency) |
| `document_verification.status` | `approved` / `declined` | Affects trust score weight |
| `face_verification.status` | `approved` / `declined` | Affects trust score weight |
| `reference` | String (DWS session ID) | Links Shufti result to DWS user session |

### 3.3 Questions for Shufti Engineers

1. **Does the API return a numeric confidence/risk score, or only categorical bands?** Our trust formula works best with numeric input. If only bands are available, we'll map them ourselves — but sub-scores (AML confidence, document confidence, liveness confidence separately) would give us better granularity.

2. **Can we pass our `sessionId` as the `reference` field?** This is how we link Shufti results to the correct DWS user and agent deployment session.

3. **What verification journey types support all three checks (document + face + AML) in a single API call?** We want a single verification flow, not three separate calls.

---

## 4. Integration Point 2: Organization Verification — KYB (BYO Agents)

### 4.1 Flow

```
Customer wants to deploy a third-party agent (e.g., Clawbot, Microsoft CoWork)
  → DWS requires org verification before BYO agent enters sandbox
  → DWS calls Shufti KYB API with company details
  → Shufti checks: company registry, UBO structure, sanctions screening
  → Result stored; agent manifest bound to verified organization
```

### 4.2 What We Need from Shufti KYB API

| Field | Why |
|-------|-----|
| Company name + registration number validation | Agent provenance verification |
| UBO (Ultimate Beneficial Owner) identification | Know who controls the agent's parent org |
| Sanctions/PEP screening on directors | Risk gating for agent permissions |
| Country of incorporation | EU data residency compliance check |

### 4.3 Question for Shufti Engineers

**How deep does automatic UBO resolution go?** If a BYO agent is published by Company A, owned by Holding B, owned by Fund C — does Shufti resolve the full chain automatically, or only the first level?

---

## 5. Integration Point 3: Continuous Monitoring Webhooks (KYA Layer 5)

This is the most critical integration for DWS.

### 5.1 The Problem

A user passes KYC on Day 1. On Day 30, they get added to a sanctions list. Their agent is still running with full sandbox permissions. **We need Shufti to notify us when this happens.**

### 5.2 Flow

```
Day 1:  User passes Shufti IDV → KYA score = 90 → Full sandbox access
Day 30: User appears on sanctions list
        → Shufti detects change
        → Shufti sends webhook to POST /api/v1/kya/webhook/shufti
        → DWS validates HMAC-SHA256 signature
        → KYA Policy Engine evaluates signal (Shanghai Model)
        → Decision: REVAL_LEASH (tighten sandbox) or TERMINATE_CHAIN (kill all agents)
        → Sandbox permissions adjusted within seconds
```

### 5.3 Webhook Payload — What DWS Expects

Our webhook handler is already built. Here is the payload structure we process:

```json
{
  "event": "verification.status.changed",
  "reference": "dws-session-abc123",
  "verification_data": {
    "aml_screening": {
      "status": "declined",
      "filters": ["OFAC SDN", "EU Sanctions"]
    },
    "ongoing_screening": {
      "status": "changed"
    }
  }
}
```

### 5.4 How DWS Processes Webhooks — Shanghai Model Decision Tree

```
IF aml_screening.status == "declined"
  → TERMINATE_CHAIN
  → Kill all running agents in this user's session
  → Forensic dump to Firehorse audit log
  → Account frozen (KYA score = 0)

ELSE IF ongoing_screening.status == "changed"
  → REVAL_LEASH
  → Remove network egress permission
  → Set filesystem to read-only
  → Flag for human review

ELSE (aml_screening.status == "approved")
  → UPDATE_SCORE
  → KYA score +5
  → Extend session TTL
```

### 5.5 Security — Webhook Signature Validation

Our handler validates every webhook using HMAC-SHA256:

```
Expected signature = SHA256(SHUFTI_SECRET_KEY + raw_json_body)
Compare using constant-time comparison (crypto.timingSafeEqual)
Reject if mismatch → 401 response
Rate limit: 20 requests/minute per IP
```

### 5.6 Critical Questions for Shufti Engineers

1. **Does Shufti offer ongoing/continuous AML monitoring?** Meaning: after initial verification passes, does Shufti continue watching the user against sanctions/PEP lists and send a webhook if their status changes days/weeks/months later? This is the single most important question for our integration.

2. **If yes — what is the webhook payload format for ongoing monitoring events?** Our handler expects the structure shown in §5.3. If Shufti's ongoing monitoring webhooks use a different format, we need the schema.

3. **Webhook delivery guarantees:** What is the retry policy if our endpoint returns a 5xx? How many retries? What backoff interval? Is there a dead-letter queue or dashboard to see failed deliveries?

4. **Webhook latency:** From the moment Shufti detects a risk change, how quickly is the webhook dispatched? Seconds? Minutes? Hours?

---

## 6. Agent Trust Score (ATS) — How Shufti Data Feeds the Score

### 6.1 Formula

```
ATS = max(0, 1.0 - V×0.25 - L - D×0.05)

Where:
  V = KYA_VIOLATION count (policy breaches by the agent)
  L = 0.10 if avg_latency > 500ms, else 0
  D = DENIED path access attempts (agent tried unauthorized paths)
```

The ATS is calculated from sandbox telemetry **before** any Shufti call. Shufti's role is different — it provides the **identity anchor** that determines whether the user is allowed to deploy agents at all, and the **continuous risk signal** that can override the ATS.

### 6.2 How Shufti Signals Map to Sandbox Permissions

| Shufti Signal | KYA Score Effect | Sandbox Permission |
|---------------|-----------------|-------------------|
| IDV approved, no AML flags | Score = 90 (initial) | **Full** — all tools, network, read-write |
| IDV approved, minor risk flags | Score = 70 | **Restricted** — no network egress, read-only FS |
| AML screening declined | Score = 0 | **Frozen** — agent terminated, account locked |
| Ongoing screening: changed | Score drops to 35 | **Suspended** — human review required |
| Ongoing screening: unchanged | No change | Maintain current permissions |

### 6.3 Note on Score Derivation

If Shufti returns categorical risk bands (low/medium/high/prohibited) instead of numeric scores, DWS maps them:

| Shufti Band | DWS KYA Score |
|-------------|--------------|
| low | 90 |
| medium | 70 |
| high | 30 |
| prohibited | 0 |

**Numeric sub-scores would be better** (we could weight AML vs. document vs. liveness differently), but categorical bands work.

---

## 7. Data Residency & Compliance

### 7.1 DWS Infrastructure

| Component | Location | Provider |
|-----------|----------|----------|
| Database | `europe-north1` (Finland) | Supabase (PostgreSQL) |
| Backend API | `europe-north1` | Google Cloud Run |
| Edge sandbox | Helsinki, Finland | Acer Veriton GN100 (air-gapped) |
| CDN | Global (edge) | Cloudflare Workers |
| Audit logs | EU-only | Supabase + Firehorse |

### 7.2 Requirements for Shufti

| Requirement | Detail |
|-------------|--------|
| **Data processing location** | All PII must remain in EU/EEA. No transatlantic transfers. |
| **GDPR compliance** | DWS is the data controller. Shufti is the data processor. DPA required. |
| **Data retention** | Verification results stored in DWS (Supabase). Shufti should not retain PII beyond verification completion unless required for ongoing monitoring. |
| **NIS2 Directive** | Agent telemetry and identity verification events are part of DWS's NIS2 reporting chain. Shufti webhook delivery reliability affects our compliance posture. |
| **EU AI Act Article 12** | All identity verification decisions must be logged with reasoning. Shufti's `filters` array (matched sanctions lists) is stored as part of the transparency log. |

### 7.3 Question for Shufti Engineers

**Can we get a contractual guarantee (DPA addendum) that all PII for our account is processed exclusively in EU/EEA data centers?** On-premise deployment is an option but adds operational complexity — a dedicated EU SaaS instance is preferred if available.

---

## 8. PoC Scope — What We Build Together

### 8.1 PoC Success Criteria

| # | Criterion | Pass Condition |
|---|-----------|---------------|
| 1 | User completes Shufti IDV | Verification result received via callback with status + risk data |
| 2 | KYA score calculated from Shufti result | Score correctly maps to sandbox permission level |
| 3 | Agent deployed with correct permissions | Full/Restricted/Frozen matches the user's verification outcome |
| 4 | Ongoing risk change triggers webhook | Shufti sends webhook when simulated risk change occurs |
| 5 | Sandbox adjusts on webhook | Agent permissions tighten within 30 seconds of webhook receipt |

### 8.2 Deliverables

| # | Deliverable | Owner | Timeline |
|---|-------------|-------|----------|
| 1 | Shufti sandbox API credentials | **Shufti** | Week 1 |
| 2 | Webhook documentation (payload schema, retry policy) | **Shufti** | Week 1 |
| 3 | KYB API access for org verification | **Shufti** | Week 2 |
| 4 | DWS Shufti API adapter (`src/integrations/idv/shufti.ts`) | **DWS** | Week 2–3 |
| 5 | End-to-end integration test (onboard → deploy → flag → restrict) | **Joint** | Week 4 |

### 8.3 Demo Scenario (End-to-End PoC)

```
Step 1: User registers on DWS IQ
        → Redirected to Shufti IDV journey
        → Document + face + liveness + AML check
        → Result: APPROVED, risk = low
        → KYA score = 90, sandbox = FULL

Step 2: User deploys a BYO agent (e.g., "TestBot v1")
        → Agent manifest registered
        → KYB org verification (if corporate)
        → Agent enters sandbox with full permissions

Step 3: [Simulated] User's AML profile changes
        → Shufti webhook fires: ongoing_screening.status = "changed"
        → DWS webhook handler validates HMAC signature
        → Shanghai Model: REVAL_LEASH decision
        → Sandbox: network egress removed, filesystem read-only

Step 4: [Simulated] AML screening declines user
        → Shufti webhook fires: aml_screening.status = "declined"
        → Shanghai Model: TERMINATE_CHAIN decision
        → All agents killed, forensic dump created
        → Account frozen, KYA score = 0
```

---

## 9. Technical Contact

| Role | Name | Email |
|------|------|-------|
| Founder & Architect | Risto Paarni | risto@onelifetime.world |
| Platform | DWS IQ 6 | dws10.com |
| Company | Lifetime Oy | Helsinki, Finland |

---

## Appendix A: Existing DWS Implementation (Reference)

These files are already implemented and awaiting Shufti API connection:

| File | Purpose |
|------|---------|
| `src/identity/kya-engine.ts` | Policy engine — Shanghai Model (evaluateSignal → executeDecision) |
| `src/identity/ats-engine.ts` | Agent Trust Score calculator (0–100 scoring, permission level mapping) |
| `src/identity/types.ts` | TypeScript interfaces (CapabilityManifest, TelemetryEntry, ATSResult, FaultRecord) |
| `src/routes/kya-webhook.routes.ts` | Shufti webhook handler (HMAC-SHA256 validation, rate limiting, payload parsing) |
| `src/routes/onboard.routes.ts` | Onboarding routes (/api/v1/onboard) |

### Key Implementation Details

**Webhook handler security:**
- HMAC-SHA256 signature: `SHA256(secret_key + raw_json_body)`
- Constant-time comparison (`crypto.timingSafeEqual`)
- Rate limit: 20 req/min per IP
- Input validation on all fields before policy engine

**Policy engine decision latency target:** < 200ms from webhook receipt to policy decision

**Sandbox permission levels:**
- `full` (KYA >= 80): All MCP tools, network egress, read-write filesystem
- `restricted` (KYA 50–79): No egress, read-only FS, curated tools only
- `suspended` (KYA 1–49): Agent paused, human review required
- `frozen` (KYA = 0): Agent terminated immediately, account locked

---

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **KYA** | Know Your Agent — DWS framework extending KYC/AML to autonomous AI agents |
| **ATS** | Agent Trust Score — real-time 0–100 score computed from sandbox telemetry |
| **BYO** | Bring Your Own — third-party agents deployed by customers into DWS sandboxes |
| **Shanghai Model** | DWS policy engine that maps identity signals to sandbox actions |
| **TC-4 Cascade** | Chain termination protocol — kills all agents in a session |
| **REVAL_LEASH** | Sandbox tightening — removes network/write permissions without killing agents |
| **Firehorse** | DWS forensic telemetry suite (audit trails, EU AI Act compliance) |
| **MCP** | Model Context Protocol — standard for agent tool discovery and execution |
| **Control Room** | DWS dashboard managing 16 industrial model sandboxes |
