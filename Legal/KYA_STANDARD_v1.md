# KYA Standard v1.5 — Know Your Agent: Agent Self-Optimization Governance for Enterprise Agent Swarms

---

# VERSION AND AGENT HISTORY

Version: 1.11

Sessions & Modifications:

- Version: 1.11 | Tool: Claude Code | Session: claude/kya-mandate-evidence-migration-mq7hnp | Date: 22.07.2026 | Changes: Added §14.7.1 Signing & Key Custody (v2.0 target design), per Boardy review — fixes the signing model v2.0 implements without yet implementing it: Ed25519 (EdDSA) hardware-backed keys (EUDI Wallet / EU eID convergence; compact for A2A + Article 12 payloads), JWS-enveloped VC first with Data-Integrity only on counterparty demand; `did:web` DNS-rooted issuer identity (no ledger, resolvable institutional anchoring for auditors); key custody by tier (Aegis Defence on-prem DGX Spark holds everything; Standard/Sovereign in UpCloud UKS HSM with admin-gated rotation; never a shared/foreign cloud KMS); one issuer key per tenant at v2.0, root-CA → per-agent delegation deferred to v2.1; tenant-controlled rotation with no DWS escrow (DWS holds only the root CA, counter-signing tenant DID-doc updates for cross-tenant verification continuity). Also: migration 079 APPLIED + verified live in production this session. Invariant restated: the private signing key never leaves the tenant's jurisdiction.
- Version: 1.10 | Tool: Claude Code | Session: claude/kya-mandate-evidence-migration-mq7hnp | Date: 22.07.2026 | Changes: Added §14.7 Verified-Done Attestation — the terminal link of the §14.4 trust chain (verified human → signed manifest → signed mandate → verified-done attestation): once a mandate executes, KYA issues a W3C Verifiable Credential attesting completion under governance, so a counterparty can check the outcome instead of trusting it blind. Deny-by-default and HIC binding carry through (no attestation for a denied/anonymous mandate); issuance is a `mandate.attest` event on the §14.5 evidence chain plus a stored credential; revocation is a status transition, not a deletion. Schema landed toward the v2.0 freeze: TS interfaces (`VerifiedDoneAttestation`/`AttestationInput`, `src/identity/types.ts`) + stub issuer `issueVerifiedDoneAttestation()` (`src/identity/ats-engine.ts`, 6 tests in `src/__tests__/verified-done-attestation.test.ts`) + storage (`supabase/migrations/079_kya_verified_done_attestation.sql` — `kya_verified_done_attestations` + `mandate.attest` event type extending the live 074 chain). Signing (Ed25519 / Data Integrity) deferred to the v2.0 key-management decision; credentials mint unsigned. Migration 074 (§14.5 evidence chain) confirmed live in production (dws6, eu-west-1) this session.
- Version: 1.9.1 | Tool: Claude Code | Session: claude/agent-infrastructure-ideas-1jtgms | Date: 06.07.2026 | Changes: (1) Schema-stability notes added to §14.2.1 and §14.3 per Boardy review — the JSON blocks are illustrative until KYA v2.0; buyer materials quote policy semantics, not field names; the executable Zod validator is the normative shape. (2) §14.2 enforcement point is now REAL CODE: `evaluateMandateGate()` + `tenantGatingProfileSchema` implemented in `src/identity/ats-engine.ts` (deny-by-default, HIC binding required, immovable floors, tighten-only tenant profiles, ceiling/scope violations flagged for §9.2 enforcement), 21 passing tests in `src/__tests__/mandate-gate.test.ts`. Patch version (not 2.0): v2.0 is reserved for the schema freeze after the Supabase mandate-events migration and one end-to-end tenant profile exercise.

- Version: 1.9 | Tool: Claude Code | Session: claude/agent-infrastructure-ideas-1jtgms | Date: 06.07.2026 | Changes: Added §14.2.1 Tenant Policy Profiles per Boardy review of v1.8 — ATS gating bands, ceilings, and HNP availability are per-tenant configurable under a tighten-only rule with two immovable platform floors (no mandates below ATS 0.50; HNP minimum band 0.90 raisable, never lowerable). Industry default profiles across the 25-industry platform; Aegis tier (21-industry defence scope) defaults to HNP disabled + human-signed Payment Mandates regardless of ATS. Profile changes are HIC-signed policy events on the §14.5 evidence chain, non-retroactive for live sessions. Corrected Boardy's "21 industries" framing to platform 25 / Aegis 21 per DWS_TRUTH_STANDARD row 1.

- Version: 1.8 | Tool: Claude Code | Session: claude/agent-infrastructure-ideas-1jtgms | Date: 06.07.2026 | Changes: Added §14 Agentic Commerce Mandate Gating (AP2 / UCP / ACP) — closes the payment-authority gap surfaced by the 2026-07-06 agent-infrastructure scorecard (`docs/field-notes/2026-07-06-greg-isenberg-startups-for-agents-21-answers.md`): mandate-gating rule mapping ATS bands (§3.2) to AP2 Intent/Cart/Payment Mandate privileges incl. Human Not Present pre-authorization; Capability Manifest v1.3 `spend_authority` extension; manifests expressible as W3C Verifiable Credentials for AP2 interop; AP2 Verifiable Intent log bound to KYA forensic trail + EU AI Act Article 12 record-keeping as one evidence chain; FIDO Alliance governance tracking (AP2 v0.2 donated 28.04.2026). Protocol-neutral stance across AP2 / UCP / ACP. Conclusion renumbered §14 → §15.
- Version: 1.7 | Tool: Claude Code (Opus 4.6) | Session: claude/aegis-swot-analysis-gYCYG | Date: 05.04.2026 | Changes: Article 99 citation sweep in Regulatory Penalty Avoidance — corrected from Art. 99 (blanket €35M/7%) to Art. 99(4) (€15M/3% for high-risk deployer non-compliance), with Art. 99(3) €35M/7% retained only for Art. 5 prohibited-practice context, per PR #976 sweep pattern
- Version: 1.6 | Tool: Claude Code (Opus 4.6) | Session: claude/agent-memory-fact-extraction-gLEss | Date: 23.03.2026 | Changes: Added memory audit trail references — KYA-S v1.5 (§10 Memory Audit Trail), KYA-O v1.7 (§12 Memory-Driven Financial Intelligence); dual LWM+client memory architecture; fact extraction governance (PR-254); KYA-first PR ordering for agent memory roadmap; updated split document references
- Version: 1.5 | Tool: Claude Code (Opus 4.6) | Session: claude/ai-orbital-target-labeling-MBTl5 | Date: 10.03.2026 | Changes: Pillar 5 — KYA Vision (AI Orbital Target Labeling). ICEYE SAR satellite partnership. Argus agent for 20-industry detection from orbit. SAR signature database, change detection, KYA governance for orbital labels. src/agents/argus.agent.ts, src/integrations/iceye/, /orbital-eye skill.
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Research-as-a-Service positioning, Agentic Efficiency Law (§11.1), Stacking Effect principle (§11.2), Orchestrator Layer architecture (§12.1), technical takeaways for implementers (§11.3), Gemini-informed conceptual upgrades merged with Grok financial layer
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Singularity-Ready upgrade — Pillar 4 (Autoresearch & Singularity Safety Layer), updated ATS formula with autoresearch delta (+A×0.15), financial multiplier column in trust score table, per-industry efficiency gains (9–22%), Capability Manifest v1.2 with autoresearch extensions, inline Karpathy field note, €14–38B projected EU-wide impact by 2030, Grok-informed financial ROI layer
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Add Financial Value Model (§9) — per-industry KYA revenue sizing for 16 EU-regulated industries, verification volume economics, insurance & liability reduction framework, carbon penalty avoidance ROI, Autoresearch Optimization Protocol (§10) inspired by Karpathy nanochat agent swarm methodology
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/update-kya-standard-1.1-3sL7X | Date: 09.03.2026 | Changes: Add Subagent Registry (§8) — Capability Manifests, path-scoped access control, KYA Violation enforcement, Fault Attribution in Supabase (§8.4), Agent Trust Score formula with executable engine (src/identity/ats-engine.ts)
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/sandbox-industrial-models-GXxbN | Date: 09.03.2026 | Changes: Initial KYA Standard — Three Pillars (Identity Attribution, Capability Gating, Forensic Observability), Firecracker MicroVM isolation architecture, Multi-Agent Control Room use case, Shufti partnership positioning

Document Status:

- Created: 09.03.2026
- Last Modified: 22.07.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE
- Classification: PARTNER
- Document Type: Technical Standard / Partner Proposal

Related Documents:

- Legal/KYA_SECURITY_v1.2.md (Successor: Know Your Agent v1.2 — security/identity split)
- Legal/KYA_OPTIMIZATION_v1.4.md (Successor: Know Your Architecture v1.4 — financial/optimization split)
- DWS_SECURITY_STANDARD.md (Section 18 — KYA & BYO Agent Security)
- docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md (Partnership field note)
- docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md (Technical requirements for Shufti)
- docs/field-notes/2026-03-10-karpathy-autoresearch-nanochat-agent-swarm.md (Autoresearch methodology field note)
- src/cloudflare/tenant-sandbox.ts (Sandbox isolation implementation)
- 16-INDUSTRIES.md (16 EU-regulated industries)
- src/agents/argus.agent.ts (Argus — AI Orbital Target Labeling agent)
- src/integrations/iceye/client.ts (ICEYE SAR satellite API client)
- src/integrations/iceye/types.ts (Orbital target labeling type definitions)
- .claude/commands/orbital-eye.md (Orbital Eye skill for Claude Code)
- docs/field-notes/2026-07-06-greg-isenberg-startups-for-agents-21-answers.md (Agent-infrastructure scorecard that motivated §14)
- google-agentic-commerce/AP2 v0.2, FIDO Alliance (external — Agent Payments Protocol, W3C Verifiable Credential mandates)
- DWS_ARTICLE_12_LOGGING_STANDARD.md (EU AI Act Article 12 record-keeping — evidence chain for §14.5)
- supabase/migrations/074_kya_mandate_evidence_chain.sql (§14.5 evidence chain — kya_mandate_events, kya_tenant_gating_profiles; live in production)
- supabase/migrations/079_kya_verified_done_attestation.sql (§14.7 verified-done attestation — kya_verified_done_attestations + mandate.attest event type)
- src/identity/types.ts (VerifiedDoneAttestation / AttestationInput — normative credential shapes, §14.7)

---

**DWS IQ Platform | Lifetime Oy**
**Version:** KYA Standard v1.5
**Status:** Production-Ready (Q2 2026 Launch — Agent Self-Optimization Governance, Financial ROI Layer & Orbital Vision)
**Lead Architect:** Risto Anton, Lifetime Oy
**Date:** March 2026 (v1.4 update)
**Previous:** v1.1 (Implementation Ready, Q1 2026)

---

> **Verify the Human. Sandbox the Agent. Govern the Self-Optimization. Label Every Target from Orbit.**

---

### Why Dual KYA?

**KYA** expands as **Know Your Agent** (security & identity — The No) or **Know Your Architecture** (financial optimization & agent self-optimization governance — The More) depending on audience. The same three letters cover both with zero overlap in content. This is intentional semantic engineering that gives CISOs and CFOs exactly what they need under one trusted brand.

| Document                   | KYA Expansion                     | Audience                               | Function                                                                          |
| -------------------------- | --------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| `KYA_SECURITY_v1.2.md`     | Know Your **Agent** (v1.5)        | CISOs, Security Architects, Regulators | The No — identity, isolation, kill, forensics, **memory audit trail**             |
| `KYA_OPTIMIZATION_v1.4.md` | Know Your **Architecture** (v1.7) | CFOs, CTOs, Product Leaders            | The More — efficiency, attribution, ROI, **memory-driven financial intelligence** |

---

## 1. Core Upgrade Summary (v1.1 → v1.4)

KYA v1.4 moves beyond "Model-as-a-Service" to **Research-as-a-Service**. It assumes that any system deployed is merely a "base state" that an agent swarm should immediately begin optimizing against real-world telemetry. This directly enables **agent self-optimization governance** — where autonomous agents iteratively improve their own models, policies, and performance under hardware-attested safety bounds, with court-defensible audit trails.

The upgrade adds **11–30%+ efficiency gains** (benchmarked from real autoresearch runs) that translate into measurable financial value across all 16 Fit for 55 industries: reduced energy OPEX, faster compliance cycles, lower stranded-asset risk, and new revenue from AI-optimized industrial processes.

**New financial multipliers** (embedded in Agent Trust Score & Capability Manifest):

- **Autoresearch delta** → automatic KYA score uplift + revenue attribution tracking
- **Projected ROI:** 8–22x within 18 months in heavy-industry deployments (energy savings + tender wins + carbon-credit monetization)

**The "Karpathy Stack" applied to Industry:**

- **Proxy Metrics** — Identify small-scale simulations (depth=12) that correlate to full-scale success (depth=24)
- **Autonomous Iteration** — Agents propose, code, and test hundreds of micro-adjustments
- **Additive Scaling** — Validated "wins" are promoted to the production-grade system

| What Changed      | v1.1                                    | v1.4                                                               |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------ |
| Pillars           | 3 (Identity, Capability, Forensics)     | **4** (+ Autoresearch & Agent Self-Optimization Governance Safety) |
| ATS Formula       | `1.0 - V×0.25 - L - D×0.05`             | `1.0 - V×0.25 - L - D×0.05 + A×0.15`                               |
| Trust Score Table | 4 tiers, no financial column            | **4 tiers + Financial Multiplier per tier**                        |
| Financial Layer   | None                                    | **Per-industry ROI, €14–38B EU-wide by 2030**                      |
| Manifest Schema   | v1.1 (paths only)                       | **v1.2 (+ autoresearch, target metrics, financial attribution)**   |
| Positioning       | Model-as-a-Service                      | **Research-as-a-Service**                                          |
| Named Laws        | None                                    | **Agentic Efficiency Law, Stacking Effect**                        |
| Swarm Management  | Manual                                  | **Orchestrator Layer (kill early, promote winners)**               |
| Compliance        | EU AI Act, NIS2, GDPR, Fit for 55, DORA | **+ Autoresearch audit trail for Art. 12/14**                      |

---

## 2. The Four Pillars of KYA (v1.4)

### 2.1 Pillar 1: Identity Attribution — The Anchor (unchanged)

Every agent session is cryptographically anchored to a KYC-verified human or entity. This ensures legal accountability for autonomous actions within the DWS10 Control Room.

**Implementation:**

- Agent session tokens are bound to a verified user identity (Shufti IDV or equivalent)
- Session-to-identity binding is immutable and stored in the KYA ledger
- Legal chain of custody: `Agent Action → Session Token → Verified Identity → Legal Entity`

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  BYO Agent   │────>│  KYA Session │────>│  Verified    │
│  (Clawbot)   │     │  Token       │     │  Identity    │
│              │     │              │     │  (Shufti L1) │
└──────────────┘     └──────────────┘     └──────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                    Cryptographic Binding
```

### 2.2 Pillar 2: Capability Gating — The Leash (now includes Autoresearch Budget Caps)

Using real-time risk telemetry (via API partners), DWS IQ dynamically adjusts an agent's permissions. If a user's risk profile fluctuates, the agent's compute, memory, and API access are throttled in milliseconds.

**v1.3 addition:** Autoresearch Budget Caps limit the compute, token, and experiment count an agent can consume during self-optimization loops. Prevents runaway autoresearch from exceeding cost or safety bounds.

**Dynamic Permission Model:**

| Risk Signal                  | Response Time | Action                                      |
| ---------------------------- | ------------- | ------------------------------------------- |
| AML flag raised              | < 5 seconds   | Egress blocked, sandbox restricted          |
| Document expired             | < 30 seconds  | Session paused, re-verification required    |
| Anomalous behavior detected  | < 1 second    | Hypervisor trap, session frozen             |
| Risk score recovery          | < 10 seconds  | Permissions restored to previous level      |
| Autoresearch budget exceeded | < 1 second    | Optimization loop halted, results preserved |

### 2.3 Pillar 3: Forensic Observability — The Firehorse Audit Trail (now logs autoresearch)

The Lifetime Firehorse product line serves as the ecosystem's tamper-proof "flight recorder." It captures a sub-second telemetry stream of every syscall and network request, providing an immutable audit trail bridging agent behavior to human identity.

**v1.3 addition:** Every autoresearch experiment, change proposal, validation-loss delta, and parameter stack ranking is now captured in Firehose for liability and IP protection.

**What Firehorse Records:**

| Layer                   | Data Captured                                                                | Retention                      |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| Syscall                 | All file I/O, process spawns, IPC                                            | 90 days (configurable)         |
| Network                 | Every egress/ingress request, DNS lookups                                    | 90 days                        |
| MCP Tool                | Tool invocations, parameters, responses                                      | 1 year                         |
| Token Usage             | Input/output tokens per agent per session                                    | 1 year                         |
| Identity Events         | KYA score changes, permission adjustments                                    | 5 years (EU AI Act Article 12) |
| **Autoresearch** (v1.4) | **Experiment proposals, validation deltas, parameter diffs, stack rankings** | **5 years (IP + liability)**   |

**Audit Chain:**

```
Agent Syscall → Firehorse Telemetry → KYA Session → Verified Identity
     │                  │                  │              │
     └──── timestamp ───┴──── session_id ──┴──── user_id ─┘
                    Immutable Forensic Record
```

### 2.4 Pillar 4: Autoresearch & Agent Self-Optimization Governance Safety Layer (NEW in v1.4)

Every governed agent can now run internal **autoresearch loops** (depth=12 → depth=24 scaling) under strict KYA bounds. Changes are proposed, validated on proxy models, stacked, and promoted only if they improve the target metric (validation loss, energy efficiency, emissions, latency, etc.). All experiments are immutably logged in Firehorse and attributed to the verified identity.

**The Autoresearch Loop (inside MicroVM):**

```
┌─────────────────────────────────────────────────────────┐
│  MicroVM (KYA-Governed Autoresearch)                     │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │ Propose  │───>│ Validate │───>│ Stack    │          │
│  │ Change   │    │ on Proxy │    │ if +Δ   │          │
│  └──────────┘    └──────────┘    └──────────┘          │
│       │                │               │                │
│       │         validation_loss    improvement          │
│       │         energy_kwh/ton     confirmed?           │
│       │         co2_per_unit            │               │
│       │                                 ▼               │
│       │                          ┌──────────┐          │
│       │                          │ Promote  │          │
│       │                          │ depth=12 │          │
│       │                          │ → dep=24 │          │
│       │                          └──────────┘          │
│       │                                                 │
│  ┌────────────────────────────────────────────┐        │
│  │ Firehorse: log every proposal, delta, rank │        │
│  │ Budget Cap: max N experiments, max $cost   │        │
│  │ Safety: unauthorized scope → ATS -40, KILL │        │
│  └────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

**Guardrails:**

| Guardrail                     | Enforcement                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| **Scope lock**                | Autoresearch can only tune parameters declared in Capability Manifest `target_metrics` |
| **Budget cap**                | Max experiments, max tokens, max compute-hours per session — enforced at VMM           |
| **No isolation weakening**    | MicroVM boundaries, kernel isolation, egress rules are NEVER tunable                   |
| **Human gate for production** | All parameter changes require human sign-off before production deployment              |
| **Rollback window**           | 24h automatic rollback if any security metric degrades                                 |
| **Breach simulation**         | Every parameter set must pass adversarial breach simulation before promotion           |
| **Out-of-scope penalty**      | Unauthorized autoresearch attempts → ATS drops 40 points, session frozen               |

**This turns Karpathy's "wild" capability into enterprise-grade, auditable, financially quantifiable intelligence.**

### 2.5 Pillar 5: AI Orbital Target Labeling — KYA Vision (NEW in v1.5)

> **"Label every target from orbit."** — Before governing an agent, know what it's governing. KYA Vision gives the platform eyes.

**Partner:** ICEYE (Espoo, Finland) — world's largest SAR satellite constellation (60+ satellites, sub-daily revisit, 16cm Gen4 resolution). SAR sees through clouds, darkness, rain — 24/7 all-weather industrial monitoring.

**Agent:** Argus (named after Argus Panoptes, the all-seeing giant of Greek mythology)

**Pipeline:**

```
┌───────────────────────────────────────────────────────────────┐
│  KYA Vision — Orbital Target Labeling Pipeline                │
│                                                               │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │ ICEYE    │───>│ SAR Signature│───>│ LLM Refine   │        │
│  │ SAR Data │    │ Pre-Classify │    │ (Claude)     │        │
│  └──────────┘    └──────────────┘    └──────────────┘        │
│       │                │                    │                 │
│    Tasking &       Deterministic        Co-location &        │
│    Catalog API     pattern match        plausibility         │
│       │                │                    │                 │
│       v                v                    v                 │
│  ┌──────────────────────────────────────────────────┐        │
│  │              KYA Governance Layer                 │        │
│  │  • Every label → Firehorse audit trail            │        │
│  │  • Low confidence → human review required         │        │
│  │  • Wedge industries → always human review         │        │
│  │  • Agent Trust Score applied to labeling agent     │        │
│  └──────────────────────────────────────────────────┘        │
│                          │                                    │
│                          v                                    │
│  ┌──────────────────────────────────────────────────┐        │
│  │           20-Industry Target Database             │        │
│  │  Targets × Industries × Time → Change Detection   │        │
│  └──────────────────────────────────────────────────┘        │
└───────────────────────────────────────────────────────────────┘
```

**20 Industries — SAR Detectability Tiers:**

| Tier           | Industries                                                                   | SAR Detectability                                      | Method                                       |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| **Tier 1** (8) | Power, Steel, Cement, Chemicals, Aviation, Maritime, Transport, Construction | **High** — distinct metallic/geometric SAR signatures  | Direct SAR pattern matching                  |
| **Tier 2** (8) | Agriculture, Waste, Aluminium, Pulp/Paper, Petroleum, Food, Glass, Mining    | **Medium** — identifiable with multi-temporal analysis | SAR + temporal change detection              |
| **Tier 3** (4) | Fintech, Pharma, Cybersecurity, Healthcare                                   | **Low** — buildings look like generic urban            | Co-location inference + external data fusion |

**ICEYE Integration:**

| API             | Purpose                                   | DWS Usage                                        |
| --------------- | ----------------------------------------- | ------------------------------------------------ |
| **Tasking API** | Command satellites to acquire new imagery | On-demand high-res spotlight over specific sites |
| **Catalog API** | Search 60k+ archive images                | Baseline monitoring, historical change detection |

**SAR Physics for Industry Detection:**

- **Metallic structures** (steel mills, refineries) → high backscatter (bright in SAR)
- **Water/flat surfaces** (ports, runways) → low backscatter (dark, specular reflection)
- **Urban/industrial** → mixed bright/dark with geometric double-bounce patterns
- **Open excavations** (mining, quarries) → distinct shadow/layover signatures
- **Temporal change** (construction sites) → rapid decorrelation between acquisitions

**KYA Vision Governance Rules:**

| Rule                                             | Enforcement                                             |
| ------------------------------------------------ | ------------------------------------------------------- |
| Every orbital label gets Firehorse trace ID      | Immutable — `fh-argus-{session}-{target}`               |
| Confidence < 50% → human review required         | Agent cannot finalize classification                    |
| Wedge industries → always human review           | Orbital detection too uncertain for auto-classification |
| Agent KYA score < 50 → labeling suspended        | Low-trust agents cannot classify targets                |
| Change detection deltas > 50% → compliance alert | Auto-triggers ETS/CBAM cross-reference                  |
| All SAR data → EU data residency                 | ICEYE ISO 27001 + DWS europe-north1 storage             |

**Why ICEYE + DWS (Both Finnish):**

- Same regulatory environment (Finnish/EU jurisdiction)
- Same customer base (Nordic heavy industry, EU-regulated sectors)
- ICEYE provides the eyes (SAR constellation), DWS provides the brain (KYA-governed AI labeling)
- Combined: autonomous, all-weather industrial monitoring with court-defensible audit trails

**Implementation:** `src/agents/argus.agent.ts`, `src/integrations/iceye/`, CLI: `dws run argus`, Skill: `/orbital-eye`

---

## 3. Agent Trust Score (ATS) v1.4 — Now with Autoresearch Delta

### 3.1 Updated Formula

```
ATS = max(0, 1.0 - V×0.25 - L - D×0.05 + A×0.15)

V = KYA_VIOLATION count       (4 violations = zero trust)
L = 0.10 if avg_latency > 500ms
D = DENIED path access attempts
A = autoresearch improvement factor (capped, validated on industry proxy metrics)
    e.g., +0.11 for 11% Time-to-GPT-2 gain; +0.09 for 9% energy efficiency
```

**Implementation:** `src/identity/ats-engine.ts` — evaluated before external IDV calls. The `A` factor is computed from the agent's validated autoresearch improvements, capped at 0.15 to prevent score inflation.

### 3.2 KYA Trust Score Ranges (v1.4 — with Financial Multiplier)

| ATS Range | KYA Score | Permission Level                  | Financial Multiplier (25+ industries) | Decision          |
| --------- | --------- | --------------------------------- | ------------------------------------- | ----------------- |
| >= 0.80   | >= 80     | Full sandbox + Autoresearch swarm | 1.8–3.2x OPEX savings/yr              | **GO + Monetize** |
| 0.50–0.79 | 50–79     | Restricted + limited autoresearch | 1.3–2.0x                              | **GO** (limited)  |
| < 0.50    | < 50      | Suspended — human review required | —                                     | **NO_GO**         |
| = 0.00    | = 0       | Frozen — agent terminated         | —                                     | **NO_GO**         |

---

## 4. Technical Architecture: Hardware-Level Isolation

To meet the "Zero-Trust" requirements of industrial-grade environments, DWS IQ enforces physical separation for every agent deployment.

### 4.1 Firecracker MicroVMs

Every BYO process is encapsulated in a dedicated MicroVM.

**Properties:**

| Property           | Value                                   |
| ------------------ | --------------------------------------- |
| Boot time          | < 125 ms                                |
| Memory overhead    | < 5 MB per MicroVM                      |
| Guest kernel       | Isolated per sandbox                    |
| Host kernel access | None (paravirtualized)                  |
| Storage            | Ephemeral by default, persistent opt-in |

### 4.2 No Shared Kernel Access

Each sandbox runs its own isolated guest kernel. This eliminates "breakout" exploits and ensures that a compromise in one agent cannot migrate to the host or adjacent sandboxes.

```
┌─────────────────────────────────────────────────┐
│  Host (DWS IQ Control Room)                     │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ MicroVM  │  │ MicroVM  │  │ MicroVM  │     │
│  │┌────────┐│  │┌────────┐│  │┌────────┐│     │
│  ││Guest   ││  ││Guest   ││  ││Guest   ││     │
│  ││Kernel A││  ││Kernel B││  ││Kernel C││     │
│  │├────────┤│  │├────────┤│  │├────────┤│     │
│  ││CoWork  ││  ││Clawbot ││  ││Work-   ││     │
│  ││Agent   ││  ││Agent   ││  ││buddy   ││     │
│  │└────────┘│  │└────────┘│  │└────────┘│     │
│  └──────────┘  └──────────┘  └──────────┘     │
│       ╳              ╳              ╳          │
│  No lateral movement between MicroVMs          │
└─────────────────────────────────────────────────┘
```

### 4.3 Hypervisor-Level Egress Control

Network traffic is gated at the VMM (Virtual Machine Monitor) layer. Agents have zero outbound access unless the KYA profile explicitly whitelists an endpoint for the specific session.

**Egress Policy Rules:**

| Rule                  | Enforcement                                      |
| --------------------- | ------------------------------------------------ |
| Default deny          | All outbound blocked unless KYA-whitelisted      |
| Per-session whitelist | Endpoints approved per agent per session         |
| DNS interception      | All DNS queries routed through DWS resolver      |
| TLS inspection        | Optional MitM for enterprise tier (with consent) |
| Rate limiting         | Per-agent bandwidth caps enforced at VMM         |

---

## 5. Use Case: The Multi-Agent Control Room

### Scenario

A Tier-1 client initiates a complex task in the Control Room (managing 16 proprietary industrial models). The client simultaneously deploys four heterogeneous agents:

| #   | Agent             | Role                    | Provider  |
| --- | ----------------- | ----------------------- | --------- |
| 1   | Microsoft CoWork  | Documentation / PM      | Microsoft |
| 2   | Tencent Workbuddy | Supply-Chain APIs       | Tencent   |
| 3   | Clawbot           | Mechanical Optimization | OpenClaw  |
| 4   | Anthropic Cowork  | Strategy / Logic        | Anthropic |

### The Execution

**Step 1 — Verification:**
Identity signals (e.g., Shufti) verify the operator. KYA L1 score is computed and stored.

**Step 2 — Isolation:**
DWS IQ spins up four distinct Firecracker MicroVMs. Each operates with zero shared kernel access.

```
Operator (KYA Score: 87)
    │
    ├── MicroVM-1: CoWork      [egress: microsoft.com, sharepoint.com]
    ├── MicroVM-2: Workbuddy   [egress: api.tencent.com]
    ├── MicroVM-3: Clawbot     [egress: none (air-gapped)]
    └── MicroVM-4: Cowork      [egress: api.anthropic.com]
```

**Step 3 — Logging:**
Lifetime Firehorse records an interleaved forensic log of all actions. Every syscall, network request, and MCP tool invocation is timestamped and attributed to the session.

**Step 4 — Interdependency Enforcement:**
If the Tencent agent attempts to access a resource reserved for the Clawbot, the DWS IQ hypervisor traps the command and freezes the session instantly.

```
[2026-03-09T14:32:17.003Z] TRAP: MicroVM-2 (Workbuddy) attempted
    read on /mnt/shared/clawbot-optimization-params.json
    → Action: SESSION FROZEN
    → Reason: Cross-sandbox resource access violation
    → KYA Score Impact: -30 (87 → 57, restricted tier)
    → Operator Notified: Yes (webhook + dashboard alert)
```

### 5.1 The 16 Industrial Models

Each model runs in its own sandbox within the Control Room, serving one of the 16 EU-regulated industries under Fit for 55:

| Tier 1: Critical Emissions (Direct ETS + CBAM) | Tier 2: Important Emissions (ESR + Indirect ETS) |
| ---------------------------------------------- | ------------------------------------------------ |
| 1. Power & Heat Generation                     | 9. Agriculture & Livestock                       |
| 2. Iron & Steel Production                     | 10. Waste Management & Recycling                 |
| 3. Cement & Lime Production                    | 11. Aluminium Production                         |
| 4. Chemicals & Petrochemicals                  | 12. Pulp, Paper & Printing                       |
| 5. Aviation                                    | 13. Petroleum Refining                           |
| 6. Maritime Shipping                           | 14. Food & Beverage Processing                   |
| 7. Road Transport & Logistics                  | 15. Glass & Ceramics Production                  |
| 8. Construction & Buildings                    | 16. Mining & Quarrying                           |

BYO agents interact with these models through gated MCP tool interfaces — never directly with the model data or weights.

---

## 6. Sandbox Stages

KYA integrates with the DWS IQ sandbox staging model:

| Stage | Runtime                          | Isolation                       | KYA Gate                  |
| ----- | -------------------------------- | ------------------------------- | ------------------------- |
| 1     | SDK native                       | No network, read-only FS        | L1 IDV only               |
| 1.5   | Acer Veriton GN100 (Helsinki)    | Ephemeral Docker, air-gapped EU | L1 + L2 (provenance)      |
| 2     | Cloud Run ephemeral              | Sandboxed by default            | L1 + L2 + L3 (capability) |
| 3     | Production (Firecracker MicroVM) | Full hardware isolation         | All 5 layers active       |

---

## 7. BYO Agent Registration Flow

```
Customer Request
    │
    ▼
┌─────────────────────────────┐
│ Stage 1: Registration       │  Agent manifest submitted to DWS Agent Registry
│ (No Shufti gate)            │  Manifest: name, version, provider, requested tools
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Stage 2: Identity Binding   │  ← SHUFTI L1 (IDV) — BLOCKING
│ Human verified via Shufti   │  Document + face match + AML screen
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Stage 3: Org Verification   │  ← SHUFTI KYB — BLOCKING (for BYO agents)
│ Organization behind agent   │  Business verification, UBO checks
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Stage 4: Capability Review  │  MCP tool approval against org policy
│ What tools does it need?    │  DWS IQ admin reviews requested capabilities
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Stage 5: Sandbox Entry      │  ← KYA SCORE CHECK (>= 50 to enter)
│ Firecracker MicroVM spun up │  Isolated runtime, tier-based limits
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Stage 6: Runtime Monitoring │  Continuous telemetry (Firehorse)
│ + Dynamic Restriction       │  ← SHUFTI L5 WEBHOOK (on risk change)
│ + Autoresearch Governance   │  ← KYA Pillar 4 (budget caps, scope lock)
└─────────────────────────────┘
```

---

## 8. Compliance Alignment (v1.4 Enhanced)

| Regulation                 | KYA Coverage                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **EU AI Act** (Article 12) | Forensic logging, human oversight, traceability — **now includes autoresearch decision trail**                  |
| **EU AI Act** (Article 14) | Human-in-the-loop via KYA score thresholds — **autoresearch requires human gate for production**                |
| **NIS2 Directive**         | Supply chain security for BYO agents, incident reporting                                                        |
| **GDPR**                   | Data residency (EU-only), right to erasure (agent data)                                                         |
| **Fit for 55**             | 16 industrial models comply with ETS/CBAM/CSRD — **automated audit-ready financial & emissions impact reports** |
| **DORA**                   | ICT risk management for financial sector agents                                                                 |

---

## 9. Subagent Registry (v1.1, updated v1.4)

Every subagent initialized within the DWS IQ platform must register with the **Subagent Registry** and sign a local **Capability Manifest** before execution begins. This ensures that testing and sandbox environments enforce the same identity-gated access controls as production.

### 9.1 Capability Manifest (v1.4 — Autoresearch Extensions)

Upon initialization, each subagent signs a Capability Manifest declaring its permitted resource paths. The manifest is immutable for the duration of the session.

**Default Testing Manifest:**

| Path             | Access     | Description                                        |
| ---------------- | ---------- | -------------------------------------------------- |
| `/mock-api/`     | Read/Write | Mock API endpoints for testing                     |
| `/temp-db/`      | Read/Write | Temporary database for sandbox operations          |
| `/prod-secrets/` | **DENIED** | Production secrets — access triggers KYA Violation |

**Manifest Schema v1.2 (with Autoresearch Extensions):**

```json
{
  "manifest_version": "1.2",
  "subagent_id": "<uuid>",
  "session_id": "<kya-session-token>",
  "signed_at": "<ISO-8601>",
  "permitted_paths": ["/mock-api/", "/temp-db/"],
  "denied_paths": ["/prod-secrets/"],
  "ttl_seconds": 3600,
  "kya_score_at_sign": 85,
  "autoresearch_enabled": true,
  "max_depth": 24,
  "max_experiments": 700,
  "max_compute_hours": 48,
  "target_metrics": ["validation_loss", "energy_kwh_per_ton", "co2_per_unit"],
  "improvement_threshold": 0.05,
  "financial_attribution": true
}
```

### 9.2 KYA Violation: Unauthorized Path Access

If a subagent attempts to access a denied path (e.g., `/prod-secrets/`), the following enforcement sequence executes:

| Step | Action                                        | Latency   |
| ---- | --------------------------------------------- | --------- |
| 1    | Path access intercepted by sandbox monitor    | < 1 ms    |
| 2    | KYA Violation logged to Firehorse audit trail | < 5 ms    |
| 3    | Subagent session terminated                   | < 50 ms   |
| 4    | Operator notified (webhook + dashboard alert) | < 1 s     |
| 5    | KYA Trust Score reduced by 40 points          | Immediate |

**Violation Log Entry:**

```json
{
  "event": "KYA_VIOLATION",
  "severity": "CRITICAL",
  "subagent_id": "<uuid>",
  "session_id": "<kya-session-token>",
  "attempted_path": "/prod-secrets/",
  "manifest_signed_at": "<ISO-8601>",
  "action_taken": "TERMINATE",
  "kya_score_before": 85,
  "kya_score_after": 45,
  "timestamp": "<ISO-8601>"
}
```

### 9.3 Registry Lifecycle

```
Subagent Initialized
    │
    ▼
┌─────────────────────────────┐
│ Step 1: Registry Check      │  Subagent registered in Subagent Registry
│ (Is this agent known?)      │  If unknown → reject initialization
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 2: Manifest Signing    │  Agent signs Capability Manifest v1.2
│ Permitted: /mock-api/,      │  Declares paths + autoresearch scope
│           /temp-db/         │  Manifest is immutable for session
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 3: Sandbox Execution   │  Agent operates within manifest bounds
│ Path monitor active         │  Every resource access checked against manifest
│ Autoresearch budget tracked │  Experiments counted against max_experiments
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 4: Violation Response  │  On denied path access:
│ /prod-secrets/ → TERMINATE  │  Log KYA Violation → Kill session → Alert
│ Out-of-scope autoresearch   │  ATS -40, session frozen
└─────────────────────────────┘
```

### 9.4 Fault Attribution (Liability Mapping)

When a subagent produces an incorrect result or triggers a violation, the system must determine **which component is at fault** — the Logic Subagent (reasoning/planning layer) or the Integration Mock/Adapter (external API bridge). Fault attribution records are stored separately in **Supabase** (`kya_fault_attribution` table) to enable post-incident analysis and liability assignment.

**Fault Classification:**

| Fault Class                 | Responsible Component    | Example                                                                                    |
| --------------------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `LOGIC_FAULT`               | Logic Subagent           | Agent produced incorrect calculation, hallucinated data, or violated business rules        |
| `INTEGRATION_FAULT`         | Integration Mock/Adapter | Mock returned stale data, API timeout, schema mismatch                                     |
| `MANIFEST_FAULT`            | Capability Manifest      | Manifest too permissive or missing deny rules                                              |
| `OPERATOR_FAULT`            | Human Operator           | Misconfigured agent parameters, wrong model selected                                       |
| `AUTORESEARCH_FAULT` (v1.4) | Autoresearch Loop        | Self-optimization produced regression, exceeded budget, or modified out-of-scope parameter |

**Supabase Schema (`kya_fault_attribution`):**

```sql
CREATE TABLE kya_fault_attribution (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT NOT NULL,
  subagent_id   TEXT NOT NULL,
  fault_class   TEXT NOT NULL CHECK (fault_class IN (
                  'LOGIC_FAULT', 'INTEGRATION_FAULT',
                  'MANIFEST_FAULT', 'OPERATOR_FAULT',
                  'AUTORESEARCH_FAULT')),
  severity      TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  description   TEXT NOT NULL,
  evidence      JSONB NOT NULL DEFAULT '{}',
  kya_score_impact INTEGER DEFAULT 0,
  resolved      BOOLEAN DEFAULT FALSE,
  resolved_by   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  resolved_at   TIMESTAMPTZ
);

-- RLS: only service_role and authenticated admins
ALTER TABLE kya_fault_attribution ENABLE ROW LEVEL SECURITY;
```

**Attribution Flow:**

```
Error Detected
    │
    ▼
┌─────────────────────────────┐
│ Step 1: Error Capture       │  Firehorse captures the failing action
│ (What went wrong?)          │  Syscall trace + MCP tool response
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 2: Fault Classification│  Automated classifier assigns fault_class
│ Logic vs Integration vs     │  Based on error origin (agent reasoning
│ Manifest vs Operator vs     │  vs external API vs config vs
│ Autoresearch                │  self-optimization regression)
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 3: Supabase Insert     │  Record written to kya_fault_attribution
│ Separate from Firehorse log │  Queryable, dashboardable, RLS-protected
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 4: Resolution Tracking │  Admin reviews, assigns resolved_by,
│ Who fixed it?               │  closes the fault record
└─────────────────────────────┘
```

**Why Supabase (separate from Firehorse)?**

- Firehorse is an **immutable audit trail** (append-only, forensic) — fault attribution needs **mutable state** (resolved/unresolved)
- Supabase provides **RLS**, **real-time subscriptions** (dashboard alerts), and **queryable JSONB** for evidence payloads
- Fault attribution is an **operational concern** (who fixes it?), not a **compliance concern** (what happened?)

---

## 10. Financial Value Layer — 19 Industries (v1.4)

KYA is not a cost center — it is a **revenue-generating compliance layer**. Every BYO agent session generates verification events, and every autoresearch improvement generates financially attributable value.

KYA governance applies to **any industry where autonomous agents operate** — not only the 16 EU Fit for 55 regulated sectors. v1.4 expands coverage with 3 additional high-value wedge industries where autoresearch creates immediate financial impact.

### 10.1 Autoresearch-Driven Efficiency Gains per Industry

KYA v1.4 quantifies and attributes financial upside from governed autoresearch:

**Tier 1: Critical Emissions — High KYA Value (Fit for 55 Core)**

| #   | Industry                   | Autoresearch Efficiency Gain          | Primary Value Driver                           | Financial Value per Enterprise (€/yr) |
| --- | -------------------------- | ------------------------------------- | ---------------------------------------------- | ------------------------------------- |
| 1   | Power & Heat Generation    | 9–15% energy efficiency               | Self-tuned process agents reduce ETS/CBAM cost | **€560k–€2.2M**                       |
| 2   | Iron & Steel Production    | 11–15% energy efficiency              | Supply chain carbon optimization               | **€1M–€5.1M**                         |
| 3   | Cement & Lime Production   | 10–14% process optimization           | Kiln efficiency + CBAM material passports      | **€524k–€3.1M**                       |
| 4   | Chemicals & Petrochemicals | 9–13% energy efficiency               | Process emissions + hydrogen transition        | **€848k–€4.2M**                       |
| 5   | Aviation                   | 7–12% fuel optimization               | SAF compliance + route optimization            | **€230k–€1.1M**                       |
| 6   | Maritime Shipping          | 8–12% fuel & maintenance              | Voyage emissions + FuelEU compliance           | **€336k–€1.6M**                       |
| 7   | Road Transport & Logistics | 9–12% fleet optimization              | ETS2 readiness + zero-emission transition      | **€272k–€1.1M**                       |
| 8   | Construction & Buildings   | 11–22% predictive maintenance & yield | EPBD + lifecycle carbon + BIM integration      | **€1.1M–€5.4M**                       |

**Tier 2: Important Emissions — Moderate KYA Value (Fit for 55 Extended)**

| #   | Industry                     | Autoresearch Efficiency Gain  | Primary Value Driver                  | Financial Value per Enterprise (€/yr) |
| --- | ---------------------------- | ----------------------------- | ------------------------------------- | ------------------------------------- |
| 9   | Agriculture & Livestock      | 8–18% yield + waste reduction | Farm carbon + methane tracking        | **€118k–€572k**                       |
| 10  | Waste Management & Recycling | 11–18% resource yield uplift  | Methane capture + circular economy    | **€92k–€348k**                        |
| 11  | Aluminium Production         | 10–15% energy optimization    | Renewable electricity + CBAM          | **€524k–€2.1M**                       |
| 12  | Pulp, Paper & Printing       | 8–14% process optimization    | Forestry carbon + supply chain        | **€114k–€460k**                       |
| 13  | Petroleum Refining           | 9–15% energy efficiency       | Decline pathway + SAF production      | **€530k–€2.1M**                       |
| 14  | Food & Beverage Processing   | 8–16% yield + waste reduction | Agricultural supply chain carbon      | **€104k–€396k**                       |
| 15  | Glass & Ceramics Production  | 9–14% process optimization    | Process emissions + material tracking | **€112k–€448k**                       |
| 16  | Mining & Quarrying           | 11–18% predictive maintenance | Extraction emissions + CRM compliance | **€168k–€672k**                       |

**Tier 3: Wedge Industries — High Agent Density, High Autoresearch Value (v1.4 NEW)**

These industries are not Fit for 55 core but have extremely high autonomous agent density and autoresearch ROI. KYA governance is critical wherever agents self-optimize at scale.

| #   | Industry          | Autoresearch Application                                                                            | Proxy Metric (depth=12 equivalent)    | Financial Value per Enterprise (€/yr)   |
| --- | ----------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------- |
| 17  | Fintech & Trading | Agents tune alpha-discovery models on 1-hour "proxy" markets before scaling to live trading         | Sharpe ratio on synthetic market data | **€2M–€15M**                            |
| 18  | Pharma & Biotech  | Swarms optimize protein folding simulations, tuning energy loss functions autonomously              | Binding affinity prediction accuracy  | **€5M–€50M** (Time to Molecule -15–20%) |
| 19  | Cybersecurity     | Autoresearch on anomaly detection thresholds — reduce false positives while maintaining sensitivity | SOC alert-to-breach detection ratio   | **€500k–€3M** (alert fatigue reduction) |

### 10.2 KYA Revenue Model

**How KYA generates revenue for Lifetime Oy:**

| Revenue Stream                        | Unit Economics                         | Scale Driver                                    |
| ------------------------------------- | -------------------------------------- | ----------------------------------------------- |
| **Verification Events**               | €1.20 per KYA verification event       | Agent sessions x industries x frequency         |
| **Continuous Monitoring**             | €0.30 per L5 webhook processed         | Risk signal volume from Shufti/IDV              |
| **Fault Attribution**                 | €5.00 per fault investigation record   | Incident frequency x severity                   |
| **Compliance Certificates**           | €500 per quarterly KYA compliance cert | Enterprise count x quarterly cycles             |
| **Insurance Premium Reduction**       | 8–15% cyber insurance discount         | KYA-certified enterprises get lower premiums    |
| **Autoresearch Revenue Share** (v1.4) | 5–12% of attributed efficiency gains   | Financial attribution from Firehorse → Supabase |

**Platform Revenue Projections (19 industries):**

| Year                           | Enterprises on KYA | Avg. KYA Events/yr | Revenue (€M) |
| ------------------------------ | ------------------ | ------------------ | ------------ |
| 2026 (launch)                  | 10–25              | 50,000             | €0.6–€1.5M   |
| 2027 (CBAM + ETS2 + Wedge)     | 60–150             | 80,000             | €5.8–€14.4M  |
| 2028 (EPBD + Fintech/Pharma)   | 150–400            | 120,000            | €21.6–€57.6M |
| 2030 (Fit for 55 + full wedge) | 400–1,000          | 200,000            | €96M–€240M   |

**Cumulative projected impact: €18–48 billion annual protected/created value across 19 sectors by 2030** through KYA-governed agent swarms. Tracked automatically via Firehorse → Supabase revenue-attribution tables.

### 10.3 Insurance & Liability Reduction

KYA certification directly reduces enterprise risk exposure:

**Cyber Insurance:**

- KYA-certified agent deployments qualify for **8–15% premium reduction** on cyber liability policies
- Forensic observability (Pillar 3) provides the evidence trail insurers require for claims defense
- Fault attribution (§9.4) separates agent liability from operator liability — reducing blanket coverage requirements

**Regulatory Penalty Avoidance:**

- EU AI Act Art. 99(4): fines up to **€15M or 3% of annual global turnover** for high-risk deployer non-compliance (Art. 99(3): €35M/7% for Art. 5 prohibited practices)
- NIS2 Directive: fines up to **€10M or 2% of annual global turnover**
- GDPR: fines up to **€20M or 4% of annual global turnover**
- KYA's audit trail + identity attribution provides the "reasonable measures" defense

**Carbon Penalty Avoidance:**

- ETS non-compliance: **€100/tCO2 penalty** (on top of market price, currently ~€60/tCO2)
- CBAM miscalculation: retroactive border adjustment + administrative fines
- KYA-governed agents produce auditable carbon calculations — reducing misreporting risk

### 10.4 Financial Value per KYA Layer

| KYA Layer                     | Financial Value                                          | Who Pays                          |
| ----------------------------- | -------------------------------------------------------- | --------------------------------- |
| **L1** — Identity Attribution | Legal liability assignment → insurance discount          | Enterprise (platform fee)         |
| **L2** — Agent Provenance     | Supply chain risk reduction → vendor trust               | Enterprise (per-agent fee)        |
| **L3** — Capability Gating    | Prevents unauthorized access → avoided breach costs      | Enterprise (platform fee)         |
| **L4** — Runtime Behavior     | Real-time anomaly detection → prevented incidents        | Enterprise (monitoring fee)       |
| **L5** — Continuous Risk      | Regulatory compliance evidence → penalty avoidance       | Enterprise + Insurer (shared)     |
| **Autoresearch** (v1.4)       | Self-optimization ROI → efficiency gains → revenue share | Enterprise + Lifetime Oy (shared) |

### 10.5 Competitive Moat: Why KYA Cannot Be Replicated Cheaply

| Barrier                                       | Detail                                                                                                                                    |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Hardware isolation**                        | Firecracker MicroVM expertise is rare; most competitors use container-level isolation (breakable)                                         |
| **Identity provider integration**             | Shufti/IDV webhook pipeline is live; competitors would need 6–12 months to integrate                                                      |
| **19-industry regulatory + domain knowledge** | Lifetime World Model encodes 15k+ EU regulations + fintech/pharma/cyber domain models — competitors would need to build this from scratch |
| **Forensic audit trail**                      | Firehorse is a purpose-built telemetry system, not a bolted-on logging library                                                            |
| **Fault attribution**                         | No competitor has automated liability mapping between agent layers                                                                        |
| **Autoresearch governance** (v1.4)            | No competitor has governed self-optimization with financial attribution at scale                                                          |

---

## 11. The Agentic Efficiency Law & Stacking Effect (v1.4)

### 11.1 The Agentic Efficiency Law

As Karpathy's nanochat experiment demonstrated: an agent swarm found ~20 additive changes that a human expert — with 2 decades of experience — missed. This establishes a new law for KYA v1.4:

> **The Agentic Efficiency Law:** Human-tuned systems are, by definition, sub-optimal. An agent swarm can achieve ~11%+ efficiency gains on "well-tuned" systems simply by exploring the high-dimensional parameter space humans find too tedious to map.

**Implication for 19 industries:** Every industrial model deployed in the DWS10 Control Room is a "well-tuned" base state. KYA-governed autoresearch will find the ~11% the human engineers missed — in energy efficiency, emissions calculations, process optimization, trading alpha, drug discovery, and threat detection accuracy.

### 11.2 The Stacking Effect

Individual 0.5% gains are noise. Twenty stacked 0.5% gains are a **competitive moat**.

This is the core financial insight of KYA v1.4: autoresearch doesn't produce one big breakthrough — it produces dozens of small, additive improvements that compound into transformative performance:

| Gain per Change | Changes Stacked | Compound Effect | Industry Example                                           |
| --------------- | --------------- | --------------- | ---------------------------------------------------------- |
| 0.5%            | 5               | 2.5%            | Marginal ETS reporting accuracy                            |
| 0.5%            | 10              | 5.1%            | Noticeable CBAM cost reduction                             |
| 0.5%            | 20              | 10.5%           | **Competitive moat** — tender-winning efficiency           |
| 0.5%            | 30              | 16.1%           | **Market disruption** — fundamentally lower cost structure |

**The stacking effect explains why autoresearch ROI compounds:** early experiments yield modest gains, but the 700th experiment builds on all 699 previous improvements.

### 11.3 Technical Takeaways for Implementers

From the Karpathy nanochat results, three patterns apply directly to industrial autoresearch:

**1. Fix the Oversights**
Like Karpathy's parameterless QKnorm, identify where your model is "parameterless" or "unscaled" and let the agent find the multipliers. In industrial models: un-tuned default thresholds, hardcoded constants from initial deployment, forgotten configuration parameters.

**2. Regularize the Value**
If your model has specialized embeddings (Value, Position, Industry-specific), they likely need more regularization than you think. In industrial models: compliance scoring weights, risk factor coefficients, carbon intensity multipliers.

**3. The Stacking Discipline**
Every improvement must be validated as additive before stacking. A change that improves one metric but degrades another is not a "win" — it's a trade-off that requires human review. KYA enforces this through the Firehorse audit trail: every delta is recorded, every stack is ranked.

---

## 12. Field Note: Karpathy Autoresearch (March 2026)

> _This field note is the empirical foundation for KYA v1.4 Pillar 4. Full analysis in `docs/field-notes/2026-03-10-karpathy-autoresearch-nanochat-agent-swarm.md`._

Karpathy, three days ago:

> "I left autoresearch tuning nanochat for ~2 days on depth=12 model. It found ~20 changes that improved the validation loss. I tested these changes yesterday and all of them were additive and transferred to larger (depth=24) models. Stacking up all of these changes, today I measured that the leaderboard's 'Time to GPT-2' drops from 2.02 hours to 1.80 hours (~11% improvement), this will be the new leaderboard entry. So yes, these are real improvements and they make an actual difference. I am mildly surprised that my very first naive attempt already worked this well on top of what I thought was already a fairly manually well-tuned project.
>
> This is a first for me because I am very used to doing the iterative optimization of neural network training manually. You come up with ideas, you implement them, you check if they work (better validation loss), you come up with new ideas based on that, you read some papers for inspiration, etc etc. This is the bread and butter of what I do daily for 2 decades. Seeing the agent do this entire workflow end-to-end and all by itself as it worked through approx. 700 changes autonomously is wild. It really looked at the sequence of results of experiments and used that to plan the next ones. It's not novel, ground-breaking 'research' (yet), but all the adjustments are 'real', I didn't find them manually previously, and they stack up and actually improved nanochat. Among the bigger things e.g.:
>
> - It noticed an oversight that my parameterless QKnorm didn't have a scaler multiplier attached, so my attention was too diffuse. The agent found multipliers to sharpen it, pointing to future work.
> - It found that the Value Embeddings really like regularization and I wasn't applying any (oops).
> - It found that my banded attention was too conservative (i forgot to tune it).
> - It found that AdamW betas were all messed up.
> - It tuned the weight decay schedule.
> - It tuned the network initialization.
>
> ...All LLM frontier labs will do this. It's the final boss battle... You spin up a swarm of agents, you have them collaborate to tune smaller models, you promote the most promising ideas to increasingly larger scales, and humans (optionally) contribute on the edges.
>
> And more generally, _any_ metric you care about that is reasonably efficient to evaluate (or that has more efficient proxy metrics such as training a smaller network) can be autoresearched by an agent swarm. It's worth thinking about whether your problem falls into this bucket too. Do the same."

**KYA v1.4 implementation note:** The above workflow is now natively supported inside every MicroVM. All 700+ change proposals, validation deltas, and stack rankings are captured in the Firehorse trail. Unauthorized or out-of-scope autoresearch attempts instantly drop ATS by 40 points and freeze the session. This turns Karpathy's "wild" capability into enterprise-grade, auditable, financially quantifiable intelligence.

**Source:** github.com/karpathy/nanochat (autoresearch round 1 commit)

---

## 13. Autoresearch Optimization Protocol & Orchestrator Layer

### 13.1 The Orchestrator Layer (v1.4)

To move autoresearch from single-agent experiments to production-scale swarms, KYA v1.4 introduces the **Orchestrator Layer** — the system that manages the swarm, kills failing experiments early, and promotes the winners.

```
┌─────────────────────────────────────────────────────────────┐
│                    KYA ORCHESTRATOR                           │
│                                                             │
│  ┌─────────────┐                                            │
│  │ Experiment   │  Queue: 700+ proposed changes             │
│  │ Queue        │  Priority: expected delta × cost ratio    │
│  └──────┬──────┘                                            │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Worker α    │  │ Worker β    │  │ Worker γ    │  ...    │
│  │ MicroVM     │  │ MicroVM     │  │ MicroVM     │        │
│  │ depth=12    │  │ depth=12    │  │ depth=12    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│  ┌───────────────────────────────────────┐                  │
│  │ Validation Gate                        │                  │
│  │ • Delta > improvement_threshold?       │                  │
│  │ • Additive with previous winners?      │                  │
│  │ • Within budget cap?                   │                  │
│  │ • No security regression?              │                  │
│  └──────┬─────────────────┬──────────────┘                  │
│    PASS │            FAIL │                                  │
│         ▼                 ▼                                  │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ Promote to  │  │ Kill early  │  ← Save compute          │
│  │ depth=24    │  │ Log reason  │  ← Firehorse records     │
│  │ (staging)   │  │ Next in Q   │                          │
│  └──────┬──────┘  └─────────────┘                          │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────┐                                            │
│  │ Human Gate  │  72h staging → production                  │
│  │ (required)  │  Financial attribution recorded            │
│  └─────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

**Orchestrator Rules:**

| Rule                  | Purpose                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Early termination** | Kill experiments that show no improvement after N iterations — save compute budget |
| **Priority queue**    | Rank experiments by expected delta x cost ratio — run cheapest high-impact first   |
| **Parallel workers**  | Multiple MicroVMs run experiments simultaneously — limited by budget cap           |
| **Winner promotion**  | Validated improvements are stacked and promoted to larger-scale validation         |
| **Failure learning**  | Failed experiments are logged; the swarm uses failures to plan next experiments    |

This isn't just "better AI" — it's the **automation of the Scientific Method** itself, governed by KYA identity attribution and forensic observability.

### 13.2 The Principle

> "Any metric you care about that is reasonably efficient to evaluate can be autoresearched by an agent swarm." — Andrej Karpathy, March 2026

KYA has multiple tunable parameters that directly affect security posture and financial performance:

| Parameter                     | Current Value  | Tunable Range      | Impact                          |
| ----------------------------- | -------------- | ------------------ | ------------------------------- |
| ATS violation weight (Vx)     | 0.25           | 0.10–0.40          | False positive rate vs security |
| Latency penalty (L threshold) | 500ms          | 200ms–1000ms       | Performance vs security         |
| Denied access weight (Dx)     | 0.05           | 0.02–0.15          | Agent usability vs lockdown     |
| Autoresearch bonus (Ax)       | 0.15 (capped)  | 0.05–0.20          | Reward vs score inflation       |
| Trust recovery rate           | Manual         | 0.01–0.10 per hour | Session uptime vs caution       |
| Session TTL extension         | +5 on approval | +1 to +10          | Session efficiency              |
| Sandbox boot timeout          | 125ms          | 50ms–500ms         | Cost vs cold-start              |

### 13.3 Agent Swarm Optimization

Following the nanochat methodology, DWS IQ can deploy optimization agents to tune KYA parameters:

```
┌─────────────────────────────────────────────────────────┐
│              KYA Autoresearch Swarm                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Agent a  │  │ Agent b  │  │ Agent g  │  ...        │
│  │ Tune ATS │  │ Tune TTL │  │ Tune     │             │
│  │ weights  │  │ schedule │  │ egress   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
│       └──────────────┼──────────────┘                    │
│                      ▼                                   │
│            ┌──────────────────┐                          │
│            │ Validation       │                          │
│            │ Metric: ATS      │                          │
│            │ false-positive   │                          │
│            │ rate + breach    │                          │
│            │ detection rate   │                          │
│            └──────────────────┘                          │
│                      │                                   │
│                      ▼                                   │
│            ┌──────────────────┐                          │
│            │ Promote to       │                          │
│            │ larger-scale     │                          │
│            │ validation       │                          │
│            └──────────────────┘                          │
└─────────────────────────────────────────────────────────┘
```

**Optimization Loop:**

1. **Small-scale experiment** — Agent tests parameter change on synthetic KYA sessions (1,000 events)
2. **Validation metric** — Measure false-positive rate, breach detection rate, session uptime, cost per event
3. **Additive check** — Verify improvements are additive (stack with other changes)
4. **Promote** — Apply validated changes to staging environment with real agent traffic
5. **Production** — After 72h staging with no regressions, promote to production

### 13.4 Target Metrics for Autoresearch

| Metric                         | Current Baseline | Optimization Target | Financial Impact                                 |
| ------------------------------ | ---------------- | ------------------- | ------------------------------------------------ |
| False-positive suspension rate | ~5%              | < 2%                | +€30k/yr per enterprise (reduced agent downtime) |
| Breach detection latency       | < 1s             | < 200ms             | Insurance premium reduction                      |
| Session uptime                 | 94%              | > 98%               | +€15k/yr per enterprise (productivity)           |
| Verification cost per event    | €1.20            | < €0.80             | +33% margin improvement                          |
| Sandbox boot time              | 125ms            | < 80ms              | Better UX, higher adoption                       |

---

## 14. Agentic Commerce Mandate Gating (AP2 / UCP / ACP) — v1.11

KYA v1.7 and earlier governed what an agent may **do**; it said nothing about what an agent may **spend**. That gap closed externally in H1 2026: the payment industry shipped the wire formats for agent transactions, and none of them decide whether a given agent should be trusted to transact. KYA supplies that decision. This section is protocol-neutral by design — KYA gates mandates on all three rails.

### 14.1 Protocol Landscape (as of 06.07.2026)

| Protocol                              | Steward                                                                                                 | State                                      | What it standardizes                                                                                                                                                                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AP2** — Agent Payments Protocol     | Google → donated to **FIDO Alliance** (28.04.2026, v0.2)                                                | v0.2, ~60 member orgs                      | Three signed **Mandates** — Intent, Cart, Payment — each a **W3C Verifiable Credential**; **Human Not Present (HNP)** pre-authorized execution; **Verifiable Intent** tamper-proof action log (co-developed with Mastercard, donated to FIDO) |
| **UCP** — Universal Commerce Protocol | Google + Shopify + Walmart; Tech Council incl. Amazon, Meta, Microsoft, Salesforce, Stripe (24.04.2026) | Launched NRF 11.01.2026                    | Full commerce journey: discovery → cart → checkout → post-purchase                                                                                                                                                                            |
| **ACP** — Agentic Commerce Protocol   | OpenAI + Stripe                                                                                         | Live in ChatGPT production since late 2025 | Structured checkout flow inside agent surfaces; 4% platform fee                                                                                                                                                                               |

**KYA position:** the protocols define how a mandate is _carried_; KYA decides whether this agent may _hold_ one. AP2's HNP payments are precisely the scenario where a merchant, issuer, or insurer needs a checkable trust score before honoring a pre-authorization — that score is the ATS (§3).

### 14.2 Mandate Gating Rule

An agent may sign or present a payment-protocol mandate **only** within the privileges of its ATS band. Bands extend §3.2; enforcement point is the same pre-execution gate as path access — **implemented as `evaluateMandateGate()` in `src/identity/ats-engine.ts`**, evaluated before any mandate signature (test coverage: `src/__tests__/mandate-gate.test.ts`).

| ATS Range | Mandate privileges                                                      | Human Not Present                                | Decision       |
| --------- | ----------------------------------------------------------------------- | ------------------------------------------------ | -------------- |
| >= 0.90   | Intent + Cart + Payment                                                 | **Allowed**, within `spend_authority` ceilings   | GO + Transact  |
| 0.80–0.89 | Intent + Cart + Payment                                                 | Denied — human confirms above `per_task_ceiling` | GO (confirmed) |
| 0.50–0.79 | Intent + Cart only — agent assembles, a human signs the Payment Mandate | Denied                                           | GO (limited)   |
| < 0.50    | **No mandates** — consistent with §3.2 NO_GO                            | Denied                                           | NO_GO          |

A mandate attempt outside the band, or a spend attempt above a manifest ceiling, is a **KYA Violation**: same enforcement sequence as §9.2 (session terminated, −40 trust points, operator alerted), **plus revocation of all live mandates issued in that session**.

### 14.2.1 Tenant Policy Profiles (v1.9)

The §14.2 table is the **platform baseline profile**, not hardcoded policy. A defence contractor's Human Not Present ceiling is not a steel manufacturer's: each tenant carries a **mandate gating profile** that overrides the baseline, which is what makes one standard sellable across the 25 EU-regulated platform industries without forking it per vertical.

**Tighten-only rule.** A tenant profile may tighten any band, ceiling, or privilege; it may never loosen past two immovable platform floors:

1. **ATS < 0.50 = NO_GO under every profile.** No tenant configuration grants mandates to a suspended agent.
2. **The HNP minimum band (ATS ≥ 0.90) may be raised or HNP disabled entirely — never lowered.**

Everything else is tenant-settable: ceilings, currencies, merchant categories, allowed mandate types, HNP availability, per-band confirmation thresholds. Industry default profiles ship with the platform; the **Aegis tier** (the deliberately narrower 21-industry defence/dual-use scope) defaults to **HNP disabled and human-signed Payment Mandates regardless of ATS** — high trust score, still no unattended spend.

```json
{
  "mandate_gating_profile": {
    "profile_version": "1.0",
    "tenant_id": "<uuid>",
    "industry_default": "steel-manufacturing",
    "band_overrides": {
      "hnp_min_ats": 0.95,
      "confirm_above": { "ats_0.80_0.89": 50.0 }
    },
    "hnp_enabled": true,
    "platform_floors_ack": ["no_mandates_below_0.50", "hnp_min_0.90"]
  }
}
```

Profile changes are policy events: logged to the §14.5 evidence chain, signed by the tenant's HIC, and applied only to sessions started after the change (no retroactive loosening of a live session's gates).

> **Schema stability:** the JSON above is **illustrative until KYA v2.0** — quote the policy semantics (tighten-only rule, immovable floors), not the field names. The executable validator (`tenantGatingProfileSchema`, `src/identity/ats-engine.ts`) is the normative shape at any point in time.

### 14.3 Capability Manifest v1.3 — `spend_authority` Extension

The Capability Manifest (§9.1) gains a spend-authority block. Absent block = zero spend authority (deny-by-default).

```json
{
  "manifest_version": "1.3",
  "spend_authority": {
    "currency": "EUR",
    "per_task_ceiling": 100.0,
    "per_day_ceiling": 500.0,
    "allowed_merchant_categories": ["cloud-compute", "data-services"],
    "mandate_types_allowed": ["intent", "cart"],
    "human_not_present": false,
    "protocols": ["ap2", "acp", "ucp"],
    "hic": "<verified-human-identity-ref>"
  }
}
```

`hic` binds spend authority to the verified human (Pillar 1 / L1 identity attribution) who is accountable for it — no anonymous spend authority, ever.

> **Schema stability:** the JSON above is **illustrative until KYA v2.0** — buyer-facing materials quote the commitments (deny-by-default, HIC binding, ceilings), not the field names, which may track AP2's VC vocabulary as FIDO moves it toward 1.0.

### 14.4 Manifests as W3C Verifiable Credentials

AP2 mandates travel as W3C Verifiable Credentials. Capability Manifests SHOULD be expressible in the same envelope, so a counterparty can verify the agent's KYA manifest and its AP2 mandate in **one trust chain**: verified human → signed manifest (with ATS at signing, §9.1 `kya_score_at_sign`) → signed mandate. This turns the ATS from an internal score into a portable, checkable credential — the agent's track record, presentable at transaction time.

### 14.5 One Evidence Chain: Verifiable Intent ↔ KYA Forensics ↔ Article 12

AP2's Verifiable Intent log (tamper-proof record of user-authorized agent actions) maps onto the existing KYA forensic trail. Rule: **every mandate event (issue, present, execute, revoke) is logged to both** the Firehorse audit trail and the Article 12 record-keeping layer (`DWS_ARTICLE_12_LOGGING_STANDARD.md`), keyed by `session_id` + mandate VC id. The result is a single evidence chain that satisfies the payment network _and_ the EU AI Act deployer obligation — the differentiator none of the three (US-led) protocols address.

### 14.6 Governance Tracking

- AP2 governance now sits at the **FIDO Alliance**; KYA tracks FIDO releases and adopts mandate-format changes from there, not from any single vendor.
- Stripe sits in both the ACP and UCP camps — protocol consolidation is likely; KYA remains rail-agnostic and re-maps §14.2 privileges onto whichever mandate vocabulary survives.
- Review trigger: any AP2/UCP/ACP change to mandate types, HNP semantics, or VC format reopens this section.

### 14.7 Verified-Done Attestation (v1.10)

§14.4 makes the agent's manifest portable _before_ it transacts; §14.5 logs every mandate event to one evidence chain. §14.7 closes the loop on the far side: once a mandate has executed, KYA issues a **Verified-Done Attestation** — a W3C Verifiable Credential attesting that _this_ mandate completed under KYA governance, at a stated ATS, gated by a recorded decision, and written to the Article 12 evidence chain. It is the **terminal link of the §14.4 trust chain**: verified human → signed manifest → signed mandate → **verified-done attestation**. A counterparty (merchant, escrow, insurer, auditor) can then check that the agent did what it was authorized to do, instead of trusting the claim blind — the portable proof of completion, not just of authorization.

Two rules carry through from the gate, unchanged:

1. **Deny-by-default holds.** A mandate the gate did **not** allow cannot be attested done — there is no "verified-done" for a denied or violating mandate.
2. **No anonymous attestation.** The HIC binding of §14.3 is required on the credential subject; an attestation without an accountable verified human is refused.

Issuing an attestation is itself a mandate lifecycle event: it is recorded as a **`mandate.attest`** event on the §14.5 evidence chain (hash-chained, keyed `session_id` + mandate VC id) **and** stored as the issued credential for later presentation or revocation. Revocation is a status transition on the credential (`unsigned → signed → revoked`), never a deletion — the evidence chain is append-only.

**Signing is deferred to v2.0.** The credential is minted **unsigned** (`proofStatus: 'unsigned'`, no `proof` block). Cryptographic signing (Ed25519 / Data Integrity Proof) waits on the KYA v2.0 key-management decision — which DID method, and where the issuer key lives. Issuance time and issuer reference are caller-supplied, so the credential is deterministic and KYA holds no clock or key authority over a portable artifact.

```json
{
  "@context": ["https://www.w3.org/ns/credentials/v2", "https://standards.dws.eu/kya/v1"],
  "type": ["VerifiableCredential", "KYAVerifiedDoneCredential"],
  "issuer": "<issuer-did-or-ref>",
  "validFrom": "<iso-8601>",
  "credentialSubject": {
    "id": "urn:kya:mandate:<mandate_vc_id>",
    "hic": "<verified-human-identity-ref>",
    "protocol": "ap2",
    "mandateType": "payment",
    "atsAtExecution": 0.95,
    "kyaVerified": true,
    "article12TraceId": "<trace-id>"
  }
}
```

> **Schema stability:** the JSON above is **illustrative until KYA v2.0** — quote the commitments (portable proof-of-completion, deny-by-default and HIC binding carried through, revocation-not-deletion), not the field names, which may track AP2's VC vocabulary as FIDO moves it toward 1.0. The normative shapes are the `VerifiedDoneAttestation` / `AttestationInput` interfaces (`src/identity/types.ts`) and the issuer `issueVerifiedDoneAttestation()` (`src/identity/ats-engine.ts`, tests in `src/__tests__/verified-done-attestation.test.ts`); the storage shape is `kya_verified_done_attestations` + the `mandate.attest` event type (`supabase/migrations/079_kya_verified_done_attestation.sql`).

### 14.7.1 Signing & Key Custody (v2.0 target design)

§14.7 mints attestations **unsigned** today. This subsection fixes the signing and key-custody model **v2.0 implements**, chosen so a credential never asks a counterparty to trust infrastructure outside the tenant's jurisdiction — the invariant the whole standard rests on: **the private signing key never leaves the tenant's jurisdiction; DWS holds only the root CA for cross-tenant verification.**

**Signature suite — Ed25519 (EdDSA), hardware-backed.** The issuer key lives in a hardware key store and never leaves it. Ed25519 is where the EUDI Wallet and EU member-state eID schemes are converging; it keeps the proof compact for agent-to-agent payloads and for every Article 12 log entry, and it avoids RSA's size overhead at logging scale. First securing format is a JWS-enveloped VC (EdDSA); a Data Integrity proof (`eddsa-rdfc-2022`) is added only if an AP2/FIDO counterparty requires it (no RDF canonicalization on spec).

**Issuer identity — `did:web`, DNS-rooted.** Each issuer is a `did:web` resolved from a `.well-known` endpoint on a domain the issuer controls — DNS-rooted authority with no public ledger or external registry, so resolution stays inside the sovereignty boundary. This gives an auditor or regulator a resolvable, institutionally-anchored answer to "who issued this," which `did:key` cannot.

**Key custody by deployment tier** — signing authority never leaves the tenant's jurisdiction:

| Tier                               | Issuer key custody                                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Aegis Defence (on-prem DGX Spark)  | Tenant physically holds all key material on-prem; DWS holds nothing.                                                    |
| Standard / Sovereign (UpCloud UKS) | Key in the tenant's UpCloud UKS HSM; the HSM enforces that only the tenant's authenticated admin can rotate.            |
| Never                              | A shared/foreign cloud KMS — that moves signing authority outside jurisdiction and voids the KYA sovereignty guarantee. |

**Key hierarchy — one issuer key per tenant at v2.0; per-agent delegation at v2.1.** v2.0 ships a single issuer key per tenant (simplest to operate, enough to prove the attestation flow in production). v2.1 adds a root-CA → per-agent signing-key hierarchy for granular revocation if a single agent is compromised — deferred until the flow is proven, to keep v2.0 key management simple.

**Rotation — tenant-controlled, no escrow moment.** When a key expires, the tenant's admin generates a new key pair and publishes the updated DID document to their `.well-known` endpoint. DWS never holds the tenant's private key, so there is no handoff or escrow. The **DWS root CA counter-signs the tenant's DID-document update** to preserve cross-tenant verification continuity, but the rotation itself is fully tenant-controlled. A tenant that loses its key material has an operational-recovery problem on its side — not a sovereignty gap, and not a DWS escrow obligation. On the UpCloud UKS tier the HSM enforces that only the authenticated tenant admin can trigger rotation; on the Aegis Defence on-prem tier the tenant physically holds everything.

---

## 15. Conclusion

The KYA Standard v1.4 delivers **agent self-optimization governance** — the infrastructure for autonomous agents that improve themselves safely, auditably, and with financial accountability. Hardware isolation, real-time identity triggers, governed autoresearch, and the Orchestrator Layer make enterprise agent swarms audit-ready and liability-contained.

KYA v1.4 turns autonomous self-optimization from a research curiosity into enterprise-grade, financially quantifiable intelligence across 20 industries — from EU climate compliance to fintech, pharma, and cybersecurity. CISOs get the audit trail. CTOs get the efficiency gains. The board gets liability containment.

The Agentic Efficiency Law guarantees that every deployed model has room for improvement. The Stacking Effect guarantees that those improvements compound. The Orchestrator Layer manages the swarm at scale. And KYA governance ensures that every optimization is attributed, auditable, and owned.

### Identity Provider Integration Points

| KYA Layer                 | Required Capability                         | Protocol                      |
| ------------------------- | ------------------------------------------- | ----------------------------- |
| L1 — Identity Attribution | Real-time IDV (document + face match + AML) | REST API, < 30s response      |
| L2 — Agent Provenance     | KYB (business/organization verification)    | REST API                      |
| L5 — Continuous Risk      | Risk change notifications                   | Webhook (push), < 5s delivery |

Every BYO agent deployed in the DWS10 ecosystem generates a verification event. With 19 industries, multi-agent sessions, and autoresearch loops, this creates volume at scale — not one-off KYC checks.

---

**Implement today. The swarm is already tuning. KYA makes sure it stays yours.**

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Platform:** dws10.com
**Whitepaper:** dws10.com/kya-standard/whitepaper/
**Legal Hub:** Legal/
