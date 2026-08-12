/**
 * Reject registrations targeting RFC 2606 / RFC 6761 reserved domains
 * (example.com, *.test, *.invalid, *.localhost, etc.).
 *
 * Motivation: synthetic probes hit /api/v1/auth/register with addresses
 * like `smoke-<ts>@example.com`. The welcome email then enters SES, which
 * retries for 840 minutes before bouncing — wasting send quota and
 * polluting the deliverability reputation of onelifetime.world.
 */

const RESERVED_TLDS = new Set(['test', 'example', 'invalid', 'localhost', 'local']);

const RESERVED_DOMAINS = new Set([
  'example.com',
  'example.net',
  'example.org',
]);

export function isReservedEmailDomain(email: string): boolean {
  const at = email.lastIndexOf('@');
  if (at < 0) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  if (!domain) return false;

  if (RESERVED_DOMAINS.has(domain)) return true;

  const tld = domain.slice(domain.lastIndexOf('.') + 1);
  if (RESERVED_TLDS.has(tld)) return true;

  return false;
}
