---
title: KYA Standard
version: 1.0
created: 2026-03-09
last_modified: 2026-03-09
author: Lifetime Oy Security Team
language: en
languages_available: [en]
classification: PARTNER
publication_status: ACTIVE
document_type: Technical Standard / Partner Proposal
toc: true
toc-depth: 3
---

# The KYA Standard v1.0

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/sandbox-industrial-models-GXxbN | Date: 09.03.2026 | Changes: Initial KYA Standard — Three Pillars (Identity Attribution, Capability Gating, Forensic Observability), Firecracker MicroVM isolation architecture, Multi-Agent Control Room use case, Shufti partnership positioning

Document Status:
  - Created: 09.03.2026
  - Last Modified: 09.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: ACTIVE
  - Classification: PARTNER
  - Document Type: Technical Standard / Partner Proposal

Related Documents:
  - DWS_SECURITY_STANDARD.md (Section 18 — KYA & BYO Agent Security)
  - docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md (Partnership field note)
  - docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md (Technical requirements for Shufti)
  - src/cloudflare/tenant-sandbox.ts (Sandbox isolation implementation)
  - 16-INDUSTRIES.md (16 EU-regulated industries)

---

**Technical Proposal by Lifetime Oy**
**Lead Architect:** Risto Anton
**Status:** Implementation Ready (Q1 2026 Launch)

---

## 1. Executive Summary

In the 2026 industrial landscape, identity verification is no longer a one-dimensional problem. Traditional KYC (Know Your Customer) identifies the human at the door, but fails to govern the autonomous entities they bring with them. As enterprises integrate "Bring Your Own" (BYO) agents — ranging from Microsoft CoWork and Tencent Workbuddy to proprietary industrial tools like Clawbot — a new governance layer is required.

Lifetime Oy introduces the **KYA (Know Your Agent) Standard**: a hardware-level framework for anchoring autonomous intent to verified identities through MicroVM isolation and forensic observability.

### 1.1 Why KYA Exists

| Era | Identity Problem | Solution |
|-----|-----------------|----------|
| 2010s | Who is the human? | KYC — document verification, AML screening |
| 2020s | Who is the business? | KYB — corporate registry, UBO checks |
| 2026+ | Who controls the agent? | **KYA** — identity attribution + capability gating + forensic audit |

Traditional KYC/KYB answers "who are you?" — KYA answers "what is your agent doing, and can we trace it back to you?"

---

## 2. The Three Pillars of KYA

### 2.1 Pillar 1: Identity Attribution (The Anchor)

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

### 2.2 Pillar 2: Capability Gating (The Leash)

Using real-time risk telemetry (via API partners), DWS IQ dynamically adjusts an agent's permissions. If a user's risk profile fluctuates, the agent's compute, memory, and API access are throttled in milliseconds.

**Dynamic Permission Model:**

| Risk Signal | Response Time | Action |
|-------------|---------------|--------|
| AML flag raised | < 5 seconds | Egress blocked, sandbox restricted |
| Document expired | < 30 seconds | Session paused, re-verification required |
| Anomalous behavior detected | < 1 second | Hypervisor trap, session frozen |
| Risk score recovery | < 10 seconds | Permissions restored to previous level |

**KYA Trust Score Ranges:**

| Score | Permission Level | Description |
|-------|-----------------|-------------|
| >= 80 | Full sandbox | Egress, filesystem, all MCP tools |
| 50-79 | Restricted sandbox | No egress, read-only FS, curated MCP tools |
| < 50 | Suspended | Human review required |
| = 0 | Frozen | Agent terminated, account under investigation |

### 2.3 Pillar 3: Forensic Observability (The Firehorse Audit Trail)

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

---

## 3. Technical Architecture: Hardware-Level Isolation

To meet the "Zero-Trust" requirements of industrial-grade environments, DWS IQ enforces physical separation for every agent deployment.

### 3.1 Firecracker MicroVMs

Every BYO process is encapsulated in a dedicated MicroVM.

**Properties:**

| Property | Value |
|----------|-------|
| Boot time | < 125 ms |
| Memory overhead | < 5 MB per MicroVM |
| Guest kernel | Isolated per sandbox |
| Host kernel access | None (paravirtualized) |
| Storage | Ephemeral by default, persistent opt-in |

### 3.2 No Shared Kernel Access

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

### 3.3 Hypervisor-Level Egress Control

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

## 4. Use Case: The Multi-Agent Control Room

### Scenario

A Tier-1 client initiates a complex task in the Control Room (managing 16 proprietary industrial models). The client simultaneously deploys four heterogeneous agents:

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

### 4.1 The 16 Industrial Models

Each model runs in its own sandbox within the Control Room, serving one of the 16 EU-regulated industries under Fit for 55:

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

BYO agents interact with these models through gated MCP tool interfaces — never directly with the model data or weights.

---

## 5. Sandbox Stages

KYA integrates with the DWS IQ sandbox staging model:

| Stage | Runtime | Isolation | KYA Gate |
|-------|---------|-----------|----------|
| 1 | SDK native | No network, read-only FS | L1 IDV only |
| 1.5 | Acer Veriton GN100 (Helsinki) | Ephemeral Docker, air-gapped EU | L1 + L2 (provenance) |
| 2 | Cloud Run ephemeral | Sandboxed by default | L1 + L2 + L3 (capability) |
| 3 | Production (Firecracker MicroVM) | Full hardware isolation | All 5 layers active |

---

## 6. BYO Agent Registration Flow

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
│                             │  Sandbox permissions adjust in real-time
└─────────────────────────────┘
```

---

## 7. Compliance Alignment

| Regulation | KYA Coverage |
|------------|-------------|
| **EU AI Act** (Article 12) | Forensic logging, human oversight, traceability |
| **EU AI Act** (Article 14) | Human-in-the-loop via KYA score thresholds |
| **NIS2 Directive** | Supply chain security for BYO agents, incident reporting |
| **GDPR** | Data residency (EU-only), right to erasure (agent data) |
| **Fit for 55** | 16 industrial models comply with ETS/CBAM/CSRD |
| **DORA** | ICT risk management for financial sector agents |

---

## 8. Conclusion

The KYA Standard moves beyond the binary "Pass/Fail" of 2020-era compliance. By integrating hardware isolation with real-time identity triggers, Lifetime Oy provides a secure runtime for the next generation of autonomous work.

The architecture is designed for pluggable identity providers. Any IDV/KYC partner that can deliver real-time verification scores and continuous risk webhooks can serve as the Identity Anchor for KYA Layer 1 and Layer 5.

### Identity Provider Integration Points

| KYA Layer | Required Capability | Protocol |
|-----------|-------------------|----------|
| L1 — Identity Attribution | Real-time IDV (document + face match + AML) | REST API, < 30s response |
| L2 — Agent Provenance | KYB (business/organization verification) | REST API |
| L5 — Continuous Risk | Risk change notifications | Webhook (push), < 5s delivery |

Every BYO agent deployed in the DWS10 ecosystem generates a verification event. With 16 industries and multi-agent sessions, this creates volume at scale — not one-off KYC checks.

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Platform:** dws10.com
