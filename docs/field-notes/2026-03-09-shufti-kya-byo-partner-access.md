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

## The Outreach Email (Sent)

**To:** Aitsam (Shufti Pro)
**Subject:** Partnership Proposal: Integrating Shufti IDV with DWS10's Open Sandbox

Key points communicated:
- We need execution-layer trust, not just onboarding KYC
- KYA framework positions Shufti beyond standard IDV
- Concrete PoC: Shufti risk-score feeds DWS IQ engine, sandbox auto-restricts on risk change
- First "Zero-Trust" workspace for autonomous agents
- Architecture call requested (15 min, next week)

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy), Global (Shufti Pro)
- **Sector:** Technology > Identity Verification > Agent Trust
- **Entities:** Shufti Pro, Lifetime Oy, DWS IQ 6, KYA Framework, BYO Agent Policy
- **Temporal Context:** 2026-Q1, Pre-pilot
- **Confidence:** Medium (proposal sent, awaiting response)

## Next Steps

- [ ] Await Shufti response to partnership proposal
- [ ] Schedule 15-min architecture call with Shufti technical lead
- [ ] Draft Shufti API adapter (`src/integrations/idv/shufti.ts`) — interface only, pending API docs
- [ ] Add KYA framework to DWS Security Standard (Section 18)
- [ ] Define BYO agent registration API schema
- [ ] Update AGENTS.md with KYA/BYO agent lifecycle

---

**Source:** Partnership email to Aitsam (Shufti Pro), 2026-03-09
