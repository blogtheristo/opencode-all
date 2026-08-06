# Lifetime World Model — Learning Sources Index

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Copilot CLI | Session: claude/add-nemotron-docs-MPKhc | Date: 31.07.2026 | Changes: Merged main into PR 1367 branch; resolved conflict in Sessions and Modifications and Stream 3 sections; added missing Languages Available field per Document Standard.
- Version: 1.1 | Tool: Claude Code | Session: claude/european-datasets-lab-note-8mlg9u | Date: 06.07.2026 | Changes: Updated latest-lab-note pointer to 2026-07-06 INSPIRE / European Data Portal note
- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/add-nemotron-docs-MPKhc | Date: 20.05.2026 | Changes: Added "Recent additions" subsection to Stream 3 (Lab Notes) listing `2026-05-20-nemotron-labs-diffusion-lwm-control-room.md` (NVIDIA Nemotron-Labs-Diffusion evaluation for LWM / Control Room / Situation Room).
- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/skills-based-agents-M2aG9 | Date: 16.04.2026 | Changes: Initial LWM learning sources index — all data streams, update cadence, ingestion priority

Document Status:

- Created: 16.04.2026
- Last Modified: 31.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Architecture / Knowledge Management

Related Documents:

- docs/field-notes/README.md — field note format and ontology
- docs/lab-notes/README.md — lab note format
- AGENTS.md §4 — Memory layer (Lifetime World Model)
- skills/ — agent and report skill library

---

## Purpose

This file is the **canonical index of all data streams** that feed the Lifetime World Model (LWM). The LWM ingests these sources to maintain current, citable knowledge across EU regulations, industry intelligence, and DWS IQ platform expertise.

**Architecture position:** Memory layer in Brain-Memory-Body-Hands. The LWM is NOT a fine-tuned model — it is a structured knowledge system indexed across 15,000+ EU regulatory documents and 16 industry verticals, updated by the streams below.

---

## Stream 1: Standards (Normative)

**Purpose:** The regulatory and brand foundation — what DWS must comply with and how it must behave.

| File                                        | Type                | Update trigger                          |
| ------------------------------------------- | ------------------- | --------------------------------------- |
| `DWS_BRAND_STANDARD.md`                     | Brand               | New product, visual change              |
| `DWS_SECURITY_STANDARD.md`                  | Security            | Incident, new threat, regulation change |
| `DWS_DOCUMENT_STANDARD.md`                  | Document format     | New document type                       |
| `DWS_DATA_STANDARD.md`                      | Data governance     | Schema change, regulation update        |
| `DWS_MARKET_RESEARCH_STANDARD.md`           | Competitive intel   | New competitor, market shift            |
| `SITE_QUALITY_STANDARDS.md`                 | Code quality        | Tooling change                          |
| `Admin/SECURITY_COMPLIANCE.md`              | Compliance controls | Certification, audit, incident          |
| `docs/DWS_SKILLS_GUIDE.md`                  | Skills catalog      | New skill, agent, or workflow           |
| `docs/DWS_INFORMATION_LAYERING_STRATEGY.md` | Architecture        | Harness update, new layer               |

**Ingestion priority:** HIGH — these define ground truth.

---

## Stream 2: Field Notes (Strategic Intelligence)

**Path:** `docs/field-notes/*.md`
**Format:** DWS Document Standard with ontology tags (Geography, Sector, Entities, Confidence)
**Naming:** `YYYY-MM-DD-[topic].md`

**What LWM learns:**

- Customer intelligence (what buyers actually say, what problems they can't solve)
- Regulatory changes (new EU directives, enforcement actions, deadline shifts)
- Competitive signals (competitor moves, pricing, product gaps)
- Production incidents (what broke, root cause, prevention)
- Industry events (conferences, standards body meetings, government announcements)

**Update cadence:** Within 24h of event. Daily ingestion.

**Current count:** 20+ field notes (as of 2026-04-16)

---

## Stream 3: Lab Notes (Technical Research)

**Path:** `docs/lab-notes/*.md`
**Format:** Same as field notes — DWS Document Standard with ontology tags
**Naming:** `YYYY-MM-DD-[topic].md`

**What LWM learns:**

- Technology paradigm shifts (e.g. Anthropic "Stop building agents, build Skills" — 2026-04-16)
- Architecture experiments and findings
- LLM benchmark evaluations for industrial use cases
- EU regulatory technical analysis (ESRS gap analysis, CBAM CN code updates)
- Tool and framework evaluations (new MCP servers, agent frameworks, EU data tools)

**Update cadence:** After research is complete. Weekly ingestion target.

**First lab note:** `docs/lab-notes/` created 2026-04-16.

**Latest lab note:** `docs/lab-notes/2026-07-06-inspire-european-data-portal-geospatial.md` — INSPIRE geospatial datasets consolidated into data.europa.eu (1 July 2026), portal dataset versioning, and eDelivery cross-border exchange, mapped to DWS ingestion and sovereignty threads.

**Recent additions:**

- `2026-05-20-nemotron-labs-diffusion-lwm-control-room.md` — NVIDIA Nemotron-Labs-Diffusion (3B–14B, incl. VL) evaluated against the LWM and the Control / Situation Room surfaces; V1.x / V2 candidate decoder. Source: https://nvda.ws/4tEnTxP

---

## Stream 4: Four Outreach Channels (Sales & Market Intelligence)

**Path:** `Firehorse/Omnichannel/`

### Channel 4a: Customers

**Path:** `Firehorse/Omnichannel/Customers/`
**What LWM learns:** Referral patterns, pilot feedback, conversion objections, retention drivers.

### Channel 4b: Investors

**Path:** `Firehorse/Omnichannel/Investors/`
**What LWM learns:** Investment thesis alignment, valuation benchmarks, due diligence questions, competitor comparisons.

### Channel 4c: Partners

**Path:** `Firehorse/Omnichannel/Partners/`
**What LWM learns:** Integration requirements, co-sell patterns, partner qualification criteria.

### Channel 4d: Social

**Path:** `Firehorse/Omnichannel/` (LinkedIn, Twitter/X content)
**What LWM learns:** Message resonance, audience response, thought leadership topics that generate engagement.

**Update cadence:** Weekly Firehorse outreach reports → LWM ingestion.

---

## Stream 5: Agent Skills (Packaged Expertise)

**Path:** `skills/*/SKILL.md`
**Purpose:** Skills ARE the LWM's operational knowledge layer — structured expertise that agents load on demand.

| Skill                         | Domain                   | Expert source                                 |
| ----------------------------- | ------------------------ | --------------------------------------------- |
| `sitesense`                   | Construction safety      | EN 13001, ISO 45001, VNa 205/2009             |
| `compliance`                  | EU ETS/CBAM/CSRD         | Reg. 2021/447, Reg. 2023/956, EFRAG ESRS 2023 |
| `material-oracle`             | Embodied carbon EN 15978 | ICE Database v3, EC3 EPDs                     |
| `firehorse-report-board-pack` | Board climate reporting  | ESRS 2, TCFD, GRI 305                         |
| `firehorse-report-annual`     | CSRD annual report       | EFRAG ESRS 2023, CSRD Art. 19a                |
| `firehorse-report-carbon`     | Carbon footprint         | EN 15978, EPBD 2024/1275                      |
| `firehorse-report-compliance` | Multi-reg compliance     | ETS, CBAM, CSRD, EU AI Act                    |
| `risto`                       | Founder advisory         | 35+ years industrial IT + 160 skills          |
| `design-first`                | Architecture gate        | DWS process standard                          |
| `dual-folder-sync`            | Deployment discipline    | DWS deployment standard                       |
| `verification-gate`           | Quality gate             | DWS verification standard                     |

**Update cadence:** When a new agent is deployed or a skill is updated.

---

## Stream 6: Harness Hooks (Process Intelligence)

**Path:** `.claude/hooks/*.sh`
**What LWM learns:** How the DWS development process works — trust zones, safety gates, SQL rules, secret patterns, skills discovery.

| Hook                  | Process encoded                                              |
| --------------------- | ------------------------------------------------------------ |
| `session-start.sh`    | Trust boundary, MCP health, skills index                     |
| `pretooluse-guard.sh` | Forbidden commands (rm, force push, hard reset)              |
| `secret-scan.sh`      | 14 OWASP secret patterns                                     |
| `sql-safety-guard.sh` | RLS enforcement, transaction wrapping                        |
| `protect-files.sh`    | Protected files (.env, .key, thesis, migrations)             |
| `session-stop.sh`     | Governance checklist (dual-folder sync, uncommitted changes) |

**Update cadence:** When process rules change. LWM reads these to understand operational constraints.

---

## Ingestion Priority Matrix

| Stream            | Priority | Frequency | Volume                   |
| ----------------- | -------- | --------- | ------------------------ |
| Standards         | HIGH     | On change | Low (10 files)           |
| Field Notes       | HIGH     | Daily     | Medium (20+ growing)     |
| Lab Notes         | MEDIUM   | Weekly    | Low (growing)            |
| Outreach Channels | MEDIUM   | Weekly    | Medium                   |
| Agent Skills      | HIGH     | On deploy | Low (11 skills, growing) |
| Harness Hooks     | LOW      | On change | Low (10 hooks)           |

---

## LWM Update Protocol

When adding a new learning source:

1. Add entry to the correct stream section above
2. Specify: path, what LWM learns, update cadence
3. If it's a new stream type, add a Stream N section
4. Update the Ingestion Priority Matrix

When creating a field note or lab note:

- Follow naming convention `YYYY-MM-DD-[topic].md`
- Include DWS Document Standard VERSION AND AGENT HISTORY block
- Include Ontology Tags (Geography, Sector, Entities, Confidence)
- The note becomes immediately available to LWM after commit

---

## Document Status

**Document Status:** ✅ ACTIVE — Initial index complete
**Seuraava katselmus:** 2026-05-01
**Omistaja:** Risto Päärni / Lifetime Oy — Memory layer architecture

---

_Canonical index of all data streams feeding the Lifetime World Model. Covers 6 stream types: Standards, Field Notes, Lab Notes, 4 Outreach Channels, Agent Skills, and Harness Hooks._
