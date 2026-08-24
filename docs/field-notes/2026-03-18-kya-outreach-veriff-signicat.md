# KYA Certification — Outreach Letters

---

# VERSION AND AGENT HISTORY

Version: 1.0
Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/shufti-meeting-prep-IHXUi | Date: 18.03.2026 | Changes: Initial creation — outreach letters for Veriff and Signicat KYA Certification

Document Status:
  - Created: 18.03.2026
  - Last Modified: 18.03.2026
  - Language: English
  - Publication Status: INTERNAL ONLY

---

## Letter 1: Veriff

**To:** Partnerships / R.E.V. Partner Program Team, Veriff
**From:** Risto Paarni, Founder & Architect, Lifetime Oy
**Subject:** KYA Certification — AI Agent Identity Layer for EU-Regulated Industries

---

Dear Veriff Partnerships Team,

I am Risto Paarni, founder of Lifetime Oy and architect of the DWS IQ 6 platform — a system that trains and runs autonomous AI agent swarms across 20 EU-regulated industries (steel, cement, healthcare, construction, energy, chemicals, logistics, and more).

The EU AI Act (2026) mandates identity traceability for high-risk AI systems. When a verified human deploys an autonomous AI agent — accessing databases, calling APIs, executing transactions — the identity chain must extend from the human through the agent, continuously. Traditional IDV stops at human onboarding. We need it to go further.

### What We've Built

**KYA (Know Your Agent)** is our standard that extends KYC/AML to autonomous AI agents. It has five identity layers:

- **L1: Human Identity (KYC/AML/IDV)** — Verify the person deploying the agent ← IDV Partner
- **L2: Agent Provenance (KYB)** — Who published this agent? Org verification ← IDV Partner
- **L3: Agent Capability Manifest** — Signed declaration of permitted tools/paths ← DWS internal
- **L4: Runtime Behavior Scoring** — Agent Trust Score from sandbox telemetry ← DWS internal
- **L5: Continuous Risk Monitoring** — Ongoing AML/sanctions webhooks ← IDV Partner

The IDV partner powers 3 of 5 layers. The policy engine, trust score calculator, webhook handler, and sandbox permission gating are already built. We need a partner to supply the identity signals.

### Why Veriff

Veriff's strengths align directly with KYA requirements:

1. **Single-flow onboarding IDV** — Document + face + liveness + AML in one API call (L1)
2. **Vespia acquisition (Feb 2026)** — KYB capability for organization verification (L2), enabling BYO agent publisher screening
3. **EU presence and GDPR compliance** — Critical for our EU-only data residency architecture (Supabase europe-north1, Google Cloud Run Finland)
4. **Numeric risk scoring** — Enables per-industry weighting in our Agent Trust Score formula
5. **R.E.V. Partner Program** — Structured partnership framework that fits our KYA Certification model

### What We're Proposing

**KYA Certification** — a commercial relationship where Veriff becomes a certified identity layer in DWS enterprise deployments across 20 industry verticals:

| What | Detail |
|------|--------|
| **Integration effort** | ~200 lines TypeScript. DWS engineering builds and maintains the adapter |
| **PoC timeline** | 4 weeks to working demo |
| **Revenue model** | Wholesale resale (DWS buys verifications at volume rate, resells as "KYA Verification") |
| **Recurring volume** | Onboarding + agent deployment + continuous monitoring per customer |
| **Market category** | AI agent identity — no IDV vendor serves this today |

With Vespia's KYB and your existing IDV, Veriff could certify at **Tier 2 (KYA Enterprise)** immediately, with a clear path to **Tier 3 (KYA Full Stack)** through L5 continuous monitoring co-development.

### Next Step

I'd welcome a 30-minute call to walk through the technical integration and PoC scope. The whitepaper with full architecture diagrams, API requirements, and commercial terms is ready to share.

Best regards,

Risto Paarni
Founder & Architect, Lifetime Oy
risto@onelifetime.world
Helsinki, Finland
dws10.com

---

## Letter 2: Signicat

**To:** Joakim Harging, Chief Enterprise Nordics & UK, Signicat
**From:** Risto Paarni, Founder & Architect, Lifetime Oy
**Subject:** KYA Certification — AI Agent Identity Layer for EU-Regulated Industries

---

Dear Joakim,

I am Risto Paarni, founder of Lifetime Oy and architect of the DWS IQ 6 platform — a system that trains and runs autonomous AI agent swarms across 20 EU-regulated industries (steel, cement, healthcare, construction, energy, chemicals, logistics, and more).

As Signicat leads verified digital identity in Europe — trusted by over 13,000 companies including Santander, Rabobank, and Volvo — I believe you are uniquely positioned for a new identity category that the EU AI Act is creating.

### The Problem

The EU AI Act (2026) mandates identity traceability for high-risk AI systems. When a verified human deploys an autonomous AI agent — accessing databases, calling APIs, executing transactions — the identity chain must extend from the human through the agent, continuously. No IDV vendor serves this market today.

### What We've Built

**KYA (Know Your Agent)** is our standard that extends KYC/AML to autonomous AI agents. It has five identity layers, and the IDV partner powers 3 of 5:

- **L1: Human Identity (KYC/AML/IDV)** — Verify the person deploying the agent
- **L2: Agent Provenance (KYB)** — Who published this agent? Org verification
- **L5: Continuous Risk Monitoring** — Ongoing AML/sanctions webhooks

The DWS policy engine, trust score calculator, webhook handler, and sandbox permission gating are already implemented and awaiting IDV provider connection.

### Why Signicat

Signicat's position is exceptionally strong for KYA:

1. **Pan-European e-ID coverage** — Finnish Trust Network (FTN), BankID (NO/SE), NemID/MitID (DK), and more. Our enterprise customers are Nordic-first.
2. **eIDAS-qualified trust services** — Signicat is already a qualified trust service provider. KYA extends this to AI agents.
3. **KYB through acquisitions** — Connectis, Sphonic, SmartWorks give you organization verification depth (L2)
4. **MobileID and VideoID** — Advanced biometric capabilities for high-assurance L1 verification
5. **Nordic Capital backing** — Growth-oriented ownership aligned with category-creating partnerships
6. **Nordic enterprise DNA** — Your team (Filip Haglund for Northern Europe, Joakim Harging for Enterprise) understands the regulated Nordic enterprise market we serve

### What We're Proposing

**KYA Certification** — Signicat becomes a certified identity layer in DWS enterprise deployments:

| What | Detail |
|------|--------|
| **Integration effort** | ~200 lines TypeScript. DWS builds and maintains the adapter |
| **PoC timeline** | 4 weeks to working demo |
| **Revenue model** | Wholesale resale or revenue share (given Signicat's scale, both models work) |
| **Market** | 20 EU-regulated industry verticals × enterprise customers |
| **Competitive advantage** | First IDV provider to certify at Tier 3 owns the AI agent identity category |

With your existing e-ID/IDV, KYB acquisitions, and potential for continuous monitoring through Sphonic's fraud intelligence, Signicat could certify at **Tier 2 (KYA Enterprise)** and pursue **Tier 3 (KYA Full Stack)** — becoming the primary identity partner for AI agent governance in regulated European industries.

### Next Step

I'd welcome a 30-minute call to discuss the technical integration and PoC scope. The full KYA-IDV-CERT whitepaper with architecture diagrams, API requirements, and commercial terms is ready.

Best regards,

Risto Paarni
Founder & Architect, Lifetime Oy
risto@onelifetime.world
Helsinki, Finland
dws10.com
