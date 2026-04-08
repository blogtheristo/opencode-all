---
VERSION AND AGENT HISTORY
Version: 2.0
Last Updated: 2026-03-19
Author: Claude Code (Opus 4.6)
Agent: claude/sensor-management-ceo-review-gDObb
Status: DRAFT — CEO review round 2
Change Log:
  - v1.0: Initial 4-phase plan (150h, EUR 14,250) — RESHAPED by CEO review
  - v2.0: Focused single-phase "Sensor-Powered SiteSense" (25h, EUR 2,375)
    Cuts: Aspire AppHost, MQTT, Supabase cloud sync, GPS, energy meters, cameras
    Moves magic moment (SiteSense auto-populate) into Phase 1
---

# Sensor-Powered SiteSense — Edge Sensor Management for DWS IQ 6

## Problem

DWS agents make safety and compliance decisions on **manually-entered sensor data**. SiteSense (`src/agents/sitesense.agent.ts:47-56`) requires human operators to type temperature, humidity, and wind speed — unreliable, slow, and un-auditable. This blocks agent autonomy and makes audit trails legally weak ("the operator said it was 22°C").

## Solution

A lightweight TypeScript sensor collector on the GN100 edge node that:
1. Accepts sensor data via HTTP POST
2. Stores it in TimescaleDB hypertables
3. Exposes 3 query tools so any agent can access live sensor data
4. Auto-populates SiteSense with real readings (fallback to manual input)

No new language runtimes. No new orchestration layers. Just a TypeScript service, a database schema, and agent tools.

## Architecture

```
  Sensors / Scripts / Firehorse App
           |
     HTTP POST /api/sensors/readings
           |
  ┌────────────────────┐
  │  sensor-collector   │  (new TypeScript service)
  │  Express + OTEL     │
  └────────┬───────────┘
           |
  ┌────────────────────┐
  │  TimescaleDB        │  (existing edge PG on GN100)
  │  sensor_readings    │  (hypertable + compression)
  │  sensor_hourly      │  (continuous aggregate)
  └────────┬───────────┘
           |
  ┌────────────────────┐
  │  Agent Query Tools  │  (in src/agents/tools.ts)
  │  - query_sensor_*   │
  │  - list_sensor_*    │
  └────────┬───────────┘
           |
  ┌────────────────────┐
  │  SiteSense Agent    │  auto-populates from sensors
  │  (existing)         │  fallback: manual input
  └────────────────────┘
```

**What's NOT in this plan:** .NET Aspire AppHost, MQTT, Supabase cloud sync, GPS, energy meters, cameras, Langfuse integration. These earn their place after this phase proves value.

## Implementation — Single Phase (2 weeks, ~25h)

### Week 1: Schema + Collector + Tools

#### 1.1 TimescaleDB Sensor Schema

Extend existing edge PostgreSQL on GN100 (`Admin/Acer-Veriton-GN100/postgres/init.sql` already has TimescaleDB enabled).

```sql
-- Sensor readings hypertable
CREATE TABLE IF NOT EXISTS sensor_readings (
    time        TIMESTAMPTZ NOT NULL,
    device_id   TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value       DOUBLE PRECISION NOT NULL,
    unit        TEXT NOT NULL,
    metadata    JSONB DEFAULT '{}',
    quality     SMALLINT DEFAULT 100  -- 0-100 data quality score
);

SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);

-- Compression: 7-day policy
ALTER TABLE sensor_readings SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'device_id,sensor_type'
);
SELECT add_compression_policy('sensor_readings', INTERVAL '7 days',
    if_not_exists => TRUE);

-- Hourly continuous aggregate
CREATE MATERIALIZED VIEW IF NOT EXISTS sensor_hourly
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

-- Indexes for agent query patterns
CREATE INDEX IF NOT EXISTS idx_sensor_latest
    ON sensor_readings (device_id, sensor_type, time DESC);
```

#### 1.2 Sensor Collector Service (TypeScript)

New service at `src/sensor-collector/`:

| File | Purpose |
|------|---------|
| `src/sensor-collector/package.json` | Dependencies: express, pg, @opentelemetry/sdk-node |
| `src/sensor-collector/src/index.ts` | Express app entry point |
| `src/sensor-collector/src/routes/readings.ts` | `POST /api/sensors/readings` — validate + batch insert |
| `src/sensor-collector/src/storage/timescale-writer.ts` | pg pool, batch insert, connection retry |
| `src/sensor-collector/src/storage/offline-buffer.ts` | SQLite fallback when TimescaleDB unavailable |
| `src/sensor-collector/tsconfig.json` | TypeScript config |

**Endpoint spec:**
```
POST /api/sensors/readings
Content-Type: application/json

{
  "readings": [
    {
      "device_id": "gn100-helsinki-01",
      "sensor_type": "temperature",
      "value": 18.5,
      "unit": "celsius",
      "time": "2026-03-19T10:30:00Z",
      "metadata": { "location": "site-A", "floor": 3 }
    }
  ]
}

Response: 201 { "inserted": 1 }
```

**Validation:** Zod schema. Reject readings older than 24h or with invalid sensor_type. Valid types: `temperature`, `humidity`, `wind_speed`, `pressure`, `noise`, `dust`, `vibration`, `light`.

**Offline buffer:** When TimescaleDB connection fails, write to local SQLite (`/tmp/sensor-buffer.db`). Background job retries every 60s.

#### 1.3 Agent Sensor Query Tools

Add to `src/agents/tools.ts`:

| Tool | Input | Output |
|------|-------|--------|
| `query_sensor_latest` | `{ device_id, sensor_type }` | Latest reading with timestamp |
| `query_sensor_aggregate` | `{ device_id, sensor_type, hours }` | avg/min/max for time range |
| `list_sensor_devices` | `{}` | Array of `{ device_id, sensor_types[], last_seen }` |

#### 1.4 CLI Commands

Add to `cli/src/cli.ts`:

```bash
dws sensors push --device gn100-helsinki-01 --type temperature --value 18.5 --unit celsius
dws sensors query --device gn100-helsinki-01 --type temperature --latest
dws sensors devices
```

### Week 2: SiteSense Integration + Hero Demo

#### 2.1 SiteSense Auto-Populate

Modify `src/agents/sitesense.agent.ts`:
- Before running safety analysis, call `query_sensor_latest` for the site's device
- If sensors available: use real data, add `"source": "sensor"` to output
- If sensors unavailable: fall back to manual input (current behavior), add `"source": "manual"`
- Log sensor provenance in agent execution trace (KYA audit trail)

#### 2.2 Hero Demo

The moment that proves this works:

```bash
# 1. Push sensor data (simulating a real sensor)
dws sensors push --device site-helsinki-01 --type temperature --value 18.5 --unit celsius
dws sensors push --device site-helsinki-01 --type humidity --value 65 --unit percent
dws sensors push --device site-helsinki-01 --type wind_speed --value 11.2 --unit m/s

# 2. Run SiteSense — it auto-populates from sensors
dws run sitesense --input '{"siteId": "site-helsinki-01", "metrics": {"workers": 12, "incidents": 0}}'

# Output includes real sensor data + safety score + audit provenance
```

The operator only provides worker count and incident count. Temperature, humidity, and wind speed come from live sensors automatically.

## Files to Create/Modify

| File | Action | Lines (est.) |
|------|--------|-------------|
| `Admin/Acer-Veriton-GN100/postgres/init-sensors.sql` | **Create** — sensor schema | ~40 |
| `src/sensor-collector/package.json` | **Create** | ~25 |
| `src/sensor-collector/tsconfig.json` | **Create** | ~15 |
| `src/sensor-collector/src/index.ts` | **Create** — entry point | ~50 |
| `src/sensor-collector/src/routes/readings.ts` | **Create** — HTTP handler | ~80 |
| `src/sensor-collector/src/storage/timescale-writer.ts` | **Create** — PG writer | ~60 |
| `src/sensor-collector/src/storage/offline-buffer.ts` | **Create** — SQLite fallback | ~50 |
| `src/agents/tools.ts` | **Modify** — add 3 sensor query tools | ~80 |
| `src/agents/sitesense.agent.ts` | **Modify** — auto-populate from sensors | ~30 |
| `cli/src/cli.ts` | **Modify** — add `dws sensors` commands | ~40 |
| `src/__tests__/sensor-tools.test.ts` | **Create** — tool unit tests | ~60 |
| **Total** | | **~530 lines** |

## EU Compliance

| Data Location | Content | Compliance |
|---------------|---------|------------|
| Edge GN100, Helsinki | Raw sensor readings | GDPR — data never leaves Finland |
| Local SQLite buffer | Temporary offline cache | Auto-deleted after sync |

KYA Standard v1.4: sensor readings attached to agent execution logs for court-defensible audit trail. Every SiteSense decision links to the exact `sensor_readings` rows that informed it.

## Cost Estimate

| Item | Hours | Cost (EUR 95/h) |
|------|-------|-----------------|
| Schema + collector service | 10h | EUR 950 |
| Agent tools + CLI | 8h | EUR 760 |
| SiteSense integration | 4h | EUR 380 |
| Tests + hero demo | 3h | EUR 285 |
| **Total** | **25h** | **EUR 2,375** |

Infrastructure cost: EUR 0 additional (TimescaleDB open source, edge hardware deployed).

## Deep Tech Moat Impact

1. **Edge-first sensor data** — safety decisions on Finnish hardware, no cloud dependency
2. **Agent autonomy** — SiteSense runs sensor-to-decision loop without human data entry
3. **Audit provenance** — every decision links to hardware-sourced readings, not human claims
4. **Simplicity** — ~530 lines of TypeScript, no new language runtimes

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| No real sensors yet (chicken-and-egg) | High | CLI `dws sensors push` enables scripted/simulated data. Real sensors plug in via same HTTP POST. |
| Edge PG capacity on GN100 | Low | 120 GiB RAM, TimescaleDB compression 10-20x. |
| Offline buffer data loss | Low | SQLite WAL mode, 60s retry, logged warnings. |

## Verification Plan

1. `curl -X POST http://localhost:5100/api/sensors/readings` with test payload → 201 response, data in TimescaleDB
2. `dws sensors query --device site-helsinki-01 --type temperature --latest` → returns reading
3. `dws run sitesense --input '{"siteId":"site-helsinki-01","metrics":{"workers":12,"incidents":0}}'` → auto-populates sensor data, returns safety score with `"source": "sensor"`
4. `npm run test` — sensor tool unit tests pass
5. Kill TimescaleDB → push reading → offline buffer catches it → restart PG → data syncs

## Future Phases (NOT committed — earn the right)

These are documented for context only. Each requires its own CEO review before starting:

- **MQTT protocol** — when a real sensor demands it (not before)
- **Supabase cloud sync** — when edge-only is insufficient
- **GPS fleet tracking** — when logistics agent needs real distance data
- **Aspire AppHost** — when 10+ services need unified orchestration
- **Energy meters / cameras** — separate products, separate validation

## Sources

- TimescaleDB hypertables: docs.timescale.com/use-timescale/latest/hypertables/
- OpenTelemetry Node.js: opentelemetry.io/docs/languages/js/
- EN 13001 crane safety standards (wind thresholds in sitesense.agent.ts)
