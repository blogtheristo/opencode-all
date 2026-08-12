# Tutkimussuunnitelma 3.51 / Research Plan 3.51

## AI-Native Compliance Infrastructure: Three Research Streams

**Tekijä / Author:** Lifetime Oy Research Division  
**Päivämäärä / Date:** 2026-04-28  
**Versio / Version:** 3.51  
**Kieli / Language:** Bilingual (English / Finnish)

---

---

# VERSION AND AGENT HISTORY

Version: 3.51

Sessions & Modifications:

- Version: 3.51 | Tool: Claude Code (Haiku 4.5) | Session: claude/sync-version-numbering-adEeB | Date: 28.04.2026 | Changes: Created new Tutkimussuunnitelma_3.51.md (Research Plan) — three research streams (KYA standardization, DWS 7 empirical testbed, dual-use industries), eight research questions, "Human in Command ja Human in Loop" governance framework, links to PhD sections 1.4–1.6; supports supervisor-guided refinement of research direction; unified version track with all 4 thesis files bumped to 3.51

---

---

## 1. Johdanto / Introduction

Tämä tutkimussuunnitelma kokoaa kolme toisiinsa liittyvää tutkimusaluetta, joita LUT-doktoraatissa kehitämme. Tavoitteena on selvittää, miten tekoälyagentit voidaan rakentaa siten, että ne tuottavat **oikeudetaan kestäviä compliance-tietoja** EU-säännellyissä teollisuusympäristöissä.

**This research plan consolidates three interrelated research streams we are developing in the LUT doctoral programme. The objective is to clarify how AI agents can be built to produce legally defensible compliance data in EU-regulated industrial settings.**

### Research Hypothesis

**"Carbon compliance is a ledger problem, not a reporting problem."**

Double-entry bookkeeping solved the financial accounting problem centuries ago. The same architecture can solve carbon compliance across CBAM, CSRD, ETS, and EU Taxonomy — provided the agents that feed the ledger are:

1. **Auditable** (KYA governance ensures inspection and control)
2. **Distributed** (Multi-agent orchestration across verticals)
3. **Sovereign** (EU data residency, edge computation)

---

## 2. Kolme Tutkimuksellista Virta / Three Research Streams

### 2.1 Stream 1: KYA Standardization

**Focus:** Know Your Agent (KYA) as an open-source governance framework for agentic AI.

**Connection to PhD:** Sections 1.5, 10.21 (KYA open-source path), 14.12 (Harness Engineering and Forensic Telemetry)

**Research Questions:**

| #          | Question                                                                                                                             | Discussion Area                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| **RQ 1.1** | What is the minimal viable governance model that allows auditors to inspect an AI agent's decision path without blocking deployment? | KYA Standard v1.4 – Article 12 logging              |
| **RQ 1.2** | Can KYA be generalized beyond Lifetime's internal use to serve as an open-source standard for the broader agentic AI community?      | Agentic AI Foundation / Linux Foundation submission |
| **RQ 1.3** | How does hardware attestation (trusted execution environments) improve the court-defensibility of AI agent decisions?                | KYA Standard + Firehorse Report Engine              |

**Research Maturity:** Draft → Scoped (Q3 2026) → Article 1 (Q1 2027)

---

### 2.2 Stream 2: DWS 7 as Empirical Testbed

**Focus:** Validation of carbon-ledger infrastructure, multi-agent orchestration, and sovereignty segmentation.

**Connection to PhD:** Sections 1.4 (Carbon Balance Sheet thesis), 10.18 (LWM Sequencing Strategy), 14.14–14.20 (Evolution sections)

**Research Questions:**

| #          | Question                                                                                                                                 | Discussion Area                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **RQ 2.1** | Is the analogy between financial double-entry bookkeeping and carbon compliance formally sound, or merely metaphorical?                  | Structural isomorphism analysis                |
| **RQ 2.2** | Does cross-vertical intelligence (multi-industry carbon ledger) produce accuracy improvements that single-vertical tools cannot achieve? | Case study: steel mill ETS → construction CBAM |
| **RQ 2.3** | At what scale (number of industries, entities) does the ledger become self-reinforcing?                                                  | Network effects in compliance data             |
| **RQ 2.4** | How do Aegis (security), Sovereign Infra (EU), and Connect (global) product tiers operationalize the research findings?                  | Product-tier implementation                    |

**Research Maturity:** Prototype (DWS 6) → Validated (DWS 7 Phase 2.6) → Article 2 (Q2 2027) + Article 3 (Q2 2028)

---

### 2.3 Stream 3: Dual-Use Industries & Defence

**Focus:** Compliance automation in industrial + defence sectors; hydrogen economy as longitudinal thread.

**Connection to PhD:** Section 1.5 (Dual-use research stream), 10.21 (Nokia Defence discussions)

**Research Questions:**

| #          | Question                                                                                                                                       | Discussion Area                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **RQ 3.1** | What are the unique compliance and governance requirements for dual-use industries (industrial + defence)?                                     | Nokia Defence partnership, Aegis product |
| **RQ 3.2** | Can hydrogen economy compliance (RFNBO additionality, EU Delegated Regulation 2023/1184) demonstrate cross-regulatory reconciliation at scale? | DWS 7 Agent 22: Datacentre Compliance    |
| **RQ 3.3** | How does sovereignty segmentation (EU-only vs. global) affect agent architecture and data flows?                                               | Sovereign Infra tier design              |

**Research Maturity:** Preliminary (Q2 2026) → Validation phase (Q3–Q4 2026) → Article 4 (Q4 2028)

---

## 3. "Human in Command" & "Human in Loop": Governance Model

### The Central Governance Tension

AI agents can produce compliance data faster than humans can review it. This creates a dilemma:

- **Human in Command:** Humans make all compliance decisions; agents only suggest. **Problem:** Slows decision-making, defeats automation value.
- **Human in Loop:** Humans review agent outputs before commitment. **Problem:** May miss errors if review is cursory; fails under high-volume scenarios (1000 SKUs, 20 industry verticals, daily regulatory changes).
- **Human in Observe:** Agents make decisions; humans audit retroactively. **Problem:** Compliance breach may already be committed.

**Research Question RQ 1.1 directly addresses this:** KYA provides the inspection infrastructure so that humans can remain genuinely **in command** (they retain veto power over any decision, even retroactively) while allowing agents to run at operational speed.

### Implementation in Firehorse Operations

Three product tiers implement different governance models:

| Tier                | Model                                         | Compliance Scope                       | Governance                           |
| ------------------- | --------------------------------------------- | -------------------------------------- | ------------------------------------ |
| **Aegis**           | Human in Command + Cryptographic Verification | High-risk (defence, critical infra)    | Full KYA audit trail, signed reports |
| **Sovereign Infra** | Human in Loop (daily review)                  | Medium-risk (industrial, supply chain) | KYA logging + periodic audit         |
| **Connect**         | Human in Observe (monthly audit)              | Low-risk (informational reporting)     | KYA logging only                     |

---

## 4. Research Methods

### 4.1 Design Science Research (DSR)

Artifact construction and validation in real-world environments:

- **Artifacts:** DWS IQ 6 (current), DWS 7 (2026–2027), KYA Standard (open-source)
- **Validation:** Customer deployments, regulatory audits, peer review

### 4.2 Empirical Case Studies

Industry-specific validation:

- **Steel/Construction:** CBAM embedded emissions accuracy (target ±3% vs. industry ±40%)
- **Hydrogen:** RFNBO additionality verification (first EU-scale test)
- **Defence:** Sovereignty and audit requirements (Nokia partnership)

### 4.3 Peer-Reviewed Publication Track

| Article   | Topic                                         | Target Venue                                       | Timeline |
| --------- | --------------------------------------------- | -------------------------------------------------- | -------- |
| Article 1 | KYA Standard (open-source framework)          | Agentic AI Foundation + IEEE/ACM AI Ethics         | Q1 2027  |
| Article 2 | MCP Architecture for Multi-Agent Compliance   | International Conference on Data-Intensive Systems | Q2 2027  |
| Article 3 | Empirical Validation: Cross-Vertical Accuracy | Journal of Cleaner Production (CSRD focus)         | Q2 2028  |
| Article 4 | Dual-Use Governance Model                     | Journal of Cybersecurity Policy (defence focus)    | Q4 2028  |

---

## 5. Discussion Topics for Supervisor Feedback

**For Prof. Kari Smolander:**

1. **Scope Feasibility:** Are four publication streams realistic within 2-3 years, or should we consolidate to two primary articles?
2. **Empirical Validation:** Which research stream would benefit most from an external partner (e.g., Nokia Defence, Qantic Energy, construction sector)?
3. **Methodological Fit:** Does Design Science Research (DSR) remain the right methodological fit, or should we add experimental design for cross-vertical accuracy claims?
4. **Open-Source Path:** Should KYA standardization (Article 1) prioritize Agentic AI Foundation (academic credibility) or Linux Foundation (industrial adoption)?
5. **Publication Language:** Should the KYA standard proposal be bilingual (EN + FI) to strengthen Nordic visibility, or English-only for international reach?

---

## 6. Next Steps (Q2 2026)

| Deadline   | Milestone                                                    | Owner                    |
| ---------- | ------------------------------------------------------------ | ------------------------ |
| 2026-05-15 | Supervisor feedback on research streams (this plan)          | Prof. Smolander          |
| 2026-05-31 | KYA Standard v1.5 finalized + regulatory mapping             | Lifetime R&D             |
| 2026-06-15 | DWS 7 Phase 2.1 design review (empirical testbed setup)      | Lifetime R&D             |
| 2026-07-15 | Draft Article 1 (KYA standard) ready for peer review         | Lifetime + Collaborators |
| 2026-09-30 | First steel/hydrogen case study validation (RQ 2.2 evidence) | Qantic + Partners        |

---

## 7. References to Full Thesis Documents

- **PhD_FIREHORSE_EN.md** — Sections 1.4 (Carbon Balance Sheet thesis), 1.5 (Research focus refinement)
- **V3Thesis_EN.md** — Sections 10.13–10.21 (Skills, Strategic Partnerships, DWS Evolution)
- **DWS_ARTICLE_12_LOGGING_STANDARD.md** — KYA logging protocol, audit trail requirements
- **DWS_DATA_STANDARD.md** — Carbon ledger data architecture (Section 3)

---

## Appendix A: Research Question Matrix

```
Stream 1: KYA Standardization
├── RQ 1.1: Minimal viable governance model (Article 12 audit trail)
├── RQ 1.2: Open-source generalization (Agentic AI Foundation)
└── RQ 1.3: Hardware attestation + court-defensibility (TEE integration)

Stream 2: DWS 7 Empirical Testbed
├── RQ 2.1: Financial double-entry analogy validity
├── RQ 2.2: Cross-vertical intelligence gains (accuracy)
├── RQ 2.3: Network effects in compliance data
└── RQ 2.4: Product-tier operationalization (Aegis/Sovereign/Connect)

Stream 3: Dual-Use & Hydrogen Economy
├── RQ 3.1: Defence + industrial unique requirements
├── RQ 3.2: RFNBO additionality at scale
└── RQ 3.3: Sovereignty segmentation effects on architecture
```

---

**Document Status:**

- Created: 28.04.2026
- Language: English & Finnish (Bilingual)
- Version: 3.51 (unified thesis track)
- Status: ACTIVE — Ready for supervisor discussion

**Next Review:** After supervisor feedback (Prof. Kari Smolander), refine scopes and publication targets.
