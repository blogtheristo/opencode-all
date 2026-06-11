# AI Services Audit — Anthropic / Blackstone / H&F Firm Impact

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (claude-opus-4-7) | Session: claude/ai-services-audit-eY3rW | Date: 2026-05-27 | Changes: Initial AI services portfolio audit triggered by Anthropic-backed services firm acquiring Fractional AI; proposes SKU retirements, copy repositioning, and outcome-priced wedge.

Session Links & References:
  - Companion field note: docs/field-notes/2026-05-27-anthropic-blackstone-hf-services-firm-fractional-ai.md

Document Status:
  - Created: 2026-05-27
  - Last Modified: 2026-05-27
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE — proposals pending HIL approval

***

**Scope:** AI-services-shaped SKUs in `dws10.com/config/products.json` and adjacent platform offers.
**Trigger:** 2026-05-21 acquisition signal (see companion field note).
**Confidence:** High on classification and overlap; Medium on competitor pricing (undisclosed).

## 1. Current AI Services Portfolio (May 2026)

### 1.1 AI-services-shaped SKUs (today)

| SKU | Name | Price | Cadence | Overlap with new firm |
|---|---|---:|---|---|
| `aws-consultancy` | AI Engineering & Cloud Solutions Consultancy | €3,750 | one-time | High — generic |
| `conversational-agent` | Conversational Agent Solution | €3,500 | one-time | High — generic |
| `m365-consultancy` | Microsoft 365 Agent Consultancy | €1,200 | one-time | Medium — MS-specific |
| `ai-agent-engineering` | AI & Agent Engineering | €200 | hourly | High — generic T&M |
| `lean-project` | AI Project Accelerator | €4,960 | one-time | High — overlaps Fractional's 6–12wk engagements |
| `ai-consultant-day` | AI Consultant Day | €1,200 | one-time | High — generic day-rate |
| `business-mentor-30` | Business Mentor – AI Strategy 30h | €4,960 | one-time | Medium — advisory |
| `firehorse-coach` | EU AI Act Literacy Training | €499 | one-time | **Low — EU-specific moat** |
| `cloud-ready-teams` | On-Demand AI & Cloud Engineers | €950 | one-time | High — T&M staffing |
| `ai-koulutus-3d` | AI Koulutus 3 Days Programme | €6,250 | one-time | **Low — Finnish-language moat** |
| `ai-consulting-agentic` | AI Consulting – Agentic Software Development | €2,500 | one-time | High — exact overlap with Fractional |
| `consulting-hourly` | Senior Specialist – Hourly Consulting | €250 | hourly | High — T&M generic |
| `consulting-fit55` | Consulting Fit for 55 Specialist | €3,000 | monthly | **Low — regulatory moat** |
| `expert-services` _OLD | Workshop 3 Days – Expert Advisory _OLD | €4,500 | one-time | Retire |
| `LIFETIME-EXP-001` _OLD | Expert Advisory & Implementation _OLD | €3,000 | monthly | Retire |
| `LAND-AIL` | AI Literacy Bridge | €34,990 | bundle | Medium — EU positioning helps |

Adjacent platform offers that share competitive surface:

- `DWS-IQ-006` (€4,999 one-time) — the V6 platform.
- `DWS-AEGIS-001` (€59,990 one-time) — sovereignty fortress; complementary not competitive.
- `DWS365-CMP-T3`, `FH-SKILL-T3`, `AC365-T3` — skilled-agent subscriptions at €5,499–€6,499/mo. These are DWS's strongest counter-position because they package outcomes, not hours.

### 1.2 Classification

- **Red zone (high overlap, low differentiation):** `aws-consultancy`, `conversational-agent`, `ai-agent-engineering`, `lean-project`, `ai-consultant-day`, `cloud-ready-teams`, `ai-consulting-agentic`, `consulting-hourly`. 8 SKUs.
- **Defensible (regulatory / language / sovereignty hook):** `firehorse-coach` (EU AI Act), `consulting-fit55`, `ai-koulutus-3d` (FI), `m365-consultancy` (MS-tenant-resident customers). 4 SKUs.
- **Dead weight:** two `_OLD` SKUs still in catalog (`expert-services`, `LIFETIME-EXP-001`).

## 2. Strategic position

A US-backed firm with $1.5B of capital, Anthropic operational alignment, and Blackstone/H&F distribution can — for at least 18 months — out-price and out-credential us on generic "deploy Claude into your business" engagements. We do not win that fight on price or brand. We win on **(a) EU sovereignty, (b) vertical regulatory depth, (c) outcome pricing, (d) edge/on-prem hardware**.

Our AI services line must read as the EU-sovereign, outcome-priced, regulator-shaped complement to (and replacement for) the Fractional-style engagement — not a clone of it.

## 3. Proposed updates (gated on user approval)

### 3.1 Retire / archive (low risk)

- **Retire** `expert-services` (`_OLD`) and `LIFETIME-EXP-001` (`_OLD`). Already marked _OLD — close the loop: drop from `products.json`, rename any HTML pages to `*_OLD.html` if not already.
- **Audit** the matching landing-pages mirror under `landing-pages/dws10-com/config/products.json` for the same removals in the same commit (Dual Folder Sync Rule).

### 3.2 Reposition — copy & metadata (medium risk, no price change)

Rewrite the descriptions / hero copy on these eight Red-zone SKUs to lead with the EU/sovereignty/outcome wedge. Concrete edits proposed:

| SKU | Current angle | Proposed reposition |
|---|---|---|
| `aws-consultancy` | "AI Engineering & Cloud Solutions" — generic | "EU-Sovereign AI Engineering — Anthropic + Scaleway + DGX Spark, ZDR contracts, NIS2-ready" |
| `conversational-agent` | "Conversational Agent Solution" | "EU-Hosted Conversational Agent — GDPR + EU AI Act Article 50 transparency built in" |
| `ai-agent-engineering` | €200/h generic | Keep €200/h **only as backstop**; lead with `CMP-OC-STD` / `SS-OC-STD` / `MO-OC-STD` outcome pricing |
| `lean-project` | "AI Project Accelerator" (6-week scope) | "EU AI Project Accelerator — fixed price, sovereign deployment, captain-hat-aligned outcomes" |
| `ai-consultant-day` | "AI Consultant Day" — €1,200 | Bundle into Captain Day; explicit "what one Skilled Agent ships in 24 hours" framing |
| `cloud-ready-teams` | "On-Demand AI & Cloud Engineers" | Rename to "EU On-Demand AI Engineers (sovereign cloud-resident)" |
| `ai-consulting-agentic` | "Agentic Software Development" | "Agentic Software Development for EU Teams — Skills paradigm, Claude Code + Codex, no data egress" |
| `consulting-hourly` | Generic €250/h | Convert to retainer + outcome model; map hours to specific captain-hat outputs |

These are copy/metadata changes — no price change, no SKU ID change. Safe to ship in one commit per Dual Folder Sync Rule.

### 3.3 Add — outcome wedge (medium risk, requires pricing call)

Introduce **two new outcome-priced AI service SKUs** that the Anthropic-backed firm structurally cannot offer:

1. **`AIS-EU-SOV-OC`** — "EU-Sovereign AI Migration (per workload)" — fixed price per workload moved off US LLM to EU-sovereign Claude / Mistral / DGX Spark stack. €4,990 metered. Wedge: NIS2 / EU AI Act / GDPR auditable outputs.
2. **`AIS-OUTCOME-PILOT`** — "Outcome-Priced Applied AI Pilot (6 weeks)" — €9,990 fixed, refunded if the named KPI does not move. Wedge: "we cost less than your last management-consultancy deck, and we refund if it doesn't work."

Both belong in the `LAND-*` family (enterprise bundles) and should be exposed via `/agent-run` and the MCP product surface per Agent Productization Rule.

### 3.4 Defend — double down on regulatory / sovereign SKUs

These SKUs are the actual moat — fund and feature them, do not let them sit at the bottom of the buy page:

- `consulting-fit55` (Fit for 55 specialist)
- `firehorse-coach` (EU AI Act literacy)
- `LAND-EUAI`, `LAND-CSRD`, `LAND-SOV`
- `DWS-SOVEREIGN-DB-001`, `sovereignty-cloud-consulting`
- `IND-*` industry pods (named, not generic)

Promote to `featured: true` in `products.json` and to top of `buyPageOrder`.

### 3.5 Sales narrative refresh (no code change)

Add a Section 7 ("Competitive Frame — Q2/26 update") to `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` (or fork to Q2/26 manifesto) covering:

- "Why Lifetime, not the Anthropic services firm" — 3-bullet objection-handling card.
- "Why Lifetime, not Deloitte/Accenture" — already implicit; align voice.
- Pricing-comparison shell so account execs can answer "Fractional charges X" without improvising.

### 3.6 Thesis updates (per Thesis Content Scope Rule)

- **PhD (`docs/PHD_FIREHORSE_EN.md` + `_FI.md`):** add market-signal entry — model-provider-aligned services firms as a new competitive tier; cite this audit and the field note. Per repo rule, market signals belong in PhD only; do not propagate to master's.
- **Master's (`V3Thesis_EN.md` + `_FI.md`):** unchanged — this is signal, not implementation.

## 4. What I have NOT done in this pass

By design — all of the below are higher blast radius and need a green light before I touch them:

- Did **not** edit `dws10.com/config/products.json` or the landing-pages mirror.
- Did **not** rewrite any product HTML page copy.
- Did **not** add new SKUs.
- Did **not** modify `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` or either thesis.

## 5. Recommended sequence

1. **Approve Section 3.1** (retire two `_OLD` SKUs) — lowest risk, dual-folder sync in one commit.
2. **Approve Section 3.2** (Red-zone copy reposition) — one commit per SKU pair (config + page + landing-pages mirror).
3. **Decide Section 3.3** (new outcome SKUs) — pricing call; requires Revolut/PayPal checkout setup.
4. **Approve Section 3.4** (feature flag + buyPageOrder bump on defensible SKUs).
5. **Approve Section 3.5** (sales-manifesto Q2/26 fork with competitive frame).
6. **Approve Section 3.6** (PhD market-signal append + FI lockstep).

Each step is independently shippable.

## 6. Standards consulted

- `DWS_TRUTH_STANDARD.md` — pricing source-of-truth is `dws10.com/config/products.json`; dual-folder mirror required.
- `DWS_MARKET_RESEARCH_STANDARD.md` — competitor analysis routing.
- `DWS_PRODUCT_STANDARD.md` — SKU schema + featured/buyPageOrder semantics.
- `DWS_BRAND_STANDARD.md` — copy voice; sovereign / EU framing.
- `DWS_DOCUMENT_STANDARD.md` — `***` delimiter for VERSION AND AGENT HISTORY in markdown.
- Thesis Content Scope Rule (CLAUDE.md) — market signals → PhD only.
