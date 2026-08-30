# Themis Partner Agreement v0

## Purpose
Make the commercial path as clear as the technical path. Themis is the **governed route to market** for sovereign hardware and software partners — not another integration project.

---

## 1. Agreement Structure

| Document | Description |
|----------|-------------|
| **Master Partner Agreement (MPA)** | One standard agreement signed by all partners. Covers terms, IP, confidentiality, liability, termination. |
| **Product Schedule (per SKU)** | Optional addendum per product/SKU. Defines: SKU ID, tier, approved clusters, pricing, support SLA, revenue share. |
| **Technical Annex** | Stable capability contract, support boundary, security evidence, lifecycle, version compatibility (see §4). |
| **Validation Pack** | One test pack + one approval decision (see §5). |

**No bespoke agreements.** Every partner signs the same MPA. Commercial variation lives in Product Schedules.

---

## 2. Partner Tiers

| Tier | Meaning | Rights | Obligations | Revenue |
|------|---------|--------|-------------|---------|
| **Listed** | Catalog presence only | Appear in DWS IQ price list, docs, and Themis registry | Maintain SKU data, security advisories, version compatibility | Referral fee (5%) on DWS-sold deals |
| **Validated** | Tested + approved for DWS clusters | Listed rights + co-marketing, joint case studies, priority support escalation | Pass Validation Pack, maintain SLA, provide security evidence, lifecycle commits | Revenue share (15-20%) on co-sold deals |
| **Co-Delivery** | Joint deployment + operations | Validated rights + joint delivery team, shared runbooks, customer-facing ops | Co-delivery SLA, joint runbooks, shared on-call, field support in Finland/EU | Revenue share (25-30%) + services revenue |

**Progression:** Listed → Validated → Co-Delivery (each requires Validation Pack pass + business review).

---

## 3. Commercial Rights

| Right | Listed | Validated | Co-Delivery |
|-------|--------|-----------|-------------|
| **May offer** | Own SKU only | Own SKU + DWS bundles | Own SKU + DWS bundles + joint solutions |
| **Approved on clusters** | T0 only | T0–T2 (T3/T3 Gov Ready by exception) | T0–T4 (including Gov Ready) |
| **Lead handling** | DWS owns lead; partner notified | Joint qualification; DWS routes | Joint ownership; shared pipeline |
| **Revenue recognition** | DWS invoices; pays referral | DWS invoices; pays share | Joint invoicing or DWS invoices + share |
| **Support boundary** | Partner owns L1/L2 | Partner L1/L2; DWS L3 | Shared L1/L2/L3 per runbook |
| **Marketing** | Logo on partner page | Joint case study, webinar | Co-branded assets, events |

**Territory:** Finland + EU by default. Non-EU requires separate schedule.

---

## 4. Technical Annex (Standard for All Tiers)

### 4.1 Capability Contract (What the Adapter Must Implement)

```yaml
# Required adapter interface (Themis v0)
capabilityContractVersion: "1.0"
vendor: "<vendor-id>"
productSku: "<sku-id>"
tier: "Listed|Validated|Co-Delivery"

capabilities:
  discovery:        # Inventory MVP 1
    listClusters: true
    listNodes: true
    listGPUs: true
    listNICs: true
    listDPUs: true
    listNIMs: true
    listDOCAservices: true
    listOTgateways: true
  
  telemetry:        # Normalised health + metrics
    healthCheck: true
    metrics: ["utilization", "temperature", "memory", "errors"]
    intervalSeconds: 30
  
  commands:         # Scoped write operations (MVP 2+)
    deployNIM: false          # NIM Operator only
    deployDOCA: false         # DOCA Operator only
    configureOT: false        # OT adapter only
    firmwareUpdate: false     # If supported
  
  alarms:           # Event streaming
    alarmStream: true
    severityLevels: ["info", "warning", "critical"]
  
  safeStop:         # Graceful shutdown
    drainWorkloads: true
    timeoutSeconds: 300

evidence:
  securityAdvisories: true
  sbom: true                    # SPDX 2.3
  firmwareVersions: true
  certifications: ["CE", "EMC", "..."]  # Per product
  lifecycleCommitment: "5y|7y|10y"      # Minimum 5 years

versionCompatibility:
  nvidiaInfra: ["7.8", "8.0", "8.1"]    # Supported Infra releases
  themisContract: "1.0"
  kubernetes: ["1.28", "1.29"]
  gpuOperator: ["26.3.3"]
  nimOperator: ["3.1.2"]
  networkOperator: ["26.4.1"]
  dpuOperator: ["26.4.0"]
```

### 4.2 Support Boundary

| Layer | DWS Responsibility | Partner Responsibility |
|-------|-------------------|------------------------|
| **Themis Control Plane** | Full ownership | — |
| **Kubernetes (k3s/RKE2)** | DWS (Validated/Co-Delivery) | Partner if Co-Delivery |
| **NVIDIA Operators (GPU/NIM/Network/DPU)** | DWS | Partner firmware/driver |
| **NIM Microservices** | DWS (model cache, routing) | Partner model licensing |
| **DOCA Services** | DWS (deployment) | Partner DPU firmware |
| **OT Adapter (ABB/Siemens/Beckhoff/iPCMax)** | DWS (normalisation) | Partner adapter + device |
| **Partner Hardware** | — | Full (warranty, RMA, field) |
| **Partner Firmware/OS** | — | Full (signed updates, SBOM) |

### 4.3 Security Evidence (Required for Validated+)

- SPDX 2.3 SBOM for all containers/firmware
- Signed firmware images (cosign/sigstore)
- Vulnerability scan (Trivy/Grype) per release
- CVE response SLA: Critical 24h, High 72h, Medium 7d
- Secure boot / TPM 2.0 attestation (where hardware supports)
- Pen-test report (annual, Co-Delivery only)

### 4.4 Lifecycle & Version Compatibility

| Commitment | Minimum |
|------------|---------|
| **Product availability** | 5 years from GA |
| **Security updates** | 5 years (Critical/High) |
| **Firmware/driver updates** | Quarterly (aligned with NVIDIA Infra) |
| **Adapter updates** | Within 30 days of Themis contract version bump |
| **Deprecation notice** | 12 months before EOL |
| **Migration path** | Documented for each major version |

---

## 5. Validation Process

### 5.1 One Test Pack (Mandatory)

| Test | Description | Pass Criteria |
|------|-------------|---------------|
| **TC-01 Discovery** | Adapter returns all inventory types | 100% coverage, <5s latency |
| **TC-02 Telemetry** | Health + metrics stream for 24h | No gaps, correct units |
| **TC-03 Commands** | Idempotent deploy/configure (if supported) | Success + rollback verified |
| **TC-04 Alarms** | Inject fault → alarm received <30s | Correct severity, enriched |
| **TC-05 Safe Stop** | Drain workloads on node shutdown | <300s, zero data loss |
| **TC-06 Security** | Scan adapter + firmware | Zero Critical/High CVEs |
| **TC-07 Evidence** | SBOM, signatures, certs provided | Valid, complete, current |
| **TC-08 Lifecycle** | Version compatibility matrix accurate | Matches NVIDIA Infra 7.8+ |
| **TC-09 Air-gap** | Offline import + manifest verify | Works without internet |
| **TC-10 Integration** | Themis orchestrates end-to-end | Workflow completes, audit trail |

**Test environment:** DWS staging cluster (k3s HA, T2 tier, DGX Spark nodes).

### 5.2 One Approval Decision

| Decision | Authority | Timeline |
|----------|-----------|----------|
| **Pass** | Themis Product Owner + Security Lead | Immediate → Validated tier |
| **Conditional Pass** | Same + 30-day remediation plan | Validated after remediation |
| **Fail** | Same | Remains Listed; re-test after fixes |

**No iterative back-and-forth.** One test pack execution, one decision.

---

## 6. Exit Rules

| Trigger | Action | Timeline | Customer Impact |
|---------|--------|----------|-----------------|
| **Failed support SLA** (3+ breaches/quarter) | Suspend Co-Delivery → Validated | 30 days notice | DWS assumes L1/L2; partner refunds prorated share |
| **Critical security issue** (unpatched >24h) | Immediate suspend all tiers | 24 hours | DWS blocks deployments; customers notified |
| **Obsolete product** (EOL announced) | 12-month deprecation | Per schedule | No new deployments; existing supported to EOL |
| **Validation failure** (re-test fail) | Downgrade to Listed | Immediate | No new co-sell; existing honored |
| **Partner bankruptcy / acquisition** | Automatic termination | Immediate | DWS assumes support or migrates customers |
| **Contract breach** (IP, confidentiality) | Immediate termination | Per MPA | DWS indemnified |

**No auto-renewal.** Each tier requires annual re-validation (lightweight: TC-01, TC-02, TC-07, TC-09).

---

## 7. Three Things the Partner Must Understand

| Question | Answer |
|----------|--------|
| **What does DWS IQ give me?** | Governed route to EU-regulated customers. Themis handles policy, sovereignty, evidence, human gates. You provide hardware/software that plugs into a stable contract. |
| **What must I provide?** | Adapter implementing capability contract, security evidence, lifecycle commits, SLA, Finnish/EU support. Pass one test pack once. |
| **How does a customer buy/deploy?** | Customer sees your SKU in DWS price list → selects tier (T0–T4) → Themis validates contract → deploys via signed bundle → you get revenue share per tier. |

---

## 8. Example: iPCMax Product Schedule (Draft)

```yaml
partner: "ipcmax"
tier: "Validated"
skus:
  - sku: "LF-IPCMAX-IPC409"
    name: "iPCMax IPC-409 Compact Sensor Gateway"
    tier: "T0-T4 approved"
    price: 345
    revenueShare: 15%
    approvedClusters: ["T0", "T1", "T2", "T3", "T4"]
    adapter: "ipcmax-modbus-mqtt"
    supportSLA: "L1/L2 8x5 FI, L3 DWS"
  - sku: "LF-IPCMAX-IPCP68"
    name: "iPCMax IPC-P68 Vision Gateway"
    tier: "T0-T4 approved"
    price: 680
    revenueShare: 15%
    approvedClusters: ["T0", "T1", "T2", "T3", "T4"]
    adapter: "ipcmax-poe-rtsp"
    supportSLA: "L1/L2 8x5 FI, L3 DWS"
  - sku: "LF-IPCMAX-CINCOZE-DA1200"
    name: "Cincoze DA-1200 Rugged Edge"
    tier: "T2-T4 approved"
    price: 1850
    revenueShare: 15%
    approvedClusters: ["T2", "T3", "T4"]
    adapter: "cincoze-modular-io"
    supportSLA: "L1/L2 8x5 FI, L3 DWS"
```

---

## 9. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-30 | One MPA + Product Schedules | No bespoke agreements; commercial variance in schedules |
| 2026-08-30 | Three tiers (Listed/Validated/Co-Delivery) | Clear progression; rights scale with validation |
| 2026-08-30 | One test pack + one approval | No iterative vendor management; clear gate |
| 2026-08-30 | Exit rules for security/obsolescence/SLA | Protects customers; clear partner accountability |
| 2026-08-30 | Technical annex as capability contract | Mirrors Themis MVP 0 contract; adapters implement it |

---

## 11. Partner Captain Role

### Purpose
A **Partner Captain** is the named person inside a partner organisation who is accountable for making that partner's product deliverable through DWS IQ.

### Mandate
- Own the product's DWS IQ offer, approved use cases and target customers
- Maintain the capability contract, adapter, documentation and compatibility data
- Lead validation across installation, identity, telemetry, health, updates and failure handling
- Coordinate customer onboarding, deployment and co-delivery
- Provide first-line escalation and collect evidence for Themis
- Keep the product, versions, support contacts and lifecycle commitments current
- Confirm that the partner can meet its commercial and operational obligations

### Authority
The Partner Captain may:
- Propose changes, prepare deployments, coordinate support
- Accept product-level test results

The Partner Captain may **not**:
- Approve their own security-sensitive, destructive or policy-changing actions

**Themis controls policy, evidence and approval gates.**

### Required Outputs
1. Partner product brief
2. Version and compatibility matrix
3. Validated reference architecture and BOM
4. Support and escalation plan
5. Security and provenance evidence
6. Customer deployment handoff
7. Lifecycle and end-of-life plan

### Accountability Split

| Role | Accountability |
|------|----------------|
| **DWS IQ Captain** | Ecosystem relationship and customer outcome |
| **Partner Captain** | Partner product and delivery outcome |
| **Customer Captain** | Local operational acceptance |
| **Themis** | Policy, orchestration evidence and human gates |

### Succession
The role is attached to the agreement, not merely mentioned in a partner directory. If the Captain leaves, the partner has a **defined handover period (30 days)** to appoint a successor with equivalent authority. Themis pauses Co-Delivery deployments during the gap.

---

## 12. Ecosystem Summary (v0)

### DWS IQ Ecosystem Partner Offer, v0

DWS IQ gives technology partners a governed route into regulated European industrial deployments. Partners can present approved products through the DWS IQ ecosystem, alongside a clear technical contract, validation path, customer-facing offer and defined support model.

**What partners receive**
- A product listing inside the DWS IQ ecosystem
- A defined position in the Aegis reference architecture
- Compatibility mapping across supported infrastructure, Kubernetes, NVIDIA, OT and deployment tiers
- A validated integration path through a Themis adapter
- Customer-facing product and deployment documentation
- A route to joint pilots and co-delivery where appropriate
- Clear commercial terms for referrals, resale or joint delivery

**What partners provide**
- Product identity, SKUs, capabilities and target industries
- Technical documentation, interfaces and deployment prerequisites
- Security, provenance, certification and lifecycle information
- Support contacts, response expectations and escalation paths
- Version and compatibility commitments
- Test access, sample hardware or software where needed for validation
- A named person accountable for the partnership (Partner Captain)

### Themis Boundary
Themis owns desired state, policy, evidence, air-gap bundles and human gates. The partner adapter owns ABB, Siemens, Beckhoff, iPCMax, DOCA, NIM or other vendor mechanics. Aspire provides the observability dashboard for traces, metrics, logs and service maps.

### The Partner Promise
> "DWS IQ gives your product a governed route into regulated industrial deployments. We define where it fits, validate how it works, present it clearly to customers and make responsibilities explicit."

This is a commercial and technical starting point, not the final legal agreement. A lawyer should turn it into binding terms before signing.

---

## 13. Next Steps

1. **Legal review** of MPA template (Finnish law, EU B2B)
2. **Security review** of evidence requirements (FIPS, STIG, SBOM)
3. **Pilot** with iPCMax (Validated tier) — run Validation Pack
4. **Publish** partner onboarding checklist (internal)
5. **Integrate** with CRM/pipeline (HubSpot → Themis registry)

---

**Document Status:** DRAFT v0
**Version:** 0.1
**Date:** 2026-08-30
**Owner:** Commercial + Platform
**Review:** Legal, Security, Product