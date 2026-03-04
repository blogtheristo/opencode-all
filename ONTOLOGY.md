# DWS Ontology & Lifetime World Model (LWM)

---
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/add-eu-info-note-8XYey | Date: 11.02.2026 | Changes: Added DWS6 Enterprise Ontology — EU institutions (Commission, Council, Parliament, EIB), EU Single Market (450M consumers), EU regulatory framework (Fit for 55, ETS, CBAM, CSRD, AI Act, GDPR, NIS2), DWS IQ 6 platform entities, 20-moat fortress taxonomy, 16 EU industries, key geographic entities, Alden Biesen retreat context
  - Version: 1.0 | Tool: Claude Code | Session: claude/show-dws-version-LLEHz | Date: 21.01.2026 | Changes: Initial creation - Enterprise ontology framework with LWM integration

Session Links & References:
  - Claude Code (claude/show-dws-version-LLEHz): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/ONTOLOGY.md

Document Status:
  - Created: 21.01.2026
  - Last Modified: 11.02.2026
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

This document establishes the ontological framework for DWS7 and beyond, defining how knowledge transitions from raw field notes to a living, breathing enterprise intelligence system. It addresses the core insight from Palantir CEO Alex Karp:

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

| Use Case | Storage Location | Reasoning |
|----------|-----------------|-----------|
| **Structured Intelligence** | Database (Supabase) | Queryable, linkable to objects, searchable in dashboards |
| **Narrative Context** | Docs Files (.md) | Flow of argument, white papers, briefings |
| **Core Artifacts** | Database with Docs Reference | Metadata in DB, full content in versioned .md |
| **Regulatory Documents** | Docs Files with DB Index | Audit trail, version control, PDF generation |
| **Training Data** | Database (Vector Store) | Embedding-ready, RAG-optimized |
| **Field Notes** | Hybrid (DB → Docs → Artifact) | Captured in DB, processed to .md, refined to artifact |

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
│         ┌────────────────┼────────────────┐            │
│         │                │                │            │
│    ┌────▼────┐    ┌─────▼─────┐    ┌────▼────┐       │
│    │ LLM API │    │ Rule Base │    │ Memory  │       │
│    │  Layer  │    │  Engine   │    │  Store  │       │
│    └─────────┘    └───────────┘    └─────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### How LWM Differs from Traditional RAG

| Feature | Traditional RAG | LWM |
|---------|----------------|-----|
| **Storage** | Static embeddings | Dynamic world state |
| **Context** | Document chunks | Spatial-temporal coordinates |
| **Updates** | Batch re-indexing | Continuous world model updates |
| **Conflicts** | Ignored | Actively resolved |
| **Safety** | Query filtering | Orchestration rules + safety constraints |

---

## 5. Artifact Framework

### Core Artifact Template

Every significant piece of enterprise knowledge should be captured as a **Core Artifact**.

**Location:** `/artifacts/[CATEGORY]/ART-[YYYY]-[NNN].md`

**Template:**

```markdown
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

| Date | User | Action | Result | Feedback |
|------|------|--------|--------|----------|
| 2026-01-21 | user@dws.com | Applied to Case #1234 | ✅ Valid | Prevented compliance failure |
| 2026-01-25 | user2@dws.com | Applied to Case #1240 | ✅ Valid | Confirmed accuracy |

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
```

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
```

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
    - 16 EU industries served across Single Market
    - Compliance = access key (not cost center)
    - Regulatory-first DNA as competitive advantage
```

#### EU Regulatory Framework (DWS6 Compliance Stack)

```yaml
eu_regulations:
  fit_for_55:
    type: Climate legislation package
    scope: EU-wide emissions reduction 55% by 2030
    dws6_relevance: Core compliance automation target across 16 industries
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
      - High-risk AI system compliance for 16 industries
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
    tier_1_impossible:
      - "1. EU/Nordic Operations + Single Market Access (450M consumers)"
      - "2. Government Validation (Kela)"
      - "3. NCC Reference"
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
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   ONTOLOGY  │  Tag entities, geography, temporal context
│   MAPPING   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ORCHESTRATE │  Link note to rules, actions, decisions
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   REFINE    │  Elevate to Core Artifact
└──────┬──────┘
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

```markdown
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

## Prevent Recurrence

- [ ] Add to orchestration rules
- [ ] Create monitoring alert
- [ ] Update world model
- [ ] Document as Core Artifact
```

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
```

## Timeline

- [ ] Review by Legal: [Date]
- [ ] Update artifacts: [Date]
- [ ] Deploy changes: [Date]
- [ ] Notify customers: [Date]
```

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
```

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

## Appendix A: Palantir Lessons Applied

### Alex Karp's Insights → DWS Implementation

| Karp's Point | DWS Implementation |
|--------------|-------------------|
| "Off-the-shelf LLMs don't work for regulated tasks" | Orchestration layer routes queries through validated artifacts first |
| "You need a software layer to orchestrate LLMs" | OrchestrationEngine class manages LLM routing and artifact application |
| "In a language your enterprise understands" | Ontology framework captures enterprise-specific geography, sectors, rules |
| "People try to build Ontology by hand" | Automated ontology mapping + human validation |
| "Battlefield proved it works" | Production incident learning → immediate artifact updates |
| "Sales force is shrinking" | Product "pulls" itself via demonstrated value (success metrics) |

### The Karp Principle

> **"The gap between theoretical AI and practical enterprise value is bridged by ontology, orchestration, and continuous learning from battlefield reality."**

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

**End of Document**
