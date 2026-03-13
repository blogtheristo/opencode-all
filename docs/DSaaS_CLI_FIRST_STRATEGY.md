# DSaaS CLI-First Strategy — Database Sovereignty as a Service

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/dsaas-cli-first-strategy-ePRaw | Date: 13.03.2026 | Changes: Autoresearch: rejected RedGet.io (pre-seed, unverifiable). Replaced with OceanScore (Series A, €5M, MSC/Döhle investors) as primary partner + ZERO44 (seed+, Berlin) as secondary. Added §10.4 partnership model with budget (€600–€1,800). Revised 7-phase timeline with OceanScore integration points. Windward disqualified (Israel/CLOUD Act)
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/dsaas-cli-first-strategy-ePRaw | Date: 13.03.2026 | Changes: Initial creation — Revised DSaaS strategy with CLI-first mandatory gateway, 30-day build plan, enterprise pricing (€499–€4,999/mo), Aiven ECE + TimescaleDB Hypercore HTAP stack, sovereignty enforcement, DWS IQ 6 sync gating

Session Links & References:
  - Claude Code (claude/dsaas-cli-first-strategy-ePRaw): https://github.com/blogtheristo/dws6/commits/claude/dsaas-cli-first-strategy-ePRaw
  - Related: DWS_SOVEREIGNTY_STANDARD.md (v1.1), DWS_DATA_STANDARD.md (v2.0), AGENTS.md (v2.2)

Document Status:
  - Created: 13.03.2026
  - Last Modified: 13.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Classification: INTERNAL — STRATEGY
  - Document Type: Product Strategy

Related Documents:
  - DWS_SOVEREIGNTY_STANDARD.md (v1.1 — EU sovereignty tiers, NIS2/EU AI Act compliance)
  - DWS_DATA_STANDARD.md (v2.0 — Aiven-first mandate, TimescaleDB Hypercore, two-tier HTAP)
  - DWS_SECURITY_STANDARD.md (v1.9 — KYA, shell command rules, CORS, SRI)
  - DWS_BRAND_STANDARD.md (v2.4 — sovereignty badges, product cards)
  - DWS_MARKET_RESEARCH_STANDARD.md (v1.1 — competitive intelligence)
  - AGENTS.md (v2.2 — SovereigntyMonitor agent, agent ecosystem)
  - docs/CLOUD_ENVIRONMENTS.md (v1.4 — 5 environments, Aiven sandbox)
  - product-catalog/README.md (v2.0 — 30-product catalog, lifecycle)

***

**Version:** 1.0
**Effective Date:** 2026-03-13
**Last Updated:** 2026-03-13
**Status:** Active — Strategy Approved
**Owner:** Lifetime Oy / DWS10.com
**Confidentiality:** Internal

---

## Executive Summary

**DSaaS (Database Sovereignty as a Service)** is Lifetime Oy's unified database product that replaces fragmented sovereignty, data, and compliance offerings with a single CLI-gated service built on Aiven ECE + TimescaleDB Hypercore HTAP + hard EU sovereignty enforcement.

**Three corrections this strategy makes:**

1. **Mandatory CLI entry point** — The CLI (`dws`) becomes the only door. No manual provisioning, no piecemeal purchases. All 14 previous fragmented offerings are retired into one product.
2. **Realistic 30-day timeline** — Day 7 = internal demo only (not production, not investor-announced). Full production = Day 30 with proper auth, CI/CD, and pilot revenue.
3. **Enterprise-grade pricing** — €499–€4,999/mo replaces the dangerously low €99/mo Pro tier. CSRD/NIS2-regulated buyers budget €10k–€100k+/year for compliance tooling.

**Core stack (unchanged technically):**
- **Local:** `timescale/timescaledb:2.25.2-pg17` Docker (exact Aiven parity)
- **Production:** Aiven ECE (Level 2) or EU-owned BYOC (Level 3) + automatic Hypercore compression
- **Sovereignty enforcement:** CLI refuses any non-EU region or non-CMEK deployment

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [CLI-First Mandatory Gateway](#2-cli-first-mandatory-gateway)
3. [Sovereignty Enforcement Architecture](#3-sovereignty-enforcement-architecture)
4. [Core Technical Stack](#4-core-technical-stack)
5. [30-Day Build Plan](#5-30-day-build-plan)
6. [Pricing Strategy](#6-pricing-strategy)
7. [Product Consolidation](#7-product-consolidation)
8. [DWS IQ 6 Integration](#8-dws-iq-6-integration)
9. [Competitive Positioning](#9-competitive-positioning)
10. [Go-to-Market](#10-go-to-market)
11. [Risk Assessment](#11-risk-assessment)
12. [Success Metrics](#12-success-metrics)
13. [Appendix: CLI Command Reference](#appendix-cli-command-reference)

---

## 1. Problem Statement

### 1.1 Fragmentation Risk

DWS IQ 6 has accumulated 14+ overlapping product SKUs across sovereignty, data services, cloud consulting, and compliance. Each can be purchased independently, creating:

- **Integration gaps** — Clients mix-and-match products that don't compose cleanly
- **Support burden** — Every combination is a unique support surface
- **Brand confusion** — Buyers cannot tell which product they actually need
- **Revenue leakage** — Piecemeal €99–€499 sales when the actual value delivered is €2k–€5k/month

### 1.2 Pricing Misalignment

The original €99/mo Pro tier drastically underprices the value for regulated buyers:

| Buyer segment | Annual compliance budget | Our old price | Revenue left on table |
|---------------|-------------------------|---------------|----------------------|
| Mid-size logistics (CSRD) | €20k–€50k/year | €1,188/year | 94–97% |
| Maritime/energy (NIS2) | €50k–€100k+/year | €1,188/year | 97–99% |
| Construction (EU AI Act) | €30k–€80k/year | €1,188/year | 96–98% |

### 1.3 Timeline Reality

A 7-day "production-ready + investor announce" plan carries unacceptable risk:
- No time for proper auth/error handling/CI
- Investor backfire if demo fails or security issues emerge
- Reputational damage to Lifetime Oy brand

---

## 2. CLI-First Mandatory Gateway

### 2.1 Principle

The CLI is the **single source of truth** and the **enforced gateway** for everything DSaaS. This follows the same pattern used by Supabase, Aiven, Timescale, and Vercel — the CLI became non-optional for production features.

### 2.2 What the CLI Gates

| Capability | CLI Command | Enforcement |
|------------|-------------|-------------|
| Database provisioning | `dws create --level 2` | Only way to get a provisioned database |
| DWS IQ 6 data sync (hot path) | `dws deploy --iq6-sync` | Blocks without CLI-provisioned database |
| Compliance audit packs | `dws compliance export` | NIS2/CSRD/EU AI Act reports CLI-only |
| Sovereignty status | `dws sovereignty status` | Real-time sovereignty score |
| Template deployment | `dws init --template climate-esg` | Templates live exclusively in CLI |
| Client onboarding | `dws init --sovereignty-level 3` | Contract clause requires CLI init |
| Local development | `dws local up` | Docker parity environment |

### 2.3 Mandatory Adoption Mechanism

- **All DWS IQ 6 data sync** requires a CLI-provisioned database (`dws deploy --iq6-sync`). No manual connection strings allowed.
- **Compliance audit packs** (NIS2/CSRD/EU AI Act) generated only via `dws compliance export`.
- **Every consulting engagement** starts with `dws init --sovereignty-level X` (contract template includes this clause).
- **Templates** (climate/ESG schema, Firehorse reporting models) live exclusively inside the CLI.
- **New clients** receive a one-time onboarding voucher that expires after 30 days unless they run `dws aiven create` or `dws create --level 3`.

### 2.4 Output Format

All CLI output is structured JSON (machine-readable) with human-friendly TTY formatting when run interactively. This aligns with the **Build for Agents** rule in CLAUDE.md:

```bash
# Human-friendly (TTY)
$ dws sovereignty status
┌─────────────────────────────────┐
│ Sovereignty Score: 92/100       │
│ Tier: SOVEREIGN (Level 1)       │
│ Region: europe-north1 (Finland) │
│ CLOUD Act Exposure: NONE        │
│ CMEK: Enabled (AES-256)         │
└─────────────────────────────────┘

# Machine-readable (piped/CI)
$ dws sovereignty status --json
{
  "score": 92,
  "tier": "sovereign",
  "level": 1,
  "region": "europe-north1",
  "cloudActExposure": "none",
  "cmek": { "enabled": true, "algorithm": "AES-256" }
}
```

---

## 3. Sovereignty Enforcement Architecture

### 3.1 Sovereignty Levels (Aligned with DWS_SOVEREIGNTY_STANDARD.md)

| Level | Name | Infrastructure | CLOUD Act | Use Case |
|-------|------|---------------|-----------|----------|
| **1** | EU-Sovereign | EU-owned company + EU infrastructure | Zero exposure | NIS2/CSRD mandatory, government |
| **2** | Managed EU | Aiven ECE (Finnish company, EU DCs) | Zero exposure | Production regulated workloads |
| **3** | Strict Sovereign | BYOC on Hetzner/Exoscale/OVH | Zero exposure | Air-gapped, defense, critical infra |
| **Local** | Development | Docker (timescale/timescaledb:2.25.2-pg17) | N/A | Local dev with exact prod parity |

### 3.2 Hard Enforcement Rules

The CLI **refuses** any deployment that violates sovereignty constraints:

```
$ dws create --region us-east-1 --level 2
ERROR: Region us-east-1 is outside EU. Level 2 (Managed EU) requires
EU data residency. Allowed regions: europe-north1, eu-central-1,
eu-west-1, eu-north-1.

$ dws create --provider aws --level 1
ERROR: Provider AWS is US-owned (CLOUD Act exposed). Level 1
(EU-Sovereign) requires EU-owned infrastructure. Allowed providers:
Aiven, Hetzner, Exoscale, OVHcloud, Scaleway, UpCloud.
```

### 3.3 CLOUD Act Provider Blocklist

Maintained in `src/agents/sovereignty-monitor.agent.ts` and enforced by CLI:

**Blocked (US-owned, CLOUD Act / FISA 702 exposure):**
AWS, Azure, GCP, MongoDB Atlas, DigitalOcean, Vercel, Railway, Render

**Approved (EU-owned, CLOUD Act free):**
Aiven (Finland), Hetzner (Germany), OVHcloud (France), Scaleway (France), Exoscale (Switzerland), UpCloud (Finland), Infomaniak (Switzerland), Contabo (Germany)

---

## 4. Core Technical Stack

### 4.1 Database Layer

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Engine** | PostgreSQL 17 + TimescaleDB 2.25.x | HTAP (hybrid transactional + analytical) |
| **Columnar** | Hypercore (automatic row → columnar) | 10–100× analytics speedup, 90–98% compression |
| **Hosting** | Aiven ECE (Level 2) or BYOC (Level 3) | Managed, 99.99% SLA, EU-only |
| **Local** | `timescale/timescaledb:2.25.2-pg17` Docker | Exact production parity |
| **Extensions** | pgvector, pg_stat_statements, pg_cron | Vector search, monitoring, scheduling |

### 4.2 Extension Governance (from DWS_DATA_STANDARD.md)

| Extension | Status | Reason |
|-----------|--------|--------|
| TimescaleDB + Hypercore | **APPROVED** (primary) | Aiven-native, HTAP, compression |
| pgvector | **APPROVED** | Vector search for AI/LLM |
| pg_stat_statements | **APPROVED** | Performance monitoring |
| pg_cron | **APPROVED** | Job scheduling |
| pg_duckdb | **BLOCKED** on Aiven | Not in Aiven whitelist |
| pg_mooncake | **FUTURE** | Evaluate for edge analytics (GN100) |

### 4.3 Two-Tier HTAP Architecture (from DWS_DATA_STANDARD.md)

```
TIER 1: Aiven Managed (Production)
┌─────────────────────────────────────────────────┐
│ Aiven ECE / BYOC                                │
│ PostgreSQL 17 + TimescaleDB Hypercore            │
│ Row → auto-columnar → compressed                 │
│ 99.99% SLA | EU-only | CMEK                     │
└─────────────────────────────────────────────────┘
         │ Replication / sync
         ▼
TIER 2: GN100 Edge (Analytics)
┌─────────────────────────────────────────────────┐
│ Acer Veriton GN100 (Helsinki)                    │
│ Self-hosted PostgreSQL + TimescaleDB             │
│ Local analytics + edge processing                │
│ Lifetime Fleet integration                       │
└─────────────────────────────────────────────────┘
```

### 4.4 Local Development Parity

```yaml
# docker-compose.dsaas.yml
services:
  dsaas-db:
    image: timescale/timescaledb:2.25.2-pg17
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: dsaas_local
      POSTGRES_USER: dsaas
      POSTGRES_PASSWORD: ${DSAAS_LOCAL_PASSWORD}
    volumes:
      - dsaas_data:/var/lib/postgresql/data
      - ./templates/init.sql:/docker-entrypoint-initdb.d/init.sql
    command: >
      postgres
        -c shared_preload_libraries='timescaledb'
        -c timescaledb.license=apache

volumes:
  dsaas_data:
```

---

## 5. 30-Day Build Plan

### Phase 1: Local-First + Sovereignty Check (Days 1–3) — Show the Problem

| Deliverable | Command | Status |
|-------------|---------|--------|
| CLI project scaffold (Node.js/TypeScript) | `dws init` | Build |
| Local Docker environment (Supabase/PG + TimescaleDB) | `dws local up` | Build |
| Hard EU-region lock enforcer | (internal module) | Build |
| JSON + TTY dual output | All commands | Exists |

**Day 3 output:** Maritime prospect sees `dws local up` spin a sovereign database in 30 seconds.

### Phase 2: Sovereignty Scoring + Aiven (Days 4–8) — Show the Solution

| Deliverable | Command | Status |
|-------------|---------|--------|
| Real DB sovereignty introspection (region, encryption, RLS) | `dws sovereignty check` | Build |
| Sovereignty status dashboard (CLI) | `dws sovereignty status` | Build |
| Aiven API integration | `dws create --level 2` | Build |
| TimescaleDB auto-enable on Aiven | (post-provisioning hook) | Build |
| Hypercore compression policy | (auto-applied to hypertables) | Build |

**Day 8 output:** Run `dws sovereignty check` against any PostgreSQL → get NIS2 gap report. One-command Aiven provisioning works.

### Phase 3: Internal Demo + Partnership Prep (Days 9–11) — Validate

| Deliverable | Details | Status |
|-------------|---------|--------|
| Internal demo (team-only) | Full CLI walkthrough: local → check → create → sovereignty score | Demo |
| OceanScore tech stack research | Public docs, API docs, job postings for DB/infra clues | Research |
| OceanScore-specific demo deck | Tailored to EU ETS data sovereignty + NIS2 gaps | Build |
| Demo recording | Loom/screen capture for async sharing | Document |

**Day 11 output:** Internal team aligned. OceanScore partnership deck ready. Outreach begins Day 12.

### Phase 4: NIS2 Compliance + Maritime Templates (Days 12–16) — Maritime-Specific

| Deliverable | Command | Status |
|-------------|---------|--------|
| NIS2 compliance export | `dws compliance export --regulation nis2` | Build |
| CSRD compliance export | `dws compliance export --regulation csrd` | Build |
| EU AI Act audit trail | `dws compliance export --regulation eu-ai-act` | Build |
| PDF report generation | `dws compliance export --format pdf` | Build |
| Maritime template (AIS, vessel telemetry, port sensors) | `dws init --template maritime-nis2` | Build |
| Hetzner/Exoscale BYOC modules | `dws create --level 3 --provider hetzner` | Build |

### Phase 5: Auth + OceanScore Live Demo (Days 17–21) — Partnership Demo

| Deliverable | Command | Status |
|-------------|---------|--------|
| OAuth2 + Lifetime Oy SSO | `dws auth login` | Build |
| API key management | `dws auth token create` | Build |
| DWS IQ 6 hot data sync | `dws deploy --iq6-sync` | Build |
| Mandatory CLI gating (blocks non-CLI provisioning) | (enforcement layer) | Build |
| OceanScore live demo | `dws sovereignty check` against EU ETS emissions schema | Partnership |

**Day 21 output:** OceanScore sees DSaaS running under their compliance stack. Partnership terms discussed.

### Phase 6: Dashboard + CI/CD (Days 22–26) — Production Ready

| Deliverable | Command | Status |
|-------------|---------|--------|
| Pricing tier enforcement | (billing integration) | Build |
| TUI dashboard | `dws dashboard` | Build |
| Web dashboard (simple) | (dws10.com/sovereignty/) | Build |
| Full test suite | `npm run test` | Build |
| CI/CD pipeline | GitHub Actions | Build |
| Error handling + retries | All commands | Build |
| Template deployment | `dws init --template climate-esg` | Build |

### Phase 7: Maritime Pilot Launch (Days 27–30) — Go-to-Market

| Deliverable | Details | Status |
|-------------|---------|--------|
| Documentation | CLI reference, tutorials, API docs | Build |
| dws10.com/sovereignty landing page | Product page with pricing | Build |
| Maritime pilot onboarding | Via OceanScore partnership or direct maritime operator | Launch |
| Partnership agreement | OceanScore revenue-share or co-sell terms | Close |
| Investor update | "DSaaS MVP live with maritime pilot" | Communicate |

---

## 6. Pricing Strategy

### 6.1 DSaaS Pricing Tiers (Replaces All 14 Old Products)

| Tier | Monthly | One-time Setup | What's Included | Target Buyer |
|------|---------|----------------|-----------------|-------------|
| **Free** | €0 | €0 | Local Docker + Level 1 sovereignty + basic templates | Dev / edge / pilots |
| **Pro** | €499 | €1,250 | Level 2 Aiven ECE + Hypercore HTAP + DWS IQ 6 sync + sovereignty dashboard | Mid-size regulated (logistics, real estate) |
| **Enterprise** | €2,499–€4,999 | €7,500–€15,000 | Level 3 strict sovereign (Hetzner/Exoscale BYOC + CMEK) + dedicated EU support + full audit packs + custom schemas | CSRD/NIS2 heavy (energy, maritime, construction) |
| **Premium Bundle** | +€1,500 add-on | €5,000 | Full Lifetime World Model integration + Firehorse reporting | Existing DWS IQ 6 clients |

### 6.2 Pricing Rationale

Benchmarked against real 2026 market rates:

| Competitor | Comparable tier | Monthly price |
|-----------|----------------|---------------|
| Aiven Business | Managed PostgreSQL + monitoring | €200–€500/mo |
| Aiven Premium | Enterprise + BYOC + SLA | €1,900+/mo |
| Supabase Enterprise | Custom pricing | €2,000–€10,000/mo |
| NIS2-compliant sovereign clouds | CMEK + audit + EU-staff | 20–50% premium over standard |

**Our premium is justified by:**
- Hard sovereignty enforcement (not just EU hosting, but CLOUD Act-free guarantee)
- Automated NIS2/CSRD/EU AI Act compliance audit packs
- DWS IQ 6 agent ecosystem integration
- TimescaleDB Hypercore HTAP (not available from generic PostgreSQL providers)

### 6.3 Revenue Projections (Conservative)

| Scenario | Clients (Year 1) | Mix | ARR |
|----------|-------------------|-----|-----|
| **Conservative** | 5 Pro + 2 Enterprise | 70/30 | €90k |
| **Base** | 10 Pro + 5 Enterprise | 60/40 | €210k |
| **Optimistic** | 20 Pro + 10 Enterprise | 50/50 | €420k |

---

## 7. Product Consolidation

### 7.1 Retired Products (Merged into DSaaS)

The following existing products are **retired as standalone offerings** and consolidated into DSaaS tiers:

| Old Product | Old SKU | Old Price | Now Included In |
|-------------|---------|-----------|----------------|
| Firehorse Data Services | DWS-DS-001 | €899 one-time | Pro tier (ongoing) |
| Sovereignty Cloud Consulting | DWS-SCC-001 | €1,500/mo | Enterprise tier (included) |
| Database migration consulting | (ad-hoc) | €150/hr | Pro/Enterprise setup fee |

### 7.2 Products That Remain Independent

| Product | Reason |
|---------|--------|
| DWS IQ Platform | Core platform, DSaaS is an add-on |
| Firehorse Suite (Report, Automation, Omnichannel, ContentMS) | Separate product line |
| Lifetime World Model (Climate LLM) | Separate AI product |
| Advisory & Training products | People-driven, not infrastructure |

---

## 8. DWS IQ 6 Integration

### 8.1 Mandatory Gating

DWS IQ 6 data sync is **gated behind CLI provisioning**:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│ DWS IQ 6     │─────▶│ dws deploy   │─────▶│ DSaaS Database   │
│ Agent Swarm  │      │ --iq6-sync   │      │ (Aiven ECE)      │
└──────────────┘      └──────────────┘      └──────────────────┘
                           │
                           │ Validates:
                           ├─ CLI-provisioned? ✓
                           ├─ Sovereignty level met? ✓
                           ├─ CMEK enabled? ✓
                           └─ Region EU-only? ✓
```

### 8.2 Sync Architecture

| Data flow | Direction | Frequency | Protocol |
|-----------|-----------|-----------|----------|
| Agent telemetry | IQ6 → DSaaS | Real-time (WebSocket) | JSON-RPC 2.0 |
| Compliance snapshots | IQ6 → DSaaS | Hourly (cron) | REST API |
| Sovereignty scores | DSaaS → IQ6 | On-demand | MCP tool call |
| Audit logs (EU AI Act Art 12) | IQ6 → DSaaS | Real-time | Append-only hypertable |

### 8.3 Templates

Pre-built schemas deployed via `dws init --template`:

| Template | Schema | Target |
|----------|--------|--------|
| `climate-esg` | ESG reporting, emissions, Scope 1-3 | Climate/sustainability |
| `firehorse-reporting` | Firehorse Report models, audit trails | Firehorse users |
| `nis2-compliance` | NIS2 incident tracking, asset inventory | Regulated infrastructure |
| `csrd-reporting` | CSRD double materiality, ESRS metrics | Large enterprises |
| `fleet-telemetry` | IoT sensor data, Lifetime Fleet | Industrial IoT |

---

## 9. Competitive Positioning

### 9.1 Competitive Landscape (March 2026)

| Competitor | Strengths | Weakness vs DSaaS |
|-----------|-----------|-------------------|
| **Aiven** (direct) | EU-sovereign, managed PostgreSQL, TimescaleDB | No compliance automation, no agent integration, no sovereignty scoring |
| **Supabase** | Developer experience, real-time, Auth | US-owned (CLOUD Act), no NIS2/CSRD tooling |
| **Neon** | Serverless, branching, scale-to-zero | US-owned, no sovereignty enforcement |
| **PlanetScale** | Vitess-based, horizontal scaling | MySQL-only, US-owned, no EU compliance |
| **Timescale Cloud** | Native TimescaleDB, Hypercore | US-owned (Timescale Inc.), limited EU compliance |
| **Hetzner/OVH** (IaaS) | EU-sovereign, cheap VMs | No managed PostgreSQL, no compliance automation |

### 9.2 Unique Value Proposition

**DSaaS is the only product that combines all four:**

1. **Hard sovereignty enforcement** — CLI refuses non-EU/non-CMEK deployments
2. **Automated compliance** — NIS2/CSRD/EU AI Act audit packs generated by CLI
3. **Agent integration** — DWS IQ 6 agent swarm data sync, built-in
4. **HTAP performance** — TimescaleDB Hypercore (10–100× analytics on same database)

No competitor offers all four. Aiven has #1 but not #2–#4. Supabase has developer experience but fails #1.

---

## 10. Go-to-Market

### 10.1 Target Segments (Priority Order)

1. **Maritime/logistics** — NIS2-regulated, existing DWS IQ 6 pipeline, high compliance budget
2. **Construction** — EU AI Act exposure (autonomous equipment), Firehorse existing users
3. **Energy/utilities** — NIS2 + CSRD dual regulation, highest willingness-to-pay
4. **Real estate** — CSRD reporting requirements, mid-market budget

### 10.2 Sales Motion

| Stage | Action | Tool |
|-------|--------|------|
| **Awareness** | dws10.com/sovereignty landing page | Cloudflare Pages |
| **Discovery** | `dws sovereignty status` (free, shows current exposure) | CLI (Free tier) |
| **Evaluation** | `dws local up` + `dws init --template` | CLI (Free tier) |
| **Pilot** | 30-day Pro trial with dedicated onboarding | CLI + Support |
| **Close** | Annual contract with setup fee | Sales |

### 10.3 Landing Page Requirements

**URL:** dws10.com/sovereignty/ (existing page to be updated)

Must include:
- Sovereignty tier explanation (Level 1–3)
- Pricing grid (Free / Pro / Enterprise / Premium Bundle)
- CLI quick-start (`dws init` → `dws local up` → `dws sovereignty status`)
- NIS2/CSRD compliance badge
- Aiven partnership reference
- Customer pilot testimonials (post-Day 30)

### 10.4 Platform Partnership Model (Maritime-First GTM)

#### 10.4.1 Autoresearch Results (March 2026)

Partnership candidates vetted via DWS autoresearch. RedGet.io (original candidate) **rejected** — no funding records, no verifiable founder profile, no customers. Pre-seed or pre-product risk too high.

**Vetted shortlist:**

| # | Company | Stage | Funding | HQ | What They Do | DB Need |
|---|---------|-------|---------|-----|-------------|---------|
| 1 | **OceanScore** | Series A | €5M (Sep 2024) | Funchal/Hamburg | EU ETS + FuelEU Maritime compliance platform | Sovereign PostgreSQL for emissions data, audit trails |
| 2 | **ZERO44** | Seed+ | €2.5M+ (2023–2025) | Berlin | EU ETS invoicing, trading, CII management | Sovereign DB for transaction records, compliance reporting |
| 3 | **Windward** | Late-stage | $32M+ | Tel Aviv | Maritime AI risk/compliance (116K+ companies) | ~~Disqualified: Israel-based, CLOUD Act exposure via US investors~~ |

#### 10.4.2 Primary Target: OceanScore (Series A, €5M)

**Why OceanScore is the right partner:**

- **Funded and growing** — Series A closed Sep 2024, expanding to Singapore and Tokyo
- **Strategic investors** — MSC (world's largest shipping company), Peter Döhle, Stolt Ventures, Motion Ventures
- **Real customers** — 100+ shipping companies using EU ETS + FuelEU Maritime compliance tools
- **EU-based** — HQ in Funchal (Portugal), offices in Hamburg, Poland, Singapore, Tokyo
- **They need us** — Their platform generates massive emissions/compliance data that needs NIS2-compliant sovereign storage. They don't build DB infrastructure — they build compliance software on top of it.

**Partnership structure:**

| Element | Terms |
|---------|-------|
| **Pilot period** | 3 months free — OceanScore evaluates DSaaS as sovereign DB layer for compliance data |
| **Revenue model** | Revenue-share when OceanScore's enterprise clients upgrade to sovereign DB tier |
| **Co-sell** | Joint pitch: "OceanScore for EU ETS/FuelEU compliance + DSaaS for NIS2-sovereign database" |
| **Integration** | OceanScore's compliance data runs on `dws create --level 2` (Aiven ECE, EU-region-locked) |
| **Exit clause** | Either party can exit after pilot; OceanScore keeps data, migrates off DSaaS if needed |

**Pitch (founder-to-founder, to OceanScore leadership):**

> "Your enterprise clients — MSC, Döhle, Stolt — will face NIS2 mandatory compliance for their data infrastructure within 12 months. EU ETS data at 100% coverage from 2026 means audit trail volumes are about to explode. We make the sovereign database problem disappear with one CLI command. You focus on emissions compliance, we handle NIS2-compliant infrastructure. When your enterprise clients pay for sovereignty tier, we split the upside."

**Timeline:**

| Day | Action |
|-----|--------|
| 1–3 | Research OceanScore's tech stack (public docs, API docs, job postings for DB clues) |
| 4–8 | Build `dws local up` + `dws sovereignty check` tailored to emissions/compliance schema |
| 9–11 | Internal demo + prepare OceanScore-specific deck |
| 12–14 | Warm intro via maritime network or direct LinkedIn outreach to OceanScore leadership |
| 15–18 | 30-min discovery: what DB does OceanScore use? Where are NIS2 gaps? |
| 19–21 | Live demo: `dws sovereignty check` against OceanScore-like PostgreSQL |
| 27–30 | Partnership terms discussed, pilot agreement |

#### 10.4.3 Secondary Target: ZERO44 (Seed+, Berlin)

**Why ZERO44 as backup:**

- Berlin-based, EU-native
- MariApps as distribution partner (Singapore reach)
- EU ETS invoicing = financial transaction data that requires sovereign storage
- Smaller than OceanScore but growing; seed+ with follow-on funding in 2025

**Risk:** Still seed-stage. If they can't co-sell, the partnership is just a reference customer. Acceptable as secondary.

#### 10.4.4 Partnership Budget

| Item | Cost | Notes |
|------|------|-------|
| OceanScore pilot infrastructure (3 months free Aiven ECE) | ~€600 | Pro tier at cost, subsidized |
| Demo environment (local Docker + Aiven dev) | €0 | Free tier |
| Travel (1 meeting in Hamburg or Funchal) | €500–€1,200 | Optional; video call first |
| Custom maritime-nis2 template development | €0 | Internal engineering time |
| **Total partnership GTM budget** | **€600–€1,800** | Phase 1 only |

**Fallback:** If neither OceanScore nor ZERO44 close, pivot to direct maritime operator outreach using the same CLI demo assets. The demo works regardless of the GTM channel.

---

## 11. Risk Assessment

### 11.1 Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Aiven API changes break provisioning | Low | High | Pin API version, integration tests in CI |
| Enterprise buyers reject CLI-only | Medium | Medium | Web dashboard (Phase 5) + white-glove onboarding |
| Timeline slips past 30 days | Medium | Low | Phase 1–2 are independent of Phase 3–6; ship incrementally |
| Competitor launches sovereign PostgreSQL | Low | Medium | First-mover advantage + DWS IQ 6 integration moat |
| Pricing too high for SMEs | Low | Low | Free tier + Pro at €499 covers SME budget |
| OceanScore partnership doesn't close | Medium | Low | Demo assets work for direct maritime outreach or ZERO44 fallback; partnership is accelerator, not dependency |
| OceanScore already has sovereign DB vendor | Low | Medium | DSaaS adds NIS2 compliance automation + sovereignty scoring that generic DB vendors don't offer |

### 11.2 What We Are NOT Doing

- **NOT announcing to investors before Day 30.** Day 11 is internal demo only.
- **NOT supporting non-PostgreSQL databases.** PostgreSQL + TimescaleDB is the standard.
- **NOT building a custom database engine.** We wrap Aiven/BYOC with sovereignty + compliance.
- **NOT competing with Aiven on managed PostgreSQL.** We are a layer above (sovereignty + compliance + agent integration).

---

## 12. Success Metrics

### 12.1 30-Day Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| CLI commands functional | 15+ commands | Integration tests |
| Local Docker parity | 100% schema match | Automated comparison |
| Aiven provisioning | < 3 minutes | CLI timing |
| Sovereignty score accuracy | > 95% match with manual audit | SovereigntyMonitor agent validation |
| Pilot clients onboarded | 1 partnership + 1 direct | CRM tracking |

### 12.2 90-Day Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Paying customers | 5+ Pro, 2+ Enterprise | Billing system |
| ARR run rate | €90k+ | Revenue tracking |
| CLI adoption rate | 100% of new clients | Onboarding tracking |
| NPS score | > 50 | Customer survey |
| Compliance audit packs generated | 20+ | CLI telemetry |

---

## Appendix: CLI Command Reference

### Database Lifecycle

```bash
dws create --level 2                          # Provision Aiven ECE database
dws create --level 3 --provider hetzner       # Provision BYOC on Hetzner
dws local up                                  # Start local Docker database
dws local down                                # Stop local Docker database
dws status                                    # Show database status
dws destroy --confirm                         # Decommission database
```

### Sovereignty

```bash
dws sovereignty status                        # Current sovereignty score
dws sovereignty check --provider aiven        # Check provider compliance
dws sovereignty audit                         # Full sovereignty audit report
```

### Compliance

```bash
dws compliance export --regulation nis2       # Generate NIS2 audit pack
dws compliance export --regulation csrd       # Generate CSRD audit pack
dws compliance export --regulation eu-ai-act  # Generate EU AI Act audit pack
dws compliance export --format pdf            # Export as PDF
dws compliance status                         # Compliance dashboard
```

### DWS IQ 6 Integration

```bash
dws deploy --iq6-sync                         # Enable hot data sync
dws init --template climate-esg               # Deploy ESG schema template
dws init --template firehorse-reporting       # Deploy Firehorse models
dws init --sovereignty-level 2                # Initialize with sovereignty level
```

### Authentication

```bash
dws auth login                                # OAuth2 / Lifetime Oy SSO
dws auth token create                         # Generate API token
dws auth whoami                               # Show current identity
```

### Agent Ecosystem

```bash
dws agents                                    # List all available agents
dws run sovereignty-monitor --input '{}'      # Run sovereignty assessment
dws run compliance --input '{"reg":"CSRD"}'   # Run compliance check
```

---

## Document Footer

**Document:** DSaaS CLI-First Strategy
**Classification:** Internal — Strategy
**Owner:** Lifetime Oy
**Approved by:** Risto Paarni, CEO
**Next review:** 2026-04-13 (30 days)
