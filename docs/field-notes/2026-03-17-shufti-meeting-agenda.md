# Shufti Pro — Architecture Call Agenda

**Date:** Tuesday, March 17, 2026 at 11:00 AM (Finland Time, EET)
**Duration:** 30 minutes
**Attendees:** Risto Paarni (Lifetime Oy / DWS IQ), Shufti Pro Team
**Meeting Type:** Technical Architecture Call
**Location:** Virtual (Shufti to send calendar invite with link)

---

## Pre-Meeting Context

Lifetime Oy is building DWS IQ 6 — an enterprise AI platform that orchestrates 16 industrial compliance models across EU-regulated industries. We are extending KYC/AML to autonomous AI agents through a framework called **KYA (Know Your Agent)**.

We are opening the platform to **BYO (Bring Your Own) agents** and need Shufti to power the identity layer.

---

## Agenda

### 1. Introductions (3 min)

- Risto Paarni — Founder, Lifetime Oy (DWS IQ platform)
- Shufti team introductions

### 2. DWS IQ Platform Overview (5 min)

- 16 industrial models in isolated sandboxes (Control Room)
- BYO agent ecosystem — third-party agents entering DWS environment
- The 2026 problem: execution-layer trust beyond onboarding KYC

### 3. KYA Framework — Know Your Agent (7 min)

- **Layer 1 — Human Identity:** Shufti IDV at onboarding (KYC/AML/document/face)
- **Layer 2 — Agent Provenance:** Where did the BYO agent come from?
- **Layer 3 — Agent Capability:** What tools/APIs does the agent request?
- **Layer 4 — Runtime Behavior:** What is the agent actually doing in the sandbox?
- **Layer 5 — Continuous Risk:** Shufti webhooks trigger dynamic sandbox permission changes

### 4. Integration Architecture Discussion (8 min)

- **Shufti API requirements:**
  - Real-time IDV (< 30s response)
  - Risk score format (0–100 continuous vs. bucketed, sub-scores)
  - Webhook payload schema and delivery guarantees
  - KYB (Know Your Business) for BYO agent org verification

- **DWS side (already built):**
  - Webhook handler with HMAC-SHA256 validation
  - KYA policy engine (Shanghai Model)
  - Agent Trust Score calculator
  - Sandbox permission gating (Full / Restricted / Suspended / Frozen)

### 5. PoC Scope & Deliverables (5 min)

| # | Deliverable | Owner |
|---|-------------|-------|
| 1 | Shufti API sandbox/test credentials | Shufti |
| 2 | Webhook documentation (payload, retry policy) | Shufti |
| 3 | KYB API access for org verification | Shufti |
| 4 | Shufti API adapter integration | DWS |
| 5 | End-to-end demo scenario | Joint |

**Demo scenario:** User onboards via Shufti IDV → deploys BYO agent → Shufti flags AML hit → sandbox restricts egress in real-time.

### 6. Commercial & Next Steps (2 min)

- Pricing model discussion (per-verification vs. monthly, volume)
- PoC timeline (Q1-Q2 2026 target)
- Technical contact exchange
- Follow-up meeting schedule

---

## Key Questions for Shufti

### Critical (make-or-break for PoC)

1. **Risk score format** — Is the score pass/fail, categorical, or continuous 0–100? Can we get sub-scores for AML, fraud, and document separately? (DWS needs numeric input for the KYA trust formula)
2. **Ongoing AML monitoring** — Do you offer continuous post-onboarding monitoring (user added to sanctions list months later), or only point-in-time checks at verification?
3. **EU data residency** — Can all PII processing be guaranteed EU-only (GDPR/NIS2)? Which data centers?

### Important (affects architecture)

4. **Webhook reliability** — What are retry policies and guaranteed delivery SLAs? Dead letter queue? P99 delivery latency for high-concurrency notifications?
5. **Latency** — P99 response time for automated document verification vs. manual fallback review?
6. **Sandbox/test environment** — Do you provide a mock environment that simulates specific failure states (expired ID, high-risk flag, AML hit)?

### Nice to have (PoC scoping)

7. **KYB depth** — How do you handle deep-tier beneficial ownership verification for corporate entities deploying agents?
8. **Pricing for PoC** — Sandbox API access cost? Per-verification pricing at low volume (<100/month)?

---

## Realistic Expectations (Internal — Do Not Share)

### What Shufti can definitely do
- Onboarding IDV (document + face + liveness) — their core product, REST API, well-documented
- KYB org verification — business registry checks, 1,700+ watchlists
- Webhook on verification status change (accepted/declined/review)
- On-premise deployment option for EU data residency

### What needs confirmation on the call
- **Ongoing AML monitoring** — most IDV vendors do point-in-time, not continuous. This is the make-or-break for L5.
- **Risk score granularity** — may be pass/fail, not 0-100 numeric. If so, DWS needs to derive its own score.
- **Webhook latency** — "5 second sandbox restriction" depends on Shufti's delivery speed, likely async.

### What's probably not realistic
- Shufti co-marketing "Zero-Trust Agent Workspace" — they process millions of verifications, a PoC partner won't drive their roadmap
- Real-time (<5s) webhook SLA with contractual guarantee
- Volume pricing negotiation — premature without actual volume

### Fallback plan
If ongoing monitoring isn't available: (a) DWS cron triggers periodic Shufti re-verification, or (b) add Sumsub later for transaction monitoring while keeping Shufti for onboarding.

### Budget estimate
- Setup: ~$1,250-$2,500 one-time
- Per verification: $0.20-$0.75
- PoC cost: minimal with sandbox credentials

## Materials to Share

- KYA Technical Requirements document (attached or post-call)
- Integration architecture diagram
- DWS IQ platform overview presentation

---

**Contact:** Risto Paarni, risto@onelifetime.world
**Platform:** dws10.com
**Company:** Lifetime Oy, Helsinki, Finland
