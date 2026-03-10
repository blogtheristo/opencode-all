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

1. **Webhook reliability** — Delivery guarantees? Retry policy? Dead letter queue?
2. **Risk score granularity** — Continuous 0–100? Sub-scores for AML, fraud, document separately?
3. **KYB capability** — Can Shufti verify the organization behind a BYO agent?
4. **Latency under load** — Real-time IDV response time? Webhook delivery latency?
5. **Sandbox/test environment** — API sandbox with mock verification flows for PoC?
6. **EU data residency** — Can Shufti process data in EU-only (Finland/Germany)?

---

## Materials to Share

- KYA Technical Requirements document (attached or post-call)
- Integration architecture diagram
- DWS IQ platform overview presentation

---

**Contact:** Risto Paarni, risto@onelifetime.world
**Platform:** dws10.com
**Company:** Lifetime Oy, Helsinki, Finland
