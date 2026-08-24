# KYA One-Pager — The Shield (CISO Edition)

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Initial CISO one-pager. "The No" — identity, isolation, forensics. Sourced from KYA Security v1.3

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: INTERNAL
  - Classification: PARTNER
  - Document Type: GTM Asset / One-Pager

Related Documents:
  - Legal/KYA_SECURITY_v1.2.md (Full technical standard)
  - Legal/KYA_NIST_SECURITY_v1.md (NIST submission — TPM 2.0 architecture)

***

**Lifetime Oy | Helsinki, Finland**
**Audience:** CISO, Security Architects, Compliance Officers
**Positioning:** Know Your Agent — "The Shield"

---

## The Problem Your Board Is Asking About

Your teams are deploying AI agents. Third-party "BYO" agents are coming next. Your existing security stack — RBAC, network segmentation, API gateways — was built for humans and containers, not autonomous agents that spawn subagents, make decisions, and modify data.

**KYC verifies identity. KYB verifies business. Nothing verifies the agent.**

Until KYA.

---

## Know Your Agent (KYA) — What It Does

> **Verify the Human. Sandbox the Agent. Secure the Intent.**

| Pillar | What It Enforces | How |
|--------|-----------------|-----|
| **Identity Attribution** | Every agent action traces to a KYC-verified human | Cryptographic session binding (Shufti IDV) |
| **Capability Gating** | Agents can only access what their manifest allows | VMM-layer enforcement (not software) |
| **Forensic Observability** | Immutable, tamper-evident audit trail | TPM 2.0 sealed Firehorse logs |
| **Identity Watermarking** | Every agent output carries cryptographic provenance | Embedded in all outputs (v1.2) |
| **Behavioral Guardrails** | Pre-execution boundary enforcement | Sub-5ms VMM-layer checks (v1.2) |

---

## Hardware, Not Software

| Capability | Software Guardrails | KYA (Hardware) |
|-----------|-------------------|----------------|
| Agent isolation | Container / process isolation | **Firecracker MicroVM** (separate kernel) |
| Kill time | Graceful shutdown (seconds) | **< 125ms (Firecracker MicroVM, AWS benchmark)** (Firehorse Snap) |
| Tamper evidence | Application logs | **TPM 2.0 sealed** (hardware root of trust) |
| Memory overhead | 50–200MB per container | **< 5MB** per MicroVM |
| Boot time | Seconds | **< 125ms** |
| Guardrail enforcement | Middleware / API layer | **VMM layer** (below the agent's OS) |

---

## Agent Trust Score (ATS)

Real-time, per-agent score: `ATS = 1.0 - V×0.25 - L - D×0.05`

| Score | Tier | What Happens |
|-------|------|-------------|
| 0.85–1.00 | Green | Full operational access |
| 0.70–0.84 | Amber | Restricted — high-risk ops blocked |
| 0.50–0.69 | Red | Read-only — manual approval required |
| < 0.50 | Quarantine | **Terminated** — Firehorse Snap |

V = violation count, L = latency penalty, D = denied access attempts. Every variable is TPM-sealed and court-defensible.

---

## BYO Agent Registration Flow

```
Partner Agent → L1 Identity (Shufti KYC) → L2 Provenance Check →
L3 Capability Review → L4 Sandbox Trial → L5 Runtime Monitoring
```

6 stages. Each gate is binary pass/fail. No exceptions.

---

## Compliance Coverage

| Framework | KYA Alignment |
|-----------|--------------|
| EU AI Act Art. 12/14 | Automatic event logging + human oversight |
| NIS2 | Incident response, supply chain security |
| DORA | Digital operational resilience for financial agents |
| GDPR | Data minimization in agent manifests |
| SOC 2 Type II | Security, availability, confidentiality controls |
| ISO 42001 | AI management systems |

---

## One Question

**If an agent in your Control Room makes a wrong decision at 3 AM, can you trace it to the human who authorized it, prove the runtime wasn't tampered with, and terminate it in under 200ms?**

If not, you need KYA.

**Contact:** risto@onelifetime.world | Lifetime Oy, Helsinki

---

**Lifetime Oy** | Helsinki, Finland
**Classification:** PARTNER
