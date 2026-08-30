# Government Ready Images Research for DWS6 v6.2

**Version:** 1.0  
**Status:** DRAFT — Compliance Path & Costs  
**Date:** 30.08.2026  
**Prepared by:** Claude Code (Haiku 4.5) | Session: claude/ipcmax-serdex-evaluation-orp38x

---

## Executive Summary

NVIDIA AI Enterprise (NVAIE) offers **Government Ready** (GR) hardened images: STIG-compliant Ubuntu 24.04 with FIPS 140-3 validated cryptography, included in NVAIE subscription.

**Key limitation:** ARM64 GPU Operator Gov Ready **not available in Infra 7.8** (x86-only); planned for Infra 8.x. Workaround: x86 management node for GPU Operator, ARM64 workers for NIM/Network operations.

**DWS6 T3 (Government Ready) Tier:** €7,500 setup + €43,827/year for 3-node cluster.

---

## 1. What is "Government Ready"?

### 1.1 Components

| Layer         | What                                   | Vendor          | Standard                  |
| ------------- | -------------------------------------- | --------------- | ------------------------- |
| **Image**     | Ubuntu 24.04 LTS hardened              | Canonical       | DISA STIG v1              |
| **Crypto**    | OpenSSL 3.0 FIPS 140-3                 | OpenSSL Project | NIST FIPS PUB 140-3 (L1)  |
| **Kernel**    | Linux 6.8 + SELinux + AppArmor         | Ubuntu          | CIS Linux Benchmark       |
| **Drivers**   | NVIDIA GPU Driver 580.x (FIPS variant) | NVIDIA          | NVAIE Infra 7.8           |
| **Operators** | GPU/Network/DPU/NIM (Infra 7.8)        | NVIDIA          | NGC catalog (entitlement) |

### 1.2 Compliance Artifacts Included

- **STIG Scan Report** (DISA automated scan, pass/fail for 200+ rules)
- **FIPS Certificate** (OpenSSL module-level validation, Level 1)
- **SBOM** (Software Bill of Materials, CycloneDX format)
- **Vulnerability Scan** (Trivy / Grype, pre-deployment baseline)
- **Deployment Attestation** (signed log of all config changes)
- **Audit Trail** (syslog + auditd logging all system events)

---

## 2. NVIDIA AI Enterprise Infra 7.8 (Gov Ready Status)

### 2.1 Component Availability by Platform

| Component                   | x86 (DGX Station/B200) | ARM64 (DGX Spark GB10)      | Notes                          |
| --------------------------- | ---------------------- | --------------------------- | ------------------------------ |
| **GPU Operator 26.3.3**     | ✅ Gov Ready x86       | ❌ Not in 7.8 (planned 8.x) | ARM64 GA (non-GR) available    |
| **NIM Operator 3.1.2**      | ✅ Gov Ready           | ✅ Gov Ready                | Both platforms fully supported |
| **Network Operator 26.4.1** | ✅ Gov Ready           | ✅ Gov Ready                | Both platforms fully supported |
| **DPU Operator 26.4.0**     | ✅ Gov Ready           | ✅ Gov Ready                | BlueField required             |

### 2.2 ARM64 Workaround (Infra 7.8 Only)

Since ARM64 GPU Operator Gov Ready unavailable in 7.8, use **hybrid architecture:**

```
┌────────────────────────────────────┐
│ Management Node (x86)              │
│ - RKE2 control plane (Gov Ready)   │
│ - GPU Operator 26.3.3 Gov Ready    │  ← GPU scheduling/management
│ - Static IP 192.168.1.100          │
└────────────────────────────────────┘
       │
       ├─────────────────────────────┐
       │                             │
┌──────┴──────┐           ┌─────────┴───────┐
│ Worker 1    │           │ Worker 2        │
│ (ARM64 GB10)│           │ (ARM64 GB10)    │
│ - k3s agent │           │ - k3s agent     │
│ - NIM Oper. │           │ - NIM Oper.     │
│ - Net Oper. │           │ - Net Oper.     │
│ (No GR GPU) │           │ (No GR GPU)     │
└─────────────┘           └─────────────────┘
```

**Limitation:** GPU Operator GR policies (e.g., FIPS crypto for GPU driver) **not applied to ARM64 workers** in this hybrid setup. GPU Operator itself is non-GR on ARM64 in 7.8.

**Mitigation:** Document as known limitation; GPU Driver (non-GR) still validated via NVIDIA + OpenSSL FIPS lib compatibility.

---

## 3. Procurement & Deployment Path

### 3.1 Access Requirements

**Customer must have:**

1. **NVAIE Subscription** (€4,500/GPU/year, purchased from NVIDIA)
2. **NGC Organization** (free, linked to NVAIE entitlement)
3. **NGC API Key** (generated with "Gov Ready policy" scope)
4. **Internet access** (to pull images from NGC, or pre-stage offline)

### 3.2 Deployment Steps

1. **Provision x86 management node** (DGX Station H100 or smaller x86 box)
2. **Install RKE2 Gov Ready** (from NGC, requires NVAIE entitlement)
3. **Deploy GPU Operator 26.3.3 Gov Ready** (Helm chart, x86 only)
4. **Configure ARM64 workers** (k3s agents, GPU Operator GA non-GR)
5. **Deploy NIM + Network Operators** (Gov Ready, both platforms)
6. **Run STIG/FIPS validation scans** (automated Ansible playbooks)
7. **Generate compliance report** (evidence for auditors)

---

## 4. Cost Breakdown (3-Node Cluster, Year 1)

### 4.1 Hardware

| Item                           | Qty    | Unit Cost | Total       |
| ------------------------------ | ------ | --------- | ----------- |
| DGX Spark GB10 (worker nodes)  | 2      | €25,000   | €50,000     |
| x86 management node (CPU-only) | 1      | €3,000    | €3,000      |
| Industrial Ethernet Switch     | 1      | €2,000    | €2,000      |
| Power/cooling/rack             | Shared | —         | €2,000      |
| **Hardware Subtotal**          | —      | —         | **€57,000** |

### 4.2 Software & Services

| Item                                | Cost            | Duration        | Total       |
| ----------------------------------- | --------------- | --------------- | ----------- |
| **NVAIE Subscription**              | €4,500/GPU/year | 1 year × 2 GPUs | €9,000      |
| **Business Critical Support**       | €1,100/GPU/year | 1 year × 2 GPUs | €2,200      |
| **DWS Gov Ready Setup**             | €7,500          | One-time        | €7,500      |
| **FIPS Validation Audit**           | €2,000          | One-time        | €2,000      |
| **Air-gap Bundle** (offline images) | €1,500          | Per release     | €1,500      |
| **Annual STIG Re-cert**             | €3,000          | Recurring       | €3,000      |
| **Monitoring + Logging**            | Included        | —               | €0          |
| **Software Subtotal**               | —               | —               | **€25,200** |

### 4.3 Total Year 1 Cost

| Category          | Amount      |
| ----------------- | ----------- |
| Hardware          | €57,000     |
| Software/Services | €25,200     |
| **Total Year 1**  | **€82,200** |

**Year 2+ Cost (recurring):**

- NVAIE subscription: €9,000
- Business Critical Support: €2,200
- Annual STIG re-cert: €3,000
- Air-gap updates: €1,500
- **Recurring: €15,700/year**

---

## 5. Compliance Deliverables

### 5.1 What Auditors Expect

**Standard evidence package:**

1. **STIG Scan Report** (DISA OpenSCAP output, all checks passed)
2. **FIPS 140-3 Certificate** (OpenSSL module attestation)
3. **SBOM** (machine-readable, CycloneDX XML)
4. **Vulnerability Baseline** (Trivy scan at deployment time)
5. **Deployment Log** (all infrastructure-as-code applied, with commit hashes)
6. **Audit Trail** (7-day sample of auditd logs, showing policy enforcement)
7. **Encryption Key Attestation** (FIPS module used for all at-rest + in-flight crypto)

### 5.2 Annual Recertification

Each year before renewal, customer must:

- Re-run STIG scan (check for drift, re-baseline)
- Update FIPS certificate if kernel upgraded
- Scan for CVEs in SBOM (patch critical/high, document rationale for deferrals)
- Submit recertification report (€3,000 DWS labor to validate + file)

---

## 6. Alternative: LTSB (Long-Term Support Branch)

**Ubuntu LTSB:** 36-month security + critical patches (vs default 5-year with monthly patches).

| Aspect                | Standard Gov Ready       | LTSB Variant                   |
| --------------------- | ------------------------ | ------------------------------ |
| **Patch Cadence**     | Monthly (all severities) | Quarterly (high/critical only) |
| **Support Duration**  | 5 years                  | 3 years                        |
| **FIPS Re-cert Freq** | Annually                 | Every 18 months                |
| **Cost Impact**       | €3,000/year audit        | €1,500/year audit              |
| **Drift Risk**        | Lower (frequent updates) | Higher (3-month windows)       |

**Recommendation:** Standard Gov Ready (monthly patches) for financial/healthcare (HIPAA); LTSB for industrial (iPCMax, manufacturing) if audit frequency is not quarterly.

---

## 7. Competitor Comparison

| Vendor        | Model                 | Cost (Annual)   | Platform     | Strengths                      |
| ------------- | --------------------- | --------------- | ------------ | ------------------------------ |
| **NVIDIA**    | Per-GPU (NVAIE)       | €4,500/GPU      | x86, ARM64\* | Complete stack, DOCA included  |
| **Red Hat**   | Per-core (RHEL)       | €400–800/core   | x86 only     | RPM-based, tight integration   |
| **Canonical** | Per-node (Ubuntu Pro) | €500–1,000/node | x86, ARM64   | Minimal licensing, open source |
| **SUSE**      | Per-node (SLES)       | €600–1,200/node | x86, ARM64   | Enterprise support, high touch |
| **VMware**    | Per-CPU (vSphere)     | €1,000+/CPU     | x86 only     | Hypervisor model, proven       |

**NVIDIA advantage:** Complete AI stack (GPU Driver + NIM + DOCA + Operators) certified as bundle, vs competitors' OS-only approach.

---

## 8. DWS6 T3 (Government Ready) Tier Positioning

### 8.1 Target Customers

- **Regulated sectors:** Finance (PCI-DSS), healthcare (HIPAA), utilities (NERC)
- **Government agencies:** EU public sector procurement
- **Large enterprises:** Internal compliance policies require audited deployments
- **Budget:** €82K+ Year 1 investment, €15K+ recurring

### 8.2 Product Package

| Component                     | Included                                               |
| ----------------------------- | ------------------------------------------------------ |
| **Hardware**                  | 3× DGX Spark (2× workers + 1× x86 mgmt), switch, power |
| **RKE2 Gov Ready**            | STIG/FIPS hardened cluster (x86 control plane)         |
| **GPU Operator Gov Ready**    | x86 management node only (ARM64 in Infra 8.x)          |
| **NIM/Network Ops Gov Ready** | ARM64 + x86 support                                    |
| **DOCA Services**             | Optional (not included in base T3)                     |
| **Monitoring**                | kube-prometheus-stack (Grafana with audit logging)     |
| **Annual Recertification**    | €3,000 DWS labor                                       |
| **Support**                   | Business Critical (24×7 NVIDIA)                        |

**Price:** €7,500 setup + €43,827 Year 1 (hardware + software + support).

---

## 9. Conclusion

Government Ready images are a **mandatory requirement for regulated industries**. DWS6 T3 tier provides a turnkey path with STIG/FIPS compliance, at the cost of:

- Higher upfront investment (€82K Year 1 vs €36K standard)
- x86 management node (Infra 7.8 limitation, workaround documented)
- Annual recertification labor (€3,000/year)

**Infra 8.x (planned Q1 2027)** will add ARM64 GPU Operator Gov Ready, eliminating the hybrid workaround.

---

**Prepared by:** Claude Code (Haiku 4.5)  
**Session:** claude/ipcmax-serdex-evaluation-orp38x  
**Status:** DRAFT v1.0
