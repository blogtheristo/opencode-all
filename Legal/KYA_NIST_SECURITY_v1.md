# KYA-NIST-SP-002 — Know Your Agent: TPM 2.0 Hardware-Attested Agent Security

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Initial NIST security submission — TPM 2.0 attestation, Firecracker MicroVM isolation, < 125ms (Firecracker MicroVM, AWS benchmark) hardware kill, behavioral guardrails, agent identity watermarking. Derived from KYA_SECURITY_v1.2.md (v1.3)

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: DRAFT — FOR NIST SUBMISSION
  - Classification: PUBLIC (Standards Proposal)
  - Document Type: Standards Proposal / NIST Special Publication Candidate

Related Documents:
  - Legal/KYA_SECURITY_v1.2.md (Source: KYA Security v1.3)
  - Legal/KYA_NIST_STANDARD_v1.md (Parent: KYA-NIST-SP-001)
  - Legal/KYA_NIST_OPTIMIZATION_v1.md (Companion: KYA-NIST-SP-003)
  - NIST SP 800-207 (Zero Trust Architecture)
  - NIST SP 800-193 (Platform Firmware Resiliency)
  - ISO/IEC 11889 (TPM 2.0 specification)

***

**Proposed NIST Special Publication: KYA-NIST-SP-002**
**Title:** Know Your Agent — TPM 2.0 Hardware-Attested Agent Security for Industrial Control Rooms
**Submitting Organization:** Lifetime Oy, Helsinki, Finland
**Lead Author:** Risto Anton
**Date:** March 2026
**Contact:** risto@onelifetime.world

---

## Abstract

This companion standard defines the security architecture for KYA (Know Your Agent) governance, focusing on hardware-rooted trust mechanisms. DWS IQ is a platform to train and run enterprise industrial agent swarms safely — this document specifies how TPM 2.0 attestation, Firecracker MicroVM isolation, and sub-5ms behavioral guardrails create the defense-in-depth model that makes safe swarm execution possible.

The key differentiator from software-layer agent security: KYA's enforcement mechanisms cannot be circumvented by the agent. The hypervisor kills in < 125ms (Firecracker MicroVM, AWS benchmark). The agent has no say.

---

## 1. Hardware Root of Trust Architecture

### 1.1 TPM 2.0 Integration for Agent Governance

Traditional TPM 2.0 use cases protect platform boot integrity. KYA extends this to **agent runtime integrity** — verifying that the execution environment hosting an autonomous agent has not been tampered with before allowing identity binding or capability granting.

**TPM 2.0 Extension for KYA:**

| TPM Function | Traditional Use | KYA Extension |
|-------------|----------------|---------------|
| Platform Configuration Registers (PCR 0–7) | Boot integrity | Host + hypervisor measurement |
| PCR 8–15 (dynamic) | OS kernel measurement | **MicroVM runtime measurement per agent** |
| Attestation Identity Key (AIK) | Remote attestation | **Agent session attestation to identity provider** |
| Sealed Storage | Disk encryption keys | **Forensic log sealing (tamper-evident)** |
| Key Hierarchy | Platform keys | **Agent session key derivation** |

### 1.2 Attestation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ BOOT SEQUENCE                                                    │
│                                                                  │
│  TPM 2.0 ──measure──> UEFI Firmware ──measure──> Hypervisor     │
│    (PCR 0–3)            (PCR 4–5)                (PCR 6–7)      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ AGENT STARTUP                                                    │
│                                                                  │
│  Hypervisor ──spawn──> MicroVM-N ──measure──> PCR 8+            │
│       │                    │                                     │
│       │                    ├── Guest kernel hash                 │
│       │                    ├── Agent binary hash                 │
│       │                    └── Capability manifest hash          │
│       │                                                          │
│       └── Verify all PCRs against known-good values              │
│           │                                                      │
│           ├── PASS: Bind session to verified identity            │
│           └── FAIL: Reject agent startup, alert operator         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ RUNTIME                                                          │
│                                                                  │
│  Periodic re-attestation (every 60s)                             │
│  Any PCR drift ──> Immediate session freeze + forensic capture   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 TPM-Sealed Forensic Logs

Firehorse audit records are sealed using TPM 2.0 sealed storage. This provides:

1. **Tamper evidence** — Any modification to sealed logs invalidates the TPM seal
2. **Binding to platform state** — Logs can only be unsealed on the platform that produced them (prevents log transplant attacks)
3. **Non-repudiation** — The TPM hardware guarantees that the log was produced on a specific platform in a specific state

```
Agent Action
    │
    ▼
Firehorse Telemetry Capture
    │
    ▼
TPM 2.0 Seal (bound to current PCR values)
    │
    ▼
Sealed Log Record (tamper-evident)
    │
    ▼
Supabase Storage (encrypted at rest)
```

---

## 2. Firecracker MicroVM Isolation Model

### 2.1 Why MicroVMs, Not Containers

NIST SP 800-190 documents container security risks, including shared kernel vulnerabilities and container breakout attacks. KYA exceeds SP 800-190 recommendations by using Firecracker MicroVMs:

| Risk (SP 800-190) | Container Mitigation | KYA MicroVM Mitigation |
|-------------------|---------------------|----------------------|
| **IR-1: Kernel exploits** | Seccomp + AppArmor profiles | Separate guest kernel per agent — no shared kernel |
| **IR-2: Container breakout** | Runtime monitoring | No breakout possible — paravirtualized, no host kernel access |
| **IR-3: Noisy neighbor** | Resource limits (cgroups) | Hardware-enforced resource isolation at VMM |
| **IR-4: Lateral movement** | Network policies | Zero lateral movement — MicroVMs have no inter-VM communication channel unless explicitly declared |
| **IR-5: Data leakage** | Volume encryption | Ephemeral storage by default, no persistent state |

### 2.2 MicroVM Specifications

| Property | Value | Security Rationale |
|----------|-------|-------------------|
| Boot time | < 125 ms | Fast enough for on-demand agent spawning |
| Memory overhead | < 5 MB | Enables high-density deployment (1000+ agents per host) |
| Guest kernel | Isolated per sandbox | Eliminates kernel-level attack surface sharing |
| Host kernel access | None | Paravirtualized — agent cannot reach host |
| Storage | Ephemeral by default | No persistent attack artifacts |
| Network | Default deny, per-session whitelist | Agent cannot reach any endpoint not in KYA manifest |

### 2.3 Hardware Kill Mechanism (< 125ms (Firecracker MicroVM, AWS benchmark) Firehorse Snap)

The **Firehorse Snap** is a hardware-level kill mechanism that terminates an agent session at the hypervisor layer:

```
Trigger Event (KYA violation, anomaly, operator command)
    │
    ▼
┌──────────────────────────────────────────┐
│ VMM (Virtual Machine Monitor)            │   t=0
│                                          │
│  1. Freeze vCPUs                         │   t < 1ms
│  2. Capture memory snapshot (forensic)   │   t < 50ms
│  3. Sever all network connections        │   t < 5ms
│  4. Destroy MicroVM                      │   t < 125ms (Firecracker MicroVM, AWS benchmark)
│  5. Seal forensic capture with TPM       │   t < 200ms
│  6. Notify operator (webhook + dashboard)│   t < 1s
└──────────────────────────────────────────┘
```

**Key property:** The agent has no mechanism to prevent, delay, or negotiate the kill. The hypervisor acts on the MicroVM — the agent is inside the VM and cannot access the VMM layer.

**Comparison to software-layer approaches:**

| Mechanism | Kill Time | Agent Can Resist? | Data Loss Risk |
|-----------|-----------|-------------------|----------------|
| Software signal (SIGTERM) | Variable | Yes (signal handler) | Yes (unflushed buffers) |
| Container stop | 1–10s | Partially (entrypoint handler) | Moderate |
| **Firehorse Snap (MicroVM)** | **< 125ms (Firecracker MicroVM, AWS benchmark)** | **No** | **No (memory snapshot captured)** |

---

## 3. Behavioral Guardrails — Pre-Execution Enforcement

### 3.1 Architecture

Behavioral guardrails are evaluated **before** any agent action executes. They are implemented as a lightweight policy engine at the VMM layer — not an LLM call, not a software library inside the agent's runtime.

```
Agent Declares Intent
    │
    ▼
┌─────────────────────────────────────────┐
│ Guardrail Engine (VMM layer)            │
│ Policy evaluation: < 5ms                │
│                                         │
│ The "No" mechanism — blocks violations  │
│ NOT the "More" mechanism — that's       │
│ autoresearch (see KYA-NIST-SP-003)      │
│                                         │
│ Checks:                                 │
│  ✓ Semantic: intent within scope?       │
│  ✓ Rate: within action limits?          │
│  ✓ Volume: output within bounds?        │
│  ✓ Temporal: within time window?        │
│  ✓ Cross-agent: declared dependency?    │
└────────────┬──────────────┬─────────────┘
          PASS            FAIL
             │              │
             ▼              ▼
        Execute        BLOCK action
        Action         Log to Firehorse
                       ATS impact (-0.25)
                       If critical: Snap (< 125ms (Firecracker MicroVM, AWS benchmark))
```

### 3.2 Guardrail Categories

| Category | Check | Latency | Failure Action |
|----------|-------|---------|---------------|
| **Semantic Boundary** | Agent intent vs. manifest scope | < 2ms | BLOCK + alert |
| **Rate Limiting** | Action count vs. per-minute cap | < 1ms | THROTTLE to safe rate |
| **Output Volume** | Response size vs. 10MB limit | < 1ms | BLOCK + exfiltration alert |
| **Temporal Boundary** | Current time vs. authorized window | < 1ms | SUSPEND session |
| **Cross-Agent Boundary** | Target MicroVM vs. declared deps | < 2ms | BLOCK + isolation alert |

### 3.3 Why VMM-Layer, Not Agent-Layer

Software-layer guardrails (inside the agent's runtime) are fundamentally bypassable by a sufficiently capable agent. A model that can write code can potentially write code to disable its own guardrails.

KYA guardrails run **outside** the agent's MicroVM, at the VMM layer. The agent cannot:
- Read the guardrail policy
- Modify the guardrail engine
- Delay the guardrail evaluation
- Appeal a guardrail decision

This is the same principle as a hardware firewall vs. a software firewall — the enforcement layer is architecturally unreachable by the subject of enforcement.

---

## 4. Agent Identity Watermarking

### 4.1 Watermark Structure

Every output produced by a KYA-governed agent carries cryptographic provenance:

| Field | Content | Verification |
|-------|---------|-------------|
| `agent_id` | UUID of producing agent | Registry lookup |
| `session_id` | KYA session token | Identity binding lookup |
| `timestamp` | ISO-8601 production time | Forensic timeline |
| `output_hash` | SHA-256 of output content | Tamper detection |
| `kya_score` | ATS at time of production | Trust level context |
| `hmac` | HMAC-SHA256 signed by session key | Authenticity verification |
| `tpm_pcr_quote` | TPM PCR quote at production time | Platform integrity at output time |

### 4.2 Verification Protocol

Any party with the KYA public key can verify:
1. **Authenticity** — The output was produced by the claimed agent
2. **Integrity** — The output has not been modified since production
3. **Platform state** — The producing platform was in a known-good state (TPM quote)
4. **Trust level** — The agent's ATS at production time (useful for downstream consumers)

---

## 5. NIST SP 800-53 Control Mapping

| Control | Control Name | KYA Implementation |
|---------|-------------|-------------------|
| AC-2 | Account Management | Agent Registry + Capability Manifests |
| AC-3 | Access Enforcement | VMM-layer guardrails (< 5ms) |
| AC-4 | Information Flow | Hypervisor egress control (default deny) |
| AC-6 | Least Privilege | Manifest declares minimum required capabilities |
| AU-2 | Audit Events | Firehorse captures all agent actions |
| AU-3 | Content of Audit Records | Sub-second granularity, identity-attributed |
| AU-9 | Protection of Audit Info | TPM 2.0 sealed storage |
| AU-10 | Non-repudiation | Agent Identity Watermarking + TPM quotes |
| IA-2 | Identification/Auth | KYC/KYB-verified identity binding |
| IA-3 | Device Identification | TPM 2.0 attestation of agent runtime |
| SC-7 | Boundary Protection | Firecracker MicroVM isolation |
| SC-28 | Protection at Rest | TPM-sealed forensic logs |
| SI-4 | Information System Monitoring | Real-time Firehorse telemetry |
| SI-7 | Software Integrity | TPM-measured agent binaries |

---

## 6. Threat Model

### 6.1 Threats Addressed

| Threat | Attack Vector | KYA Mitigation |
|--------|--------------|---------------|
| **Agent impersonation** | Fake agent claims trusted identity | TPM attestation + signed manifest |
| **Privilege escalation** | Agent attempts to exceed manifest | VMM guardrails (< 5ms) + ATS penalty |
| **Data exfiltration** | Agent extracts sensitive data | Output volume checks + egress control |
| **Lateral movement** | Agent accesses adjacent sandbox | No inter-MicroVM channels unless declared |
| **Forensic tampering** | Attacker modifies audit logs | TPM-sealed storage |
| **Self-modification** | Agent modifies its own guardrails | Guardrails at VMM layer, unreachable by agent |
| **Supply chain attack** | Compromised BYO agent binary | TPM runtime measurement vs. known-good hash |
| **Autoresearch exploitation** | Agent games self-optimization metrics | Third-party validation gate + A factor cap |

### 6.2 Threats Not Addressed (Out of Scope)

| Threat | Reason | Recommendation |
|--------|--------|---------------|
| Physical TPM compromise | Hardware-level attack on TPM chip | Physical security per NIST SP 800-116 |
| Hypervisor zero-day | Unknown vulnerability in Firecracker | Follow Firecracker security advisories |
| Side-channel attacks | Spectre/Meltdown class | Hardware mitigations + microcode updates |

---

## 7. Certification Roadmap

| Certification | Status | Target |
|--------------|--------|--------|
| **SOC 2 Type II** | Planned | Q3 2026 |
| **ISO 42001** (AI Management Systems) | Planned | Q4 2026 |
| **EU AI Act Art. 12 compliance** | Implemented | Q1 2026 |
| **NIS2 compliance** | Implemented | Q1 2026 |
| **NIST AI RMF alignment** | This document | Q1 2026 |

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Platform:** dws10.com
**Submission Status:** DRAFT — For NIST Review
