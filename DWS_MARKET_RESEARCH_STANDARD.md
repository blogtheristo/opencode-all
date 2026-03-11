# DWS Market Research Standard v1.0

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/add-linkedin-social-note-QrRLH | Date: 08.03.2026 | Changes: Added Strategic Partnership Registry (§8.1) — NVIDIA Connect ISV Partner as first entry, partnership integration checklist
  - Version: 1.0 | Tool: Claude Code | Session: 01Uyf3ZyeW3UQhotzJVEpo7s | Date: 14.02.2026 | Changes: Initial market research standard — competitive intelligence framework, product improvement cycle, data collection workflows

Session Links & References:
  - Claude Code (01Uyf3ZyeW3UQhotzJVEpo7s): https://claude.ai/code/session_01Uyf3ZyeW3UQhotzJVEpo7s

Document Status:
  - Created: 14.02.2026
  - Last Modified: 08.03.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE

***

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

| Category | Definition | Example |
|----------|-----------|---------|
| **Direct** | Same product, same market | Zoom vs Firehorse V3 video |
| **Indirect** | Different product, solves same problem | Manual audit firms vs Firehorse V2 |
| **Adjacent** | Different market, could expand into ours | Autodesk BIM360 adding compliance |
| **Substitute** | Different approach entirely | In-house dev team vs buying DWS IQ |

### 3.2 Competitor Tracking per Product

| DWS Product | Direct Competitors | Indirect Competitors | Track |
|-------------|-------------------|---------------------|-------|
| **Firehorse V3 SME** (€9.99/mo) | Zoom, Google Meet, Microsoft Teams | Jitsi.org (free), Whereby, Proton | Pricing, features, EU hosting |
| **Firehorse V3 Email** | Gmail, Outlook, Proton Mail | Migadu, Fastmail, Tutanota | Storage, price, sovereignty |
| **Firehorse V2 Reports** (€15k) | Autodesk BIM360, Procore | Manual audit firms, Buildots | Speed, accuracy, price |
| **DWS IQ Platform** (€4,999) | Sphera, Ecoinvent, SimaPro | Worldfavor, PositionGreen | Coverage, EU focus, AI |
| **Consulting Services** | McKinsey, Deloitte, KPMG | Freelancer platforms, in-house | Pricing, domain expertise |
| **LWM V1** (€250k) | None (category-creating) | OpenAI, Anthropic (general AI) | Model size, domain specificity |

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

| Data Point | Source | Frequency |
|------------|--------|-----------|
| **Pricing** | Competitor website, G2, Capterra | Weekly |
| **Feature list** | Changelog, blog, product page | Weekly |
| **Customer count** | Press releases, social proof | Monthly |
| **Funding/M&A** | Crunchbase, press | Weekly |
| **New integrations** | Changelog, partnerships | Weekly |
| **EU compliance claims** | Website, documentation | Monthly |
| **Review sentiment** | G2, Trustpilot, Capterra | Monthly |

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

| Feature | DWS Product | Competitor A | Competitor B | Competitor C |
|---------|------------|-------------|-------------|-------------|
| Price | €X/mo | €Y/mo | €Z/mo | Free |
| EU Hosted | ✅ | ❌ | ✅ | ❌ |
| E2E Encrypted | ✅ | ✅ | ❌ | ✅ |
| [Feature N] | ... | ... | ... | ... |

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

| Cadence | Action | Owner |
|---------|--------|-------|
| **Weekly** | New PIPs reviewed, triaged | Product Manager |
| **Monthly** | PIPs prioritized against roadmap | Product Strategy |
| **Quarterly** | PIPs closed/archived, competitive analysis refreshed | Cross-functional |

---

## 7. Market Research Workflow Integration

### 7.1 Existing Infrastructure

This standard builds on existing DWS6 infrastructure:

| Component | Location | Purpose |
|-----------|----------|---------|
| `scripts/collect_signals.py` | Sales signal scraper | Extend for competitor monitoring |
| `scripts/signal_targets.json` | Target companies | Add competitor URLs |
| `firehorse_signals` (Supabase) | Sales signals table | Reference schema |
| `.github/workflows/roadmap-weekly-tracker.yml` | DWS7 roadmap tracker | Coordinate timing |

### 7.2 New Workflow: `market-research-weekly.yml`

```yaml
name: Weekly Market Research Collection
on:
  schedule:
    - cron: '0 7 * * 1'  # Every Monday 07:00 UTC
  workflow_dispatch:

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
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

| Store Category | Count | Products |
|----------------|-------|----------|
| `platform` | 6 | DWS IQ, Firehorse Auto/Report/CMS/Omnichannel, Climate Bundle |
| `ai-cloud` | 5 | AWS Consultancy, AI Agent Eng, AI Consultant Day, AI Consulting Agentic, Sovereignty Cloud |
| `advisory` | 6 | Workshop 3D, Consulting Hourly, Expert Advisory, Fit55 Specialist, AI Koulutus, Business Mentor, Lean Project, Omnichannel MM |
| `digital` | 6 | M365, Web Pages, Proton Email, Data Services, Design Gold, Cloud-Ready Teams, Agentti Sanasto |
| `communication` | 2 | Firehorse V3 SME (€9.99), Firehorse V3 Professional (€19.99) |

---

## 8.1 Strategic Partnership Registry

Track confirmed technology partnerships that create competitive moats and co-sell opportunities.

| Partner | Program | Status | Confirmed | Competitive Impact |
|---------|---------|--------|-----------|-------------------|
| NVIDIA | Connect ISV Partner | Confirmed | 2026-03-08 | Certified compute layer — eliminates integration risk for OEMs, enables co-sell with NVIDIA SI network |

**Partnership integration checklist (per partner):**
- [x] Official confirmation received
- [x] Badge/status on relevant product pages
- [x] Investor page updated (remove "applied", show confirmed)
- [x] Navigation updated with partner page
- [x] Dedicated partner page live on dws10.com
- [ ] Product profile submitted to partner portal
- [ ] Co-marketing materials prepared

**Rule:** Every confirmed partnership MUST appear in this registry within 24 hours of confirmation. Update `DWS_BRAND_STANDARD.md` badge system and `Admin/SECURITY_COMPLIANCE.md` infrastructure table simultaneously.

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

| Standard | Relationship |
|----------|-------------|
| `DWS_DOCUMENT_STANDARD.md` | All market research docs follow document metadata format |
| `DWS_BRAND_STANDARD.md` | Product positioning must align with brand categories |
| `DWS_SECURITY_STANDARD.md` | Data collection must not expose credentials |
| `product-catalog/README.md` | Product catalog is the source of truth for product specs |
| `config/products.json` | Store products define the scope of competitive tracking |

---

**Document Owner:** Product Strategy
**Contact:** product@lifetime.fi
**Last Updated:** 2026-02-14
**Session:** 01Uyf3ZyeW3UQhotzJVEpo7s

© 2026 Lifetime Oy · DWS Market Research Standard
