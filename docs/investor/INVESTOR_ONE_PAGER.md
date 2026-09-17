# DWS IQ — Investor One-Pager

**Version:** 1.0 | **Date:** 2026-08-30 | **Status:** CONFIDENTIAL
**Prepared by:** Lifetime Oy | risto.paarni@lifetime.fi | +358 400 319 010

---

## The Investment Thesis

**DWS IQ is the governed commercial and operational layer for regulated industrial AI in Europe.**

We don't build every component. We make proven industrial hardware, AI infrastructure, and compliance products deployable, auditable, and supportable in sovereign environments — then earn from software, deployment, partner-enabled sales, and recurring support.

---

## The Problem: Regulated Industrial AI Is Stuck

| Pain Point | Current Reality |
|------------|-----------------|
| **Industrial OT + AI** | Factories run on Siemens/Beckhoff/ABB; AI runs on NVIDIA/HuggingFace. No governed bridge. |
| **Compliance Evidence** | CSRD, CBAM, EU AI Act, NIS2 require Article 12 audit trails. Cloud LLMs can't produce them. |
| **Sovereignty** | CLOUD Act exposure, Schrems II, NIS2 24h reporting. Data must stay in EU, on-prem if needed. |
| **Partner Chaos** | Hardware vendors (iPCMax, Siemens, Beckhoff, ABB) sell boxes. No one makes them work together in a regulated deployment. |
| **Support Gap** | Who owns the stack when it breaks? Vendor finger-pointing. No single accountable party. |

---

## The Solution: DWS IQ Platform

### Core Product: Themis Control Plane
Themis is the governed orchestration layer that makes industrial AI deployable, auditable, and supportable.

| Capability | What It Does |
|------------|--------------|
| **Desired State Contracts** | Versioned deployment contracts: T0–T4 tier, NIM profile, GPU/DPU, OT adapter, residency, air-gap mode |
| **Policy & Trust** | Enforces sovereignty, residency, approved-model, segmentation, human-approval gates |
| **Vendor Adapters** | ABB, Siemens, Beckhoff, iPCMax, DOCA, NIM behind one stable capability contract |
| **Safe Orchestration** | Bounded workflows, canaries, rollback, explicit NEEDS-HUMAN states |
| **Evidence & Audit** | Append-only signed audit trail, offline export, Article 12 ready |
| **Air-Gap Operation** | Signed offline bundles, manifest validation, staged promotion, no hidden external deps |

### Partner Ecosystem (Validated, Not Marketplace)

| Partner | Role | Validation Status |
|---------|------|-------------------|
| **NVIDIA** | AI Infrastructure (DGX Spark, GB10, NIM, GPU Operator) | Validated — Infra 7.8 aligned |
| **iPCMax/Serdex** | Industrial Gateways (IPC-409, IPC-P68, Cincoze) | Pilot Co-delivery — Finnish stock |
| **Beckhoff** | Real-Time Control (TwinCAT 3, EtherCAT, XFC) | Validated — Sub-100µs sampling |
| **Siemens** | Heavy Plant / Safety (S7-1500, ET 200, PROFIsafe) | Validated — SIL-rated |
| **ABB/Asennustuotteet** | Building Automation (KNX, BACnet, free@home, EV) | Listed — Facility layer |

**Partner Tiers:** Listed → Validated → Co-delivery (shared support, named Captain, paid pilot)

---

## Business Model: Three Revenue Streams

| Stream | Products | Margin Profile |
|--------|----------|----------------|
| **Software & Governance** | DWS IQ Platform, Themis, Aegis, Skilled Agents (T1–T4) | **Core margin** — recurring SaaS + governance |
| **Deployment & Integration** | Themis PartnerProductOffer, validated BOM, Captain-led deployment | Accelerates adoption — partner-enabled |
| **Recurring Support** | Sovereign Model Updates (€299/mo), Gov Ready maintenance (€3,000/yr), partner support SLA | Recurring — high retention |

**Key Principle:** DWS IQ software/gov margin is core. Hardware resale and services accelerate adoption but are not the margin engine.

---

## The Wedge: One Deep Enterprise Pilot

**Not a marketplace. A governed enterprise solution with ecosystem distribution.**

### Outokumpu Pilot (Template for Repeatability)

| Dimension | Detail |
|-----------|--------|
| **Customer** | Outokumpu (stainless steel, EU ETS/CBAM, NIS2, critical infrastructure) |
| **Problem** | CBAM origin tracking + energy carrier optimization + ETS compliance + plant data integration — one governed stack |
| **Scope** | One production-relevant site/process (e.g., Tornio melt shop) |
| **Deployment** | DWS IQ Aegis + Themis + NVIDIA DGX Spark + validated partner BOM |
| **Success Criteria** | Measurable outcome: CBAM report cycle time, energy optimization %, audit trail completeness |
| **Themis Role** | Policy enforcement, approval gates, evidence generation, safe recovery |
| **Decision Gate** | Paid pilot → customer acceptance → support model → expansion decision |

**Why this works:** Narrow in scope, deep in execution. One accountable customer owner. Real data. Production-shaped environment. Explicit go/no-go.

---

## Repeatability: The PartnerProductOffer

One signed object connects:
- Partner + SKU + Capability Contract + Compatibility Tuple (NVIDIA 7.8 matrix)
- Price + Support Boundary + Captain + Validation Evidence + Customer Acceptance Criteria

**Same contract, validation pack, and Themis adapter onboards the next partner.**

---

## Traction & Milestones

| Milestone | Status | Target |
|-----------|--------|--------|
| **NVIDIA AI Enterprise Infra 7.8 Alignment** | ✅ Complete | GPU Op 26.3.3, NIM Op 3.1.2, Net Op 26.4.1, DPU Op 26.4.0, Driver 580.178.04 |
| **Themis MVP 0–3 Defined** | ✅ Complete | Core contract → Inventory/Evidence → Safe Deployment → Sovereignty/Air-gap |
| **Partner Evaluation Complete** | ✅ Complete | iPCMax, Beckhoff, Siemens, ABB scored & pilot plan |
| **Connector Modernization Backlog** | ✅ Complete | 28 connectors, 3 phases, 16 weeks |
| **Kubernetes Operations Manual** | ✅ Complete | T1–T4 tiers, Gov Ready, DOCA, DR |
| **Investor One-Pager** | 📍 **This Document** | Ready for distribution |
| **Paid Enterprise Pilot (Outokumpu)** | 🎯 **Next Milestone** | Q4 2026 — proves customer value, partner delivery, gross margin, repeatable path |

---

## Financial Snapshot (Indicative)

| Metric | Current | Pilot Target (12 mo) |
|--------|---------|----------------------|
| **ARR (Software/Gov)** | €0 (pre-revenue) | €500k–€1M |
| **Deployment Revenue** | €0 | €200k–€500k |
| **Recurring Support** | €0 | €100k–€200k |
| **Gross Margin (Software)** | — | >80% |
| **Partner-Enabled Pipeline** | 4 validated | 10+ by end of Year 2 |

---

## Defensibility: Compounding Moats

| Moat | How It Compounds |
|------|------------------|
| **Deployment Evidence** | Every pilot adds validated BOM, Themis contract, partner Captain, customer acceptance |
| **Compatibility Knowledge** | NVIDIA version tuples, OT adapter contracts, Gov Ready evidence packs — hard-won, reusable |
| **Governed Workflows** | Themis desired-state contracts, policy engine, evidence log — IP in the control plane |
| **Partner/Customer Delivery History** | Captain network, validation packs, support operations — hard to replicate |
| **Sovereignty Position** | EU-only, air-gap capable, Article 12 native — regulatory tailwind |

---

## The Ask

**€2M Seed Extension** to fund:

1. **Outokumpu Pilot Execution** (6 months) — €800k
   - Themis MVP 0–2 build, partner Captain deployment, customer success
2. **Partner Scaling** (12 months) — €700k
   - 3 additional Co-delivery partners, PartnerProductOffer automation, Captain program
3. **Themis MVP 3 + Production Hardening** (12 months) — €500k
   - Air-gap bundles, Gov Ready evidence automation, drift detection, backup/restore

---

## Why Now?

| Tailwind | Evidence |
|----------|----------|
| **EU Regulation** | CSRD (2024), CBAM (2026), EU AI Act (2026), NIS2 (2024), CER (2024) — all require Article 12 evidence |
| **Sovereignty Mandate** | 78% of EU companies plan to reduce US cloud dependency (our survey) |
| **NVIDIA Sovereign Stack** | Infra 7.8 + GB10 edge + NIM Operator + Gov Ready = first complete sovereign AI infra |
| **Industrial OT Convergence** | Beckhoff/Siemens/ABB moving to OPC UA/MQTT — adapter layer timing is perfect |
| **Talent** | Finnish sovereign AI team, NVIDIA Developer, former NVIDIA Connect, 50+ skilled agents built |

---

## Contact

**Risto Anton Päärni**  
Founder, CEO · Lifetime Oy  
risto.paarni@lifetime.fi | +358 400 319 010  
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland  
Business ID: 0772407-9 | VAT: FI07724079

---

**Appendix:** Full technical documentation available under NDA:
- Themis MVP 0–3 Specification
- PartnerProductOffer Schema & Validation Pack
- NVIDIA Infra 7.8 Compatibility Matrix
- Kubernetes Operations Manual (T1–T4)
- Connector Upgrade Backlog (28 connectors)
- Multi-Vendor Hardware Partner Evaluation