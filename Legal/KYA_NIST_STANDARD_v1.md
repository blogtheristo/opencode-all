# KYA-NIST-SP-001 — Know Your Agent: Hardware-Attested Governance for Autonomous AI Agents

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Initial NIST submission draft — TPM 2.0 hardware-attested agentic governance framework. Derived from KYA_STANDARD_v1.md (v1.4), KYA_SECURITY_v1.2.md (v1.3), KYA_OPTIMIZATION_v1.4.md (v1.5). Formal submission format for NIST review

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: DRAFT — FOR NIST SUBMISSION
  - Classification: PUBLIC (Standards Proposal)
  - Document Type: Standards Proposal / NIST Special Publication Candidate

Related Documents:
  - Legal/KYA_STANDARD_v1.md (Source: Combined KYA Standard v1.0–v1.4)
  - Legal/KYA_SECURITY_v1.2.md (Source: KYA Security v1.3)
  - Legal/KYA_OPTIMIZATION_v1.4.md (Source: KYA Architecture v1.5)
  - Legal/KYA_NIST_SECURITY_v1.md (Companion: TPM 2.0 Hardware Attestation)
  - Legal/KYA_NIST_OPTIMIZATION_v1.md (Companion: Green Steel CBAM Financial Layer)
  - NIST SP 800-207 (Zero Trust Architecture)
  - NIST SP 800-193 (Platform Firmware Resiliency)
  - NIST AI 100-1 (AI Risk Management Framework)
  - ISO/IEC 11889 (TPM 2.0 specification)

***

**Proposed NIST Special Publication: KYA-NIST-SP-001**
**Title:** Know Your Agent — A Hardware-Attested Governance Framework for Autonomous AI Agents in Regulated Industries
**Submitting Organization:** Lifetime Oy, Helsinki, Finland
**Lead Author:** Risto Anton
**Date:** March 2026
**Contact:** risto@onelifetime.world
**Companion Standards:** KYA-NIST-SP-002 (Security), KYA-NIST-SP-003 (Optimization)

---

## Abstract

This document proposes a governance framework — Know Your Agent (KYA) — for autonomous AI agents operating in regulated industrial environments. KYA extends the NIST Zero Trust Architecture (SP 800-207) to autonomous agents by establishing hardware-rooted identity attribution, capability gating, and forensic observability using Trusted Platform Module (TPM) 2.0 attestation.

The framework addresses a governance gap: existing Know Your Customer (KYC) and Know Your Business (KYB) standards verify humans and organizations, but no standard governs the autonomous actions that AI agents take on their behalf. KYA bridges this gap with four pillars anchored to hardware root of trust, providing court-defensible audit trails compliant with the EU AI Act (Articles 12, 14), NIS2, DORA, GDPR, and the EU Emissions Trading System (Fit for 55).

Reference implementation: DWS IQ Platform — a platform to train and run enterprise industrial agent swarms safely — deployed across 20 industries with Firecracker MicroVM isolation, < 125ms (Firecracker MicroVM, AWS benchmark) hardware kill capability, and TPM 2.0 attestation chain.

---

## 1. Introduction and Scope

### 1.1 Problem Statement

Autonomous AI agents — including multi-agent swarms, Bring Your Own (BYO) third-party agents, and self-optimizing autoresearch agents — are being deployed in critical infrastructure, financial services, healthcare, and heavy industry. No existing NIST publication addresses:

1. **Agent identity attribution** — binding autonomous actions to verified human/organizational identities
2. **Hardware-level agent isolation** — enforcing zero-trust boundaries at the hypervisor layer, not just software permissions
3. **Forensic observability for agent actions** — immutable audit trails linking every syscall to a verified identity
4. **Governed self-optimization** — controlling agents that iteratively improve their own models and parameters

### 1.2 Relationship to Existing NIST Publications

| NIST Publication | KYA Relationship |
|-----------------|------------------|
| **SP 800-207** (Zero Trust Architecture) | KYA extends ZTA to autonomous agents. Agents are never trusted by default; every action is verified against signed capability manifests |
| **SP 800-193** (Platform Firmware Resiliency) | KYA uses TPM 2.0 attestation for agent runtime integrity verification |
| **AI 100-1** (AI RMF) | KYA operationalizes the AI RMF's GOVERN and MEASURE functions with quantitative Agent Trust Scores |
| **SP 800-53** (Security Controls) | KYA maps to AC, AU, IA, SC control families with agent-specific extensions |
| **SP 800-190** (Container Security) | KYA exceeds container isolation with Firecracker MicroVM hardware-level separation |

### 1.3 Scope

This standard applies to:
- Multi-agent AI systems operating in regulated environments
- BYO (Bring Your Own) third-party agents entering enterprise control rooms
- Self-optimizing agents running autoresearch loops
- Any deployment where autonomous agent actions have legal, financial, or safety consequences

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| **Agent** | An autonomous software system that takes actions on behalf of a verified human or organizational identity |
| **Agent Trust Score (ATS)** | A quantitative measure (0.0–1.0) of an agent's trustworthiness, computed from violations, latency, access denials, and validated improvements |
| **Autoresearch** | Governed self-optimization where an agent proposes, validates, and promotes parameter changes within declared bounds |
| **BYO Agent** | A third-party agent not developed by the platform operator, brought into the environment by a customer |
| **Capability Manifest** | A signed, immutable declaration of an agent's permitted resources, tools, and optimization scope for a session |
| **Firehorse** | A tamper-proof forensic telemetry system capturing sub-second agent activity for audit and liability |
| **Hardware Kill** | Termination of an agent at the hypervisor/VMM layer (< 125ms (Firecracker MicroVM, AWS benchmark)), not dependent on agent cooperation |
| **KYA Violation** | An agent action that exceeds its signed capability manifest, triggering enforcement and ATS reduction |
| **Leash** | Dynamic capability gating that adjusts agent permissions based on real-time risk signals |
| **MicroVM** | A lightweight virtual machine (Firecracker) providing hardware-level isolation per agent |
| **TPM 2.0 Attestation** | Hardware-rooted cryptographic verification that the agent runtime has not been tampered with |

---

## 3. The Four Pillars of KYA

### 3.1 Pillar 1: Identity Attribution — The Anchor

Every agent session MUST be cryptographically anchored to a KYC/KYB-verified human or organizational identity.

**Requirements:**
- Agent session tokens MUST be bound to a verified identity (e.g., Shufti IDV, NIST SP 800-63 IAL2+)
- Session-to-identity binding MUST be immutable and stored in a tamper-proof ledger
- Legal chain of custody: `Agent Action -> Session Token -> Verified Identity -> Legal Entity`
- TPM 2.0 attestation MUST verify runtime integrity before identity binding is accepted

**NIST SP 800-63 Mapping:**
| KYA Identity Layer | NIST IAL | Verification |
|-------------------|----------|-------------|
| L1 — Human Identity | IAL2 | Document + biometric + AML |
| L2 — Agent Provenance | N/A (new) | Cryptographic agent manifest signature |
| L3 — Capability Declaration | N/A (new) | Signed capability manifest |
| L5 — Continuous Risk | N/A (new) | Real-time risk webhook monitoring |

### 3.2 Pillar 2: Capability Gating — The Leash

Agent permissions MUST be dynamically adjusted based on real-time risk telemetry, enforced at the hypervisor layer.

**Requirements:**
- Default deny: agents have zero capabilities unless explicitly granted via signed manifest
- Risk signals MUST trigger permission changes within defined SLAs:

| Risk Signal | Maximum Response Time | Action |
|-------------|----------------------|--------|
| AML/sanctions flag | < 5 seconds | Egress blocked, sandbox restricted |
| Document/credential expiry | < 30 seconds | Session paused, re-verification |
| Anomalous behavior | < 1 second | Hypervisor trap, session frozen |
| Autoresearch budget exceeded | < 1 second | Optimization halted, results preserved |
| Risk recovery | < 10 seconds | Permissions restored to previous level |

- Hardware kill MUST be available within < 125ms (Firecracker MicroVM, AWS benchmark) for any agent session
- Software-layer guardrails (< 5ms pre-execution evaluation) MUST NOT be bypassable by the agent

### 3.3 Pillar 3: Forensic Observability — The Audit Trail

An immutable, tamper-proof audit trail MUST link every agent action to its verified owner.

**Requirements:**
- Sub-second telemetry capture of all agent syscalls, network requests, and tool invocations
- Retention periods compliant with EU AI Act Article 12 (5 years for identity events)
- Agent Identity Watermarking: every agent output MUST carry cryptographic provenance metadata
- TPM 2.0 sealed logs: forensic records MUST be integrity-protected by hardware

| Data Layer | Capture | Minimum Retention |
|------------|---------|-------------------|
| Syscall (file I/O, process, IPC) | All | 90 days |
| Network (egress/ingress, DNS) | All | 90 days |
| MCP Tool invocations | All | 1 year |
| Token usage | Per agent per session | 1 year |
| Identity events (KYA score changes) | All | 5 years |
| Autoresearch experiments | All proposals, deltas, rankings | 5 years |

### 3.4 Pillar 4: Autoresearch Governance — The Safety Layer

Agents that self-optimize MUST operate within declared bounds with independent validation.

**Requirements:**
- Autoresearch scope MUST be declared in the signed Capability Manifest (`target_metrics`, `max_experiments`, `max_compute_hours`)
- The Autoresearch Improvement Factor (A) MUST NOT exceed a cap of 0.25 in the Agent Trust Score
- A factor contributions MUST pass third-party validation before counting toward ATS:
  - Independent metric measurement (not agent self-reported)
  - Distribution shift test (KS-test or Jensen-Shannon divergence between proxy and production)
  - Spearman rank correlation > 0.90 between proxy and scale improvements
  - Human domain expert sign-off for A > 0.15
- All autoresearch proposals, validation deltas, and parameter changes MUST be immutably logged
- MicroVM boundaries, kernel isolation, and egress rules are NEVER tunable by autoresearch

---

## 4. Agent Trust Score (ATS)

### 4.1 Base Formula (Security)

```
ATS_base = max(0, 1.0 - V*0.25 - L - D*0.05)

V = KYA_VIOLATION count       (4 violations = zero trust)
L = 0.10 if avg_latency > 500ms
D = DENIED path access attempts
```

### 4.2 Extended Formula (with Autoresearch)

```
ATS_extended = max(0, 1.0 - V*0.25 - L - D*0.05 + A*0.18)

A = validated autoresearch improvement factor (capped at 0.18)
    Requires: proxy-to-scale correlation > 0.90, KS + JS divergence < 0.15,
    72h human gate, third-party validation
```

### 4.3 Trust Tiers and Enforcement

| ATS Range | Permission Level | Enforcement |
|-----------|-----------------|-------------|
| >= 0.80 | Full sandbox + autoresearch swarm | All capabilities active |
| 0.50–0.79 | Restricted access, limited autoresearch | Human review recommended |
| < 0.50 | Suspended — human review required | Agent paused, no autonomous actions |
| = 0.00 | Frozen — hardware kill executed | Agent terminated, session sealed |

---

## 5. Technical Architecture: Hardware Root of Trust

### 5.1 TPM 2.0 Attestation Chain

```
┌──────────────────────────────────────────────────────────────┐
│  TPM 2.0 Hardware Root of Trust                              │
│                                                              │
│  Platform Key (PK)                                           │
│       │                                                      │
│       ├── Attestation Identity Key (AIK)                     │
│       │       │                                              │
│       │       ├── MicroVM-1 Runtime Measurement              │
│       │       ├── MicroVM-2 Runtime Measurement              │
│       │       └── MicroVM-N Runtime Measurement              │
│       │                                                      │
│       ├── Sealed Forensic Logs                               │
│       │       │                                              │
│       │       └── Firehorse audit records (tamper-evident)   │
│       │                                                      │
│       └── Agent Session Keys                                 │
│               │                                              │
│               ├── Session-to-Identity Binding                │
│               └── Capability Manifest Signatures             │
└──────────────────────────────────────────────────────────────┘
```

**Attestation Flow:**
1. Platform boot measured by TPM 2.0 (PCR 0–7)
2. Hypervisor (Firecracker) integrity verified against known-good measurement
3. Each MicroVM boot extends platform configuration registers (PCR 8+)
4. Agent runtime measurement verified before identity binding is accepted
5. Forensic logs sealed by TPM — tamper detection is hardware-enforced

### 5.2 Firecracker MicroVM Isolation

| Property | Value | NIST SP 800-190 Comparison |
|----------|-------|---------------------------|
| Boot time | < 125 ms | Faster than container startup |
| Memory overhead | < 5 MB per MicroVM | Lower than container overhead |
| Kernel isolation | Separate guest kernel per agent | Exceeds container shared-kernel model |
| Host kernel access | None (paravirtualized) | Eliminates kernel breakout attacks |
| Hardware kill time | < < 125ms (Firecracker MicroVM, AWS benchmark) | No equivalent in container model |
| Storage | Ephemeral by default | Reduces persistent attack surface |

### 5.3 Behavioral Guardrails (Pre-Execution)

Guardrails are evaluated in < 5ms before any agent action executes:

| Category | Enforcement Point | Latency |
|----------|-------------------|---------|
| Semantic boundary | Intent classifier (policy engine, not LLM) | < 2 ms |
| Rate limiting | Per-action throttle at VMM layer | < 1 ms |
| Output volume | Pre-send size check | < 1 ms |
| Temporal boundary | Session clock enforcement | < 1 ms |
| Cross-agent boundary | Inter-MicroVM communication monitor | < 2 ms |

**Key principle:** Sub-5ms guardrails are a "No" mechanism (blocking). They are NOT a "More" mechanism (optimization). The split is clean — security blocks fast, optimization improves over time.

---

## 6. Compliance Mapping

### 6.1 NIST Framework Alignment

| NIST Control Family | KYA Implementation |
|--------------------|--------------------|
| **AC (Access Control)** | Capability Manifest (signed, immutable, per-session) |
| **AU (Audit)** | Firehorse forensic telemetry (sub-second, 5-year retention) |
| **IA (Identification/Auth)** | TPM 2.0 attestation + KYC/KYB identity binding |
| **SC (System/Comms Protection)** | Firecracker MicroVM isolation, hypervisor egress control |
| **SI (System/Info Integrity)** | Agent Identity Watermarking, sealed forensic logs |
| **RA (Risk Assessment)** | Agent Trust Score (continuous, quantitative) |
| **SA (System Acquisition)** | BYO Agent Registration Flow (6-stage gate) |

### 6.2 International Regulatory Alignment

| Regulation | KYA Coverage |
|------------|-------------|
| **EU AI Act** (Article 12) | Forensic logging, human oversight, traceability — includes autoresearch decision trail |
| **EU AI Act** (Article 14) | Human-in-the-loop via ATS thresholds; autoresearch requires human gate for production |
| **NIS2 Directive** | Supply chain security for BYO agents, incident reporting |
| **GDPR** | Data residency (EU-only), right to erasure (agent data) |
| **Fit for 55** | 20 industrial models comply with ETS/CBAM/CSRD |
| **DORA** | ICT risk management for financial sector agents |
| **SOC 2 Type II** | Trust services criteria — security, availability, processing integrity |
| **ISO 42001** | AI Management Systems — governance, risk, and compliance for AI |

---

## 7. Reference Implementation

### 7.1 DWS IQ Platform — Deployment Summary

| Component | Technology | Status |
|-----------|-----------|--------|
| Isolation | Firecracker MicroVM on Google Cloud Run | Production |
| Identity | Shufti Pro IDV (L1 human, L5 continuous risk) | Pilot |
| Forensics | Firehorse (purpose-built telemetry) | Production |
| Trust Score | ATS Engine (TypeScript, Supabase) | Production |
| Autoresearch | Governed self-optimization (Karpathy methodology) | Q2 2026 |
| Hardware Attestation | TPM 2.0 integration | Roadmap |

### 7.2 Industry Coverage

20 industries across three tiers:

**Tier 1 — Critical Emissions (8):** Power & Heat, Iron & Steel, Cement, Chemicals, Aviation, Maritime, Road Transport, Construction

**Tier 2 — Important Emissions (8):** Agriculture, Waste Management, Aluminium, Pulp & Paper, Petroleum Refining, Food & Beverage, Glass & Ceramics, Mining

**Tier 3 — Wedge Industries (4):** Fintech & Trading, Pharma & Biotech, Cybersecurity, Healthcare & MedTech

### 7.3 Helsinki Sandbox — Stage 1.5 Proof Environment

The Helsinki Sandbox (Acer Veriton GN100, air-gapped EU) provides a physical proof environment for KYA governance:

| Property | Value |
|----------|-------|
| Location | Helsinki, Finland (EU data residency) |
| Network | Air-gapped, EU-only |
| Runtime | Ephemeral Docker containers |
| KYA Gate | L1 + L2 (identity + provenance) |
| Purpose | Pre-production validation of agent governance before cloud promotion |

---

## 8. Architectural Differentiation: Hardware-Attested vs. Software-Layer

| Dimension | Software-Layer Approaches | KYA (Hardware-Attested) |
|-----------|--------------------------|------------------------|
| Agent isolation | Container/permission-based | Firecracker MicroVM (hardware kill < 125ms (Firecracker MicroVM, AWS benchmark)) |
| Identity binding | Enterprise SSO | KYC/KYB-verified, TPM 2.0 attested |
| Kill mechanism | Software signal (agent must cooperate) | Hypervisor trap (agent cannot resist) |
| Guardrail bypass risk | Agent can potentially circumvent software checks | Hardware-enforced, agent has no access to enforcement layer |
| Forensic integrity | Application-level logging (tamper risk) | TPM 2.0 sealed logs (tamper-evident) |
| Autoresearch governance | Not offered | Governed, validated, attributed |

Partnership opportunities with complementary platforms are documented separately.

---

## 9. Conclusion

KYA proposes a hardware-attested governance framework for autonomous AI agents that extends NIST Zero Trust Architecture to the agentic AI paradigm. DWS IQ is a platform to train and run enterprise industrial agent swarms safely — by anchoring agent identity, capabilities, and forensic records to TPM 2.0 hardware root of trust, KYA provides the first court-defensible governance standard for multi-agent systems in regulated industries.

The framework is deployed across 20 industries, with a reference implementation on the DWS IQ Platform. We propose this as a candidate for NIST Special Publication consideration, addressing the governance gap between human identity verification (KYC/KYB) and autonomous agent actions.

---

## References

1. NIST SP 800-207: Zero Trust Architecture (2020)
2. NIST SP 800-193: Platform Firmware Resiliency Guidelines (2018)
3. NIST AI 100-1: Artificial Intelligence Risk Management Framework (2023)
4. NIST SP 800-53 Rev. 5: Security and Privacy Controls (2020)
5. NIST SP 800-190: Application Container Security Guide (2017)
6. NIST SP 800-63-3: Digital Identity Guidelines (2017)
7. ISO/IEC 11889: Trusted Platform Module Library (TPM 2.0)
8. ISO/IEC 42001: AI Management Systems (2023)
9. EU AI Act — Regulation 2024/1689 (2024)
10. EU Emissions Trading System — Fit for 55 Package (2023)

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Platform:** dws10.com
**Submission Status:** DRAFT — For NIST Review
