/**
 * Credential broker routes — Express handler that proxies agent requests
 * to upstream providers (Anthropic, OpenRouter, Telegram, Gmail, Groq) while
 * injecting credentials from the vault.
 *
 * Mount point: /api/v1/broker
 *
 * Request shape:
 *   <METHOD>  /api/v1/broker/:providerId/<rest-of-upstream-path>
 *   Authorization: Bearer <agent-capability-token>
 *   <body>
 *
 * Flow:
 *   1. Authenticate the bearer token against the agent registry
 *      (BROKER_AGENT_TOKENS, hashed with SHA-256, timing-safe).
 *   2. Check the agent has scope for the requested provider.
 *   3. Resolve the upstream URL + auth headers from the provider spec.
 *   4. Forward method, body, and safe headers; inject credentials.
 *   5. Stream the upstream response back. Log an audit event.
 *
 * What the broker strips:
 *   - The incoming `Authorization` header (broker token, not for upstream).
 *   - Hop-by-hop headers (host, connection, content-length, etc.).
 *
 * What the agent never sees:
 *   - The upstream credential.
 *   - Other agents' tokens or scopes.
 */

import { Router, type Request, type Response } from 'express';

import logger from '../utils/logger.js';
import { authenticateBrokerToken, hasScope } from './capability-tokens.js';
import { getProvider, resolveUpstream } from './providers.js';
import { recordBrokerCall, recordBrokerDenied } from './audit-log.js';

const HOP_BY_HOP = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-length',
  'accept-encoding',
]);

function filterRequestHeaders(req: Request): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(req.headers)) {
    const lower = name.toLowerCase();
    if (HOP_BY_HOP.has(lower)) continue;
    if (lower === 'authorization') continue;
    if (lower.startsWith('x-broker-')) continue;
    if (Array.isArray(value)) {
      out[name] = value.join(', ');
    } else if (typeof value === 'string') {
      out[name] = value;
    }
  }
  return out;
}

function shouldHaveBody(method: string): boolean {
  const m = method.toUpperCase();
  return m !== 'GET' && m !== 'HEAD' && m !== 'OPTIONS';
}

function getCorrelationId(req: Request): string | undefined {
  const v = req.headers['x-correlation-id'];
  if (Array.isArray(v)) return v[0];
  return v;
}

function extractBearer(req: Request): string | undefined {
  const auth = req.headers['authorization'];
  if (!auth || Array.isArray(auth)) return undefined;
  const m = /^Bearer\s+(.+)$/i.exec(auth);
  return m ? m[1].trim() : undefined;
}

export const brokerRouter: Router = Router();

brokerRouter.all('/:providerId/*', async (req: Request, res: Response): Promise<void> => {
  const start = Date.now();
  const providerId = req.params.providerId;
  // Express 4: req.params[0] holds the wildcard remainder
  const wildcardParams = req.params as unknown as Record<string, string>;
  const subpath = wildcardParams[0] ?? '';
  const correlationId = getCorrelationId(req);

  const token = extractBearer(req);
  const identity = authenticateBrokerToken(token);
  if (!identity) {
    recordBrokerDenied('unauthenticated', { providerId, upstreamPath: subpath, correlationId });
    res.status(401).json({ error: 'broker_unauthenticated' });
    return;
  }

  if (!hasScope(identity, providerId)) {
    recordBrokerDenied('scope_denied', {
      agentId: identity.agentId,
      providerId,
      upstreamPath: subpath,
      correlationId,
    });
    res.status(403).json({ error: 'broker_scope_denied', provider: providerId });
    return;
  }

  const provider = getProvider(providerId);
  if (!provider) {
    recordBrokerDenied('unknown_provider', {
      agentId: identity.agentId,
      providerId,
      upstreamPath: subpath,
      correlationId,
    });
    res.status(404).json({ error: 'broker_unknown_provider', provider: providerId });
    return;
  }

  const upstream = resolveUpstream(
    provider,
    subpath,
    typeof req.originalUrl === 'string' && req.originalUrl.includes('?')
      ? req.originalUrl.slice(req.originalUrl.indexOf('?') + 1)
      : '',
  );
  if (!upstream) {
    recordBrokerDenied('credential_unavailable_or_path_blocked', {
      agentId: identity.agentId,
      providerId,
      upstreamPath: subpath,
      correlationId,
    });
    res.status(503).json({ error: 'broker_credential_unavailable', provider: providerId });
    return;
  }

  const headers: Record<string, string> = {
    ...filterRequestHeaders(req),
    ...upstream.headers,
  };
  if (correlationId) headers['x-correlation-id'] = correlationId;

  let bodyBuffer: Buffer | undefined;
  if (shouldHaveBody(req.method)) {
    // Express middleware may have already parsed the body. We tolerate both
    // raw buffers and parsed JSON/text.
    const b = (req as Request & { body?: unknown }).body;
    if (Buffer.isBuffer(b)) {
      bodyBuffer = b;
    } else if (typeof b === 'string') {
      bodyBuffer = Buffer.from(b, 'utf8');
    } else if (b !== undefined && b !== null && typeof b === 'object' && Object.keys(b).length > 0) {
      bodyBuffer = Buffer.from(JSON.stringify(b), 'utf8');
      if (!headers['content-type'] && !headers['Content-Type']) {
        headers['content-type'] = 'application/json';
      }
    }
  }

  const requestBytes = bodyBuffer?.length ?? 0;

  try {
    const upstreamRes = await fetch(upstream.url, {
      method: req.method,
      headers,
      body: bodyBuffer ? new Uint8Array(bodyBuffer) : undefined,
      signal: AbortSignal.timeout(60_000),
    });

    res.status(upstreamRes.status);
    upstreamRes.headers.forEach((value, name) => {
      const lower = name.toLowerCase();
      if (HOP_BY_HOP.has(lower)) return;
      res.setHeader(name, value);
    });

    const respBuf = Buffer.from(await upstreamRes.arrayBuffer());
    res.send(respBuf);

    recordBrokerCall({
      agentId: identity.agentId,
      providerId,
      method: req.method,
      upstreamPath: subpath,
      status: upstreamRes.status,
      durationMs: Date.now() - start,
      requestBytes,
      responseBytes: respBuf.length,
      correlationId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err: message, providerId, agentId: identity.agentId }, 'broker upstream failed');
    recordBrokerCall({
      agentId: identity.agentId,
      providerId,
      method: req.method,
      upstreamPath: subpath,
      status: 502,
      durationMs: Date.now() - start,
      requestBytes,
      responseBytes: 0,
      correlationId,
      error: message,
    });
    res.status(502).json({ error: 'broker_upstream_failed' });
  }
});

brokerRouter.get('/', (_req, res): void => {
  res.json({
    name: 'dws6 credential broker',
    usage: 'METHOD /api/v1/broker/:providerId/<upstream-path>  with Authorization: Bearer <token>',
  });
});
