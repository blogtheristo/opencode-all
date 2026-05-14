# Field Note: Anthropic Skills Paradigm — "Stop Building Agents, Build Skills"

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/skills-based-agents-M2aG9 | Date: 16.04.2026 | Changes: Initial field note — Anthropic Skills paradigm, DWS6 gap analysis, Agent Foundry and marketing impact

Document Status:

- Created: 16.04.2026
- Last Modified: 16.04.2026
- Language: English
- Publication Status: ACTIVE
- Document Type: Field Note / Paradigm Analysis / Strategic Intelligence

Related Documents:

- docs/DWS_SKILLS_GUIDE.md — current skills inventory
- AGENTS.md §9 — How to Add a New Agent
- docs/lifetime-world-model/LEARNING_SOURCES.md — LWM ingestion index
- skills/ — discipline skills directory

---

**Date:** 2026-04-16
**Event:** AI Engineer Code Summit (2025)
**Author:** Risto Päärni / Lifetime Oy
**Source:** Barry Zhang & Mahesh Murag (Anthropic) — paraphrased via Finnish LinkedIn post
**Type:** Paradigm Analysis / Strategic Intelligence

---

## Ontology Tags

- **Geography:** Global > USA > San Francisco
- **Sector:** AI Infrastructure > Agent Development > Skill-Based Architecture
- **Entities:** Anthropic, Barry Zhang, Mahesh Murag, Claude Code, DWS IQ 6, Agent Foundry
- **Temporal Context:** 2025–2026, Post-GPT-4 agentic era, EU AI Act compliance context
- **Confidence:** Medium (Finnish LinkedIn paraphrase of original talk — primary source not directly verified; recommend verifying at ai.engineer before citing externally)

---

## Summary

Two Anthropic engineers presented a paradigm shift at AI Engineer Code Summit: **"Stop building agents. Build Skills."** In 16 minutes they argued the entire industry is solving the wrong problem. The insight: a generic agent loaded with domain expertise (packaged as Skills — folders of markdown files) outperforms dozens of specialized agents. DWS IQ 6 already has this architecture partially implemented. This note documents the paradigm, the gap, and the strategic impact.

---

## The Core Claim (3 Assertions)

### Assertion 1: Skills beat specialized agents

One generic agent + a Skills library outperforms a fleet of specialized agents. Skills are **folders with markdown files** that teach the model your workflow, your expertise, your domain knowledge. Fortune 100 companies and teams of 10,000+ developers are already deploying this pattern at scale.

### Assertion 2: Intelligence without expertise is entertainment

> "Who does your taxes? A genius with a 300-point IQ and no tax law knowledge, or an experienced accountant who has done this for 20 years?"

Intelligence (the model) is commoditized. Expertise (the domain knowledge packaged as Skills) is the differentiator.

### Assertion 3: Progressive disclosure eliminates context waste

The agent loads only the skill name and description first. When relevant, it loads `SKILL.md`. When more depth is needed, it navigates reference files. Zero context loss. This is the architecture that scales across thousands of use cases without prompt bloat.

---

## Technical Architecture: How Skills Work

```
skills/
└── <domain>/
    ├── SKILL.md          ← Loaded when relevant (expertise + workflow)
    └── references/       ← Loaded on demand (deep domain data)
```

**Discovery:** Agent sees skill name + one-line description in system context
**Activation:** When a query matches, full SKILL.md is loaded
**Depth:** Reference files accessed only when needed
**Result:** Zero context waste, full domain expertise available on demand

**Key difference from RAG:** Skills are structured expertise (workflow, constraints, decision trees), not raw document retrieval. A skill teaches the agent HOW to think about a domain, not just WHAT facts exist.

---

## DWS6 Current State vs. Anthropic Model (Pre-PR Baseline)

**Note:** The table below captures the repository state before the skills introduced in this PR. It is included as a baseline gap analysis, not as a claim about the post-change repository contents.

| Component               | Anthropic Model                     | DWS6 Current State                                                          | Gap                        |
| ----------------------- | ----------------------------------- | --------------------------------------------------------------------------- | -------------------------- |
| Slash commands          | `.claude/commands/*.md`             | 18 commands ✅                                                              | None — fully aligned       |
| Discipline gates        | `skills/*/SKILL.md`                 | 4 skills (design-first, dual-folder-sync, verification-gate, last30days) ✅ | None                       |
| Agent skills            | `skills/<agent>/SKILL.md` per agent | **0 agent SKILL.md files (pre-PR baseline)** ❌                            | 16+ agents missing Skills  |
| Progressive disclosure  | Name → SKILL.md → references        | Partial (commands have descriptions)                                        | No reference file layer    |
| Firehorse report skills | Skills per report type              | **0 report SKILL.md files (pre-PR baseline)** ❌                           | 4 report types need Skills |
| Marketing               | "Skills-powered" framing            | "GodAgents / agentic loops"                                                 | Positioning gap            |

**Conclusion:** This baseline shows that DWS6 had the infrastructure (skills/ directory, .claude/commands/) but had not yet broadly applied the pattern to its 16+ platform agents. This PR begins closing that execution gap by adding agent/report skills, while the broader architectural direction remains the same.

---

## Impact on Agent Foundry

### Current state

Agent Foundry deploys TypeScript `BaseAgent` classes via YAML configs (`AgentFoundry/configs/production/`). Each agent has runtime logic but **no packaged expertise** in Skills format. Adding a new agent requires: TypeScript class + routes + tests + AGENTS.md update.

### Required change: Skill-First Agent Contract

**Every new agent MUST include a `skills/<agent-name>/SKILL.md`** that packages:

1. What the agent knows (domain expertise, EU regulation references, industry standards)
2. When to invoke it (trigger phrases, use cases)
3. Input/output contract
4. Confidence and source citations

**Update required in:**

- `AGENTS.md §9` — "How to Add a New Agent" → add Skills requirement as mandatory step
- `docs/DWS_SKILLS_GUIDE.md` — add "Agent Skills" as a third skill category
- `.claude/hooks/session-start.sh` — inject auto-discovered skills index into session context

### Priority agent skills to create (pilot batch)

| Agent                  | Domain expertise to package                                           | EU standard references                         |
| ---------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| sitesense              | Construction safety scoring, weather risk, crane operation limits     | EN 13001, ISO 45001                            |
| compliance             | EU ETS/CBAM/CSRD/Fit for 55 scoring, ESRS data points, deadlines      | Reg. 2021/447, Reg. 2023/1773, EFRAG ESRS 2023 |
| material-oracle        | Embodied carbon EN 15978, lifecycle stages A1–D, ICE Database factors | EN 15978, ICE v3, EPD                          |
| schedule-genius        | Industrial scheduling, resource constraints, Gantt optimization       | —                                              |
| emissions-data-analyst | GHG inventory, Eurostat SBS, EEA data interpretation                  | EEA GHG Inventory 2024, IPCC 2006              |

---

## Impact on Marketing

### The positioning shift

The Anthropic talk validates a reframing that DWS should own in the EU industrial market:

**Before:** "18+ GodAgents with agentic observe-think-act loops"
**After:** "18+ Skillful Agents — 20 years of EU industrial expertise, packaged as Skills"

The analogy is perfect for enterprise buyers:

> "Your compliance team has 20 years of Fit for 55 expertise. DWS IQ Skillful Agents have that expertise packaged and ready to deploy — not a smart chatbot, an experienced specialist."

### Firehorse Skillful Reports

**Before:** "Firehorse Report — replace 200+ hours of manual report building"
**After:** "Firehorse Skillful Reports — Board Pack, Annual Report, Carbon Footprint, and Compliance Summary generated by agents that carry certified EU reporting expertise"

Each report type becomes a Skill: `firehorse-report-board-pack`, `firehorse-report-annual`, etc. The agent loads the reporting skill, applies EU disclosure standards (ESRS, GRI), and produces audit-ready output.

### Products to update

1. `dws10.com/config/products.json` — FH-RPT-001 description → "Skillful Reports"
2. `landing-pages/dws10-com/products/aegis.html` — "Skillful Agents" framing
3. `DWS_BRAND_STANDARD.md` — add Skillful Agents as positioning pillar

---

## Lifetime World Model: Learning from This Paradigm

The LWM should ingest this paradigm as a first-class update:

1. **Skills = expertise packaging** — the LWM's own knowledge structure IS a skill library
2. **Progressive disclosure** — LWM should surface knowledge in layers, not as monolithic context dumps
3. **Data streams to integrate** — see `docs/lifetime-world-model/LEARNING_SOURCES.md`

---

## Recommendation

**Ship the pilot batch:** Create `skills/sitesense/SKILL.md`, `skills/compliance/SKILL.md`, `skills/material-oracle/SKILL.md` and the 4 Firehorse report skills first. This proves the pattern with DWS's highest-value agents and generates concrete marketing material.

**Update the agent contract** in AGENTS.md §9 so all future agents include a SKILL.md by default — zero extra effort per agent once the template exists.

**Reframe marketing** around "Skillful Agents" in the next product copy update. The Anthropic talk is public validation that this architecture is the industry direction.

---

## Document Status

**Document Status:** ✅ ACTIVE — Initial capture complete
**Seuraava katselmus:** 2026-05-01
**Omistaja:** Risto Päärni / Lifetime Oy — Agent Foundry & Marketing impact

---

_Field note capturing the Anthropic "Stop building agents, build Skills" paradigm shift from AI Engineer Code Summit. Analyzes DWS6 current state, identifies the 16-agent Skills gap, and recommends the pilot batch and marketing reframing._
