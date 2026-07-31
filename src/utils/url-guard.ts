/**
 * URL Guard — SSRF defense for Playwright browse tools
 *
 * Blocks navigation to private, loopback, link-local, cloud-metadata,
 * and other non-public IP ranges. Used by `src/utils/browser.ts` so any
 * caller of `dws_browse_*` (MCP) or `dws browse` (CLI) cannot pivot
 * through the browser to internal services.
 *
 * Threat model:
 *   - Untrusted MCP caller supplies http://169.254.169.254/latest/...
 *     (AWS instance metadata) → guard MUST reject.
 *   - Untrusted caller supplies http://10.0.0.5/admin (RFC1918) → reject.
 *   - Public URL redirects to http://localhost/ → guard MUST reject the
 *     redirect target via page.route (caller-side hostname check is not
 *     enough on its own).
 *
 * Residual risk (documented, NOT fully mitigated):
 *   - DNS rebinding: a hostname that resolves to a public IP at TTL=0
 *     and to a private IP a moment later. Playwright (Chromium) does
 *     its own resolution; pre-resolving in Node narrows the window but
 *     doesn't close it. Full mitigation requires per-request IP pinning
 *     and is out of scope for v1.
 *
 * Override:
 *   BROWSE_ALLOW_PRIVATE=1   — disables the guard entirely (dev only).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-claude/add-playwright-implementation-Rg5Jy (commit 6, SSRF)
 * Date: 2026-04-25
 */

import { isIP, isIPv4, isIPv6 } from 'node:net';
import { lookup } from 'node:dns/promises';

export class SsrfBlockedError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly reason: string,
  ) {
    // Include the reason code in the message so it's grep-able in logs and
    // assertable in tests without inspecting properties.
    super(`[${reason}] ${message}`);
    this.name = 'SsrfBlockedError';
  }
}

export function isPrivateOrUnsafeIp(addr: string): boolean {
  if (!isIP(addr)) return true; // unparseable → deny
  if (isIPv4(addr)) return isPrivateIPv4(addr);
  if (isIPv6(addr)) return isPrivateIPv6(addr);
  return true;
}

function isPrivateIPv4(addr: string): boolean {
  const parts = addr.split('.').map((n) => Number(n));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  // 0.0.0.0/8 — "this network"
  if (a === 0) return true;
  // 10.0.0.0/8 — RFC1918
  if (a === 10) return true;
  // 100.64.0.0/10 — CGNAT (RFC6598)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 127.0.0.0/8 — loopback
  if (a === 127) return true;
  // 169.254.0.0/16 — link-local incl. cloud metadata 169.254.169.254
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 — RFC1918
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.0.0.0/24 — IETF protocol assignments
  if (a === 192 && b === 0 && parts[2] === 0) return true;
  // 192.168.0.0/16 — RFC1918
  if (a === 192 && b === 168) return true;
  // 224.0.0.0/4 — multicast
  if (a >= 224 && a <= 239) return true;
  // 240.0.0.0/4 — reserved (incl. broadcast 255.255.255.255)
  if (a >= 240) return true;
  return false;
}

function isPrivateIPv6(addr: string): boolean {
  const lower = addr.toLowerCase();
  // Unspecified ::
  if (lower === '::' || lower === '::0') return true;
  // Loopback ::1
  if (lower === '::1') return true;
  // IPv4-mapped ::ffff:a.b.c.d → re-check as IPv4
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  // IPv4-mapped in pure-hex form ::ffff:HHHH:HHHH
  const hexMapped = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hexMapped) {
    const high = parseInt(hexMapped[1], 16);
    const low = parseInt(hexMapped[2], 16);
    const v4 = `${(high >> 8) & 0xff}.${high & 0xff}.${(low >> 8) & 0xff}.${low & 0xff}`;
    return isPrivateIPv4(v4);
  }
  // Link-local fe80::/10
  if (
    lower.startsWith('fe8') ||
    lower.startsWith('fe9') ||
    lower.startsWith('fea') ||
    lower.startsWith('feb')
  ) {
    return true;
  }
  // Unique local fc00::/7 (fc.. and fd..)
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
  // Multicast ff00::/8
  if (lower.startsWith('ff')) return true;
  return false;
}

/**
 * Throws SsrfBlockedError if the URL is not a public http(s) target.
 * Resolves the hostname via DNS unless it's already an IP literal.
 *
 * Honors BROWSE_ALLOW_PRIVATE=1 (dev only) — in that mode this still
 * validates the scheme but skips the IP check.
 */
export async function assertPublicUrl(url: string): Promise<void> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new SsrfBlockedError(`Invalid URL: ${url}`, url, 'invalid-url');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new SsrfBlockedError(
      `Only http(s) URLs are allowed, got: ${parsed.protocol}`,
      url,
      'bad-scheme',
    );
  }

  if (process.env.BROWSE_ALLOW_PRIVATE === '1') {
    return;
  }

  // URL.hostname leaves IPv6 wrapped in brackets in some Node versions;
  // strip them so isIP() / isPrivateOrUnsafeIp() recognise the literal.
  const hostname = parsed.hostname.replace(/^\[|\]$/g, '');
  if (!hostname) {
    throw new SsrfBlockedError(`URL has no hostname: ${url}`, url, 'no-host');
  }

  // Direct IP literal — check immediately, don't DNS-lookup an IP.
  if (isIP(hostname)) {
    if (isPrivateOrUnsafeIp(hostname)) {
      throw new SsrfBlockedError(
        `Refusing to browse to private/unsafe IP literal: ${hostname}`,
        url,
        'private-ip-literal',
      );
    }
    return;
  }

  // Block obvious local hostnames before paying DNS cost.
  const lowerHost = hostname.toLowerCase();
  if (
    lowerHost === 'localhost' ||
    lowerHost === 'localhost.localdomain' ||
    lowerHost.endsWith('.localhost') ||
    lowerHost.endsWith('.local') ||
    lowerHost.endsWith('.internal') ||
    lowerHost.endsWith('.intranet')
  ) {
    throw new SsrfBlockedError(
      `Refusing to browse to local hostname: ${hostname}`,
      url,
      'local-hostname',
    );
  }

  // Resolve and reject if ANY answer is private. This catches A/AAAA
  // records that legitimately resolve to internal IPs.
  let answers: Array<{ address: string; family: number }>;
  try {
    answers = await lookup(hostname, { all: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown';
    throw new SsrfBlockedError(
      `Cannot resolve hostname '${hostname}': ${msg}`,
      url,
      'unresolvable',
    );
  }

  for (const { address } of answers) {
    if (isPrivateOrUnsafeIp(address)) {
      throw new SsrfBlockedError(
        `Hostname '${hostname}' resolves to private/unsafe IP ${address}`,
        url,
        'private-resolved',
      );
    }
  }
}
