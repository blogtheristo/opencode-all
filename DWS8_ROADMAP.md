# DWS8 ROADMAP — Feynman-Era Agentic Platform

> **Document Standard:** DWS Document Standard v2.0
> **Version:** 2.1.0
> **Status:** Living Document
> **Created:** 2026-03-16
> **Updated:** 2026-06-02 — v2.2: Added Phase 3B — Post-Quantum Foundation (Q1–Q4 2029), a crypto-agility / PQC-migration track aligned with the 2029 industry migration target (Google / Cloudflare / Ethereum Foundation). Sourced from Field Note #3 (q-day / Shor-on-ECC). Hands the long-horizon (2030+) PQC platform off to the new DWS9 roadmap. Previously: 2026-05-31 — v2.1: CEO reshape lockstep with DWS 7. Scope-split PR 8-041 — the single-entity EUTL-verified Scope 3 slice moves forward to DWS 7 Phase 2.6 (new PR 093I); 8-041 now scopes only the cross-customer network effect (needs multi-customer critical mass, Phase 2B). Earlier: 2026-03-24 — v2.0: carbon balance sheet thesis, debit-credit ledger architecture, 18-source data mesh, cross-vertical intelligence layer, enterprise data sovereignty add-ons
> **Timeline:** Q1 2028 → Q4 2029 (24 months)
> **Target:** DWS IQ 8 — Carbon balance sheet infrastructure for industrial Europe

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 2.2 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: v2.2 — Added Phase 3B (Post-Quantum Foundation, Q1–Q4 2029): crypto-agility inventory, hash-based signing, NIST FIPS 203/204/205 baseline, HNDL re-encryption, hardware KYA PQC. Anchored to the 2029 migration target shared by Google/Cloudflare/Ethereum Foundation. Cross-referenced Field Note #3 and the new DWS9 roadmap (2030+ PQC platform). Updated Phase Overview + PR count summary
  - Version: 2.1 | Tool: Claude Code (Opus 4.8) | Session: claude/ceo-review-dws-firehorse-1kWuP | Date: 31.05.2026 | Changes: v2.1 — CEO reshape lockstep with DWS 7. Scope-split PR 8-041: single-entity EUTL-verified Scope 3 slice moved forward to DWS 7 Phase 2.6 (PR 093I); 8-041 retains only the cross-customer network effect
  - Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/add-debit-credit-compliance-FevOa | Date: 24.03.2026 | Changes: v2.0 — Carbon balance sheet thesis, debit-credit ledger as core architecture, 18-source data mesh, cross-vertical intelligence, enterprise data sovereignty add-ons, Qantic BESS integration context
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/nvidia-gtc-2026-notes-cYO48 | Date: 16.03.2026 | Changes: Initial creation — DWS 8 roadmap based on NVIDIA GTC 2026 Feynman architecture announcements, post-DWS 7 planning horizon

Session Links & References:
  - Claude Code (claude/nvidia-gtc-2026-notes-cYO48): https://github.com/blogtheristo/dws6/commits/claude/nvidia-gtc-2026-notes-cYO48
  - NVIDIA GTC 2026 Keynote: March 16, 2026, SAP Center, San Jose

Document Status:
  - Created: 16.03.2026
  - Last Modified: 31.05.2026
  - Language: English
  - Publication Status: ACTIVE

***

---

## Executive Summary

DWS 8 is **carbon balance sheet infrastructure for industrial Europe** — running on NVIDIA's Feynman architecture.

DWS 7 ships the compliance engine and proves product-market fit with 16 customers. DWS 8 transforms that engine into a **system of flow** where carbon moves through a double-entry ledger the same way money moves through financial accounting. Every tonne CO2e is tracked as a debit or credit, every entry traces back to a verified open data source, and cross-vertical intelligence emerges when 20 industries share one ledger format.

**Two theses, one platform:**

1. **Hardware thesis (v1.0):** NVIDIA's Feynman architecture (Rosa CPU, LP40 LPU, BlueField-5 DPU) enables hardware-native agent orchestration. DWS 8 is the first industrial compliance platform on purpose-built agentic silicon.

2. **Data thesis (v2.0):** The debit-credit compliance ledger + 18 open/enterprise data sources + 20 industry verticals creates a carbon data mesh no single-vertical competitor can replicate. A steel mill's ETS surrender (debit) flows through to a construction company's CBAM import cost (debit), becomes their CSRD Scope 3 disclosure, and determines their Taxonomy alignment (credit). Same carbon, four regulatory touchpoints, one ledger.

**The product shift:** From "How do we guess our footprint?" to "How do we reconcile our carbon balance sheet?"

**Prerequisite:** DWS 7 GA release (Q4 2027). DWS 8 planning begins Q1 2027, development begins Q1 2028.

---

## Technology Foundation — NVIDIA Feynman (2028)

| Component | Chip | DWS 8 Role |
|-----------|------|-----------|
| **CPU** | NVIDIA Rosa | Orchestrates agentic workloads — data, tools, tokens across GPUs, LPUs, storage, networking. Replaces software-level agent scheduling with hardware-native orchestration |
| **GPU** | LP40 (next-gen LPU) | Dedicated inference silicon — successor to Groq 3 LPU. Ultra-low-latency agent reasoning |
| **DPU** | BlueField-5 | Edge security and network isolation. Hardware-level KYA enforcement for Lifetime Fleet |
| **Networking** | CX10 Ethernet + NVIDIA Kyber | Co-packaged optics for scale-up. Silicon photonics for optical data transport |
| **Process** | TSMC A16 (1.6nm) | Maximum efficiency for sovereign on-premise deployment |
| **Innovation** | Silicon photonics | Optical signals replace electrical — lower power, higher bandwidth, cooler operation |

---

## DWS Architecture Evolution: 7 → 8

| Layer | DWS 7 (Blackwell/Groq 3) | DWS 8 (Feynman) |
|-------|--------------------------|-----------------|
| **Brain** | Software agent orchestration (BaseAgent + MCP) | Hardware-native agent orchestration (Rosa CPU) |
| **Memory** | pgvector + RAG on GPU inference | Optical interconnects for model serving (silicon photonics) |
| **Body** | Acer GN100 (Blackwell) + Cloud Run | Feynman on-premise appliance + edge nodes |
| **Hands** | Jetson Orin Nano edge | BlueField-5 DPU edge with hardware KYA |
| **Ledger** | Persistent carbon balance sheet (DWS 7 Phase 2.6) | Cross-entity reconciliation, supply chain graph, network effect |
| **Data Mesh** | 13 open sources, static fallback | 18+ sources, real-time feeds, enterprise connectors |

---

## Carbon Balance Sheet Architecture

The carbon balance sheet is to DWS 8 what the general ledger is to ERP. Every compliance event produces a journal entry.

### The Ledger Model

```
1.852 tCO2e/t (hot-rolled steel) is to carbon accounting
  what EUR 1.00 is to financial accounting — a fungible, auditable unit.

Steel mill ETS surrender (DEBIT)
  → Construction company CBAM import (DEBIT)
    → CSRD Scope 3 upstream disclosure
      → Taxonomy alignment check (CREDIT or BLOCK)

Same carbon. Four regulatory touchpoints. One ledger.
```

### Data Source Tiers

| Tier | Sources | Pricing | Customers |
|------|---------|---------|-----------|
| **Open (baked-in)** | ENTSO-E, EMBER, Sandbag, EUTL, UNFCCC, GHG Protocol, CBAM Reg, EEA, Eurostat NACE, Eurostat PRODCOM, EFRAG XBRL, OpenClimate, Energiavirasto | Included in all tiers | All |
| **Enterprise Add-ons** | Bloomberg, Refinitiv (LSEG), S&P Global, Ecoinvent, CDP | Connector fee (customer brings own license) | Nordic/Enterprise World |

**Strategic positioning:** Open sources baked in by default. Paid sources (Bloomberg, Ecoinvent, Refinitiv) available as "Data Sovereignty Add-ons" — DWS provides the connector, customer controls the data source. CFO sees infrastructure, not a replacement.

### Cross-Vertical Intelligence

When customer A's verified emissions (from EUTL) become the actual emission factor for customer B's CBAM calculation — instead of Reg. 2023/1773 defaults — both ledgers get more accurate. Customer A's credit (verified lower carbon) directly reduces customer B's debit.

This is the network effect. More industries on the platform = more accurate ledgers for everyone.

### Ground Truth vs Spend-Based

| Approach | Method | Accuracy | DWS 8 |
|----------|--------|----------|-------|
| **Spend-based** (competitors) | €2M on steel × sector average | ±40% | Not used |
| **Activity-based** (DWS 7) | 1,080t × ETS benchmark 1.328 | ±15% | Fallback |
| **Transaction-verified** (DWS 8) | 1,080t × EUTL installation DE-123456 verified 1.72 | ±3% | Default |

### Firehorse Agent Evolution

DWS 7 agents fill templates. DWS 8 agents reason across verticals.

| Agent | DWS 7 | DWS 8 |
|-------|-------|-------|
| **Compliance** | Score one company against one regulation | Reconcile carbon balance across supply chain |
| **Report** | Generate CSRD disclosure for one entity | Cross-reference supplier CBAM with buyer CSRD, sign both |
| **BESS** | Calculate one asset's compliance cost | Correlate grid factor changes across portfolio, rebalance ledger |
| **Material Oracle** | Look up one material's embodied carbon | Track carbon flow: extraction → manufacturing → construction → disposal |

A Firehorse Report agent that knows steel CBAM factors, construction CSRD benchmarks, and energy grid emissions simultaneously is a fundamentally different product than one that fills in a template.

---

## Phase Overview

| Phase | Period | Theme | Track | Key Deliverables |
|-------|--------|-------|-------|-----------------|
| **0** | Q1-Q2 2027 | **Planning & Research** | Both | Feynman SDK, carbon ledger DB design, DWS 7 GA |
| **1A** | Q1-Q2 2028 | **Rosa Integration** | Hardware | Agent orchestration on Rosa CPU |
| **1B** | Q1-Q2 2028 | **Carbon Balance Sheet** | Data | Persistent ledger, XBRL export, multi-entity reconciliation |
| **2A** | Q3-Q4 2028 | **Silicon Photonics** | Hardware | Optical interconnects for sovereign on-premise |
| **2B** | Q3-Q4 2028 | **Cross-Vertical Intelligence** | Data | Supply chain carbon flow, network effect, enterprise connectors |
| **3** | Q1-Q2 2029 | **Edge Fleet** | Hardware | BlueField-5 DPU, hardware KYA |
| **3B** | Q1-Q4 2029 | **Post-Quantum Foundation** | Security | Crypto-agility inventory, hash-based signing, NIST FIPS 203/204/205 baseline, HNDL re-encryption |
| **4** | Q3-Q4 2029 | **DWS 8 GA** | Both | Full release, migration, carbon balance sheet as default |

---

## Phase 0: Planning & Research (Q1-Q2 2027)

This phase runs in parallel with DWS 7 Phase 6 (GA release).

| Item | Description | Dependency |
|------|-------------|------------|
| Feynman SDK early access | Secure NVIDIA ISV Partner early access to Rosa CPU development tools | NVIDIA Connect ISV partnership |
| Architecture design document | DWS 8 Brain-Memory-Body-Hands on Feynman silicon | DWS 7 GA architecture learnings |
| Rosa CPU agent scheduler prototype | Proof-of-concept: BaseAgent framework on Rosa hardware scheduling | Feynman SDK |
| Silicon photonics feasibility study | Assess optical interconnects for sovereign on-premise compliance workloads | NVIDIA technical briefing |
| BlueField-5 DPU evaluation for KYA | Hardware-level agent isolation replacing software sandboxing | KYA Standard v2.0 design |
| Customer migration planning | DWS 7 → DWS 8 upgrade path for 16+ customers | DWS 7 customer base |
| Carbon ledger DB schema design | Immutable append-only schema, dual-unit (EUR + tCO2e), chart of carbon accounts | DWS 7 ledger usage data |
| Supply chain graph data model | Entity relationships, carbon flow edges, intercompany elimination rules | DWS 7 multi-entity customers |
| Enterprise connector architecture | Add-on connector pattern (Bloomberg, Ecoinvent, Refinitiv). Env var activation, customer-owned licenses | DWS 7 enterprise tier feedback |
| EFRAG XBRL auto-sync prototype | GitHub webhook → ESRS registry update. Proof of concept for taxonomy change detection | EFRAG XBRL taxonomy releases |

---

## Phase 1A: Rosa Integration (Q1-Q2 2028)

**Goal:** Agent orchestration on purpose-built agentic silicon.

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 8-001 | Rosa CPU agent scheduler | P0 | Replace software-level agent loop with Rosa hardware scheduling. Sub-millisecond agent dispatch |
| 8-002 | Hardware-native tool calling | P0 | Rosa-accelerated MCP tool execution. GPU for context, LPU for reasoning, Rosa for orchestration |
| 8-003 | Agent-to-agent delegation on silicon | P1 | Hardware routing between agents — no software overhead for delegation |
| 8-004 | KYA v3.0 with Rosa isolation | P0 | KYA Standard updated for hardware-native agent isolation |
| 8-005 | Multi-agent throughput benchmarking | P1 | Compare DWS 7 (software) vs DWS 8 (Rosa) agent throughput |
| 8-006 | LP40 inference integration | P0 | Next-gen LPU for ultra-low-latency compliance queries |
| 8-007 | Climate LLM on Feynman | P1 | Domain-specific model serving on Rosa + LP40 stack |
| 8-008 | Article 12 hardware logging | P1 | EU AI Act logging at hardware level — tamper-proof audit trail |

---

## Phase 1B: Carbon Balance Sheet (Q1-Q2 2028)

**Goal:** Evolve the persistent carbon balance sheet (DWS 7 Phase 2.6) into a cross-entity reconciliation engine with supply chain graph intelligence.

**Prerequisite:** DWS 7 ships persistent carbon ledger, chart of carbon accounts, CFO dashboard (Phase 2.6, Jul 2026). 16 customers generating ledger data by Phase 6 (Q4 2027).

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 8-030 | Persistent carbon ledger table | P0 | Immutable append-only ledger in Supabase. Schema: `(id, org_id, entry_type, category, amount_eur, amount_tco2e, regulation, source_id, description, created_at)`. RLS enforced. No UPDATE/DELETE — corrections are reverse entries |
| 8-031 | Dual-unit entries (EUR + tCO2e) | P0 | Every entry carries both financial (EUR) and physical (tCO2e) amounts. 1.852 tCO2e/t is the universal unit. Carbon price at time of entry preserved for audit trail |
| 8-032 | XBRL/iXBRL export | P0 | Export ledger to ESRS-compliant XBRL for regulatory filing. Consumes EFRAG XBRL taxonomy (auto-synced). Machine-readable CSRD reports |
| 8-033 | Multi-entity consolidation | P1 | Group-level carbon balance sheet. Parent company consolidates subsidiaries. Eliminates intercompany carbon double-counting |
| 8-034 | Audit trail with sovereignty signing | P0 | Every ledger entry signed via Full Sovereignty layer (EU AI Act Article 12). Tamper-proof. Auditor can verify chain from entry → agent → data source → regulation |
| 8-035 | Chart of carbon accounts | P1 | Standardized account structure: Scope 1 Direct, Scope 2 Indirect, Scope 3 Upstream, Scope 3 Downstream, Offsets, Free Allocation. Maps to ESRS E1 disclosures |
| 8-036 | ERP GL integration | P1 | Sync carbon ledger entries to financial GL in SAP/IFS/Dynamics. Carbon costs appear as line items in the financial P&L. Bi-directional: ERP purchase orders → CBAM debit entries |
| 8-037 | Variance analysis engine | P2 | Predicted vs actual compliance costs per quarter. Budget vs actual carbon balance. Alerts when ledger diverges from forecast by >10% |
| 8-038 | Historical carbon price adjustment | P2 | When EMBER/Sandbag price updates, recalculate unrealized gains/losses on existing ETS positions. Mark-to-market for carbon assets |

---

## Phase 2A: Silicon Photonics (Q3-Q4 2028)

**Goal:** Optical interconnects for sovereign on-premise deployment.

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 8-009 | Silicon photonics on-premise appliance | P0 | DWS 8 sovereign hardware: optical data transport, lower power, cooler operation |
| 8-010 | NVIDIA Kyber scale-up integration | P1 | Co-packaged optics for multi-GPU agent workloads |
| 8-011 | Thermal optimization for industrial deployment | P1 | Validated for factory/construction environments (40°C+) |
| 8-012 | Optical RAG pipeline | P1 | Memory layer served via optical interconnects — faster regulation retrieval |
| 8-013 | Power efficiency certification | P2 | Document power savings vs DWS 7 for customer TCO comparison |

---

## Phase 2B: Cross-Vertical Intelligence (Q3-Q4 2028)

**Goal:** Supply chain carbon flow tracking and the network effect.

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 8-040 | Supply chain carbon flow graph | P0 | Track carbon from extraction → manufacturing → construction → disposal. Graph DB (or pgvector adjacency) linking supplier ledger entries to buyer ledger entries. One company's output (credit) becomes another's input (debit) |
| 8-041 | Verified supplier emission factors (cross-customer network effect) | P0 | **Scope split:** the single-entity slice (use a supplier's own EUTL installation record instead of Reg. 2023/1773 defaults) ships earlier in DWS 7 Phase 2.6 as PR 093I. What remains here is the **network effect**: when customer A's verified EUTL data becomes the actual emission factor for customer B's CBAM calculation, both ledgers get more accurate. Requires multi-customer ledger critical mass (Phase 2B), which is why it stays in DWS 8 |
| 8-042 | Enterprise data connectors (Bloomberg, Refinitiv, Ecoinvent) | P1 | "Data Sovereignty Add-ons" — customer brings their own license, DWS provides connector. Env var activation (`BLOOMBERG_API_KEY`). Ingest existing feeds, don't replace data providers |
| 8-043 | Cross-vertical benchmarking dashboard | P1 | CFO sees how their ETS exposure compares across industries. Steel vs cement vs chemicals on the same carbon balance sheet. Powered by Eurostat NACE + EEA + CDP data |
| 8-044 | Intercompany carbon elimination | P1 | When two subsidiaries of the same group trade, eliminate intercompany carbon the same way financial accounting eliminates intercompany revenue. Prevents double-counting in consolidated reports |
| 8-045 | Scenario planning engine | P2 | What-if analysis: "If carbon price reaches €90, what's our net position?" "If supplier X reduces emissions 20%, how does our CBAM cost change?" Runs across the full supply chain graph |
| 8-046 | Carbon credit marketplace integration | P2 | Connect ledger credits (verified offsets, avoided emissions) to voluntary carbon market. Credits from BESS avoided emissions → tradeable units |
| 8-047 | PRODCOM-to-CBAM mapping engine | P1 | Automated mapping from Eurostat PRODCOM product codes to CBAM Annex I CN codes. Fills the gap while CBAM machine-readable API is PDF-only |

---

## Phase 3: Edge Fleet (Q1-Q2 2029)

**Goal:** Hardware-secured edge devices for Lifetime Fleet.

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 8-014 | BlueField-5 DPU edge deployment | P0 | Hardware-level network isolation for fleet devices |
| 8-015 | Hardware KYA enforcement on edge | P0 | Agent isolation at DPU level — untamperable even with physical access |
| 8-016 | Autonomous vehicle integration (DRIVE Hyperion v2) | P2 | Lifetime Fleet autonomous logistics on industrial sites |
| 8-017 | Edge-to-cloud agent synchronization | P1 | Agents running on edge seamlessly delegate to cloud when needed |
| 8-018 | Satellite data integration (Space-1 paradigm) | P3 | If NVIDIA Space-1 reaches commercial status, integrate orbital compute nodes |

---

## Phase 3B: Post-Quantum Foundation (Q1-Q4 2029)

**Goal:** Make the DWS 8 platform **crypto-agile** by the **2029 industry migration target** — the same date held by Google, Cloudflare, and the Ethereum Foundation. This phase does **not** attempt the full post-quantum platform (that is DWS 9, 2030+). It lays the foundation: know every cryptographic dependency, sign with quantum-resistant primitives, and neutralize harvest-now-decrypt-later (HNDL) exposure on sovereign data.

**Source:** `docs/field-notes/2026-06-02-quantum-qday-shor-ecc-field-note.md` (q-day / Shor-on-ECC). The 2030–2035 q-day window and the ~20× cheaper Shor-on-secp256k1 estimate re-price every long-lived ciphertext DWS holds today.

**Posture:** Do not panic; do migrate deliberately. Crypto-agility (algorithm-replaceability) is the deliverable — not a bet on a specific q-day date.

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 8-050 | Cryptographic dependency inventory | P0 | Enumerate every primitive in the stack — JWT signing, TLS, DB-at-rest, KZG/BLS-style commitments, audit-trail signatures (Article 12), KYA identity spine. Output a machine-readable crypto bill of materials (CBOM) |
| 8-051 | NIST FIPS 203/204/205 baseline | P0 | Adopt ML-KEM (203), ML-DSA (204), SLH-DSA (205) as the approved PQC set. Hybrid classical+PQC where standards/libraries are immature. Pin versions in `DWS_SECURITY_STANDARD.md` |
| 8-052 | Hash-based audit-trail signing | P0 | Migrate the sovereignty/Article-12 audit signatures to hash-based (SLH-DSA) signing — conservative, well-understood primitives. Aligns with the lean-Ethereum hash-based direction (leanVM) |
| 8-053 | HNDL re-encryption sweep | P1 | Re-encrypt long-lived sovereign data-at-rest under PQC/hybrid KEM. Prioritize records whose confidentiality must survive past 2032. Rotate keys held by a single custodian |
| 8-054 | Hardware KYA PQC enforcement | P1 | Extend BlueField-5 hardware KYA (Phase 3) so the agent identity spine and leash-snap chain use PQC signatures at the DPU level |
| 8-055 | Crypto-agility test harness | P1 | CI gate that swaps the active signature/KEM algorithm and proves the platform still verifies end-to-end. Algorithm-replaceability becomes a tested invariant, not a promise |
| 8-056 | Rightful Oy R-Sac² readiness mapping | P2 | Map the EU-origin post-quantum readiness instrument (Field Note #2) onto the CBOM. Customer-facing PQC posture report |

---

## Phase 4: DWS 8 GA (Q3-Q4 2029)

**Goal:** Full platform release on Feynman architecture.

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 8-019 | DWS 7 → DWS 8 migration tooling | P0 | Automated migration for existing customers |
| 8-020 | Feynman performance benchmarks (published) | P1 | Public benchmark report: DWS 8 vs competitors |
| 8-021 | ISO 27001 re-certification on Feynman | P0 | Security certification for new hardware platform |
| 8-022 | Customer pilot program (5 early adopters) | P0 | Controlled rollout before GA |
| 8-023 | DWS IQ 8.0 GA release | P0 | Full release with documentation, marketing, launch |

---

## Competitive Moat: DWS 8

### Hardware Moat

| Advantage | Description |
|-----------|-------------|
| **Hardware-native agent orchestration** | Only compliance platform running on purpose-built agentic CPU (Rosa) |
| **Silicon photonics on-premise** | Sovereign AI that is physically faster and cooler than any cloud-based competitor |
| **Hardware KYA** | Agent isolation enforced at silicon level — no software bypass possible |
| **12-month chip cadence advantage** | Feynman → next arch (2029) — DWS stays on NVIDIA's cutting edge via ISV partnership |

### Data Moat

| Advantage | Description |
|-----------|-------------|
| **Carbon balance sheet** | Double-entry carbon bookkeeping — debits and credits traced from agent through data source to regulation. No competitor has this |
| **18-source data mesh** | 13 open + 5 enterprise sources feeding one normalized ledger. ENTSO-E, EUTL, EFRAG XBRL, PRODCOM simultaneously across 20 industries |
| **Cross-vertical intelligence** | Steel CBAM correlates with construction CSRD from the same supply chain. Requires multi-industry presence — single-vertical tools can't replicate |
| **Network effect** | Customer A's verified emissions improve customer B's ledger accuracy. More industries on platform = better data for everyone |
| **Transaction-verified Scope 3** | EUTL installation records replace spend-based averages. ±3% accuracy vs ±40% for competitors |
| **Enterprise data sovereignty** | Bloomberg, Ecoinvent, Refinitiv as add-on connectors. Customer keeps their data contracts. DWS extends, doesn't replace |

### Series A Pitch

> When you tell a steel mill CFO that their CBAM exposure is correlated with a construction sector CSRD disclosure from the same supply chain, and you can show the full debit-credit trail from EUTL installation record through the ledger to the signed report — that's the Lifetime World Model doing something no single-vertical tool can do.

---

## Dependencies & Risks

### Hardware Risks

| Risk | Mitigation |
|------|-----------|
| Feynman delays beyond 2028 | DWS 7 on Blackwell/Groq 3 remains production-viable. DWS 8 is enhancement, not requirement |
| Rosa SDK immaturity | Phase 0 prototyping identifies issues early. Maintain software-only fallback path |
| Customer migration resistance | Offer DWS 7 LTS (long-term support) for customers not ready to upgrade hardware |
| Silicon photonics industrial readiness | Phase 2A includes thermal validation for factory environments |
| NVIDIA partnership continuity | ISV partnership + early adoption + co-marketing creates mutual dependency |

### Data Risks

| Risk | Mitigation |
|------|-----------|
| ENTSO-E API instability | Sandbag + static fallback cascade. 1-hour cache. Grid factors change slowly |
| CBAM machine-readable API delays | PRODCOM mapping engine (PR 8-047) bridges the gap. Manual quarterly review with staleness alerts |
| EMBER daily CSV not API-native | Sandbag secondary, ICE Endex/Refinitiv enterprise add-on for real-time |
| Enterprise connector maintenance burden | Customer brings own license. DWS maintains connector, not data contract. Add-on revenue covers maintenance |
| Network effect cold start | First 16 customers (DWS 7) seed the supply chain graph. Qantic partnership adds 50-100 BESS projects. Critical mass by Phase 2B |
| Data source staleness | Registry tracks `lastVerified` + `staleAfterDays`. CI/CD alerts on stale sources. `checkDataSourceHealth()` in monitoring |

---

## Relationship to DWS 7

DWS 8 does NOT invalidate DWS 7. The relationship:

```
DWS 6 (pilot)     → Proving the concept (2025-2026)
DWS 7 (production) → Proving the market (2026-2027)  — 16 customers, €72K MRR
DWS 8 (platform)   → Proving the moat (2028-2029)    — Carbon balance sheet infrastructure
```

DWS 7 customers get DWS 8 as an upgrade path. DWS 7 continues as "DWS 7 LTS" for customers on existing hardware.

### What DWS 7 Ships That DWS 8 Builds On

| DWS 7 Deliverable | DWS 8 Evolution |
|-------------------|-----------------|
| Persistent carbon balance sheet (Phase 2.6, PRs 093A–093H) | Cross-entity reconciliation, supply chain graph, network effect |
| 13 open data sources | 18+ sources with enterprise add-ons and network effect |
| Scoring engine (deterministic, per-company) | Cross-entity reconciliation, supply chain graph |
| BESS calculator (Qantic integration) | Portfolio-level carbon flow across asset classes |
| 20 industry verticals (emission factors + benchmarks) | Cross-vertical intelligence — one company's output is another's input |
| ESRS registry (82 disclosures, manual) | Auto-synced from EFRAG XBRL taxonomy |
| Compliance agent (single-entity) | Firehorse agents that reason across supply chains |

---

## PR Count Summary

| Phase | Hardware PRs | Data PRs | Security PRs | Total |
|-------|-------------|----------|--------------|-------|
| **0** | 6 | — | — | 6 |
| **1A** | 8 | — | — | 8 |
| **1B** | — | 9 | — | 9 |
| **2A** | 5 | — | — | 5 |
| **2B** | — | 8 | — | 8 |
| **3** | 5 | — | — | 5 |
| **3B** | — | — | 7 | 7 |
| **4** | 5 | — | — | 5 |
| **Total** | **29** | **17** | **7** | **53** |

---

*"This is NVIDIA's world. DWS doesn't rent compute — DWS builds the carbon balance sheet that makes the compute trustworthy."*

*"From 'How do we guess our footprint?' to 'How do we reconcile our carbon balance sheet?'"*

*Last updated: 2026-03-24*
