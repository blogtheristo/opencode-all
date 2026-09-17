# IPR Protection Strategy — DWS IQ 6 & Lifetime World Model

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-opus-4-6) | Session: claude/ipr-protection-strategy-fXNsq | Date: 19.02.2026 | Changes: Initial IPR Protection Strategy — three-tier framework (NDA, Patents, Trade Secrets) for LWM, knowledge graph, BYOC, and CIDM

Session Links & References:

- Claude Code (claude/ipr-protection-strategy-fXNsq): https://github.com/blogtheristo/dws6/tree/claude/ipr-protection-strategy-fXNsq
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/IPR_PROTECTION_STRATEGY.md

Document Status:

- Created: 19.02.2026
- Last Modified: 19.02.2026
- Language: English (with Finnish legal references)
- Languages Available: EN
- Publication Status: ACTIVE
- Classification: CONFIDENTIAL — INTERNAL USE ONLY

Related Documents:

- Partners/NDA_TEMPLATE_EU_2026.md (EU Trade Secrets Directive compliant NDA)
- investor-outreach/DEFENSIVE.md (Competitive Moat Analysis — 12 advantages)
- DWS_SECURITY_STANDARD.md (v1.0 — Enterprise Security Framework)
- Admin/SECURITY_COMPLIANCE.md (External-facing compliance documentation)
- V1_LWM.md (Lifetime World Model — NVIDIA Inception submission)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [IP Asset Inventory](#2-ip-asset-inventory)
3. [Tier 1: Public & Marketing (No NDA Required)](#3-tier-1-public--marketing-no-nda-required)
4. [Tier 2: NDA-Protected (Before Technical Deep-Dive)](#4-tier-2-nda-protected-before-technical-deep-dive)
5. [Tier 3A: Patent Protection](#5-tier-3a-patent-protection)
6. [Tier 3B: Trade Secret Protection](#6-tier-3b-trade-secret-protection)
7. [Classification Matrix](#7-classification-matrix)
8. [Disclosure Workflow](#8-disclosure-workflow)
9. [Patent Strategy & Timeline](#9-patent-strategy--timeline)
10. [Trade Secret Management](#10-trade-secret-management)
11. [Legal Framework & Jurisdiction](#11-legal-framework--jurisdiction)
12. [Implementation Checklist](#12-implementation-checklist)

---

## 1. Executive Summary

Lifetime Oy:n DWS IQ 6 -alustan ja Lifetime World Model (LWM) -teknologian immateriaalioikeudet (IPR) suojataan kolmitasoisella strategialla:

| Taso        | Suojamekanismi                | Kohde                                                  | Lain perusta                           |
| ----------- | ----------------------------- | ------------------------------------------------------ | -------------------------------------- |
| **Tier 1**  | Vapaa jakelu                  | Teaser, FCD-konsepti, markkinointimateriaali           | —                                      |
| **Tier 2**  | NDA ennen teknistä syvennystä | LWM-arkkitehtuuri, tietograafin rakenne, BYOC-logiikka | EU Trade Secrets Directive 2016/943    |
| **Tier 3A** | Patentti                      | Kausaalinen päättelylogiikka, CIDM-menetelmä           | PRH (FI), EPO, PCT                     |
| **Tier 3B** | Trade secret                  | Tietograafin 10 000+ solmua, painotukset, rakenne      | EU 2016/943, Finnish Trade Secrets Act |

**Key principle:** Share the _what_ freely, protect the _how_ with NDA, and lock the _core method_ with patents and trade secrets.

---

## 2. IP Asset Inventory

### 2.1 Core Technology Assets

| Asset                                          | Type                 | Current Status | Protection Level  |
| ---------------------------------------------- | -------------------- | -------------- | ----------------- |
| **Lifetime World Model (LWM)**                 | Software + method    | In development | Tier 2 + 3B       |
| **CIDM (Climate-Intelligent Decision Making)** | Method/algorithm     | Patent pending | Tier 3A           |
| **Knowledge Graph** (10,000+ nodes)            | Database + structure | Production     | Tier 3B           |
| **Causal Reasoning Engine**                    | Algorithm            | In development | Tier 3A candidate |
| **BYOC (Bring Your Own Cloud) Logic**          | Architecture         | In development | Tier 2            |
| **FCD Concept**                                | Business model       | Published      | Tier 1            |
| **Firehorse Suite**                            | Software product     | Production     | Tier 2            |
| **MCP Agent Orchestration**                    | Architecture         | Production     | Tier 2 + 3B       |
| **Regulatory Risk Calculation**                | Method               | In development | Tier 3A candidate |
| **Fit for 55 Compliance Engine**               | Software + rules     | Production     | Tier 2            |

### 2.2 Non-Technical IP Assets

| Asset                       | Type          | Protection           |
| --------------------------- | ------------- | -------------------- |
| DWS IQ 6 (name)             | Trademark     | Registration pending |
| Firehorse (name)            | Trademark     | Registration pending |
| Lifetime World Model (name) | Trademark     | Registration pending |
| Customer data & references  | Confidential  | NDA + GDPR           |
| Pricing models              | Business info | NDA                  |
| Partner agreements          | Commercial    | NDA                  |

---

## 3. Tier 1: Public & Marketing (No NDA Required)

### What Can Be Shared Freely

These assets are marketing materials designed for wide distribution:

- **Product teaser / one-pager** — High-level description of DWS IQ 6 platform
- **FCD concept overview** — Business model concept (without implementation details)
- **Problem statement** — EU Fit for 55, CSRD, CBAM compliance challenges
- **Market sizing** — €200B+ Nordic construction market, 50,000+ CSRD-affected companies
- **High-level architecture diagram** — "Brain-Memory-Body-Hands" ecosystem (without internal component details)
- **Customer value proposition** — What the platform does, not how it does it
- **Regulatory context** — Public EU regulation summaries
- **Published articles and blog posts** — On dws6.com, dws10.com

### What NOT to Include in Tier 1

Never include in public materials:

- Algorithm details or pseudocode
- Knowledge graph structure or node taxonomy
- Internal API specifications
- Database schemas
- Model training data or methodology
- BYOC deployment architecture
- Agent orchestration logic
- Specific performance benchmarks with methodology

### Tier 1 Examples

**OK to share:**

> "DWS IQ 6 uses AI to automate climate compliance reporting for EU-regulated industries, reducing reporting time by 90%."

**NOT OK to share:**

> "The LWM uses a causal reasoning graph with 10,000+ regulatory nodes weighted by temporal decay functions to predict compliance risk."

---

## 4. Tier 2: NDA-Protected (Before Technical Deep-Dive)

### NDA Gate Rule

**Before disclosing ANY of the following, the receiving party MUST sign the Lifetime Oy NDA** (`Partners/NDA_TEMPLATE_EU_2026.md`):

### Protected Assets (Tier 2)

| Category                      | Specific Assets                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **LWM Architecture**          | Component diagram, data flow, processing pipeline, temporal latent space design |
| **Knowledge Graph Structure** | Node taxonomy, edge types, relationship model, ontology schema                  |
| **BYOC Logic**                | Cloud deployment model, tenant isolation, data residency enforcement            |
| **Agent Orchestration**       | MCP server configuration, agent coordination protocols, tool routing            |
| **Integration Architecture**  | ERP connectors (SAP, IFS, Dynamics), ESG platform integrations                  |
| **Compliance Engine**         | Regulatory rule encoding, audit trail generation, validation logic              |
| **Firehorse Internals**       | Omnichannel automation logic, report generation engine, CMS architecture        |
| **Performance Data**          | Benchmarks, latency measurements, throughput metrics (with methodology)         |
| **Roadmap Details**           | Specific feature timelines, technology choices, partnership plans               |

### NDA Process

1. **Initial contact** → Share Tier 1 materials only
2. **Interest confirmed** → Send NDA (`NDA_TEMPLATE_EU_2026.md`)
3. **NDA signed** → Unlock Tier 2 materials, schedule technical deep-dive
4. **Technical session** → Disclose architecture, demos with NDA-covered screen sharing
5. **Follow-up** → All technical documents watermarked with recipient name + date

### NDA Configuration

For different partner types, configure the NDA contractual penalty (Article 7.4):

| Partner Type         | Penalty (EUR)   | NDA Term |
| -------------------- | --------------- | -------- |
| Standard partner     | 50,000–100,000  | 5 years  |
| Certified partner    | 100,000–250,000 | 5 years  |
| Strategic / investor | 250,000–500,000 | 5 years  |
| Technology vendor    | 100,000–250,000 | 5 years  |

### Watermarking

All Tier 2 documents shared externally must include:

- Recipient company name in header/footer
- Date of disclosure
- NDA reference number (`NDA-LT-[YEAR]-[NUMBER]`)
- "CONFIDENTIAL — [RECIPIENT NAME]" watermark

---

## 5. Tier 3A: Patent Protection

### Patentable Innovations

The following methods are candidates for patent protection:

#### 5.1 CIDM — Climate-Intelligent Decision Making (PRIORITY 1)

**Status:** Patent pending
**Novelty:** Multi-agent AI orchestration for regulatory compliance decision-making across 25+ EU industries simultaneously.

**Key claims (to be refined with patent attorney):**

1. Method for automated climate regulatory compliance using multi-agent coordination
2. System for real-time regulatory risk scoring across multiple jurisdictions
3. Method for integrating edge computing with cloud-based compliance verification

#### 5.2 Causal Reasoning for Regulatory Risk (PRIORITY 2)

**Novelty:** Using causal inference (not just correlation) to calculate regulatory risk scores for construction projects under Fit for 55, CSRD, and CBAM.

**Key claims (candidates):**

1. Method for causal regulatory risk calculation using directed acyclic graphs (DAGs) applied to EU climate regulations
2. System for predicting compliance violations before they occur using temporal causal models
3. Method for automated scenario analysis (10,000+ scenarios) for carbon optimization under regulatory constraints

#### 5.3 LWM Temporal Latent Space (PRIORITY 3)

**Novelty:** Persistent temporal latent space for construction project lifecycle modeling that solves the 51% spatial-temporal data loss problem.

**Key claims (candidates):**

1. Method for maintaining persistent world state across construction project lifecycle using temporal embeddings
2. System for sensor fusion at microsecond resolution with edge-to-cloud synchronization
3. Method for "dreaming through occlusion" — inferring hidden site state from partial observations

### Patent Filing Strategy

| Step | Action                                         | Timeline                               | Cost Estimate              |
| ---- | ---------------------------------------------- | -------------------------------------- | -------------------------- |
| 1    | **Prior art search**                           | Immediately                            | €3,000–5,000               |
| 2    | **Finnish national filing (PRH)**              | Before any public disclosure of method | €5,000–8,000               |
| 3    | **Priority year**                              | 12 months from Finnish filing          | —                          |
| 4    | **PCT international application**              | Within 12 months of Finnish filing     | €8,000–12,000              |
| 5    | **National phase entry** (EU, US, key markets) | 30 months from priority date           | €15,000–30,000 per country |
| 6    | **Patent prosecution**                         | 2–4 years                              | €10,000–20,000             |

**Total estimated cost (3 patents, EU + US):** €120,000–200,000

### Critical Rule: No Public Disclosure Before Filing

**A patent application MUST be filed BEFORE any public disclosure of the method.**

This means:

- No conference presentations describing the algorithm
- No blog posts explaining the method
- No open-source code implementing the patentable method
- No investor deck slides with algorithm details (unless under NDA)
- No academic papers (unless filed first)

**Exception:** Disclosures under NDA (Tier 2) do NOT count as public disclosure and do not destroy patentability.

### Patent Attorney Recommendation

Finnish patent attorney firms with AI/software expertise:

- **Kolster Oy Ab** (Helsinki) — Finland's largest IP firm
- **Berggren Oy** (Helsinki) — Strong in software patents
- **Papula-Nevinpat Oy** (Helsinki) — Technology focus

**Budget for initial consultation:** €2,000–5,000

---

## 6. Tier 3B: Trade Secret Protection

### What Qualifies as Trade Secret

Under EU Directive 2016/943, Article 2, information qualifies as a trade secret when:

1. **It is secret** — not generally known among persons in the relevant field
2. **It has commercial value** because it is secret
3. **Reasonable steps** have been taken to keep it secret

### DWS Trade Secrets Inventory

| Trade Secret                                                     | Why It's Valuable                                                             | Protection Measures                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------- |
| **Knowledge graph structure** (10,000+ nodes, taxonomy, weights) | Encodes years of regulatory expertise; competitor cannot know what to copy    | Access control, encryption, NDA         |
| **Node relationship model**                                      | Defines how regulations, industries, and compliance requirements interconnect | Source code access restricted           |
| **Temporal decay functions**                                     | Determines how regulatory risk changes over time                              | Not in public documentation             |
| **Training data curation**                                       | Specific dataset selection for LWM fine-tuning                                | Stored in separate encrypted repository |
| **Compliance rule encoding**                                     | How EU regulations are translated into machine-executable rules               | Access-controlled codebase              |
| **Agent coordination protocols**                                 | Specific MCP server orchestration patterns                                    | Internal documentation only             |
| **Customer-specific adaptations**                                | How the platform is customized per industry/customer                          | Per-customer NDA                        |
| **Performance optimization techniques**                          | Edge AI model quantization, inference optimization                            | Internal technical docs                 |

### Why Trade Secret > Patent (for Knowledge Graph)

| Factor                     | Patent                                    | Trade Secret                        |
| -------------------------- | ----------------------------------------- | ----------------------------------- |
| **Duration**               | 20 years (then public)                    | Indefinite (as long as secret)      |
| **Disclosure requirement** | Must publish full method                  | No disclosure required              |
| **Competitor awareness**   | Competitor knows exactly what's protected | Competitor cannot know what to copy |
| **Cost**                   | €120k–200k for 3 patents                  | Administrative cost only            |
| **Enforcement**            | Must prove infringement                   | Must prove misappropriation         |
| **Risk**                   | Method published even if patent rejected  | No publication risk                 |

**For the knowledge graph, trade secret is the stronger protection** because:

- The graph's value is in its specific structure — 10,000+ nodes and their precise relationships
- A competitor would need to replicate years of regulatory analysis to build an equivalent
- Publishing the structure (as required for a patent) would destroy the advantage
- The graph evolves continuously — a patent would freeze a single version

### Trade Secret Documentation Requirements

To maintain trade secret status under EU 2016/943, the following must be documented:

#### 6.1 Internal Classification Record

Every trade secret must have a written record containing:

- Description of the information
- Why it is confidential
- Date it was created/identified as trade secret
- Who has access
- What protection measures are in place

#### 6.2 Access Control

| Measure                   | Implementation                                      |
| ------------------------- | --------------------------------------------------- |
| **Need-to-know basis**    | Only team members working directly on the component |
| **Access logs**           | Git commit history, Supabase RLS, cloud IAM         |
| **Encryption at rest**    | Supabase encryption, GCP KMS                        |
| **Encryption in transit** | TLS 1.3 for all connections                         |
| **Employee agreements**   | Employment contracts with confidentiality clauses   |
| **Contractor agreements** | NDA before any code access                          |
| **Physical security**     | Secure development environments                     |

#### 6.3 Marking

All trade secret materials must be marked:

- Source code: `// TRADE SECRET — Lifetime Oy — Do not distribute`
- Documents: `CONFIDENTIAL — TRADE SECRET — Lifetime Oy`
- Databases: Access-controlled with audit logging

---

## 7. Classification Matrix

| Information                       | Tier | Can share without NDA? | Can patent?                 | Trade secret?     |
| --------------------------------- | ---- | ---------------------- | --------------------------- | ----------------- |
| Product teaser / one-pager        | 1    | Yes                    | —                           | —                 |
| FCD concept overview              | 1    | Yes                    | —                           | —                 |
| Market sizing & problem statement | 1    | Yes                    | —                           | —                 |
| LWM architecture diagram          | 2    | No (NDA required)      | Possibly                    | Yes               |
| BYOC deployment model             | 2    | No (NDA required)      | No                          | Yes               |
| Knowledge graph structure         | 3B   | No (NDA required)      | No (trade secret preferred) | **Yes**           |
| Knowledge graph node taxonomy     | 3B   | No (NDA required)      | No                          | **Yes**           |
| CIDM method                       | 3A   | No (NDA required)      | **Yes (priority)**          | Partial           |
| Causal reasoning algorithm        | 3A   | No (NDA required)      | **Yes (candidate)**         | Until filed       |
| Temporal latent space method      | 3A   | No (NDA required)      | **Yes (candidate)**         | Until filed       |
| Customer data                     | —    | No (GDPR + NDA)        | No                          | Yes               |
| Pricing models                    | 2    | No (NDA required)      | No                          | Yes               |
| Source code (general)             | 2    | No                     | No                          | Yes               |
| Source code (patentable methods)  | 3A   | No                     | Included in patent          | Yes (until filed) |

---

## 8. Disclosure Workflow

### 8.1 Partner / Investor Engagement Flow

```
INITIAL CONTACT
    │
    ▼
[Share Tier 1 materials]
    │  Teaser, FCD concept, market sizing
    │
    ▼
INTEREST CONFIRMED?
    │
    ├── No → End / follow-up later
    │
    ▼ Yes
[Send NDA for signature]
    │  Partners/NDA_TEMPLATE_EU_2026.md
    │  Configure penalty level per partner type
    │
    ▼
NDA SIGNED?
    │
    ├── No → Negotiate terms / End
    │
    ▼ Yes
[Unlock Tier 2 materials]
    │  LWM architecture, BYOC logic, demos
    │  All documents watermarked
    │
    ▼
DEEPER ENGAGEMENT?
    │
    ├── No → Standard partnership
    │
    ▼ Yes (strategic partner / investor / acquirer)
[Controlled Tier 3 disclosure]
    │  Patent-protected methods: disclose with patent number
    │  Trade secrets: disclose ONLY specific elements needed
    │  Never disclose full knowledge graph structure
    │
    ▼
ONGOING RELATIONSHIP
    │  Annual NDA review
    │  Access audit quarterly
```

### 8.2 Conference / Public Speaking Rules

| Allowed                               | Not Allowed                              |
| ------------------------------------- | ---------------------------------------- |
| Problem statement (EU compliance gap) | Algorithm details                        |
| High-level solution overview          | Knowledge graph structure                |
| Customer impact metrics (anonymized)  | Specific benchmarks with methodology     |
| "We use AI for compliance"            | "We use causal DAGs with temporal decay" |
| Architecture at box-level             | Internal component interactions          |
| NVIDIA partnership mention            | Edge AI model architecture               |

---

## 9. Patent Strategy & Timeline

### 9.1 Filing Priority

| Priority | Innovation                           | File By                               | Status                  |
| -------- | ------------------------------------ | ------------------------------------- | ----------------------- |
| **P1**   | CIDM method                          | **ASAP — before next investor pitch** | Patent pending          |
| **P2**   | Causal reasoning for regulatory risk | Q2 2026                               | Prior art search needed |
| **P3**   | LWM temporal latent space            | Q3 2026                               | Concept development     |

### 9.2 Filing Path

```
FINNISH NATIONAL (PRH)          INTERNATIONAL (PCT)
    │                               │
    ▼                               ▼
File at PRH Helsinki           File PCT within 12 months
    │                               │
    ▼                               ▼
Priority date established      International search report
    │                               │
    ▼                               ▼
12 months to decide            30 months: national phase entry
international filing               │
                                    ▼
                               EPO (Europe), USPTO (US),
                               JPO (Japan) — as needed
```

### 9.3 PRH (Patentti- ja rekisterihallitus) Process

| Step                | Timeline        | Action                                              |
| ------------------- | --------------- | --------------------------------------------------- |
| 1. Prior art search | 2–4 weeks       | Search existing patents in CIDM/regulatory AI space |
| 2. Draft claims     | 4–6 weeks       | Work with patent attorney to define claims          |
| 3. File at PRH      | 1 week          | Submit Finnish national application                 |
| 4. Priority date    | Day of filing   | 12-month priority period begins                     |
| 5. PCT filing       | Before month 12 | International patent application                    |
| 6. National phase   | Month 30        | Enter specific countries (EPO, USPTO)               |
| 7. Grant            | 2–4 years       | Patent prosecution and examination                  |

### 9.4 Budget Allocation

| Item                         | Year 1      | Year 2      | Year 3      |
| ---------------------------- | ----------- | ----------- | ----------- |
| Prior art searches (3×)      | €12,000     | —           | —           |
| Finnish filings (3×)         | €20,000     | —           | —           |
| PCT filings (3×)             | €30,000     | —           | —           |
| National phase (EU + US, 3×) | —           | €60,000     | €30,000     |
| Patent attorney (ongoing)    | €15,000     | €20,000     | €15,000     |
| **Total**                    | **€77,000** | **€80,000** | **€45,000** |

---

## 10. Trade Secret Management

### 10.1 Internal Classification Register

Maintain a register at `Admin/TRADE_SECRET_REGISTER.md` (to be created) with:

```
| ID | Description | Created | Owner | Access List | Protection Measures | Last Reviewed |
|----|-------------|---------|-------|-------------|-------------------|---------------|
| TS-001 | Knowledge graph node taxonomy | 2025-06-15 | CTO | [names] | Git ACL, encryption | 2026-02-19 |
| TS-002 | Temporal decay weight functions | 2025-09-01 | CTO | [names] | Source code only | 2026-02-19 |
| ...  | ... | ... | ... | ... | ... | ... |
```

### 10.2 Quarterly Review Process

Every quarter:

1. Review trade secret register for completeness
2. Verify access controls are current (remove departed employees)
3. Check that all trade secrets are still marked appropriately in code
4. Audit NDA compliance for external parties with access
5. Document any new trade secrets identified

### 10.3 Employee Onboarding / Offboarding

**Onboarding:**

- Sign employment contract with confidentiality clause
- Sign specific trade secret acknowledgment
- Access granted on need-to-know basis only
- Training on IPR classification tiers

**Offboarding:**

- Revoke all system access immediately
- Remind of ongoing confidentiality obligations
- Confirm return/deletion of all confidential materials
- Document in trade secret register

### 10.4 Code Repository Practices

```python
# ============================================================
# TRADE SECRET — Lifetime Oy
# This code implements proprietary knowledge graph weighting.
# Do not distribute outside Lifetime Oy without written
# authorization from CEO.
# Classification: Tier 3B — Trade Secret
# EU Directive 2016/943 protection applies.
# ============================================================
```

All files containing trade secrets must include this header. Git pre-commit hooks should verify the presence of classification markers on sensitive files.

---

## 11. Legal Framework & Jurisdiction

### 11.1 Applicable Law

| Law                                                         | Scope                | Key Protection                                                                     |
| ----------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| **EU Trade Secrets Directive 2016/943**                     | All EU member states | Trade secret definition, remedies, protection measures                             |
| **Finnish Trade Secrets Act (liikesalaisuuslaki 595/2018)** | Finland              | National implementation of EU Directive                                            |
| **Finnish Patent Act (patenttilaki 550/1967)**              | Finland              | National patent protection                                                         |
| **European Patent Convention (EPC)**                        | 39 countries         | Regional patent protection via EPO                                                 |
| **Patent Cooperation Treaty (PCT)**                         | 157 countries        | International patent filing                                                        |
| **GDPR (EU 2016/679)**                                      | EU/EEA               | Personal data protection (overlaps with some trade secrets)                        |
| **Finnish Copyright Act (tekijänoikeuslaki 404/1961)**      | Finland              | Software copyright (automatic, no registration needed)                             |
| **EU AI Act (2024/1689)**                                   | EU                   | AI system documentation requirements (may conflict with trade secrets — see §11.3) |

### 11.2 Copyright (Automatic Protection)

Software source code is automatically protected by copyright under Finnish law:

- **Duration:** 70 years from author's death
- **Registration:** Not required (automatic)
- **Scope:** Protects expression, not ideas/methods
- **Limitation:** Does not protect algorithms or concepts — only the specific code

### 11.3 EU AI Act vs. Trade Secrets

The EU AI Act (Annex III enforcement: 2 Dec 2027 per Omnibus provisional agreement 7 May 2026; was August 2, 2026) requires transparency for high-risk AI systems, which may conflict with trade secret protection:

**Potential conflict areas:**

- Article 13: Transparency requirements for high-risk AI
- Article 12: Automatic logging requirements
- Article 71: Market surveillance access

**Mitigation:**

- Document the _reasoning lineage_ (required by AI Act) without exposing the _specific implementation_
- Use "Reasoning Lineage Documentation" pattern from `DWS_SECURITY_STANDARD.md`
- Cooperate with authorities under confidentiality protections (Article 78 of AI Act allows trade secret protection during supervision)

### 11.4 Dispute Resolution

Per NDA template (`Partners/NDA_TEMPLATE_EU_2026.md`):

- **Governing law:** Finland
- **Arbitration:** Helsinki, Finland Chamber of Commerce
- **Interim relief:** Available from any competent court
- **Contractual penalties:** EUR 50,000–500,000 depending on partner tier

---

## 12. Implementation Checklist

### Immediate Actions (Q1 2026)

- [ ] **Complete CIDM patent prior art search** — engage patent attorney
- [ ] **File CIDM patent at PRH** — before any non-NDA disclosure of method
- [ ] **Create Trade Secret Register** — `Admin/TRADE_SECRET_REGISTER.md`
- [ ] **Add trade secret headers** to all sensitive source code files
- [ ] **Audit current disclosures** — verify all external parties have signed NDA
- [ ] **Register trademarks** — DWS IQ 6, Firehorse, Lifetime World Model at PRH

### Q2 2026

- [ ] **Causal reasoning patent** — prior art search and filing
- [ ] **PCT filing for CIDM** — if not already filed
- [ ] **First quarterly trade secret review**
- [ ] **Employee trade secret training** — all team members

### Q3 2026

- [ ] **LWM temporal latent space patent** — evaluate and file if viable
- [ ] **EU AI Act preparation** — ensure Article 12/13 compliance without exposing trade secrets
- [ ] **NDA audit** — review all active NDAs, renew as needed

### Ongoing

- [ ] **Quarterly trade secret register review**
- [ ] **Annual NDA renewal review**
- [ ] **Patent prosecution monitoring**
- [ ] **New innovation assessment** — evaluate all new methods for patentability

---

## Summary: Three Tiers in Practice

```
┌─────────────────────────────────────────────────────────┐
│                     TIER 1: PUBLIC                       │
│  Teaser • FCD concept • Market sizing • Value prop      │
│  → Share freely with anyone                             │
├─────────────────────────────────────────────────────────┤
│                  TIER 2: NDA REQUIRED                    │
│  LWM architecture • Knowledge graph overview •          │
│  BYOC logic • Integration design • Firehorse internals  │
│  → Sign NDA first, watermark all documents              │
├─────────────────────────────────────────────────────────┤
│              TIER 3A: PATENT PROTECTED                   │
│  CIDM method • Causal reasoning algorithm •             │
│  Temporal latent space method                           │
│  → File patent BEFORE disclosure, even under NDA        │
├─────────────────────────────────────────────────────────┤
│              TIER 3B: TRADE SECRET                       │
│  Knowledge graph (10,000+ nodes) • Node weights •       │
│  Relationship model • Training data • Optimization      │
│  → Never publish, indefinite protection, competitor     │
│    cannot know what to copy                             │
└─────────────────────────────────────────────────────────┘
```

**Core principle:** Trade secret for things a competitor can't see (knowledge graph internals). Patent for things a competitor could independently discover (algorithmic methods). NDA for everything in between.

---

_This document is itself classified as CONFIDENTIAL — INTERNAL USE ONLY. Do not share outside Lifetime Oy without CEO approval._
