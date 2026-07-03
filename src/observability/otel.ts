/**
 * OpenTelemetry SDK initialization — DWS IQ 6/7
 *
 * Opt-in by env. If `OTEL_EXPORTER_OTLP_ENDPOINT` is not set, no provider
 * is registered and the tracing helpers degrade to no-ops (the OTel API's
 * NoopTracer takes over). No code paths fail.
 *
 * Configuration (standard OTel env vars):
 *   OTEL_EXPORTER_OTLP_ENDPOINT   Base URL of the OTLP collector (HTTP)
 *                                  e.g. https://otel.your-eu-collector.example
 *                                  Final spans endpoint = <base>/v1/traces
 *   OTEL_EXPORTER_OTLP_HEADERS    Comma-separated k=v pairs for auth, e.g.
 *                                  "authorization=Bearer xyz,x-tenant=lifetime"
 *   OTEL_SERVICE_NAME             Defaults to `dws-iq-backend`
 *   OTEL_SERVICE_VERSION          Defaults to `1.0.0`
 *   DEPLOYMENT_ENV / NODE_ENV     Recorded as `deployment.environment`
 *
 * Sovereignty note: this module ships no vendor defaults. The user points
 * the collector wherever they want — Grafana Cloud EU, self-hosted Tempo,
 * Honeycomb EU, Langfuse EU, etc. Nothing leaves the host until the env
 * var is set.
 */

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchSpanProcessor, NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_NAMESPACE,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import logger from '../utils/logger.js';

const SERVICE_NAMESPACE = 'lifetime-oy';
const DEFAULT_SERVICE_NAME = 'dws-iq-backend';
const DEFAULT_SERVICE_VERSION = '1.0.0';

let provider: NodeTracerProvider | null = null;

function parseHeaders(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const pair of raw.split(',')) {
    const eq = pair.indexOf('=');
    if (eq <= 0) continue;
    const k = pair.slice(0, eq).trim();
    const v = pair.slice(eq + 1).trim();
    if (k) out[k] = v;
  }
  return out;
}

/**
 * Initialize OTel tracing if `OTEL_EXPORTER_OTLP_ENDPOINT` is set.
 * Safe to call multiple times — subsequent calls are no-ops.
 *
 * Returns true if a provider was registered, false if disabled.
 */
export function initOtel(): boolean {
  if (provider) return true;

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint) {
    logger.debug('OTel disabled — OTEL_EXPORTER_OTLP_ENDPOINT not set');
    return false;
  }

  if (process.env.OTEL_LOG_LEVEL === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  const serviceName = process.env.OTEL_SERVICE_NAME || DEFAULT_SERVICE_NAME;
  const serviceVersion = process.env.OTEL_SERVICE_VERSION || DEFAULT_SERVICE_VERSION;
  const deploymentEnv = process.env.DEPLOYMENT_ENV || process.env.NODE_ENV || 'development';

  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
    [ATTR_SERVICE_NAMESPACE]: SERVICE_NAMESPACE,
    'deployment.environment': deploymentEnv,
  });

  const tracesUrl = endpoint.endsWith('/v1/traces')
    ? endpoint
    : `${endpoint.replace(/\/$/, '')}/v1/traces`;

  const exporter = new OTLPTraceExporter({
    url: tracesUrl,
    headers: parseHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS),
  });

  provider = new NodeTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  const contextManager = new AsyncHooksContextManager();
  contextManager.enable();
  provider.register({ contextManager });

  logger.info('OTel tracing initialized', {
    endpoint: tracesUrl,
    serviceName,
    deploymentEnv,
  });

  return true;
}

/**
 * Flush and shut down the OTel provider. Idempotent.
 * Call from SIGTERM / SIGINT handlers to ensure spans are exported.
 */
export async function shutdownOtel(): Promise<void> {
  if (!provider) return;
  try {
    await provider.shutdown();
    logger.info('OTel tracing shut down');
  } catch (err) {
    logger.warn('OTel shutdown failed', { error: String(err) });
  } finally {
    provider = null;
  }
}

/** True if a tracer provider is currently registered. */
export function isOtelEnabled(): boolean {
  return provider !== null;
}
