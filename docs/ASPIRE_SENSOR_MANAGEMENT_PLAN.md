---
VERSION AND AGENT HISTORY
Version: 1.0
Last Updated: 2026-03-19
Author: Claude Code (Opus 4.6)
Agent: claude/sensor-management-research-TgY2t
Status: DRAFT — Pending CEO review
---

# Sensor Management with .NET Aspire for DWS IQ 6

## Context

DWS IQ 6 has a mature edge infrastructure (Acer Veriton GN100 with TimescaleDB + pgvector, 27 fleet edge nodes, NVIDIA Jetson Orin Nano devices) but **no dedicated sensor management layer**. Sensor data is currently entered manually into agents like SiteSense (temperature, humidity, wind speed). .NET Aspire — a polyglot orchestration toolchain with first-class OpenTelemetry support — fills this gap as a **sidecar orchestration and observability layer**, not a replacement for the existing Node.js/Express stack.

**AspireConf (March 23, 2026)** confirms the fit: the "IoT + Aspire Testing" session demonstrates end-to-end sensor pipelines (Arduino → cloud → dashboard), and "Aspire + Coding Agents" shows how Aspire topology feeds AI agents with real-time context.

## Architecture Decision: Aspire as Sidecar Orchestrator

```
                    .NET Aspire AppHost
                    (dev/staging orchestration only)
                           |
          +----------------+------------------+
          |                |                  |
   sensor-collector   express-backend    edge-postgres
   (new TS service)   (existing, ref)   (TimescaleDB on GN100)
          |                |                  |
          +-------> OTLP Collector <----------+
                         |
                   +-----+-----+
                   |           |
              Aspire        Langfuse
              Dashboard     (EU Cloud)
              (dev-time)    (production LLM traces)
```

**Key decision:** Aspire does NOT replace Express, React, Supabase, or the MCP Hub. It orchestrates the new sensor-collector service alongside existing infrastructure and provides unified OpenTelemetry visualization.

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

### 1.3 Aspire AppHost Project

New at `src/aspire/DwsAspire.AppHost/`:
- Reference sensor-collector as Node.js resource
- Reference edge PostgreSQL as existing resource
- Configure OTLP exporter → Aspire Dashboard
- `dotnet run` launches sensor-collector + dashboard together

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var edgeDb = builder.AddPostgres("edge-postgres")
    .WithTimescaleDb()
    .WithEndpoint(port: 5432);

var sensorCollector = builder.AddNodeApp("sensor-collector", "../sensor-collector")
    .WithReference(edgeDb)
    .WithEnvironment("MQTT_BROKER", "mqtt://localhost:1883")
    .WithEnvironment("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4318");

var expressBackend = builder.AddConnectionString("express-backend", "http://localhost:3000");

builder.Build().Run();
```

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
| `src/aspire/DwsAspire.AppHost/Program.cs` | **Create** — Aspire orchestration |
| `src/aspire/DwsAspire.AppHost/DwsAspire.AppHost.csproj` | **Create** |
| `src/aspire/DwsAspire.ServiceDefaults/Extensions.cs` | **Create** — shared OTEL config |
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
- Aspire → Docker Compose export for production deployment
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
| .NET SDK required on dev machines | Medium | Aspire AppHost is dev-only; CI/CD runs in container. Production uses plain Docker Compose. |
| Team unfamiliarity with C# | Medium | Phase 1 sensor-collector is TypeScript. C# port only if AOT performance needed (Phase 4). |
| Aspire maturity for Node.js resources | Low-Medium | Aspire 9.2 (March 2026) has improved polyglot support. Fallback: Aspire only for OTEL + dashboard. |
| Edge PostgreSQL capacity on GN100 | Low | 120 GiB RAM, 8 GB allocated to PG. TimescaleDB compression reduces storage 10-20x. |
| Sensor protocol diversity | Medium | Start with HTTP POST (universal). Add MQTT/Modbus only when specific sensors demand it. |

## Verification Plan

1. `dotnet run` in `src/aspire/DwsAspire.AppHost/` → Aspire Dashboard opens, sensor-collector visible
2. `curl -X POST http://localhost:5100/api/sensors/readings` with test payload → data in TimescaleDB
3. Run SiteSense agent with `siteId` that has sensors → auto-populates metrics
4. `npm run test` — sensor query tool unit tests pass
5. Aspire Dashboard shows sensor metrics (readings/sec, latency)

## Sources

- AspireConf March 23, 2026: aspire.dev/aspireconf
- .NET Aspire Telemetry docs: learn.microsoft.com/en-us/dotnet/aspire/fundamentals/telemetry
- Aspire Roadmap 2025-2026: github.com/dotnet/aspire/discussions/10644
