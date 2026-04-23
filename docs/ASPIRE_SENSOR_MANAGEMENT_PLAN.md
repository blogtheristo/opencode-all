# Sensor Management with .NET Aspire for DWS IQ 6

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/sensor-management-research-TgY2t | Date: 21.03.2026 | Changes: Updated with davidfowl/aspire-docker-ssh-template findings — single-file AppHost, SSH deploy to GN100, YARP reverse proxy, Aspire MCP endpoint
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/sensor-management-research-TgY2t | Date: 19.03.2026 | Changes: Initial plan

Document Status:
  - Created: 19.03.2026
  - Last Modified: 21.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: DRAFT — Pending CEO review

***

## Context

DWS IQ 6 has a mature edge infrastructure (Acer Veriton GN100 with TimescaleDB + pgvector, 27 fleet edge nodes, NVIDIA Jetson Orin Nano devices) but **no dedicated sensor management layer**. Sensor data is currently entered manually into agents like SiteSense (temperature, humidity, wind speed). .NET Aspire — a polyglot orchestration toolchain with first-class OpenTelemetry support — fills this gap as a **sidecar orchestration and observability layer**, not a replacement for the existing Node.js/Express stack.

**AspireConf (March 23, 2026)** confirms the fit: the "IoT + Aspire Testing" session demonstrates end-to-end sensor pipelines (Arduino → cloud → dashboard), and "Aspire + Coding Agents" shows how Aspire topology feeds AI agents with real-time context.

## Architecture Decision: Aspire as Sidecar Orchestrator

```
                    .NET Aspire AppHost (single-file apphost.cs)
                    (dev/staging + SSH deploy to GN100)
                           |
          +----------------+--+-----------------+
          |                |  |                 |
   sensor-collector   YARP   express-backend   edge-postgres
   (Vite/TS service)  proxy  (existing, ref)   (TimescaleDB on GN100)
          |                |  |                 |
          +-------> OTLP Collector <------------+
                         |
                   +-----+-----+
                   |           |
              Aspire        Langfuse
              Dashboard     (EU Cloud)
              (dev + MCP)   (production LLM traces)
```

**Key decision:** Aspire does NOT replace Express, React, Supabase, or the MCP Hub. It orchestrates the new sensor-collector service alongside existing infrastructure and provides unified OpenTelemetry visualization.

### Updated: Single-File AppHost Pattern (from davidfowl/aspire-docker-ssh-template)

David Fowler's Aspire Docker SSH template (March 2026) introduces critical simplifications:

1. **Single-file `apphost.cs`** — uses `#:sdk` and `#:package` directives instead of `.csproj`. Eliminates the multi-project structure entirely.
2. **SSH Deploy support** — `builder.AddDockerComposeEnvironment("dcenv").WithSshDeploySupport()` enables deploying directly to GN100 over SSH via `aspire deploy`.
3. **YARP reverse proxy** — serves static files and routes API requests. Can front the sensor HTTP endpoint with HTTPS (Let's Encrypt via Certbot container).
4. **Aspire MCP endpoint** — `ASPIRE_DASHBOARD_MCP_ENDPOINT_URL` exposes the Aspire Dashboard as an MCP server, enabling direct integration with our MCP Hub.
5. **`AddViteApp()`** — first-class Vite/Node.js resource support, exactly what sensor-collector needs.
6. **GitHub Actions generation** — `aspire do gh-action-dcenv` auto-generates CI/CD workflow for SSH deploy.

**Impact:** Phase 1 is significantly simpler. No `.csproj`, no `ServiceDefaults` project, no manual Docker Compose authoring. SSH deploy replaces the manual "export to Docker Compose" step in Phase 4.

## Phase 1: MVP — Edge Sensor Collection (Weeks 1-3, ~40h)

### 1.1 TimescaleDB Sensor Schema

Add to existing edge PostgreSQL on GN100 (`Admin/Acer-Veriton-GN100/postgres/init.sql` already has TimescaleDB enabled):

- Create `sensor_readings` hypertable (time, device_id, sensor_type, value, unit, metadata, synced)
- Create `sensor_hourly` continuous aggregate (hourly avg/min/max per device/sensor)
- Add 7-day compression policy (TimescaleDB compress)
- Create matching Supabase migration for cloud replica

```sql
CREATE TABLE sensor_readings (
    time        TIMESTAMPTZ NOT NULL,
    device_id   TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value       DOUBLE PRECISION NOT NULL,
    unit        TEXT NOT NULL,
    metadata    JSONB DEFAULT '{}',
    synced      BOOLEAN DEFAULT FALSE
);

SELECT create_hypertable('sensor_readings', 'time');

ALTER TABLE sensor_readings SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'device_id,sensor_type'
);
SELECT add_compression_policy('sensor_readings', INTERVAL '7 days');

CREATE MATERIALIZED VIEW sensor_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    device_id,
    sensor_type,
    AVG(value) AS avg_value,
    MIN(value) AS min_value,
    MAX(value) AS max_value,
    COUNT(*) AS reading_count
FROM sensor_readings
GROUP BY bucket, device_id, sensor_type;
```

### 1.2 Sensor Collector Service (TypeScript)

New service at `src/sensor-collector/`:
- **HTTP POST endpoint** `POST /api/sensors/readings` for sensor data ingestion
- **MQTT subscriber** for real-time sensor streams
- **TimescaleDB writer** with batch insert (edge PG on GN100)
- **OpenTelemetry instrumentation** (`@opentelemetry/sdk-node` — auto-instrument HTTP + PG)
- **Offline buffer** — write to local SQLite when TimescaleDB unavailable

### 1.3 Aspire AppHost (Single-File Pattern)

New single file at `src/aspire/apphost.cs` — no `.csproj` needed:
- Uses `#:sdk` and `#:package` directives (Aspire 13.0.1+)
- Reference sensor-collector via `AddViteApp()` (polyglot Node.js support)
- Reference edge PostgreSQL as existing resource
- Docker Compose environment with SSH deploy to GN100
- YARP reverse proxy for sensor HTTP endpoint
- `aspire run` launches sensor-collector + dashboard together
- `aspire deploy` pushes directly to GN100 over SSH

```csharp
#:sdk Aspire.AppHost.Sdk@13.0.1
#:package Aspire.Hosting.Docker@13.0.1-preview.1.25575.3
#:package Aspire.Hosting.Docker.SshDeploy@0.1.0-ci.131
#:package Aspire.Hosting.JavaScript@13.0.1
#:package Aspire.Hosting.Yarp@13.0.1
#:package Aspire.Hosting.PostgreSQL@13.0.1

using Aspire.Hosting.Yarp;

var builder = DistributedApplication.CreateBuilder(args);

// Docker Compose + SSH deploy to GN100
builder.AddDockerComposeEnvironment("dcenv")
       .WithSshDeploySupport();

// Edge PostgreSQL with TimescaleDB (on GN100)
var edgeDb = builder.AddPostgres("edge-postgres")
    .WithEndpoint(port: 5432);

// Sensor collector service (TypeScript/Vite)
var sensorCollector = builder.AddViteApp("sensor-collector", "../sensor-collector")
    .WithReference(edgeDb)
    .WithEnvironment("MQTT_BROKER", "mqtt://localhost:1883")
    .WithEnvironment("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4318");

// Existing Express backend (reference only)
var expressBackend = builder.AddConnectionString("express-backend", "http://localhost:3000");

// YARP reverse proxy for sensor API + HTTPS
if (builder.ExecutionContext.IsPublishMode)
{
    builder.AddYarp("sensor-api")
           .PublishWithStaticFiles(sensorCollector)
           .WithHostPort(80)
           .WithExternalHttpEndpoints();
}

builder.Build().Run();
```

Supporting files:
- `src/aspire/.aspire/settings.json` — `{"appHostPath": "../apphost.cs"}`
- `src/aspire/apphost.settings.json` — `{"EnableHttps": false}` (enable for Let's Encrypt on GN100)
- `src/aspire/nuget.config` — adds `davidfowl-aspire` feed for preview packages

### 1.4 Agent Sensor Query Tools

Add to `src/agents/tools.ts`:
- `query_sensor_latest` — latest reading from device/sensor type
- `query_sensor_aggregate` — aggregated readings for time range
- `list_sensor_devices` — enumerate known devices

### 1.5 Files to Create/Modify

| File | Action |
|------|--------|
| `src/sensor-collector/src/index.ts` | **Create** — sensor collector entry point |
| `src/sensor-collector/src/collectors/mqtt-collector.ts` | **Create** — MQTT protocol handler |
| `src/sensor-collector/src/collectors/http-collector.ts` | **Create** — HTTP POST handler |
| `src/sensor-collector/src/storage/timescale-writer.ts` | **Create** — edge PG writer |
| `src/sensor-collector/src/storage/supabase-sync.ts` | **Create** — cloud sync service |
| `src/sensor-collector/package.json` | **Create** |
| `src/aspire/apphost.cs` | **Create** — single-file Aspire AppHost (replaces `.csproj` + `Program.cs`) |
| `src/aspire/.aspire/settings.json` | **Create** — Aspire CLI settings |
| `src/aspire/apphost.settings.json` | **Create** — HTTPS/deploy config |
| `src/aspire/apphost.run.json` | **Create** — dev launch profiles |
| `src/aspire/nuget.config` | **Create** — NuGet feed for preview packages |
| ~~`src/aspire/DwsAspire.AppHost/DwsAspire.AppHost.csproj`~~ | **Removed** — single-file pattern eliminates this |
| ~~`src/aspire/DwsAspire.ServiceDefaults/Extensions.cs`~~ | **Removed** — OTEL auto-configured by Aspire SDK |
| `Admin/Acer-Veriton-GN100/postgres/init-sensors.sql` | **Create** — sensor schema |
| `supabase/migrations/XXXXXX_sensor_readings.sql` | **Create** — cloud replica |
| `src/agents/tools.ts` | **Modify** — add sensor query tools |

## Phase 2: Fleet GPS + Agent Integration (Weeks 4-6, ~40h)

- Extend sensor-collector with GPS protocol (27 fleet nodes via Firehorse mobile app)
- Build Supabase sync service — batch upload aggregates from edge to cloud
- **SiteSense auto-populate**: use `runLoop()` to query sensors before analyzing site safety (currently requires manual `temperature`, `humidity`, `windSpeed` input at `src/agents/sitesense.agent.ts:47-56`)
- **Logistics enhancement**: replace hardcoded distance estimates with real GPS data
- Aspire IoT integration tests (sensor simulation → end-to-end pipeline)

| File | Change |
|------|--------|
| `src/agents/sitesense.agent.ts` | Auto-query sensors via tool calls, fallback to manual input |
| `src/agents/logistics.agent.ts` | GPS data integration for route/distance |
| `src/sensor-collector/src/collectors/gps-collector.ts` | **Create** — GPS protocol |

## Phase 3: Energy + Construction Sensors (Weeks 7-10, ~40h)

- Energy meter protocol (Modbus TCP reader)
- Emissions agent integration — real kWh for Scope 1/2 calculations
- Camera feed integration — RTSP to Jetson for PPE detection
- Langfuse + Aspire unified telemetry (single OTEL Collector, dual export)
- Control Room dashboard — sensor status via `/remote-control control-room status`

## Phase 4: Production Hardening (Weeks 11-14, ~30h)

- ARM64 sensor-collector build for Jetson Orin Nano deployment
- Offline-first resilience (SQLite buffer, automatic sync)
- KYA audit integration — sensor readings attached to agent execution logs
- **SSH deploy to GN100** — `aspire deploy` over SSH (replaces manual Docker Compose export, enabled by `WithSshDeploySupport()`)
- **GitHub Actions CI/CD** — `aspire do gh-action-dcenv` generates workflow for automated SSH deploy on push
- **HTTPS with Let's Encrypt** — enable `EnableHttps: true` in `apphost.settings.json`, Certbot container auto-provisions certs
- **Aspire MCP → MCP Hub bridge** — connect `ASPIRE_DASHBOARD_MCP_ENDPOINT_URL` to existing MCP Hub for agent discovery of sensor topology
- 5G RAN sensor integration (if pilot demand)

## Telemetry Unification Strategy

| Concern | Tool | Stage |
|---------|------|-------|
| Sensor health (readings/sec, lag) | Aspire Dashboard | Dev/staging |
| Agent LLM traces (tokens, cost) | Langfuse (existing plan) | Production |
| Infrastructure metrics (CPU, GPU) | Aspire Dashboard + Prometheus | Both |
| End-to-end request tracing | Both (W3C traceparent) | Both |

Aligns with existing observability roadmap (`observability/observability.md`) — Aspire Dashboard replaces need for local Grafana during development.

## EU Compliance

| Data Location | Content | Compliance |
|---------------|---------|------------|
| Edge GN100, Helsinki | Raw sensor readings | GDPR — data never leaves Finland |
| Supabase europe-north1 | Aggregated data | EU data residency |
| Aspire Dashboard | Dev telemetry | Local-only, never persisted |
| Langfuse Frankfurt | LLM traces | GDPR Art. 28, Schrems II |

KYA Standard v1.4: sensor readings attached to all agent execution logs for court-defensible audit trail.

## Cost Estimate

| Phase | Hours | Cost (EUR 95/h) |
|-------|-------|-----------------|
| Phase 1: MVP | 40h | EUR 3,800 |
| Phase 2: Fleet GPS | 40h | EUR 3,800 |
| Phase 3: Energy + Cameras | 40h | EUR 3,800 |
| Phase 4: Hardening | 30h | EUR 2,850 |
| **Total** | **150h** | **EUR 14,250** |

Infrastructure cost: EUR 0 additional (Aspire is free, edge hardware deployed, TimescaleDB open source).

## Deep Tech Moat Impact (Pillar 2)

Per `docs/DEEP_TECH_THESIS.md` — adding Aspire-orchestrated sensor management deepens the edge deployment moat:
1. **Full-stack edge capability** — not just inference, but data collection + reasoning on-device
2. **Offline-first safety decisions** — SiteSense runs on Jetson with local sensors, no internet required
3. **Testability** — AspireConf IoT testing pattern enables validating full edge stack before field deployment
4. **Hardware-level data residency** — sensor data stays on Finnish hardware, compliance advantage over cloud-only competitors

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| .NET SDK required on dev machines | Medium | Aspire CLI installs standalone; single-file `apphost.cs` has no project overhead. CI/CD runs in container. |
| Team unfamiliarity with C# | Low | Single-file `apphost.cs` is ~30 lines of config, not application code. Sensor-collector is TypeScript. |
| Aspire maturity for Node.js resources | Low | Aspire 13.0.1 `AddViteApp()` is production-ready (davidfowl template demonstrates this). |
| Preview packages (SshDeploy) | Medium | `Aspire.Hosting.Docker.SshDeploy@0.1.0-ci` is pre-release. Fallback: manual `docker compose` over SSH. |
| Edge PostgreSQL capacity on GN100 | Low | 120 GiB RAM, 8 GB allocated to PG. TimescaleDB compression reduces storage 10-20x. |
| Sensor protocol diversity | Medium | Start with HTTP POST (universal). Add MQTT/Modbus only when specific sensors demand it. |

## Verification Plan

1. `aspire run` in `src/aspire/` → Aspire Dashboard opens, sensor-collector visible as Vite resource
2. `curl -X POST http://localhost:5100/api/sensors/readings` with test payload → data in TimescaleDB
3. Run SiteSense agent with `siteId` that has sensors → auto-populates metrics
4. `npm run test` — sensor query tool unit tests pass
5. Aspire Dashboard shows sensor metrics (readings/sec, latency)
6. `aspire deploy` with SSH target → deploys to GN100, YARP proxy serves sensor API
7. Aspire MCP endpoint responds to `tools/list` → sensor topology discoverable by MCP Hub

## Sources

- AspireConf March 23, 2026: aspire.dev/aspireconf
- .NET Aspire Telemetry docs: learn.microsoft.com/en-us/dotnet/aspire/fundamentals/telemetry
- Aspire Roadmap 2025-2026: github.com/dotnet/aspire/discussions/10644
- David Fowler's Aspire Docker SSH template: github.com/davidfowl/aspire-docker-ssh-template (single-file AppHost, SSH deploy, YARP, Aspire MCP endpoint)
