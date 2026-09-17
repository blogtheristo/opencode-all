# DWS IQ — KYA (Know Your Agent) Technical Requirements for Shufti Integration

**Date:** 2026-03-09
**Author:** Risto Paarni, Founder, Lifetime Oy
**Type:** Technical Requirements / Partner Pre-Brief
**Classification:** PARTNER — for Shufti Pro engineering team
**Context:** Attachment for 15-minute architecture call

---

## 1. What We Are Building

**DWS IQ** is an enterprise AI platform that orchestrates 16 industrial compliance models across EU-regulated industries (steel, cement, aviation, maritime, construction, etc.). Each model runs in an isolated sandbox.

**KYA (Know Your Agent)** is a DWS IQ feature that verifies and gates agent access to these industrial models — extending KYC/AML from humans to autonomous AI agents.

We are opening the platform to **BYO (Bring Your Own) agents** — third-party AI tools that customers bring into our sandbox environment. We need Shufti to power the identity layer.

## 2. Integration Points — What We Need from Shufti

### 2.1 Identity Verification (KYA Layer 1)

| Requirement | Detail |
|-------------|--------|
| **Trigger** | User registers on DWS IQ or requests BYO agent deployment |
| **Shufti endpoint** | `/api/verify` (real-time IDV) |
| **Data flow** | DWS Auth (Supabase) → Shufti IDV API → KYA L1 score stored in DWS user profile |
| **Verification types needed** | Document verification, face match, AML screening |
| **Response format** | JSON with verification status + risk score (0–100) |
| **SLA** | < 30 seconds for real-time verification |

### 2.2 Continuous Risk Monitoring (KYA Layer 5)

| Requirement | Detail |
|-------------|--------|
| **Trigger** | Shufti detects risk profile change (AML hit, fraud flag, document expiry) |
| **Mechanism** | Shufti webhook → DWS Event Bus → Sandbox Policy Engine |
| **Action** | DWS IQ dynamically adjusts sandbox permissions based on new risk score |
| **Latency** | < 5 seconds from Shufti webhook to sandbox permission change |
| **Webhook payload** | User ID, new risk score, risk reason, timestamp |

### 2.3 Organization Verification (BYO Agent Anchoring)

| Requirement | Detail |
|-------------|--------|
| **Trigger** | Customer deploys a BYO agent (e.g., Tencent Workbuddy, Clawbot) |
| **Need** | Verify the organization behind the agent, not just the individual user |
| **Shufti capability** | Business verification / KYB (Know Your Business) |
| **Binding** | Agent manifest → verified organization → KYA trust score |

## 3. KYA Trust Score — How Shufti Signals Are Used

```
KYA_TRUST = f(shufti_risk_score, agent_provenance, capability_scope, runtime_behavior)
```

| KYA Score | Sandbox Permission | Shufti's Role |
|-----------|-------------------|---------------|
| >= 80 | Full (egress, filesystem, all MCP tools) | Shufti IDV passed, no AML flags, org verified |
| 50–79 | Restricted (no egress, read-only FS, curated tools) | Shufti IDV passed, minor risk flags |
| < 50 | Suspended, human review | Shufti risk score dropped or AML hit |
| = 0 | Frozen, agent terminated | Shufti flags critical fraud/sanctions |

## 4. BYO Agent Lifecycle — Where Shufti Gates Apply

```
Customer Request → [Shufti L1: Verify Human] → Agent Registration
    → [Shufti KYB: Verify Org] → Capability Review → Sandbox Entry
    → Runtime Monitoring → [Shufti L5: Webhook on risk change]
    → Dynamic Sandbox Restriction/Expansion
```

| Stage | Shufti Gate | Blocking? |
|-------|-------------|-----------|
| 1. Registration | None | — |
| 2. Identity Binding | **L1 IDV** — verify human | **Yes** — no deployment without IDV pass |
| 3. Org Verification | **KYB** — verify organization behind BYO agent | **Yes** — BYO agents require org verification |
| 4. Sandbox Entry | Risk score check (>= 50 to enter) | **Yes** |
| 5. Runtime | Continuous monitoring | Non-blocking (telemetry) |
| 6. Risk Change | **L5 webhook** — Shufti pushes new risk score | **Dynamic** — sandbox adjusts in real-time |

## 5. Technical Architecture

```
┌──────────────────────────────────────────────────────┐
│  DWS IQ Platform                                     │
│                                                      │
│  ┌─────────┐    ┌──────────┐    ┌─────────────────┐ │
│  │ Supabase │───>│ Shufti   │───>│ KYA Score       │ │
│  │ Auth     │    │ IDV API  │    │ Engine          │ │
│  └─────────┘    └──────────┘    └────────┬────────┘ │
│                                          │          │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Control Room (16 Industrial Model Sandboxes)   │ │
│  │                                                 │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    ┌───────┐ │ │
│  │  │Steel│ │Cement│ │Aviat│ │Marit│... │ BYO   │ │ │
│  │  │Model│ │Model │ │Model│ │Model│    │Sandbox│ │ │
│  │  └─────┘ └─────┘ └─────┘ └─────┘    └───┬───┘ │ │
│  │                                          │     │ │
│  │                              ┌───────────┘     │ │
│  │                              ▼                 │ │
│  │                    ┌──────────────────┐        │ │
│  │                    │ BYO Agent        │        │ │
│  │                    │ (Clawbot,CoWork, │        │ │
│  │                    │  Workbuddy, etc.)│        │ │
│  │                    └──────────────────┘        │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │  Shufti Webhook Listener                         ││
│  │  POST /webhooks/shufti → Event Bus → Sandbox     ││
│  │  Policy Engine (restrict/expand permissions)     ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

## 6. What We Need for the PoC

| # | Deliverable | Owner |
|---|-------------|-------|
| 1 | Shufti API sandbox/test credentials | Shufti |
| 2 | Shufti webhook documentation (payload schema, retry policy) | Shufti |
| 3 | KYB (business verification) API access | Shufti |
| 4 | DWS Shufti adapter (`src/integrations/idv/shufti.ts`) | DWS |
| 5 | KYA score engine (`src/kya/score.ts`) | DWS |
| 6 | Webhook listener + sandbox policy trigger | DWS |
| 7 | End-to-end demo: user onboards → BYO agent deploys → Shufti flags risk → sandbox restricts | Joint |

## 7. Infrastructure & Compliance

| Concern | DWS Answer |
|---------|------------|
| **Data residency** | EU-only (Finland/Germany). Supabase europe-north1. No US data transfer. |
| **Auth** | Supabase Auth (JWT). Shufti tokens stored encrypted in Supabase Vault. |
| **Compliance** | GDPR, NIS2, EU AI Act (Article 12 logging). Fit for 55 across 25+ industries. |
| **Edge runtime** | Acer Veriton GN100 (Helsinki) for air-gapped sandbox (OpenSandbox Stage 1.5) |
| **Cloud runtime** | Google Cloud Run (europe-north1) for Stage 2–3 sandboxes |

## 8. Discussion Topics for Architecture Call

1. **Webhook reliability** — Does Shufti guarantee delivery? Retry policy? Dead letter queue?
2. **Risk score granularity** — Is the score 0–100 continuous or bucketed? Can we get sub-scores (AML, fraud, document)?
3. **KYB scope** — Can Shufti verify the organization behind a BYO agent, not just the deploying user?
4. **Latency** — Real-time IDV response time under load? Webhook delivery latency?
5. **Pricing model** — Per-verification vs. monthly? Volume discounts for 25+-industry platform?
6. **Sandbox/test environment** — API sandbox with mock verification flows for our PoC?

---

**Contact:** Risto Paarni, risto@onelifetime.world
**Platform:** dws10.com
**Company:** Lifetime Oy, Helsinki, Finland
