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

### 6. Business Model & Next Steps (5 min)

**Framing:** DWS is not a typical Shufti customer buying verifications. DWS is a distribution channel bringing Shufti into a new market (AI agent identity) that no IDV vendor currently serves.

- **PoC phase:** Free sandbox API access, both sides invest engineering time
- **Post-PoC commercial model:**
  - Revenue share: DWS customers pay for verification as part of DWS IQ subscription, Shufti gets per-verification revenue share
  - OR: DWS resells Shufti as "KYA Verification" at markup, pays Shufti wholesale rate
  - NOT: DWS as a standard Shufti customer paying retail per-verification rates
- **What DWS brings to Shufti:**
  - New market category (agent identity — no competing IDV vendor is here)
  - Enterprise pipeline across 20 EU-regulated industries
  - Every DWS customer = recurring Shufti verification volume
  - Case study / co-marketing opportunity in AI governance space
- Technical contact exchange
- Follow-up meeting schedule

---

## Key Questions for Shufti

### Critical (make-or-break for PoC)

1. **Risk score format**
   - **What we know:** Shufti exposes a User Risk Assessment engine with customizable risk bands (low/medium/high/prohibited) plus decision + reason codes. Raw sub-scores (facial-match confidence, document OCR confidence, AML severity) are NOT in public docs — appears to be composite + configurable bands.
   - **Ask:** "Can the API response include granular component scores (PEP confidence, liveness score, document OCR confidence, AML sub-risks) or only the final band + reasons?" DWS needs numeric input for the KYA trust formula.

2. **Ongoing AML monitoring**
   - **What we know:** KYB enhanced tier mentions "continuous AML monitoring." Standard KYC appears point-in-time.
   - **Ask:** "Do you offer continuous post-onboarding monitoring where webhooks fire if a verified user is later added to sanctions/PEP lists? Or only at verification time?" This is make-or-break for KYA Layer 5.

3. **EU data residency**
   - **What we know:** Full GDPR compliance + QG-GDPR certification. Flexible deployment (SaaS, private cloud, on-premise). Explicitly marketed for data-residency requirements.
   - **Ask:** "Can we contractually guarantee all PII and verification events remain in EU/EEA-only infrastructure? What NIS2-specific controls or attestations do you provide?"

### Important (affects architecture)

4. **Webhook reliability**
   - **What we know:** Server-to-server callbacks with automatic retries. No public SLA on delivery guarantees or exact retry count/interval. Trial accounts limited to 20 req/min; production rate limits are account-specific.
   - **Ask:** "What are the exact retry count, back-off policy, and dead-letter handling? Do you offer configurable webhooks or queue guarantees for 1,000+ concurrent agent events?"

5. **Latency**
   - **What we know:** Marketing claims <5s for automated flows, <1s for eIDV routes. No official P99 numbers. Manual fallback available but slower.
   - **Ask:** "What are your current P95/P99 latencies for fully automated document + biometric verification, and how does the system route to manual review without breaking real-time agent gating?"

6. **Sandbox/test environment**
   - **What we know:** Full sandbox/test mode exists (standard for all accounts). Public docs don't explicitly list mock failure state simulation.
   - **Ask:** "Does the sandbox allow simulation of specific failure modes (liveness spoof, sanctions hit, synthetic identity, expired document) so we can test our 80+/50+/<50 gating logic end-to-end?"

### Nice to have (PoC scoping)

7. **KYB depth**
   - **What we know:** KYB covers 240+ jurisdictions with company registry, ownership structure, UBO identification, directors/shareholders. Enhanced tier adds deeper ownership chains.
   - **Ask:** "What is the maximum ownership-chain depth you reliably resolve automatically, and do you support ongoing delta monitoring + webhooks when UBO risk changes?"

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

### Budget & monetization strategy
- **PoC phase:** Should cost DWS nothing. Ask for free sandbox API access. Both sides invest engineering time.
- **Shufti retail pricing:** $0.20-$0.75/verification + $1,250-$2,500 setup. DO NOT agree to this — this is their standard customer pricing.
- **Target commercial model:** Revenue share or wholesale resale. DWS charges customers for "KYA Verification" as part of the platform subscription, pays Shufti a wholesale per-verification rate (target: $0.05-$0.15/verification).
- **Negotiation leverage:** DWS is a distribution channel into a market Shufti doesn't serve yet (AI agent identity). Every DWS customer = recurring Shufti volume. This is worth more than one customer paying retail.
- **Timing:** Don't discuss money on March 17. Focus on PoC. Commercial terms after demo works. You have more leverage with a working demo than with a slide deck.

### Walk-in Strategy (CRITICAL)

**The ask (pick one, in priority order):**
1. **Co-sell agreement with revenue share** — DWS names Shufti as the IDV layer in enterprise deals, both companies sell together, revenue shared on verification volume
2. **Discounted/free tier for KYA integrations** — In exchange for being named as the official IDV layer in DWS enterprise deals and marketing

**The walk-away line:** If Shufti pushes standard retail pricing ($0.20-$0.75/verification + setup fee), that's the moment to walk. Say: "We appreciate the conversation, but at standard pricing we'll evaluate other IDV providers who want the first-mover position in agent identity." Alternatives: Sumsub (stronger ongoing monitoring), Onfido/Entrust (better biometrics), Veriff (EU-native).

**Why this works:** Shufti gets nothing if DWS picks a competitor. Shufti gets a new market + enterprise pipeline if they partner. The standard pricing model treats DWS as a customer — the partnership model treats DWS as a channel.

**What NOT to say on the call:**
- Don't mention specific competitors by name (desperate)
- Don't agree to "let's start with standard pricing and revisit later" (you'll never revisit)
- Don't discuss money in detail — plant the seed ("co-sell / rev share"), get the PoC credentials, negotiate commercial terms after the demo works

**Script:** "We've already built the webhook handler, policy engine, and trust score calculator. What we need from you is API access for a PoC. The commercial question we'd like to explore after the PoC is a co-sell arrangement — we name Shufti as our IDV layer in enterprise deals across 20 EU industries, and we work out a revenue share model. Does that direction interest your team?"

## Materials to Share

- **KYA Technical Whitepaper** (`2026-03-17-shufti-kya-whitepaper.md`) — send to Shufti engineers post-call so they can review architecture, API contracts, and webhook specs async. This replaces the need for you to explain technical details on the call.
- KYA Technical Requirements document (attached or post-call)
- DWS IQ platform overview presentation (HTML slides)

---

**Contact:** Risto Paarni, risto@onelifetime.world
**Platform:** dws10.com
**Company:** Lifetime Oy, Helsinki, Finland
