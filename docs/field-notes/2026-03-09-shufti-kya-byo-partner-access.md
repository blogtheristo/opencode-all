# Shufti IDV Partnership — Know Your Agent (KYA) & Bring Your Own (BYO) Framework

**Date:** 2026-03-09
**Author:** Risto Paarni
**Type:** Partnership Proposal / Partner Access Architecture
**Context:** Shufti Pro IDV, DWS IQ 6 Open Sandbox, Execution-Layer Trust

---

## Summary

Shufti Pro (Aitsam) reached out with a standard IDV/KYC partnership proposal. Instead of a seat-license deal, we proposed a technical pilot that connects Shufti's real-time identity risk signals to our DWS IQ sandbox permission engine. This field note defines two new DWS frameworks — **Know Your Agent (KYA)** and **Bring Your Own (BYO)** — and documents the proposed integration architecture.

## The 2026 Problem: Execution-Layer Trust

Traditional KYC/AML verifies the human at the door. In DWS IQ's agent-native architecture, the human is just the entry point. The real risk surface is:

1. **What agent does the user deploy?** (BYO agent — unknown provenance, unknown behavior)
2. **What does that agent do once inside the sandbox?** (egress, filesystem access, tool calls)
3. **Does the user's risk profile change after the agent is already running?** (dynamic AML/fraud signals)

No existing IDV vendor addresses this. Shufti's hybrid model (AI + human review) with real-time risk scoring is the closest fit — if we bridge it to our sandbox runtime.

## Know Your Agent (KYA) Framework

KYA extends KYC/AML to autonomous agents operating within DWS IQ workspaces.

| KYA Layer | What It Verifies | Source |
|-----------|-----------------|--------|
| **L1 — Human Identity** | Real person behind the account (KYC/AML/IDV) | Shufti Pro API |
| **L2 — Agent Provenance** | Where did the agent come from? (registry, custom build, fork) | DWS Agent Registry + MCP `tools/list` |
| **L3 — Agent Capability** | What tools/APIs does the agent request access to? | MCP tool manifest, sandbox policy engine |
| **L4 — Runtime Behavior** | What is the agent actually doing? (egress, file I/O, token usage) | Sandbox telemetry (Stage 1–3) |
| **L5 — Continuous Risk** | Has the user's or agent's risk profile changed? | Shufti webhooks + DWS event bus |

### KYA Trust Score

```
KYA_TRUST = f(shufti_risk_score, agent_provenance, capability_scope, runtime_behavior)
```

- **KYA_TRUST >= 80**: Full sandbox permissions (egress, filesystem, all MCP tools)
- **KYA_TRUST 50–79**: Restricted sandbox (no egress, read-only filesystem, curated MCP tools)
- **KYA_TRUST < 50**: Sandbox suspended, human review required
- **KYA_TRUST = 0**: Account frozen, agent terminated immediately

## Bring Your Own (BYO) Agent Policy

BYO defines how external agents enter the DWS IQ ecosystem.

| BYO Stage | Gate | Enforcement |
|-----------|------|-------------|
| **Registration** | Agent manifest submitted (name, version, tool requirements, source) | DWS Agent Registry API |
| **Identity Binding** | Agent bound to a verified human identity (Shufti L1 pass required) | KYA L1 gate |
| **Capability Review** | Requested MCP tools reviewed against org policy | MCP Tool Approval (Security Standard Section 17) |
| **Sandbox Entry** | Agent placed in isolated sandbox (Stage 1–3 based on tenant tier) | Sandbox Isolation Architecture (Security Standard Section 14) |
| **Runtime Monitoring** | Continuous telemetry: egress attempts, file writes, token consumption | KYA L4 telemetry |
| **Dynamic Restriction** | If Shufti risk score changes, sandbox permissions adjust in real-time | KYA L5 webhook trigger |

## Proposed Shufti Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│  User Onboarding                                    │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐ │
│  │ DWS Auth │───>│ Shufti IDV   │───>│ KYA L1    │ │
│  │ (Supabase)│   │ (API call)   │    │ Score Set │ │
│  └──────────┘    └──────────────┘    └───────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│  Agent Deployment (BYO)                             │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐ │
│  │ Agent    │───>│ KYA L2-L3    │───>│ Sandbox   │ │
│  │ Manifest │    │ Review       │    │ Policy    │ │
│  └──────────┘    └──────────────┘    └───────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│  Runtime (Continuous)                               │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐ │
│  │ Shufti   │───>│ DWS Event    │───>│ Sandbox   │ │
│  │ Webhooks │    │ Bus          │    │ Restrict/ │ │
│  │ (L5)     │    │              │    │ Expand    │ │
│  └──────────┘    └──────────────┘    └───────────┘ │
└─────────────────────────────────────────────────────┘
```

### Proof of Concept Scope

**Integration point:** Shufti REST API --> DWS IQ Engine (event-driven)

| PoC Deliverable | Description |
|-----------------|-------------|
| **Shufti API adapter** | `src/integrations/idv/shufti.ts` — wraps Shufti verification + risk score endpoints |
| **KYA score engine** | `src/kya/score.ts` — computes KYA_TRUST from Shufti signals + agent metadata |
| **Sandbox policy trigger** | Webhook listener that updates sandbox permissions when Shufti risk profile changes |
| **Demo scenario** | User onboards via Shufti IDV -> deploys BYO agent -> Shufti flags AML hit -> sandbox restricts egress in real-time |

### Shufti API Endpoints (Expected)

| Endpoint | Purpose | DWS Usage |
|----------|---------|-----------|
| `/api/verify` | Real-time identity verification | KYA L1 onboarding |
| `/api/status` | Check verification status | Periodic re-verification |
| `/api/risk` | Fraud score / AML screening | KYA L5 continuous risk |
| Webhook callback | Async risk profile changes | Dynamic sandbox permission trigger |

## Partnership Terms (Proposed)

- **Model:** Technical PoC pilot, not a seat-license deal
- **Timeline:** Q1 2026 launch target
- **Ask from Shufti:** API access for PoC, technical lead contact for architecture review
- **DWS provides:** Open Sandbox runtime, KYA framework, integration code
- **Value prop for Shufti:** First-mover in "Zero-Trust Agent Workspace" category — identity layer for autonomous AI agents, not just humans
- **Next step:** 15-minute architecture call (Risto + Shufti technical lead)

## Strategic Significance

This is the first integration that bridges **human identity verification** with **autonomous agent runtime control**. No competing platform currently offers:

1. Real-time IDV risk signals controlling sandbox permissions
2. A formal "Know Your Agent" framework extending KYC to AI agents
3. Dynamic permission adjustment based on continuous identity monitoring

If the PoC succeeds, Shufti becomes the identity layer for all BYO agents entering the DWS IQ ecosystem — a new market category.

## Product Positioning: KYA is a Feature, Not a Product

**KYA (Know Your Agent) is a core feature of DWS IQ** — not a standalone product.

- **DWS IQ** = the brain/orchestrator platform (the product customers buy)
- **KYA** = the identity & intent verification protocol inside DWS IQ that gates agent access to industrial models
- **Shufti** = the identity signal provider that powers KYA Layer 1 (Human Identity) and Layer 5 (Continuous Risk)

This positioning is deliberate: telling a partner "we have a working product and need a plug for one feature" is far more attractive than "help us build a new product." Shufti slots into an existing architecture.

## The Control Room: 16 Industrial Models in Sandboxes

The DWS10 Control Room manages **16 industrial-grade models** — one per EU-regulated industry under the Fit for 55 package (see `16-INDUSTRIES.md`). Each model runs in an isolated sandbox, orchestrated by DWS IQ agents.

**Sandbox Tiers (per `src/cloudflare/tenant-sandbox.ts`):**

| Tier | Tokens/Req | Req/Min | Concurrent | Storage |
|------|-----------|---------|------------|---------|
| Sandbox | 4K | 20 | 2 | 100 MB |
| Professional | 16K | 100 | 10 | 1 GB |
| Enterprise | 100K | 1,000 | 50 | 10 GB |

**OpenSandbox Stages (per `DWS_SECURITY_STANDARD.md` Section 14):**

| Stage | Runtime | Isolation |
|-------|---------|-----------|
| 1 | SDK native | No network, read-only FS |
| 1.5 | Acer Veriton GN100 (Helsinki) | Ephemeral Docker, air-gapped EU |
| 2 | Cloud Run ephemeral | Sandboxed by default |
| 3 | Production | Monitored, broader permissions |

**BYO Agent Flow:** Customer brings a third-party agent (Clawbot, Microsoft CoWork, Tencent Workbuddy) into a new hardened sandbox. KYA gates every step — identity anchor, capability review, runtime monitoring, dynamic restriction.

## The Outreach Email — Round 1 (Sent)

**To:** Aitsam (Shufti Pro)
**Subject:** Partnership Proposal: Integrating Shufti IDV with DWS10's Open Sandbox

Key points communicated:
- We need execution-layer trust, not just onboarding KYC
- KYA framework positions Shufti beyond standard IDV
- Concrete PoC: Shufti risk-score feeds DWS IQ engine, sandbox auto-restricts on risk change
- First "Zero-Trust" workspace for autonomous agents
- Architecture call requested (15 min, next week)

## The Control Room Partnership Pitch — Round 2 (Draft)

**To:** Aitsam (Shufti Pro)
**Subject:** RE: DWS10 Control Room — 16 Industrial Models + BYO Agent Identity Layer

> Hi Aitsam,
>
> Following up on my previous note—to give you a sense of the scale we're discussing, our DWS10 Control Room currently manages 16 industrial-grade models running in isolated sandboxes, orchestrated by our own DWS IQ agents.
>
> We are now opening the ecosystem to **BYO (Bring Your Own) Processes**. Our customers can now drop third-party agents—like Clawbot, Microsoft CoWork, or Tencent Workbuddy—directly into a new, hardened sandbox within our environment.
>
> **Where Shufti comes in:**
>
> This is where our **KYA (Know Your Agent)** feature becomes critical. We don't just need to verify the human who initiates the process; we need to verify the "Agent Identity" of the third-party tool they are bringing in.
>
> I'm proposing a pilot where we use Shufti's identity signals to anchor these third-party agents to a verified organization or individual. Specifically:
>
> - **Identity Anchor:** A user brings a Tencent Workbuddy agent into a DWS10 sandbox.
> - **Shufti Trigger:** Shufti verifies the user's credentials and risk level.
> - **Dynamic Gating:** DWS IQ uses that Shufti score to decide exactly how much "reach" that Workbuddy agent has into our industrial models.
>
> We are building the first environment where industrial-scale AI and third-party agents can co-exist without compromising the core infrastructure.
>
> I'd rather talk architecture than sit through a product demo—do you or your technical lead have 15 minutes next week to discuss how Shufti can power the identity layer of this Control Room?
>
> Best regards,
> Risto
> Founder | dws10.com

### Strategy Notes

| Tactic | Purpose |
|--------|---------|
| **Big Tech name drop** (Microsoft, Tencent, Clawbot) | Signals enterprise-level platform; creates FOMO |
| **"Control Room" imagery** | Shifts perception from "website" to "industrial command center" |
| **KYA as feature, not product** | Shows working platform needing a plug, not a co-build ask |
| **"Architecture not demo"** | Positions call as peer-to-peer technical discussion |

## Pre-Call Email to Aitsam — Round 3 (Draft, Ready to Send)

**To:** Aitsam (Shufti Pro)
**Subject:** Re: Shufti / DWS10 — Technical Partnership

> Hi Aitsam,
>
> Thanks for the follow-up.
>
> I've reviewed Shufti's hybrid model. While it's a strong fit for onboarding, we are solving a more specific problem for our Q1 launch: execution-layer trust.
>
> We are currently scaling the DWS10 Control Room, where users deploy heterogeneous agents (Microsoft, Tencent, Clawbot) into our DWS IQ environment. We've moved away from standard "Pass/Fail" KYC in favor of a protocol we call KYA (Know Your Agent).
>
> I'd like to discuss a technical pilot where Shufti's real-time risk signals act as the dynamic trigger for our Firecracker MicroVM sandboxes. If a user's risk profile changes, our hypervisor automatically restricts the agent's intent in real-time.
>
> I'd rather talk architecture than sit through a product demo — does your technical lead have 15 minutes next week to discuss bridging Shufti's signals with our KYA layer?
>
> Best regards,
> Risto
> Founder | dws10.com
>
> P.S. I just published a field note on our KYA architecture that might give your team some context on the integration points we're looking for: https://onelifetime.world/posts/kya-standard-v1.html

### Why This 1-2 Punch Works

| Asset | Purpose |
|-------|---------|
| **Journal Post** (P.S. link) | Proves "Zero-Blast Radius" architecture. Aitsam's tech lead sees "Firecracker MicroVM" and "Zero Shared Kernel" and knows this is enterprise-grade. |
| **Email** | Ignores his sales pitch and gives him a Technical Requirement. You aren't a "lead" to be managed; you are an Infrastructure Architect to be supported. |

### Pre-Send Checklist

- [ ] Verify link is live: https://onelifetime.world/posts/kya-standard-v1.html
- [ ] Click link from mobile to confirm rendering
- [ ] Confirm Cloudflare Pages deployment is current (landing-pages/onelifetime-world/posts/kya-standard-v1.html synced)
- [ ] Send from: risto@onelifetime.world

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy), Global (Shufti Pro)
- **Sector:** Technology > Identity Verification > Agent Trust
- **Entities:** Shufti Pro, Lifetime Oy, DWS IQ 6, KYA Framework, BYO Agent Policy
- **Temporal Context:** 2026-Q1, Pre-pilot
- **Confidence:** Medium (proposal sent, awaiting response)

## Next Steps

- [ ] Verify LSJ link is live and rendering on mobile
- [ ] Send Round 3 pre-call email to Aitsam (with P.S. link)
- [ ] Await Shufti response
- [ ] Schedule 15-min architecture call with Shufti technical lead
- [ ] Send Technical Requirements attachment (see `docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md`)
- [ ] Draft Shufti API adapter (`src/integrations/idv/shufti.ts`) — interface only, pending API docs
- [x] Add KYA framework to DWS Security Standard (Section 18) — done v1.9
- [x] Define KYA as DWS IQ feature (not standalone product)
- [x] Publish KYA Field Note to Lifetime Scope Journal — `onelifetime.world/posts/kya-standard-v1.html`
- [x] Sync to `landing-pages/onelifetime-world/posts/kya-standard-v1.html`
- [ ] Define BYO agent registration API schema
- [ ] Update AGENTS.md with KYA/BYO agent lifecycle
- [ ] Add KYA Standard to `Legal/KYA_STANDARD_v1.md` — done

---

**Source:** Partnership email to Aitsam (Shufti Pro), 2026-03-09 | Control Room pitch draft, 2026-03-09 | LSJ Field Note published, 2026-03-09
