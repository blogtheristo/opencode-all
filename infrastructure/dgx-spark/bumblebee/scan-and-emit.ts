// Bumblebee → Aspire Dashboard emitter.
//
// Reads NDJSON from stdin (one record per line, produced by `bumblebee scan
// --format ndjson`), aggregates counts, and ships OTel metrics to the Aspire
// Dashboard's OTLP/HTTP endpoint (OTEL_EXPORTER_OTLP_ENDPOINT, typically
// http://aspire-dashboard:18890 — the dashboard's OTLP/HTTP listener, NOT the
// 18888 UI port; protocol aligned with dws-backend/dws-cron per
// docker-compose v1.3.1).
//
// Bumblebee's NDJSON dialect is documented upstream; we defensively accept
// only the fields we need and skip records we don't recognise so a schema
// drift surfaces in logs without crashing the cron run.

import { createInterface } from "node:readline";
import { hostname } from "node:os";
import { metrics } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

type Record = {
  kind?: string;
  ecosystem?: string;
  name?: string;
  version?: string;
  advisory_id?: string;
  severity?: string;
};

const profile = (() => {
  const i = process.argv.indexOf("--profile");
  return i >= 0 ? process.argv[i + 1] ?? "project" : "project";
})();

const host = process.env.BUMBLEBEE_HOST_LABEL ?? hostname();

const provider = new MeterProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? "bumblebee",
    "host.name": host,
  }),
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
      exportIntervalMillis: 5_000,
    }),
  ],
});
metrics.setGlobalMeterProvider(provider);
const meter = metrics.getMeter("bumblebee");

const packagesByEcosystem = new Map<string, number>();
const exposuresBySeverity = new Map<string, number>();
let packagesTotal = 0;
let exposuresTotal = 0;
let unknownLines = 0;

const startedAt = Date.now();

const baseAttrs = { profile, host } as const;

meter
  .createObservableGauge("bumblebee.packages.total", {
    description: "Packages inventoried in the most recent Bumblebee scan",
  })
  .addCallback((o) => o.observe(packagesTotal, baseAttrs));

meter
  .createObservableGauge("bumblebee.exposures.total", {
    description: "Catalog matches (compromised packages) in the most recent scan",
  })
  .addCallback((o) => o.observe(exposuresTotal, baseAttrs));

meter
  .createObservableGauge("bumblebee.exposures.by_severity", {
    description: "Exposure count broken down by advisory severity",
  })
  .addCallback((o) => {
    for (const [severity, n] of exposuresBySeverity) {
      o.observe(n, { ...baseAttrs, severity });
    }
  });

meter
  .createObservableGauge("bumblebee.packages.by_ecosystem", {
    description: "Inventory size by ecosystem (npm, pypi, go, gem, …)",
  })
  .addCallback((o) => {
    for (const [ecosystem, n] of packagesByEcosystem) {
      o.observe(n, { ...baseAttrs, ecosystem });
    }
  });

const durationHist = meter.createHistogram("bumblebee.scan.duration_ms", {
  description: "Wall time of a Bumblebee scan",
  unit: "ms",
});

const lastSuccessGauge = meter.createObservableGauge(
  "bumblebee.scan.last_success_timestamp",
  { description: "Unix seconds when the most recent scan finished cleanly" },
);
let lastSuccess = 0;
lastSuccessGauge.addCallback((o) => {
  if (lastSuccess) o.observe(lastSuccess, baseAttrs);
});

const rl = createInterface({ input: process.stdin });

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let rec: Record;
  try {
    rec = JSON.parse(trimmed) as Record;
  } catch {
    unknownLines++;
    return;
  }
  switch (rec.kind) {
    case "package": {
      packagesTotal++;
      const eco = rec.ecosystem ?? "unknown";
      packagesByEcosystem.set(eco, (packagesByEcosystem.get(eco) ?? 0) + 1);
      break;
    }
    case "exposure": {
      exposuresTotal++;
      const sev = rec.severity ?? "unknown";
      exposuresBySeverity.set(sev, (exposuresBySeverity.get(sev) ?? 0) + 1);
      // Per-finding log line — Aspire's structured log view picks these up.
      console.log(
        JSON.stringify({
          level: "warn",
          msg: "bumblebee.exposure",
          advisory_id: rec.advisory_id,
          ecosystem: rec.ecosystem,
          name: rec.name,
          version: rec.version,
          severity: sev,
          profile,
          host,
        }),
      );
      break;
    }
    default:
      unknownLines++;
  }
});

rl.on("close", async () => {
  const duration = Date.now() - startedAt;
  durationHist.record(duration, baseAttrs);
  lastSuccess = Math.floor(Date.now() / 1000);
  console.log(
    JSON.stringify({
      level: "info",
      msg: "bumblebee.scan.complete",
      profile,
      host,
      packagesTotal,
      exposuresTotal,
      unknownLines,
      durationMs: duration,
    }),
  );
  // Flush before exit so the cron tick doesn't drop the last batch.
  await provider.forceFlush().catch(() => {});
  await provider.shutdown().catch(() => {});
  process.exit(exposuresTotal > 0 ? 0 : 0); // dashboard is the alert surface
});
