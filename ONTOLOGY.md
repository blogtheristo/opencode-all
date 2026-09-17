# DWS Ontology & Lifetime World Model (LWM)

---

# VERSION AND AGENT HISTORY

Version: 1.6

Sessions & Modifications:

- Version: 1.6 | Tool: Claude Code (Opus 5) | Session: claude/kya-s1-blog-post-1-swb4k4 | Date: 09.08.2026 | Changes: Added §16 **KYA Ontology — Agent Governance Vocabulary**: the canonical vocabulary for the mandate layer the spatial/temporal/causal/entity ontologies do not cover — UNDER WHAT MANDATE an autonomous agent acted. Core concepts, the seven KYA-S1 control domains, the KYA-AL1/AL2/AL3 assurance levels (renamed from Bronze/Silver/Gold in KYA-S1 v1.4), runtime mechanisms (Lease Token, fail-closed, leash snap, capture-precedes-release, bounded attribution clock, TRS/TRS_req), process concepts (HIC, Single Pane of Glass, PRV-4, BPMN 2.0 engine, EUDI Wallet), and a five-language term table with Finnish as Ground Truth. Normative source is `Legal/KYA_S1.md` v1.5; §16 is descriptive and yields to it. Three translation errors in the supplied table were corrected and recorded in §16.7 rather than applied silently.
- Version: 1.5 | Tool: Claude Code | Session: claude/lifetime-handbook-web-updates-lmyi2g | Date: 01.07.2026 | Changes: Added "Data Lifecycle & Retention Ontology (HOW LONG)" subsection in §6 — every ontology node ingesting live data now carries an explicit per-node retention schema (node_owner, raw/summary/audit/rollup tiers, quarterly aggregation_review), closing the gap named by the Valtiovarainministeriö security-oriented information management guide (VM 2026:27 §4.4.2, aggregation effect / kasautumisvaikutus). Reference implementation: Control Room / Situation Room four-tier model (`docs/field-notes/2026-07-01-tiedon-vanheneminen-sensoridata-retention-control-room.md`, `Admin/ADMIN_MANUAL.md`). Retention is a property of the node, not a platform-wide default.
- Version: 1.4 | Tool: Claude Code (claude-sonnet-4-6) | Session: claude/knowledge-catalog-research-J207A | Date: 04.05.2026 | Changes: Added §15 "GC-KC Reference Architecture — What Industrial Ontology Runtime Looks Like". Maps Google Cloud Knowledge Catalog three pillars (Aggregation, Enrichment, Search) to DWS ontology tiers. Adds DWSDataProduct as a named concept. Connector decision documented (export adapter only). Updates §14 lags table: Knowledge Catalog Runtime gap now tracked.
- Version: 1.3 | Tool: Claude Code (claude-sonnet-4-6) | Session: claude/add-ontology-background-s0H0S | Date: 29.04.2026 | Changes: Added §1.3 "Sanan ontologia tausta / Etymology and Philosophical Background" — kreikkalainen etymologia (ón + lógos), Aristoteles, skolastiikka 1600–1700-luvuilla, merkityksen laajeneminen filosofiasta tietojenkäsittelytieteeseen ja tekoälyyn
- Version: 1.2 | Tool: Claude Code (Claude Opus 4.7) | Session: claude/compare-ontologies-NtJWP | Date: 29.04.2026 | Changes: Decision-centric roadmap — added §13 (Actions, Scenarios/Global Branching, per-Decision Lineage, Purpose-based + Marking-based Policies, Logic Binding, Multi-tier Agent Memory, Embedded Edge Ontology) and §14 Where DWS Leads, Where DWS Lags. Removed third-party vendor naming; positioned as European Ontology Standard.
- Version: 1.1 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/add-eu-info-note-8XYey | Date: 11.02.2026 | Changes: Added DWS6 Enterprise Ontology — EU institutions (Commission, Council, Parliament, EIB), EU Single Market (450M consumers), EU regulatory framework (Fit for 55, ETS, CBAM, CSRD, AI Act, GDPR, NIS2), DWS IQ 6 platform entities, 21-moat fortress taxonomy, 25+ EU industries, key geographic entities, Alden Biesen retreat context
- Version: 1.0 | Tool: Claude Code | Session: claude/show-dws-version-LLEHz | Date: 21.01.2026 | Changes: Initial creation - Enterprise ontology framework with LWM integration

Session Links & References:

- Claude Code (claude/show-dws-version-LLEHz): https://github.com/blogtheristo/dws6
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/ONTOLOGY.md

Document Status:

- Created: 21.01.2026
- Last Modified: 09.08.2026
- Language: English
- Languages Available: English
- Publication Status: ✅ ACTIVE

---

**Version:** 1.0
**Effective Date:** 2026-01-21
**Last Updated:** 2026-01-21
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Core Philosophy](#2-core-philosophy)
3. [Knowledge Storage Strategy](#3-knowledge-storage-strategy)
4. [Lifetime World Model (LWM)](#4-lifetime-world-model-lwm)
5. [Artifact Framework](#5-artifact-framework)
6. [Ontology Structure](#6-ontology-structure)
7. [Live Pipeline](#7-live-pipeline)
8. [Safety & Orchestration](#8-safety--orchestration)
9. [Implementation Guide](#9-implementation-guide)
10. [Field Note Templates](#10-field-note-templates)

---

## 1. Overview

### Purpose / Tarkoitus

This document establishes the ontological framework for DWS7 and beyond, defining how knowledge transitions from raw field notes to a living, breathing enterprise intelligence system. It is grounded in a now well-established industry insight:

> **"If you just buy LLMs off the shelf and try to do any of this, it won't work. Once you build a software layer to orchestrate and manage the LLMs in a language your enterprise understands, you actually can create value."**

**Finnish / Suomi:**
Tämä dokumentti luo ontologisen kehyksen DWS7:lle ja sen jälkeisille versioille, määrittäen miten tieto siirtyy raakoista kenttämuistiinpanoista eläväksi, hengittäväksi yritystiedustelujärjestelmäksi.

### Scope / Soveltamisala

Applies to:

- Field notes and customer interactions
- Enterprise knowledge capture
- AI/LLM orchestration layers
- Core business artifacts
- Regulatory compliance documentation
- Training data for enterprise AI models

### Sanan ontologia tausta / Etymology and Philosophical Background

Sanan ontologia tausta liittyy filosofiaan ja erityisesti olemassaolon peruskysymyksiin.

**Etymologia**

Sana _ontologia_ tulee kreikan kielen sanoista:

- **ὄν (on)** – oleva, se mikä on
- **λόγος (logos)** – oppi, puhe, järjellinen selitys

Kirjaimellisesti ontologia tarkoittaa siis _oppia olevasta_ — eli oppia siitä, mitä on olemassa ja millä tavoin.

**Filosofinen tausta**

Ontologia on yksi metafysiikan keskeisistä osa-alueista. Jo antiikin Kreikassa filosofit kuten Aristoteles pohtivat olemisen luonnetta:

- mitä tarkoittaa, että jokin _on_
- millaisia olevia on olemassa (esineet, ominaisuudet, suhteet, tapahtumat)
- mikä on olemisen perusrakenne

Varsinainen termi _ontologia_ vakiintui vasta 1600–1700-luvuilla, erityisesti skolastiikan ja varhaisen modernin filosofian piirissä, kun metafysiikkaa alettiin systematisoida omiksi osa-alueikseen.

**Merkityksen laajeneminen nykyaikana**

Nykyään ontologiaa käytetään useissa eri yhteyksissä:

- **Filosofiassa:** tutkimus olemassaolon perusluonteesta
- **Tietojenkäsittelytieteessä ja tekoälyssä:** muodollinen malli käsitteistä ja niiden välisistä suhteista (esim. luokat, ominaisuudet, relaatiot)
- **Tieteenfilosofiassa:** kysymys siitä, millaisiin entiteetteihin jokin teoria sitoutuu

Näin sanan alkuperäinen merkitys — _olevan jäsentäminen_ — säilyy, mutta sovelluskohde muuttuu. DWS Ontology Standard rakentuu juuri tälle perustalle: EU-säännökset ja teollisuuden käsitteet jäsennetään koneluettavaan muotoon, jota sekä ihmiset että agentit voivat kyselyillä tutkia.

---

### The "Bubble" vs. "Lag" Problem

**The Problem:**

- Companies buy LLMs off-the-shelf
- Expect them to work for regulated, precise tasks (underwriting, compliance)
- Face failure due to lack of enterprise-specific context

**The Solution:**

- **Orchestration Layer:** Software to manage and route LLM outputs
- **Ontology:** Enterprise-specific language and logic framework
- **World Model:** Continuous spatial and temporal mapping of business reality

---

## 2. Core Philosophy

### From Static Notes to Neural Inputs

**Traditional Approach (Broken):**

```
Field Note → Document File → Archive → Forgotten
```

**LWM Approach (Living):**

```
Field Note → Ontology Mapping → Orchestration Rule → World Model Update → Active Intelligence
```

### Key Principles

1. **Notes are Frames, Not Files**
   - Each field note is a "frame" in the video of your enterprise reality
   - The LWM reconstructs the full motion picture from these frames

2. **Spatial and Temporal Mapping**
   - WHERE: Geographic, organizational, regulatory location
   - WHEN: Timeline of cause and effect
   - WHY: Business logic and decision rationale

3. **Active Pruning**
   - Old, contradictory, or invalidated knowledge must be actively removed
   - The system forces reconciliation between old facts and new stories

4. **Separation of Logic and Data**
   - The model learns patterns, not private data
   - Encrypted orchestration keeps PII separate from business rules

---

## 3. Knowledge Storage Strategy

### Database vs. Docs Files: Decision Matrix

| Use Case                    | Storage Location              | Reasoning                                                |
| --------------------------- | ----------------------------- | -------------------------------------------------------- |
| **Structured Intelligence** | Database (Supabase)           | Queryable, linkable to objects, searchable in dashboards |
| **Narrative Context**       | Docs Files (.md)              | Flow of argument, white papers, briefings                |
| **Core Artifacts**          | Database with Docs Reference  | Metadata in DB, full content in versioned .md            |
| **Regulatory Documents**    | Docs Files with DB Index      | Audit trail, version control, PDF generation             |
| **Training Data**           | Database (Vector Store)       | Embedding-ready, RAG-optimized                           |
| **Field Notes**             | Hybrid (DB → Docs → Artifact) | Captured in DB, processed to .md, refined to artifact    |

### Recommended Hybrid Approach

**For DWS7 User Notes:**

1. **Initial Capture:** Database (Supabase)
   - Quick entry via mobile/web interface
   - Timestamped, geo-tagged
   - Linked to customer/project objects

2. **Processing:** Docs Files (Markdown)
   - Daily/weekly export to `/docs/field-notes/YYYY-MM-DD-[topic].md`
   - Apply ontology tags
   - Add context and analysis

3. **Refinement:** Core Artifacts
   - Elevated to `/artifacts/[CATEGORY]/ART-YYYY-NNN.md`
   - Becomes part of enterprise knowledge base
   - Fed into LWM training pipeline

---

## 4. Lifetime World Model (LWM)

### Definition

A **Lifetime World Model** is not just a database—it is a continuously evolving spatial and temporal map of your business reality.

**Components:**

```
LWM = (Spatial Map + Temporal Timeline + Causal Logic + Safety Constraints)
```

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  LIFETIME WORLD MODEL                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Spatial    │  │   Temporal   │  │    Causal    │  │
│  │   Ontology   │  │   Timeline   │  │    Logic     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │         │
│         └──────────────────┴──────────────────┘         │
│                          │                              │
│                  ┌───────▼────────┐                     │
│                  │  Orchestration │                     │
│                  │     Layer      │                     │
│                  └───────┬────────┘                     │
│                          │                              │
│         ┌────────────────┬────────────────┐            │
│         │                │                │            │
│    ┌────▼────┐    ┌─────▼─────┐    ┌────▼────┐       │
│    │ LLM API │    │ Rule Base │    │ Memory  │       │
│    │  Layer  │    │  Engine   │    │  Store  │       │
│    └─────────┘    └───────────┘    └─────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### How LWM Differs from Traditional RAG

| Feature       | Traditional RAG   | LWM                                      |
| ------------- | ----------------- | ---------------------------------------- |
| **Storage**   | Static embeddings | Dynamic world state                      |
| **Context**   | Document chunks   | Spatial-temporal coordinates             |
| **Updates**   | Batch re-indexing | Continuous world model updates           |
| **Conflicts** | Ignored           | Actively resolved                        |
| **Safety**    | Query filtering   | Orchestration rules + safety constraints |

---

## 5. Artifact Framework

### Core Artifact Template

Every significant piece of enterprise knowledge should be captured as a **Core Artifact**.

**Location:** `/artifacts/[CATEGORY]/ART-[YYYY]-[NNN].md`

**Template:**

````markdown
# Artifact: [Descriptive Title]

---

## METADATA (The "Coordinates")

- **Artifact ID:** ART-2026-001
- **Temporal Stamp:** 2026-01-21T14:30:00Z
- **Ontology Anchors:**
  - Object: [e.g., Financial_Services]
  - Sector: [e.g., Underwriting]
  - Geography: [e.g., UK, London]
  - Regulatory Context: [e.g., FCA 2025 Cross-Border Rules]
- **Safety Status:** ✅ Verified | 🧪 Experimental | ⚠️ Deprecated
- **Confidence Score:** 0.95 (1.0 = absolute certainty)
- **Source:** Field Note FN-2026-017, Customer Interview

---

## NARRATIVE (The "Divine Story")

### The Observation

> **Field Note Insight:** "Customer X in London says the LLM failed because it didn't account for the 2025 regulatory shift in cross-border data transfer."

### Why It Failed

The off-the-shelf LLM was trained on pre-2025 regulatory data and lacked:

1. Specific knowledge of UK FCA cross-border data rules
2. Context about Customer X's multi-jurisdiction operations
3. The temporal understanding that regulations changed mid-process

### The Ground Truth

**Reality that contradicts generic AI:**

- UK customers with EU data must apply Rule-Set-B (post-2025)
- This is NOT in the base LLM training data
- This MUST be in our enterprise ontology

---

## LOGIC (The "Orchestration Rule")

### Proposed Rule

```python
IF:
  - Country = "UK"
  - Transaction_Type = "Cross-Border"
  - Data_Includes = "EU_Citizens"
  - Date >= "2025-01-01"
THEN:
  - Apply Rule-Set-B
  - Require additional_compliance_check = True
  - Flag for_human_review = True
```
````

### LWM Update Instruction

```yaml
world_model_update:
  spatial:
    - location: UK.London
    - regulatory_zone: post_brexit_2025
  temporal:
    - effective_date: 2025-01-01
    - supersedes: Rule-Set-A
  causal:
    - if_violated: "Transaction fails compliance"
    - learning_weight: HIGH
```

---

## VALIDATION & FEEDBACK

### Usage History

| Date       | User          | Action                | Result   | Feedback                     |
| ---------- | ------------- | --------------------- | -------- | ---------------------------- |
| 2026-01-21 | user@dws.com  | Applied to Case #1234 | ✅ Valid | Prevented compliance failure |
| 2026-01-25 | user2@dws.com | Applied to Case #1240 | ✅ Valid | Confirmed accuracy           |

### World Model Weight

- **Initial Weight:** 0.75
- **Current Weight:** 0.95 (increased due to validation)
- **Usage Count:** 12
- **Success Rate:** 100%

---

## RELATED ARTIFACTS

- **Supersedes:** ART-2024-089 (Pre-2025 UK Rules)
- **Related:** ART-2026-003 (EU GDPR Updates)
- **References:** REG-UK-FCA-2025-CROSS-BORDER.pdf

---

## VERSION HISTORY

- **v1.0** (2026-01-21): Initial creation from field note FN-2026-017
- **v1.1** (2026-01-25): Updated confidence score after validation

````

---

## 6. Ontology Structure

### Spatial Ontology (WHERE)

```yaml
geography:
  - continent: [Europe, North_America, Asia, ...]
  - country: [UK, US, Finland, ...]
  - region: [London, California, Helsinki, ...]
  - regulatory_zone: [EU, UK_Post_Brexit, US_Federal, ...]

organization:
  - business_unit: [Sales, Engineering, Compliance, ...]
  - department: [...]
  - team: [...]

industry:
  - sector: [Financial_Services, Manufacturing, Healthcare, ...]
  - vertical: [Insurance, Banking, MedTech, ...]
  - use_case: [Underwriting, Claims, Diagnostics, ...]
````

### Temporal Ontology (WHEN)

```yaml
timeline:
  - event_date: ISO8601 timestamp
  - effective_date: When rule/artifact becomes active
  - expiry_date: When it becomes deprecated
  - sequence_order: Position in causal chain

regulatory_periods:
  - pre_2025: Old rules
  - post_2025: New UK FCA cross-border rules
  - fiscal_year: FY2026
```

### Data Lifecycle & Retention Ontology (HOW LONG)

Every ontology node that ingests live operational data (sensor telemetry, agent
observations, customer system feeds) carries an explicit retention tier —
never an unbounded "keep forever" default. This closes the gap the
Valtiovarainministeriö security-oriented information management guide (VM
2026:27, §4.4.2) names as the aggregation effect (kasautumisvaikutus): risk
rarely comes from a single data point, but from unmanaged accumulation across
time, geography, or theme.

```yaml
retention:
  - node_owner: Single named owner per ontology node (never shared)
  - raw_tier: Unprocessed source signal — shortest retention, most restricted access
  - summary_tier: Ontologised/structured event derived from raw_tier — no raw signal retained
  - audit_tier: Immutable compliance log (EU AI Act Article 12) — longest retention, SIEM-exportable
  - rollup_tier: Cross-node aggregate for orchestration layers — never raw, never individualised
  - aggregation_review: Quarterly check for whether accumulated data at this node now reveals
    dependencies, vulnerabilities, or patterns no single entry would expose
```

**Reference implementation:** Control Room / Situation Room apply this exact
four-tier model (raw 72h / summary 13mo / audit 7yr / rollup 24mo rolling) —
see `docs/field-notes/2026-07-01-tiedon-vanheneminen-sensoridata-retention-control-room.md`
and `Admin/ADMIN_MANUAL.md` ("Customer Sensor Data Retention"). Any new
ontology node that ingests live data must declare its own retention tiers
before go-live; there is no organisation-wide default duration because
retention need is a property of the node, not the platform.

### Causal Ontology (WHY)

```yaml
business_logic:
  - if_condition: [...]
  - then_action: [...]
  - else_fallback: [...]

risk_factors:
  - compliance_risk: [HIGH, MEDIUM, LOW]
  - financial_risk: [...]
  - reputational_risk: [...]

success_patterns:
  - validated_approach: [...]
  - failed_approach: [...]
  - edge_cases: [...]
```

### Entity Ontology (WHO/WHAT)

```yaml
entities:
  - person: [Customer, Employee, Regulator, ...]
  - organization: [Client, Partner, Competitor, ...]
  - product: [DWS-IQ6, Firehorse, ...]
  - regulation: [GDPR, FCA_Rules, ...]
  - technology: [LLM, RAG, Vector_DB, ...]
```

### DWS6 Enterprise Ontology

#### EU Institutions

```yaml
eu_institutions:
  european_commission:
    role: Executive branch of the EU
    relevance: Proposes legislation (Fit for 55, AI Act), enforces compliance
    key_bodies:
      - DG CNECT (Digital policy)
      - DG CLIMA (Climate action)
      - DG GROW (Internal market, industry)
      - DG ENER (Energy)

  european_council:
    role: Defines EU political direction and priorities
    relevance: Alden Biesen Informal Retreat (Feb 2026) — competitiveness, autonomy, prosperity
    key_events:
      - Alden Biesen Retreat 2026-02-12: Single Market as "Europe's superpower" (450M consumers)
      - Franco-German Digital Sovereignty Summit (Nov 2025)

  european_parliament:
    role: Co-legislator with Council
    relevance: Adopted EU AI Act, Fit for 55 package

  council_of_the_eu:
    role: Represents member state governments
    relevance: Negotiates and adopts EU legislation

  european_investment_bank:
    role: EU financing institution
    relevance: EIB SESI funding (€880k-1.52M pipeline), InvestEU Portal (INPO-20254383)
```

#### EU Single Market

```yaml
eu_single_market:
  consumers: 450_million
  member_states: 27
  description: "Europe's true superpower — world's largest harmonized regulatory market"
  strategic_value:
    - One compliance investment serves all 27 member states
    - Harmonized regulation = "Brussels Effect" (global standard-setting)
    - EU-compliant companies get privileged market access
    - Non-compliant competitors excluded by design
  dws6_leverage:
    - 25+ EU industries served across Single Market
    - Compliance = access key (not cost center)
    - Regulatory-first DNA as competitive advantage
```

#### EU Regulatory Framework (DWS6 Compliance Stack)

```yaml
eu_regulations:
  fit_for_55:
    type: Climate legislation package
    scope: EU-wide emissions reduction 55% by 2030
    dws6_relevance: Core compliance automation target across 25+ industries
    status: Active — implementation ongoing

  eu_ets:
    full_name: EU Emissions Trading System
    type: Carbon pricing mechanism
    scope: Industrial emissions across Single Market
    dws6_relevance: Automated ETS reporting and compliance for industrial clients

  cbam:
    full_name: Carbon Border Adjustment Mechanism
    type: Border carbon tariff
    scope: Imports into EU (cement, steel, aluminium, fertilizers, electricity, hydrogen)
    dws6_relevance: CBAM compliance automation for importers
    effective: Transitional phase active, full enforcement 2026

  csrd:
    full_name: Corporate Sustainability Reporting Directive
    type: Sustainability reporting mandate
    scope: ~50,000 EU companies
    dws6_relevance: Automated CSRD report generation via Firehorse Report suite

  eu_ai_act:
    type: AI regulation
    scope: All AI systems operating in EU Single Market
    enforcement: August 2, 2026
    dws6_relevance:
      - Article 12 automatic logging (built-in)
      - Reasoning lineage documentation (LWM architecture)
      - High-risk AI system compliance for 25+ industries
    status: Pre-enforcement — DWS IQ 6 designed for compliance

  gdpr:
    full_name: General Data Protection Regulation
    type: Data protection law
    scope: All EU data subjects
    dws6_relevance: Data residency (Finland/Germany), no CLOUD Act exposure

  nis2:
    full_name: Network and Information Security Directive 2
    type: Cybersecurity directive
    scope: Essential and important entities across EU
    dws6_relevance: NIS2 Article 21 compliance built during development (114 requirements)
```

#### DWS IQ 6 Platform

```yaml
dws_iq6:
  architecture: Brain-Memory-Body-Hands
  components:
    brain: DWS IQ 6 Platform (Multi-agent AI Orchestration)
    memory: Lifetime World Model (Climate LLM + EU Regulations)
    body: Firehorse Suite (Reports, Automation, Content DMS, Omnichannel)
    hands: Lifetime Fleet (IoT/Robots for physical execution)

  products:
    - DWS IQ 6: Industrial climate intelligence platform
    - Firehorse Report: Analytics and CSRD reporting
    - Firehorse Automation: Python automation scripts
    - Firehorse ContentMS: Content management
    - Firehorse Omnichannel: Multi-channel outreach

  16_eu_industries:
    - Construction
    - Manufacturing
    - Energy
    - Logistics & Transport
    - Healthcare
    - Industrial Automation
    - Real Estate
    - Waste Management
    - Water & Wastewater
    - Agriculture
    - Mining & Minerals
    - Chemicals
    - Food & Beverage
    - Textiles
    - Pulp & Paper
    - Steel & Metals

  20_moat_fortress:
    # NOTE (2026-08-22, truth-standard reconciliation): rows 2 and 3 below describe
    # *aspirational validation paths*, not landed references. Per DWS_TRUTH_STANDARD.md
    # row 33 / docs/TRACTION_CANONICAL.md: Kela is a Traficom-defined dispatch operator of
    # the licensed transport operation — never a customer or endorser of any software
    # product; NCC is a prospect, not a reference. Do not cite either as validation in
    # public copy generated from this ontology.
    tier_1_impossible:
      - "1. EU/Nordic Operations + Single Market Access (450M consumers)"
      - "2. Government Validation (Kela) — ASPIRATIONAL; Kela is a dispatch operator, not a validator/customer"
      - "3. NCC Reference — ASPIRATIONAL; NCC is a prospect, not a reference"
      - "4. InvestEU Portal Acknowledgment + EU Competitiveness Alignment"
      - "5. Tech Stack Partnerships (NVIDIA, Google, AWS, Groq)"
    tier_2_very_hard:
      - "6. NIS2 Article 21 Expertise"
      - "7. Edge Computing Deployed (NVIDIA Jetson)"
      - "8. CIDM Patent"
      - "9. Multi-Tenant Architecture"
      - "10. B2B2G Model"
    tier_3_moderate:
      - "11. Nordic Languages"
      - "12. Construction Domain Expertise"
      - "13. Dual Product Strategy (DWS + Firehorse)"
      - "14. Offline Capability"
      - "15. Regulatory-First DNA"
    tier_4_operational:
      - "16. €3.50/month Infrastructure"
      - "17. Sub-100ms Latency"
      - "18. Data Benchmarking (network effects)"
      - "19. €135k Non-Dilutive Credits"
      - "20. Working-Class Positioning"
    total_barrier: "€3.05M-8.35M + 24-36 months"

  technology_stack:
    frontend: [React 19, Vite 7, TypeScript 5.9, TailwindCSS 4]
    backend: [Express 4.19, Node-cron, JWT, Helmet]
    ai_llm: [Claude (Anthropic), Google Gemini, Groq API, LlamaStack, MCP]
    database: [Supabase (PostgreSQL), pgvector]
    infrastructure: [Google Cloud Run, Cloudflare Workers, NVIDIA Jetson Orin Nano]
    orchestration: [Temporal.io, MCP Hub]

  data_sovereignty:
    data_residency: [Finland, Germany]
    cloud_provider: Supabase (EU-hosted)
    gaia_x_alignment: Level 3 (sovereign tier) — in progress
    cloud_act_exposure: None (EU-native infrastructure)
```

#### Key Geographic Entities

```yaml
geography_dws6:
  headquarters:
    country: Finland
    entity: Lifetime Oy
    advantages:
      - "Finland implements EU directives 6-12 months faster than most member states"
      - "AAA credit rating"
      - "NATO member (2023)"
      - "Most rigorous GDPR enforcement in EU"

  target_markets:
    primary: [Finland, Sweden, Norway]
    secondary: [Denmark, Germany, Netherlands, Belgium]
    tam: "€24.5B (Nordic) → €177B+ (EU cloud market)"

  eu_political_events:
    - event: Alden Biesen Informal Retreat
      date: 2026-02-12
      location: Belgium
      significance: "EU leaders frame Single Market (450M consumers) as Europe's superpower"
      impact_on_dws6: "Validates fortress moat strategy — compliance = market access"
    - event: Franco-German Digital Sovereignty Summit
      date: 2025-11
      significance: "Established 2026 digital sovereignty action agenda"
    - event: EU AI Act Full Enforcement
      date: 2026-08-02
      significance: "High-risk AI systems must comply — DWS IQ 6 designed for this"
```

---

## 7. Live Pipeline

### From Story to World Model

```
┌─────────────┐
│   CAPTURE   │  Field note / Customer interaction
└─────┬──────┘
       │
       ▼
┌─────────────┐
│   ONTOLOGY  │  Tag entities, geography, temporal context
│   MAPPING   │
└─────┬──────┘
       │
       ▼
┌─────────────┐
│ ORCHESTRATE │  Link note to rules, actions, decisions
└─────┬──────┘
       │
       ▼
┌─────────────┐
│   REFINE    │  Elevate to Core Artifact
└─────┬──────┘
       │
       ▼
┌─────────────┐
│     LWM     │  Update world model, strengthen patterns
│   UPDATE    │
└─────────────┘
```

### Stage Details

#### Stage 1: Capture

- **Input:** Raw field note, customer conversation, sales call
- **Tool:** Mobile app, web form, voice-to-text
- **Output:** Timestamped, geo-tagged note in database
- **LWM Impact:** Sensory input—captures edge cases LLMs miss

#### Stage 2: Ontology Mapping

- **Input:** Raw note
- **Process:** Auto-tag + human review
  - Extract entities (WHO: Customer, product)
  - Extract location (WHERE: London, UK)
  - Extract time (WHEN: 2026-01-21)
  - Extract regulations (WHAT: FCA cross-border)
- **Output:** Tagged note
- **LWM Impact:** Spatial mapping—teaches model where this event sits in business geography

#### Stage 3: Orchestration

- **Input:** Tagged note
- **Process:**
  - Does this conflict with existing rules?
  - Does this create a new rule?
  - Does this update an existing artifact?
- **Output:** Linked to orchestration rules
- **LWM Impact:** Temporal logic—establishes "if X happens, Y must follow"

#### Stage 4: Refinement

- **Input:** Orchestrated note
- **Process:** Human + AI collaboration
  - Validate the insight
  - Draft the artifact
  - Assign confidence score
- **Output:** Core Artifact (ART-YYYY-NNN.md)
- **LWM Impact:** Creates reusable, validated knowledge

#### Stage 5: LWM Update

- **Input:** Core Artifact
- **Process:**
  - Update vector embeddings
  - Strengthen neural pathways for successful patterns
  - Prune outdated/failed patterns
- **Output:** Enhanced world model
- **LWM Impact:** The system learns and improves

---

## 8. Safety & Orchestration

### The "World Model Collision" Protocol

**When does a collision occur?**

- New field note contradicts existing artifact
- Two artifacts have conflicting rules
- Regulatory change invalidates prior knowledge

**Collision Resolution Workflow:**

```yaml
collision_detected:
  1. Flag_Conflict:
    - artifact_1: ART-2024-089
    - artifact_2: FN-2026-017
    - conflict_type: REGULATORY_CHANGE

  2. Human_Review_Required:
    - assign_to: Compliance Team
    - priority: HIGH
    - deadline: 48 hours

  3. Resolution_Options:
    a. Deprecate Old Artifact:
      - status: ART-2024-089 → DEPRECATED
      - create_new: ART-2026-001
    b. Merge Artifacts:
      - combine_knowledge: true
      - update_version: ART-2024-089 v2.0
    c. Create Exception Rule:
      - scope: UK_Only
      - effective_date: 2025-01-01

  4. LWM_Update:
    - learning_instruction: "Post-2025 UK rules supersede pre-2025"
    - confidence_adjustment: Decrease old rule, increase new rule
    - notify_affected_users: true
```

### Active Pruning System

**Purpose:** Prevent the database from becoming a "graveyard" of outdated knowledge.

**Rationale:** Active Pruning is the operational form of an information-theoretic
constraint — stale, contradictory labels raise the **noise floor** (the Shannon bound of
the data), and no larger model can drop below it. Continuously reviewing and reconciling
old labels is what keeps that floor low. See
`docs/field-notes/2026-06-15-noise-floor-ontology-old-labels.md` and the promoted Core
Artifact `artifacts/AGRICULTURE/ART-2026-001-agriculture-food-data-governance-ontology.md`.

**Mechanism:**

```python
class ActivePruning:
    def __init__(self):
        self.review_interval = 90  # days

    def prune_artifacts(self):
        """Identify artifacts for review or deprecation"""

        criteria = {
            "unused": "Last used > 180 days ago",
            "unvalidated": "Confidence score < 0.5 after 30 days",
            "conflicting": "Flagged by collision detector",
            "expired": "Past expiry_date",
            "low_success": "Success rate < 60%"
        }

        for artifact in Artifact.objects.filter(**criteria):
            if artifact.review_count < 3:
                artifact.flag_for_review()
            else:
                artifact.deprecate()

    def feedback_loop(self, artifact_id, usage_result):
        """When employee uses artifact, collect feedback"""

        feedback = ask_user([
            "Was this artifact helpful?",
            "Did it lead to correct decision?",
            "Should it be updated?"
        ])

        if feedback.valid:
            artifact.increase_weight()
        else:
            artifact.trigger_review()
```

### Safety Constraints

```yaml
safety_rules:
  pii_protection:
    - encrypt: true
    - separate_storage: true
    - pattern_learning: "Learn from pattern, not from actual names/IDs"

  regulatory_compliance:
    - require_human_review: true
    - audit_trail: enabled
    - version_control: mandatory

  hallucination_prevention:
    - confidence_threshold: 0.75
    - require_source_citation: true
    - contradiction_check: enabled

  enterprise_specific:
    - no_generic_llm_output: true
    - always_check_ontology: true
    - route_through_orchestration: mandatory
```

---

## 9. Implementation Guide

### Phase 1: Foundation (Weeks 1-4)

**Deliverables:**

1. Create `/artifacts/` directory structure
2. Set up Supabase tables for field notes
3. Define initial ontology tags (geography, sectors, products)
4. Create first 10 Core Artifacts from existing documentation

**Database Schema:**

```sql
-- Field Notes Table
CREATE TABLE field_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  geography TEXT,
  sector TEXT,
  entities TEXT[],
  tags TEXT[],
  confidence_score DECIMAL(3,2),
  status TEXT DEFAULT 'pending' -- pending, processed, archived
);

-- Core Artifacts Table
CREATE TABLE core_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artifact_id TEXT UNIQUE NOT NULL, -- ART-2026-001
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  file_path TEXT NOT NULL, -- /artifacts/CATEGORY/ART-2026-001.md
  ontology_anchors JSONB,
  safety_status TEXT, -- verified, experimental, deprecated
  confidence_score DECIMAL(3,2),
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2),
  world_model_weight DECIMAL(3,2) DEFAULT 0.5
);

-- Usage Feedback Table
CREATE TABLE artifact_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artifact_id UUID REFERENCES core_artifacts(id),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  user_email TEXT,
  action TEXT,
  result TEXT, -- valid, invalid, needs_update
  feedback_text TEXT
);

-- World Model Collisions Table
CREATE TABLE world_model_collisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  artifact_1 UUID REFERENCES core_artifacts(id),
  artifact_2 UUID,
  conflict_type TEXT,
  status TEXT, -- pending, resolved, escalated
  resolved_at TIMESTAMPTZ,
  resolution_action JSONB
);
```

### Phase 2: Ontology Mapping (Weeks 5-8)

**Deliverables:**

1. Implement auto-tagging for field notes (NER, regex patterns)
2. Create ontology validation UI
3. Train team on artifact creation process
4. Build collision detection system

**Auto-Tagging Example:**

```python
import spacy
from datetime import datetime

class OntologyMapper:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.geography_keywords = {
            "UK": ["UK", "United Kingdom", "London", "FCA"],
            "US": ["US", "USA", "United States", "SEC"],
            "EU": ["EU", "European Union", "GDPR"]
        }
        self.sector_keywords = {
            "Financial_Services": ["underwriting", "insurance", "banking"],
            "Manufacturing": ["production", "assembly", "factory"],
            "Healthcare": ["patient", "medical", "diagnosis"]
        }

    def map(self, field_note_text):
        doc = self.nlp(field_note_text)

        return {
            "geography": self._extract_geography(doc),
            "sector": self._extract_sector(doc),
            "entities": self._extract_entities(doc),
            "temporal": self._extract_temporal(doc),
            "confidence": self._calculate_confidence(doc)
        }
```

### Phase 3: Orchestration Layer (Weeks 9-12)

**Deliverables:**

1. Implement orchestration rules engine
2. Create LLM routing logic (when to use generic vs. enterprise-tuned)
3. Build feedback loop system
4. Deploy active pruning automation

**Orchestration Engine:**

```python
class OrchestrationEngine:
    def __init__(self, world_model):
        self.world_model = world_model
        self.llm_generic = OpenAI()  # Off-the-shelf
        self.llm_enterprise = CustomLLM()  # Fine-tuned on artifacts

    def route_query(self, user_query, context):
        """Route query to appropriate AI system"""

        # Check if query requires enterprise-specific knowledge
        ontology_match = self.world_model.search(user_query, context)

        if ontology_match.confidence > 0.75:
            # Use enterprise-specific artifact
            return self._use_artifact(ontology_match.artifact_id)

        elif ontology_match.confidence > 0.5:
            # Use fine-tuned LLM with artifact as context
            return self.llm_enterprise.query(
                query=user_query,
                context=ontology_match.artifact_content
            )

        else:
            # Fall back to generic LLM, but flag for review
            response = self.llm_generic.query(user_query)
            self._flag_knowledge_gap(user_query, context)
            return response

    def _use_artifact(self, artifact_id):
        """Apply validated business logic from artifact"""
        artifact = CoreArtifact.get(artifact_id)

        # Log usage
        artifact.record_usage()

        # Apply orchestration rule
        result = artifact.apply_logic()

        # Request feedback
        feedback = self._request_feedback()
        artifact.update_weight(feedback)

        return result
```

### Phase 4: LWM Training (Weeks 13-16)

**Deliverables:**

1. Create vector embeddings for all artifacts
2. Implement RAG with ontology-aware retrieval
3. Build continuous learning pipeline
4. Deploy conflict resolution UI

---

## 10. Field Note Templates

### Template 1: Customer Interaction

```markdown
# Field Note: [Customer Name] - [Topic]

**Date:** 2026-01-21
**Author:** [Your Name]
**Location:** London, UK
**Customer:** [Customer Name]
**Product/Service:** DWS-IQ6 Underwriting Module

---

## The Conversation

> **Customer Quote:** "[Exact quote from customer]"

## The Problem/Insight

[Describe what you learned, what failed, what worked]

## Why This Matters

[Connect to business impact, revenue, compliance, etc.]

## Ontology Tags

- **Geography:** UK > London
- **Sector:** Financial_Services > Insurance > Underwriting
- **Entities:** [Customer Name], FCA, GDPR
- **Regulatory Context:** UK FCA Cross-Border Rules (2025)
- **Product:** DWS-IQ6
- **Confidence:** High | Medium | Low

## Next Steps

- [ ] Create Core Artifact
- [ ] Update orchestration rules
- [ ] Flag for engineering review
- [ ] Schedule follow-up with customer

## Related

- Similar to Field Note: FN-2026-015 (Paris customer, similar issue)
- Contradicts Artifact: ART-2024-089 (old UK rules)
```

### Template 2: Battlefield/Production Learning

````markdown
# Field Note: Production Incident - [Brief Description]

**Date:** 2026-01-21
**Severity:** Critical | High | Medium | Low
**System:** [System name]
**Impact:** [Number of users/transactions affected]

---

## What Happened

[Chronological timeline of the incident]

## Root Cause

[Technical explanation]

## Why the LLM Failed (if applicable)

[What did the AI miss? What context was lacking?]

## The Ground Truth

[What the system should have known/done]

## Resolution

[How it was fixed]

## Ontology Update Needed

```yaml
new_rule:
  if: [condition]
  then: [action]
  confidence: 0.9
  learning_priority: HIGH
```
````

## Prevent Recurrence

- [ ] Add to orchestration rules
- [ ] Create monitoring alert
- [ ] Update world model
- [ ] Document as Core Artifact

````

### Template 3: Regulatory Change

```markdown
# Field Note: Regulatory Update - [Regulation Name]

**Date:** 2026-01-21
**Regulation:** [Full name and reference]
**Effective Date:** [When it takes effect]
**Geography:** [Where it applies]
**Sectors Affected:** [List]

---

## Summary of Change

[Plain language explanation]

## Impact on DWS Operations

- **Products Affected:** [List]
- **Customers Affected:** [Estimate]
- **Compliance Risk:** High | Medium | Low

## What Must Change

1. [Specific action item]
2. [Specific action item]
3. [Specific action item]

## Ontology Impact

```yaml
world_model_collision:
  supersedes: [ART-2024-XXX, ART-2023-XXX]
  creates_new_rule: true
  requires_immediate_action: true
````

## Timeline

- [ ] Review by Legal: [Date]
- [ ] Update artifacts: [Date]
- [ ] Deploy changes: [Date]
- [ ] Notify customers: [Date]

````

---

## 11. Best Practices

### DOs

✅ **DO** capture field notes immediately (within 24 hours)
✅ **DO** use exact quotes from customers
✅ **DO** tag with ontology anchors
✅ **DO** link to related artifacts
✅ **DO** request feedback on artifact usage
✅ **DO** resolve world model collisions promptly
✅ **DO** separate PII from patterns

### DON'Ts

❌ **DON'T** rely on memory—write it down now
❌ **DON'T** use generic LLMs for regulated decisions
❌ **DON'T** ignore contradictions between artifacts
❌ **DON'T** let artifacts go unvalidated >30 days
❌ **DON'T** store raw customer data in world model
❌ **DON'T** skip the orchestration layer

---

## 12. Success Metrics

### LWM Effectiveness

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Artifact Usage Rate** | >80% | % of decisions using artifacts vs. generic LLM |
| **Success Rate** | >90% | % of artifact applications that achieve desired outcome |
| **Collision Resolution Time** | <48 hours | Average time to resolve world model conflicts |
| **Knowledge Coverage** | >70% | % of common queries covered by validated artifacts |
| **Active Pruning Rate** | 5-10% | % of artifacts deprecated per quarter (healthy turnover) |
| **Confidence Improvement** | +15% per quarter | Average confidence score improvement over time |

### Business Impact

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Compliance Failures** | <1% | % of transactions that fail regulatory review |
| **Customer Satisfaction** | >4.5/5 | CSAT scores when using LWM-powered tools |
| **Time to Decision** | -30% | Reduction in time from query to validated decision |
| **AI Hallucination Rate** | <2% | % of AI responses flagged as incorrect/unsourced |

---

## 📋 Quick Reference

### Create a Core Artifact

```bash
# 1. Create file
touch /artifacts/FINANCIAL_SERVICES/ART-2026-001.md

# 2. Use template (see Section 5)

# 3. Add to database
INSERT INTO core_artifacts (artifact_id, title, category, file_path, ontology_anchors)
VALUES ('ART-2026-001', 'UK Cross-Border Underwriting Rules', 'FINANCIAL_SERVICES', '/artifacts/FINANCIAL_SERVICES/ART-2026-001.md', '{"geography": "UK", "sector": "Insurance"}');

# 4. Create embeddings
python scripts/generate_embeddings.py --artifact ART-2026-001
````

### Flag a World Model Collision

```python
from ontology import WorldModel

wm = WorldModel()
wm.flag_collision(
    artifact_1="ART-2024-089",
    artifact_2="FN-2026-017",
    conflict_type="REGULATORY_CHANGE",
    priority="HIGH"
)
```

### Request Artifact Feedback

```python
from ontology import Artifact

artifact = Artifact.get("ART-2026-001")
feedback = artifact.request_feedback(
    user="user@dws.com",
    action="Applied to Case #1234",
    result="valid"  # or "invalid" or "needs_update"
)
artifact.update_confidence(feedback)
```

---

## 📞 Support

### Questions or Issues

- **Ontology Questions:** ontology@dws-iq.com
- **Technical Support:** support@dws-iq.com
- **Regulatory/Compliance:** compliance@dws-iq.com

### Related Documents

- **DWS Document Standard:** `DWS_DOCUMENT_STANDARD.md`
- **Site Quality Standards:** `SITE_QUALITY_STANDARDS.md`
- **Admin Manual - DWS6.com:** `ADMIN_MANUAL_DWS6_COM.md`

---

**Version:** 1.0
**Effective Date:** 21. January 2026
**Next Review:** Q2 2026

---

## Appendix A: Industry Lessons Applied

### Decision-Centric Insights → DWS Implementation

| Insight                                               | DWS Implementation                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| Off-the-shelf LLMs don't work for regulated tasks     | Orchestration layer routes queries through validated artifacts first      |
| Enterprises need a software layer to orchestrate LLMs | OrchestrationEngine class manages LLM routing and artifact application    |
| AI must speak the language the enterprise understands | Ontology framework captures enterprise-specific geography, sectors, rules |
| Hand-rolled ontologies do not scale                   | Automated ontology mapping + human validation                             |
| Production reality, not lab benchmarks, sets truth    | Production incident learning → immediate artifact updates                 |
| Demonstrated value, not headcount, drives adoption    | Product "pulls" itself via demonstrated value (success metrics)           |

### Guiding Principle

> **The gap between theoretical AI and practical enterprise value is bridged by ontology, orchestration, and continuous learning from operational reality.**

---

## Appendix B: File Organization

```
dws6/
├── artifacts/
│   ├── FINANCIAL_SERVICES/
│   │   ├── ART-2026-001.md
│   │   ├── ART-2026-002.md
│   │   └── README.md
│   ├── MANUFACTURING/
│   ├── HEALTHCARE/
│   ├── COMPLIANCE/
│   └── GENERAL/
├── docs/
│   ├── field-notes/
│   │   ├── 2026-01-21-uk-cross-border.md
│   │   ├── 2026-01-22-paris-customer.md
│   │   └── README.md
│   └── ontology/
│       └── ONTOLOGY.md (this file)
├── scripts/
│   ├── ontology_mapper.py
│   ├── orchestration_engine.py
│   ├── generate_embeddings.py
│   └── active_pruning.py
└── supabase/
    └── migrations/
        └── 014_ontology_lwm.sql
```

---

## Appendix C: Next Steps for DWS7

### Immediate Actions (This Quarter)

1. **Create Artifacts Directory:**

   ```bash
   mkdir -p artifacts/{FINANCIAL_SERVICES,MANUFACTURING,HEALTHCARE,COMPLIANCE,GENERAL}
   ```

2. **Set Up Database Tables:**
   - Implement schema from Section 9.1
   - Create migration file

3. **Document First 10 Core Artifacts:**
   - Mine existing documentation
   - Interview key team members
   - Capture critical business logic

4. **Pilot with One Team:**
   - Start with Sales or Compliance
   - Train on field note capture
   - Validate first artifacts

### Medium-Term (Next 2 Quarters)

1. **Build Orchestration Engine:**
   - Implement routing logic
   - Create feedback loop
   - Deploy to production

2. **Train Enterprise LLM:**
   - Fine-tune on core artifacts
   - Test against generic LLM
   - Measure improvement

3. **Scale to All Teams:**
   - Roll out field note capture
   - Onboard to artifact creation
   - Implement active pruning

### Long-Term (12 Months)

1. **Full LWM Deployment:**
   - Continuous learning pipeline
   - Real-time collision detection
   - Automated artifact generation

2. **Product Integration:**
   - Embed in DWS-IQ6
   - Integrate with Firehorse
   - API for external tools

3. **Measure Business Impact:**
   - Track compliance improvements
   - Monitor customer satisfaction
   - Calculate ROI

---

## Appendix D: CCP Seed Source (Machine Readable)

This section is the machine-readable source for `concept_context_policy` seed generation.

Flow: `ONTOLOGY.md` -> `scripts/parse-ontology.ts` -> `supabase/seeds/059_seed.sql`.

<!-- CCP_SEED_START -->

```json
{
  "source_version": "lwm_2026_04",
  "defaults": {
    "platform_version": null,
    "product_edition": null,
    "legal_profile": null,
    "cloud_profile": null
  },
  "records": [
    {
      "concept_id": "carbon_balance",
      "scope_type": "global",
      "scope_ref": null,
      "locale": "en",
      "policy_level": "preferred",
      "preferred_term": "carbon balance sheet",
      "definition_override": null
    },
    {
      "concept_id": "compliance_agent",
      "scope_type": "global",
      "scope_ref": null,
      "locale": "en",
      "policy_level": "preferred",
      "preferred_term": "compliance agent",
      "definition_override": null
    },
    {
      "concept_id": "sovereignty",
      "scope_type": "global",
      "scope_ref": null,
      "locale": "en",
      "policy_level": "preferred",
      "preferred_term": "EU sovereignty",
      "definition_override": null
    },
    {
      "concept_id": "carbon_balance",
      "scope_type": "global",
      "scope_ref": null,
      "locale": "fi",
      "policy_level": "preferred",
      "preferred_term": "hiilitase",
      "definition_override": null
    },
    {
      "concept_id": "carbon_balance",
      "scope_type": "industry",
      "scope_ref": "construction",
      "locale": "en",
      "policy_level": "preferred",
      "preferred_term": "embodied carbon ledger",
      "definition_override": "EN 15978 lifecycle carbon tracking for construction assets"
    },
    {
      "concept_id": "compliance_agent",
      "scope_type": "industry",
      "scope_ref": "construction",
      "locale": "en",
      "policy_level": "preferred",
      "preferred_term": "CSRD site agent",
      "definition_override": "Handles EPBD + Fit for 55 + Taxonomy simultaneously"
    },
    {
      "concept_id": "carbon_balance",
      "scope_type": "dispatch_operator",
      "scope_ref": "kela",
      "locale": "fi",
      "policy_level": "preferred",
      "preferred_term": "kuljetuksen päästötase",
      "definition_override": "KELA-reimuttujen kuljetusten CO2-seuranta per matka (Kela on Traficom-määrittelemä läpiajomääräävä taksiliikenteessä — ei DWS:n ohjelmistotuotteen asiakas)"
    },
    {
      "concept_id": "sovereignty",
      "scope_type": "platform",
      "scope_ref": "dws_iq",
      "locale": "fi",
      "policy_level": "required",
      "preferred_term": "EU-suvereniteetti",
      "definition_override": "EU-suvereeni hosting vaaditaan; US-infrastruktuuri suljetaan pois (CLOUD Act)"
    }
  ],
  "forbidden_rules": [
    {
      "concept_id": "physical_ai",
      "scope_type": "customer",
      "forbidden_in": ["defense_context"],
      "locales": ["en"],
      "preferred_term": "Physical AI",
      "definition_override": "Forbidden in this context; use regulatory intelligence engine"
    }
  ]
}
```

<!-- CCP_SEED_END -->

---

## 13. Decision-Centric Roadmap (v1.2)

DWS Ontology v1.0–1.1 is **knowledge-centric**: field notes → artifacts → LWM. v1.2 makes it **decision-centric**: data + logic + action + security unified per decision. The seven gaps below close that step. Each has owner, target quarter, and acceptance criteria.

### 13.1 Actions (Verbs) — Write-Back Layer

**Gap:** Today, agent outputs are recommendations, not committed transactions on operational substrates (ERPs, MES, WMS, IoT).

**Target:** Every Skilled Agent can stage, review, and commit an `Action` against a registered substrate, with full audit.

```yaml
action_primitive:
  id: ACT-<YYYY>-<NNN>
  verb: [create | update | delete | dispatch]
  subject: <ontology_object_id> # the "noun"
  substrate: [supabase | erp_sap | wms_<id> | jetson_fleet | email_ses | ...]
  stage: [draft | staged | reviewed | committed | reverted]
  staged_by: <agent_or_user>
  reviewed_by: <human_user> # required for non-trusted actions
  committed_at: <timestamp>
  rollback_plan: <reversal_action_id>
  policy_envelope:
    purpose: [compliance_report | customer_outreach | site_dispatch | ...]
    markings: [eu_only | csrd_audit | nis2_essential | ...]
```

**Acceptance:** `core_actions` table + `staged → committed` workflow + write-back connectors for at minimum Supabase, SES email, and one ERP adapter.

**Owner:** Brain (DWS IQ 6) + Body (Firehorse). **Target:** Q3 2026.

### 13.2 Scenarios / Global Branching

**Gap:** No sandbox to safely simulate multi-step decisions before commit.

**Target:** Branch the ontology (objects + staged actions) into a named scenario; run agents against the branch; merge or discard.

```yaml
scenario:
  id: SCN-<YYYY>-<NNN>
  parent_branch: main
  created_by: <agent_or_user>
  hypothesis: "Reallocate steel from supplier A to supplier B for Q3 CBAM exposure"
  staged_actions: [ACT-..., ACT-...]
  simulation_runs: [SIM-..., SIM-...]
  status: [open | merged | discarded]
  merge_review: <human_user>
```

**Acceptance:** Postgres-level branch (schema-namespaced or row-tagged), scenario diff view, agent tool `scenario.create / stage / merge`.

**Owner:** Brain. **Target:** Q4 2026.

### 13.3 Per-Decision Lineage

**Gap:** v1.1 captures _artifact_ lineage (which note → which artifact). v1.2 must capture _decision_ lineage (which user + data version + logic version + tool calls + committed action).

```yaml
decision_record:
  id: DEC-<YYYY>-<NNN>
  triggered_by: <agent_or_user>
  data_snapshot: <ontology_branch_hash>
  logic_invoked: [SKILL-compliance, MODEL-cbam-forecast-v3]
  tool_calls: [<jsonl_log_pointer>]
  scenario: <SCN-id?>
  committed_actions: [ACT-..., ACT-...]
  outcome: [success | reverted | partial]
  feedback_loop: <artifact_update_or_none>
```

**Acceptance:** `decisions` table referenced by every committed `core_actions` row. Replays a decision deterministically given the snapshot hash.

**Owner:** Brain + Memory (LWM). **Target:** Q3 2026 (alongside §13.1).

### 13.4 Purpose-Based + Marking-Based Policies

**Gap:** RLS today gates by role + row. The European Ontology Standard requires **purpose** (why is this query happening?) and **markings** (security tags that propagate through pipelines) to be evaluated alongside role.

**Target:** Extend Supabase RLS + agent gateway to evaluate `(role, purpose, markings)` at every data, logic, and action invocation.

```yaml
policy_evaluation:
  inputs:
    role: <user_or_agent_role>
    purpose: <declared_purpose_of_use>
    markings: <set_of_tags_on_data_or_logic>
    eu_ai_act_risk_tier: [minimal | limited | high | unacceptable]
  outputs:
    decision: [allow | deny | require_human_oversight]
    redactions: [<column_set>]
    audit_log: <jsonl_pointer>
```

**Acceptance:** EU AI Act Article 14 (human oversight) and Article 12 (logging) covered by automated policy evaluation, not manual review.

**Owner:** Security layer (KYA + RLS + agent gateway). **Target:** Q3 2026 (locks in before AI Act enforcement 2026-08-02).

### 13.5 Logic Binding

**Gap:** Each Skilled Agent invokes its own ML models, optimizers, and LLM tools ad-hoc.

**Target:** A single "logic binding" registry where every callable — Supabase function, Python optimizer, fine-tuned LLM, MCP tool, external API — is exposed with the same interface to agents and humans.

```yaml
logic_asset:
  id: LGC-<YYYY>-<NNN>
  kind: [sql_function | python_callable | llm_tool | mcp_tool | external_api]
  uri: <runtime_endpoint>
  signature: <jsonschema>
  policy_envelope: <see §13.4>
  cost_per_call: <eur | tokens>
  latency_p95_ms: <int>
```

**Acceptance:** `tools/list` (MCP) returns every logic asset with the same shape. New agents discover capabilities, not hard-code them.

**Owner:** Brain + MCP Hub. **Target:** Q4 2026.

### 13.6 Multi-Tier Agent Memory

**Gap:** v1.1 has artifact weights and pruning. No formal memory tiers.

**Target:** Backed by `decisions` (§13.3) and `artifacts` (existing):

| Memory tier | DWS substrate                                                  | TTL                      |
| ----------- | -------------------------------------------------------------- | ------------------------ |
| Working     | Agent run context (LangGraph state, MCP session)               | per run                  |
| Episodic    | `decisions` table + tool-call JSONL                            | 12 months hot, then cold |
| Semantic    | `core_artifacts` + LWM embeddings                              | active until pruned      |
| Procedural  | `logic_assets` registry (§13.5) + Skills (`.claude/commands/`) | versioned                |

**Owner:** Memory (LWM). **Target:** Q1 2027.

### 13.7 Embedded Edge Ontology

**Gap:** Lifetime Fleet (Hands) is spec phase. No edge ontology runtime.

**Target:** A Jetson-resident slice of the ontology (relevant objects + actions + policies) that operates offline and syncs decisions back when reconnected.

**Acceptance:** Jetson agent can stage `Action` offline; on reconnect, the stage is reconciled against `main` branch with conflict detection (reuse §8 collision protocol).

**Owner:** Hands (Lifetime Fleet) + Memory. **Target:** Q2 2027.

---

## 14. Where DWS Leads, Where DWS Lags

The DWS Ontology Standard is positioned as a **European Ontology Standard** — open, sovereign, regulation-native. Comparison below is against the prevailing decision-centric ontology pattern in the wider industry, not any single vendor.

### Where DWS leads

| Capability                                          | DWS Advantage                                                                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **EU regulations as first-class ontology entities** | Fit for 55, ETS, CBAM, CSRD, AI Act, NIS2, GDPR are pre-modeled (§6). Other ontologies require customers to encode these from zero. |
| **Sovereignty by design**                           | EU data residency (Finland/Germany), no CLOUD Act exposure, Gaia-X tier-3 path. Most incumbent ontologies run on US hyperscalers.   |
| **CCP — concept_context_policy**                    | Per-customer/industry/locale term preference + forbidden-term enforcement (Appendix D). Not standard practice elsewhere.            |
| **Active pruning + collision protocol**             | Forced reconciliation of contradictory artifacts with human gates (§8). DWS _enforces_ deprecation, not just lineage.               |
| **Skilled Taxonomy (3-tier)**                       | Brand / Spec / UI naming for Agents, Workflows, Jurisdictions. Marketable and consistent across docs and UI.                        |
| **Build-for-Agents discipline**                     | Every product must expose CLI + MCP + Skill (CLAUDE.md). Hard rule, not aspiration.                                                 |
| **Tribal-knowledge pipeline**                       | Field-note → artifact → LWM is opinionated and structured (§7).                                                                     |
| **Open European standard**                          | Spec published openly under permissive licence; runtime competitive. Schema becomes a Brussels-Effect adoption surface.             |

### Where DWS lags (closed by §13)

| Gap                                             | Decision-centric incumbent norm  | DWS v1.1              | DWS v1.2 plan                              |
| ----------------------------------------------- | -------------------------------- | --------------------- | ------------------------------------------ |
| Actions / write-back                            | Staged → committed per substrate | Missing               | §13.1 — Q3 2026                            |
| Scenarios / Global Branching                    | Native                           | Missing               | §13.2 — Q4 2026                            |
| Per-decision lineage                            | Native                           | Artifact-level only   | §13.3 — Q3 2026                            |
| Purpose-based + marking policies                | Runtime-evaluated                | Role + RLS only       | §13.4 — Q3 2026                            |
| Logic binding (unified tool surface)            | Single registry                  | Per-agent ad-hoc      | §13.5 — Q4 2026                            |
| Multi-tier agent memory                         | Working/episodic/semantic/proc.  | Artifact weights only | §13.6 — Q1 2027                            |
| Embedded edge ontology                          | Native edge runtime              | Spec phase            | §13.7 — Q2 2027                            |
| Operational system connectors (ERP/MES/WMS/IoT) | Hundreds of mature adapters      | Aspirational          | Pulls from §13.1; Q4 2026 first 3 adapters |
| **Knowledge Catalog Runtime**                   | GC-KC (Google), Atlan, Collibra  | Fragmented (5 stores) | §15 — Q2–Q4 2026                           |

### Strategic posture

DWS does **not** try to out-engineer 20-year-old US incumbents on operational connectors or scenario tooling. DWS wins by being the **EU-sovereign, regulation-native, agent-first, open-standard** ontology platform. The §13 roadmap closes operational gaps just enough that DWS can credibly serve EU industrial customers who require sovereignty, and the open European standard turns the schema itself into a market-shaping asset.

---

## 15. GC-KC Reference Architecture — What Industrial Ontology Runtime Looks Like

> **Field note reference:** `docs/field-notes/2026-05-04-google-cloud-knowledge-catalog-analysis.md`

In May 2026, Google Cloud released the **Knowledge Catalog** — an evolution of Dataplex described as a "universal context engine for agents." It is the closest public-cloud equivalent to what DWS is building as the EU-sovereign LWM runtime. This section maps GC-KC to DWS ontology tiers, documents the connector decision, and introduces the DWSDataProduct concept.

### 15.1 GC-KC Three Pillars Mapped to DWS Ontology

GC-KC operates on three pillars. Each maps directly to a DWS ontology layer:

| GC-KC Pillar    | GC-KC capability                                                                           | DWS ontology tier                                      | DWS implementation                                                |
| --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------- |
| **Aggregation** | Unified metadata from BigQuery, SAP, Salesforce, Workday into one governed source of truth | Tier 1: Controlled vocabulary + entity registry        | `ONTOLOGY.md` §6 entity taxonomy + `products.json` + `kb/wiki/`   |
| **Enrichment**  | Gemini auto-extracts entity relationships, verified SQL patterns, business glossaries      | Tier 2: Class hierarchy + properties + inference rules | `ProfileFact` subject-predicate-value + `kb.agent.ts` KB pipeline |
| **Search**      | Hybrid semantic search, sub-second, access-control-aware, surfaced to agents               | Tier 3: Axiom-driven query with policy enforcement     | `hybrid_memory_search()` + KYA trust score + RLS                  |

**Key insight:** GC-KC is an ontology runtime at Google Cloud scale. DWS has the philosophy (this document) and the substrate (Supabase, KB, hybrid search). The gap is a unified API layer that aggregates across all five DWS metadata stores.

### 15.2 GC-KC Concept → DWS Concept Mapping

| GC-KC concept                        | DWS equivalent                                | Status                 |
| ------------------------------------ | --------------------------------------------- | ---------------------- |
| Business glossary                    | ONTOLOGY.md §6 entity taxonomy                | Exists (manual)        |
| Entity relationship extraction       | `ProfileFact` subject-predicate-value triples | Exists (per-agent)     |
| Verified SQL / query patterns        | `hybrid_memory_search()` confidence scoring   | Exists (internal only) |
| Data products with SLAs + governance | `DWSDataProduct` interface (§15.3)            | Planned Q3 2026        |
| Access-control-aware search          | RLS + KYA agent trust score                   | Exists                 |
| Automated metadata enrichment        | `kb-auto-enrich.ts` daily script              | Planned Q2 2026        |
| Cross-system metadata aggregation    | DWS Knowledge Catalog Agent                   | Planned Q2 2026        |

### 15.3 DWSDataProduct — Named Ontology Concept

Inspired by GC-KC "Data Products" (self-contained blocks with intent, SLAs, governance constraints), DWS introduces the `DWSDataProduct` as a first-class ontology concept. Every agent output that crosses agent boundaries MUST be declared as a Data Product.

**Planned interface** (`src/agents/data-product.types.ts`):

```
DWSDataProduct {
  id                  kebab-case stable identifier
  producingAgent      which agent creates this
  outputSchema        declared JSON Schema for the output
  sla.confidenceFloor minimum acceptable confidence (0–1)
  sla.maxLatencyMs    SLA latency ceiling in milliseconds
  governance.allowedConsumerAgents  which agents may consume this
  governance.regulationIds          which EU regulations this satisfies
  governance.dataResidency          'EU' | 'EU+US' sovereignty declaration
  ontologyAnchors     ONTOLOGY.md entity IDs this relates to
  lineage.memoryIds   semantic_memories this depends on
  lineage.kbArticles  KB wiki articles consulted
}
```

This is the DWS sovereign equivalent of GC-KC's Data Product. It bundles output semantics, SLA, governance, and lineage into one governed unit — enabling agents to trust each other's outputs without re-validating from scratch.

### 15.4 Connector Decision — EU Sovereignty First

**Direct GC-KC ingestion (DWS data → Google Cloud): REJECTED**

Rationale: DWS runs EU-sovereign on Supabase + Aiven Finland. GC-KC runs on Google Cloud infrastructure subject to CLOUD Act. Pushing operational DWS data into GC-KC destroys the sovereignty moat that is central to DWS's EU industrial market positioning.

**DWS → GC-KC Export Adapter: APPROVED for Q4 2026 (customer-optional)**

For enterprise customers already running Google Cloud (BigQuery + SAP), a one-way push adapter exports `DWSDataProduct` metadata descriptors to the customer's GC-KC instance. Only the descriptor (name, schema, SLA, description) is exported — no raw data, no embeddings, no agent logs. Sovereignty preserved; Google Cloud enterprise integration story enabled.

**Future file:** `src/integrations/google/knowledge-catalog-export.ts`

### 15.5 DWS Knowledge Catalog Roadmap

| Phase              | Deliverable                                                | Target           |
| ------------------ | ---------------------------------------------------------- | ---------------- |
| 0 — Foundation     | Field note + ONTOLOGY.md §15 (this section)                | Done (Q2 2026)   |
| 1 — Aggregation    | `knowledge-catalog.agent.ts` + unified metadata search API | Q2 2026 Sprint 1 |
| 1 — CLI            | `dws knowledge-catalog search` → JSON + MCP tool           | Q2 2026 Sprint 1 |
| 2 — Enrichment     | `kb-auto-enrich.ts` daily script, auto-ingest field notes  | Q2 2026 Sprint 2 |
| 3 — Data Products  | `data-product.types.ts` + 5 agent descriptors              | Q3 2026          |
| 4 — Export Adapter | GC-KC export adapter (dry-run, customer-optional)          | Q4 2026          |

### 15.6 Strategic Positioning

GC-KC validates that the ontology-first orchestration approach is correct — Google's largest cloud engineering teams have converged on exactly the architecture DWS has been building since v1.0 (January 2026). The difference is the sovereignty axis:

| Dimension          | GC-KC                        | DWS Knowledge Catalog                        |
| ------------------ | ---------------------------- | -------------------------------------------- |
| Data residency     | Google Cloud (US-controlled) | EU-sovereign (Finland/Germany)               |
| CLOUD Act exposure | Yes                          | No                                           |
| Regulatory native  | Generic                      | EU AI Act, GDPR, ETS, CBAM, CSRD pre-modeled |
| Enrichment model   | Gemini auto-extract          | LLM-maintained KB (Karpathy-inspired)        |
| Gaia-X compatible  | No                           | Tier-3 path                                  |
| Open standard      | No                           | Spec published under permissive licence      |

DWS Knowledge Catalog is the **Gaia-X native, EU AI Act compliant, regulation-first** answer to GC-KC. The primary market: EU industrial enterprises that cannot or will not route sovereign data through US hyperscalers.

---

## 16. KYA Ontology — Agent Governance Vocabulary (v1.6)

The ontology answers WHERE, WHEN, WHY and WHO/WHAT. Once an autonomous agent is the actor,
a fifth question appears that none of those cover: **UNDER WHAT MANDATE.** This section is the
canonical vocabulary for that layer. Normative source: `Legal/KYA_S1.md` v1.5. Where this section
and the specification disagree, the specification wins.

Finnish is the Ground Truth for the public-facing terms (HIC decision, 09.08.2026); the other four
languages are translations of it.

### 16.1 Core concepts

- **KYA (Know Your Agent)** — the governance framework that verifies an autonomous agent's runtime
  behaviour, identity, mandate and security. The KYC principle carried into AI: you may not let an
  actor into your systems that you cannot name, bound, and stop.
- **KYA-S1 Specification** — the published specification defining 7 control domains, 3 assurance
  levels and the auditability requirements. A specification, not a standard: no standards-body
  consensus process has been run.
- **Evidence Meta-Rule (§3)** — self-attestation is never acceptable evidence of conformance. Only a
  third-party audit report or cryptographically signed platform telemetry counts. Binds the author
  of the specification first.
- **Agentic Commerce** — autonomous agent-to-agent trade, procurement and payment, where each
  transaction is protected by a KYA-S1 authorization.

### 16.2 The seven control domains

| Control | Name | What it governs |
| --- | --- | --- |
| **IDV** | Identity Verification | Binds every agent session, tool request and decision to a cryptographically verified human (IDV-1..4). |
| **REG** | Capability Registration | The capability manifest and live registry: permitted tools, API endpoints and execution limits, declared before activation (REG-1..2). |
| **BHM** | Behavioral Modeling | Runtime behavioural monitoring against a baseline; detects prompt injection, tool poisoning and deviant execution paths. |
| **TC4** | Chain Termination | The emergency brake: atomic elimination of an agent chain (leash snap) and invalidation of every active authorization token. |
| **FLT** | Fault Attribution | A signed classification of the fault's cause within 72 hours of incident close (FLT-4). |
| **TRS** | Trust Score & Authorization | Computes the runtime trust level and issues atomic execution grants. |
| **PRV** | Provenance & Audit Trail | Decision replay: the decision chain, model state and the human's sign-off (PRV-4) in immutable history (PRV-2). |

### 16.3 Assurance levels (KYA-AL)

Renamed from Bronze / Silver / Gold in KYA-S1 v1.4 (HIC decision, 09.08.2026). Thresholds unchanged.

| Level | Audit cadence | Required evidence depth | SLA (IDV & TC4) | PRV replay availability |
| --- | --- | --- | --- | --- |
| **KYA-AL1** (Standard) | Annual | Third-party audit in ≥1 domain + signed telemetry | ≤ 15 minutes | 30 days |
| **KYA-AL2** (Enhanced) | Quarterly | Audit across IDV and BHM + 12 months signed telemetry | ≤ 5 minutes | 7 days |
| **KYA-AL3** (Critical) | Continuous, real time | External assessor across all 7 domains + signed SLA | ≤ 60 seconds | 24 hours |

### 16.4 Runtime mechanisms

- **Lease Token (TRS-4)** — a single-use, time-bound, cryptographically signed authorization key.
  The agent's delegate consumes it atomically via `consumeAndExecute` at the start of execution,
  which is what closes the race-condition and double-charge windows.
- **Fail-Closed (TRS-5)** — if the trust engine does not answer within its bounded timeout (e.g.
  > 500 ms) or returns an error, the action never proceeds autonomously; it routes to a human
  (User Task / HIC Dashboard) or halts.
- **Leash Snap (TC4)** — atomic severing of an execution chain: stops a multi-agent run and
  invalidates every active Lease Token at once.
- **Capture Precedes Release (TC4-5)** — forensic state is committed *before* terminated resources
  are freed. Without it, a terminated chain leaves FLT with no substrate to attribute against.
- **Bounded Attribution Clock (FLT-4)** — a binding classification of the fault within 72 hours of
  incident close, into five categories: model fault, application-logic fault, integration fault,
  human input fault, configuration fault.
- **TRS (Trust Score)** — the agent's runtime trust level (0–100, i.e. 0.00–1.00), driven by the
  principal's verification state, BHM behavioural history and platform integrity.
- **TRS_req (risk threshold)** — the per-task minimum trust level an agent must reach to earn
  automatic execution authority.

### 16.5 Process and integration concepts

- **HIC (Human-in-Command)** — the human's real command, oversight and override authority over an
  AI process. The DWS implementation of EU AI Act Article 14.
- **HIC Dashboard / Single Pane of Glass** — the human commander's unified control-room view:
  deviations, TRS scores and the User Tasks awaiting sign-off.
- **Human Decision Provenance (PRV-4)** — the auditable record of a human sign-off: the stated
  rationale, the human's eIDAS identity, and the situational state at the moment of the decision.
- **BPMN 2.0 Engine** — the executable process engine (e.g. Camunda) that routes each step at
  runtime to the automatic lane (Service Task) or to a human (User Task) based on the agent's TRS.
- **EUDI Wallet / eIDAS 2.0** — the EU's official digital identity wallet, where the human
  commander's base identity (IDV-1) and signing authority (QEAA / QES) are anchored at
  public-authority level.

### 16.6 Five-language term table

FI is Ground Truth; EN, SV, DE and FR are translations of it.

| Term / code | Suomi (FI) — Ground Truth | English (EN) | Svenska (SV) | Deutsch (DE) | Français (FR) |
| --- | --- | --- | --- | --- | --- |
| **KYA** | Agentin tunnistaminen | Know Your Agent | Känn din agent | Kenne deinen Agenten | Connaissez votre agent |
| **KYA-S1 Specification** | KYA-S1-turvallisuusspesifikaatio | KYA-S1 Security Specification | KYA-S1 Säkerhetsspecifikation | KYA-S1 Sicherheitsspezifikation | Spécification de sécurité KYA-S1 |
| **Evidence Meta-Rule (§3)** | Näyttömetasääntö (§3) | Evidence Meta-Rule (§3) | Bevis-metaregel (§3) | Evidenz-Metaregel (§3) | Méta-règle de preuve (§3) |
| **Agentic Commerce** | Autonominen agenttikaupankäynti | Agentic Commerce | Agentisk handel | Agenten-Handel | Commerce agentique |
| **IDV** | Todennettu ihmisjohtajan sidos | Verified Human Principal Binding | Verifierad mänsklig huvudmannakoppling | Verifizierte menschliche Hauptverbindung | Liaison d'agent à un responsable humain vérifié |
| **REG** | Kyvykkyysmanifesti ja rekisteri | Capability Manifest & Registry | Kapacitetsmanifest och register | Fähigkeitsmanifest & Register | Manifeste et registre des capacités |
| **BHM** | Ajonaikainen käyttäytymisen valvonta | Runtime Behavioral Modeling | Beteendemodellering vid körning | Laufzeit-Verhaltensmodellierung | Modélisation comportementale en temps réel |
| **TC4** | Ketjun keskeytys / hätäjarru | Chain Termination / Leash Snap | Kedjeavslutning / nödbroms | Kettenabbruch / Notbremse | Terminaison de chaîne / frein d'urgence |
| **FLT** | Aikarajoitettu virheattribuutio | Bounded Fault Attribution | Tidsbegränsad felattribuering | Zeitbegrenzte Fehlerattribuierung | Attribution limitée des fautes |
| **TRS** | Luottamuspiste ja valtuutus | Trust Score & Authorization | Förtroendepoäng och auktorisering | Vertrauenswert & Autorisierung | Score de confiance et autorisation |
| **PRV** | Päätösten toistettavuus ja auditointijälki | Decision Provenance & Audit Trail | Beslutsursprung och granskningskedja | Entscheidungsherkunft & Prüfpfad | Provenance de la décision et piste d'audit |
| **KYA-AL1** | Vakiotaso | Standard Assurance | Standardgaranti | Standard-Garantie | Assurance standard |
| **KYA-AL2** | Laajennettu taso | Enhanced Assurance | Förhöjd garanti | Erweiterte Garantie | Assurance renforcée |
| **KYA-AL3** | Kriittinen taso | Critical Assurance | Kritisk garanti | Kritische Garantie | Assurance critique |
| **Lease Token (TRS-4)** | Kertakäyttöinen valtuutusavain | Atomic Single-Use Lease Token | Atomisk tidsbegränsad nyttjanderätts-token | Atomares Einmal-Autorisierungs-Token | Jeton de bail atomique à usage unique |
| **Fail-Closed (TRS-5)** | Pakkosuojaus vikatilanteessa | Fail-Closed Protection | Säker vid fel (fail-closed) | Fehlersichere Sperre (fail-closed) | Verrouillage en cas de défaillance |
| **Leash Snap (TC4)** | Hätäjarru | Leash Snap Emergency Stop | Nödbroms | Notbremse | Frein d'urgence |
| **Capture Precedes Release (TC4-5)** | Tallennus ennen resursseista luopumista | Capture Precedes Release | Lagring före frigörande | Erfassung vor Freigabe | Capture avant libération des ressources |
| **Bounded Attribution Clock (FLT-4)** | Aikarajoitettu virheattribuutio (72 h) | Bounded Attribution Clock (72 h) | Tidsbegränsad felattribuering (72 h) | Zeitbegrenzte Fehlerattribuierung (72 h) | Horloge d'attribution limitée (72 h) |
| **HIC** | Ihmisen johtamisvalta | Human-in-Command | Mänsklig ledningsrätt | Menschliche Führung | Commandement humain |
| **Single Pane of Glass** | Yhtenäinen valvomonäkymä | Single Pane of Glass HIC Dashboard | Enhetlig kontrollvy | Zentrales Kontrollpanel | Panneau de contrôle unique |
| **Human Decision Provenance (PRV-4)** | Ihmispäätöksen alkuperä ja kuittaus | Human Decision Provenance | Mänskligt beslutsursprung | Menschliche Entscheidungsherkunft | Provenance de la décision humaine |
| **EUDI Wallet / eIDAS 2.0** | EU:n digitaalinen lompakko / eIDAS 2.0 | European Digital Identity Wallet / eIDAS 2.0 | EU:s digitala plånbok / eIDAS 2.0 | Digitale EU-Brieftasche / eIDAS 2.0 | Portefeuille d'identité numérique de l'UE / eIDAS 2.0 |

### 16.7 Two corrections made while importing this vocabulary

Recorded rather than silently applied, per Rule 12:

1. **"Beteendemodellering i speltid" (SV, BHM)** was a mistranslation — *speltid* is playing time in
   a game or a film's running time, not software runtime. Corrected to *vid körning*.
2. **"Termination de chaîne" (FR, TC4)** is not a French word in this sense. Corrected to
   *terminaison de chaîne*. Also **"Vertrauenspunkt" (DE, TRS)** reads as a physical point of trust;
   corrected to *Vertrauenswert* (trust value/score).

---

**End of Document**
