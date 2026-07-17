# EIC Accelerator — Work-Package Structure (LUT · KTH · Cubet)

> Step 2 (full-proposal) skeleton, prepared now to shape the Step 1 team/Excellence narrative. **€ figures indicative** — confirm against the Guide v6.0 lump-sum rules. EIC Accelerator is a **single-SME** grant (beneficiary: Lifetime Oy). The core innovation + IP stays with Lifetime's own EU team; universities and Cubet join via **subcontracting, co-supervised hires, and testbed access** — never as co-beneficiaries.

***

## VERSION AND AGENT HISTORY

| Field   | Value                                                        |
| ------- | ------------------------------------------------------------ |
| Version | 3.1 (LOCKED — Cubet €300K, core €1.15M, team composition)    |
| Date    | 2026-07-17                                                   |
| Owner   | risto-001                                                    |
| Status  | Locked — closes to €2.5M; core in-house, sovereignty honest  |
| Branch  | claude/dl-18-7-delivery-7m1hnj                               |

***

## The €2.5M grant — resource split by actor

| Line | € | % | Notes |
| --- | --- | --- | --- |
| **Lifetime EU core team** — KYA engine, attestation pipeline, ZK-proof design, incl. **2 grant-funded industrial doctoral candidates** (LUT/KTH co-supervised, **on Lifetime Oy payroll**) | **€1.15M** | 46% | The team-depth answer **and** the core R&D/IP — kept in the EU |
| **PM & coordination** (Risto — strategic: product vision, customers, fundraising, IP, advisory) | €200K | 8% | Risto out of day-to-day admin once pilots run |
| **Cubet — non-core delivery** (pilot-deployment ops, customer onboarding, integration testing) — **"EU-controlled delivery capacity"** per the ORK commitment. **No KYA-engine dev, no attestation build.** | €300K | 12% | ~47 person-months ≈ **~2 FTE** @ ~€290/person-day (Cubet's real €260–320 rate) |
| **LUT subcontract** — ZK / quantum-safe proof research (WP2, non-core input) | €180K | 7% | core-R&D subcontract |
| **KTH TECoSA subcontract** — safety-argumentation methodology + formal verification (WP3) | €200K | 8% | core-R&D subcontract |
| **KTH testbed** — access + independent validation (WP4) | €100K | 4% | service line |
| **Equipment** — NVIDIA DGX Spark units (testbed + customer sites, S2) | €200K | 8% | tangible; justifies budget |
| **Standardization + audit + pilot infra** — CEN-CENELEC, compliance testing | €170K | 7% | |
| **Total** | **€2.5M** | 100% | |

## Lifetime EU core team — the €1.15M (personnel, not day-rate)

Grant-funded **personnel** are budgeted as fully-loaded Finnish salary cost (gross + ~1.23× employer contributions + overhead), **not** a day-rate — that is subcontracting and stays capped at the €380K LUT/KTH research lines.

| Role | ~€ / 24 mo |
| --- | --- |
| **1 Senior Architect** — KYA engine + attestation design (the core IP) | €400K |
| **1 Senior/mid engineer** — core implementation | €280K |
| **2 industrial doctoral candidates** — LUT + KTH co-supervised, Lifetime payroll | €280K |
| Recruitment + tooling + contingency | €190K |
| **Total** | **€1.15M** |

## Defensibility check
- **Lifetime own effort** (core €1.15M + PM €200K) = **€1.35M ≈ 54% → clear majority.** The beneficiary does the core.
- **Core-R&D subcontract** (LUT €180K + KTH €200K) = **€380K ≈ 15%.** Specific research inputs only.
- **Cubet non-core** = **€300K ≈ 12%.** Delivery/ops, EU-controlled, not the innovation.
- **Total subcontracting** (LUT + KTH + testbed + Cubet) ≈ **31%** — comfortably accepted because the beneficiary clearly **leads the innovation** and the **core + IP + data stay in the EU**.

## Why this is honest (and passes review)
- **Sovereignty thesis intact:** the KYA engine, attestation, ZK design, and IP are built by Lifetime's EU team; Cubet does non-core delivery under EU controls (data stays EU/EEA — Cubet's own ORK commitment). No non-EU core.
- **Team depth:** 2 co-supervised industrial doctoral candidates on Lifetime's payroll answer the founder-led-risk / skills-gap criteria while deepening the LUT/KTH tie.
- **Credible €2.5M:** subcontracts + testbed + DGX equipment + hires make every euro defensible.
- **Rate reality:** Cubet's quoted **€260–320/person-day** (ORK correspondence) means €300K ≈ ~47 person-months ≈ **~2 FTE** — right-sized for non-core delivery, not the ~6 FTE a €1M line would have implied. Note: the €290/day figure is Cubet's **offshore** rate; Lifetime's own EU hires are budgeted as fully-loaded salary (personnel), not this day-rate.

## WP mapping (for Step 2 Part B)
- **WP1** Project management & coordination — Lifetime (Risto strategic).
- **WP2** Quantum-safe transaction primitives — Lifetime core + LUT-co-supervised PhD hire + **LUT subcontract €180K**.
- **WP3** Sovereignty Attestation & assurance — Lifetime core + KTH-co-supervised researcher hire + **KTH subcontract €200K**.
- **WP4** Pilot validation & testbed — **Cubet delivery** + **KTH testbed €100K** + independent audit.
- **WP5** Standardization & dissemination — spec authoring + **LUT/KTH co-authorship** + Cubet docs/tooling.

## Honesty guardrails (do not overstate)
- **Lifetime AB (SE):** **registered; bank account pending only an eIDAS login** (founder, 2026-07-17) → WP4 SE pilots realistic.
- **KTH = active dialogue (in-play), not signed.** LUT = Risto's confirmed doctoral home (Prof. Kari Smolander). Step 1: "advisors to be formalized"; **Step 2 requires LOIs** from both.
- Subcontract/lump-sum figures indicative — confirm eligibility before Step 2.

## Companions
- Letters: `correspondence/2026-07-17_TORNGREN_KTH_*`, `correspondence/2026-07-17_SMOLANDER_LUT_*`
- `docs/field-notes/2026-07-14-lut-smolander-phd-three-research-options.md`
- `docs/field-notes/2026-07-14-kth-broman-torngren-tecosa-trustworthy-systems.md`
