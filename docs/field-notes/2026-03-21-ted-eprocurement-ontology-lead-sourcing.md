# TED eProcurement Ontology — Construction Lead Sourcing

***
# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:
  - Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-sales-call-script-xg1zO | Date: 21.03.2026 | Changes: Added automation assessment — TED API v3 details, Supabase pipeline architecture, ERP qualifier, compliance-signal keywords, DM personalization templates
  - Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-sales-call-script-xg1zO | Date: 21.03.2026 | Changes: Initial document — TED eProcurement Ontology overview, DWS integration strategy, lead sourcing workflow

Session Links & References:
  - Claude Code (improve-sales-call-script-xg1zO): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-03-21-ted-eprocurement-ontology-lead-sourcing.md
  - TED Portal: https://ted.europa.eu/en
  - eProcurement Ontology Docs: https://docs.ted.europa.eu
  - eProcurement Ontology GitHub: https://github.com/OP-TED

Document Status:
  - Created: 21.03.2026
  - Last Modified: 21.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-03-21
**Last Updated:** 2026-03-21
**Status:** Active

---

## Table of Contents

1. [What is TED](#1-what-is-ted)
2. [What is the eProcurement Ontology](#2-what-is-the-eprocurement-ontology)
3. [Why This Matters for DWS](#3-why-this-matters-for-dws)
4. [How TED Data Works — Plain Language](#4-how-ted-data-works--plain-language)
5. [Construction CPV Codes](#5-construction-cpv-codes)
6. [Lead Sourcing Workflow](#6-lead-sourcing-workflow)
7. [Example: Real TED Notice](#7-example-real-ted-notice)
8. [Technical Integration Notes](#8-technical-integration-notes)
9. [Key Contacts and Resources](#9-key-contacts-and-resources)

---

## 1. What is TED

**TED (Tenders Electronic Daily)** is the official EU portal where all public procurement notices are published. Think of it as the EU's "job board" for construction projects — except instead of job listings, it lists building projects, infrastructure contracts, and public works that governments and public bodies need companies to bid on.

Every EU country is required to publish tenders above certain value thresholds on TED. This means:

- **Hundreds of thousands of notices per year** — including construction, infrastructure, civil engineering, and building services
- **All EU member states + associated countries** are covered
- **Free to search** — no subscription needed for public tender data
- **Standardized format** — every notice follows the same structure, making it machine-readable

**In simple terms:** When a city wants to build a new school, or a government wants to repair a highway, the project gets published on TED. Any qualified company in the EU can bid on it. TED is where we find out WHO is building WHAT and WHERE.

Portal: https://ted.europa.eu/en

---

## 2. What is the eProcurement Ontology

### The Problem It Solves

Every EU country used to describe procurement data differently. France might call something a "marché public", Germany "öffentlicher Auftrag", Finland "julkinen hankinta" — but they all mean the same thing. When you try to search across countries, the inconsistency makes it hard to find and compare tenders.

### What the eProcurement Ontology Does

The **eProcurement Ontology** is a standard vocabulary — a shared dictionary — maintained by the EU Publications Office. It defines:

- **Consistent terms** — every concept (buyer, supplier, tender, lot, contract) has one official name and definition
- **Relations between concepts** — how a "buyer" relates to a "tender" relates to a "lot" relates to a "contract award"
- **Machine-readable format** — computers can process procurement data from any EU country the same way

### Who Uses It

| User | How they use it |
|------|----------------|
| **Information system developers** | Build apps that consume procurement data in a standardized way |
| **Data analysts** | Query and compare procurement data across EU countries |
| **Buyers (public bodies)** | Publish tenders in a format that all EU suppliers can find |
| **Suppliers (companies)** | Search for opportunities across all EU countries with consistent filters |
| **Service providers** | Build commercial platforms (like Building Radar, DTAD) on top of this standard |

### Key Benefits

1. **Simplified data exchange** — buyers and suppliers exchange information faster because format is agreed upon
2. **Cross-border search** — find construction tenders in Germany, France, and Finland with one query
3. **Linked open data** — procurement data connects to other EU datasets (company registries, financial data, geographic data)
4. **Platform agnostic** — works with any technology stack, no vendor lock-in
5. **No competing standard** — this is THE European-level standard; some countries have national ontologies, but the eProcurement Ontology is the only pan-European one

### Who Maintains It

The **EC Publications Office** (the same body that runs TED). Contact: OP-TED-HELPDESK@publications.europa.eu

---

## 3. Why This Matters for DWS

### The Connection: Procurement Data → Climate Compliance Leads

Every construction tender on TED represents a project that will need:

- **CSRD reporting** — the winning company must report the project's sustainability impact
- **EPBD compliance** — the building must meet energy performance requirements
- **EN 15978 calculation** — the building's total carbon footprint must be calculated from cradle to grave

**This is exactly what DWS IQ 6 automates.**

### The Opportunity

| What TED gives us | What we do with it |
|-------------------|--------------------|
| Company names winning large construction contracts | Find their sustainability/compliance leads on LinkedIn |
| Project descriptions and values | Personalize our DM: "I saw you won the EUR 50M highway contract..." |
| Country and sector data | Target the right DM language (SV/DE/FI/FR/EN) |
| CPV codes | Filter for construction-specific tenders only |
| Contracting authority | Understand if the buyer has CSRD obligations (large public companies do) |

### Strategic Value

1. **Free lead generation** — TED is public, no subscription needed
2. **Decision-maker identification** — companies winning EU tenders are the ones facing compliance pressure NOW
3. **Personalization data** — tender details give us specific, relevant conversation starters
4. **Scale** — thousands of new construction tenders per month across the EU
5. **Timing** — we reach companies when they've just committed to a project and compliance is top-of-mind

---

## 4. How TED Data Works — Plain Language

### The Lifecycle of a Tender

```
1. PUBLIC BODY has a project (e.g., city wants to build a school)
       ↓
2. They publish a NOTICE on TED (what they need, budget, deadline)
       ↓
3. COMPANIES submit bids (proposals with price, timeline, qualifications)
       ↓
4. PUBLIC BODY picks a winner → publishes CONTRACT AWARD on TED
       ↓
5. The WINNING COMPANY must now comply with EU regulations (CSRD, EPBD, EN 15978)
       ↓
6. THIS IS WHERE DWS IQ 6 COMES IN — we automate the compliance reporting
```

### Notice Types We Care About

| Notice Type | What it means | Why we care |
|-------------|---------------|-------------|
| **Contract notice** | "We want to build something, submit your bid" | Identifies companies interested in construction |
| **Contract award notice** | "Company X won the contract" | Identifies the company that NOW needs compliance |
| **Prior information notice** | "We're planning to build something soon" | Early signal — reach the company before the project starts |

### Data Structure (Simplified)

Every TED notice contains structured fields that map to the eProcurement Ontology:

- **Buyer** — who is paying (city, government agency, public company)
- **Object** — what they want built (description, location, value)
- **Procedure** — how they're choosing the winner (open tender, restricted, negotiated)
- **Lots** — if the project is split into parts (e.g., Lot 1: foundation, Lot 2: electrical)
- **Award** — who won and for how much
- **CPV codes** — standardized category codes (see Section 5)

---

## 5. Construction CPV Codes

CPV (Common Procurement Vocabulary) codes are the EU's standardized way of categorizing what's being procured. For construction, the key codes are:

### Primary Construction Codes

| CPV Code | Description | Use case |
|----------|-------------|----------|
| `45000000-7` | **Construction work** (top-level, catches everything) | Broadest filter — all construction |
| `45100000-8` | Site preparation work | Demolition, earthmoving, soil stabilization |
| `45200000-9` | Works for complete or part construction and civil engineering | Buildings, bridges, tunnels, pipelines |
| `45210000-2` | Building construction work | Residential and commercial buildings |
| `45220000-5` | Structural and civil engineering work | Bridges, tunnels, shafts |
| `45230000-8` | Construction work for pipelines, communication and power lines | Utility infrastructure |
| `45300000-0` | Building installation work | Electrical, plumbing, HVAC installation |
| `45400000-1` | Building completion work | Plastering, painting, glazing, flooring |

### Energy & Sustainability Codes (EPBD-relevant)

| CPV Code | Description | Why relevant |
|----------|-------------|-------------|
| `45320000-6` | Insulation work | Directly impacts building energy performance (EPBD) |
| `45330000-9` | Plumbing and sanitary works | Water/heating efficiency |
| `45331000-6` | Heating, ventilation, and air-conditioning installation | Core EPBD compliance area |
| `45350000-5` | Mechanical installations | Energy systems |
| `09300000-2` | Electricity, heating, solar and nuclear energy | Renewable energy in buildings |

### Search Strategy

**For broad construction leads:** Use `45000000-7` (catches all sub-categories)

**For EPBD-specific leads:** Combine `45320000-6` + `45331000-6` (insulation + HVAC — companies doing this work face EPBD directly)

**For high-value infrastructure:** Use `45220000-5` (civil engineering — bridges, tunnels — large projects with big compliance obligations)

---

## 6. Lead Sourcing Workflow

### Step-by-Step: From TED Notice to LinkedIn DM

```
STEP 1: SEARCH TED
  - Go to https://ted.europa.eu/en
  - Filter: CPV = 45000000-7, Country = [target], Value = EUR 5M+
  - Sort by newest first
  - Look for contract AWARD notices (we want winners, not just bidders)

STEP 2: IDENTIFY THE COMPANY
  - Note the winning company name, country, contract value
  - Note the project description (what they're building)

STEP 3: FIND THE PERSON ON LINKEDIN
  - Search: "[Company name] sustainability" or "[Company name] compliance"
  - Target roles: Head of Sustainability, CSO, Compliance Officer, ESG Lead
  - If no sustainability role: try CTO, Head of Innovation, or CEO (smaller firms)

STEP 4: PERSONALIZE THE DM
  - Reference the specific tender/project they won
  - Connect it to CSRD/EPBD/EN 15978 compliance
  - Use the matching language template (SV/DE/FI/FR/EN)

STEP 5: SEND AND TRACK
  - Use the DM templates from CONSTRUCTION_TEASER_DM.md
  - Log in campaign tracking (see Campaign Tracking section)
  - Follow up Day 3 if no reply, then stop
```

### Example Personalization Using TED Data

**TED says:** "Contract awarded to Skanska AB for EUR 45M school construction in Malmö"

**DM opener becomes:**
> "I saw Skanska won the EUR 45M school project in Malmö. With CSRD now mandatory, that project alone requires a full EN 15978 carbon lifecycle assessment — from the concrete foundation to the HVAC system. How is your team handling that? We built software that automates it."

This is far more compelling than a generic "how are you handling compliance?" because it references something SPECIFIC and RECENT.

---

## 7. Example: Real TED Notice

**Notice ID:** 196127-2026
**URL:** https://ted.europa.eu/en/notice/-/detail/196127-2026

### How to Read a TED Notice

When you open a TED notice, look for these fields:

| Field | Where to find it | What to do with it |
|-------|-------------------|-------------------|
| **Title** | Top of the page | Understand what's being built |
| **Contracting authority** | "Buyer" section | This is the public body paying — they may also need DWS |
| **Description** | "Object" section | Details about the project — use for DM personalization |
| **CPV codes** | "Object" section | Confirms it's construction |
| **Estimated value** | "Object" or "Award" section | Higher value = bigger compliance burden = better lead |
| **Country** | "Buyer" section | Determines which DM language to use |
| **Award details** | "Results" section (if contract awarded) | The winning company name — this is our DM target |
| **Deadline** | "Procedure" section | If still open, the winner hasn't been decided yet |

### TED Search Tips

1. **Advanced search** → filter by CPV code `45000000-7` for all construction
2. **Country filter** → match to our DM language templates (SE, DE, FI, FR, UK)
3. **Value filter** → EUR 5M+ for companies with serious compliance obligations
4. **Notice type** → "Contract award notice" for confirmed winners
5. **Date range** → last 30 days for fresh leads
6. **Set up email alerts** → TED sends daily/weekly digests for saved searches

---

## 8. Technical Integration — Automation Assessment

### Can We Automate Tranche 2? YES.

The TED Search API v3 is **free, open, requires no authentication, returns JSON, and has a 700 req/min rate limit**. This is everything we need for a fully automated daily pipeline.

### TED API v3 — Key Facts

| Aspect | Detail |
|--------|--------|
| **Endpoint** | `POST https://api.ted.europa.eu/v3/notices/search` |
| **Auth** | None required for published notices |
| **Format** | JSON request/response |
| **Rate limit** | 700 requests/minute |
| **Pagination** | `PAGE_NUMBER` (max 15k results) or `ITERATION` (unlimited) |
| **Page size** | Max 250 notices per page |
| **Swagger** | https://api.ted.europa.eu/swagger |
| **Docs** | https://docs.ted.europa.eu/api/latest/search.html |
| **Cost** | Free |

### API Request Example

```bash
curl -X POST 'https://api.ted.europa.eu/v3/notices/search' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "cpv=45000000 AND buyer-country=FIN",
    "fields": ["publication-number", "notice-title", "buyer-name", "buyer-country",
               "notice-type", "estimated-total-value", "publication-date"],
    "limit": 50,
    "scope": "ALL",
    "checkQuerySyntax": false,
    "paginationMode": "PAGE_NUMBER",
    "pageNumber": 1
  }'
```

### Expert Query Syntax

| Operator | Example | Meaning |
|----------|---------|---------|
| `=` | `cpv=45000000` | Exact match on CPV code |
| `~` | `buyer-name~"Skanska"` | Fuzzy/stemmed text search |
| `IN` | `buyer-country IN (FIN,SWE,DEU)` | Match any of these countries |
| `>=` | `publication-date>=20260301` | Date range filter |
| `AND` | `cpv=45000000 AND buyer-country=FIN` | Combine filters |
| `OR` | `cpv=45210000 OR cpv=45220000` | Match either |

### Key Search Fields

| Field | Description |
|-------|-------------|
| `publication-number` | Unique notice ID (e.g., 196127-2026) |
| `notice-title` | Title of the tender/project |
| `buyer-name` | Contracting authority name |
| `buyer-country` | ISO 3-letter country code |
| `notice-type` | `cn-standard`, `can-standard`, `pin-only` etc. |
| `cpv` | Common Procurement Vocabulary code |
| `estimated-total-value` | Contract value |
| `place-of-performance` | Where the work happens |
| `publication-date` | When published |
| `deadline-receipt-tenders` | Bid deadline |

### Compliance-Signal Search Terms

Companies tendering for these keywords are already in buying mode for compliance tools:

- `CSRD` — sustainability reporting mandate
- `sustainability reporting` — general compliance signal
- `carbon footprint` — lifecycle assessment need
- `Fit for 55` — EU climate package
- `EPBD compliance` — building energy performance
- `EN 15978` — carbon lifecycle standard

### Automated Daily Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  DAILY CRON (node-cron, 06:00 UTC)                         │
│                                                              │
│  1. Query TED API v3                                         │
│     POST api.ted.europa.eu/v3/notices/search                │
│     - CPV: 45000000 (all construction)                       │
│     - Countries: FIN, SWE, DEU, FRA, GBR                   │
│     - Date: yesterday                                        │
│     - Notice type: contract awards + new tenders            │
│                                                              │
│  2. Deduplicate against Supabase                            │
│     SELECT publication_number FROM ted_leads                 │
│     WHERE publication_number IN (...)                        │
│                                                              │
│  3. Enrich new leads                                        │
│     - Map buyer-country → DM language (SV/DE/FI/FR/EN)     │
│     - Generate tender-specific DM opener per language       │
│     - Flag ERP qualifier (SAP/IFS/Monitor/Visma/Dynamics)   │
│                                                              │
│  4. Insert into Supabase                                    │
│     INSERT INTO ted_leads (...)                              │
│                                                              │
│  5. Notify (optional)                                       │
│     - Email digest: "12 new construction leads today"       │
│     - Slack/webhook notification                             │
└─────────────────────────────────────────────────────────────┘
```

### Supabase Table: `ted_leads`

```sql
CREATE TABLE ted_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_number TEXT UNIQUE NOT NULL,
  title TEXT,
  buyer_name TEXT,
  buyer_country TEXT,
  notice_type TEXT,
  cpv TEXT,
  estimated_value TEXT,
  place_of_performance TEXT,
  publication_date DATE,
  ted_url TEXT,
  dm_language TEXT,          -- EN/SV/DE/FI/FR
  dm_personalization TEXT,   -- Pre-written tender-specific DM opener
  erp_qualifier TEXT,        -- SAP/IFS/Monitor/Visma/Dynamics or NULL
  linkedin_contact TEXT,     -- Filled manually or by future agent
  outreach_status TEXT DEFAULT 'new', -- new/dm_sent/replied/demo_booked/closed
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: only service_role and authenticated admin users
ALTER TABLE ted_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin access" ON ted_leads
  FOR ALL USING (auth.role() = 'authenticated');

-- Index for dedup check
CREATE INDEX idx_ted_leads_pub_number ON ted_leads (publication_number);
-- Index for daily digest
CREATE INDEX idx_ted_leads_status ON ted_leads (outreach_status, created_at DESC);
```

### ERP Qualifier Step

After identifying a lead, check if their ERP is one we integrate with natively:

| ERP | Integration status | DM angle |
|-----|--------------------|----------|
| **SAP S/4HANA** | Native (`src/integrations/erp/sap/`) | "We connect directly to your SAP — no manual data entry" |
| **IFS Cloud** | Native (`src/integrations/erp/ifs/`) | "We pull project data straight from IFS" |
| **Monitor ERP** | Native (`src/integrations/erp/monitor/`) | "Native Monitor integration — your data flows automatically" |
| **Visma** | Native (`src/integrations/erp/visma/`) | "Works with your Visma setup out of the box" |
| **Dynamics 365** | Native (`src/integrations/erp/dynamics/`) | "Direct Dynamics connector — live data, not exports" |
| **Other** | No native integration | Still a lead — focus on standalone compliance value |

**Where to check:** Company annual report (IT section), job postings mentioning ERP, LinkedIn profiles of IT staff.

### Implementation Script

**Exists now:** `scripts/ted-lead-sourcer.ts` — CLI tool for manual/automated TED queries

```bash
# Manual run — Finnish construction, last 7 days
npx tsx scripts/ted-lead-sourcer.ts --country=FIN --days=7

# JSON output for pipeline integration
npx tsx scripts/ted-lead-sourcer.ts --country=DEU --cpv=45210000 --output=json

# All countries, high-value only
npx tsx scripts/ted-lead-sourcer.ts --min-value=5000000 --days=1
```

**Next step:** Add Supabase insert + node-cron daily schedule. ~50-100 lines on top of existing script.

### eProcurement Ontology Technical Details

| Aspect | Detail |
|--------|--------|
| **Format** | RDF/OWL (semantic web standards) |
| **Access** | Public GitHub repository (OP-TED org) |
| **Documentation** | https://docs.ted.europa.eu |
| **License** | Open (EU public license) |
| **Platform** | Agnostic — works with any tech stack |
| **Updates** | Maintained by EC Publications Office |
| **No alternatives** | Only pan-European procurement ontology |

### DWS Agent: `ted-lead-sourcer`

```
Agent: ted-lead-sourcer
Input: { "cpv_codes": ["45000000"], "countries": ["FIN","SWE","DEU","FRA","GBR"], "min_value": 5000000, "notice_type": "award" }
Output: { "leads": [{ "company": "Skanska AB", "project": "School construction Malmö", "value": 45000000, "country": "SWE", "dm_language": "SV", "dm_personalization": "Jag såg att Skanska lade bud på...", "erp_qualifier": "SAP", "suggested_contacts": ["sustainability", "compliance", "cto"] }] }
```

This agent would be registered in AGENTS.md and exposed via MCP `tools/list`.

---

## 9. Key Contacts and Resources

| Resource | URL / Contact |
|----------|---------------|
| **TED Portal** | https://ted.europa.eu/en |
| **TED Browse by Map** | https://ted.europa.eu/TED/browse/browseByMap.do |
| **eProcurement Ontology Docs** | https://docs.ted.europa.eu |
| **eProcurement Ontology GitHub** | https://github.com/OP-TED |
| **TED Helpdesk** | OP-TED-HELPDESK@publications.europa.eu |
| **Maintained by** | EC Publications Office |

### Related DWS Documents

| Document | Relevance |
|----------|-----------|
| `Firehorse/Omnichannel/Investors/CONSTRUCTION_TEASER_DM.md` | DM templates that use TED-sourced leads (Tranche 2) |
| `investor-outreach/40_construction_CEO.md` | Tranche 1 target list (manually curated) |
| `AGENTS.md` | Agent registry — future `ted-lead-sourcer` agent |
| `DWS_MARKET_RESEARCH_STANDARD.md` | Competitive intelligence and data collection standards |

---

*Document Version 2.0 — 21 March 2026 — Lifetime Oy*
