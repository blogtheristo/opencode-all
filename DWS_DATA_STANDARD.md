# DWS Data Standard

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Initial creation — data storage governance, columnar/row policy, extension registry, EU regulatory compliance, retention policy, partitioning and compression standards

Session Links & References:
  - Claude Code (claude/plan-postgres-columnar-3bSn6): https://github.com/blogtheristo/dws6/commits/claude/plan-postgres-columnar-3bSn6

Document Status:
  - Created: 12.03.2026
  - Last Modified: 12.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-03-12
**Last Updated:** 2026-03-12
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Storage Engine Policy](#2-storage-engine-policy)
3. [Extension Governance](#3-extension-governance)
4. [Data Classification & Tiering](#4-data-classification--tiering)
5. [Retention Policy](#5-retention-policy)
6. [Partitioning Standard](#6-partitioning-standard)
7. [Compression Policy](#7-compression-policy)
8. [EU Regulatory Compliance](#8-eu-regulatory-compliance)
9. [Data Sovereignty](#9-data-sovereignty)
10. [Migration & Schema Change Policy](#10-migration--schema-change-policy)
11. [Backup & Recovery](#11-backup--recovery)
12. [Approved Extensions Registry](#12-approved-extensions-registry)

---

## 1. Overview

### Purpose / Tarkoitus

This standard governs all data storage decisions across the DWS platform — from storage engine selection (row vs columnar) to extension governance, retention policies, and EU regulatory compliance. It ensures that every table, index, and extension choice is deliberate, documented, and compliant.

Tämä standardi ohjaa kaikkia DWS-alustan tiedon tallennuspäätöksiä — tallennusmoottorin valinnasta (rivi vs sarake) laajennusten hallintaan, säilytysperiaatteisiin ja EU:n sääntelynmukaisuuteen.

### Scope / Soveltamisala

Applies to:
- All PostgreSQL databases (Supabase, Aiven, self-hosted)
- All table creation and schema changes
- Extension installation and upgrades
- Data retention and archival decisions
- Backup and recovery procedures

### Related Standards

| Standard | Relationship |
|----------|-------------|
| `DWS_SOVEREIGNTY_STANDARD.md` | Database vendor sovereignty tiers |
| `DWS_SECURITY_STANDARD.md` | Security controls, encryption, access |
| `Admin/SECURITY_COMPLIANCE.md` | Certification roadmap (ISO 27001, SOC 2) |
| `docs/CLOUD_ENVIRONMENTS.md` | Cloud architecture, data residency |
| `docs/article-12-annex-iv-log-schema-mapping.md` | EU AI Act Article 12 schema |

---

## 2. Storage Engine Policy

### 2.1 Storage Engine Decision Matrix

| Workload Pattern | Storage Engine | PostgreSQL Syntax | When to Use |
|-----------------|---------------|-------------------|-------------|
| **OLTP** (transactional) | Row (heap) | `CREATE TABLE ...` (default) | User-facing CRUD, auth, CRM leads, orders |
| **Time-series** (append-heavy) | TimescaleDB hypertable | `SELECT create_hypertable(...)` | IoT sensors, agent metrics, agent costs, audit logs |
| **Analytical** (read-heavy) | pg_duckdb acceleration | Automatic routing | Campaign funnels, financial reports, CSRD rollups |
| **Archival** (cold, immutable) | TimescaleDB compressed | Compression policy | Article 12 logs (>90d), old events, historical metrics |
| **Lakehouse** (external access) | pg_mooncake (future) | `CREATE TABLE ... USING columnstore` | Iceberg/Parquet export for Spark, Trino, external BI |

### 2.2 Decision Rules

1. **Default is row (heap).** Every table starts as a standard PostgreSQL heap table.
2. **Convert to hypertable** when the table has a monotonically increasing timestamp column AND append-heavy writes AND queries primarily filter by time range.
3. **Enable pg_duckdb acceleration** when analytical queries on heap tables exceed 100ms p95 consistently.
4. **Enable columnar compression** when data is >90 days old AND write frequency drops to near-zero.
5. **Never use columnar for OLTP.** Tables with frequent UPDATE/DELETE operations stay as heap.

### 2.3 Hybrid HTAP Architecture

DWS uses a **single-database HTAP** model — no separate data warehouse:

```
┌─────────────────────────────────────────────────┐
│              PostgreSQL (Aiven EU)                │
│                                                   │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Heap      │  │ TimescaleDB  │  │ pg_duckdb  │ │
│  │ (OLTP)    │  │ Hypertables  │  │ Accelerator│ │
│  │           │  │ (time-series)│  │ (analytics)│ │
│  │ leads     │  │ agent_metrics│  │ ← routes   │ │
│  │ users     │  │ agent_costs  │  │   heavy    │ │
│  │ orgs      │  │ audit_log    │  │   queries  │ │
│  │ templates │  │ iot_sensors  │  │   auto     │ │
│  └──────────┘  └──────────────┘  └────────────┘ │
│                                                   │
│  Same SQL · Same clients · Same RLS · Zero ETL    │
└─────────────────────────────────────────────────┘
```

---

## 3. Extension Governance

### 3.1 Extension Installation Rules

1. **Every extension MUST be listed in the Approved Extensions Registry** (Section 12) before installation.
2. **Version pinning required** — specify exact version in migration files.
3. **EU sovereignty check** — extension provider must be assessed per `DWS_SOVEREIGNTY_STANDARD.md` tier system.
4. **Migration-only installation** — extensions are enabled ONLY via `supabase/migrations/` SQL files, never manually.
5. **One extension per migration** — each `CREATE EXTENSION` gets its own migration file for clean rollback.

### 3.2 Extension Evaluation Criteria

Before approving a new extension:

| Criterion | Requirement |
|-----------|-------------|
| **Open source** | Must be open source (Apache 2.0, PostgreSQL License, or MIT) |
| **Active maintenance** | Commit activity in last 6 months |
| **PostgreSQL version** | Compatible with pg16+ |
| **RLS compatibility** | Must work with Row-Level Security |
| **Supabase/Aiven support** | Must be available on target platform |
| **EU sovereignty** | Provider assessed per DWS_SOVEREIGNTY_STANDARD.md |
| **Security audit** | No known CVEs in current version |

### 3.3 Extension Lifecycle

```
Evaluate → Approve → Pilot (Developer plan) → Production (Startup plan) → Monitor → Upgrade/Deprecate
```

---

## 4. Data Classification & Tiering

### 4.1 Temperature Tiers

| Tier | Age | Storage | Access Pattern | Compression |
|------|-----|---------|---------------|-------------|
| **Hot** | 0–90 days | Row (heap) or uncompressed hypertable | Read/write, real-time queries | None |
| **Warm** | 90 days – 1 year | TimescaleDB compressed chunks | Read-only queries, reports | LZ4 (fast) |
| **Cold** | 1–7 years | TimescaleDB compressed + optional Iceberg export | Compliance queries, audits | ZSTD (maximum) |
| **Archive** | >7 years | Iceberg/Parquet on S3-compatible storage | Legal hold, regulatory export | Parquet native |

### 4.2 Classification by Table

| Table | Tier Policy | Justification |
|-------|------------|---------------|
| `firehorse_leads` | Hot (always) | Active CRM, frequent updates |
| `firehorse_events` | Hot→Warm at 90d | Append-only events, query frequency drops |
| `agent_metrics` | Hot→Warm at 90d | Daily snapshots, dashboard aggregates |
| `agent_costs` | Hot→Warm at 90d | Cost tracking, monthly reports |
| `agent_executions` | Hot→Warm at 30d | Audit trail, debugging |
| `article12_audit_log` | Hot→Warm at 90d→Cold at 1yr | 7-year retention, EU AI Act Art 12 |
| `iot_sensor_data` (DWS7) | Hot→Warm at 7d→Cold at 90d | High-volume ingestion, fast tiering |
| `users`, `organizations` | Hot (always) | Auth, low volume |

---

## 5. Retention Policy

### 5.1 Regulatory Retention Requirements

| Regulation | Requirement | DWS Implementation |
|------------|-------------|-------------------|
| **EU AI Act Art 12** | Automatic logging for high-risk AI, retained for duration of system lifetime | 7 years, append-only, immutable |
| **GDPR Art 17** | Right to erasure ("right to be forgotten") | Soft-delete + scheduled purge (NOT applicable to audit logs — Art 17(3)(e) legal obligation exemption) |
| **GDPR Art 5(1)(e)** | Storage limitation — no longer than necessary | Operational data: 90d hot, 1yr warm, then purge unless regulatory hold |
| **NIS2 Art 23** | Incident logs for notification | 5 years minimum |
| **CSRD** | ESG reporting data traceability | 10 years (financial reporting standard) |
| **Finnish Accounting Act (1336/1997)** | Financial records | 10 years |

### 5.2 Per-Table Retention Rules

| Table | Hot | Warm | Cold | Total Retention | Purge Policy |
|-------|-----|------|------|-----------------|-------------|
| `article12_audit_log` | 90d | 1yr | 7yr | **7 years** | Never delete (legal obligation) |
| `agent_executions` | 30d | 1yr | — | **1 year** | Soft-delete, anonymize PII |
| `agent_metrics` | 90d | 1yr | — | **1 year** | Aggregate then purge raw |
| `agent_costs` | 90d | 2yr | — | **2 years** | Financial record retention |
| `firehorse_events` | 90d | 1yr | — | **1 year** | Anonymize email addresses |
| `firehorse_leads` | Active | 2yr inactive | — | **Until deletion request** | GDPR Art 17 compliant |
| `iot_sensor_data` (DWS7) | 7d | 90d | 1yr | **1 year** | Aggregate then purge raw |

### 5.3 GDPR Erasure Procedure

1. Receive erasure request → verify identity
2. Check legal obligation exemptions (Art 17(3)) — audit logs exempt
3. Soft-delete personal data in operational tables
4. Schedule hard purge after 30-day grace period
5. Log erasure action in `article12_audit_log` (meta-audit)
6. Confirm deletion to data subject within 30 days

---

## 6. Partitioning Standard

### 6.1 Partitioning Rules

1. **Partition by time** when table exceeds 10M rows OR grows >1M rows/month.
2. **Monthly partitions** for operational tables (events, metrics, costs).
3. **Daily partitions** for high-volume IoT sensor data (DWS7).
4. **TimescaleDB hypertables preferred** over native PostgreSQL partitioning — automatic chunk management, compression policies, continuous aggregates.

### 6.2 Partitioning Implementation

**For TimescaleDB hypertables:**
```sql
-- Convert existing table to hypertable
SELECT create_hypertable('agent_metrics', 'metric_date',
  chunk_time_interval => INTERVAL '1 month',
  migrate_data => true
);

-- Add compression policy (compress after 90 days)
ALTER TABLE agent_metrics SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'agent_id',
  timescaledb.compress_orderby = 'metric_date DESC'
);
SELECT add_compression_policy('agent_metrics', INTERVAL '90 days');
```

**For native PostgreSQL partitioning (Supabase, where TimescaleDB unavailable):**
```sql
-- Partition by range on created_at
CREATE TABLE article12_audit_log (
  ...
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE article12_audit_log_2026_01
  PARTITION OF article12_audit_log
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

---

## 7. Compression Policy

### 7.1 Compression Targets

| Data Tier | Algorithm | Target Ratio | Notes |
|-----------|-----------|-------------|-------|
| Hot | None | 1:1 | Full write performance |
| Warm | LZ4 (TimescaleDB) | 5:1 – 10:1 | Fast decompression for queries |
| Cold | ZSTD (TimescaleDB) | 10:1 – 20:1 | Maximum compression |
| Archive | Parquet native | 20:1 – 50:1 | Columnar + dictionary encoding |

### 7.2 TOAST Settings

For JSONB-heavy tables (enrichment_data, trigger_events, tech_stack):
- Use `EXTENDED` TOAST strategy (default) — compress then out-of-line
- Consider `MAIN` for frequently accessed JSONB columns to avoid extra I/O
- Never use `PLAIN` for JSONB — wastes space

### 7.3 Compression Monitoring

Track compression ratios monthly:
```sql
-- TimescaleDB compression stats
SELECT
  hypertable_name,
  pg_size_pretty(before_compression_total_bytes) AS before,
  pg_size_pretty(after_compression_total_bytes) AS after,
  round((1 - after_compression_total_bytes::numeric /
    before_compression_total_bytes) * 100, 1) AS compression_pct
FROM timescaledb_information.compression_stats;
```

---

## 8. EU Regulatory Compliance

### 8.1 Regulatory Matrix

This section maps EU regulations to specific database design requirements.

| Regulation | Article | DB Requirement | Implementation |
|------------|---------|---------------|----------------|
| **GDPR** | Art 5(1)(e) | Storage limitation | Retention policies per §5 |
| **GDPR** | Art 17 | Right to erasure | Soft-delete + purge procedure per §5.3 |
| **GDPR** | Art 25 | Privacy by design | RLS on all tables, encryption at rest (AES-256) |
| **GDPR** | Art 30 | Records of processing | Processing activity log in `article12_audit_log` |
| **GDPR** | Art 32 | Security of processing | TLS 1.3 in transit, AES-256 at rest, key rotation |
| **GDPR** | Art 44-49 | International transfers | EU-only hosting (Aiven Finland), no CLOUD Act exposure |
| **EU AI Act** | Art 12 | Automatic logging | Immutable append-only `article12_audit_log`, 7yr retention |
| **EU AI Act** | Art 13 | Transparency | Model cards, confidence scores in log schema |
| **EU AI Act** | Art 14 | Human oversight | E-stop audit trail, Captain's Bridge log entries |
| **EU AI Act** | Annex IV | Technical documentation | Full schema mapping in `article-12-annex-iv-log-schema-mapping.md` |
| **NIS2** | Art 21(1) | Risk management | ISMS controls, extension governance per §3 |
| **NIS2** | Art 21(2)(d) | Supply chain security | EU-only vendors per §9 |
| **NIS2** | Art 23 | Incident notification | 24hr CERT-FI notification, incident log 5yr retention |
| **CSRD** | ESRS E1 | Climate data | Scope 1/2/3 emissions tables, EN 15978 LCA stages |
| **EU Data Act** | 2023/2854 | IoT data portability | Open formats (Iceberg/Parquet), machine-readable export |
| **Suomen laki** | 124/2025 | Finnish NIS2 transposition | Supply chain transparency, CERT-FI registration |
| **Finnish Accounting Act** | 1336/1997 | Financial record retention | 10-year retention for financial data |

### 8.2 Compliance Verification

Run quarterly compliance checks:
1. Verify RLS enabled on all tables: `SELECT tablename FROM pg_tables WHERE NOT rowsecurity`
2. Verify encryption at rest is active (Aiven: automatic; Supabase: automatic)
3. Verify retention policies are enforced (no data beyond retention limits)
4. Verify audit log immutability (no UPDATE/DELETE policies on `article12_audit_log`)
5. Export compliance report for ISO 27001 / SOC 2 auditors

---

## 9. Data Sovereignty

### 9.1 Sovereignty Tiers (per DWS_SOVEREIGNTY_STANDARD.md)

| Tier | Definition | Example |
|------|-----------|---------|
| **Tier 1** (Sovereign) | EU company + EU infrastructure + EU law | Aiven (Finnish, Helsinki DC) |
| **Tier 2** (Adequate) | Non-EU company + EU infrastructure + open source | TimescaleDB (Swedish/US, open source, runs on Aiven EU) |
| **Tier 3** (At-Risk) | US company + EU infrastructure | Supabase (US, CLOUD Act exposure) |
| **Tier 4** (Non-Compliant) | US company + US infrastructure | Not used |

### 9.2 Database Vendor Assessment

| Vendor | Sovereignty Tier | Usage | Risk Mitigation |
|--------|-----------------|-------|-----------------|
| **Aiven** | Tier 1 | V1 production (Startup $75/mo) | Primary — EU sovereign |
| **Supabase** | Tier 3 | MVP (current, to be migrated) | Migration to Aiven Q2 2026 |
| **Extension providers** | Tier 2 | Open source, runs on Aiven | Source code auditable |

### 9.3 Data Residency Rules

1. **All production data** MUST reside in EU (Finland or Germany).
2. **No replication** to non-EU regions without DPIA and explicit approval.
3. **Backup storage** in EU only (Aiven automatic backups to EU DC).
4. **AI inference** may use US providers (Anthropic) — logged honestly in audit trail (`inference_in_eu=FALSE`).

---

## 10. Migration & Schema Change Policy

### 10.1 Boardy Safety Rules

Every database migration MUST follow Boardy's safety rules (from CLAUDE.md):

| Rule | Enforcement |
|------|-------------|
| Every migration wrapped in `BEGIN`/`COMMIT` | Pre-commit check |
| RLS enabled on all new tables | Drift check flags missing RLS |
| No `DROP TABLE` without explicit approval | PR review gate |
| No `SECURITY DEFINER` on public functions | Lint rule |
| `service_role` key never in client code | `.env` + gitignore audit |

### 10.2 Migration File Standard

Per DWS Document Standard §4.5:
```
[number]_[DDMMYY]_[name].sql
```

Example: `044_120326_table_partitioning.sql`

### 10.3 Schema Change Procedure

1. Draft migration SQL with `BEGIN`/`COMMIT` wrapper
2. Test on Aiven Developer plan ($5/mo sandbox)
3. Run `scripts/db-drift-check.py` to verify repo matches live schema
4. PR review (Boardy cranky review)
5. Apply to Aiven Startup production
6. Verify with `db-drift-check.py --verify`

### 10.4 Extension Migration Template

```sql
-- Migration: NNN_DDMMYY_enable_extension_name.sql
-- Purpose: Enable [extension] for [workload]
-- Rollback: DROP EXTENSION IF EXISTS [extension];

BEGIN;

-- Verify PostgreSQL version compatibility
DO $$
BEGIN
  IF current_setting('server_version_num')::int < 160000 THEN
    RAISE EXCEPTION 'Requires PostgreSQL 16+';
  END IF;
END $$;

CREATE EXTENSION IF NOT EXISTS [extension_name] WITH SCHEMA public;

COMMIT;
```

---

## 11. Backup & Recovery

### 11.1 RTO/RPO Targets

| Metric | Target | Current |
|--------|--------|---------|
| **RTO (schema rebuild)** | < 5 minutes | Achievable via migrations |
| **RTO (full restore)** | < 15 minutes | Aiven PITR + migration replay |
| **RPO** | < 1 hour | Aiven continuous WAL archiving |

### 11.2 Backup Destinations (4-destination redundancy)

1. **Aiven automatic** — continuous WAL archiving, PITR (primary)
2. **pg_dump to local** — daily script (`scripts/db-recovery.sh`)
3. **Proton Drive** — encrypted offsite (manual weekly)
4. **GitHub Actions artifact** — schema-only backup on PR merge

### 11.3 Columnar-Specific Backup Considerations

- **TimescaleDB hypertables:** `pg_dump` handles them correctly. Use `--format=directory` for parallel dump of large compressed chunks.
- **Compressed chunks:** Aiven PITR restores compressed chunks natively. No special handling needed.
- **Continuous aggregates:** Backed up as materialized views. Refresh after restore if source data changed.

---

## 12. Approved Extensions Registry

### 12.1 Current Registry

| Extension | Version | Provider | License | Sovereignty Tier | Platform | DWS Status | Phase |
|-----------|---------|----------|---------|-----------------|----------|------------|-------|
| **uuid-ossp** | built-in | PostgreSQL | PostgreSQL | Tier 1 | Supabase, Aiven | Active | — |
| **pgcrypto** | built-in | PostgreSQL | PostgreSQL | Tier 1 | Supabase, Aiven | Active | — |
| **pgvector** | 0.8.x | pgvector team | PostgreSQL | Tier 2 | Supabase, Aiven | Planned | DWS6 |
| **pg_stat_statements** | built-in | PostgreSQL | PostgreSQL | Tier 1 | Supabase, Aiven | Planned | Phase 0 |
| **pg_trgm** | built-in | PostgreSQL | PostgreSQL | Tier 1 | Supabase, Aiven | Planned | DWS6 |
| **TimescaleDB** | 2.17.x | Timescale Inc | Timescale | Tier 2 | Aiven | Planned | Phase 1 |
| **pg_duckdb** | 0.3.x | DuckDB team | MIT | Tier 2 | Aiven* | Evaluate | Phase 1-2 |
| **pg_mooncake** | 0.2.x | Databricks | Apache 2.0 | Tier 2 | Self-hosted | Evaluate | Phase 3 |

*pg_duckdb on Aiven: Verify availability with Aiven support.

### 12.2 Rejected Extensions

| Extension | Reason | Date |
|-----------|--------|------|
| **Citus Columnar** | Azure-locked, US sovereignty concern | 2026-03-12 |
| **ParadeDB pg_analytics** | Redundant with pg_duckdb + native TSVECTOR search | 2026-03-12 |

### 12.3 Registry Update Procedure

1. Submit extension evaluation (criteria per §3.2) via field note
2. Pilot on Aiven Developer plan
3. Add to registry with PR review
4. Update this document version

---

## Appendix A: Quick Reference Card

**Storage engine decision in 30 seconds:**

```
Is the table append-heavy with a timestamp column?
  YES → TimescaleDB hypertable
  NO  → Is it queried analytically (GROUP BY, SUM, AVG, window functions)?
    YES → Keep as heap + enable pg_duckdb acceleration
    NO  → Standard heap table (default)

Is the data older than 90 days?
  YES → Enable compression (TimescaleDB policy or native TOAST)
  NO  → No compression

Does an external tool need to read this data?
  YES → Export as Iceberg/Parquet (pg_mooncake, Phase 3)
  NO  → Keep in PostgreSQL
```

---

(c) 2026 Lifetime Oy — DWS Data Standard v1.0
