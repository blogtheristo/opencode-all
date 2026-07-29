# Field Note: Aspire 13.2 `WithPostgresMcp()` vs DWS Edge PostgreSQL on DGX Spark

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/study-local-db-spark-MJGKJ | Date: 19.07.2026 | Changes: Initial capture of Aspire 13.2's `WithPostgresMcp()` PostgreSQL MCP sidecar feature, direct comparison against the existing DWS edge PostgreSQL stack on the Acer Veriton GN100 (branded internally as "DGX Spark"), gap analysis (no MCP access to local edge data today), three adoption options.

Session Links & References:

- Upstream source (tweet): @aspiredotdev — https://x.com/aspiredotdev/status/2044102168123232354
- Aspire 13.2 announcement: https://devblogs.microsoft.com/aspire/aspire-13-2-announcement/ (fetch returned 403; corroborated via InfoQ + web search)
- Aspire 13.2 what's new: https://aspire.dev/whats-new/aspire-13-2/ (fetch returned 403; corroborated via web search)
- InfoQ coverage: https://www.infoq.com/news/2026/04/aspire-13-2-release/
- PostgreSQL Hosting integration docs: https://aspire.dev/integrations/databases/postgres/postgres-host/
- crystaldba/postgres-mcp (Postgres MCP Pro): https://github.com/crystaldba/postgres-mcp
- crystaldba/postgres-mcp Docker image: https://hub.docker.com/r/crystaldba/postgres-mcp
- TypeScript AppHost announcement: https://devblogs.microsoft.com/aspire/aspire-typescript-apphost/
- Related DWS field note (same topic family, different Aspire 13.2 feature): `docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md`
- Related DWS research: `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md`
- Related DWS plan (Aspire AppHost explicitly cut from scope): `docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md`
- Edge PostgreSQL config: `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml`, `Admin/Acer-Veriton-GN100/postgres/init.sql`
- DGX Spark infra: `infrastructure/dgx-spark/docker-compose.yml`
- Existing cloud DB MCP: `mcp-servers/supabase-official/Dockerfile`

Document Status:

- Created: 19.07.2026
- Last Modified: 19.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Tooling Comparison / Local Database Infrastructure

Related Documents:

- `docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md` — the same Aspire 13.2 release, `--isolated` mode angle; concluded Aspire is "reference architecture," not deployed
- `docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md` — Aspire AppHost explicitly cut from the sensor-management MVP (line 11: `Cuts: Aspire AppHost`)
- `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml` — the actual local database DWS runs today

---

## Ontology Tags

- **Geography:** Global > Microsoft > .NET Ecosystem; Finland > Helsinki (GN100 edge hardware)
- **Sector:** Technology > Developer Tools > Database Tooling > MCP (Model Context Protocol)
- **Entities:** Microsoft, Aspire team, Crystal DBA (crystaldba/postgres-mcp), DWS IQ 6, Acer Veriton GN100
- **Temporal Context:** 2026-Q2/Q3, Aspire 13.2 release cadence
- **Confidence:** Medium-High — primary devblog/aspire.dev fetches returned 403 (proxy/anti-bot); claims corroborated across InfoQ, NuGet package listings, and Aspire's public docs pages via search snippets. The crystaldba/postgres-mcp ARM64 multi-arch claim is corroborated by the project's Dockerfile using `TARGETPLATFORM`/`BUILDPLATFORM` build args and OCI multi-arch labels, but was not verified by pulling the image on GN100 hardware in this session.

---

## Executive Summary

Aspire 13.2 ships `WithPostgresMcp()` — a one-line hosting API that attaches a **crystaldba/postgres-mcp** ("Postgres MCP Pro") sidecar container to any Aspire-managed PostgreSQL resource, giving AI agents MCP tools for database exploration, query execution, index tuning (via HypoPG cost simulation), and health checks — all against the local dev-time database, no cloud round-trip.

**DWS already runs a local PostgreSQL on the edge device the user calls "DGX Spark"** (actually an Acer Veriton GN100 — see honesty note below) — `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml`, running TimescaleDB + pg_duckdb + pgvector. **That database has zero MCP access today.** Agents talk to it through a raw TypeScript `pg` client. Meanwhile the cloud Supabase database _does_ have MCP access (`mcp-servers/supabase-official/`). Aspire 13.2's `WithPostgresMcp()` is the first concrete, low-cost template for closing that gap — and it doesn't require adopting Aspire itself, since crystaldba/postgres-mcp is a standalone container that Aspire simply orchestrates.

**Naming honesty check:** the user's message says "database on dgx spark." DWS infrastructure docs consistently name the edge hardware **Acer Veriton GN100** (`infrastructure/dgx-spark/` is the _directory name_, and `Admin/Acer-Veriton-GN100/` is the actual hardware). No NVIDIA DGX Spark unit appears anywhere in the repo's infrastructure or environment files searched in this session — "DGX Spark" here is DWS's internal branding for the GN100 edge node, not the NVIDIA DGX Spark product. This note follows the repo's own naming and does not invent a second physical machine.

---

## 1. What Aspire 13.2's `WithPostgresMcp()` Does

| Aspect                   | Detail                                                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API surface**          | `builder.AddPostgres("pg").AddDatabase("mydb").WithPostgresMcp()`                                                                                                                      |
| **What it adds**         | A sidecar container running **crystaldba/postgres-mcp** ("Postgres MCP Pro"), wired to the PostgreSQL resource's connection string                                                     |
| **MCP tools exposed**    | Database schema exploration, arbitrary query execution, index tuning recommendations (cost-simulated via HypoPG against `pg_stat_statements` data), health checks, slow-query analysis |
| **Transport**            | SSE on port 8000                                                                                                                                                                       |
| **Architecture support** | Multi-arch image (`linux/amd64` + `linux/arm64`) — Dockerfile uses `TARGETPLATFORM`/`BUILDPLATFORM` build args, OCI-labeled as multi-architecture                                      |
| **Prerequisite**         | `pg_stat_statements` must be loaded (`shared_preload_libraries`) for the query-analysis and index-tuning tools to have workload data to reason about                                   |
| **AppHost language**     | Available from C# AppHost today; TypeScript AppHost (preview in 13.2) uses the same `Aspire.Hosting.PostgreSQL` package and resource model                                             |
| **Maturity signal**      | crystaldba/postgres-mcp: most recent commit January 2026, 25 open issues (some open since April 2025) — actively used but not enterprise-hardened                                      |

This is the local-database counterpart to what Aspire's `--isolated` mode did for parallel AppHost instances (covered in the companion 2026-04-10 note): another instance of Aspire 13.2's headline theme, "CLI/tooling as a first-class agent interface."

---

## 2. What DWS Already Runs Locally — The Edge PostgreSQL Stack

**File:** `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml` (v2.0.0)

| Aspect                         | Detail                                                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base image**                 | `timescale/timescaledb:2.25.2-pg16` (custom Dockerfile, Aiven parity)                                                                                |
| **Extensions** (`init.sql`)    | `timescaledb` (CASCADE), `duckdb` (pg_duckdb v1.1.1, OLAP), `vector` (pgvector 0.8.x), `uuid-ossp`, `pgcrypto`                                       |
| **`pg_stat_statements`**       | **Not loaded.** `shared_preload_libraries=timescaledb` only — no query-stats extension enabled                                                       |
| **Port**                       | `127.0.0.1:5432` — localhost-only, SSH tunnel required for remote access                                                                             |
| **RAM tuning**                 | Tuned for the GN100's 128GB/10-core profile: `shared_buffers=8GB`, `effective_cache_size=24GB`, `work_mem=256MB`, `max_parallel_workers=8`           |
| **Auth stubs**                 | `auth.uid()`, `auth.jwt()`, `auth.role()` — mirrors Supabase RLS functions so migrations apply cleanly                                               |
| **Sovereignty**                | `timescaledb.telemetry_level = 'off'` set explicitly (EU data sovereignty note in `init.sql`)                                                        |
| **Admin UI**                   | pgAdmin on `127.0.0.1:5050`, opt-in via Compose `profiles: [admin]`                                                                                  |
| **MCP access**                 | **None.** Agents query it via a plain TypeScript `pg` client — no MCP server wraps this database                                                     |
| **Purpose per header comment** | Agent execution telemetry (TimescaleDB hypertables), ad-hoc OLAP (pg_duckdb), local LLM RAG vector search (pgvector), EU Article 12 audit log mirror |

**Contrast — the cloud side already has MCP:** `mcp-servers/supabase-official/Dockerfile` runs `@supabase/mcp-server-supabase@0.7.0` against the cloud Supabase Postgres. So today, DWS agents can query the cloud database through MCP but must fall back to raw SQL/driver calls for the local edge database — the opposite of what an edge-first, sovereignty-first architecture should prioritize.

---

## 3. Direct Comparison

|                                        | Aspire 13.2 `WithPostgresMcp()`                                                | DWS Edge PG (GN100, today)                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Base engine                            | Vanilla PostgreSQL (whatever image the AppHost specifies)                      | PostgreSQL 16 + TimescaleDB + pg_duckdb + pgvector                                                        |
| MCP access                             | ✅ Built-in via one API call                                                   | ❌ None                                                                                                   |
| Query/index tooling for agents         | ✅ crystaldba/postgres-mcp: explore, query, tune, health                       | ❌ None                                                                                                   |
| Time-series / OLAP / vector extensions | ❌ Not part of the MCP sidecar's job — that's the DB image's concern           | ✅ Already has all three                                                                                  |
| ARM64 (GN100 hardware)                 | ✅ Confirmed multi-arch                                                        | ✅ (native)                                                                                               |
| Requires Aspire AppHost                | ✅ Yes — the API is an Aspire hosting extension                                | N/A — Aspire isn't deployed on DGX Spark (confirmed zero Aspire artifacts, per the 2026-04-10 field note) |
| `pg_stat_statements`                   | Required by the sidecar; caller's responsibility to enable it on the target DB | Not currently enabled                                                                                     |
| EU data sovereignty framing            | Not Aspire's concern — inherits whatever the underlying DB does                | ✅ Explicit `telemetry_level = 'off'`, localhost-only binding                                             |

**Key insight:** these are not competing databases — `WithPostgresMcp()` is a _thin MCP wrapper_ that can sit in front of any PostgreSQL instance, including the exact one DWS already runs. The crystaldba/postgres-mcp container itself has no dependency on Aspire; Aspire's contribution is purely the one-line orchestration convenience (`.WithPostgresMcp()` wires the connection string and starts the sidecar automatically). **You can get the same MCP capability today by adding the container directly to the existing `docker-compose.yml`, without adopting Aspire at all.**

---

## 4. Three Options

### Option A — Add `crystaldba/postgres-mcp` directly to the edge Compose stack (recommended)

- No Aspire dependency. Add the sidecar service to `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml`, pointed at the existing `postgres` service via its internal Compose DNS name.
- Enable `pg_stat_statements` in `shared_preload_libraries` (currently only `timescaledb` is loaded) so the index-tuning and slow-query tools have data.
- Register the resulting MCP endpoint (`http://localhost:8000` via SSH tunnel, matching the existing localhost-only pattern) in `.mcp.json` alongside the Supabase MCP entry.
- **Cost:** ~2-3h — one Compose service block, one `shared_preload_libraries` change (requires a Postgres restart), one `.mcp.json` entry.
- **Risk:** crystaldba/postgres-mcp has 25 open issues and infrequent commits (last: January 2026) — treat as "useful but not battle-tested," pin the image tag (never `:latest`, consistent with the repo's existing image-pinning discipline).

### Option B — Adopt Aspire (TypeScript AppHost) purely to get `.WithPostgresMcp()` natively

- Requires standing up an Aspire TypeScript AppHost on GN100 to orchestrate the existing containers, then calling `.WithPostgresMcp()` on the Postgres resource.
- TypeScript AppHost is a 13.2 **preview** feature — no GA timeline.
- This reintroduces the exact adoption question the 2026-04-10 field note already answered ("we are not on Aspire; adopting it is a strategy decision, not a side-effect of wanting one feature"). Using Aspire _only_ to get one MCP sidecar is disproportionate.
- **Cost:** ~15-20h, plus ongoing AppHost maintenance. Not recommended for this goal alone.

### Option C — Build a DWS-native MCP wrapper for the edge PG

- Follow the `mcp-servers/supabase-official/` pattern: a thin Dockerfile wrapping an existing npm/pip MCP server, or a custom one.
- Full control over tool surface (could add TimescaleDB-specific tools, e.g. hypertable/compression inspection) but duplicates what crystaldba/postgres-mcp already ships for generic Postgres operations.
- **Cost:** comparable to Option A for the generic-tools case, more for TimescaleDB-specific tooling; worth doing later as an _addition_ to Option A, not instead of it.

**Recommendation: Option A**, matching the same reasoning the companion field note applied to Aspire dashboard adoption — take the concrete, low-cost win (MCP sidecar container) without dragging in Aspire as a dependency for a single feature.

---

## 5. If Option A Is Approved — Sketch of the Change

```yaml
# Admin/Acer-Veriton-GN100/postgres/docker-compose.yml (sketch — not applied in this note)
postgres-mcp:
  image: crystaldba/postgres-mcp:<pinned-tag> # never :latest
  container_name: dws-edge-postgres-mcp
  environment:
    DATABASE_URL: postgresql://dws_edge:${EDGE_PG_PASSWORD}@postgres:5432/dws_edge
  ports:
    - "127.0.0.1:8000:8000" # localhost only, same pattern as postgres/pgadmin
  depends_on:
    postgres:
      condition: service_healthy
  restart: unless-stopped
  networks:
    - dws-edge-network
```

Plus, in the `postgres` service's `command:` block, add `pg_stat_statements` to `shared_preload_libraries` (currently `timescaledb` only) and add `CREATE EXTENSION IF NOT EXISTS pg_stat_statements;` to `init.sql`. Both changes require a Postgres container restart to take effect (preload-library changes are not hot-reloadable).

**Not applied in this note** — this is a field note (research + comparison), not an implementation PR. No files were modified.

---

## 6. Honesty Register — Open Questions

- **Primary source fetches (devblogs.microsoft.com, aspire.dev) returned HTTP 403** in this session (same failure mode as the companion 2026-04-10 note) — all `WithPostgresMcp()` claims here are corroborated via web search snippets, NuGet package pages, and the crystaldba/postgres-mcp GitHub repo, not read directly from the primary Aspire devblog post.
- **crystaldba/postgres-mcp ARM64 support is documentation-level, not hardware-verified** — the Dockerfile's multi-arch build args and OCI labels strongly imply it, but the image was not pulled and run on the GN100 in this session.
- **Whether HypoPG (used for index-tuning simulation) works cleanly against TimescaleDB hypertables** is unverified — HypoPG's hypothetical-index mechanism was designed for plain PostgreSQL tables; hypertable partitioning could behave differently. Needs a hands-on test before relying on the tuning tool for TimescaleDB-backed tables specifically.
- **SSE transport vs. stdio** — the sidecar exposes port 8000 via SSE; whether that integrates cleanly with the DWS `.mcp.json` client pattern (which currently uses stdio-based Docker entrypoints for Supabase) needs a config check before wiring it in.

---

## 7. Follow-Up Actions (tractable)

- [ ] CEO-level decision: approve Option A (add `crystaldba/postgres-mcp` sidecar to edge Compose stack)?
- [ ] If approved: pin a specific `crystaldba/postgres-mcp` image tag (never `:latest`), add the Compose service, add `pg_stat_statements` to `shared_preload_libraries`, add the extension to `init.sql`, add an `.mcp.json` entry
- [ ] Verify SSE transport compatibility with the existing `.mcp.json` client-launch pattern before wiring in
- [ ] Hands-on test: does HypoPG's index-tuning tool behave correctly against TimescaleDB hypertables, or only plain tables?
- [ ] Once live: point one agent (e.g. the query/reports skill) at the new MCP tools as a pilot before wider rollout
- [ ] Re-fetch devblogs.microsoft.com/aspire/aspire-13-2-announcement/ directly once the 403 clears, to move Section 1 from "corroborated" to "primary-sourced"

---

## CHANGES MADE

- Created `docs/field-notes/2026-07-19-aspire-13-2-withpostgresmcp-vs-dws-edge-pg.md` — captured Aspire 13.2's `WithPostgresMcp()` feature, compared it against the existing DWS edge PostgreSQL stack on the Acer Veriton GN100 ("DGX Spark"), identified the MCP-access gap (cloud Supabase has MCP, local edge PG does not), and proposed three adoption options with a recommendation.

## THINGS I DIDN'T TOUCH

- `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml` — no changes; Section 5's sketch is illustrative only, pending CEO approval
- `Admin/Acer-Veriton-GN100/postgres/init.sql` — no changes; `pg_stat_statements` addition is proposed, not applied
- `.mcp.json` — no changes; new MCP server entry is proposed, not applied
- `infrastructure/dgx-spark/docker-compose.yml` (the actual DGX Spark agent-runtime stack, separate from the GN100 edge-PG Compose file) — out of scope for this note

## POTENTIAL CONCERNS

- Both primary Aspire sources (devblogs.microsoft.com, aspire.dev) returned 403 in this session — all 13.2 feature claims are corroborated secondary-source, not primary-fetched, matching the same limitation the companion 2026-04-10 note hit with the same domains.
- "DGX Spark" in DWS usage refers to the Acer Veriton GN100 edge device, not an NVIDIA DGX Spark unit — flagged explicitly in the Executive Summary so this note doesn't propagate a naming ambiguity into future documents.
- HypoPG-on-TimescaleDB compatibility is an assumption, not a verified fact — flagged in the Honesty Register as a required test before relying on the index-tuning tool.
