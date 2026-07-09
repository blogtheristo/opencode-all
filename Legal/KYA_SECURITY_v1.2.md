# KYA Standard v1.2 — Know Your Agent: Identity, Isolation & Forensics

---

# VERSION AND AGENT HISTORY

Version: 1.8

Sessions & Modifications:

- Version: 1.8 | Tool: Claude Code (Sonnet 5) | Session: claude/kya-mandate-evidence-migration-mq7hnp | Date: 07.07.2026 | Changes: Added §12 Agentic Commerce Mandate Gating — Enforcement (v1.9), syncing the KYA_STANDARD_v1.md §14 mandate-gate rule into the enforcement/violation side — extends the §9.2 KYA Violation sequence with mandate revocation, documents the §14.5 evidence chain backed by `supabase/migrations/074_kya_mandate_evidence_chain.sql` (`kya_mandate_events` append-only hash chain, `kya_tenant_gating_profiles` tighten-only floor enforcement). Renumbered §12 Conclusion → §13
- Version: 1.7 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Added §11 Systems Inventory & Policy Gate — KYA absorbs the governance/inventory responsibility for Aegis-tier customers where no EU-incorporated alternative to Credo AI / Holistic AI / OneTrust / IBM Watsonx Governance exists. Defines ai_systems_registry, governance_policies, policy_decisions, deployment_approvals tables. Renumbered §11 Conclusion → §12. Companion to `DWS_ARTICLE_12_LOGGING_STANDARD.md` and `Store/PRODUCT_THEMIS.md`. Triggered by Nokia Defence demo need
- Version: 1.6 | Tool: Claude Code (Opus 4.6) | Session: claude/aegis-swot-analysis-gYCYG | Date: 05.04.2026 | Changes: Article 99 citation sweep in §8.1 D&O Insurance — softened "safe harbor" positioning to "deployer evidence infrastructure (Art. 12 + Art. 26) for D&O AI-governance coverage — not a categorical safe harbor"; corrected Art. 99 citation to Art. 99(4) per PR #976 sweep pattern
- Version: 1.5 | Tool: Claude Code (Opus 4.6) | Session: claude/agent-memory-fact-extraction-gLEss | Date: 23.03.2026 | Changes: Added Section 10 Memory Audit Trail — court-defensible provenance for agent memory mutations (store, supersede, forget, extract); fact extraction governance (PR-254 wiring); memory contradiction resolution requires KYA attestation before PR-255 deployment; CSRD/EU AI Act Article 12 compliance for AI-generated memory; added memory_audit_log schema; cross-referenced Admin/ADMIN_MANUAL_AGENT_MEMORY_EN_v1.md
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/kya-standard-review-W3Qcg | Date: 13.03.2026 | Changes: External review integration — ATS Hard Stop (V>0 nullifies A factor, §3.1). Cold-Start Latency Penalty added to L factor (§4.1). 5ms behavioral guardrail confirmed as security containment (§2.5). U.S. Executive Order 14110 + OECD AI Principles added to compliance (§8). D&O Insurance safe harbor positioning (§8.1). KYA-S/KYA-O internal naming convention (§1). Tiered Fault Attribution fees by industry risk (§9.5)
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Marcus review integration — Added SOC 2 Type II and ISO 42001 (AI Management Systems) to compliance alignment (§8). Dual acronym KYA retained as tiered entry strategy: "The Shield" (Know Your Agent) sells to the CISO so the CTO can use "The Sword" (Know Your Architecture)
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Split from combined KYA Standard v1.1 — Know Your Agent (security) separated from Know Your Architecture (financial/optimization). Added Agent Identity Watermarking (§2.4), Behavioral Guardrails (§2.5). Cross-references updated to companion standard KYA_OPTIMIZATION_v1.4.md
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/update-kya-standard-1.1-3sL7X | Date: 09.03.2026 | Changes: Combined KYA Standard — Subagent Registry, Capability Manifests, path-scoped access control, KYA Violation enforcement, Fault Attribution, Agent Trust Score formula (see Legal/KYA_STANDARD_v1.md — public document)
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/sandbox-industrial-models-GXxbN | Date: 09.03.2026 | Changes: Initial KYA Standard — Three Pillars (see Legal/KYA_STANDARD_v1.md — public document)

Document Status:

- Created: 09.03.2026
- Last Modified: 05.04.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE
- Classification: PARTNER
- Document Type: Technical Standard / Security Architecture

Related Documents:

- Legal/KYA_STANDARD_v1.md (Parent: Combined KYA Standard v1.0–v1.1 — public document)
- Legal/KYA_OPTIMIZATION_v1.4.md (Companion: Know Your Architecture v1.4 — financial layer, autoresearch, orchestrator)
- Legal/KYA_NIST_STANDARD_v1.md (NIST derivative: KYA-NIST-SP-001)
- Legal/KYA_NIST_SECURITY_v1.md (NIST derivative: KYA-NIST-SP-002 — TPM 2.0 hardware attestation)
- DWS_SECURITY_STANDARD.md (Section 18 — KYA & BYO Agent Security)
- docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md (Partnership field note)
- docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md (Technical requirements for Shufti)
- src/cloudflare/tenant-sandbox.ts (Sandbox isolation implementation)
- src/identity/ats-engine.ts (ATS engine implementation)

---

**DWS IQ Platform | Lifetime Oy**
**Version:** KYA Security Standard v1.5 (KYA-S)
**Status:** Implementation Ready (Q1 2026 Launch)
**Lead Architect:** Risto Anton, Lifetime Oy
**Date:** March 2026
**Companion Standard:** `Legal/KYA_OPTIMIZATION_v1.4.md` (Know Your Architecture — financial layer, autoresearch, orchestrator)

---

> **Verify the Human. Sandbox the Agent. Secure the Intent.**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Three Pillars of KYA (+ Security Extensions)](#2-the-three-pillars-of-kya)
3. [Agent Trust Score (ATS)](#3-agent-trust-score-ats)
4. [Technical Architecture: Hardware-Level Isolation](#4-technical-architecture-hardware-level-isolation)
5. [Use Case: The Multi-Agent Control Room](#5-use-case-the-multi-agent-control-room)
6. [Sandbox Stages](#6-sandbox-stages)
7. [BYO Agent Registration Flow](#7-byo-agent-registration-flow)
8. [Compliance Alignment](#8-compliance-alignment)
9. [Subagent Registry (v1.1)](#9-subagent-registry-v11)
10. [Conclusion](#10-conclusion)

---

## 1. Executive Summary

The **Know Your Agent (KYA)** standard answers a question that no existing compliance framework addresses:

> **What is your agent doing, and can we trace it back to you?**

As enterprises deploy autonomous AI agents — their own and third-party "BYO" (Bring Your Own) agents — into industrial control rooms, a critical governance gap emerges. KYC (Know Your Customer) verifies identity. KYB (Know Your Business) verifies organizations. But neither addresses the autonomous actions that AI agents take on behalf of verified humans and entities.

**KYA is the security foundation.** This standard defines the "No" — identity attribution, capability gating, forensic observability, and the hardware isolation that makes BYO agents safe. For the "More" — financial value, autoresearch optimization, and agent swarm governance — see the companion standard: `Legal/KYA_OPTIMIZATION_v1.4.md`.

**Internal Naming Convention (v1.4):** To avoid acronym collision during audits, internal documentation uses **KYA-S** (Security — Know Your Agent) and **KYA-O** (Optimization — Know Your Architecture). External marketing retains "KYA Standard" with the tagline: _"We give you the Identity to trust the agent and the Architecture to profit from it."_

KYA bridges this gap with three pillars (plus two security extensions in v1.2):

1. **Identity Attribution** — Every agent session is cryptographically anchored to a KYC-verified human or entity
2. **Capability Gating** — Agent permissions are dynamically adjusted based on real-time risk signals
3. **Forensic Observability** — An immutable audit trail links every agent action to its verified owner
4. **Agent Identity Watermarking** (v1.2) — Cryptographic provenance embedded in every agent output
5. **Behavioral Guardrails** (v1.2) — Pre-execution boundary enforcement beyond path-level gating

---

## 2. The Three Pillars of KYA (+ Security Extensions)

### 2.1 Pillar 1: Identity Attribution — The Anchor

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

### 2.2 Pillar 2: Capability Gating — The Leash

Using real-time risk telemetry (via API partners), DWS IQ dynamically adjusts an agent's permissions. If a user's risk profile fluctuates, the agent's compute, memory, and API access are throttled in milliseconds.

**Dynamic Permission Model:**

| Risk Signal                 | Response Time | Action                                   |
| --------------------------- | ------------- | ---------------------------------------- |
| AML flag raised             | < 5 seconds   | Egress blocked, sandbox restricted       |
| Document expired            | < 30 seconds  | Session paused, re-verification required |
| Anomalous behavior detected | < 1 second    | Hypervisor trap, session frozen          |
| Risk score recovery         | < 10 seconds  | Permissions restored to previous level   |

### 2.3 Pillar 3: Forensic Observability — The Firehorse Audit Trail

The Lifetime Firehorse product line serves as the ecosystem's tamper-proof "flight recorder." It captures a sub-second telemetry stream of every syscall and network request, providing an immutable audit trail bridging agent behavior to human identity.

**What Firehorse Records:**

| Layer           | Data Captured                             | Retention                      |
| --------------- | ----------------------------------------- | ------------------------------ |
| Syscall         | All file I/O, process spawns, IPC         | 90 days (configurable)         |
| Network         | Every egress/ingress request, DNS lookups | 90 days                        |
| MCP Tool        | Tool invocations, parameters, responses   | 1 year                         |
| Token Usage     | Input/output tokens per agent per session | 1 year                         |
| Identity Events | KYA score changes, permission adjustments | 5 years (EU AI Act Article 12) |

**Audit Chain:**

```
Agent Syscall → Firehorse Telemetry → KYA Session → Verified Identity
     │                  │                  │              │
     └──── timestamp ───┴──── session_id ──┴──── user_id ─┘
                    Immutable Forensic Record
```

### 2.4 Agent Identity Watermarking (v1.2)

Every output produced by a KYA-governed agent carries a **cryptographic watermark** that embeds provenance metadata directly into the output. This enables post-hoc attribution even when outputs are forwarded, copied, or integrated into downstream systems.

**Watermark Payload:**

| Field         | Content                           | Purpose                    |
| ------------- | --------------------------------- | -------------------------- |
| `agent_id`    | UUID of producing agent           | Which agent                |
| `session_id`  | KYA session token                 | Under whose authority      |
| `timestamp`   | ISO-8601 production time          | When                       |
| `output_hash` | SHA-256 of output content         | Tamper detection           |
| `kya_score`   | ATS at time of production         | Trust level at output time |
| `hmac`        | HMAC-SHA256 signed by session key | Authenticity verification  |

**Properties:**

- Watermarks are embedded as metadata headers in structured outputs (JSON, XML, API responses)
- For unstructured outputs (text, reports), watermarks are stored as sidecar records in Firehorse
- Watermarks survive agent session termination — they are part of the immutable audit trail
- Verification: any party with the KYA public key can verify watermark authenticity

**Use Cases:**

- Trace a compliance report back to the exact agent, session, and identity that produced it
- Detect if an agent output has been tampered with after production
- Resolve disputes: "Which agent produced this calculation?" → watermark answers instantly

### 2.5 Behavioral Guardrails (v1.2)

Beyond path-level access control (Pillar 2) and post-hoc forensics (Pillar 3), v1.2 introduces **pre-execution behavioral guardrails** — constraints evaluated _before_ an agent action executes, not after.

**Guardrail Categories:**

| Category                 | Enforcement Point                   | Example                                                                              |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------ |
| **Semantic Boundary**    | Pre-execution intent classifier     | Agent attempting financial transaction when authorized only for reporting → BLOCK    |
| **Rate Limiting**        | Per-action throttle at VMM layer    | Agent attempting >100 API calls/minute → THROTTLE to 10/min                          |
| **Output Volume**        | Pre-send output size check          | Agent attempting to exfiltrate >10MB in single response → BLOCK + alert              |
| **Temporal Boundary**    | Session clock enforcement           | Agent operating outside authorized time window → SUSPEND                             |
| **Cross-Agent Boundary** | Inter-MicroVM communication monitor | Agent attempting to pass data to another agent outside declared dependencies → BLOCK |

**Guardrail Enforcement Flow:**

```
Agent Intent Declared
    │
    ▼
┌─────────────────────────────┐
│ Guardrail Evaluation        │  < 5ms evaluation time
│ (Pre-execution)             │
│                             │
│ ✓ Semantic: within scope?   │
│ ✓ Rate: within limits?      │
│ ✓ Volume: within bounds?    │
│ ✓ Temporal: within window?  │
│ ✓ Cross-agent: declared?    │
└─────────────┬───────────────┘
         PASS │         FAIL
              │              │
              ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Execute      │  │ BLOCK/THROT  │
│ Action       │  │ Log to FH    │
│              │  │ ATS impact   │
└──────────────┘  └──────────────┘
```

**Key Principle:** Guardrails are evaluated in < 5ms. They must never become a performance bottleneck. The intent classifier uses a lightweight policy engine (not an LLM call) for speed.

**Architectural Decision (v1.4):** The 5ms behavioral guardrail lives in **KYA-S (Security)**, not KYA-O (Optimization). Even though guardrails contribute to efficiency by killing failing experiments early, their primary function is **containment**. If guardrails were classified as a "performance feature" in the optimization standard, CISOs would discount their security validity. Guardrails are "The No." They stay in the security standard to justify the "Forensic Observability" pillar.

---

## 3. Agent Trust Score (ATS)

### 3.1 Formula (Security Baseline)

```
ATS_Base = max(0, 1.0 - V×0.25 - L - D×0.05)

V = KYA_VIOLATION count       (4 violations = zero trust)
L = 0.10 if avg_latency > 500ms (+ Cold-Start Latency Penalty, see §4.1)
D = DENIED path access attempts
```

**The V > 0 Hard Stop (v1.4 CRITICAL):** If `V > 0`, the autoresearch improvement factor `A` is **automatically nullified** in the companion optimization standard. You cannot optimize your way out of a security violation. This is enforced at the ATS engine level:

```
ATS_Final = ATS_Base × (1 + A)    where A = 0 if V > 0
```

An agent may be highly "optimal" (high A) but fundamentally "leaky" (moderate V). Under the previous additive formula, such an agent could maintain a high score. The multiplicative formula with the V > 0 gate eliminates this inflation vector entirely.

**Note:** The companion standard `Legal/KYA_OPTIMIZATION_v1.4.md` extends ATS with the autoresearch improvement factor. The A factor is only active when `V = 0` (zero violations). A must be validated against the Industry Proxy Metric (Optimization §9) to prevent agents "marking their own homework." This security standard uses `ATS_Base` without the A factor — security scoring is never inflatable by optimization performance.

**Implementation:** `src/identity/ats-engine.ts` — evaluated before external IDV calls.

### 3.2 KYA Trust Score Ranges

| ATS Range | KYA Score | Permission Level                  | Decision         |
| --------- | --------- | --------------------------------- | ---------------- |
| >= 0.80   | >= 80     | Full sandbox access               | **GO**           |
| 0.50–0.79 | 50–79     | Restricted access                 | **GO** (limited) |
| < 0.50    | < 50      | Suspended — human review required | **NO_GO**        |
| = 0.00    | = 0       | Frozen — agent terminated         | **NO_GO**        |

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

**Cold-Start Latency Penalty (v1.4):** Excessive MicroVM cycling (boot → terminate → boot) is penalized in the L factor to discourage agents from gaming isolation by rapidly spinning up fresh sandboxes. If an agent triggers >5 cold starts within a 1-hour window, the L factor applies a cumulative penalty:

```
L_cold = 0.02 × (cold_starts - 5)    (added to base L factor)
```

This discourages patterns where an agent terminates its own sandbox to shed audit trail state and immediately re-enters with a clean session.

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

A Tier-1 client initiates a complex task in the Control Room. The client simultaneously deploys four heterogeneous agents:

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

### 5.1 The Industrial Models

Each model runs in its own sandbox within the Control Room, serving EU-regulated and high-value industries:

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

**+ Tier 3: Wedge Industries** (see `Legal/KYA_OPTIMIZATION_v1.4.md` §5.3) 17. Fintech & Trading | 18. Pharma & Biotech | 19. Cybersecurity

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
└─────────────────────────────┘
```

---

## 8. Compliance Alignment

| Regulation                            | KYA-S Coverage                                                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EU AI Act** (Article 12)            | Forensic logging, human oversight, traceability                                                                                                                               |
| **EU AI Act** (Article 14)            | Human-in-the-loop via KYA score thresholds                                                                                                                                    |
| **NIS2 Directive**                    | Supply chain security for BYO agents, incident reporting                                                                                                                      |
| **GDPR**                              | Data residency (EU-only), right to erasure (agent data)                                                                                                                       |
| **Fit for 55**                        | Industrial models comply with ETS/CBAM/CSRD                                                                                                                                   |
| **DORA**                              | ICT risk management for financial sector agents                                                                                                                               |
| **SOC 2 Type II**                     | Trust services criteria (security, availability, processing integrity) — required for US enterprise sales                                                                     |
| **ISO 42001**                         | AI Management Systems — emerging international standard for AI governance, gaining traction faster than expected                                                              |
| **U.S. Executive Order 14110** (v1.4) | "Dual-Use Foundation Models with Widely Available Weights" reporting requirements — KYA audit trail satisfies provenance and safety reporting obligations for US market entry |
| **OECD AI Principles** (v1.4)         | Essential for global Tier 1 maritime/aviation sectors — KYA maps to all 5 OECD principles (inclusive growth, human-centred values, transparency, robustness, accountability)  |

### 8.1 D&O Insurance Safe Harbor (v1.4)

**Directors & Officers Liability:** Position KYA-S as deployer evidence infrastructure (Art. 12 + Art. 26) for D&O AI-governance coverage — not a categorical safe harbor. Board members deploying AI agents without documented Art. 12 + Art. 26 evidence face personal liability under EU AI Act Art. 99(4) and national corporate governance codes.

**KYA-S provides the defense:**

- Identity attribution proves _which agent_ produced the flawed output (not "our AI")
- Fault attribution separates LOGIC_FAULT from OPERATOR_FAULT — isolating director decisions from agent failures
- Forensic observability provides the "reasonable measures" evidence D&O insurers require
- Behavioral guardrails (§2.5) demonstrate pre-execution controls were in place

**Target:** 8–12% D&O premium reduction for enterprises with KYA-S certification, positioned alongside cyber liability savings.

---

## 9. Subagent Registry (v1.1)

Every subagent initialized within the DWS IQ platform must register with the **Subagent Registry** and sign a local **Capability Manifest** before execution begins. This ensures that testing and sandbox environments enforce the same identity-gated access controls as production.

### 9.1 Capability Manifest

Upon initialization, each subagent signs a Capability Manifest declaring its permitted resource paths. The manifest is immutable for the duration of the session.

**Default Testing Manifest:**

| Path             | Access     | Description                                        |
| ---------------- | ---------- | -------------------------------------------------- |
| `/mock-api/`     | Read/Write | Mock API endpoints for testing                     |
| `/temp-db/`      | Read/Write | Temporary database for sandbox operations          |
| `/prod-secrets/` | **DENIED** | Production secrets — access triggers KYA Violation |

**Manifest Schema v1.1:**

```json
{
  "manifest_version": "1.1",
  "subagent_id": "<uuid>",
  "session_id": "<kya-session-token>",
  "signed_at": "<ISO-8601>",
  "permitted_paths": ["/mock-api/", "/temp-db/"],
  "denied_paths": ["/prod-secrets/"],
  "ttl_seconds": 3600,
  "kya_score_at_sign": 85
}
```

**Note:** Manifest v1.2 (with autoresearch extensions) is defined in `Legal/KYA_OPTIMIZATION_v1.4.md` §4.

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
│ Step 2: Manifest Signing    │  Agent signs Capability Manifest v1.1
│ Permitted: /mock-api/,      │  Declares permitted and denied paths
│           /temp-db/         │  Manifest is immutable for session
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 3: Sandbox Execution   │  Agent operates within manifest bounds
│ Path monitor active         │  Every resource access checked against manifest
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Step 4: Violation Response  │  On denied path access:
│ /prod-secrets/ → TERMINATE  │  Log KYA Violation → Kill session → Alert
└─────────────────────────────┘
```

### 9.4 Fault Attribution (Liability Mapping)

When a subagent produces an incorrect result or triggers a violation, the system must determine **which component is at fault** — the Logic Subagent (reasoning/planning layer) or the Integration Mock/Adapter (external API bridge). Fault attribution records are stored separately in **Supabase** (`kya_fault_attribution` table) to enable post-incident analysis and liability assignment.

**Fault Classification:**

| Fault Class         | Responsible Component    | Example                                                                             |
| ------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `LOGIC_FAULT`       | Logic Subagent           | Agent produced incorrect calculation, hallucinated data, or violated business rules |
| `INTEGRATION_FAULT` | Integration Mock/Adapter | Mock returned stale data, API timeout, schema mismatch                              |
| `MANIFEST_FAULT`    | Capability Manifest      | Manifest too permissive or missing deny rules                                       |
| `OPERATOR_FAULT`    | Human Operator           | Misconfigured agent parameters, wrong model selected                                |

**Note:** The `AUTORESEARCH_FAULT` class is defined in `Legal/KYA_OPTIMIZATION_v1.4.md` §4.2 for agents running self-optimization loops.

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
│ Manifest vs Operator        │  vs external API vs config)
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

### 9.5 Tiered Fault Attribution Fees by Industry Risk (v1.4)

Fault attribution investigation costs vary by industry risk tier. Higher-risk industries (Tier 1) involve regulatory exposure, physical safety, and environmental liability — justifying higher investigation fees and faster SLA.

| Industry Tier                    | Fault Investigation Fee (EUR) | SLA (resolution time)      | Rationale                                                                    |
| -------------------------------- | ----------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| **Tier 1** (Critical Emissions)  | EUR 15.00 per fault record    | 4h (CRITICAL), 24h (HIGH)  | ETS/CBAM regulatory exposure, physical safety risk, carbon penalty liability |
| **Tier 2** (Important Emissions) | EUR 8.00 per fault record     | 8h (CRITICAL), 48h (HIGH)  | Moderate regulatory exposure, supply chain impact                            |
| **Tier 3** (Wedge Industries)    | EUR 5.00 per fault record     | 12h (CRITICAL), 72h (HIGH) | High agent density but lower physical safety risk                            |

**Escalation:** If a fault in any tier triggers a `KYA_VIOLATION` (§9.2), the investigation fee doubles and a mandatory post-incident review is scheduled within 48h. For Tier 1 CRITICAL faults affecting physical systems (Power, Steel, Cement, Construction), a real-time incident bridge is activated.

---

## 10. Memory Audit Trail (v1.5)

_Added: 23.03.2026 | PR-254 (agent-memory-fact-extraction)_

Agent memory is a security surface. When agents store facts about customers, resolve contradictions between conflicting memories, or forget data on GDPR request, each mutation must be **attributed, timestamped, and immutably logged** — or the memory system becomes an unauditable black box that fails compliance review.

### 10.1 Memory Mutations Requiring KYA Attestation

| Operation     | Security Concern                                 | KYA Requirement                                                                                |
| ------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Store**     | Agent writes arbitrary data to persistent memory | Log agent_id, source, confidence, org_id; validate against Capability Manifest                 |
| **Supersede** | Agent replaces existing fact with new one        | Log old_memory_id, new_memory_id, reason, agent_id; **human review if confidence delta > 0.3** |
| **Forget**    | Agent soft-deletes memory (GDPR, correction)     | Log memory_id, reason, agent_id; immutable audit entry (forget is never hard-delete)           |
| **Extract**   | Agent extracts facts from conversation text      | Log source_text_hash (not content — privacy), facts_count, agent_id, confidence scores         |

### 10.2 Contradiction Resolution Governance

When a new fact contradicts an existing fact (e.g., "ACME has 250 employees" superseded by "ACME has 300 employees"), the KYA audit trail must capture:

```
MEMORY SUPERSEDE AUDIT LOG:
  timestamp:      2026-03-23T14:30:00Z
  agent_id:       compliance-agent-001
  agent_ats:      0.87
  old_memory_id:  mem-abc-123
  old_content:    "ACME has 250 employees"
  old_confidence: 0.9
  new_memory_id:  mem-def-456
  new_content:    "ACME has 300 employees"
  new_confidence: 1.0
  new_source:     "annual-report-2025"
  reason:         "temporal_supersede: newer source with higher confidence"
  kya_decision:   "auto_approved (confidence_delta < 0.3)"
  firehorse_log:  "FH-2026-03-23-14300"
```

**Hard rule:** Contradiction resolution (PR-255) MUST NOT ship without this KYA audit trail. Resolving memory conflicts with no provenance for _why_ one fact superseded another fails CSRD audit and EU AI Act Article 12 logging requirements.

### 10.3 Fact Extraction Governance

The fact extraction pipeline (PR-254) converts unstructured conversation text into structured subject-predicate-value triples. KYA governs this process:

| Guardrail                | Enforcement                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **Extraction scope**     | Agent Capability Manifest must declare `memory:extract` permission                   |
| **Confidence floor**     | Facts below 0.7 confidence are NOT persisted (configurable per tenant)               |
| **Source attribution**   | Every extracted fact carries `source: "fact-extraction"` + source_text_hash          |
| **Duplicate prevention** | Cosine similarity > 0.95 triggers dedup, not double-store                            |
| **PII filtering**        | Extraction prompt explicitly prohibits extracting personal data without consent flag |
| **Rate limiting**        | Max 100 fact extractions per agent per hour (prevent memory flooding)                |

### 10.4 Memory Audit Log Schema

```sql
-- Extends existing memory_audit_log table
CREATE TABLE IF NOT EXISTS memory_audit_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation     text NOT NULL CHECK (operation IN ('store', 'supersede', 'forget', 'extract')),
  agent_id      text NOT NULL,
  agent_ats     float,
  memory_id     uuid,
  old_memory_id uuid,           -- For supersede operations
  org_id        text NOT NULL,
  customer_id   uuid,
  reason        text,
  metadata      jsonb DEFAULT '{}',
  created_at    timestamptz DEFAULT now()
) PARTITION BY RANGE (created_at);

-- RLS: tenant isolation
ALTER TABLE memory_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY memory_audit_org_isolation ON memory_audit_log
  FOR ALL USING (org_id = current_setting('app.org_id', true));

-- 7-year retention per GDPR (partitioned monthly)
```

### 10.5 ATS Impact

Memory violations affect the Agent Trust Score:

| Violation                                                 | ATS Penalty                          |
| --------------------------------------------------------- | ------------------------------------ |
| Unauthorized memory store (no `memory:store` in manifest) | V += 1 (−0.25)                       |
| Supersede without audit log entry                         | V += 1 (−0.25)                       |
| Attempt to hard-delete (bypass soft-delete)               | V += 2 (−0.50), session frozen       |
| Memory flooding (>100 extractions/hour)                   | D += 10 (−0.50)                      |
| PII extraction without consent flag                       | V += 1 (−0.25), GDPR incident logged |

### 10.6 Cross-References

- `src/agents/memory.service.ts` — Memory store/recall/forget implementation
- `src/agents/fact-extraction.service.ts` — Fact extraction pipeline (PR-254)
- `Admin/ADMIN_MANUAL_AGENT_MEMORY_EN_v1.md` — Operations manual
- `supabase/migrations/047_hybrid_memory_search.sql` — Hybrid search function
- Thesis: V3Thesis_EN Section 10.10.7, PHD_FIREHORSE_EN Section 14.6.4

---

## 11. Systems Inventory & Policy Gate (v1.7)

_Added: 23.04.2026 | PR: claude/kya-memory-binding-RuJ0G | Rationale: absorb Aegis-tier governance/inventory responsibility into KYA because no EU-incorporated equivalent to Credo AI / Holistic AI / OneTrust / IBM Watsonx Governance exists at April 2026. See `docs/field-notes/2026-04-23-eu-ai-act-compliance-layer-research.md` §7.1._

EU AI Act Article 9 (risk management), Article 10 (data governance), Article 11 (technical documentation), Article 13 (transparency), Article 17 (quality management), and Annex III (high-risk classification) require every deployed AI system to have a **live registry entry** with classification, conformity assessment state, approval workflow history, and lineage. This section defines the KYA-native way to maintain that registry — the counterpart to §10 (Memory Audit Trail) for the systems layer.

### 11.1 Scope

Every AI system deployed under KYA governance must be registered **before** production deployment. The registry is the source of truth for:

| Question                                                       | Answered by Registry Field  |
| -------------------------------------------------------------- | --------------------------- |
| Is this system high-risk (Annex III) or limited-risk?          | `risk_classification`       |
| Has it passed conformity assessment (Art. 43)?                 | `conformity_state`          |
| What version of training data does it use?                     | `data_lineage_hash`         |
| Who approved its production deployment?                        | `deployment_approval_log[]` |
| Which regulation articles apply (Art. 6, 9–15, 17, Annex III)? | `applicable_articles[]`     |
| What's the latest Article 73 incident status?                  | `incident_state`            |

### 11.2 Schema

```sql
-- AI Systems Registry (Annex III classification + lifecycle)
CREATE TABLE IF NOT EXISTS ai_systems_registry (
  system_id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id               text NOT NULL,                         -- tenant isolation
  name                 text NOT NULL,
  version              text NOT NULL,                         -- semver
  risk_classification  text NOT NULL CHECK (risk_classification IN
    ('prohibited', 'high_risk', 'limited_risk', 'minimal_risk', 'general_purpose')),
  annex_iii_category   text,                                   -- e.g. "1(a) biometric ID"
  applicable_articles  text[] NOT NULL DEFAULT '{}',           -- e.g. {'Art. 9','Art. 12','Art. 14'}
  conformity_state     text NOT NULL CHECK (conformity_state IN
    ('draft', 'under_assessment', 'conformant', 'non_conformant', 'expired')),
  conformity_evidence  jsonb,                                  -- links to assessment docs
  data_lineage_hash    text,                                   -- hash of training dataset manifest
  model_version_hash   text,
  owner_operator_id    uuid NOT NULL REFERENCES operators(id), -- KYC-verified
  created_at           timestamptz NOT NULL DEFAULT now(),
  deployed_at          timestamptz,
  retired_at           timestamptz,
  incident_state       text CHECK (incident_state IN
    ('none', 'reported', 'investigating', 'resolved'))
);
ALTER TABLE ai_systems_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_systems_org_isolation ON ai_systems_registry
  USING (org_id = current_setting('app.org_id'));

-- Governance Policies (policy-as-code)
CREATE TABLE IF NOT EXISTS governance_policies (
  policy_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           text NOT NULL,
  name             text NOT NULL,
  policy_dsl       jsonb NOT NULL,      -- declarative rules (Rego-like)
  applies_to       text[] NOT NULL,     -- {'high_risk','biometric', ...}
  enforcement_mode text NOT NULL CHECK (enforcement_mode IN
    ('advisory', 'warn', 'block')),
  created_by       uuid NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  activated_at     timestamptz,
  retired_at       timestamptz
);

-- Policy Decisions (audit trail of every policy evaluation)
CREATE TABLE IF NOT EXISTS policy_decisions (
  decision_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id      uuid NOT NULL REFERENCES ai_systems_registry(system_id),
  policy_id      uuid NOT NULL REFERENCES governance_policies(policy_id),
  triggered_by   text NOT NULL,       -- 'deployment', 'runtime', 'scheduled'
  event_id       uuid,                -- link to Article 12 log entry
  decision       text NOT NULL CHECK (decision IN
    ('allow', 'deny', 'escalate')),
  reason         text,
  agent_id       uuid,                -- KYA-attested evaluator
  evaluated_at   timestamptz NOT NULL DEFAULT now(),
  prev_hash      text,                -- chain for tamper evidence
  decision_hash  text                 -- = sha256(prev_hash + canonical_json)
);

-- Deployment approval log (who said yes, when, why)
CREATE TABLE IF NOT EXISTS deployment_approvals (
  approval_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id        uuid NOT NULL REFERENCES ai_systems_registry(system_id),
  approver_id      uuid NOT NULL REFERENCES operators(id),
  approval_type    text NOT NULL,       -- 'initial', 'major_change', 'annual_review'
  decision         text NOT NULL CHECK (decision IN ('approved','rejected','conditional')),
  conditions       jsonb,               -- conditions if conditional
  evidence_refs    text[],              -- hashes/URIs to evidence
  kya_attestation  jsonb NOT NULL,      -- KYA policy engine attestation
  decided_at       timestamptz NOT NULL DEFAULT now()
);
```

### 11.3 Policy Gate — Runtime Enforcement

Every inference call under a high-risk classification passes through the KYA Policy Gate **before** the Article 12 Logging Pipeline records the event. The gate evaluates active policies against the request context; a `deny` decision blocks the call and emits a `policy.deny` event; `escalate` pauses the call and raises a human-review ticket through the Firehorse Report Engine.

```
Inference request  ─▶  KYA Policy Gate  ─▶  [allow]  ─▶  Model
                            │                            │
                            ├─ [deny]    ─▶  Blocked, logged, operator notified
                            ├─ [escalate] ─▶ Pending, 24h SLA for human decision
                            └─ every decision ─▶ policy_decisions log
```

### 11.4 Tier Deployment

| Tier                           | Inventory & Policy Gate Provider                                    |
| ------------------------------ | ------------------------------------------------------------------- |
| **Tier 1 — Aegis (Sovereign)** | **Themis** (DWS-native, KYA-compliant) — no third-party vendor      |
| **Tier 2 — Sovereign Infra**   | Themis (standalone SKU) or customer-chosen (Credo AI / Holistic AI) |
| **Tier 3 — Connect (Global)**  | Themis / OneTrust / IBM Watsonx / Credo AI (customer choice)        |

Themis is the DWS-branded productisation of §11 as the **Aegis Control Plane**. See `DWS_ARTICLE_12_LOGGING_STANDARD.md` and the Themis product page for the commercial offering.

### 11.5 Impact on Trust Score

Registry violations affect the Agent Trust Score:

| Violation                                                     | Trust Score Impact                  |
| ------------------------------------------------------------- | ----------------------------------- |
| Inference call from an unregistered high-risk system          | V += 2 (−0.50)                      |
| Deployment without recorded approval                          | V += 3 (−0.75)                      |
| Policy `deny` decision in production (policy engine bypassed) | V += 5 (−1.00) and agent quarantine |
| Expired conformity state held >30 days                        | V += 1 (−0.25)                      |

### 11.6 Related Artefacts

- `src/identity/systems-registry.service.ts` — registry API (to be built Q2 2026)
- `src/identity/policy-engine.service.ts` — policy DSL evaluator (to be built Q2 2026)
- `supabase/migrations/0NN_systems_inventory_and_policy.sql` — schema migration
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` — companion standard for logging pipeline
- `Store/PRODUCT_THEMIS.md` — Themis commercial SKU
- `docs/PRODUCT_TIERS.md` — tier mapping

**Roadmap:** Themis MVP Q2 2026 (Article 12 pipeline + registry + policy gate + approval workflow); Annex III classification library + 6 industry policy packs Q3 2026; external audit Q4 2026.

---

## 12. Agentic Commerce Mandate Gating — Enforcement (v1.9)

_Added: 07.07.2026 | PR: claude/kya-mandate-evidence-migration-mq7hnp | Source of truth: `Legal/KYA_STANDARD_v1.md` §14 (protocol landscape, mandate gate rule, tenant policy profiles, capability manifest extension). This section covers the enforcement/violation side only — do not fork the §14 policy text here, cross-reference it._

KYA_STANDARD_v1.md §14 gates AP2/UCP/ACP payment mandates on ATS band (§14.2), implemented as `evaluateMandateGate()` in `src/identity/ats-engine.ts`. This section extends the §9.2 KYA Violation enforcement sequence to cover mandate violations, and documents the §14.5 evidence chain's runtime enforcement layer.

### 12.1 Mandate Violation: Extends §9.2

A mandate signed or presented outside the agent's ATS band, or a spend attempt above a manifest `spend_authority` ceiling, runs the **same enforcement sequence as §9.2**, with one addition:

| Step | Action                                               | Latency   |
| ---- | ---------------------------------------------------- | --------- |
| 1    | Mandate gate intercepted by `evaluateMandateGate()`  | < 1 ms    |
| 2    | KYA Violation logged to Firehorse audit trail        | < 5 ms    |
| 3    | Subagent session terminated                          | < 50 ms   |
| 4    | Operator notified (webhook + dashboard alert)        | < 1 s     |
| 5    | KYA Trust Score reduced by 40 points                 | Immediate |
| 6    | **All live mandates issued in that session revoked** | Immediate |

Step 6 is unique to mandate violations (§14.2): a compromised or overreaching session cannot leave standing payment authority behind it. Revocation events are themselves logged to the §14.5 evidence chain (`kya_mandate_events`, `event_type = 'mandate.revoke'`).

**Mandate Violation Log Entry** (mirrors the §9.2 shape, `kyaViolation: true` from `MandateGateDecision`):

```json
{
  "event": "KYA_VIOLATION",
  "severity": "CRITICAL",
  "subagent_id": "<uuid>",
  "session_id": "<kya-session-token>",
  "mandate_vc_id": "<w3c-vc-id>",
  "protocol": "ap2",
  "attempted_ceiling_breach": { "requested": 750.0, "per_task_ceiling": 100.0 },
  "action_taken": "TERMINATE + REVOKE_LIVE_MANDATES",
  "kya_score_before": 85,
  "kya_score_after": 45,
  "timestamp": "<ISO-8601>"
}
```

### 12.2 Evidence Chain — Runtime Enforcement Layer (§14.5)

`supabase/migrations/074_kya_mandate_evidence_chain.sql` backs §14.5's "one evidence chain" with two tables, modeled on the §9.x hash-chain pattern (`command_audit_log`, migration 071):

| Table                        | Role                                                                                                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kya_mandate_events`         | Append-only, hash-chained (`prev_hash` → `event_hash`). One row per mandate lifecycle event (issue/present/execute/revoke), keyed by `session_id` + `mandate_vc_id`. UPDATE/DELETE denied to all roles — tamper-evident by construction. |
| `kya_tenant_gating_profiles` | Versioned, never mutated in place. A policy change inserts a new row and sets `superseded_at`/`superseded_by` on the row it replaces — no retroactive loosening of a live session's gates (§14.2.1).                                     |

**Defense-in-depth on the immovable floors (§14.2.1):** the tighten-only rule is enforced twice — once by `tenantGatingProfileSchema` (Zod, app layer) and again by a `CHECK (hnp_min_ats >= 0.90)` constraint on `kya_tenant_gating_profiles` (DB layer). A profile cannot loosen the HNP floor even if the app-level validator is bypassed. The ATS < 0.50 floor (immovable floor 1) is enforced in `evaluateMandateGate()` itself, not at the schema level, since it depends on the live ATS score rather than static profile data.

**Migration status:** authored, not applied. Authoring a migration file is GREEN-zone; `psql`/`supabase db push` against the live database is RED-zone and requires human execution.

### 12.3 Related Artefacts

- `Legal/KYA_STANDARD_v1.md` §14 — the mandate gating policy (protocol-neutral, public document)
- `Legal/KYA_OPTIMIZATION_v1.4.md` §13 — the financial/revenue-gate framing of Human Not Present
- `src/identity/ats-engine.ts` — `evaluateMandateGate()`, `tenantGatingProfileSchema`, `validateTenantGatingProfile()`
- `src/__tests__/mandate-gate.test.ts` — test coverage (21 tests)
- `supabase/migrations/074_kya_mandate_evidence_chain.sql` — evidence-chain schema (authored, not applied)
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` — the Article 12 record-keeping side of the evidence chain
- `DWS_SECURITY_STANDARD.md` §18 — BYO agent gate table, spend-authority gate row

---

## 13. Conclusion

The KYA Security Standard provides a complete governance framework for autonomous AI agents operating in industrial environments. By combining hardware-level isolation, real-time identity triggers, forensic observability, agent identity watermarking, and behavioral guardrails, Lifetime Oy delivers the infrastructure that makes BYO agents safe for regulated industries.

The standard is designed to be **pluggable** — any identity verification provider that meets the capability requirements below can serve as the KYA identity anchor. Shufti is the reference implementation; the architecture supports alternatives.

### Identity Provider Integration Points

| KYA Layer                 | Required Capability                         | Protocol                      |
| ------------------------- | ------------------------------------------- | ----------------------------- |
| L1 — Identity Attribution | Real-time IDV (document + face match + AML) | REST API, < 30s response      |
| L2 — Agent Provenance     | KYB (business/organization verification)    | REST API                      |
| L5 — Continuous Risk      | Risk change notifications                   | Webhook (push), < 5s delivery |

Every BYO agent deployed in the DWS10 ecosystem generates a verification event. With 20 industries and multi-agent sessions, this creates volume at scale — not one-off KYC checks.

For financial value modeling, autoresearch governance, and agent swarm orchestration, see the companion standard: `Legal/KYA_OPTIMIZATION_v1.4.md`.

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Platform:** dws10.com
**Legal Hub:** Legal/
