# DWS Data Standard

---

# VERSION AND AGENT HISTORY

Version: 2.2

Sessions & Modifications:

- Version: 2.2 | Tool: Claude Code (Opus 4.7) | Session: claude/deployment-strategies-comparison-T5gcw | Date: 12.05.2026 | Changes: Added Related Standards entry for `DWS_DEPLOYMENT_STANDARD.md` v1.0. The Deployment Standard adopts forward-only migration as the canonical convention, recommends the expand / contract pattern for breaking schema changes, and uses the RTO / RPO targets defined here as the pre-deploy backup-freshness gate (< 24 h). No edit to existing sections 1–15.
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/connect-kya-dws-cli-0MMIB | Date: 10.04.2026 | Changes: Added Section 4.3 (Classification for Filesystem Content Stores) — governance for `kb/raw/`, `kb/wiki/`, `kb/ephemeral/` (LLM-maintained knowledge base), ownership rules, PII prohibition, 7-day sweep of ephemeral, GDPR Art 17 erasure procedure for accidental PII ingest, secrets-scanner enforcement
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Major update — Aiven-first mandate locked, TimescaleDB 2.25.x Hypercore approved standard, 2026 comparison table (Hydra→Supabase, pg_mooncake→Databricks), Aiven whitelist (pg_duckdb BLOCKED), two-tier HTAP (Aiven + GN100 edge), local dev parity, EU DPA/Schrems II analysis
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Initial creation — data storage governance, columnar/row policy, extension registry, EU regulatory compliance, retention policy, partitioning and compression standards

Session Links & References:

- Claude Code (claude/plan-postgres-columnar-3bSn6): https://github.com/blogtheristo/dws6/commits/claude/plan-postgres-columnar-3bSn6

Document Status:

- Created: 12.03.2026
- Last Modified: 12.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

**Version:** 2.2
**Effective Date:** 2026-03-12
**Last Updated:** 2026-05-12
**Status:** Active — Aiven-First Mandate Locked

---

## Executive Summary (Aiven-First Mandate)

**Approved primary standard for Aiven-managed environments: Aiven for PostgreSQL + TimescaleDB 2.25.x with Hypercore.**

This is the **ONLY** columnar/HTAP solution that meets all DWS constraints (Aiven SLA + local mirroring + enterprise support) without custom workarounds. All new projects default to this unless the workload profile explicitly requires lakehouse features (then evaluate Supabase Warehouse via formal exception process).

| Requirement                   | Aiven + TimescaleDB Hypercore                     | Alternative (Exception Only)                |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------- |
| Aiven native support          | Yes (built-in, pre-approved)                      | pg_duckdb/pg_mooncake: **BLOCKED** on Aiven |
| Local Docker parity           | `timescale/timescaledb:2.25.2-pg16` (exact match) | Good (Supabase Warehouse)                   |
| Real-time updates + analytics | Best-in-class (automatic hybrid row→columnar)     | pg_mooncake: good but manual                |
| Analytics speed vs vanilla PG | 10–100× (real-time focus) + 90–98% compression    | 50–600× (pg_duckdb, edge only)              |
| EU data residency / GDPR      | Full (Aiven EU regions + BYOC/ECE)                | Self-hosted EU only                         |
| Operational SLA / zero-ops    | 99.99% + Aiven monitoring                         | None (you manage)                           |

**This section is locked into our standards.** March 2026.

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
13. [2026 Columnar/HTAP Comparison](#13-2026-columnarhtap-comparison)
14. [Two-Tier HTAP Architecture](#14-two-tier-htap-architecture)
15. [Local Development Parity Setup](#15-local-development-parity-setup)

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

| Standard                                         | Relationship                             |
| ------------------------------------------------ | ---------------------------------------- |
| `DWS_SOVEREIGNTY_STANDARD.md`                    | Database vendor sovereignty tiers        |
| `DWS_SECURITY_STANDARD.md`                       | Security controls, encryption, access    |
| `Admin/SECURITY_COMPLIANCE.md`                   | Certification roadmap (ISO 27001, SOC 2) |
| `docs/CLOUD_ENVIRONMENTS.md`                     | Cloud architecture, data residency       |
| `docs/article-12-annex-iv-log-schema-mapping.md` | EU AI Act Article 12 schema              |

---

## 2. Storage Engine Policy

### 2.1 Storage Engine Decision Matrix

| Workload Pattern                | Storage Engine         | PostgreSQL Syntax                    | When to Use                                            |
| ------------------------------- | ---------------------- | ------------------------------------ | ------------------------------------------------------ |
| **OLTP** (transactional)        | Row (heap)             | `CREATE TABLE ...` (default)         | User-facing CRUD, auth, CRM leads, orders              |
| **Time-series** (append-heavy)  | TimescaleDB hypertable | `SELECT create_hypertable(...)`      | IoT sensors, agent metrics, agent costs, audit logs    |
| **Analytical** (read-heavy)     | pg_duckdb acceleration | Automatic routing                    | Campaign funnels, financial reports, CSRD rollups      |
| **Archival** (cold, immutable)  | TimescaleDB compressed | Compression policy                   | Article 12 logs (>90d), old events, historical metrics |
| **Lakehouse** (external access) | pg_mooncake (future)   | `CREATE TABLE ... USING columnstore` | Iceberg/Parquet export for Spark, Trino, external BI   |

### 2.2 Decision Rules

1. **Default is row (heap).** Every table starts as a standard PostgreSQL heap table.
2. **Convert to hypertable** when the table has a monotonically increasing timestamp column AND append-heavy writes AND queries primarily filter by time range.
3. **Enable pg_duckdb acceleration** when analytical queries on heap tables exceed 100ms p95 consistently.
4. **Enable columnar compression** when data is >90 days old AND write frequency drops to near-zero.
5. **Never use columnar for OLTP.** Tables with frequent UPDATE/DELETE operations stay as heap.

### 2.3 Two-Tier HTAP Architecture (2026)

DWS uses a **two-tier HTAP** model — Aiven managed (production) + GN100 edge (analytics):

```
┌────────────────────────────────────────────────────────────────┐
│  TIER 1: Aiven Managed (Production, 99.99% SLA)               │
│  PostgreSQL 16/17 + TimescaleDB 2.25.x Hypercore              │
│                                                                 │
│  ┌──────────┐  ┌──────────────────────────────────────────┐   │
│  │ Heap      │  │ TimescaleDB Hypercore (auto hybrid)      │   │
│  │ (OLTP)    │  │                                          │   │
│  │ leads     │  │ HOT: row-store (fast writes/updates)     │   │
│  │ users     │  │ WARM: auto-columnar (10-100× analytics)  │   │
│  │ orgs      │  │ COLD: compressed (90-98% ratio)          │   │
│  │ templates │  │                                          │   │
│  └──────────┘  │ agent_metrics · agent_costs · audit_log   │   │
│                 │ iot_sensors · firehorse_events            │   │
│                 └──────────────────────────────────────────┘   │
│  Same SQL · Same RLS · Zero ETL · EU sovereign                 │
├────────────────────────────────────────────────────────────────┤
│  TIER 2: GN100 Edge (Analytics + Dev, self-hosted Helsinki)    │
│  PostgreSQL 16 + TimescaleDB + pg_duckdb + pgvector            │
│                                                                 │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │ TimescaleDB   │  │ pg_duckdb  │  │ pgvector             │  │
│  │ (mirror)      │  │ (50-600×)  │  │ (local RAG)          │  │
│  │ audit mirror  │  │ OLAP joins │  │ Ollama + embeddings   │  │
│  └──────────────┘  └────────────┘  └──────────────────────┘  │
│  SSH tunnel only · localhost bind · EU sovereign hardware      │
└────────────────────────────────────────────────────────────────┘
```

**Why two tiers?** Aiven's extension whitelist **blocks** pg_duckdb, pg_mooncake, and Hydra. TimescaleDB Hypercore is the only approved HTAP option on Aiven. The GN100 edge fills the gap with pg_duckdb for ad-hoc OLAP analytics that benefit from DuckDB's 50–600× vectorized engine.

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

| Criterion                  | Requirement                                                  |
| -------------------------- | ------------------------------------------------------------ |
| **Open source**            | Must be open source (Apache 2.0, PostgreSQL License, or MIT) |
| **Active maintenance**     | Commit activity in last 6 months                             |
| **PostgreSQL version**     | Compatible with pg16+                                        |
| **RLS compatibility**      | Must work with Row-Level Security                            |
| **Supabase/Aiven support** | Must be available on target platform                         |
| **EU sovereignty**         | Provider assessed per DWS_SOVEREIGNTY_STANDARD.md            |
| **Security audit**         | No known CVEs in current version                             |

### 3.3 Extension Lifecycle

```
Evaluate → Approve → Pilot (Developer plan) → Production (Startup plan) → Monitor → Upgrade/Deprecate
```

---

## 4. Data Classification & Tiering

### 4.1 Temperature Tiers

| Tier        | Age              | Storage                                          | Access Pattern                | Compression    |
| ----------- | ---------------- | ------------------------------------------------ | ----------------------------- | -------------- |
| **Hot**     | 0–90 days        | Row (heap) or uncompressed hypertable            | Read/write, real-time queries | None           |
| **Warm**    | 90 days – 1 year | TimescaleDB compressed chunks                    | Read-only queries, reports    | LZ4 (fast)     |
| **Cold**    | 1–7 years        | TimescaleDB compressed + optional Iceberg export | Compliance queries, audits    | ZSTD (maximum) |
| **Archive** | >7 years         | Iceberg/Parquet on S3-compatible storage         | Legal hold, regulatory export | Parquet native |

### 4.2 Classification by Table

| Table                    | Tier Policy                 | Justification                             |
| ------------------------ | --------------------------- | ----------------------------------------- |
| `firehorse_leads`        | Hot (always)                | Active CRM, frequent updates              |
| `firehorse_events`       | Hot→Warm at 90d             | Append-only events, query frequency drops |
| `agent_metrics`          | Hot→Warm at 90d             | Daily snapshots, dashboard aggregates     |
| `agent_costs`            | Hot→Warm at 90d             | Cost tracking, monthly reports            |
| `agent_executions`       | Hot→Warm at 30d             | Audit trail, debugging                    |
| `article12_audit_log`    | Hot→Warm at 90d→Cold at 1yr | 7-year retention, EU AI Act Art 12        |
| `iot_sensor_data` (DWS7) | Hot→Warm at 7d→Cold at 90d  | High-volume ingestion, fast tiering       |
| `users`, `organizations` | Hot (always)                | Auth, low volume                          |

### 4.3 Classification for Filesystem Content Stores

Not all DWS data lives in Postgres. Some content stores are filesystem-backed markdown/PDF and follow different governance rules. They are still subject to classification and retention — just with file-level rather than row-level controls.

| Path                     | Owner     | Classification        | PII allowed?          | Retention                                                       | Backup target                   |
| ------------------------ | --------- | --------------------- | --------------------- | --------------------------------------------------------------- | ------------------------------- |
| `kb/raw/`                | **Human** | INTERNAL (research)   | **NO**                | Indefinite — human curates; `dws kb lint` flags stale           | Git repo + ProtonDrive          |
| `kb/wiki/`               | **LLM**   | INTERNAL (derived)    | **NO**                | Indefinite — regenerated on each `dws kb compile`               | Git repo + ProtonDrive          |
| `kb/ephemeral/`          | LLM       | WORKING (transient)   | **NO**                | **7 days** — `scripts/daily/kb-cleanup.sh` sweeps older entries | Not backed up                   |
| `kb/kb.json`             | LLM       | INTERNAL (metadata)   | No                    | Indefinite — updated on each compile/lint                       | Git repo                        |
| `docs/field-notes/`      | Human     | INTERNAL (operations) | No                    | Indefinite — version history                                    | Git repo                        |
| `logs/email-audit.jsonl` | System    | RESTRICTED (audit)    | Yes (email addresses) | 7 years (financial record retention)                            | Sovereignty audit + ProtonDrive |

**KB classification rules (enforced by operator discipline, not code):**

1. **NO PII in `kb/raw/` or `kb/wiki/`.** The KB is intended for regulatory text, public research, industry signals, and repo/code notes — not personal data. If a source document contains PII (names, emails, ID numbers), redact before ingest or store in `logs/email-audit.jsonl`-equivalent audited storage instead.
2. **Secrets scanner runs on KB content.** `.claude/hooks/secret-scan.sh` scans Write/Edit targets including `kb/`. Any commit carrying a detected secret is blocked.
3. **`kb/wiki/` is derived content.** Treat it as cache: losing it is recoverable by re-running `dws kb compile`. Do not use it as a source of truth for anything outside the KB agent.
4. **`kb/ephemeral/` is transient working state.** Never link to ephemeral paths from permanent docs, standards, or field notes — they may be swept within 7 days.
5. **Path-traversal protection is enforced at the tool layer.** `kb_write_article` in `src/agents/kb.agent.ts` confines writes to `kb/wiki/`. Any bypass attempt is an agent fault.
6. **GDPR Art 17 erasure procedure.** If a data subject's PII accidentally lands in `kb/`, treat it as an incident: identify the source file, remove it from `kb/raw/`, run `dws kb compile --full` to regenerate `kb/wiki/` without the source, log the erasure in `article12_audit_log`.

Full KB operator reference: `Admin/ADMIN_MANUAL.md` §33.3.

---

## 5. Retention Policy

### 5.1 Regulatory Retention Requirements

| Regulation                             | Requirement                                                                  | DWS Implementation                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **EU AI Act Art 12**                   | Automatic logging for high-risk AI, retained for duration of system lifetime | 7 years, append-only, immutable                                                                        |
| **GDPR Art 17**                        | Right to erasure ("right to be forgotten")                                   | Soft-delete + scheduled purge (NOT applicable to audit logs — Art 17(3)(e) legal obligation exemption) |
| **GDPR Art 5(1)(e)**                   | Storage limitation — no longer than necessary                                | Operational data: 90d hot, 1yr warm, then purge unless regulatory hold                                 |
| **NIS2 Art 23**                        | Incident logs for notification                                               | 5 years minimum                                                                                        |
| **CSRD**                               | ESG reporting data traceability                                              | 10 years (financial reporting standard)                                                                |
| **Finnish Accounting Act (1336/1997)** | Financial records                                                            | 10 years                                                                                               |

### 5.2 Per-Table Retention Rules

| Table                    | Hot    | Warm         | Cold | Total Retention            | Purge Policy                    |
| ------------------------ | ------ | ------------ | ---- | -------------------------- | ------------------------------- |
| `article12_audit_log`    | 90d    | 1yr          | 7yr  | **7 years**                | Never delete (legal obligation) |
| `agent_executions`       | 30d    | 1yr          | —    | **1 year**                 | Soft-delete, anonymize PII      |
| `agent_metrics`          | 90d    | 1yr          | —    | **1 year**                 | Aggregate then purge raw        |
| `agent_costs`            | 90d    | 2yr          | —    | **2 years**                | Financial record retention      |
| `firehorse_events`       | 90d    | 1yr          | —    | **1 year**                 | Anonymize email addresses       |
| `firehorse_leads`        | Active | 2yr inactive | —    | **Until deletion request** | GDPR Art 17 compliant           |
| `iot_sensor_data` (DWS7) | 7d     | 90d          | 1yr  | **1 year**                 | Aggregate then purge raw        |

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

| Data Tier | Algorithm          | Target Ratio | Notes                          |
| --------- | ------------------ | ------------ | ------------------------------ |
| Hot       | None               | 1:1          | Full write performance         |
| Warm      | LZ4 (TimescaleDB)  | 5:1 – 10:1   | Fast decompression for queries |
| Cold      | ZSTD (TimescaleDB) | 10:1 – 20:1  | Maximum compression            |
| Archive   | Parquet native     | 20:1 – 50:1  | Columnar + dictionary encoding |

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

| Regulation                 | Article      | DB Requirement             | Implementation                                                     |
| -------------------------- | ------------ | -------------------------- | ------------------------------------------------------------------ |
| **GDPR**                   | Art 5(1)(e)  | Storage limitation         | Retention policies per §5                                          |
| **GDPR**                   | Art 17       | Right to erasure           | Soft-delete + purge procedure per §5.3                             |
| **GDPR**                   | Art 25       | Privacy by design          | RLS on all tables, encryption at rest (AES-256)                    |
| **GDPR**                   | Art 30       | Records of processing      | Processing activity log in `article12_audit_log`                   |
| **GDPR**                   | Art 32       | Security of processing     | TLS 1.3 in transit, AES-256 at rest, key rotation                  |
| **GDPR**                   | Art 44-49    | International transfers    | EU-only hosting (Aiven Finland), no CLOUD Act exposure             |
| **EU AI Act**              | Art 12       | Automatic logging          | Immutable append-only `article12_audit_log`, 7yr retention         |
| **EU AI Act**              | Art 13       | Transparency               | Model cards, confidence scores in log schema                       |
| **EU AI Act**              | Art 14       | Human oversight            | E-stop audit trail, Captain's Bridge log entries                   |
| **EU AI Act**              | Annex IV     | Technical documentation    | Full schema mapping in `article-12-annex-iv-log-schema-mapping.md` |
| **NIS2**                   | Art 21(1)    | Risk management            | ISMS controls, extension governance per §3                         |
| **NIS2**                   | Art 21(2)(d) | Supply chain security      | EU-only vendors per §9                                             |
| **NIS2**                   | Art 23       | Incident notification      | 24hr CERT-FI notification, incident log 5yr retention              |
| **CSRD**                   | ESRS E1      | Climate data               | Scope 1/2/3 emissions tables, EN 15978 LCA stages                  |
| **EU Data Act**            | 2023/2854    | IoT data portability       | Open formats (Iceberg/Parquet), machine-readable export            |
| **Suomen laki**            | 124/2025     | Finnish NIS2 transposition | Supply chain transparency, CERT-FI registration                    |
| **Finnish Accounting Act** | 1336/1997    | Financial record retention | 10-year retention for financial data                               |

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

| Tier                       | Definition                                       | Example                                                 |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| **Tier 1** (Sovereign)     | EU company + EU infrastructure + EU law          | Aiven (Finnish, Helsinki DC)                            |
| **Tier 2** (Adequate)      | Non-EU company + EU infrastructure + open source | TimescaleDB (Swedish/US, open source, runs on Aiven EU) |
| **Tier 3** (At-Risk)       | US company + EU infrastructure                   | Supabase (US, CLOUD Act exposure)                       |
| **Tier 4** (Non-Compliant) | US company + US infrastructure                   | Not used                                                |

### 9.2 Database Vendor Assessment

| Vendor                  | Sovereignty Tier | Usage                          | Risk Mitigation            |
| ----------------------- | ---------------- | ------------------------------ | -------------------------- |
| **Aiven**               | Tier 1           | V1 production (Startup $75/mo) | Primary — EU sovereign     |
| **Supabase**            | Tier 3           | MVP (current, to be migrated)  | Migration to Aiven Q2 2026 |
| **Extension providers** | Tier 2           | Open source, runs on Aiven     | Source code auditable      |

### 9.3 Data Residency Rules

1. **All production data** MUST reside in EU (Finland or Germany).
2. **No replication** to non-EU regions without DPIA and explicit approval.
3. **Backup storage** in EU only (Aiven automatic backups to EU DC).
4. **AI inference** may use US providers (Anthropic) — logged honestly in audit trail (`inference_in_eu=FALSE`).

---

## 10. Migration & Schema Change Policy

### 10.1 Marcus Safety Rules

Every database migration MUST follow Marcus's safety rules (from CLAUDE.md):

| Rule                                        | Enforcement                   |
| ------------------------------------------- | ----------------------------- |
| Every migration wrapped in `BEGIN`/`COMMIT` | Pre-commit check              |
| RLS enabled on all new tables               | Drift check flags missing RLS |
| No `DROP TABLE` without explicit approval   | PR review gate                |
| No `SECURITY DEFINER` on public functions   | Lint rule                     |
| `service_role` key never in client code     | `.env` + gitignore audit      |

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
4. PR review (Marcus review)
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

| Metric                   | Target       | Current                        |
| ------------------------ | ------------ | ------------------------------ |
| **RTO (schema rebuild)** | < 5 minutes  | Achievable via migrations      |
| **RTO (full restore)**   | < 15 minutes | Aiven PITR + migration replay  |
| **RPO**                  | < 1 hour     | Aiven continuous WAL archiving |

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

### 12.1 Current Registry (2026-03-13)

| Extension                 | Version    | Provider      | License    | Sovereignty | Aiven            | Supabase | GN100 Edge       | DWS Status    | Phase       |
| ------------------------- | ---------- | ------------- | ---------- | ----------- | ---------------- | -------- | ---------------- | ------------- | ----------- |
| **uuid-ossp**             | built-in   | PostgreSQL    | PostgreSQL | Tier 1      | Yes              | Yes      | Yes              | Active        | —           |
| **pgcrypto**              | built-in   | PostgreSQL    | PostgreSQL | Tier 1      | Yes              | Yes      | Yes              | Active        | —           |
| **pgvector**              | 0.8.x      | pgvector team | PostgreSQL | Tier 2      | Yes              | Yes      | **Yes**          | Active        | DWS6        |
| **pg_stat_statements**    | built-in   | PostgreSQL    | PostgreSQL | Tier 1      | Yes              | Yes      | Yes              | Planned       | Phase 0     |
| **pg_trgm**               | built-in   | PostgreSQL    | PostgreSQL | Tier 1      | Yes              | Yes      | Yes              | Planned       | DWS6        |
| **TimescaleDB Hypercore** | **2.25.x** | Timescale Inc | Timescale  | Tier 2      | **Yes (native)** | Yes      | **Yes**          | **APPROVED**  | **Phase 1** |
| **pg_duckdb**             | **1.1.x**  | DuckDB team   | MIT        | Tier 2      | **NO (blocked)** | Yes      | **Yes (v1.1.1)** | **Edge only** | Phase 1     |
| **pg_mooncake**           | 0.x        | Databricks    | Apache 2.0 | Tier 3      | **NO (blocked)** | Custom   | Evaluate         | Evaluate      | Phase 3     |

### 12.2 Rejected / Blocked Extensions

| Extension                 | Status      | Reason                                                              | Date       |
| ------------------------- | ----------- | ------------------------------------------------------------------- | ---------- |
| **Citus Columnar**        | Rejected    | Azure-locked, US sovereignty concern, older codebase                | 2026-03-12 |
| **ParadeDB pg_analytics** | Rejected    | Redundant with pg_duckdb + native TSVECTOR search                   | 2026-03-12 |
| **pg_duckdb on Aiven**    | **Blocked** | Aiven extension whitelist does not include pg_duckdb (March 2026)   | 2026-03-13 |
| **pg_mooncake on Aiven**  | **Blocked** | Aiven extension whitelist does not include pg_mooncake (March 2026) | 2026-03-13 |
| **Hydra on Aiven**        | **Blocked** | Hydra joined Supabase; not available on Aiven                       | 2026-03-13 |

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

## 13. 2026 Columnar/HTAP Comparison

### 13.1 Comprehensive Comparison (March 2026)

Evaluated based on official docs, ClickBench rankings, GitHub activity, managed-provider support, real-world production usage (2025–2026), and open-source maturity.

| Solution                         | Storage Type                  | Execution Engine     | Updates/Deletes   | Speed vs PG       | Aiven?     | Supabase?        | Self-Host?    | Maturity      |
| -------------------------------- | ----------------------------- | -------------------- | ----------------- | ----------------- | ---------- | ---------------- | ------------- | ------------- |
| **Hydra (→Supabase Warehouse)**  | Native columnar + Iceberg     | DuckDB vectorized    | Append-optimized  | 100–600×          | No         | Alpha (Feb 2026) | Yes           | High          |
| **pg_duckdb v1.x**               | Accelerates heap + S3/Iceberg | Embedded DuckDB      | Full PG speed     | 50–600×           | **No**     | Yes              | **Excellent** | Very High     |
| **pg_mooncake (→Databricks)**    | Iceberg/Delta Lake columnar   | DuckDB + PG metadata | Full ACID         | Top-10 ClickBench | No         | Custom           | Excellent     | High          |
| **ParadeDB pg_analytics**        | On-disk columnar + S3         | DuckDB               | Good              | 10–100×           | No         | Yes              | Excellent     | High          |
| **TimescaleDB 2.25.x Hypercore** | Auto hybrid row→columnar      | Postgres + SIMD      | **Best-in-class** | 10–100×           | **Native** | Yes              | Excellent     | **Very High** |
| **Citus Columnar**               | Native columnar               | Postgres executor    | Good              | 5–50×             | No         | No               | Yes           | Medium        |

### 13.2 Key Industry Events (2025–2026)

| Date     | Event                                                              | Impact on DWS                                       |
| -------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| Oct 2025 | pg_mooncake acquired by Databricks                                 | Open source continues; Tier 3 sovereignty risk      |
| Feb 2026 | Hydra core team joins Supabase → "Supabase Warehouse"              | No longer standalone; Supabase-only (Tier 3)        |
| Mar 2026 | TimescaleDB 2.25.x Hypercore general availability                  | **Primary DWS standard** — auto hybrid row→columnar |
| Mar 2026 | Aiven whitelist confirmed: pg_duckdb/pg_mooncake/Hydra **blocked** | Two-tier architecture required                      |

### 13.3 When to Deviate from Aiven + TimescaleDB

| Scenario                                          | Alternative                                | Exception Process       |
| ------------------------------------------------- | ------------------------------------------ | ----------------------- |
| Pure non-time-series analytics + lakehouse writes | Supabase Warehouse (Hydra team, alpha)     | Formal exception review |
| Extreme Spark/Trino lakehouse interop             | Self-hosted pg_mooncake                    | Formal exception review |
| 50–600× OLAP acceleration needed                  | pg_duckdb on GN100 edge (already deployed) | Standard (edge tier)    |
| **Never**                                         | Force unsupported extensions onto Aiven    | **Blocked**             |

---

## 14. Two-Tier HTAP Architecture

### 14.1 Tier 1: Aiven Managed (Production)

**Image:** Aiven for PostgreSQL (PG16 or PG17) + TimescaleDB 2.25.x (native)

| Component              | Extension                         | Workload                            | Status    |
| ---------------------- | --------------------------------- | ----------------------------------- | --------- |
| Agent metrics/costs    | TimescaleDB Hypercore hypertables | Time-series + continuous aggregates | Phase 1   |
| Article 12 audit log   | TimescaleDB Hypercore compression | 7-year immutable, 98% compression   | Phase 1–2 |
| IoT sensor data (DWS7) | TimescaleDB Hypercore hypertables | Auto tiering hot→warm→cold          | Phase 2   |
| CSRD/ESG reporting     | Continuous aggregates             | Scope 1/2/3 rollups                 | Phase 2   |

**Aiven setup (one-click):**

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert analytics table to Hypercore hypertable
SELECT create_hypertable('events', 'time',
    chunk_time_interval => INTERVAL '1 day',
    migrate_data => true);

-- Enable automatic columnar compression
ALTER TABLE events SET (
    timescaledb.compress,
    timescaledb.compress_orderby = 'time DESC',
    timescaledb.compress_segmentby = 'user_id, event_type'
);
SELECT add_compression_policy('events', INTERVAL '7 days');
```

### 14.2 Tier 2: GN100 Edge (Analytics + Development)

**Image:** Custom Dockerfile based on `timescale/timescaledb:2.25.2-pg16` + pg_duckdb multi-stage copy

| Component              | Extension               | Workload                              | Status   |
| ---------------------- | ----------------------- | ------------------------------------- | -------- |
| Ad-hoc OLAP queries    | pg_duckdb v1.1.1        | Cross-table analytical joins, 50–600× | Deployed |
| Agent telemetry mirror | TimescaleDB hypertables | Local time-series cache               | Deployed |
| Audit log mirror       | TimescaleDB compression | EU-sovereign immutable copy           | Phase 2  |
| Vector search (RAG)    | pgvector 0.8.x          | Local LLM RAG with Ollama             | Deployed |
| Lakehouse prototype    | pg_mooncake (future)    | Iceberg/Parquet export testing        | Phase 3  |

**Deployment:** `scripts/deploy-acer-postgres.sh` (SSH to GN100)

### 14.3 Data Flow Between Tiers

```
Aiven (Tier 1)                    GN100 Edge (Tier 2)
┌──────────────┐   pg_dump/       ┌──────────────────┐
│ Production   │   pg_restore     │ Analytics Mirror  │
│ TimescaleDB  │ ─────────────→   │ TimescaleDB       │
│ Hypercore    │   (daily sync)   │ + pg_duckdb       │
│              │                  │ + pgvector        │
│ article12    │ ─────────────→   │ audit_log mirror  │
│ audit_log    │   (append-only)  │ (immutable copy)  │
└──────────────┘                  └──────────────────┘
```

---

## 15. Local Development Parity Setup

### 15.1 Standard Local Dev (Aiven-Parity, Copy-Paste Ready)

For standard development where pg_duckdb is not needed:

```yaml
# docker-compose.local.yml — 100% Aiven parity
services:
  db:
    image: timescale/timescaledb:2.25.2-pg16 # exact match to Aiven
    restart: always
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_USER: postgres
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

### 15.2 Init SQL (Aiven-Parity)

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Example: convert any analytics table to Hypercore
SELECT create_hypertable('events', 'time',
    chunk_time_interval => INTERVAL '1 day',
    migrate_data => true);

ALTER TABLE events SET (
    timescaledb.compress,
    timescaledb.compress_orderby = 'time DESC',
    timescaledb.compress_segmentby = 'user_id, event_type'
);
SELECT add_compression_policy('events', INTERVAL '7 days');
```

### 15.3 Verification (Run on Both Local and Aiven)

```sql
SELECT version(), extname, extversion
FROM pg_extension WHERE extname = 'timescaledb';

SELECT * FROM timescaledb_information.compression_settings;
SELECT hypertable_name, compression_enabled
FROM timescaledb_information.hypertables;
```

### 15.4 GN100 Edge Dev (Full Stack with pg_duckdb)

For edge development with pg_duckdb + pgvector: see `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml`

### 15.5 Migration Path (Local → Aiven)

1. `pg_dump -U postgres -d appdb --schema-only > schema.sql`
2. Create identical Aiven service (EU region)
3. Run same `CREATE EXTENSION` + `create_hypertable` + compression policy
4. Import data (Aiven console or `pg_restore`)
5. Update connection string → done (zero ORM changes)

---

## 16. Related Standards

- `DWS_DEPLOYMENT_STANDARD.md` v1.0 — Per-Surface deploy ontology. Adopts forward-only migration as the canonical convention for `supabase/migrations/`; recommends the **expand / contract** pattern for breaking schema changes (deploy 1 adds new column/table without removing old; deploy 2 backfills; deploy 3 removes old). The Deployment Standard's pre-deploy backup-freshness gate (< 24 h, per `scripts/db-daily-backup.sh`) reads the RTO / RPO targets defined in this standard. Two-tier HTAP deploy lanes (Aiven + GN100 edge) are governed there.
- `DWS_SECURITY_STANDARD.md` v2.3 — RLS coverage, encryption at rest / in transit, backup encryption.
- `DWS_SOVEREIGNTY_STANDARD.md` v1.2 — EU residency, CLOUD Act analysis, Aiven sovereign positioning.
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` v1.0 — EU AI Act Art. 12 audit log persistence (table `article12_audit_log`).

---

(c) 2026 Lifetime Oy — DWS Data Standard v2.2
