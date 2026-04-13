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

### IDV Competitive Landscape (Internal — Walk-Away Alternatives)

If Shufti doesn't offer partnership terms, these are real alternatives — ranked by strategic fit:

| Provider | HQ | Strengths for DWS | Weaknesses | Partnership Likelihood |
|----------|----|--------------------|------------|----------------------|
| **Veriff** | Estonia | Nordic company, developer-friendly API, fellow Nordic operator — easiest to negotiate with. Strong biometrics. | Smaller enterprise presence than Entrust/Jumio | **HIGH** — Nordic solidarity, hungry for enterprise use cases |
| **Signicat** | Norway (Finnish roots) | **TOP PICK if Shufti fails.** eID-native, deep Finnish market presence, already embedded in regulated industries including healthcare. Will understand KELA context without explanation. Nordic HQ in Oslo but Finnish operations. | Less known outside Nordics, smaller global coverage | **HIGHEST** — perfect regulatory fit, Finnish market knowledge, would value AI agent angle |
| **iDenfy** | Lithuania | EU-first, competitive pricing, NFC + biometrics. Smaller = hungrier for partnerships. | Less enterprise credibility, smaller team | **HIGH** — would likely offer best commercial terms |
| **Onfido (Entrust)** | UK/US | Strong EU presence, GDPR-native, excellent API docs. Entrust acquisition = enterprise-grade backing. | Post-acquisition bureaucracy, harder to get partnership terms from a large corp | **MEDIUM** — good tech, but Entrust sales cycle is slow |
| **Nets (Nexi)** | Denmark/Finland | Danish-Finnish, runs Nordic payment infrastructure. Identity layer built on actual financial transaction data. Strong in Nordic financial identity. | Primarily payments company, IDV is secondary. May not have deep AML screening. | **HIGH** — Nordic roots, financial infrastructure credibility, would value AI governance angle |
| **Jumio** | US | Strongest enterprise credibility, comprehensive compliance stack. | Most expensive, US-headquartered (data residency complexity), enterprise sales cycle | **LOW** — would treat DWS as a customer, not a partner |

**Telia ID — Existing Supplier (ACE CARD)**

Telia is already a DWS/Lifetime supplier. This changes the entire negotiation dynamic:
- **Finnish carrier-backed identity** — Mobiilivarmenne, Finnish Trust Network, BankID integration
- **Strongest trust signal for regulated Finnish industries** — healthcare, KELA-adjacent, municipal services
- **Existing commercial relationship** — no new vendor onboarding, no new DPA, no new procurement cycle
- **Consulting credibility** — Risto already has a relationship, not cold-calling
- Telia may lack deep AML/sanctions screening, but for L1 identity (Finnish customers) it's arguably stronger than any foreign IDV vendor
- **Hybrid model:** Telia for L1 identity (Finnish/Nordic customers) + specialist for L5 continuous AML monitoring

**If Shufti doesn't partner:** The path is **Signicat** (eID + regulated industries, understands Finnish healthcare/KELA natively) + **Telia ID** for carrier-backed identity. All Nordic, no foreign data transfers, strongest possible compliance posture. Signicat is the #1 alternative — they won't need the KELA context explained to them.

**Strategy:** Don't mention Telia or any competitors on the Shufti call. But internally, know that walking away costs DWS almost nothing — you already have an identity provider. Shufti is an upgrade opportunity, not a dependency.

**Key insight:** The integration is ~200 lines of TypeScript — switching providers is a 2-day refactor, not a 2-month project. And for Finnish customers, Telia ID may actually be the better L1 choice regardless of what Shufti offers.

### Budget & monetization strategy

**KEY INSIGHT: Shufti may want market entry into EU/Nordics. If so, THEY may want to pay US.**

Shufti Pro is Pakistan-headquartered. Breaking into EU-regulated industries (healthcare, construction, energy) is hard without a local partner. DWS gives them:
- A live EU platform with 20 industry verticals
- A Finnish company with EU data residency infrastructure
- An integration already built (they just plug in)
- Case study in AI governance — a brand-new market category

**Commercial models — ranked by value to DWS:**

| Model | Who Pays | DWS Position |
|-------|---------|-------------|
| **E. Shufti pays DWS integration/channel fee** | Shufti pays DWS | Best case — they pay for EU market access through DWS channel |
| **C. DWS resells Shufti at markup** | End customers pay DWS | Strong — DWS owns customer relationship, pays Shufti wholesale |
| **B. Revenue share** | End customers pay, split | Good — partnership model, shared risk |
| **D. Free PoC, terms later** | Nobody (PoC phase) | Safe — defer money, build leverage |
| **A. DWS pays Shufti per verification** | DWS pays them | Worst case — never agree to this |

- **PoC phase:** Should cost DWS nothing. Free sandbox API access, both sides invest engineering time.
- **Shufti retail pricing:** $0.20-$0.75/verification + $1,250-$2,500 setup. DO NOT agree to this.
- **Timing:** Don't discuss money in detail on March 17. Plant the seed: "We're interested in a channel partnership — what does Shufti's partner program look like?" Let them pitch you.

### Walk-in Strategy (CRITICAL)

**The ask (pick one, in priority order):**
1. **Market entry fee** — Shufti pays DWS a one-time or annual fee for being the named IDV layer in DWS enterprise deals across the Nordics. DWS is Shufti's Nordic channel.
2. **Revenue share on every enterprise client** — DWS brings Shufti into Nordic enterprise deals, Shufti pays DWS a percentage of verification revenue from those clients. Recurring, scales with success.
3. **Co-sell agreement** — Both companies sell together into enterprise accounts, shared pipeline, rev share on verification volume.

**The walk-away line:** If Shufti pushes standard retail pricing ($0.20-$0.75/verification + setup fee), that's the moment to walk. Say: "We appreciate the conversation, but at standard pricing we'll evaluate other IDV providers who want the first-mover position in agent identity." Alternatives: Sumsub (stronger ongoing monitoring), Onfido/Entrust (better biometrics), Veriff (EU-native).

**Why this works:** Shufti gets nothing if DWS picks a competitor. Shufti gets a new market + enterprise pipeline if they partner. The standard pricing model treats DWS as a customer — the partnership model treats DWS as a channel.

**What NOT to say on the call:**
- Don't mention specific competitors by name (desperate)
- Don't agree to "let's start with standard pricing and revisit later" (you'll never revisit)
- Don't discuss money in detail — plant the seed ("co-sell / rev share"), get the PoC credentials, negotiate commercial terms after the demo works

**Script (updated — channel partner framing):** "We've already built the integration — webhook handler, policy engine, trust score calculator. What we need is API access for a PoC. On the commercial side, we see this as a channel partnership: DWS brings Shufti into 20 EU-regulated industries through a market category that doesn't exist yet — AI agent identity. We'd like to understand what Shufti's partner program looks like for a channel like this."

**Why this script works:** You're asking THEM to pitch YOU. You're not asking for a discount — you're asking what their partner program offers. This puts Shufti in the position of selling their partnership terms to you, not the other way around.

## Materials to Share

- **KYA Technical Whitepaper** (`2026-03-17-shufti-kya-whitepaper.md`) — send to Shufti engineers post-call so they can review architecture, API contracts, and webhook specs async. This replaces the need for you to explain technical details on the call.
- KYA Technical Requirements document (attached or post-call)
- DWS IQ platform overview presentation (HTML slides)

---

**Contact:** Risto Paarni, risto@onelifetime.world
**Platform:** dws10.com
**Company:** Lifetime Oy, Helsinki, Finland
