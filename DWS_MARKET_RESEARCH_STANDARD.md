# DWS Market Research Standard v1.0

---

# VERSION AND AGENT HISTORY

Version: 1.5

Sessions & Modifications:

- Version: 1.5 | Tool: Claude Code (claude-sonnet-5) | Session: claude/dws-sovereign-intelligence-wwho6h | Date: 09.07.2026 | Changes: Corrected §8.3 per same-session coinability/GTM audit (`docs/field-notes/2026-07-09-sovereign-intelligence-coinability-gtm-audit.md`). Dropped the "(SI)" abbreviation (collides with the existing "NVIDIA SI network" = System Integrator usage in §8.1) and the "canonical positioning term"/coinage framing (Sovereign Intelligence, LLC has held the exact name in an adjacent AI-intelligence vertical since ~2013; StirlingX and Octostar use near-identical phrasing as of 2026). Reframed as DWS's positioning within the established "sovereign AI" category, not a DWS-owned term.
- Version: 1.4 | Tool: Claude Code (claude-sonnet-5) | Session: claude/dws-sovereign-intelligence-wwho6h | Date: 09.07.2026 | Changes: Added §8.3 — promoted "Sovereign Intelligence (SI)" from draft field note (`docs/field-notes/2026-07-05-san-francisco-sovereign-intelligence-industries.md`) to canonical positioning thesis, per that note's own action trigger. Registered in `DWS_TRUTH_STANDARD.md` as row 27.
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/competitor-pricing-analysis-e89r3 | Date: 17.03.2026 | Changes: Updated DWS IQ competitor tracking with CSRD/ESG SaaS competitors (Sweep, Persefoni, Watershed, Normative, Greenly); added reference to Q1 2026 pricing analysis
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/dsaas-cli-first-strategy-ePRaw | Date: 13.03.2026 | Changes: Added DSaaS competitor tracking row — Aiven, Supabase, Neon, PlanetScale, Timescale Cloud as competitors for Database Sovereignty as a Service product
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/add-linkedin-social-note-QrRLH | Date: 08.03.2026 | Changes: Added Strategic Partnership Registry (§8.1) — NVIDIA Connect ISV Partner as first entry, partnership integration checklist
- Version: 1.0 | Tool: Claude Code | Session: 01Uyf3ZyeW3UQhotzJVEpo7s | Date: 14.02.2026 | Changes: Initial market research standard — competitive intelligence framework, product improvement cycle, data collection workflows

Session Links & References:

- Claude Code (01Uyf3ZyeW3UQhotzJVEpo7s): https://claude.ai/code/session_01Uyf3ZyeW3UQhotzJVEpo7s

Document Status:

- Created: 14.02.2026
- Last Modified: 17.03.2026
- Language: EN
- Languages Available: EN
- Publication Status: ACTIVE

- Created: 14.02.2026
- Last Modified: 09.07.2026
- Language: EN
- Languages Available: EN
- Publication Status: ACTIVE

---

**Effective Date:** February 2026
**Scope:** All DWS products across dws6.com, dws10.com, onelifetime.world, lifetime.fi
**Maintained by:** Product Strategy
**Depends on:** `DWS_DOCUMENT_STANDARD.md`, `DWS_BRAND_STANDARD.md`

This standard defines how DWS collects competitive intelligence, tracks market signals, and feeds improvements back into each product. All AI agents and human developers MUST follow these rules when creating market research artifacts.

---

## 1. Purpose

Every DWS product competes in a market. This standard ensures:

1. **Weekly data collection** — automated scraping of competitor pricing, features, and positioning
2. **Structured storage** — all market data in Supabase tables with consistent schemas
3. **Product improvement loop** — competitive gaps feed directly into product roadmaps
4. **Decision traceability** — every product change can be traced to market evidence

---

## 2. Competitive Intelligence Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    WEEKLY COLLECTION CYCLE                      │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│  Web Scraper │  API Feeds   │  Manual      │  Signal Script   │
│  (pricing)   │  (G2, etc.)  │  (field      │  (collect_       │
│              │              │   notes)     │   signals.py)    │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬─────────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌────────────────────────────────────────────────────────────────┐
│              SUPABASE: market_intelligence DB                  │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ competitors  │ competitor_  │ market_      │ firehorse_       │
│              │ products     │ signals      │ signals          │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬─────────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌────────────────────────────────────────────────────────────────┐
│              ANALYSIS & PRODUCT IMPROVEMENT                    │
├──────────────┬──────────────┬──────────────────────────────────┤
│ Gap Analysis │ Price        │ Feature Comparison               │
│ Report       │ Benchmark    │ Matrix                           │
└──────┬───────┴──────┬───────┴──────────────┬──────────────────┘
       │              │                      │
       ▼              ▼                      ▼
┌────────────────────────────────────────────────────────────────┐
│         PRODUCT IMPROVEMENT PROPOSALS (PIPs)                   │
│         → Filed as GitHub Issues with [PIP] prefix             │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Competitor Registry

### 3.1 Competitor Categories

Every DWS product MUST have a defined competitor set. Competitors are categorized:

| Category       | Definition                               | Example                            |
| -------------- | ---------------------------------------- | ---------------------------------- |
| **Direct**     | Same product, same market                | Zoom vs Firehorse V3 video         |
| **Indirect**   | Different product, solves same problem   | Manual audit firms vs Firehorse V2 |
| **Adjacent**   | Different market, could expand into ours | Autodesk BIM360 adding compliance  |
| **Substitute** | Different approach entirely              | In-house dev team vs buying DWS IQ |

### 3.2 Competitor Tracking per Product

| DWS Product                     | Direct Competitors                      | Indirect Competitors                         | Track                                                         |
| ------------------------------- | --------------------------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| **Firehorse V3 SME** (€9.99/mo) | Zoom, Google Meet, Microsoft Teams      | Jitsi.org (free), Whereby, Proton            | Pricing, features, EU hosting                                 |
| **Firehorse V3 Email**          | Gmail, Outlook, Proton Mail             | Migadu, Fastmail, Tutanota                   | Storage, price, sovereignty                                   |
| **Firehorse V2 Reports** (€15k) | Autodesk BIM360, Procore                | Manual audit firms, Buildots                 | Speed, accuracy, price                                        |
| **DWS IQ Platform** (€4,999)    | Sweep, Persefoni, Normative, Greenly    | Watershed, Sphera, Worldfavor, PositionGreen | Pricing, CSRD coverage, ERP connectors, EU hosting, AI agents |
| **Consulting Services**         | McKinsey, Deloitte, KPMG                | Freelancer platforms, in-house               | Pricing, domain expertise                                     |
| **LWM V1** (€250k)              | None (category-creating)                | OpenAI, Anthropic (general AI)               | Model size, domain specificity                                |
| **DSaaS** (€499–€4,999/mo)      | Aiven (managed PG), Supabase Enterprise | Neon, PlanetScale, Timescale Cloud           | Sovereignty enforcement, compliance automation, HTAP, pricing |

### 3.3 Supabase Schema: `competitors`

```sql
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('direct', 'indirect', 'adjacent', 'substitute')),
  dws_product_id TEXT NOT NULL,
  headquarters_country TEXT,
  eu_hosted BOOLEAN DEFAULT false,
  cloud_act_exposure BOOLEAN DEFAULT true,
  last_checked DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Weekly Data Collection Workflow

### 4.1 Automated Collection (GitHub Actions)

**Workflow:** `.github/workflows/market-research-weekly.yml`
**Schedule:** Every Monday at 07:00 UTC
**Extends:** Existing `collect_signals.py` infrastructure

**Data Points Collected Per Competitor:**

| Data Point               | Source                           | Frequency |
| ------------------------ | -------------------------------- | --------- |
| **Pricing**              | Competitor website, G2, Capterra | Weekly    |
| **Feature list**         | Changelog, blog, product page    | Weekly    |
| **Customer count**       | Press releases, social proof     | Monthly   |
| **Funding/M&A**          | Crunchbase, press                | Weekly    |
| **New integrations**     | Changelog, partnerships          | Weekly    |
| **EU compliance claims** | Website, documentation           | Monthly   |
| **Review sentiment**     | G2, Trustpilot, Capterra         | Monthly   |

### 4.2 Supabase Schema: `competitor_products`

```sql
CREATE TABLE competitor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id),
  product_name TEXT NOT NULL,
  price_value DECIMAL(10,2),
  price_currency TEXT DEFAULT 'EUR',
  price_period TEXT CHECK (price_period IN ('one-time', 'monthly', 'yearly', 'per-user-monthly')),
  features JSONB DEFAULT '[]',
  eu_hosted BOOLEAN DEFAULT false,
  e2e_encrypted BOOLEAN DEFAULT false,
  open_source BOOLEAN DEFAULT false,
  compliance_claims TEXT[],
  data_source_url TEXT,
  collected_at TIMESTAMPTZ DEFAULT now(),
  collected_by TEXT DEFAULT 'automated'
);
```

### 4.3 Supabase Schema: `market_signals`

```sql
CREATE TABLE market_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_type TEXT NOT NULL CHECK (signal_type IN (
    'pricing_change', 'new_feature', 'funding', 'acquisition',
    'partnership', 'regulation', 'market_entry', 'market_exit',
    'customer_loss', 'customer_win', 'review'
  )),
  competitor_id UUID REFERENCES competitors(id),
  dws_product_id TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  source_url TEXT,
  impact_score INTEGER CHECK (impact_score BETWEEN 1 AND 5),
  action_required BOOLEAN DEFAULT false,
  action_taken TEXT,
  collected_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Competitive Analysis Document Format

### 5.1 Per-Product Competitive Analysis

Each product in `product-catalog/` SHOULD have a `competitive-analysis.md` file in its version folder.

**Required Structure:**

```markdown
# [Product] — Competitive Analysis

## Market Position

[One paragraph: where this product sits in the market]

## Competitor Matrix

| Feature       | DWS Product | Competitor A | Competitor B | Competitor C |
| ------------- | ----------- | ------------ | ------------ | ------------ |
| Price         | €X/mo       | €Y/mo        | €Z/mo        | Free         |
| EU Hosted     | ✅          | ❌           | ✅           | ❌           |
| E2E Encrypted | ✅          | ✅           | ❌           | ✅           |
| [Feature N]   | ...         | ...          | ...          | ...          |

## Price Benchmarking

[Table comparing pricing tiers]

## Gaps We Must Close

[Numbered list of features competitors have that we lack]

## Our Unique Advantages

[Numbered list of differentiators]

## Recommended Product Improvements

[Numbered, prioritized list — each item becomes a PIP]

## Data Sources

[Links to competitor pages, review sites, press releases]

## Last Updated

[Date and method: automated/manual]
```

### 5.2 Naming Convention

```
product-catalog/[Product]/[Version]/competitive-analysis.md
```

Examples:

- `product-catalog/Firehorse/V3/competitive-analysis.md`
- `product-catalog/Firehorse/V2/competitive-analysis.md`
- `product-catalog/LWM/V1/competitive-analysis.md`

---

## 6. Product Improvement Proposals (PIPs)

### 6.1 From Market Data to Action

Every competitive gap or market signal that suggests a product change MUST be filed as a **Product Improvement Proposal (PIP)**.

**PIP Format (GitHub Issue):**

```markdown
Title: [PIP] [Product] — [Short description]
Labels: pip, [product-name], [priority]

## Market Evidence

- Competitor: [Name]
- Signal: [What they did / what we lack]
- Source: [URL or data reference]
- Impact Score: [1-5]

## Proposed Improvement

[What we should build/change]

## Expected Impact

- Revenue: [estimate]
- Competitive: [close gap / create advantage]
- Effort: [S/M/L]

## Priority

- [ ] Critical (losing deals)
- [ ] High (competitor advantage)
- [ ] Medium (nice to have)
- [ ] Low (future consideration)
```

### 6.2 PIP Review Cadence

| Cadence       | Action                                               | Owner            |
| ------------- | ---------------------------------------------------- | ---------------- |
| **Weekly**    | New PIPs reviewed, triaged                           | Product Manager  |
| **Monthly**   | PIPs prioritized against roadmap                     | Product Strategy |
| **Quarterly** | PIPs closed/archived, competitive analysis refreshed | Cross-functional |

---

## 7. Market Research Workflow Integration

### 7.1 Existing Infrastructure

This standard builds on existing DWS6 infrastructure:

| Component                                      | Location             | Purpose                          |
| ---------------------------------------------- | -------------------- | -------------------------------- |
| `scripts/collect_signals.py`                   | Sales signal scraper | Extend for competitor monitoring |
| `scripts/signal_targets.json`                  | Target companies     | Add competitor URLs              |
| `firehorse_signals` (Supabase)                 | Sales signals table  | Reference schema                 |
| `.github/workflows/roadmap-weekly-tracker.yml` | DWS7 roadmap tracker | Coordinate timing                |

### 7.2 New Workflow: `market-research-weekly.yml`

```yaml
name: Weekly Market Research Collection
on:
  schedule:
    - cron: "0 7 * * 1" # Every Monday 07:00 UTC
  workflow_dispatch:

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r scripts/requirements-signals.txt
      - run: python scripts/collect_market_data.py
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
      - run: python scripts/generate_competitive_report.py
```

---

## 8. Store Product Coverage Rule

**Every product in `config/products.json` MUST have:**

1. A matching entry in `product-catalog/` with `google-merchant-product.json`
2. A defined competitor set in the `competitors` Supabase table
3. A `competitive-analysis.md` updated at least quarterly

**Current Store Products (25 total):**

| Store Category  | Count | Products                                                                                                                      |
| --------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| `platform`      | 6     | DWS IQ, Firehorse Auto/Report/CMS/Omnichannel, Climate Bundle                                                                 |
| `ai-cloud`      | 5     | AWS Consultancy, AI Agent Eng, AI Consultant Day, AI Consulting Agentic, Sovereignty Cloud                                    |
| `advisory`      | 6     | Workshop 3D, Consulting Hourly, Expert Advisory, Fit55 Specialist, AI Koulutus, Business Mentor, Lean Project, Omnichannel MM |
| `digital`       | 6     | M365, Web Pages, Proton Email, Data Services, Design Gold, Cloud-Ready Teams, Agentti Sanasto                                 |
| `communication` | 2     | Firehorse V3 SME (€9.99), Firehorse V3 Professional (€19.99)                                                                  |

---

## 8.1 Strategic Partnership Registry

Track confirmed technology partnerships that create competitive moats and co-sell opportunities.

| Partner     | Program                       | Status    | Confirmed  | Competitive Impact                                                                                                                                                                                                            |
| ----------- | ----------------------------- | --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NVIDIA      | Connect ISV Partner           | Confirmed | 2026-03-08 | Certified compute layer + NeMo DataDesigner integration — eliminates integration risk for OEMs, enables co-sell with NVIDIA's System Integrator (SI) partner network, Synthetic Nervous System for regulatory data generation |
| Red Hat     | Technology Partner            | Active    | 2026-03-21 | AgentOps BYOA platform — enterprise Kubernetes for agent deployment, OpenShift AI, joint NVIDIA secure AI infra. Open-source alignment with EU sovereignty.                                                                   |
| Qantic GmbH | Energy Simulation Partnership | NDA Sent  | 2026-03-21 | Q-System energy simulation + DWS IQ CSRD compliance — targets CSRD-obligated energy sector clients (dena, MAN, Naturstrom)                                                                                                    |

**Partnership integration checklist (per partner):**

- [x] Official confirmation received
- [x] Badge/status on relevant product pages
- [x] Investor page updated (remove "applied", show confirmed)
- [x] Navigation updated with partner page
- [x] Dedicated partner page live on dws10.com
- [ ] Product profile submitted to partner portal
- [ ] Co-marketing materials prepared

**Rule:** Every confirmed partnership MUST appear in this registry within 24 hours of confirmation. Update `DWS_BRAND_STANDARD.md` badge system and `Admin/SECURITY_COMPLIANCE.md` infrastructure table simultaneously.

### 8.1.1 Red Hat Key Findings: The Adaptable Enterprise (2025)

**Source:** Red Hat "The Adaptable Enterprise" report (2025). Contact: Mikko Pylväs, Red Hat Finland (AI event, March 2026).

**Core thesis:** The question is not what your AI strategy should be, but how to build an adaptable enterprise — adaptability is the prerequisite for any AI strategy to succeed.

**Market data points (validated, citable):**

| Data Point                                     | Value                             | Source                                     |
| ---------------------------------------------- | --------------------------------- | ------------------------------------------ |
| Worldwide GenAI spending 2025                  | $644 billion (76.4% YoY increase) | Red Hat Key Findings 2025 (citing IDC)     |
| CEOs investing before understanding value      | 64%                               | Red Hat Key Findings 2025 (citing Bain)    |
| Orgs blocked by lack of AI expertise           | 42%                               | Bain & Company quarterly AI survey         |
| Data center accelerators for inference by 2028 | >80%                              | Red Hat Key Findings 2025 (citing Gartner) |

**Red Hat 4-Pillar Blueprint for Adaptable Enterprise:**

1. **Define Business Outcomes First** — avoid the "technological wilderness"; align AI to specific high-value business challenges
2. **Build a Culture of Experimentation** — invest in people and time; 42% blocked by lack of in-house expertise
3. **Hybrid Data + AI Architecture** — AI strategy must be hybrid cloud strategy; train, tune, and run models wherever data resides without compromising security, compliance, or data sovereignty
4. **Modernize Before You Automate** — move from proprietary silos to open, flexible hybrid cloud (Linux, containers, Kubernetes)

**Key signals for DWS IQ 6:**

- **Inference > Training:** By 2028, 80%+ of accelerators deployed for inference, not training. DWS IQ 6 is already inference-native (GN-100 edge + Cloud Run).
- **MCP as bridge:** Red Hat identifies MCP as critical for bridging legacy systems with agentic AI — matches DWS IQ 6 MCP+A2A architecture.
- **Durability > Resiliency:** A durable enterprise doesn't just bounce back — it continuously delivers value while the world changes. This validates the KYA governed self-optimization model.
- **Hybrid sovereignty:** Red Hat's hybrid cloud imperative maps to DWS IQ 6 deployment model (EU Cloud + Edge + Full Sovereignty overlay).
- **BYOA alignment:** Red Hat's Bring Your Own Agent framework validates DWS IQ 6's framework-agnostic agent orchestration.

**Competitive positioning use:** Reference these data points in Ecosummit pitch, investor materials, and partner conversations. The Red Hat thesis independently validates DWS IQ 6 architecture choices: open, compliant, hybrid, agent-native infrastructure for EU industrial sovereignty.

---

## 8.2 Competitive Moat: Synthetic Nervous System

The **Synthetic Nervous System** is DWS IQ's primary technical moat for Series A positioning. It leverages the NVIDIA Connect ISV partnership to solve the "data scarcity" problem in EU regulatory compliance.

**Core thesis:** Real-world compliance failure data (audit strikes, fraudulent MTCs, carbon leakage) is currently rare because CBAM/CSRD enforcement cycles are unprecedented. DWS IQ manufactures this data synthetically.

| Moat Dimension       | Legacy Competitor            | DWS IQ + NVIDIA                      |
| -------------------- | ---------------------------- | ------------------------------------ |
| Training Data        | Customer-provided (Reactive) | Synthetic Nervous System (Proactive) |
| Regulation Readiness | 2024 Standards               | 2027+ Simulated Edge Cases           |
| Compute Partner      | General Cloud                | NVIDIA Connect ISV (Lifetime Oy)     |
| Logic Layer          | Hard-coded rules             | Agentic Reasoning (NVIDIA NeMo)      |

**Key technical components:**

- **NVIDIA NeMo DataDesigner** — generates high-fidelity synthetic regulatory data (Mill Test Certificates, emission declarations, audit scenarios)
- **NVIDIA NIM (Nemotron-3-8B)** — "Data-Generator" and "LLM-as-a-Judge" for validation
- **EU 2025/2547 baked into schema** — every synthetic row audited for regulatory logic before agent training
- **NVIDIA Vera Rubin architecture** — scales to Tier-1 industrial supply chain throughput

**Investor narrative:** "10,000 years of regulatory edge cases simulated in weeks." See `docs/field-notes/2026-04-06-series-a-technical-narrative-synthetic-nervous-system.md` for full Arctic 15 pitch.

**Target event:** Arctic 15 Deal Room (June 2026)

---

## 8.3 Positioning Thesis: Sovereign Intelligence

> **Corrected 09.07.2026 (same-day audit):** the initial promotion of this section abbreviated the term as "(SI)" and framed it as a DWS-owned coinage. Both were wrong. See `docs/field-notes/2026-07-09-sovereign-intelligence-coinability-gtm-audit.md` for the full audit. **Do not abbreviate "Sovereign Intelligence" as "SI"** — §8.1 above already uses "SI" for NVIDIA's System Integrator partner network, and re-using it here is an internal collision. **Do not claim DWS coined this term** — Sovereign Intelligence, LLC (`sovereign.ai`) has held the exact name in an adjacent AI-intelligence vertical since ~2013, and two funded 2026 competitors (StirlingX, Octostar) use near-identical phrasing.

"Sovereign Intelligence" is DWS's positioning phrase — **not a registered or claimed-exclusive term** — for AI that trains and executes inside the customer's own network perimeter and jurisdiction, rather than on a foreign-jurisdiction platform. It is **not a new product tier, SKU, or standard** — it is narrative language describing architecture that already exists: `DWS_SOVEREIGNTY_STANDARD.md` (SOV-T1/T2/T3 tiers, `DWS-SOVEREIGN-DB-001`) and the canonical three-pillar sovereignty model (`DWS_TRUTH_STANDARD.md` row 16 → `docs/PHD_FIREHORSE_EN.md` §14.23, Data→SIB / Technology→CSB / Operational→EAB). It is DWS's positioning **within** the market's established "sovereign AI" category (the term buyers actually search for — see the audit §3.1), differentiated by the CLOUD Act jurisdiction argument below, not a separate category name.

**Compressed thesis:** "What happens in San Francisco stays in San Francisco" — under the CLOUD Act, a US-headquartered AI platform means US jurisdiction over customer data regardless of which region hosts it. The counter-position is sovereign intelligence: AI trained and run inside the customer's own perimeter, on hardware they control, so the audit trail never leaves the jurisdiction it was created in. This specific sentence — not the "Sovereign Intelligence" label — is the actually distinctive asset (audit §2.4: not found in use by any competitor).

**Reference architecture:** Outokumpu Tornio, documented in `Learn/sovereign-industrial-intelligence-whitepaper-v1.0.html` §2.1–2.2 (regulatory convergence table, CLOUD Act jurisdiction gap, Microsoft France's June 2025 Senate testimony) and the public narrative at `onelifetime.world/posts/sovereign-intelligence-outokumpu-tornio.html`.

**Approved uses:**

- Opening hook for sovereignty-focused pitch decks and outreach waves; cite the whitepaper for substantiating detail.
- Investor narrative alongside the Synthetic Nervous System moat (§8.2) — this thesis is the customer-facing positioning line, Synthetic Nervous System is the underlying technical moat. **Do not tell investors DWS "coined" this term** (audit §4.3).
- Hero/tweet copy per the three draft options in `docs/field-notes/2026-07-05-san-francisco-sovereign-intelligence-industries.md` §2/§5.

**Constraints:**

- Run `/truth-check` and route through `DWS_BRAND_STANDARD.md` before this line appears on any live page, deck, or public post — canon status here authorizes internal use, not public-site publication.
- Never imply "zero" disclosure exposure — the claim is jurisdictional control, not technical impossibility of compelled disclosure.
- No exclusivity or trademark claim without an actual USPTO/EUIPO clearance search and counsel review — this section's own audit is a web-search sweep, not legal clearance (audit §5).
- Source docs: `docs/field-notes/2026-07-05-san-francisco-sovereign-intelligence-industries.md` (full thesis, tweet copy, internal memo, hero text options) and `docs/field-notes/2026-07-09-sovereign-intelligence-coinability-gtm-audit.md` (coinability/GTM audit). Registered as `DWS_TRUTH_STANDARD.md` row 27.

---

## 9. Reporting Format

### 9.1 Weekly Market Brief

Generated every Monday after data collection. Stored in `docs/market-research/`.

**Naming:** `YYYY-WXX-market-brief.md`

**Structure:**

```markdown
# Market Brief — Week XX, YYYY

## Key Signals This Week

1. [Signal with impact score]
2. [Signal with impact score]

## Pricing Changes Detected

| Competitor | Product | Old Price | New Price | Our Price |
|...

## New PIPs Filed

- [PIP-XXX] [Description]

## Action Items

- [ ] [Action for product team]
```

### 9.2 Quarterly Competitive Report

Full analysis across all products. Presented at quarterly product review.

**Naming:** `YYYY-QX-competitive-report.md`

---

## 10. Data Retention & Privacy

- Competitor data is **public information** only (websites, press releases, review sites)
- **Never** scrape private/authenticated content
- **Never** store competitor customer PII
- Retention: 2 years rolling (older data archived)
- All collection scripts MUST respect `robots.txt`
- Rate limiting: max 1 request/second per domain

---

## 11. Relationship to Other Standards

| Standard                      | Relationship                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `DWS_DOCUMENT_STANDARD.md`    | All market research docs follow document metadata format                                  |
| `DWS_BRAND_STANDARD.md`       | Product positioning must align with brand categories                                      |
| `DWS_SECURITY_STANDARD.md`    | Data collection must not expose credentials                                               |
| `product-catalog/README.md`   | Product catalog is the source of truth for product specs                                  |
| `config/products.json`        | Store products define the scope of competitive tracking                                   |
| `DWS_TRUTH_STANDARD.md`       | Row 27 registers §8.3 (Sovereign Intelligence) as the positioning thesis; non-exclusive   |
| `DWS_SOVEREIGNTY_STANDARD.md` | SOV-T1/T2/T3 tiers are the architecture §8.3's sovereign-intelligence narrative describes |

---

**Document Owner:** Product Strategy
**Contact:** product@lifetime.fi
**Last Updated:** 2026-07-09
**Session:** claude/dws-sovereign-intelligence-wwho6h

© 2026 Lifetime Oy · DWS Market Research Standard
