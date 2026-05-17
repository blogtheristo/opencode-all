/**
 * Broker audit log — append-only record of every credential-brokered call.
 *
 * Emits structured pino events at the `broker_audit` namespace so they can be
 * routed to a SIEM / Loki / Cloud Logging by downstream pipelines. Bodies are
 * NEVER logged — only metadata (agent, provider, path, status, byte counts,
 * latency). The upstream credential itself is never on the request that
 * arrives at this module.
 */

import logger from '../utils/logger.js';

export interface BrokerAuditEvent {
  agentId: string;
  providerId: string;
  method: string;
  upstreamPath: string;
  status: number;
  durationMs: number;
  requestBytes: number;
  responseBytes: number;
  correlationId?: string;
  error?: string;
}

export function recordBrokerCall(event: BrokerAuditEvent): void {
  logger.info(
    {
      audit: 'broker',
      ...event,
    },
    `broker ${event.agentId} → ${event.providerId} ${event.method} ${event.upstreamPath} ${event.status} ${event.durationMs}ms`,
  );
}

export function recordBrokerDenied(reason: string, ctx: {
  agentId?: string;
  providerId?: string;
  upstreamPath?: string;
  correlationId?: string;
}): void {
  logger.warn(
    {
      audit: 'broker_denied',
      reason,
      ...ctx,
    },
    `broker denied: ${reason}`,
  );
}
