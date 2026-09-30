# Decision Record: PostgreSQL as the DWS Database

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACCEPTED — records decisions already made (LD-2026-005, LD-2026-006, `DWS_SECURITY_STANDARD.md` §17.5); makes none of its own
- Document type: Architecture decision record
- Author: Claude Code (standby runtime) + risto.paarni2024@lifetime.fi
- Date: 2026-09-27
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/wizardly-johnson-m6cgww

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Date: 27.09.2026 | Changes: First single record of why DWS runs on PostgreSQL. Collected from the data standard, locked decisions, security §17.5 and the migrations. HIC confirmed (27.09.2026) that jsonb is what removed the need for a separate document database.

Related Documents:

- `DWS_DATA_STANDARD.md` — two-tier architecture, extension registry, JSONB storage rules
- `docs/LOCKED_DECISIONS.md` — LD-2026-005 (Aiven plans), LD-2026-006 (Aiven-first mandate, extension whitelist)
- `DWS_SECURITY_STANDARD.md` §17.5 — Aiven sovereignty exception and its residual risk
- `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md`, `docs/field-notes/2026-07-02-supabase-audit-aiven-deployment-plan.md`
- `docs/field-notes/2026-07-06-edb-postgres-ai-nvidia-dgx-evaluation.md` — Postgres on customer DGX hardware
- `docs/plans/2026-09-24-dgx-sketch-vs-repo-comparison.md` — H6 (plain-Postgres profile), §2.1 (cloud dependencies)

---

## 1. Decision

All DWS product data lives in PostgreSQL. There is no second database engine for documents, time series or vectors.

| Where                         | What runs                                                       | Status (27.09.2026)                                                                                  |
| ----------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Supabase Cloud                | PostgreSQL 17 + Supabase auth, RLS, pg_cron                     | Production default today; `supabase/migrations/` is written against it                               |
| Aiven, `google-europe-north1` | PostgreSQL 16/17 + TimescaleDB 2.25.x Hypercore + pgvector      | Approved production target (LD-2026-006, §17.5 exception); mirror and region disputed, see §4 item 6 |
| GN100 / DGX edge              | PostgreSQL 16 + TimescaleDB + pg_duckdb + pgvector, self-hosted | Analytics, local RAG, development                                                                    |
| Customer DGX (air-gapped)     | PostgreSQL; EDB Postgres AI is the candidate commercial layer   | Roadmap (Taso 2, HIC 27.09.2026); needs the plain-Postgres profile (H6, open)                        |

## 2. Why PostgreSQL

### 2.1 One engine for every workload

DWS data has four shapes: transactions (orders, customers, organisations), time series (agent metrics, audit log, sensors), vectors (RAG embeddings) and semi-structured documents (enrichment data, events, metadata). Postgres covers all four with one query language and one access-control model:

| Workload       | Postgres feature         | Replaces                        |
| -------------- | ------------------------ | ------------------------------- |
| Transactions   | Heap tables, constraints | —                               |
| Time series    | TimescaleDB Hypercore    | Separate time-series database   |
| Vectors        | pgvector 0.8.x           | Separate vector database        |
| Documents      | jsonb                    | Separate document database      |
| Scheduled jobs | pg_cron                  | External scheduler for DB tasks |

`DWS_DATA_STANDARD.md` §2 sums it up as "Same SQL · Same RLS · Zero ETL". Each extra engine would add another copy of the data, another sync job, another access-control model to keep in step with RLS, and another vendor to assess for sovereignty.

### 2.2 jsonb closed the document-store gap (HIC, 27.09.2026)

The one workload that would normally justify a second database is flexible, schema-light data: enrichment results, trigger events, tech stacks, order metadata. jsonb handles it inside Postgres:

- It is stored in binary form and can be indexed (GIN), so it can be queried, not just stored.
- It sits in the same row as relational columns, under the same RLS policy and the same transaction.
- Its shape can be enforced where it matters: migration 099 requires `metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object')`.
- It needs no extension, so it works on every host in §1, including a plain air-gapped Postgres.

Evidence: 50 of 92 migration files use jsonb. Storage guidance for jsonb-heavy tables is in `DWS_DATA_STANDARD.md` (TOAST strategy section).

### 2.3 Security in the database, not only in the app

Row-level security enforces tenant isolation inside Postgres, so a bug in an API route cannot read another organisation's rows. The repository rule is that every `CREATE TABLE public.*` gets grants, `ENABLE ROW LEVEL SECURITY` and policies (CLAUDE.md, Supabase table grants). It maps to GDPR Art. 25 (privacy by design) in `DWS_DATA_STANDARD.md`. Every extension must work with RLS before approval (`DWS_DATA_STANDARD.md` §3.2).

### 2.4 Portability: no lock-in to one host

Supabase, Aiven, self-hosted edge and customer hardware all run standard PostgreSQL. The difference between hosts is small and already handled: `scripts/aiven-init.sql` enables pgvector and adds stand-ins for Supabase's `auth.uid()`, `auth.jwt()` and `auth.role()` so the same RLS policies load on Aiven. `scripts/db-recovery.sh --target aiven` replays every migration onto a fresh instance. This is what makes the air-gapped Sovereign Runtime possible without a rewrite.

### 2.5 EU hosting at startup cost

Aiven is Finnish and was approved for `google-europe-north1` (§17.5; region now disputed, §4 item 6) at about $80 per month (Developer $5 + Startup $75, LD-2026-005). pgvector works the same as on Supabase, so moving is a migration, not a rebuild.

### 2.6 Open source and a mature ecosystem

PostgreSQL is under the PostgreSQL License, which DWS requires of extensions too (`DWS_DATA_STANDARD.md` §3.2). No vendor can withdraw it. Commercial support exists when a customer asks for it (EDB, for customer DGX deployments).

## 3. Alternatives considered

| Alternative                              | Outcome                                                                                             | Source                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Dedicated vector DB for the cloud tier   | Not adopted; pgvector on Aiven. Qdrant Edge recommended only for on-device robot and sensor search. | `docs/field-notes/2026-02-16-zvec-embedded-vector-db-european-alternatives.md` |
| pg_duckdb / pg_mooncake / Hydra on Aiven | Blocked by Aiven's extension whitelist; pg_duckdb runs on the edge tier instead.                    | `DWS_DATA_STANDARD.md` §2, LD-2026-006                                         |
| EDB Postgres AI for managed production   | Not adopted (cost class, locked mandate). Candidate for customer air-gapped DGX only.               | `docs/field-notes/2026-07-06-edb-postgres-ai-nvidia-dgx-evaluation.md`         |
| Separate document database               | Not needed; jsonb covers the workload (§2.2).                                                       | HIC, 27.09.2026                                                                |

## 4. Costs and limits accepted

1. **Heavy analytics do not run on the production host.** Aiven blocks pg_duckdb, so ad-hoc OLAP goes to the GN100 edge tier.
2. **The Aiven host is a sovereignty exception, not a clean pass.** Aiven is US-VC-backed and the region runs on Google Cloud, which §17.5 otherwise treats as transitional. The residual risk is recorded in §17.5 and accepted by the founder (02.07.2026). Use that wording with investors and customers; do not claim "no CLOUD Act exposure".
3. **Supabase Cloud is not rated in §17.5.** It is the production default today (§1) and is listed as a blocker for air-gapped delivery (`docs/plans/2026-09-24-dgx-sketch-vs-repo-comparison.md` §2.1), but the §17.5 table has no row for it.
4. **Migrations assume Supabase.** Several (for example 092/093) need Supabase auth, roles and pg_cron. Plain Postgres needs a compatibility profile first (H6, open).
5. **One engine is one failure domain.** Offset by daily encrypted `pg_dump` to several destinations (`DWS_SECURITY_STANDARD.md` DR-1 to DR-3) and the recovery script. Do not count the Aiven mirror as a warm standby; see item 6.
6. **The Aiven mirror is not proven.** `DWS_SECURITY_STANDARD.md` DR-5 lists a daily Supabase→Aiven mirror as `Active`, and its RTO table assumes a 1-hour Aiven failover. The same standard's v3.0 history entry (07.07.2026) says an audit found that mirror was never wired to any automation, marked DR-5 superseded, and named the Aiven service as `pg-32ace152` on DigitalOcean Frankfurt, not `google-europe-north1`. Those body edits are not in the file. Until this is settled, the provider and region of the Aiven service are unconfirmed.

## 5. Open items (HIC)

| Item                                                                                  | Where                                                                    |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Plain-Postgres profile for 080/092/093 (H6)                                           | `docs/plans/2026-09-24-dgx-sketch-vs-repo-comparison.md`                 |
| Sovereignty rating for Supabase Cloud                                                 | `DWS_SECURITY_STANDARD.md` §17.5                                         |
| DR-5 vs v3.0 conflict: is the Aiven mirror running, and on which provider and region? | `DWS_SECURITY_STANDARD.md` §3.6.1, §17.5                                 |
| Production cutover date from Supabase to Aiven                                        | `docs/field-notes/2026-07-02-supabase-audit-aiven-deployment-plan.md` §5 |

## 6. One-paragraph version (for customers and investors)

DWS runs on PostgreSQL, the open-source database. One engine holds our transactions, time series, AI vectors and flexible JSON documents, protected by row-level security inside the database itself. That means fewer systems to secure and no data copied between them. Because it is standard Postgres, the same product runs on our managed EU host, on edge hardware, or fully inside a customer's own air-gapped environment.
