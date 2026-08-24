/**
 * Default OTel metric instruments for the backend.
 *
 * Registered by initOtel() (via initDefaultMetrics()) when OTel is enabled.
 * Emits: process uptime gauge, HTTP request counter + duration histogram.
 * Viewed on the Aspire dashboard Metrics tab (resource dws-iq-backend).
 *
 * Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
 * Audit trail: git log -- src/observability/metrics.ts
 */

import { metrics } from '@opentelemetry/api';

const METER_NAME = 'dws-iq-backend';

let httpRequests: ReturnType<import('@opentelemetry/api').Meter['createCounter']> | null = null;
let httpRequestDuration: ReturnType<import('@opentelemetry/api').Meter['createHistogram']> | null = null;

/** Create the default instruments. No-op if called twice. */
export function initDefaultMetrics(): void {
  if (httpRequests) return;
  const meter = metrics.getMeter(METER_NAME);

  const uptime = meter.createObservableGauge('process.uptime.seconds', {
    description: 'Process uptime in seconds',
    unit: 's',
  });
  const startedAt = Date.now();
  uptime.addCallback((observableResult) => {
    observableResult.observe((Date.now() - startedAt) / 1000);
  });

  httpRequests = meter.createCounter('http.server.requests', {
    description: 'HTTP requests handled',
    unit: '{request}',
  });
  httpRequestDuration = meter.createHistogram('http.server.request.duration', {
    description: 'HTTP request duration',
    unit: 'ms',
  });
}

/** Record one handled HTTP request. Safe no-op before initDefaultMetrics(). */
export function recordHttpRequest(route: string, method: string, statusCode: number, durationMs: number): void {
  if (!httpRequests || !httpRequestDuration) return;
  const attrs = { 'http.route': route, 'http.method': method, 'http.status_code': String(statusCode) };
  httpRequests.add(1, attrs);
  httpRequestDuration.record(durationMs, attrs);
}
