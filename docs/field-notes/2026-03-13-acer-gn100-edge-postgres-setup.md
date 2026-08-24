# Acer Veriton GN100 — Edge PostgreSQL Setup (TimescaleDB + pg_duckdb + pgvector)

***
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Aiven-first mandate integration — rebased Dockerfile on timescale/timescaledb:2.25.2-pg16 (Aiven parity), updated comparison table with Aiven whitelist reality, pg_duckdb confirmed edge-only
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Autoresearch validation — fixed pg_duckdb install (multi-stage Docker copy), added TimescaleDB PGDG fallback, removed broken conf mount
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Initial creation — Docker-based PostgreSQL 16 with TimescaleDB, pg_duckdb, pgvector for Acer Veriton GN100 edge device

Session Links & References:
  - Claude Code: https://github.com/blogtheristo/dws6/tree/claude/plan-postgres-columnar-3bSn6

Document Status:
  - Created: 13.03.2026
  - Last Modified: 13.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Context

The DWS6 platform requires a local PostgreSQL instance on the Acer Veriton GN100 edge device for:

1. **Agent execution telemetry** — TimescaleDB hypertables for time-series agent metrics
2. **Ad-hoc OLAP analytics** — pg_duckdb for DuckDB-powered analytical queries
3. **Local vector search** — pgvector for RAG pipelines with on-device Ollama LLMs
4. **EU Article 12 audit log mirror** — Immutable compliance data on EU-sovereign hardware
5. **DWS7 IoT pipeline prototype** — Sensor data ingestion testing before production deployment

This setup follows the DWS Data Standard (Phase 1 → Phase 3 progression) and bridges the gap between Supabase (cloud) and Aiven (EU-sovereign) by providing a fully self-hosted, self-controlled database on Finnish hardware.

## Architecture Decision

### Why not just use Supabase or Aiven?

| Concern | Supabase | Aiven | GN100 Edge |
|---------|----------|-------|------------|
| TimescaleDB Hypercore | Yes (pre-installed) | **Yes (native 2.25.x)** | **Yes (2.25.2)** |
| pg_duckdb | Yes (database.dev) | **NO (whitelist blocked)** | **Yes (v1.1.1)** |
| pgvector | Available | Available | Available |
| Data sovereignty | US-managed | EU-managed (Finland) | Self-hosted (Helsinki Lab) |
| Latency to device | 50-200ms | 10-50ms | <1ms |
| Cost | $25/mo | $75/mo | $0 (electricity only) |
| Offline capability | None | None | Full |

### Why all three extensions together?

- **TimescaleDB** handles high-frequency time-series writes (agent telemetry, IoT sensors) with automatic compression and continuous aggregates
- **pg_duckdb** handles ad-hoc analytical queries that would otherwise require a separate data warehouse — runs DuckDB's vectorized engine inside PostgreSQL
- **pgvector** maintains consistency with the Supabase production stack and enables local RAG without cloud latency

## Device Constraints

| Constraint | Value | Impact |
|------------|-------|--------|
| Architecture | ARM64 (aarch64) | Docker images must have ARM64 manifests |
| RAM | 120 GiB | PostgreSQL tuned for 32 GB allocation (shared_buffers=8GB) |
| CPU | 10 cores @ 3.9GHz | max_parallel_workers=8 |
| GPU | NVIDIA GB10 | Not used by PostgreSQL — reserved for LLM inference |
| Network | IPv6 + VPN only | PostgreSQL bound to localhost, SSH tunnel for remote access |
| OS | Ubuntu 24.04.4 LTS | Native apt packages available for all extensions |

## Deployment Files

| File | Purpose |
|------|---------|
| `Admin/Acer-Veriton-GN100/postgres/Dockerfile` | Custom PostgreSQL 16 image with all three extensions |
| `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml` | Service definition with GN100-tuned parameters |
| `Admin/Acer-Veriton-GN100/postgres/init.sql` | Extension initialization, auth stubs, metadata table |
| `Admin/Acer-Veriton-GN100/postgres/.env.example` | Environment variable template |
| `scripts/deploy-acer-postgres.sh` | SSH deployment script with retry logic |

## PostgreSQL Tuning for GN100

The `docker-compose.yml` passes tuned parameters for the GN100 hardware:

```
shared_buffers=8GB           # ~25% of 32GB allocation
effective_cache_size=24GB    # ~75% of 32GB allocation
maintenance_work_mem=2GB     # for VACUUM, CREATE INDEX
work_mem=256MB               # per-operation sort/hash
max_parallel_workers=8       # 8 of 10 cores for PG
shm_size=4GB                 # Docker shared memory
```

## Deployment Procedure

### 1. Prepare .env file

```bash
cd Admin/Acer-Veriton-GN100/postgres/
cp .env.example .env
# Edit .env — set EDGE_PG_PASSWORD to a strong password
```

### 2. Deploy via SSH

```bash
./scripts/deploy-acer-postgres.sh
```

The script:
1. Copies Dockerfile, docker-compose.yml, init.sql, .env to `/opt/dws/edge-postgres/` on the GN100
2. Builds the Docker image (ARM64 native)
3. Starts PostgreSQL
4. Waits for health check
5. Verifies all three extensions are loaded

### 3. Connect via SSH tunnel

```bash
# Open tunnel (from your machine)
./scripts/deploy-acer-postgres.sh --tunnel

# In another terminal
psql postgresql://dws_edge@localhost:15432/dws_edge
```

### 4. Verify extensions

```sql
SELECT extname, extversion FROM pg_extension ORDER BY extname;
-- Expected: duckdb, pgcrypto, plpgsql, timescaledb, uuid-ossp, vector
```

## Security

| Control | Implementation |
|---------|---------------|
| Network binding | `127.0.0.1:5432` only — not exposed to network |
| Remote access | SSH tunnel only (`ssh -L 15432:127.0.0.1:5432`) |
| Credentials | `.env` file (gitignored), never in Docker image |
| Telemetry | TimescaleDB telemetry disabled (`timescaledb.telemetry_level=off`) |
| Data residency | All data on-device in Helsinki Lab |
| Auth stubs | `auth.uid()/jwt()/role()` return dummy values for Supabase RLS compat |

## Autoresearch Validation (v1.1)

Following the DWS autoresearch methodology (modify → verify → keep/discard → repeat), three potential concerns from the initial implementation were systematically validated:

### Experiment 1: TimescaleDB ARM64 on Debian Bookworm

| Hypothesis | TimescaleDB APT packages may not exist for ARM64 Bookworm |
|------------|----------------------------------------------------------|
| Method | Web research: Timescale PackageCloud + PGDG apt.postgresql.org |
| Finding | **CONFIRMED AVAILABLE** on both repositories |
| PackageCloud | `timescaledb-2-2.15.1-postgresql-16_2.15.1~debian12_arm64.deb` |
| PGDG | `postgresql-16-timescaledb` v2.21.1 for arm64 bookworm-pgdg |
| Action | **KEEP** current PackageCloud approach + **ADD** PGDG as fallback |

Sources:
- Timescale PackageCloud: https://packagecloud.io/timescale/timescaledb
- PGDG APT: https://wiki.postgresql.org/wiki/Apt

### Experiment 2: pg_duckdb ARM64 DEB Packages

| Hypothesis | pg_duckdb GitHub release DEB packages may not include ARM64 |
|------------|-------------------------------------------------------------|
| Method | GitHub API check + Docker Hub multi-arch manifest verification |
| Finding | **DEB UNCERTAIN**, Docker image **CONFIRMED** multi-arch ARM64 |
| Docker tag | `pgduckdb/pgduckdb:16-v1.1.1` (buildx bake, ARM64 + AMD64) |
| Action | **DISCARD** DEB download approach → **REPLACE** with multi-stage Docker COPY |

Fix applied: Dockerfile now uses multi-stage build to copy pg_duckdb extension files directly from the official `pgduckdb/pgduckdb:16-v1.1.1` image, eliminating DEB package dependency entirely.

Sources:
- pg_duckdb Docker: https://hub.docker.com/r/pgduckdb/pgduckdb
- pg_duckdb GitHub: https://github.com/duckdb/pg_duckdb

### Experiment 3: Missing conf/postgresql.conf Mount

| Hypothesis | docker-compose.yml mounts `./conf/postgresql.conf` which doesn't exist |
|------------|------------------------------------------------------------------------|
| Method | File system check |
| Finding | **CONFIRMED BROKEN** — file never created, mount would fail on startup |
| Action | **DISCARD** volume mount → command-line `-c` flags already handle all tuning |

Fix applied: Removed `./conf/postgresql.conf:/etc/postgresql/postgresql.conf:ro` volume mount from docker-compose.yml.

### Autoresearch Summary

| # | Concern | Status | Action |
|---|---------|--------|--------|
| 1 | TimescaleDB ARM64 | CONFIRMED | Keep + add PGDG fallback |
| 2 | pg_duckdb ARM64 DEB | UNCERTAIN | Multi-stage Docker COPY |
| 3 | conf/postgresql.conf | BROKEN | Remove mount |

All three concerns resolved. Dockerfile v1.1.0 is now validated for ARM64 deployment.

## Next Steps

1. **Create TimescaleDB hypertables** — Convert agent_executions, usage_events to hypertables on the edge
2. **Set up Supabase → Edge sync** — pg_dump/pg_restore pipeline for audit log mirror
3. **Test pg_duckdb analytics** — Run cross-table analytical queries against agent + usage data
4. **IoT prototype** — Connect Jetson Orin Nano sensor pipeline to edge PostgreSQL
5. **Monitoring** — Add Prometheus postgres_exporter to existing GN100 monitoring stack

## Related Documents

| Document | Location |
|----------|----------|
| DWS Data Standard | `DWS_DATA_STANDARD.md` |
| Acer GN100 Admin | `Admin/Acer-Veriton-GN100/README.md` |
| Docker/CUDA validation | `docs/field-notes/2026-03-11-veriton-gn100-docker-cuda-validation.md` |
| Aiven plan decision | `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md` |
| PostgreSQL columnar evaluation | `docs/field-notes/2026-03-12-postgres-columnar-htap-evaluation.md` |
| Cloud environments | `docs/CLOUD_ENVIRONMENTS.md` |

## Ontology

- Geography: Europe > Finland > Helsinki
- Sector: Technology > Database > Edge Computing
- Entities: Acer Veriton GN100, PostgreSQL, TimescaleDB, pg_duckdb, pgvector, DWS IQ 6
- Tags: edge-database, time-series, OLAP, vector-search, ARM64, self-hosted
