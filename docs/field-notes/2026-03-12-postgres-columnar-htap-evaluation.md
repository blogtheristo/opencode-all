# PostgreSQL Columnar & HTAP Extension Evaluation for DWS6/DWS7

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Initial field note — evaluation of Hydra-like PostgreSQL columnar extensions for DWS6 and DWS7 HTAP architecture

Document Status:
  - Created: 12.03.2026
  - Last Modified: 12.03.2026
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

### Hydra and the PostgreSQL Columnar Explosion (2025-2026)

Hydra pioneered the "columnar Table Access Method inside PostgreSQL" pattern — `CREATE TABLE ... USING columnar` with DuckDB-powered vectorized execution. This gave teams true HTAP (transactional tables stay heap; analytics tables become columnar) with zero data movement, same SQL/clients, and seamless joins.

By 2026, the pattern exploded. Six production-ready solutions now exist:

### Solution Comparison

| Solution | Columnar Storage | Execution Engine | Lakehouse Support | Update/Delete | Best Workload | Managed Option |
|----------|-----------------|------------------|-------------------|---------------|---------------|----------------|
| **Hydra** | Native TAM (columnar) | DuckDB | Good | Append-optimized | General analytics + HTAP | hydra.so (serverless) |
| **pg_mooncake** | Iceberg/Parquet TAM | DuckDB | Excellent | Good | Lakehouse + general analytics | Databricks / self-host |
| **pg_duckdb** | Accelerates heap tables | DuckDB | Excellent | Full Postgres | Query acceleration | MotherDuck / self-host |
| **ParadeDB pg_analytics** | On-disk + lakehouse | DuckDB | Best-in-class | Good | Search + lakehouse analytics | Self-host |
| **Citus Columnar** | Native columnar | Postgres + vector | Basic | Good | Distributed analytics | Azure Cosmos DB |
| **TimescaleDB** | Hypercore (hybrid) | Postgres | Basic | Excellent | Time-series / real-time | Timescale Cloud |

### Detailed Analysis

#### 1. pg_mooncake (Mooncake Labs → acquired by Databricks)

- **How it works:** Columnar Table Access Method (`CREATE TABLE ... USING columnstore`). Stores data in open Iceberg/Delta Lake/Parquet format. Executes analytics with embedded DuckDB (vectorized + SIMD).
- **Performance:** Top-10 on ClickBench. Joins columnar tables with normal heap tables natively.
- **DWS fit:** Excellent for Phase 3 lakehouse integration. EU Data Act compliance via open formats.
- **Constraint:** Not available on Supabase or Aiven — requires self-hosted PostgreSQL.

#### 2. pg_duckdb (DuckDB team + Hydra + MotherDuck)

- **How it works:** Embeds full DuckDB engine inside Postgres. Automatically routes heavy analytical queries to vectorized columnar execution. Reads/writes Postgres heap tables directly + external files/S3.
- **Performance:** The exact engine powering Hydra's speed. Drop-in acceleration for complex joins/aggregates.
- **DWS fit:** Ideal for DWS6 V1 on Aiven — accelerate existing agent analytics and campaign funnels without schema changes.
- **Constraint:** Verify availability on Aiven managed PostgreSQL.

#### 3. ParadeDB pg_analytics (formerly pg_lakehouse)

- **How it works:** DuckDB-based columnar analytics + direct S3 data lake querying. Pairs with pg_search for full-text search.
- **DWS fit:** Interesting but redundant — DWS already uses native TSVECTOR for search.
- **Constraint:** Self-hosted only. Better suited if DWS needed combined search + analytics.

#### 4. Citus Columnar (Microsoft / Azure Cosmos DB)

- **How it works:** Original `USING columnar` syntax (Hydra forked early Citus code). Horizontal scaling with Citus sharding.
- **DWS fit:** Not recommended. Azure-locked, older codebase, less DuckDB vectorization.
- **Constraint:** Azure Cosmos DB only for managed. EU sovereignty concern (Microsoft US).

#### 5. TimescaleDB (with Hypercore / columnar compression)

- **How it works:** Hypertables + automatic tiering to compressed columnar storage. Continuous aggregates for real-time analytics.
- **Performance:** 90-95% compression on time-series data. Excellent for append-heavy workloads.
- **DWS fit:** **Primary recommendation for DWS7 IoT pipeline.** Natural fit for sensor data, agent metrics, audit logs. Available on Aiven.
- **Strength:** Hybrid row→columnar is automatic (not manual). Recent data stays row-oriented for fast writes, older data compresses automatically.

#### 6. Bonus: Google AlloyDB

- **How it works:** Built-in columnar secondary storage. Automatically maintains columnar copy for analytics. Up to 100× speedup.
- **DWS fit:** Not recommended — Google Cloud managed only, no EU sovereignty guarantee per DWS_SOVEREIGNTY_STANDARD.md Tier assessment.

### Extension Availability Matrix

| Extension | Supabase (MVP) | Aiven (V1) | Self-hosted | DWS Phase |
|-----------|---------------|-------------|-------------|-----------|
| pgvector | Yes | Yes | Yes | DWS6 (planned) |
| pg_stat_statements | Yes | Yes | Yes | Phase 0 |
| TimescaleDB | No | **Yes** | Yes | Phase 1 |
| pg_duckdb | No | Verify* | Yes | Phase 1-2 |
| pg_mooncake | No | No | Yes | Phase 3 |
| Citus Columnar | No | No | Yes | Not recommended |
| ParadeDB | No | No | Yes | Evaluate Phase 3 |

*pg_duckdb on Aiven requires verification with Aiven support — may need custom PostgreSQL image.

### EU Regulatory Compliance Evaluation

| Regulation | DB Requirement | pg_duckdb | TimescaleDB | pg_mooncake |
|------------|---------------|-----------|-------------|-------------|
| **GDPR Art 17** (erasure) | Deletion support | Full (heap) | Good (chunk-level) | Good (Iceberg merge) |
| **GDPR Art 25** (privacy by design) | RLS compatible | Yes | Yes | Yes |
| **GDPR Art 44-49** (transfers) | EU hosting | Self-host/Aiven | Aiven EU / self-host | Self-host EU only |
| **EU AI Act Art 12** (logging) | 7yr immutable retention | Heap + compression | Hypertable + auto-compress | Iceberg (best archival) |
| **NIS2 Art 21** (supply chain) | EU vendor | Open source | Open source | Databricks-acquired (US) |
| **EU Data Act 2023/2854** | Open format export | Parquet via DuckDB | CSV/SQL dump | Native Iceberg/Parquet |
| **Suomen laki 124/2025** | Supply chain transparency | Open source | Open source (Sweden/US) | Open source |
| **CSRD** | ESG data traceability | Standard SQL | Continuous aggregates | Lakehouse queries |
| **EN 15978 / EN 15804** | LCA lifecycle data | Standard tables | Time-bucketed stages | Parquet partitions |
| **ISO 27001** | Encryption, access control | PostgreSQL native | PostgreSQL native | PostgreSQL native |

**Sovereignty assessment:** TimescaleDB (Swedish/US company, open source — Tier 2 acceptable). pg_duckdb (Dutch/US, open source — Tier 2). pg_mooncake (Databricks/US-acquired — Tier 3 risk, but open source mitigates). All run on Aiven EU infrastructure (Tier 1 hosting).

## The Insight

**The PostgreSQL columnar pattern is the right architecture for DWS** because:

1. **Zero data movement** — analytics and transactions in the same database, same SQL, same clients. No ETL, no sync, no separate warehouse.
2. **Supabase JS SDK stays unchanged** — columnar tables are still PostgreSQL tables. PostgREST, RLS, and all existing application code work unmodified.
3. **EU Data Act compliance** — open formats (Iceberg, Parquet) satisfy IoT data portability requirements without building a separate data lake.
4. **Cost compression** — TimescaleDB's 90-95% compression on audit logs turns 7 years of Article 12 data from a cost problem into a non-issue.
5. **Phased adoption** — start with TimescaleDB on Aiven (natively supported, zero risk), add pg_duckdb for analytical acceleration, grow to lakehouse when needed.

## Recommendation

**Primary stack: TimescaleDB + pg_duckdb on Aiven PostgreSQL**

| Component | Extension | Workload | Phase |
|-----------|-----------|----------|-------|
| IoT sensor data | TimescaleDB hypertables | Time-series ingestion + compression | Phase 1-2 |
| Agent metrics/costs | TimescaleDB hypertables | Daily time-series + continuous aggregates | Phase 1 |
| Article 12 audit log | TimescaleDB compression | 7-year immutable retention | Phase 1-2 |
| Campaign analytics | pg_duckdb | Ad-hoc analytical queries on heap tables | Phase 2 |
| CSRD/ESG reporting | pg_duckdb + continuous aggregates | Scope 1/2/3 rollups | Phase 2 |
| Lakehouse export | pg_mooncake (future) | Iceberg/Parquet for external tools | Phase 3 |

## Implementation Phases

### Phase 0: Foundation (DWS6 — Now, Q1 2026)
No new extensions. Optimize existing PostgreSQL:
- Table partitioning: `article12_audit_log` (by month), `firehorse_events` (by month)
- Materialized views for campaign funnel aggregation
- Enable `pg_stat_statements` for query profiling
- Migration: `044_120326_table_partitioning.sql`

### Phase 1: Aiven Columnar Pilot (DWS6 V1 — Q2 2026)
Target: Aiven PostgreSQL Startup plan:
- Enable TimescaleDB extension
- Convert `agent_metrics` → hypertable (partition by `metric_date`)
- Convert `agent_costs` → hypertable with compression policy (90d hot → compressed)
- Continuous aggregates for agent dashboard KPIs
- Test pg_duckdb on Aiven Developer for ad-hoc queries
- Migrations: `045-047` series

### Phase 2: HTAP Setup (DWS7 — Q3-Q4 2026)
Target: Aiven production with analytical acceleration:
- pg_duckdb for heap table analytics (campaign funnels, financial reports)
- IoT sensor data → TimescaleDB hypertables with automatic tiering
- Article 12 audit log → TimescaleDB compression (7-year retention)
- Evaluate pg_mooncake for lakehouse export
- Migrations: `048-052` series

### Phase 3: Lakehouse Integration (DWS7 — 2027)
Target: Full HTAP + data lake:
- pg_mooncake for Iceberg/Parquet export to Scaleway S3
- External tool access (Spark, Trino) to same data
- Continuous aggregates for CSRD/ESG reporting pipelines
- Edge-to-cloud sync with compressed columnar landing tables

## Next Steps

1. Create `DWS_DATA_STANDARD.md` to codify storage engine decisions, extension governance, and EU compliance
2. Verify pg_duckdb availability on Aiven with their support team
3. Prototype TimescaleDB hypertable on Aiven Developer plan ($5/mo) with `agent_metrics` data
4. Design migration `044_120326_table_partitioning.sql` for Phase 0 partitioning

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
