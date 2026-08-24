# PostgreSQL Columnar & HTAP Extension Evaluation for DWS6/DWS7

***
# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:
  - Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Major update — Hydra→Supabase Warehouse merger (Feb 2026), pg_mooncake→Databricks (Oct 2025), TimescaleDB Hypercore deep-dive, ClickBench rankings, Aiven whitelist reality (pg_duckdb NOT supported), full 2026 comparison table, EU compliance analysis with DPA/Schrems II
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Initial field note — evaluation of Hydra-like PostgreSQL columnar extensions for DWS6 and DWS7 HTAP architecture

Document Status:
  - Created: 12.03.2026
  - Last Modified: 13.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Context

DWS6 runs on Supabase PostgreSQL (EU, europe-north1) with Aiven PostgreSQL (EU Finland) decided for V1 sovereign migration ($5/mo Developer + $75/mo Startup). Current database has **no columnar or HTAP capabilities** — all analytics run against transactional heap tables with standard B-tree and GIN indexes.

As DWS7 scales toward IoT telemetry (Phase 4: sensors → Jetson Orin Nano → Cloud Run → EU ETS), agent swarm execution logs, and 7-year Article 12 audit retention, the need for columnar storage + analytical query acceleration is clear.

**Decision Drivers:**
1. Agent metrics/costs growing daily — need time-series optimization
2. Article 12 audit log is append-only with 7-year retention — compression critical
3. Campaign funnel analytics hit raw event tables — no pre-aggregation
4. DWS7 IoT pipeline (PR #151-157) will generate high-volume sensor data
5. EU Data Act 2023/2854 requires IoT data portability → open formats (Iceberg/Parquet)

## The Story

### Hydra → Supabase Warehouse (February 2026)

Hydra pioneered the "columnar Table Access Method inside PostgreSQL" pattern — `CREATE TABLE ... USING columnar` with DuckDB-powered vectorized execution. This gave teams true HTAP (transactional tables stay heap; analytics tables become columnar) with zero data movement, same SQL/clients, and seamless joins.

**In February 2026, Hydra's core team and pg_duckdb joined Supabase** to build "Supabase Warehouse" — an open Iceberg-based columnar storage + analytics acceleration layer. This keeps everything 100% Postgres wire-compatible with true HTAP (heap tables for OLTP + columnar for OLAP, seamless joins). Hydra is no longer a standalone managed service.

By 2026, six production-ready solutions exist. All follow the same philosophy: Postgres extensions that add columnar/hybrid storage inside one database. No ETL, no separate warehouse.

### Comprehensive Comparison Table (2026 Status)

| Solution | Storage Type | Execution Engine | Updates/Deletes | Analytics Speed (vs Postgres) | Best Workload | Aiven? | Supabase? | Self-Host? | EU Residency | Maturity (2026) |
|----------|-------------|-----------------|-----------------|-------------------------------|---------------|--------|-----------|------------|-------------|-----------------|
| **Hydra (→Supabase Warehouse)** | Native columnar (TAM) + Iceberg | DuckDB vectorized + PG fallback | Append-optimized | 100–600× | General analytics, dashboards, HTAP | No | Native (alpha Warehouse) | Yes (original Docker) | Yes (Supabase EU Frankfurt) | High — Hydra team now at Supabase |
| **pg_duckdb** | Accelerates heap + external S3/Iceberg | Embedded DuckDB | Full Postgres speed | 50–600× | Query acceleration without schema change | **No** | Yes (database.dev) | **Excellent** | Yes (self-host) | Very High — production default |
| **pg_mooncake (→Databricks)** | Iceberg/Delta Lake columnar | DuckDB + PG metadata | Excellent (full ACID) | Top-10 ClickBench | Lakehouse-native + Spark/Trino interop | No | Custom install | Excellent | Yes (self-host) | High — Lakehouse revolution |
| **ParadeDB pg_analytics** | On-disk columnar + S3 | DuckDB | Good | 10–100× | Search + analytics combo | No | Yes (database.dev) | Excellent | Yes | High — strong S3 integration |
| **TimescaleDB Hypercore** | Auto hybrid row→columnar | Postgres + SIMD vectorization | Full ACID (best-in-class) | 10–100× (real-time focus) | Time-series, real-time, IoT/logs | **Native (2.25.x)** | Yes (pre-installed) | Excellent | Yes | Very High — 98% compression; auto tiering |
| **Citus Columnar (Microsoft)** | Native columnar | Postgres executor | Good | 5–50× | Distributed sharded analytics | No | No | Yes | Yes | Medium — older codebase |

### Key Performance Notes (ClickBench + real-world 2025–2026)

- **Pure columnar** (Hydra, pg_mooncake, pg_duckdb) dominate raw scan/aggregate speed
- **Hypercore** wins for real-time workloads (fresh data stays row-store → instant queries + updates)
- All beat vanilla Postgres by **10–600×** on analytics while keeping transactional tables untouched
- **Compression:** 5–10× (columnar) or up to **98%** (Hypercore time-series)
- **Lakehouse support:** pg_mooncake and ParadeDB strongest (native Iceberg/Delta reads/writes)
- **Updates/deletes:** Hypercore and pg_mooncake best; pure columnar slower (append-mostly design)

### Detailed Analysis (2026 Updated)

#### 1. Hydra (→ Supabase Warehouse, Feb 2026)

- **Status:** Hydra's core team joined Supabase. No longer standalone managed service.
- **New form:** "Supabase Warehouse" — open Iceberg-based columnar + analytics acceleration
- **Performance:** 100–600× on ClickBench complex queries
- **DWS fit:** Available to DWS only via Supabase (Tier 3 sovereignty). Not on Aiven.
- **Decision:** Monitor Supabase Warehouse maturity. DWS may benefit post-alpha if Supabase EU sovereignty improves.

#### 2. pg_duckdb (DuckDB team + Hydra + MotherDuck)

- **How it works:** Embeds full DuckDB engine inside Postgres. Automatically routes heavy analytical queries to vectorized columnar execution (`duckdb.force_execution=true`). Reads/writes Postgres heap tables + external S3/Iceberg.
- **Performance:** 50–600× on heavy scans/joins. Top-tier ClickBench.
- **DWS fit:** Ideal for edge device (Acer GN100) analytics. **NOT available on Aiven** (whitelist blocks it).
- **Decision:** Self-hosted and edge only. Already deployed on GN100 edge PostgreSQL.

#### 3. pg_mooncake (Mooncake Labs → acquired by Databricks, Oct 2025)

- **How it works:** Columnar TAM (`CREATE TABLE ... USING columnstore`). Stores in open Iceberg/Delta Lake/Parquet format. Full ACID writes to lakehouse.
- **Performance:** Top-10 ClickBench. Often beats Hydra.
- **DWS fit:** Phase 3 lakehouse integration. EU Data Act compliance via open formats. Spark/Trino interop.
- **Constraint:** Self-hosted only. Databricks acquisition (US) = Tier 3 risk, but open source mitigates.

#### 4. ParadeDB pg_analytics (ex-pg_lakehouse)

- **How it works:** DuckDB-based columnar analytics + direct S3 data lake querying.
- **DWS fit:** Redundant — DWS already has pg_duckdb on edge + native TSVECTOR for search.
- **Constraint:** Self-hosted only.

#### 5. Citus Columnar (Microsoft / Azure)

- **How it works:** Original `USING columnar` syntax. Horizontal scaling with Citus sharding.
- **DWS fit:** Not recommended. Azure-locked, older codebase, US sovereignty concern.

#### 6. TimescaleDB Hypercore (Primary Recommendation)

- **How it works:** Hypertables with automatic hybrid row→columnar tiering. Fresh data stays row-store (instant writes + queries); older data automatically compresses to columnar. Continuous aggregates for real-time dashboards.
- **Performance:** 10–100× for real-time focus. 98% compression on time-series data.
- **DWS fit:** **PRIMARY recommendation. The ONLY columnar/HTAP option on Aiven's extension whitelist.** Perfect for agent metrics, audit logs, IoT sensors, event data.
- **Managed:** Aiven native (latest 2.25.x as of March 2026). Zero-ops management.
- **Local dev:** Mirror exactly with open-source TimescaleDB Docker image. Zero code changes promoting to Aiven.

### Critical Finding: Aiven Extension Whitelist

**Aiven's strict extension whitelist blocks pg_duckdb, pg_mooncake, Hydra, and ParadeDB.** Only TimescaleDB is available as a columnar/HTAP option on Aiven managed PostgreSQL.

| Extension | Aiven Whitelist | Implication |
|-----------|----------------|-------------|
| TimescaleDB | **Allowed** (native, 2.25.x) | Production path for managed |
| pg_duckdb | **Blocked** | Edge/self-hosted only |
| pg_mooncake | **Blocked** | Self-hosted only (Phase 3) |
| Hydra | **Blocked** | Supabase only |
| ParadeDB | **Blocked** | Self-hosted only |
| Citus | **Blocked** | Azure only |

This is the single most important finding: **Aiven + TimescaleDB Hypercore is the only viable managed HTAP path for DWS.**

### Extension Availability Matrix (2026 Updated)

| Extension | Supabase (MVP) | Aiven (V1) | GN100 Edge | Self-hosted | DWS Phase |
|-----------|---------------|-------------|------------|-------------|-----------|
| pgvector | Yes | Yes | **Yes** | Yes | DWS6 (active) |
| pg_stat_statements | Yes | Yes | Yes | Yes | Phase 0 |
| TimescaleDB Hypercore | Yes (pre-installed) | **Yes (native 2.25.x)** | **Yes** | Yes | **Phase 1** |
| pg_duckdb | Yes (database.dev) | **No (blocked)** | **Yes (v1.1.1)** | Yes | **Edge + Phase 2 self-hosted** |
| pg_mooncake | Custom install | **No (blocked)** | Evaluate | Yes | Phase 3 |
| Citus Columnar | No | **No (blocked)** | No | Yes | Not recommended |
| ParadeDB | Yes (database.dev) | **No (blocked)** | Evaluate | Yes | Not recommended |

### EU Regulatory Compliance & Data Residency (2026)

All solutions are open-source Postgres extensions → full control when self-hosted in EU. No vendor can force data outside EU.

| Provider | GDPR | Certifications | EU Sovereignty | DPA | Schrems II Risk | Best For |
|----------|------|---------------|---------------|-----|-----------------|----------|
| **Aiven** | Compliant since 2018 | ISO 27001, SOC2, HIPAA, PCI-DSS | **Excellent** — Exoscale partnership, BYOC, Enhanced Compliance Environments (ECE) | Published | None (Finnish company) | Regulated EU workloads |
| **Supabase** | Good | SOC2, HIPAA tools | Good — EU regions (Frankfurt eu-west-1) | Published | Moderate (US company, CLOUD Act) | Developer productivity |
| **Timescale Cloud** | Good | Multi-region EU | Good | Published | Moderate (US company) | Time-series managed |
| **Self-hosted** (GN100) | **Perfect** | You control everything | **Perfect** | N/A | **None** | Edge, zero-trust |

**2026 Regulatory Context:** GDPR + NIS2 + EU AI Act push strong residency. Aiven and Supabase both publish DPAs. Self-hosting + EU hosting provider = zero Schrems II risk.

| Regulation | DB Requirement | pg_duckdb | TimescaleDB Hypercore | pg_mooncake |
|------------|---------------|-----------|----------------------|-------------|
| **GDPR Art 17** (erasure) | Deletion support | Full (heap) | Good (chunk-level) | Good (Iceberg merge) |
| **GDPR Art 25** (privacy by design) | RLS compatible | Yes | Yes | Yes |
| **GDPR Art 44-49** (transfers) | EU hosting | Self-host/edge | Aiven EU / self-host | Self-host EU only |
| **EU AI Act Art 12** (logging) | 7yr immutable retention | Heap + compression | Hypertable + auto-compress (98%) | Iceberg (best archival) |
| **NIS2 Art 21** (supply chain) | EU vendor | Open source | Open source | Databricks-acquired (US) |
| **EU Data Act 2023/2854** | Open format export | Parquet via DuckDB | CSV/SQL dump | Native Iceberg/Parquet |
| **Suomen laki 124/2025** | Supply chain transparency | Open source | Open source | Open source |
| **CSRD** | ESG data traceability | Standard SQL | Continuous aggregates | Lakehouse queries |

**Sovereignty assessment:** TimescaleDB (Swedish/US company, open source — Tier 2 acceptable). pg_duckdb (Dutch/US, open source — Tier 2). pg_mooncake (Databricks/US-acquired — Tier 3 risk, open source mitigates). All run on Aiven EU infrastructure (Tier 1 hosting) or GN100 edge (Tier 1 self-hosted).

## The Insight

**The PostgreSQL columnar pattern is the right architecture for DWS** because:

1. **Zero data movement** — analytics and transactions in the same database, same SQL, same clients. No ETL, no sync, no separate warehouse.
2. **Supabase JS SDK stays unchanged** — columnar tables are still PostgreSQL tables. PostgREST, RLS, and all existing application code work unmodified.
3. **EU Data Act compliance** — open formats (Iceberg, Parquet) satisfy IoT data portability requirements without building a separate data lake.
4. **Cost compression** — TimescaleDB Hypercore's 98% compression on audit logs turns 7 years of Article 12 data from a cost problem into a non-issue.
5. **Aiven reality** — TimescaleDB Hypercore is the ONLY managed columnar option. pg_duckdb lives on the edge device for analytical queries that Aiven can't accelerate.
6. **Two-tier HTAP** — Aiven (TimescaleDB Hypercore, managed) + GN100 edge (TimescaleDB + pg_duckdb, self-hosted). Production data on Aiven with EU SLA; ad-hoc analytics on the edge with DuckDB power.

## Recommendation (2026 Updated)

**Two-tier strategy: Aiven (TimescaleDB Hypercore) + GN100 Edge (TimescaleDB + pg_duckdb)**

### Tier 1: Aiven Managed (Production)

| Component | Extension | Workload | Phase |
|-----------|-----------|----------|-------|
| Agent metrics/costs | TimescaleDB Hypercore hypertables | Time-series + continuous aggregates | Phase 1 |
| Article 12 audit log | TimescaleDB Hypercore compression | 7-year immutable retention, 98% compression | Phase 1-2 |
| IoT sensor data | TimescaleDB Hypercore hypertables | Time-series ingestion + auto tiering | Phase 2 |
| CSRD/ESG reporting | Continuous aggregates | Scope 1/2/3 rollups | Phase 2 |

```sql
-- Aiven: Enable Hypercore hybrid storage
CREATE EXTENSION timescaledb;
CREATE TABLE my_events (time TIMESTAMPTZ, ...) WITH (timescaledb.hybrid = true);
```

### Tier 2: GN100 Edge (Analytics + Development)

| Component | Extension | Workload | Phase |
|-----------|-----------|----------|-------|
| Ad-hoc OLAP queries | pg_duckdb | Cross-table analytical joins, 50–600× acceleration | Phase 1 (deployed) |
| Agent telemetry mirror | TimescaleDB hypertables | Local time-series cache | Phase 1 (deployed) |
| Audit log mirror | TimescaleDB compression | EU-sovereign immutable copy on Finnish hardware | Phase 2 |
| Lakehouse prototype | pg_mooncake (future) | Iceberg/Parquet export testing | Phase 3 |
| Vector search (RAG) | pgvector | Local LLM RAG with Ollama | Phase 1 (deployed) |

### Why not just pg_duckdb everywhere?

pg_duckdb is the fastest analytics engine (50–600× on ClickBench) but **Aiven blocks it**. Since Aiven is the production database (99.99% SLA, EU sovereignty, zero-ops), we use TimescaleDB Hypercore there. The GN100 edge gets pg_duckdb for analytical queries that benefit from DuckDB's vectorized engine. This is complementary, not competing.

## Implementation Phases (2026 Updated)

### Phase 0: Foundation (DWS6 — Now, Q1 2026)
No new extensions. Optimize existing PostgreSQL:
- Table partitioning: `article12_audit_log` (by month), `firehorse_events` (by month)
- Materialized views for campaign funnel aggregation
- Enable `pg_stat_statements` for query profiling
- Migration: `044_120326_table_partitioning.sql`

### Phase 1: Two-Tier Columnar (DWS6 V1 — Q2 2026)
**Aiven (Startup plan):**
- Enable TimescaleDB extension with Hypercore hybrid storage
- Convert `agent_metrics` → hypertable (partition by `metric_date`, `timescaledb.hybrid = true`)
- Convert `agent_costs` → hypertable with compression policy (90d hot → compressed)
- Continuous aggregates for agent dashboard KPIs
- Migrations: `045-047` series

**GN100 Edge (deployed 2026-03-13):**
- PostgreSQL 16 + TimescaleDB + pg_duckdb + pgvector (Docker)
- SSH deployment: `scripts/deploy-acer-postgres.sh`
- Ad-hoc analytics on agent telemetry mirror

### Phase 2: Full HTAP (DWS7 — Q3-Q4 2026)
**Aiven:**
- Article 12 audit log → TimescaleDB Hypercore compression (7-year retention, 98% ratio)
- IoT sensor data → TimescaleDB Hypercore hypertables with automatic tiering
- Continuous aggregates for CSRD/ESG Scope 1/2/3 reporting

**GN100 Edge:**
- Supabase → Edge sync pipeline (pg_dump/pg_restore for audit log mirror)
- pg_duckdb analytical queries: agent performance × revenue × compliance cross-joins
- Parquet export testing for data lake integration

### Phase 3: Lakehouse Integration (DWS7 — 2027)
- pg_mooncake on self-hosted for Iceberg/Parquet native writes
- External tool access (Spark, Trino) to same data
- Edge-to-cloud sync with compressed columnar landing tables
- Evaluate Supabase Warehouse maturity

## Next Steps

1. ~~Create `DWS_DATA_STANDARD.md`~~ ✅ Done (v1.0, 2026-03-12)
2. ~~Deploy edge PostgreSQL with TimescaleDB + pg_duckdb on GN100~~ ✅ Done (v1.1, 2026-03-13)
3. ~~Verify pg_duckdb on Aiven~~ ✅ Verified: **NOT available** (Aiven whitelist blocks it)
4. Prototype TimescaleDB Hypercore hypertable on Aiven Developer ($5/mo) with `agent_metrics`
5. Design migration `044_120326_table_partitioning.sql` for Phase 0 partitioning
6. Set up Supabase → GN100 edge sync pipeline for audit log mirror

## Ontology Tags

- **Geography:** Europe > Finland > Helsinki (Aiven HQ + hosting)
- **Sector:** Technology > Database > PostgreSQL Extensions
- **Entities:** Hydra, pg_mooncake, pg_duckdb, ParadeDB, Citus, TimescaleDB, Aiven, Supabase, DuckDB, Databricks, MotherDuck, DWS IQ 6, DWS IQ 7, Lifetime Oy
- **Temporal Context:** 2026-Q1, DWS6 V1 Migration, DWS7 Roadmap Q1 2026 – Q4 2027
- **Confidence:** High (extensions are production-ready; Aiven TimescaleDB support verified)

## Related

- `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md` — Aiven Developer + Startup plan decision
- `docs/field-notes/2026-02-16-zvec-embedded-vector-db-european-alternatives.md` — European vector DB alternatives
- `DWS_SOVEREIGNTY_STANDARD.md` — EU sovereignty tiers, Aiven assessment
- `DWS_DATA_STANDARD.md` — New standard created alongside this field note
- `docs/CLOUD_ENVIRONMENTS.md` — Cloud architecture and data residency
- `docs/article-12-annex-iv-log-schema-mapping.md` — EU AI Act Article 12 schema

---

(c) 2026 Lifetime Oy — Field Note
