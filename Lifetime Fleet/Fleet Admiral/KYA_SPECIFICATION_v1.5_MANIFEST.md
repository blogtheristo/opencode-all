# KYA Specification v1.5 — Technical Manifest

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-03-10
Agent: Claude Opus 4.6 (claude/fleet-admiral-folder-s1s57)
Action: Updated to KYA Specification v1.5 (Normative Draft; KYA v2 in internal development)
END VERSION AND AGENT HISTORY

**Specification:** KYA (Know Your Agent) v1.5 (Normative Draft)
**Platform:** DWS IQ 6
**Scope:** Agent Self-Optimization Governance for Physical AI
**Classification:** Fleet Admiral — Investor Technical Appendix

---

## What Is KYA?

KYA (Know Your Agent) is the deterministic safety specification for autonomous agents operating in physical environments. It ensures that any AI agent — whether routing a fleet vehicle, controlling a robot arm, or optimizing a care schedule — can be **killed, contained, and audited** within hardware-enforced boundaries.

KYA is not a software policy. It is a **hardware-enforced governance layer**.

---

## KYA Version History

| Version | Scope | Key Capability |
|---------|-------|---------------|
| **v1.0** | Agent lifecycle management | Basic kill-switch, audit logging |
| **v1.1** | Multi-agent coordination | Cross-agent dependency resolution before kill |
| **v1.2** | Security hardening | Firecracker MicroVM isolation, sub-5ms cryptographic kill-switches |
| **v1.3** | Fleet orchestration | Fleet-wide emergency stop, rolling restart, canary deployment |
| **v1.4** | Self-optimization governance | 11% Efficiency Law, bounded self-improvement, audit trail for optimization decisions |
| **v1.5** | Memory audit trail | Agent memory mutations (store/supersede/forget/extract) governed with court-defensible provenance |

---

## KYA v1.5 — Core Capabilities

### 1. The 11% Efficiency Law

Agents may self-optimize within a **bounded efficiency envelope**. The 11% Efficiency Law states:

> Any autonomous optimization that improves fleet latency, routing efficiency, or resource utilization by more than 11% in a single cycle MUST be flagged for human review before deployment.

**Why 11%?** Empirical data from 17 years of fleet operations shows that genuine efficiency improvements rarely exceed 8-12% per optimization cycle. Gains above 11% typically indicate either a measurement error or an optimization that trades safety for speed.

| Threshold | Action |
|-----------|--------|
| 0-11% gain | Auto-deploy with audit log |
| 11-25% gain | Human review required before deployment |
| >25% gain | Automatic rollback + incident report |

### 2. Hardware-Enforced Liability Containment

| Component | Implementation | Latency |
|-----------|---------------|---------|
| Kill-switch | Cryptographic attestation via Firecracker MicroVM | <5ms |
| Isolation | Per-agent MicroVM with no shared memory | Instantaneous |
| Audit trail | Immutable log to Firehorse DMS | Real-time |
| Fleet-wide stop | Broadcast kill via NVIDIA Jetson mesh network | <50ms fleet-wide |

### 3. Bounded Self-Improvement

Agents operating under KYA v1.5 can optimize their own behavior within strict boundaries:

```
OPTIMIZATION BOUNDARY:
  scope: [routing, scheduling, resource_allocation]
  max_delta_per_cycle: 11%
  forbidden_scope: [safety_parameters, kill_switch_timing, audit_frequency]
  review_trigger: delta > 11% OR scope_violation
  rollback_trigger: delta > 25% OR safety_parameter_change
```

### 4. Firehorse Logging for Alpha Clause

All optimization decisions are logged to the Firehorse DMS with:

- **Timestamp** (UTC, millisecond precision)
- **Agent ID** and MicroVM attestation hash
- **Before/after metrics** (latency, efficiency, cost)
- **Delta percentage** and classification (auto-deploy / review / rollback)
- **Human review decision** (if triggered)

This logging is the evidentiary basis for the **KYA Alpha Clause** in the term sheet — proving >10% fleet latency improvement during the April pilot.

---

## KYA v1.5 in the Helsinki Sandbox

### Pilot Configuration

| Parameter | Value |
|-----------|-------|
| Fleet size | Initial pilot fleet (Taksi Helsinki vehicles) |
| Agent types | Routing optimizer, schedule planner, demand predictor |
| MicroVM runtime | Firecracker on NVIDIA Jetson Orin Nano |
| Kill-switch latency target | <5ms per agent, <50ms fleet-wide |
| Optimization boundary | 11% Efficiency Law enforced |
| Logging destination | Firehorse DMS (EU-sovereign, europe-north1) |
| Audit frequency | Every optimization cycle + daily summary |

### Success Metrics for Alpha Clause

| Metric | Target | Measurement |
|--------|--------|-------------|
| Fleet latency improvement | >10% vs. baseline | Firehorse logs, 30-day rolling average |
| Kill-switch reliability | 100% within <5ms | Automated testing, every 15 minutes |
| Zero safety incidents | 0 | Incident log in Firehorse DMS |
| Audit completeness | 100% of optimization decisions logged | Firehorse DMS integrity check |

---

## KYA v1.5 vs. Software-Only Competitors

| Capability | KYA v1.5 (DWS IQ 6) | Palantir AIP | OpenAI Agents |
|------------|----------------------|--------------|---------------|
| Kill-switch latency | <5ms (hardware) | ~100-500ms (API call) | N/A (no kill-switch) |
| Isolation | Firecracker MicroVM | Container-level | Shared process |
| Optimization governance | 11% Efficiency Law | Manual review | Unbounded |
| Audit trail | Immutable, hardware-attested | Software logs | API logs |
| Fleet-wide emergency stop | <50ms | Minutes | N/A |
| EU AI Act Article 12 | Built-in | Partial | Not addressed |
| Hospital-grade safety | Designed for | Not designed for | Not designed for |

---

## Architecture in Brain-Memory-Body-Hands

```
BRAIN (DWS IQ 6)
  └── KYA v1.5 Governance Layer
       ├── 11% Efficiency Law (bounded optimization)
       ├── Firecracker MicroVM isolation (per-agent)
       └── Cryptographic kill-switch (<5ms)

MEMORY (Lifetime World Model + Client Memory)
  └── Firehorse DMS + semantic_memories (pgvector)
       ├── Optimization audit trail (immutable)
       ├── Fleet telemetry (real-time)
       ├── Alpha Clause evidence (30-day logs)
       ├── Agent fact extraction (PR-254, structured SPV triples)
       └── Memory audit log (KYA-S §10, court-defensible)

BODY (Firehorse Suite)
  └── Fleet orchestration
       ├── Rolling restart / canary deployment
       ├── Fleet-wide emergency stop (<50ms)
       └── KELA integration (billing, compliance)

HANDS (Lifetime Fleet)
  └── Physical assets
       ├── Taksi Helsinki vehicles (KELA care rides)
       ├── NVIDIA Jetson Orin Nano (edge compute)
       └── Future: Optimus V3 (humanoid robotics)
```

---

## Regulatory Alignment

| Regulation | KYA v1.5 Coverage |
|------------|-------------------|
| EU AI Act Article 12 | Full — logging, transparency, human oversight |
| EU AI Act Article 14 | Full — human-in-the-loop for high-risk decisions |
| Fit for 55 | Fleet emissions tracking via Firehorse |
| CSRD | Sustainability reporting from fleet operations data |
| GDPR | Patient data never leaves MicroVM boundary |

---

*KYA Specification v1.5 — Hardware-Enforced Agent Governance*
*Lifetime Oy — Fleet Admiral Division*
