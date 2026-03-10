# KYA Standard v1.1 — Know Your Agent: Identity, Isolation & Forensics

***
# VERSION AND AGENT HISTORY

Version: 1.1.1

Sessions & Modifications:
  - Version: 1.1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Split from combined KYA Standard — Know Your Agent (security) separated from Know Your Architecture (financial/optimization). Added Agent Identity Watermarking (§2.4), Behavioral Guardrails (§2.5). Cross-references updated to companion standard KYA_OPTIMIZATION_v1.4.md
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/update-kya-standard-1.1-3sL7X | Date: 09.03.2026 | Changes: Add Subagent Registry (§9) — Capability Manifests, path-scoped access control, KYA Violation enforcement, Fault Attribution in Supabase (§9.4), Agent Trust Score formula with executable engine (src/identity/ats-engine.ts)
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/sandbox-industrial-models-GXxbN | Date: 09.03.2026 | Changes: Initial KYA Standard — Three Pillars (Identity Attribution, Capability Gating, Forensic Observability), Firecracker MicroVM isolation architecture, Multi-Agent Control Room use case, Shufti partnership positioning

Document Status:
  - Created: 09.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: ACTIVE
  - Classification: PARTNER
  - Document Type: Technical Standard / Security Architecture

Related Documents:
  - Legal/KYA_OPTIMIZATION_v1.4.md (Companion: Know Your Architecture — financial layer, autoresearch, orchestrator)
  - DWS_SECURITY_STANDARD.md (Section 18 — KYA & BYO Agent Security)
  - docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md (Partnership field note)
  - docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md (Technical requirements for Shufti)
  - src/cloudflare/tenant-sandbox.ts (Sandbox isolation implementation)
  - src/identity/ats-engine.ts (ATS engine implementation)

***

**DWS IQ Platform | Lifetime Oy**
**Version:** KYA Security Standard v1.1.1
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

KYA bridges this gap with three pillars (plus two security extensions in v1.1.1):

1. **Identity Attribution** — Every agent session is cryptographically anchored to a KYC-verified human or entity
2. **Capability Gating** — Agent permissions are dynamically adjusted based on real-time risk signals
3. **Forensic Observability** — An immutable audit trail links every agent action to its verified owner
4. **Agent Identity Watermarking** (v1.1.1) — Cryptographic provenance embedded in every agent output
5. **Behavioral Guardrails** (v1.1.1) — Pre-execution boundary enforcement beyond path-level gating

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

| Risk Signal | Response Time | Action |
|-------------|---------------|--------|
| AML flag raised | < 5 seconds | Egress blocked, sandbox restricted |
| Document expired | < 30 seconds | Session paused, re-verification required |
| Anomalous behavior detected | < 1 second | Hypervisor trap, session frozen |
| Risk score recovery | < 10 seconds | Permissions restored to previous level |

### 2.3 Pillar 3: Forensic Observability — The Firehorse Audit Trail

The Lifetime Firehorse product line serves as the ecosystem's tamper-proof "flight recorder." It captures a sub-second telemetry stream of every syscall and network request, providing an immutable audit trail bridging agent behavior to human identity.

**What Firehorse Records:**

| Layer | Data Captured | Retention |
|-------|---------------|-----------|
| Syscall | All file I/O, process spawns, IPC | 90 days (configurable) |
| Network | Every egress/ingress request, DNS lookups | 90 days |
| MCP Tool | Tool invocations, parameters, responses | 1 year |
| Token Usage | Input/output tokens per agent per session | 1 year |
| Identity Events | KYA score changes, permission adjustments | 5 years (EU AI Act Article 12) |

**Audit Chain:**
```
Agent Syscall → Firehorse Telemetry → KYA Session → Verified Identity
     │                  │                  │              │
     └──── timestamp ───┴──── session_id ──┴──── user_id ─┘
                    Immutable Forensic Record
```

### 2.4 Agent Identity Watermarking (v1.1.1)

Every output produced by a KYA-governed agent carries a **cryptographic watermark** that embeds provenance metadata directly into the output. This enables post-hoc attribution even when outputs are forwarded, copied, or integrated into downstream systems.

**Watermark Payload:**

| Field | Content | Purpose |
|-------|---------|---------|
| `agent_id` | UUID of producing agent | Which agent |
| `session_id` | KYA session token | Under whose authority |
| `timestamp` | ISO-8601 production time | When |
| `output_hash` | SHA-256 of output content | Tamper detection |
| `kya_score` | ATS at time of production | Trust level at output time |
| `hmac` | HMAC-SHA256 signed by session key | Authenticity verification |

**Properties:**
- Watermarks are embedded as metadata headers in structured outputs (JSON, XML, API responses)
- For unstructured outputs (text, reports), watermarks are stored as sidecar records in Firehorse
- Watermarks survive agent session termination — they are part of the immutable audit trail
- Verification: any party with the KYA public key can verify watermark authenticity

**Use Cases:**
- Trace a compliance report back to the exact agent, session, and identity that produced it
- Detect if an agent output has been tampered with after production
- Resolve disputes: "Which agent produced this calculation?" → watermark answers instantly

### 2.5 Behavioral Guardrails (v1.1.1)

Beyond path-level access control (Pillar 2) and post-hoc forensics (Pillar 3), v1.1.1 introduces **pre-execution behavioral guardrails** — constraints evaluated *before* an agent action executes, not after.

**Guardrail Categories:**

| Category | Enforcement Point | Example |
|----------|-------------------|---------|
| **Semantic Boundary** | Pre-execution intent classifier | Agent attempting financial transaction when authorized only for reporting → BLOCK |
| **Rate Limiting** | Per-action throttle at VMM layer | Agent attempting >100 API calls/minute → THROTTLE to 10/min |
| **Output Volume** | Pre-send output size check | Agent attempting to exfiltrate >10MB in single response → BLOCK + alert |
| **Temporal Boundary** | Session clock enforcement | Agent operating outside authorized time window → SUSPEND |
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

---

## 3. Agent Trust Score (ATS)

### 3.1 Formula (Security Baseline)

```
ATS = max(0, 1.0 - V×0.25 - L - D×0.05)

V = KYA_VIOLATION count       (4 violations = zero trust)
L = 0.10 if avg_latency > 500ms
D = DENIED path access attempts
```

**Note:** The companion standard `Legal/KYA_OPTIMIZATION_v1.4.md` extends ATS with an autoresearch improvement factor (+A×0.25). This security standard uses the base formula without the A factor, because security scoring should not be inflatable by optimization performance.

**Implementation:** `src/identity/ats-engine.ts` — evaluated before external IDV calls.

### 3.2 KYA Trust Score Ranges

| ATS Range | KYA Score | Permission Level | Decision |
|-----------|-----------|-----------------|----------|
| >= 0.80 | >= 80 | Full sandbox access | **GO** |
| 0.50–0.79 | 50–79 | Restricted access | **GO** (limited) |
| < 0.50 | < 50 | Suspended — human review required | **NO_GO** |
| = 0.00 | = 0 | Frozen — agent terminated | **NO_GO** |

---

## 4. Technical Architecture: Hardware-Level Isolation

To meet the "Zero-Trust" requirements of industrial-grade environments, DWS IQ enforces physical separation for every agent deployment.

### 4.1 Firecracker MicroVMs

Every BYO process is encapsulated in a dedicated MicroVM.

**Properties:**

| Property | Value |
|----------|-------|
| Boot time | < 125 ms |
| Memory overhead | < 5 MB per MicroVM |
| Guest kernel | Isolated per sandbox |
| Host kernel access | None (paravirtualized) |
| Storage | Ephemeral by default, persistent opt-in |

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

| Rule | Enforcement |
|------|-------------|
| Default deny | All outbound blocked unless KYA-whitelisted |
| Per-session whitelist | Endpoints approved per agent per session |
| DNS interception | All DNS queries routed through DWS resolver |
| TLS inspection | Optional MitM for enterprise tier (with consent) |
| Rate limiting | Per-agent bandwidth caps enforced at VMM |

---

## 5. Use Case: The Multi-Agent Control Room

### Scenario

A Tier-1 client initiates a complex task in the Control Room. The client simultaneously deploys four heterogeneous agents:

| # | Agent | Role | Provider |
|---|-------|------|----------|
| 1 | Microsoft CoWork | Documentation / PM | Microsoft |
| 2 | Tencent Workbuddy | Supply-Chain APIs | Tencent |
| 3 | Clawbot | Mechanical Optimization | OpenClaw |
| 4 | Anthropic Cowork | Strategy / Logic | Anthropic |

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
|-------------------------------------------------|---------------------------------------------------|
| 1. Power & Heat Generation | 9. Agriculture & Livestock |
| 2. Iron & Steel Production | 10. Waste Management & Recycling |
| 3. Cement & Lime Production | 11. Aluminium Production |
| 4. Chemicals & Petrochemicals | 12. Pulp, Paper & Printing |
| 5. Aviation | 13. Petroleum Refining |
| 6. Maritime Shipping | 14. Food & Beverage Processing |
| 7. Road Transport & Logistics | 15. Glass & Ceramics Production |
| 8. Construction & Buildings | 16. Mining & Quarrying |

**+ Tier 3: Wedge Industries** (see `Legal/KYA_OPTIMIZATION_v1.4.md` §5.3)
17. Fintech & Trading | 18. Pharma & Biotech | 19. Cybersecurity

BYO agents interact with these models through gated MCP tool interfaces — never directly with the model data or weights.

---

## 6. Sandbox Stages

KYA integrates with the DWS IQ sandbox staging model:

| Stage | Runtime | Isolation | KYA Gate |
|-------|---------|-----------|----------|
| 1 | SDK native | No network, read-only FS | L1 IDV only |
| 1.5 | Acer Veriton GN100 (Helsinki) | Ephemeral Docker, air-gapped EU | L1 + L2 (provenance) |
| 2 | Cloud Run ephemeral | Sandboxed by default | L1 + L2 + L3 (capability) |
| 3 | Production (Firecracker MicroVM) | Full hardware isolation | All 5 layers active |

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

| Regulation | KYA Coverage |
|------------|-------------|
| **EU AI Act** (Article 12) | Forensic logging, human oversight, traceability |
| **EU AI Act** (Article 14) | Human-in-the-loop via KYA score thresholds |
| **NIS2 Directive** | Supply chain security for BYO agents, incident reporting |
| **GDPR** | Data residency (EU-only), right to erasure (agent data) |
| **Fit for 55** | Industrial models comply with ETS/CBAM/CSRD |
| **DORA** | ICT risk management for financial sector agents |

---

## 9. Subagent Registry (v1.1)

Every subagent initialized within the DWS IQ platform must register with the **Subagent Registry** and sign a local **Capability Manifest** before execution begins. This ensures that testing and sandbox environments enforce the same identity-gated access controls as production.

### 9.1 Capability Manifest

Upon initialization, each subagent signs a Capability Manifest declaring its permitted resource paths. The manifest is immutable for the duration of the session.

**Default Testing Manifest:**

| Path | Access | Description |
|------|--------|-------------|
| `/mock-api/` | Read/Write | Mock API endpoints for testing |
| `/temp-db/` | Read/Write | Temporary database for sandbox operations |
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

| Step | Action | Latency |
|------|--------|---------|
| 1 | Path access intercepted by sandbox monitor | < 1 ms |
| 2 | KYA Violation logged to Firehorse audit trail | < 5 ms |
| 3 | Subagent session terminated | < 50 ms |
| 4 | Operator notified (webhook + dashboard alert) | < 1 s |
| 5 | KYA Trust Score reduced by 40 points | Immediate |

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

| Fault Class | Responsible Component | Example |
|-------------|----------------------|---------|
| `LOGIC_FAULT` | Logic Subagent | Agent produced incorrect calculation, hallucinated data, or violated business rules |
| `INTEGRATION_FAULT` | Integration Mock/Adapter | Mock returned stale data, API timeout, schema mismatch |
| `MANIFEST_FAULT` | Capability Manifest | Manifest too permissive or missing deny rules |
| `OPERATOR_FAULT` | Human Operator | Misconfigured agent parameters, wrong model selected |

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

---

## 10. Conclusion

The KYA Security Standard provides a complete governance framework for autonomous AI agents operating in industrial environments. By combining hardware-level isolation, real-time identity triggers, forensic observability, agent identity watermarking, and behavioral guardrails, Lifetime Oy delivers the infrastructure that makes BYO agents safe for regulated industries.

The standard is designed to be **pluggable** — any identity verification provider that meets the capability requirements below can serve as the KYA identity anchor. Shufti is the reference implementation; the architecture supports alternatives.

### Identity Provider Integration Points

| KYA Layer | Required Capability | Protocol |
|-----------|-------------------|----------|
| L1 — Identity Attribution | Real-time IDV (document + face match + AML) | REST API, < 30s response |
| L2 — Agent Provenance | KYB (business/organization verification) | REST API |
| L5 — Continuous Risk | Risk change notifications | Webhook (push), < 5s delivery |

Every BYO agent deployed in the DWS10 ecosystem generates a verification event. With 19 industries and multi-agent sessions, this creates volume at scale — not one-off KYC checks.

For financial value modeling, autoresearch governance, and agent swarm orchestration, see the companion standard: `Legal/KYA_OPTIMIZATION_v1.4.md`.

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Platform:** dws10.com
**Legal Hub:** Legal/
