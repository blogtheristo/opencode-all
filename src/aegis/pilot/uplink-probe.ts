// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/uplink-probe.ts
/**
 * Aegis Pilot — egress probe. "Egress must be attempted and shown to fail
 * before the run starts" (Store/PRODUCT_AEGIS_PILOT.md, isolation method).
 *
 * Each target gets a real TCP connect attempt. Outcomes are classified:
 *
 *   connected            path exists                          → NOT isolated
 *   refused              a RST came back — something answered → NOT isolated,
 *                        unless the target opts in with rejectCountsAsBlocked
 *                        (a firewall REJECT rule produces the same RST)
 *   unreachable/timeout/ no route, dropped, or name unresolvable → blocked
 *   dns-failure
 *
 * If an HTTP(S) proxy is configured in the environment, the proxy endpoint is
 * probed too: application traffic would leave through it, so a direct-path
 * block alone proves nothing while the proxy is reachable. A proxy on a
 * loopback address that refuses the connection is not running on this host:
 * the RST comes from the local kernel, not from a remote firewall, so there is
 * no path through it and it counts as blocked. A loopback proxy that accepts
 * the connection still counts as a path.
 */

import { connect } from 'node:net';

export interface ProbeTarget {
  host: string;
  port: number;
  label?: string;
  rejectCountsAsBlocked?: boolean;
}

export type ProbeOutcome =
  | 'connected'
  | 'refused'
  | 'unreachable'
  | 'timeout'
  | 'dns-failure'
  | 'error';

export interface ProbeResult {
  target: ProbeTarget;
  outcome: ProbeOutcome;
  blocked: boolean;
  code?: string;
  elapsedMs: number;
}

export interface UplinkProbeReport {
  at: string;
  isolated: boolean;
  results: ProbeResult[];
  /** Names of proxy variables present (values never recorded). */
  proxyEnv: string[];
}

export type Connector = (
  target: ProbeTarget,
  timeoutMs: number,
) => Promise<{ outcome: ProbeOutcome; code?: string }>;

// EPERM/EACCES: the local stack refused to send (host firewall) — a block, not a path.
const UNREACHABLE = new Set([
  'ENETUNREACH',
  'EHOSTUNREACH',
  'ENETDOWN',
  'EHOSTDOWN',
  'EADDRNOTAVAIL',
  'EPERM',
  'EACCES',
]);
const DNS = new Set(['ENOTFOUND', 'EAI_AGAIN', 'EAI_FAIL', 'EAI_NONAME']);

export const tcpConnector: Connector = (target, timeoutMs) =>
  new Promise((resolve) => {
    const socket = connect({ host: target.host, port: target.port });
    let settled = false;
    const done = (r: { outcome: ProbeOutcome; code?: string }) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(r);
    };
    socket.setTimeout(timeoutMs, () => done({ outcome: 'timeout' }));
    socket.once('connect', () => done({ outcome: 'connected' }));
    socket.once('error', (err: NodeJS.ErrnoException) => {
      const code = err.code ?? 'UNKNOWN';
      if (code === 'ECONNREFUSED') done({ outcome: 'refused', code });
      else if (UNREACHABLE.has(code)) done({ outcome: 'unreachable', code });
      else if (DNS.has(code)) done({ outcome: 'dns-failure', code });
      else if (code === 'ETIMEDOUT') done({ outcome: 'timeout', code });
      else done({ outcome: 'error', code });
    });
  });

const PROXY_VARS = [
  'HTTPS_PROXY',
  'https_proxy',
  'HTTP_PROXY',
  'http_proxy',
  'ALL_PROXY',
  'all_proxy',
];

function isLoopback(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, '').toLowerCase();
  return h === 'localhost' || h === '::1' || /^127(\.\d{1,3}){3}$/.test(h);
}

/** Proxy endpoints from the environment, as probe targets. */
export function proxyTargets(env: NodeJS.ProcessEnv = process.env): {
  names: string[];
  targets: ProbeTarget[];
} {
  const names: string[] = [];
  const targets: ProbeTarget[] = [];
  const seen = new Set<string>();
  for (const name of PROXY_VARS) {
    const value = env[name];
    if (!value) continue;
    names.push(name);
    try {
      const url = new URL(value);
      const port = Number(url.port) || (url.protocol === 'https:' ? 443 : 80);
      const key = `${url.hostname}:${port}`;
      if (!seen.has(key)) {
        seen.add(key);
        targets.push({
          host: url.hostname,
          port,
          label: `proxy (${name})`,
          ...(isLoopback(url.hostname) ? { rejectCountsAsBlocked: true } : {}),
        });
      }
    } catch {
      // unparseable proxy value: the name is still recorded
    }
  }
  return { names, targets };
}

export async function probeUplink(
  targets: ProbeTarget[],
  opts: {
    timeoutMs?: number;
    connector?: Connector;
    env?: NodeJS.ProcessEnv;
    now?: () => Date;
  } = {},
): Promise<UplinkProbeReport> {
  const timeoutMs = opts.timeoutMs ?? 3000;
  const connector = opts.connector ?? tcpConnector;
  const proxies = proxyTargets(opts.env ?? process.env);
  const all = [...targets, ...proxies.targets];
  const at = (opts.now ?? (() => new Date()))().toISOString();
  const results = await Promise.all(
    all.map(async (target): Promise<ProbeResult> => {
      const start = performance.now();
      const { outcome, code } = await connector(target, timeoutMs);
      const blocked =
        outcome === 'unreachable' ||
        outcome === 'timeout' ||
        outcome === 'dns-failure' ||
        (outcome === 'refused' && target.rejectCountsAsBlocked === true);
      return { target, outcome, blocked, code, elapsedMs: Math.round(performance.now() - start) };
    }),
  );
  return {
    at,
    isolated: results.length > 0 && results.every((r) => r.blocked),
    results,
    proxyEnv: proxies.names,
  };
}
